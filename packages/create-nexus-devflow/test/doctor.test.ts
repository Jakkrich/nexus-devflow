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
