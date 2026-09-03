import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseArgs } from "../bin/create-nexus-devflow.js";
import { parseProjectConfig } from "../lib/project-config.js";
import {
  DEV_ROLE_SKILLS,
  FULL_ROLE_SKILLS,
  SA_ROLE_SKILLS,
  getSkillsForRole
} from "../lib/skill-manager.js";
import { collectManagedTemplateFiles } from "../lib/update.js";

test("parseArgs parses role flags correctly", () => {
  assert.equal(parseArgs([]).role, "dev");
  assert.equal(parseArgs(["--role", "sa"]).role, "sa");
  assert.equal(parseArgs(["--role=sa"]).role, "sa");
  assert.equal(parseArgs(["--role", "full"]).role, "full");
  assert.equal(parseArgs(["--role=full"]).role, "full");
  assert.equal(parseArgs(["--role", "dev"]).role, "dev");
  assert.equal(parseArgs(["--role=dev"]).role, "dev");

  assert.throws(
    () => parseArgs(["--role", "invalid"]),
    /Invalid --role value "invalid"/
  );
  assert.throws(
    () => parseArgs(["--role=invalid"]),
    /Invalid --role value "invalid"/
  );
});

test("getSkillsForRole maps skills to role profiles accurately", () => {
  const saSkills = getSkillsForRole("sa");
  assert.ok(saSkills.includes("analyze"));
  assert.ok(saSkills.includes("overview"));
  assert.ok(saSkills.includes("discovery"));
  assert.ok(saSkills.includes("doctor"));
  assert.ok(!saSkills.includes("implement"));
  assert.ok(!saSkills.includes("check"));
  assert.ok(!saSkills.includes("complete"));

  const devSkills = getSkillsForRole("dev");
  assert.ok(devSkills.includes("implement"));
  assert.ok(devSkills.includes("check"));
  assert.ok(devSkills.includes("complete"));
  assert.ok(!devSkills.includes("analyze"));

  const fullSkills = getSkillsForRole("full");
  assert.ok(fullSkills.includes("analyze"));
  assert.ok(fullSkills.includes("implement"));
  assert.ok(fullSkills.includes("check"));
  assert.ok(fullSkills.includes("complete"));
  assert.equal(fullSkills.length, DEV_ROLE_SKILLS.length + 1);
});

test("parseProjectConfig validates and parses workflow.role correctly", () => {
  const defaults = parseProjectConfig({ schemaVersion: 1 });
  assert.equal(defaults.workflow.role, "dev");

  const saConfig = parseProjectConfig({
    schemaVersion: 1,
    workflow: { role: "sa" }
  });
  assert.equal(saConfig.workflow.role, "sa");

  const fullConfig = parseProjectConfig({
    schemaVersion: 1,
    workflow: { role: "full" }
  });
  assert.equal(fullConfig.workflow.role, "full");

  assert.throws(
    () => parseProjectConfig({ schemaVersion: 1, workflow: { role: "architect" } }),
    /workflow\.role must be one of: dev, sa, full/
  );
});

test("collectManagedTemplateFiles filters skills by role profile", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-role-template-"));

  try {
    const agentsSkillDir = path.join(tempDir, ".agents", "skills");
    await fs.mkdir(path.join(agentsSkillDir, "analyze"), { recursive: true });
    await fs.writeFile(path.join(agentsSkillDir, "analyze", "SKILL.md"), "---\nname: analyze\n---");
    await fs.mkdir(path.join(agentsSkillDir, "implement"), { recursive: true });
    await fs.writeFile(path.join(agentsSkillDir, "implement", "SKILL.md"), "---\nname: implement\n---");

    // SA role should include analyze, but exclude implement
    const saFiles = await collectManagedTemplateFiles(tempDir, ["antigravity"], "sa");
    const saPaths = [...saFiles.keys()];
    assert.ok(saPaths.includes(".agents/skills/analyze/SKILL.md"));
    assert.ok(!saPaths.includes(".agents/skills/implement/SKILL.md"));

    // Dev role should include implement, but exclude analyze
    const devFiles = await collectManagedTemplateFiles(tempDir, ["antigravity"], "dev");
    const devPaths = [...devFiles.keys()];
    assert.ok(devPaths.includes(".agents/skills/implement/SKILL.md"));
    assert.ok(!devPaths.includes(".agents/skills/analyze/SKILL.md"));

    // Full role should include both
    const fullFiles = await collectManagedTemplateFiles(tempDir, ["antigravity"], "full");
    const fullPaths = [...fullFiles.keys()];
    assert.ok(fullPaths.includes(".agents/skills/analyze/SKILL.md"));
    assert.ok(fullPaths.includes(".agents/skills/implement/SKILL.md"));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
