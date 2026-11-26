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

  it("recognizes ponytail as compound-knowledge alias and installs into devflow/.vendor/ponytail", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-ponytail-test-"));
    try {
      await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
      await fs.mkdir(path.join(tempDir, ".claude", "skills"), { recursive: true });

      const mockAdapter = new InMemorySkillRepositoryAdapter({
        "https://github.com/DietrichGebert/ponytail": {
          "package.json": JSON.stringify({ name: "@dietrichgebert/ponytail", version: "4.9.0" }),
          "README.md": "# Ponytail",
          "skills/ponytail/SKILL.md": "---\nname: ponytail\ndescription: Lazy senior dev mode\n---\n# Ponytail\n",
          "examples/debounce.md": "# Debounce example",
          "benchmarks/agentic/README.md": "# Benchmarks"
        }
      });

      const engine = new SkillRegistryEngine(tempDir, mockAdapter);
      const res = await engine.install("ponytail");

      assert.deepEqual(res.installedSkills, ["ponytail"]);
      assert.equal(res.failedSkills.length, 0);

      const vendorSkills = path.join(tempDir, "devflow", ".vendor", "ponytail", "skills", "ponytail", "SKILL.md");
      assert.ok(fsSync.existsSync(vendorSkills), "vendor skills should exist");

      const vendorExamples = path.join(tempDir, "devflow", ".vendor", "ponytail", "examples", "debounce.md");
      assert.ok(fsSync.existsSync(vendorExamples), "vendor examples should exist");

      const vendorBenchmarks = path.join(tempDir, "devflow", ".vendor", "ponytail", "benchmarks", "agentic", "README.md");
      assert.ok(fsSync.existsSync(vendorBenchmarks), "vendor benchmarks should exist");

      const agentSkill = path.join(tempDir, ".agents", "skills", "ponytail", "SKILL.md");
      assert.ok(fsSync.existsSync(agentSkill), "master wrapper skill should exist");

      const claudeSkill = path.join(tempDir, ".claude", "skills", "ponytail", "SKILL.md");
      assert.ok(fsSync.existsSync(claudeSkill), "claude skill should exist");

      const manifestRaw = await fs.readFile(path.join(tempDir, ".nexus", "nexus-devflow.json"), "utf8");
      const manifest = JSON.parse(manifestRaw);
      const entry = manifest.thirdPartySkills.find((s: { name: string }) => s.name === "ponytail");
      assert.ok(entry, "manifest must contain ponytail");
      assert.equal(entry.type, "compound-knowledge");
      assert.equal(entry.referencePath, "devflow/.vendor/ponytail");
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it("resolves KNOWN_SKILL_ALIASES['browser-tests'] subpath via InMemorySkillRepositoryAdapter", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-extras-alias-"));
    try {
      await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
      await fs.mkdir(path.join(tempDir, ".claude", "skills"), { recursive: true });

      const mockAdapter = new InMemorySkillRepositoryAdapter({
        "https://github.com/Jakkrich/nexus-devflow": {
          "extras/skills/setup-tests/SKILL.md": "---\nname: setup-tests\ndescription: Setup tests\n---\n# Setup Tests\n",
          "extras/skills/setup-tests/reference/browser.md": "# Browser Reference\n",
          ".agents/skills/unrelated/SKILL.md": "---\nname: unrelated\ndescription: Unrelated\n---\n# Unrelated\n"
        }
      });

      const engine = new SkillRegistryEngine(tempDir, mockAdapter);
      const res = await engine.install("browser-tests");

      assert.deepEqual(res.installedSkills, ["setup-tests"]);
      assert.equal(res.failedSkills.length, 0);

      for (const adapter of [".agents", ".claude"]) {
        assert.ok(fsSync.existsSync(path.join(tempDir, adapter, "skills", "setup-tests", "SKILL.md")));
        assert.ok(fsSync.existsSync(path.join(tempDir, adapter, "skills", "setup-tests", "reference", "browser.md")));
        assert.equal(fsSync.existsSync(path.join(tempDir, adapter, "skills", "unrelated")), false);
      }

      const manifest = JSON.parse(await fs.readFile(path.join(tempDir, ".nexus", "nexus-devflow.json"), "utf8"));
      const entry = manifest.thirdPartySkills.find((s: { name: string }) => s.name === "setup-tests");
      assert.ok(entry);
      assert.equal(entry.source, "https://github.com/Jakkrich/nexus-devflow");
      assert.equal(entry.type, "git");
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it("AC-1: classifies Core Skills and single-adapter sync accurately without agent-bundle.manifest.json", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-single-adapter-core-"));
    try {
      // Single-adapter .agents project (e.g. --codex / --antigravity / --copilot / --opencode) without agent-bundle.manifest.json
      await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });
      await fs.mkdir(path.join(tempDir, "devflow", "history", "features"), { recursive: true });
      await fs.mkdir(path.join(tempDir, "devflow", "history", "fixes"), { recursive: true });
      await fs.mkdir(path.join(tempDir, "devflow", "history", "rollbacks"), { recursive: true });
      await fs.mkdir(path.join(tempDir, "devflow", "reference"), { recursive: true });
      await fs.mkdir(path.join(tempDir, "devflow", "discoveries"), { recursive: true });
      for (const rel of [
        "devflow/context/project-overview.md",
        "devflow/context/coding-standards.md",
        "devflow/context/ai-interaction.md",
        "devflow/context/glossary.md",
        "devflow/project-plan.md",
        "devflow/build-plan.md",
        "devflow/ideas.md",
        "devflow/history/HISTORY.md"
      ]) {
        await fs.writeFile(path.join(tempDir, rel), "# stub\n", "utf8");
      }
      await fs.writeFile(
        path.join(tempDir, "AGENTS.md"),
        "# Test\n\n## Proportional engineering\n\nBuild for established requirements, not hypothetical scale.\n",
        "utf8"
      );
      await fs.mkdir(path.join(tempDir, ".nexus"), { recursive: true });
      await fs.writeFile(
        path.join(tempDir, ".nexus", "nexus-devflow.json"),
        JSON.stringify({ schemaVersion: 1, version: "2.21.0", adapters: ["codex"] }, null, 2),
        "utf8"
      );

      for (const skill of ["feature", "devflow-mode", "devflow-help"]) {
        const skillDir = path.join(tempDir, ".agents", "skills", skill);
        await fs.mkdir(skillDir, { recursive: true });
        await fs.writeFile(
          path.join(skillDir, "SKILL.md"),
          `---\nname: ${skill}\ndescription: ${skill}\n---\n# ${skill}\n`,
          "utf8"
        );
      }

      const engine = new SkillRegistryEngine(tempDir);
      const listing = await engine.list();
      assert.equal(listing.coreSkills.length, 3);
      assert.equal(listing.thirdPartySkills.length, 0);
      assert.ok(listing.coreSkills.every((s) => s.synced === true));

      await assert.rejects(() => engine.remove("feature"), /Cannot remove Core Skill/);

      const { runDoctor } = await import("../lib/doctor.js");
      const doc = await runDoctor(tempDir, { pstackProbePaths: [] });
      assert.equal(doc.failCount, 0);
      assert.equal(doc.warnCount, 0);
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it("AC-1: treats third-party skills as synced on single-.claude install and flags desync only when both roots exist", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-claude-only-sync-"));
    try {
      await fs.mkdir(path.join(tempDir, "devflow"), { recursive: true });
      await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# Test\n", "utf8");
      await fs.mkdir(path.join(tempDir, ".nexus"), { recursive: true });
      await fs.writeFile(
        path.join(tempDir, ".nexus", "nexus-devflow.json"),
        JSON.stringify({
          schemaVersion: 1,
          version: "2.21.0",
          adapters: ["claude"],
          thirdPartySkills: [
            { name: "sample-ext", source: "local", installedAt: new Date().toISOString() }
          ]
        }, null, 2),
        "utf8"
      );
      const claudeSkillDir = path.join(tempDir, ".claude", "skills", "sample-ext");
      await fs.mkdir(claudeSkillDir, { recursive: true });
      await fs.writeFile(
        path.join(claudeSkillDir, "SKILL.md"),
        "---\nname: sample-ext\ndescription: sample\n---\n# sample\n",
        "utf8"
      );

      const engine = new SkillRegistryEngine(tempDir);
      const singleListing = await engine.list();
      const singleExt = singleListing.thirdPartySkills.find((s) => s.name === "sample-ext");
      assert.ok(singleExt);
      assert.equal(singleExt.synced, true);

      const { runDoctor } = await import("../lib/doctor.js");
      const cleanDoc = await runDoctor(tempDir, { pstackProbePaths: [] });
      const cleanCheck = cleanDoc.checks.find((c) => c.id === "third_party_skills");
      assert.ok(cleanCheck);
      assert.equal(cleanCheck.status, "pass");

      // Now add empty .agents/skills root so both adapters exist -> desync must trigger warn
      await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
      const dualListing = await engine.list();
      const dualExt = dualListing.thirdPartySkills.find((s) => s.name === "sample-ext");
      assert.ok(dualExt);
      assert.equal(dualExt.synced, false);

      const desyncDoc = await runDoctor(tempDir, { pstackProbePaths: [] });
      const desyncCheck = desyncDoc.checks.find((c) => c.id === "third_party_skills");
      assert.ok(desyncCheck);
      assert.equal(desyncCheck.status, "warn");
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });
});
