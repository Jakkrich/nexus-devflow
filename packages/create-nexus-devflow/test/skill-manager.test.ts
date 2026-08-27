import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  findSkillSourceDirectory,
  installThirdPartySkill,
  listInstalledSkills,
  parseSkillFrontmatter,
  removeThirdPartySkill,
  syncSkills
} from "../lib/skill-manager.js";

test("parseSkillFrontmatter extracts name, description, and version", () => {
  const content = `---
name: custom-tool
description: A great custom tool for agents
version: 1.2.3
---
# Custom Tool
`;
  const parsed = parseSkillFrontmatter(content);
  assert.equal(parsed.name, "custom-tool");
  assert.equal(parsed.description, "A great custom tool for agents");
  assert.equal(parsed.version, "1.2.3");
});

test("findSkillSourceDirectory detects root SKILL.md or skills/<name>/SKILL.md", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-find-skill-"));

  try {
    // 1. Root SKILL.md
    const rootSkillDir = path.join(tempDir, "root-skill");
    await fs.mkdir(rootSkillDir, { recursive: true });
    await fs.writeFile(
      path.join(rootSkillDir, "SKILL.md"),
      `---\nname: my-root-skill\ndescription: test root\n---\n# Root\n`,
      "utf8"
    );

    const foundRoot = await findSkillSourceDirectory(rootSkillDir);
    assert.equal(foundRoot.skillName, "my-root-skill");

    // 2. Nested skills/foo/SKILL.md
    const repoDir = path.join(tempDir, "repo");
    const nestedSkillDir = path.join(repoDir, "skills", "awesome-diagram");
    await fs.mkdir(nestedSkillDir, { recursive: true });
    await fs.writeFile(
      path.join(nestedSkillDir, "SKILL.md"),
      `---\nname: awesome-diagram\ndescription: test nested\nversion: 2.0.0\n---\n# Diagram\n`,
      "utf8"
    );

    const foundNested = await findSkillSourceDirectory(repoDir);
    assert.equal(foundNested.skillName, "awesome-diagram");
    assert.equal(foundNested.meta.version, "2.0.0");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("installThirdPartySkill, listInstalledSkills, and removeThirdPartySkill lifecycle", async () => {
  const tempProject = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-skill-lifecycle-"));
  const tempSource = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-source-skill-"));

  try {
    // Scaffold dummy source skill with references and scripts
    const skillDir = path.join(tempSource, "skills", "sample-skill");
    const refDir = path.join(skillDir, "references");
    await fs.mkdir(refDir, { recursive: true });
    await fs.writeFile(
      path.join(skillDir, "SKILL.md"),
      `---\nname: sample-skill\ndescription: Sample third party skill\nversion: 1.5.0\n---\n# Sample\n`,
      "utf8"
    );
    await fs.writeFile(path.join(refDir, "guide.md"), "# Guide\nContent here", "utf8");

    // Initialize minimal project manifest
    const manifestDir = path.join(tempProject, ".nexus");
    await fs.mkdir(manifestDir, { recursive: true });
    await fs.writeFile(
      path.join(manifestDir, "nexus-devflow.json"),
      JSON.stringify({ schemaVersion: 1, name: "test", version: "1.0.0" }, null, 2),
      "utf8"
    );

    // Install third party skill
    const installed = await installThirdPartySkill(tempProject, tempSource);
    assert.equal(installed.name, "sample-skill");
    assert.equal(installed.category, "third-party");
    assert.equal(installed.version, "1.5.0");
    assert.equal(installed.synced, true);

    // Verify files copied to both adapters
    const agentsSkillMd = path.join(tempProject, ".agents", "skills", "sample-skill", "SKILL.md");
    const agentsRef = path.join(tempProject, ".agents", "skills", "sample-skill", "references", "guide.md");
    const claudeSkillMd = path.join(tempProject, ".claude", "skills", "sample-skill", "SKILL.md");
    const claudeRef = path.join(tempProject, ".claude", "skills", "sample-skill", "references", "guide.md");

    assert.equal(await fs.readFile(agentsSkillMd, "utf8"), await fs.readFile(claudeSkillMd, "utf8"));
    assert.equal(await fs.readFile(agentsRef, "utf8"), "# Guide\nContent here");
    assert.equal(await fs.readFile(claudeRef, "utf8"), "# Guide\nContent here");

    // List installed skills
    const listing = await listInstalledSkills(tempProject);
    assert.equal(listing.thirdPartySkills.length, 1);
    assert.equal(listing.thirdPartySkills[0].name, "sample-skill");
    assert.equal(listing.thirdPartySkills[0].synced, true);

    // Attempt removing a core skill should throw
    // (mocking core skills via agent-bundle manifest)
    await fs.writeFile(
      path.join(tempProject, "agent-bundle.manifest.json"),
      JSON.stringify({ core_skills: ["discovery", "feature"] }),
      "utf8"
    );
    await assert.rejects(
      async () => {
        await removeThirdPartySkill(tempProject, "discovery");
      },
      /Cannot remove Core Skill/
    );

    // Remove third party skill
    const removed = await removeThirdPartySkill(tempProject, "sample-skill");
    assert.equal(removed, true);

    const postListing = await listInstalledSkills(tempProject);
    assert.equal(postListing.thirdPartySkills.length, 0);

    const agentsSkillExists = await fs.lstat(path.join(tempProject, ".agents", "skills", "sample-skill")).then(() => true).catch(() => false);
    const claudeSkillExists = await fs.lstat(path.join(tempProject, ".claude", "skills", "sample-skill")).then(() => true).catch(() => false);
    assert.equal(agentsSkillExists, false);
    assert.equal(claudeSkillExists, false);
  } finally {
    await fs.rm(tempProject, { recursive: true, force: true });
    await fs.rm(tempSource, { recursive: true, force: true });
  }
});

test("syncSkills duplicates all skills from .agents to .claude", async () => {
  const tempProject = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-sync-"));

  try {
    const agentsSkillDir = path.join(tempProject, ".agents", "skills", "tool-a");
    await fs.mkdir(agentsSkillDir, { recursive: true });
    await fs.writeFile(path.join(agentsSkillDir, "SKILL.md"), "# Tool A", "utf8");

    const result = await syncSkills(tempProject);
    assert.equal(result.syncedCount, 1);
    assert.deepEqual(result.skills, ["tool-a"]);

    const claudeSkill = await fs.readFile(
      path.join(tempProject, ".claude", "skills", "tool-a", "SKILL.md"),
      "utf8"
    );
    assert.equal(claudeSkill, "# Tool A");
  } finally {
    await fs.rm(tempProject, { recursive: true, force: true });
  }
});
