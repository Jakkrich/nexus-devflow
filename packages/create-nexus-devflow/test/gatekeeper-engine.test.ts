import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { GatekeeperEngine } from "../lib/gatekeeper-engine.js";

const execFileAsync = promisify(execFile);

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

test("GatekeeperEngine: resolves Multi-Run slug and evidence when spec.md omits **Running ID:**", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-engine-multirun-strict-"));
  try {
    await setupDevFlowTestProject(tempDir);
    await execFileAsync("git", ["init", "-b", "main"], { cwd: tempDir });
    await execFileAsync("git", ["config", "user.name", "DevFlow Test"], { cwd: tempDir });
    await execFileAsync("git", ["config", "user.email", "test@nexus-devflow.local"], { cwd: tempDir });
    await execFileAsync("git", ["add", "."], { cwd: tempDir });
    await execFileAsync("git", ["commit", "-m", "chore: init"], { cwd: tempDir });
    await execFileAsync("git", ["checkout", "-b", "feature/001-notes-tag"], { cwd: tempDir });
    await fs.writeFile(
      path.join(tempDir, "devflow", "config.json"),
      JSON.stringify({
        schemaVersion: 1,
        qualityGates: { regular: { check: "always", independentReview: "when-sensitive" } }
      }),
      "utf8"
    );
    const taskDir = path.join(tempDir, "devflow", "context", "001-notes-tag");
    await fs.mkdir(taskDir, { recursive: true });
    await fs.writeFile(
      path.join(taskDir, "spec.md"),
      "# Feature: [001-notes-tag] Filter notes\n\n> **Status**: verified\n\n## 3. Implementation Checklist\n- [x] Done\n",
      "utf8"
    );
    const reportDir = path.join(tempDir, "devflow", "reports", "001-notes-tag");
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(path.join(reportDir, "verify-layers.json"), "{\"passed\":true}", "utf8");

    const engine = new GatekeeperEngine(tempDir);
    const report = await engine.evaluate({ strict: true });
    assert.equal(report.passed, true);
    assert.equal(report.exitCode, 0);
    assert.equal(report.evidence.runId, "001-notes-tag");
    assert.equal(report.evidence.present, true);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("GatekeeperEngine: fails strict and default checks when active spec is malformed", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-engine-malformed-"));
  try {
    await setupDevFlowTestProject(tempDir);
    const taskDir = path.join(tempDir, "devflow", "context", "001-broken");
    await fs.mkdir(taskDir, { recursive: true });
    await fs.writeFile(
      path.join(taskDir, "spec.md"),
      "**Status:** verified\n\nMissing markdown title heading.\n",
      "utf8"
    );

    const engine = new GatekeeperEngine(tempDir);
    const defaultReport = await engine.evaluate({ strict: false });
    assert.equal(defaultReport.passed, false);
    assert.equal(defaultReport.exitCode, 1);
    assert.equal(defaultReport.twoStage.stage1SpecFidelity, false);
    assert.ok(defaultReport.violations.some((v) => /malformed/i.test(v)));

    const strictReport = await engine.evaluate({ strict: true });
    assert.equal(strictReport.passed, false);
    assert.equal(strictReport.exitCode, 1);
    assert.equal(strictReport.twoStage.stage1SpecFidelity, false);
    assert.ok(strictReport.violations.some((v) => /malformed/i.test(v)));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

