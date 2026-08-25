import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  findCoreSkillCountDrift,
  inspectAdapterSkillInventory,
  isBundledSkillPath,
  loadCoreSkillInventory,
  shouldIncludeTemplatePath
} from "../lib/core-skill-inventory.js";

async function writeManifest(coreSkills: unknown): Promise<{ directory: string; manifestPath: string }> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-core-skills-"));
  const manifestPath = path.join(directory, "agent-bundle.manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify({ core_skills: coreSkills }), "utf8");
  return { directory, manifestPath };
}

test("loadCoreSkillInventory preserves canonical order and classifies adapter paths", async () => {
  const fixture = await writeManifest(["feature", "report-html"]);
  try {
    const inventory = await loadCoreSkillInventory(fixture.manifestPath);

    assert.deepEqual(inventory.names, ["feature", "report-html"]);
    assert.equal(inventory.count, 2);
    assert.equal(isBundledSkillPath(".agents/skills/feature/SKILL.md", inventory), true);
    assert.equal(isBundledSkillPath(".claude\\skills\\report-html\\SKILL.md", inventory), true);
    assert.equal(isBundledSkillPath(".agents/skills/personal-tool/SKILL.md", inventory), false);
    assert.equal(isBundledSkillPath("README.md", inventory), false);
  } finally {
    await fs.rm(fixture.directory, { recursive: true, force: true });
  }
});

test("loadCoreSkillInventory rejects missing, duplicate, and unsafe skill names", async () => {
  const cases: Array<{ value: unknown; expected: RegExp }> = [
    { value: undefined, expected: /core_skills.*non-empty array/i },
    { value: ["feature", "feature"], expected: /duplicate.*feature/i },
    { value: ["../feature"], expected: /kebab-case.*\.\.\/feature/i },
    { value: ["Feature"], expected: /kebab-case.*Feature/i }
  ];

  for (const fixtureCase of cases) {
    const fixture = await writeManifest(fixtureCase.value);
    try {
      await assert.rejects(
        loadCoreSkillInventory(fixture.manifestPath),
        fixtureCase.expected
      );
    } finally {
      await fs.rm(fixture.directory, { recursive: true, force: true });
    }
  }
});

test("shouldIncludeTemplatePath excludes local skills without overriding the canonical inventory", async () => {
  const fixture = await writeManifest(["feature", "report-html", "sync-upstream"]);
  try {
    const inventory = await loadCoreSkillInventory(fixture.manifestPath);

    assert.equal(shouldIncludeTemplatePath(".agents", inventory), true);
    assert.equal(shouldIncludeTemplatePath(".agents/skills", inventory), true);
    assert.equal(shouldIncludeTemplatePath(".agents/config.json", inventory), true);
    assert.equal(shouldIncludeTemplatePath(".agents/skills/feature", inventory), true);
    assert.equal(shouldIncludeTemplatePath(".agents/skills/feature/SKILL.md", inventory), true);
    assert.equal(shouldIncludeTemplatePath(".claude\\skills\\report-html\\SKILL.md", inventory), true);
    assert.equal(shouldIncludeTemplatePath(".agents/skills/sync-upstream/SKILL.md", inventory), true);
    assert.equal(shouldIncludeTemplatePath(".claude/skills/sync-upstream/SKILL.md", inventory), true);
    assert.equal(shouldIncludeTemplatePath(".agents/skills/personal-tool", inventory), false);
    assert.equal(shouldIncludeTemplatePath(".claude/skills/personal-tool/SKILL.md", inventory), false);
    assert.equal(shouldIncludeTemplatePath("README.md", inventory), true);
  } finally {
    await fs.rm(fixture.directory, { recursive: true, force: true });
  }
});

test("inspectAdapterSkillInventory separates missing core skills from local extensions", async () => {
  const fixture = await writeManifest(["feature", "report-html"]);
  try {
    for (const adapter of [".agents", ".claude"]) {
      await fs.mkdir(path.join(fixture.directory, adapter, "skills", "feature"), { recursive: true });
      await fs.writeFile(
        path.join(fixture.directory, adapter, "skills", "feature", "SKILL.md"),
        "# feature\n",
        "utf8"
      );
    }
    await fs.mkdir(path.join(fixture.directory, ".agents", "skills", "report-html"), { recursive: true });
    await fs.writeFile(
      path.join(fixture.directory, ".agents", "skills", "report-html", "SKILL.md"),
      "# report-html\n",
      "utf8"
    );
    await fs.mkdir(path.join(fixture.directory, ".agents", "skills", "personal-tool"), { recursive: true });

    const inventory = await loadCoreSkillInventory(fixture.manifestPath);
    const inspection = await inspectAdapterSkillInventory(fixture.directory, inventory);

    assert.deepEqual(inspection[".agents"], {
      missingCore: [],
      localExtensions: ["personal-tool"]
    });
    assert.deepEqual(inspection[".claude"], {
      missingCore: ["report-html"],
      localExtensions: []
    });
  } finally {
    await fs.rm(fixture.directory, { recursive: true, force: true });
  }
});

test("findCoreSkillCountDrift reports wrong or missing public documentation counts", async () => {
  const fixture = await writeManifest(["feature", "report-html"]);
  try {
    await fs.writeFile(path.join(fixture.directory, "correct.md"), "Includes 2 Core Skills.\n", "utf8");
    await fs.writeFile(path.join(fixture.directory, "wrong.md"), "Includes 3 Workflow Skills.\n", "utf8");
    await fs.writeFile(path.join(fixture.directory, "missing.md"), "No inventory declared.\n", "utf8");

    const drift = await findCoreSkillCountDrift(
      fixture.directory,
      ["correct.md", "wrong.md", "missing.md"],
      2
    );

    assert.deepEqual(drift, [
      "wrong.md documents 3 skills; expected 2",
      "missing.md does not declare a Core/Workflow skill count"
    ]);
  } finally {
    await fs.rm(fixture.directory, { recursive: true, force: true });
  }
});
