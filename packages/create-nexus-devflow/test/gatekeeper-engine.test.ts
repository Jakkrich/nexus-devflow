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

    assert.ok(engine.context);
    const activeCtx = await engine.getActiveContext();
    assert.equal(activeCtx.state, "idle");

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

test("GatekeeperEngine: Prove-by-Run distinguishes unverified hypotheses from reproduced blockers and inspects evidence packets", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-engine-evidence-"));

  try {
    await setupDevFlowTestProject(tempDir);
    const taskDir = path.join(tempDir, "devflow", "context", "002-evidence");
    await fs.mkdir(taskDir, { recursive: true });
    await fs.writeFile(
      path.join(taskDir, "spec.md"),
      `# 📐 [002-evidence] Evidence Gate\n\n**Status:** verified\n\n## 3. Implementation Checklist\n- [x] Task 1: Done\n`,
      "utf8"
    );
    await fs.writeFile(
      path.join(taskDir, "stage.md"),
      "# Current Stage\n\n- Active Running ID: `002-evidence`\n- Track: `fast`\n- Current Stage: `check (Passed)`\n",
      "utf8"
    );
    await fs.writeFile(
      path.join(taskDir, "findings.md"),
      `# Findings Ledger\n\n### SEC-001 [P1] unverified - Hypothesis: unrun suspicion\n`,
      "utf8"
    );

    const engine = new GatekeeperEngine(tempDir);
    const missingEvidenceReport = await engine.evaluate({
      strict: false,
      requireEvidenceArtifacts: true
    });
    assert.equal(missingEvidenceReport.passed, false);
    assert.equal(missingEvidenceReport.findingsBlockers, 0);
    assert.equal(missingEvidenceReport.evidence.present, false);
    assert.ok(missingEvidenceReport.warnings.some((w) => w.includes("Unverified Hypothesis SEC-001 [P1]")));
    assert.ok(missingEvidenceReport.violations.some((v) => v.includes("missing_evidence_artifacts")));

    const reportDir = path.join(tempDir, "devflow", "reports", "002-evidence");
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(path.join(reportDir, "verify-layers.json"), "{\"passed\":true}", "utf8");

    const passingReport = await engine.evaluate({
      strict: false,
      requireEvidenceArtifacts: true
    });
    assert.equal(passingReport.passed, true);
    assert.equal(passingReport.findingsBlockers, 0);
    assert.equal(passingReport.evidence.present, true);
    assert.equal(passingReport.evidence.artifactCount, 1);

    const disallowUnverifiedReport = await engine.evaluate({
      strict: false,
      allowUnverified: false
    });
    assert.equal(disallowUnverifiedReport.passed, false);
    assert.ok(
      disallowUnverifiedReport.violations.some((v) => v.includes("Unverified Hypothesis SEC-001 [P1]"))
    );

    await fs.writeFile(
      path.join(taskDir, "findings.md"),
      `# Findings Ledger\n\n### SEC-002 [P1] open - Reproduced race condition\n`,
      "utf8"
    );
    const reproducedBlockerReport = await engine.evaluate({ strict: false });
    assert.equal(reproducedBlockerReport.passed, false);
    assert.equal(reproducedBlockerReport.findingsBlockers, 1);

    const noEvidenceEngine = new GatekeeperEngine(tempDir);
    const statusWithoutArtifacts = await noEvidenceEngine.evaluate({
      strict: true,
      status: {
        ...(await (await import("../lib/status.js")).readProjectStatus(tempDir)),
        completion: { state: "ready", blockers: [] },
        currentWork: {
          state: "active",
          type: "feature",
          title: "Missing Report Check",
          status: "verified",
          runId: "003-missing-reports",
          completed: 1,
          remaining: 0,
          total: 1,
          nextStep: null
        }
      }
    });
    assert.ok(
      statusWithoutArtifacts.warnings.some((w) => w.includes("missing_evidence_artifacts")),
      "strict mode with option-a-evidence-packet warns when verified run has no report artifacts"
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

