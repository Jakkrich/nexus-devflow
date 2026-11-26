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

test("runDoctor reports execution_engine_pstack across auto, pstack, and native modes", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-doctor-pstack-"));

  try {
    await fs.mkdir(path.join(tempDir, "devflow"), { recursive: true });
    const fakePstackSkill = path.join(tempDir, "fake-pstack", "skills", "poteto-mode", "SKILL.md");
    await fs.mkdir(path.dirname(fakePstackSkill), { recursive: true });
    await fs.writeFile(fakePstackSkill, "---\nname: poteto-mode\n---\n", "utf8");

    // 1. auto + pstack present -> pass
    await fs.writeFile(
      path.join(tempDir, "devflow", "config.json"),
      JSON.stringify({ schemaVersion: 1, execution: { engine: "auto" } }),
      "utf8"
    );
    const autoDetected = await runDoctor(tempDir, { pstackProbePaths: [fakePstackSkill] });
    const checkAutoDetected = autoDetected.checks.find((c) => c.id === "execution_engine_pstack");
    assert.ok(checkAutoDetected);
    assert.equal(checkAutoDetected.status, "pass");
    assert.match(checkAutoDetected.message, /pstack detected/i);

    // 2. auto + pstack absent -> pass with native fallback
    const autoFallback = await runDoctor(tempDir, {
      pstackProbePaths: [path.join(tempDir, "missing", "SKILL.md")]
    });
    const checkAutoFallback = autoFallback.checks.find((c) => c.id === "execution_engine_pstack");
    assert.ok(checkAutoFallback);
    assert.equal(checkAutoFallback.status, "pass");
    assert.match(checkAutoFallback.message, /native/i);

    // 3. pstack + absent -> warn
    await fs.writeFile(
      path.join(tempDir, "devflow", "config.json"),
      JSON.stringify({ schemaVersion: 1, execution: { engine: "pstack" } }),
      "utf8"
    );
    const pstackMissing = await runDoctor(tempDir, {
      pstackProbePaths: [path.join(tempDir, "missing", "SKILL.md")]
    });
    const checkPstackMissing = pstackMissing.checks.find((c) => c.id === "execution_engine_pstack");
    assert.ok(checkPstackMissing);
    assert.equal(checkPstackMissing.status, "warn");

    // 4. native -> pass
    await fs.writeFile(
      path.join(tempDir, "devflow", "config.json"),
      JSON.stringify({ schemaVersion: 1, execution: { engine: "native" } }),
      "utf8"
    );
    const nativeOnly = await runDoctor(tempDir, { pstackProbePaths: [] });
    const checkNative = nativeOnly.checks.find((c) => c.id === "execution_engine_pstack");
    assert.ok(checkNative);
    assert.equal(checkNative.status, "pass");

    // 5. symlink poteto-mode SKILL.md is refused by lstat check
    const symlinkPath = path.join(tempDir, "symlink-poteto-skill.md");
    await fs.symlink(fakePstackSkill, symlinkPath);
    await fs.writeFile(
      path.join(tempDir, "devflow", "config.json"),
      JSON.stringify({ schemaVersion: 1, execution: { engine: "auto" } }),
      "utf8"
    );
    const symlinkBlocked = await runDoctor(tempDir, { pstackProbePaths: [symlinkPath] });
    const checkSymlink = symlinkBlocked.checks.find((c) => c.id === "execution_engine_pstack");
    assert.ok(checkSymlink);
    assert.equal(checkSymlink.status, "pass");
    assert.match(checkSymlink.message, /native/i);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
