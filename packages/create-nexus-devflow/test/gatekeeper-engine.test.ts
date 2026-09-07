import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { GatekeeperEngine } from "../lib/gatekeeper-engine.js";

async function setupDevFlowTestProject(dir: string): Promise<void> {
  await fs.mkdir(path.join(dir, "devflow", "context"), { recursive: true });
  await fs.mkdir(path.join(dir, ".agents", "skills"), { recursive: true });
  await fs.writeFile(path.join(dir, "AGENTS.md"), "# DevFlow Instructions\n", "utf8");
}

test("GatekeeperEngine: passes evaluation on clean idle workspace", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-engine-idle-"));

  try {
    await setupDevFlowTestProject(tempDir);
    const engine = new GatekeeperEngine(tempDir);

    const findings = await engine.getFindings();
    assert.equal(findings.total, 0);
    assert.equal(findings.blockers.length, 0);

    const report = await engine.evaluate();
    assert.equal(report.passed, true);
    assert.equal(report.exitCode, 0);
    assert.equal(report.findingsBlockers, 0);
    assert.equal(report.twoStage.stage1SpecFidelity, true);
    assert.equal(report.twoStage.stage2CodeQuality, true);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("GatekeeperEngine: evaluates Stage 1 (spec tasks) and Stage 2 (findings blockers)", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-engine-twostage-"));

  try {
    await setupDevFlowTestProject(tempDir);
    const taskDir = path.join(tempDir, "devflow", "context", "001-test");
    await fs.mkdir(taskDir, { recursive: true });
    await fs.writeFile(
      path.join(taskDir, "spec.md"),
      `# 📐 [001-test] Test Feature\n\n## 3. Implementation Checklist\n- [x] Task 1: Done\n- [ ] Task 2: Pending\n`
    );
    await fs.writeFile(
      path.join(taskDir, "findings.md"),
      `# Findings Ledger\n\n### BUG-001 [P1] open - Critical memory leak\n### PERF-001 [P2] open - Large bundle size\n`
    );

    const engine = new GatekeeperEngine(tempDir);
    const report = await engine.evaluate();

    assert.equal(report.passed, false);
    assert.equal(report.exitCode, 1);
    assert.equal(report.remainingTasks, 1);
    assert.equal(report.findingsBlockers, 1);
    assert.equal(report.twoStage.stage1SpecFidelity, false);
    assert.equal(report.twoStage.stage2CodeQuality, false);
    assert.ok(report.warnings.some((w) => w.includes("PERF-001")));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("GatekeeperEngine: reads and respects qualityGates policy from devflow/config.json", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-engine-policy-"));

  try {
    await setupDevFlowTestProject(tempDir);
    const taskDir = path.join(tempDir, "devflow", "context", "001-test");
    await fs.mkdir(taskDir, { recursive: true });
    await fs.writeFile(
      path.join(taskDir, "spec.md"),
      `# 📐 [001-test] Test Feature\n\n## 3. Implementation Checklist\n- [x] Task 1: Done\n\n## 5. Verification Evidence\n- *(จะถูกบันทึกเมื่อรัน /check)*\n`
    );

    // Write devflow/config.json with check gate = "always"
    await fs.writeFile(
      path.join(tempDir, "devflow", "config.json"),
      JSON.stringify({
        schemaVersion: 1,
        qualityGates: {
          regular: {
            check: "always"
          }
        }
      }, null, 2),
      "utf8"
    );

    const engine = new GatekeeperEngine(tempDir);
    const report = await engine.evaluate();

    // Because check gate policy is "always", unverified living spec fails gate check
    assert.equal(report.passed, false);
    assert.equal(report.exitCode, 1);
    assert.ok(report.violations.some((v) => v.includes("unverified")));

    // Runtime override strict: false allows passing if explicit
    const lenientReport = await engine.evaluate({ strict: false });
    assert.equal(lenientReport.passed, true);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("GatekeeperEngine: delegates getDrift and reconcile cleanly", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-engine-drift-"));

  try {
    await setupDevFlowTestProject(tempDir);
    const taskDir = path.join(tempDir, "devflow", "context", "001-test");
    await fs.mkdir(taskDir, { recursive: true });
    await fs.writeFile(
      path.join(taskDir, "spec.md"),
      `# 📐 [001-test] Test Feature\n\n## 2. Plan & Test Strategy\n- **Files to Modify/Create**:\n  - \`packages/lib/planned.ts\`\n\n## 3. Implementation Checklist\n- [x] Task 1: Done\n`
    );
    await fs.writeFile(
      path.join(taskDir, "stage.md"),
      "# Current Stage\n\n- Active Running ID: `001-test`\n- Track: `fast`\n- Current Stage: `implement`\n"
    );

    const engine = new GatekeeperEngine(tempDir);
    const drift = await engine.getDrift();
    assert.equal(drift.specFiles.length, 1);
    assert.ok(drift.specFiles.includes("packages/lib/planned.ts"));

    const reconcileResult = await engine.reconcile();
    assert.ok(reconcileResult);
    assert.equal(typeof reconcileResult.reconciled, "boolean");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

