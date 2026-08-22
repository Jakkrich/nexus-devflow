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
    const hasStage = await fs.lstat(path.join(tempDir, "devflow", "context", "current-stage.md")).then(() => true).catch(() => false);
    const hasFindings = await fs.lstat(path.join(tempDir, "devflow", "context", "findings.md")).then(() => true).catch(() => false);
    const hasIdeas = await fs.lstat(path.join(tempDir, "devflow", "ideas.md")).then(() => true).catch(() => false);
    const hasHistory = await fs.lstat(path.join(tempDir, "devflow", "history", "HISTORY.md")).then(() => true).catch(() => false);
    const hasProjectPlan = await fs.lstat(path.join(tempDir, "devflow", "project-plan.md")).then(() => true).catch(() => false);
    const hasBuildPlan = await fs.lstat(path.join(tempDir, "devflow", "build-plan.md")).then(() => true).catch(() => false);

    assert.equal(hasStage, true);
    assert.equal(hasFindings, true);
    assert.equal(hasIdeas, true);
    assert.equal(hasHistory, true);
    assert.equal(hasProjectPlan, true);
    assert.equal(hasBuildPlan, true);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
