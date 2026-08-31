import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  findSkillSourceDirectory,
  installRecommendedSkills,
  installThirdPartySkill,
  listInstalledSkills,
  parseSkillFrontmatter,
  RECOMMENDED_THIRD_PARTY_SKILLS,
  removeThirdPartySkill,
  syncSkills,
  updateRecommendedSkills,
  updateThirdPartySkills
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
    assert.ok(!Array.isArray(installed));
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

test("nested multi-skill discovery and batch installation (--name and --all)", async () => {
  const tempProject = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-multiskill-project-"));
  const tempSource = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-multiskill-source-"));

  try {
    // Scaffold nested multi-skill repo like 9arm-skills
    const debugDir = path.join(tempSource, "skills", "engineering", "debug-mantra");
    const postmortemDir = path.join(tempSource, "skills", "engineering", "post-mortem");
    const talkDir = path.join(tempSource, "skills", "productivity", "management-talk");

    await fs.mkdir(debugDir, { recursive: true });
    await fs.mkdir(postmortemDir, { recursive: true });
    await fs.mkdir(talkDir, { recursive: true });

    await fs.writeFile(
      path.join(debugDir, "SKILL.md"),
      `---\nname: debug-mantra\ndescription: Debugging discipline\nversion: 1.0.0\n---\n# Debug Mantra\n`,
      "utf8"
    );
    await fs.writeFile(
      path.join(postmortemDir, "SKILL.md"),
      `---\nname: post-mortem\ndescription: Post-mortem RCA\nversion: 1.1.0\n---\n# Post-mortem\n`,
      "utf8"
    );
    await fs.writeFile(
      path.join(talkDir, "SKILL.md"),
      `---\nname: management-talk\ndescription: Leadership translation\nversion: 1.2.0\n---\n# Management Talk\n`,
      "utf8"
    );

    // Initialize minimal project manifest
    const manifestDir = path.join(tempProject, ".nexus");
    await fs.mkdir(manifestDir, { recursive: true });
    await fs.writeFile(
      path.join(manifestDir, "nexus-devflow.json"),
      JSON.stringify({ schemaVersion: 1, name: "test", version: "1.0.0" }, null, 2),
      "utf8"
    );

    // 1. Calling findSkillSourceDirectory without name on multi-skill source should throw listing available skills
    await assert.rejects(
      async () => {
        await findSkillSourceDirectory(tempSource);
      },
      /Multiple skills found in source/
    );

    // 2. Install specific skill with name
    const singleInstalled = (await installThirdPartySkill(tempProject, tempSource, {
      name: "debug-mantra"
    })) as import("../lib/skill-manager.js").SkillDetail;

    assert.equal(singleInstalled.name, "debug-mantra");
    assert.equal(singleInstalled.version, "1.0.0");
    assert.equal(
      await fs.readFile(path.join(tempProject, ".agents", "skills", "debug-mantra", "SKILL.md"), "utf8"),
      `---\nname: debug-mantra\ndescription: Debugging discipline\nversion: 1.0.0\n---\n# Debug Mantra\n`
    );

    // 3. Install all skills with all: true
    const allInstalled = (await installThirdPartySkill(tempProject, tempSource, {
      all: true
    })) as import("../lib/skill-manager.js").SkillDetail[];

    assert.equal(allInstalled.length, 3);
    const installedNames = allInstalled.map((s) => s.name).sort();
    assert.deepEqual(installedNames, ["debug-mantra", "management-talk", "post-mortem"]);

    // Verify all files copied to .agents and .claude
    for (const name of installedNames) {
      assert.equal(
        await fs.lstat(path.join(tempProject, ".agents", "skills", name, "SKILL.md")).then(() => true).catch(() => false),
        true
      );
      assert.equal(
        await fs.lstat(path.join(tempProject, ".claude", "skills", name, "SKILL.md")).then(() => true).catch(() => false),
        true
      );
    }

    // Verify manifest was updated with all third-party skills
    const listing = await listInstalledSkills(tempProject);
    assert.equal(listing.thirdPartySkills.length, 3);
  } finally {
    await fs.rm(tempProject, { recursive: true, force: true });
    await fs.rm(tempSource, { recursive: true, force: true });
  }
});

test("updateThirdPartySkills updates installed third-party skills from original sources", async () => {
  const tempProject = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-update-proj-"));
  const tempSource = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-update-src-"));

  try {
    const debugDir = path.join(tempSource, "skills", "engineering", "debug-mantra");
    await fs.mkdir(debugDir, { recursive: true });
    await fs.writeFile(
      path.join(debugDir, "SKILL.md"),
      `---\nname: debug-mantra\ndescription: Debugging v1\nversion: 1.0.0\n---\n# Debug Mantra\n`,
      "utf8"
    );

    // Initialize manifest
    const manifestDir = path.join(tempProject, ".nexus");
    await fs.mkdir(manifestDir, { recursive: true });
    await fs.writeFile(
      path.join(manifestDir, "nexus-devflow.json"),
      JSON.stringify({ schemaVersion: 1, name: "test", version: "1.0.0" }, null, 2),
      "utf8"
    );

    // 1. Initial install
    await installThirdPartySkill(tempProject, tempSource, { name: "debug-mantra" });
    let listing = await listInstalledSkills(tempProject);
    assert.equal(listing.thirdPartySkills[0].version, "1.0.0");
    assert.equal(listing.thirdPartySkills[0].description, "Debugging v1");

    // 2. Source gets updated with v2
    await fs.writeFile(
      path.join(debugDir, "SKILL.md"),
      `---\nname: debug-mantra\ndescription: Debugging v2 updated\nversion: 2.0.0\n---\n# Debug Mantra v2\n`,
      "utf8"
    );

    // 3. Run updateThirdPartySkills for specific skill
    const updateResult = await updateThirdPartySkills(tempProject, "debug-mantra");
    assert.equal(updateResult.totalUpdated, 1);
    assert.equal(updateResult.failedSkills.length, 0);
    assert.equal(updateResult.updatedSkills[0].version, "2.0.0");
    assert.equal(updateResult.updatedSkills[0].description, "Debugging v2 updated");

    // Verify manifest has updated info
    listing = await listInstalledSkills(tempProject);
    assert.equal(listing.thirdPartySkills[0].version, "2.0.0");
    assert.equal(listing.thirdPartySkills[0].description, "Debugging v2 updated");

    // Verify file content in .agents and .claude
    assert.match(
      await fs.readFile(path.join(tempProject, ".agents", "skills", "debug-mantra", "SKILL.md"), "utf8"),
      /Debugging v2 updated/
    );
    assert.match(
      await fs.readFile(path.join(tempProject, ".claude", "skills", "debug-mantra", "SKILL.md"), "utf8"),
      /Debugging v2 updated/
    );

    // 4. Test updating all
    const updateAllResult = await updateThirdPartySkills(tempProject);
    assert.equal(updateAllResult.totalUpdated, 1);
    assert.equal(updateAllResult.failedSkills.length, 0);
  } finally {
    await fs.rm(tempProject, { recursive: true, force: true });
    await fs.rm(tempSource, { recursive: true, force: true });
  }
});

test("RECOMMENDED_THIRD_PARTY_SKILLS defines archify, diagram-design, and 9arm-skills", () => {
  assert.ok(Array.isArray(RECOMMENDED_THIRD_PARTY_SKILLS));
  assert.equal(RECOMMENDED_THIRD_PARTY_SKILLS.length, 3);

  const sources = RECOMMENDED_THIRD_PARTY_SKILLS.map((p) => p.source);
  assert.ok(sources.some((s) => s.includes("archify")));
  assert.ok(sources.some((s) => s.includes("diagram-design")));
  assert.ok(sources.some((s) => s.includes("9arm-skills")));

  const nineArm = RECOMMENDED_THIRD_PARTY_SKILLS.find((p) => p.source.includes("9arm-skills"));
  assert.equal(nineArm?.all, true);
});

test("installRecommendedSkills and updateRecommendedSkills batch-install and refresh preset skills", async () => {
  const tempProject = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-rec-project-"));
  const tempSourceA = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-rec-source-a-"));
  const tempSourceB = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-rec-source-b-"));

  try {
    // 1. Scaffold source A (single skill)
    await fs.writeFile(
      path.join(tempSourceA, "SKILL.md"),
      `---\nname: skill-alpha\ndescription: Alpha skill\nversion: 1.0.0\n---\n# Alpha\n`,
      "utf8"
    );

    // 2. Scaffold source B (multi-skill repo)
    const betaDir = path.join(tempSourceB, "skills", "skill-beta");
    const gammaDir = path.join(tempSourceB, "skills", "skill-gamma");
    await fs.mkdir(betaDir, { recursive: true });
    await fs.mkdir(gammaDir, { recursive: true });

    await fs.writeFile(
      path.join(betaDir, "SKILL.md"),
      `---\nname: skill-beta\ndescription: Beta skill\nversion: 1.0.0\n---\n# Beta\n`,
      "utf8"
    );
    await fs.writeFile(
      path.join(gammaDir, "SKILL.md"),
      `---\nname: skill-gamma\ndescription: Gamma skill\nversion: 1.0.0\n---\n# Gamma\n`,
      "utf8"
    );

    // Custom preset pointing to local directories for offline deterministic testing
    const customPresets = [
      { source: tempSourceA, description: "Alpha" },
      { source: tempSourceB, all: true, description: "Beta and Gamma" }
    ];

    // Install recommended skills
    const installed = await installRecommendedSkills(tempProject, {
      presets: customPresets
    });

    assert.equal(installed.length, 3);
    const names = installed.map((s) => s.name).sort();
    assert.deepEqual(names, ["skill-alpha", "skill-beta", "skill-gamma"]);

    // Verify all 3 skills are synced across .agents and .claude
    for (const name of names) {
      assert.equal(
        await fs.lstat(path.join(tempProject, ".agents", "skills", name, "SKILL.md")).then(() => true).catch(() => false),
        true
      );
      assert.equal(
        await fs.lstat(path.join(tempProject, ".claude", "skills", name, "SKILL.md")).then(() => true).catch(() => false),
        true
      );
    }

    // Verify manifest
    const listing = await listInstalledSkills(tempProject);
    assert.equal(listing.thirdPartySkills.length, 3);

    // 3. Update source A with new version
    await fs.writeFile(
      path.join(tempSourceA, "SKILL.md"),
      `---\nname: skill-alpha\ndescription: Alpha skill updated\nversion: 2.0.0\n---\n# Alpha v2\n`,
      "utf8"
    );

    // Run updateRecommendedSkills
    const updateResult = await updateRecommendedSkills(tempProject, {
      presets: customPresets
    });

    assert.equal(updateResult.totalUpdated, 3);
    assert.equal(updateResult.failedSkills.length, 0);

    const alphaUpdated = updateResult.updatedSkills.find((s) => s.name === "skill-alpha");
    assert.equal(alphaUpdated?.version, "2.0.0");
    assert.equal(alphaUpdated?.description, "Alpha skill updated");

    // Verify file content updated
    assert.match(
      await fs.readFile(path.join(tempProject, ".agents", "skills", "skill-alpha", "SKILL.md"), "utf8"),
      /Alpha skill updated/
    );
  } finally {
    await fs.rm(tempProject, { recursive: true, force: true });
    await fs.rm(tempSourceA, { recursive: true, force: true });
    await fs.rm(tempSourceB, { recursive: true, force: true });
  }
});


