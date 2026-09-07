import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  SkillRegistryEngine,
  type SkillRepositoryAdapter
} from "../lib/skill-registry-engine.js";

class InMemorySkillRepositoryAdapter implements SkillRepositoryAdapter {
  constructor(private readonly mockSkills: Record<string, Record<string, string>>) {}

  async fetchPackage(source: string, targetDir: string): Promise<void> {
    const files = this.mockSkills[source];
    if (!files) {
      throw new Error(`Mock repository source not found: ${source}`);
    }
    for (const [relPath, content] of Object.entries(files)) {
      const fullPath = path.join(targetDir, relPath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, "utf8");
    }
  }
}

describe("SkillRegistryEngine Seam & Lifecycle", () => {
  it("initializes and lists skills from a valid project root", async () => {
    const projectRoot = fsSync.existsSync(path.join(process.cwd(), "agent-bundle.manifest.json"))
      ? process.cwd()
      : path.resolve(process.cwd(), "../..");

    const engine = new SkillRegistryEngine(projectRoot);
    const list = await engine.list();
    assert.ok(list.totalCount > 0);
    assert.ok(list.coreSkills.length > 0);
    assert.ok(list.coreSkills.some((s) => s.name === "feature"));
  });

  it("installs a skill via in-memory repository adapter without git process", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-engine-test-"));
    try {
      await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
      await fs.mkdir(path.join(tempDir, ".claude", "skills"), { recursive: true });

      const mockAdapter = new InMemorySkillRepositoryAdapter({
        "https://github.com/example/fake-skill": {
          "SKILL.md": "---\nname: fake-skill\ndescription: Fake skill for testing\n---\n# Fake Skill\n",
          "scripts/helper.js": "console.log('hello');"
        }
      });

      const engine = new SkillRegistryEngine(tempDir, mockAdapter);
      const res = await engine.install({
        overrideSource: "https://github.com/example/fake-skill",
        name: "fake-skill"
      });

      assert.deepEqual(res.installedSkills, ["fake-skill"]);
      assert.equal(res.failedSkills.length, 0);

      const installedList = await engine.list();
      assert.ok(installedList.thirdPartySkills.some((s) => s.name === "fake-skill"));

      const agentSkillMd = await fs.readFile(
        path.join(tempDir, ".agents", "skills", "fake-skill", "SKILL.md"),
        "utf8"
      );
      assert.ok(agentSkillMd.includes("Fake skill for testing"));

      // Test remove
      const removeRes = await engine.remove("fake-skill");
      assert.equal(removeRes.removed, true);

      const afterRemove = await engine.list();
      assert.ok(!afterRemove.thirdPartySkills.some((s) => s.name === "fake-skill"));
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it("syncs skills across adapters bidirectionally", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-sync-test-"));
    try {
      const agentsSkillDir = path.join(tempDir, ".agents", "skills", "my-custom-skill");
      await fs.mkdir(agentsSkillDir, { recursive: true });
      await fs.writeFile(
        path.join(agentsSkillDir, "SKILL.md"),
        "---\nname: my-custom-skill\ndescription: Custom skill\n---\n# My Custom Skill\n",
        "utf8"
      );
      await fs.mkdir(path.join(tempDir, ".claude", "skills"), { recursive: true });

      const engine = new SkillRegistryEngine(tempDir);
      const syncRes = await engine.sync();
      assert.ok(syncRes.syncedCount >= 1);

      const claudeSkill = await fs.readFile(
        path.join(tempDir, ".claude", "skills", "my-custom-skill", "SKILL.md"),
        "utf8"
      );
      assert.ok(claudeSkill.includes("Custom skill"));
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });
});
