import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { formatDoctorHuman, runDoctor } from "../lib/doctor.js";

test("runDoctor reports failures on empty directory and repairs with fix: true", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-doctor-"));

  try {
    // Initial run on clean directory
    const initialReport = await runDoctor(tempDir);
    assert.equal(initialReport.isDevFlowProject, false);
    assert.ok(initialReport.warnCount > 0 || initialReport.failCount > 0);

    const humanOutput = formatDoctorHuman(initialReport);
    assert.match(humanOutput, /Nexus-DevFlow Doctor Health Report/);

    // Run with fix: true
    const fixedReport = await runDoctor(tempDir, { fix: true });
    assert.ok(fixedReport.fixedCount > 0);

    // Verify created files
    const hasOverview = await fs.lstat(path.join(tempDir, "devflow", "context", "project-overview.md")).then(() => true).catch(() => false);
    const hasStandards = await fs.lstat(path.join(tempDir, "devflow", "context", "coding-standards.md")).then(() => true).catch(() => false);
    const hasAiRules = await fs.lstat(path.join(tempDir, "devflow", "context", "ai-interaction.md")).then(() => true).catch(() => false);
    const hasGlossary = await fs.lstat(path.join(tempDir, "devflow", "context", "glossary.md")).then(() => true).catch(() => false);
    const hasIdeas = await fs.lstat(path.join(tempDir, "devflow", "ideas.md")).then(() => true).catch(() => false);
    const hasHistory = await fs.lstat(path.join(tempDir, "devflow", "history", "HISTORY.md")).then(() => true).catch(() => false);
    const hasProjectPlan = await fs.lstat(path.join(tempDir, "devflow", "project-plan.md")).then(() => true).catch(() => false);
    const hasBuildPlan = await fs.lstat(path.join(tempDir, "devflow", "build-plan.md")).then(() => true).catch(() => false);

    assert.equal(hasOverview, true);
    assert.equal(hasStandards, true);
    assert.equal(hasAiRules, true);
    assert.equal(hasGlossary, true);
    assert.equal(hasIdeas, true);
    assert.equal(hasHistory, true);
    assert.equal(hasProjectPlan, true);
    assert.equal(hasBuildPlan, true);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});


test("runDoctor reports verification_driver_skill status for absent, complete, incomplete, and symlinked verify skills", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-doctor-verify-"));

  try {
    await fs.mkdir(path.join(tempDir, "devflow"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# Test\n", "utf8");

    const absentReport = await runDoctor(tempDir);
    const absentCheck = absentReport.checks.find((c) => c.id === "verification_driver_skill");
    assert.ok(absentCheck);
    assert.equal(absentCheck.status, "pass");
    assert.match(absentCheck.message, /onboard/i);

    const verifySkillPath = path.join(tempDir, ".agents", "skills", "verify", "SKILL.md");
    await fs.mkdir(path.dirname(verifySkillPath), { recursive: true });
    await fs.writeFile(verifySkillPath, "# verify\n\n## Launch\n\n## Drive\n", "utf8");

    const incompleteReport = await runDoctor(tempDir);
    const incompleteCheck = incompleteReport.checks.find((c) => c.id === "verification_driver_skill");
    assert.ok(incompleteCheck);
    assert.equal(incompleteCheck.status, "warn");
    assert.match(incompleteCheck.message, /Cleanup/i);

    await fs.writeFile(
      verifySkillPath,
      "# verify\n\n## Launch\n\n## Doctor\n\n## Drive\n\n## Evidence\n\n## Cleanup\n",
      "utf8"
    );
    const readyReport = await runDoctor(tempDir);
    const readyCheck = readyReport.checks.find((c) => c.id === "verification_driver_skill");
    assert.ok(readyCheck);
    assert.equal(readyCheck.status, "pass");
    assert.match(readyCheck.message, /\.agents\/skills\/verify\/SKILL\.md/);

    // Symlinked SKILL.md and symlinked .agents/skills dir must report warn
    const outsideVerify = path.join(tempDir, "outside-verify.md");
    await fs.writeFile(outsideVerify, "## Launch\n## Doctor\n## Drive\n## Evidence\n## Cleanup\n", "utf8");
    await fs.rm(verifySkillPath);
    await fs.symlink(outsideVerify, verifySkillPath);

    const symlinkSkillReport = await runDoctor(tempDir);
    const symlinkSkillCheck = symlinkSkillReport.checks.find((c) => c.id === "verification_driver_skill");
    assert.ok(symlinkSkillCheck);
    assert.equal(symlinkSkillCheck.status, "warn");
    assert.match(symlinkSkillCheck.message, /symbolic link/i);

    await fs.rm(path.join(tempDir, ".agents", "skills"), { recursive: true, force: true });
    const outsideSkillsDir = path.join(tempDir, "outside-skills");
    await fs.mkdir(path.join(outsideSkillsDir, "verify"), { recursive: true });
    await fs.writeFile(
      path.join(outsideSkillsDir, "verify", "SKILL.md"),
      "## Launch\n## Doctor\n## Drive\n## Evidence\n## Cleanup\n",
      "utf8"
    );
    await fs.symlink(outsideSkillsDir, path.join(tempDir, ".agents", "skills"), "junction");

    const symlinkDirReport = await runDoctor(tempDir);
    const symlinkDirCheck = symlinkDirReport.checks.find((c) => c.id === "verification_driver_skill");
    assert.ok(symlinkDirCheck);
    assert.equal(symlinkDirCheck.status, "warn");
    assert.match(symlinkDirCheck.message, /symbolic link/i);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("runDoctor warns on onboarding_state when AGENTS.md contains onboarding marker", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-doctor-onboard-"));
  try {
    await fs.mkdir(path.join(tempDir, "devflow"), { recursive: true });
    await fs.writeFile(
      path.join(tempDir, "AGENTS.md"),
      "# Project\n<!-- devflow:onboarding-required -->\n",
      "utf8"
    );
    const pendingReport = await runDoctor(tempDir);
    const pendingCheck = pendingReport.checks.find((c) => c.id === "onboarding_state");
    assert.ok(pendingCheck);
    assert.equal(pendingCheck.status, "warn");

    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# Project\n", "utf8");
    const doneReport = await runDoctor(tempDir);
    const doneCheck = doneReport.checks.find((c) => c.id === "onboarding_state");
    assert.ok(doneCheck);
    assert.equal(doneCheck.status, "pass");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

