import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { evaluateGate, formatGateReport } from "../lib/gatekeeper.js";

async function setupDevFlowTestProject(dir: string): Promise<void> {
  await fs.mkdir(path.join(dir, "devflow", "context"), { recursive: true });
  await fs.mkdir(path.join(dir, ".agents", "skills"), { recursive: true });
  await fs.writeFile(path.join(dir, "AGENTS.md"), "# DevFlow Instructions\n", "utf8");
}

test("evaluateGate passes on clean idle workspace", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-gate-idle-"));

  try {
    await setupDevFlowTestProject(tempDir);
    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "current-feature.md"),
      `# Current Feature\n\n_Nothing in progress. Run /feature, /fix, or /rollback to start._\n`
    );

    const report = await evaluateGate(tempDir);
    assert.equal(report.passed, true);
    assert.equal(report.exitCode, 0);
    assert.equal(report.violations.length, 0);

    const text = formatGateReport(report);
    assert.match(text, /DevFlow Quality Gate PASSED/);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("evaluateGate blocks on active P0/P1 findings blocker", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-gate-blocker-"));

  try {
    await setupDevFlowTestProject(tempDir);
    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "current-feature.md"),
      `# Current Feature\n\n_Nothing in progress. Run /feature, /fix, or /rollback to start._\n`
    );
    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "findings.md"),
      `# Findings Ledger\n\n### SEC-001 [P0] open - Hardcoded Secret Key in config\n`
    );

    const report = await evaluateGate(tempDir);
    assert.equal(report.passed, false);
    assert.equal(report.exitCode, 1);
    assert.equal(report.findingsBlockers, 1);
    assert.match(report.violations[0], /Finding SEC-001 \[P0\] \(open\)/);

    const text = formatGateReport(report);
    assert.match(text, /DevFlow Quality Gate BLOCKED/);
    assert.match(text, /SEC-001/);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("evaluateGate blocks in strict mode when living spec needs verification", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-gate-strict-"));

  try {
    await setupDevFlowTestProject(tempDir);
    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "current-feature.md"),
      `# 📐 [001-test] Test Feature\n\n## 3. Implementation Checklist\n- [x] Task 1: Done\n\n## 5. Verification Evidence\n- *(จะถูกบันทึกเมื่อรัน /check)*\n`
    );

    // Standard mode: passes because all checklist tasks are checked
    const standardReport = await evaluateGate(tempDir, { strict: false });
    assert.equal(standardReport.passed, true);

    // Strict mode: blocks because needs_verification
    const strictReport = await evaluateGate(tempDir, { strict: true });
    assert.equal(strictReport.passed, false);
    assert.equal(strictReport.exitCode, 1);
    assert.match(strictReport.violations[0], /unverified/);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
