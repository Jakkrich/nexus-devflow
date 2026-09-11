import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  prepareUpdate,
  applyPreparedUpdate
} from "../lib/update.js";
import { updateThirdPartySkills } from "../lib/skill-manager.js";

test("prepareUpdate and applyPreparedUpdate preserve custom-vendor skills in .agents/skills and devflow/.vendor", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-vendor-protect-"));
  const templateRoot = path.join(tempDir, "template");
  const targetDir = path.join(tempDir, "target");

  // Setup mock template
  await fs.mkdir(path.join(templateRoot, "devflow"), { recursive: true });
  await fs.mkdir(path.join(templateRoot, ".agents", "skills", "core-skill"), { recursive: true });
  await fs.writeFile(path.join(templateRoot, "AGENTS.md"), "# AGENTS\n");
  await fs.writeFile(path.join(templateRoot, "CLAUDE.md"), "# CLAUDE\n");
  await fs.writeFile(path.join(templateRoot, "LICENSE"), "MIT\n");
  await fs.writeFile(
    path.join(templateRoot, ".agents", "skills", "core-skill", "SKILL.md"),
    "---\nname: core-skill\n---\n# Core Skill\n"
  );

  // Setup target with existing core installation + custom-vendor skill + .vendor directory
  await fs.mkdir(path.join(targetDir, "devflow", ".vendor", "custom-book-tool"), { recursive: true });
  await fs.mkdir(path.join(targetDir, ".agents", "skills", "custom-book-tool"), { recursive: true });
  await fs.mkdir(path.join(targetDir, ".claude", "skills", "custom-book-tool"), { recursive: true });
  await fs.mkdir(path.join(targetDir, ".nexus"), { recursive: true });

  const customSkillContent = "---\nname: custom-book-tool\norigin: custom-vendor\n---\n# Custom Tool\n";
  await fs.writeFile(
    path.join(targetDir, ".agents", "skills", "custom-book-tool", "SKILL.md"),
    customSkillContent
  );
  await fs.writeFile(
    path.join(targetDir, ".claude", "skills", "custom-book-tool", "SKILL.md"),
    customSkillContent
  );
  await fs.writeFile(
    path.join(targetDir, "devflow", ".vendor", "custom-book-tool", "README.md"),
    "# Custom Book Tool Source Code\n"
  );

  // Initial manifest with custom vendor recorded
  const manifest = {
    schemaVersion: 1,
    name: "nexus-devflow",
    package: "@jakkrichm/create-nexus-devflow",
    version: "2.14.0",
    adapters: ["claude", "codex"],
    thirdPartySkills: [
      {
        name: "custom-book-tool",
        source: "https://github.com/example/custom-book-tool",
        type: "compound-knowledge",
        referencePath: "devflow/.vendor/custom-book-tool",
        version: "1.0.0"
      }
    ],
    managedFiles: {
      "AGENTS.md": "some-old-hash"
    }
  };
  await fs.writeFile(
    path.join(targetDir, ".nexus", "nexus-devflow.json"),
    JSON.stringify(manifest, null, 2)
  );

  try {
    const prepared = await prepareUpdate({
      targetDir,
      templateRoot,
      version: "2.15.0",
      adapter: "both"
    });

    // Custom skills must NOT be flagged as orphaned
    for (const orphan of prepared.orphanedFiles) {
      assert.ok(!orphan.includes("custom-book-tool"), `Orphaned list should not contain custom skill: ${orphan}`);
      assert.ok(!orphan.includes(".vendor"), `Orphaned list should not contain .vendor path: ${orphan}`);
    }

    const applyResult = await applyPreparedUpdate(prepared, { replaceConflicts: true });
    assert.ok(applyResult.appliedCount >= 0);

    // Verify files still exist in target directory
    const agentSkillExists = await fs.readFile(
      path.join(targetDir, ".agents", "skills", "custom-book-tool", "SKILL.md"),
      "utf8"
    );
    assert.equal(agentSkillExists, customSkillContent);

    const vendorFileExists = await fs.readFile(
      path.join(targetDir, "devflow", ".vendor", "custom-book-tool", "README.md"),
      "utf8"
    );
    assert.equal(vendorFileExists, "# Custom Book Tool Source Code\n");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("updateThirdPartySkills recognizes 'all' as alias for '--all'", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-update-all-"));
  await fs.mkdir(path.join(tempDir, ".nexus"), { recursive: true });

  const manifest = {
    schemaVersion: 1,
    name: "nexus-devflow",
    thirdPartySkills: [
      {
        name: "my-skill",
        source: "https://github.com/example/my-skill",
        version: "1.0.0"
      }
    ]
  };
  await fs.writeFile(
    path.join(tempDir, ".nexus", "nexus-devflow.json"),
    JSON.stringify(manifest, null, 2)
  );

  try {
    // When third-party skills are installed, passing "all" should not look for a skill literally named "all"
    let threw = false;
    try {
      await updateThirdPartySkills(tempDir, "all");
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('Skill "all" is not installed')) {
        threw = true;
      }
    }
    assert.equal(threw, false, 'updateThirdPartySkills("all") should not throw Skill "all" not found');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
