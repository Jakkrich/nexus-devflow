import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test, { type TestContext } from "node:test";
import { promisify } from "node:util";
import { parseArgs } from "../bin/create-nexus-devflow.js";
import { startDashboardServer } from "../lib/dashboard.js";
import { formatHumanStatus, readProjectStatus } from "../lib/status.js";
import { parseIdeasContent } from "../lib/ideas.js";

const execFileAsync = promisify(execFile);

test("parseArgs parses status and install command options correctly", () => {
  const options1 = parseArgs(["status"]);
  assert.equal(options1.command, "status");
  assert.equal(options1.json, false);

  const options2 = parseArgs(["status", "--json", "--target", "./test-app"]);
  assert.equal(options2.command, "status");
  assert.equal(options2.json, true);
  assert.equal(options2.target, "./test-app");

  const options3 = parseArgs(["install", "-y"]);
  assert.equal(options3.command, "install");
  assert.equal(options3.target, ".");
  assert.equal(options3.yes, true);

  const options4 = parseArgs(["install", "./custom-dir", "-y"]);
  assert.equal(options4.command, "install");
  assert.equal(options4.target, "./custom-dir");
  assert.equal(options4.yes, true);

  const optionsDashboard = parseArgs(["dashboard", "--no-open"]);
  assert.equal(optionsDashboard.command, "dashboard");
  assert.equal(optionsDashboard.open, false);
  assert.equal(optionsDashboard.deprecatedUi, false);

  const optionsUi = parseArgs(["ui"]);
  assert.equal(optionsUi.command, "dashboard");
  assert.equal(optionsUi.deprecatedUi, true);
});

test("readProjectStatus and formatHumanStatus work with Pure Multi-Run task context", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-status-3pillars-"));
  try {
    const taskDir = path.join(tempDir, "devflow", "context", "021-categorized-history-and-clean-living-spec-architecture");
    await fs.mkdir(taskDir, { recursive: true });
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# DevFlow Instructions");

    await fs.writeFile(
      path.join(taskDir, "findings.md"),
      `
# Findings Ledger
### QA-001 [P2] unverified - Minor UI layout shift
`
    );

    // Active spec in task workspace
    await fs.writeFile(
      path.join(taskDir, "spec.md"),
      `
# Feature: 021-categorized-history-and-clean-living-spec-architecture
**Status:** In Progress
**Running ID:** \`021-categorized-history-and-clean-living-spec-architecture\`

## Implementation Steps
- [x] Step 1: Initial setup
- [ ] Step 2: Implement core logic
`
    );

    const status = await readProjectStatus(tempDir);
    assert.equal(status.schemaVersion, 1);
    assert.equal(status.currentWork.state, "active");
    assert.equal(status.currentWork.completed, 1);
    assert.equal(status.currentWork.total, 2);
    assert.equal(status.currentWork.remaining, 1);
    assert.equal(status.findings.total, 1);

    const humanOutput = formatHumanStatus(status, { color: false });
    assert.ok(humanOutput.includes("Nexus-DevFlow Status"));
    assert.ok(humanOutput.includes("021-categorized-history"));
    assert.ok(humanOutput.includes("1/2 complete"));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("readProjectStatus returns idle on clean workspace without active tasks", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-status-idle-"));
  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# DevFlow Instructions");

    const status = await readProjectStatus(tempDir);
    assert.equal(status.currentWork.state, "idle");
    assert.equal(status.currentWork.completed, 0);
    assert.equal(status.currentWork.total, 0);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("parseIdeasContent parses pending and archived ideas correctly", () => {
  const sampleMarkdown = `# 💡 DevFlow Idea Inbox & Backlog

## 📌 Pending Ideas

### [IDEA-001] Test Idea One
- **บันทึกเมื่อ**: 2026-08-20
- **ไอเดียตั้งต้น**: Test detail
- **AI Feasibility & Tech**: High Feasibility
- **สถานะ**: Pending

---

### [IDEA-002] Test Idea Two
- **บันทึกเมื่อ**: 2026-08-21
- **สถานะ**: Pending

---

## 📦 Archived / Shipped Ideas

### [IDEA-000] Shipped Idea
- **สถานะ**: Claimed
`;

  const ideas = parseIdeasContent(sampleMarkdown);

  assert.equal(ideas.totalPending, 2);
  assert.equal(ideas.totalArchived, 1);
  assert.equal(ideas.pending[0].id, "IDEA-001");
  assert.equal(ideas.pending[0].title, "Test Idea One");
  assert.equal(ideas.pending[0].feasibility, "High Feasibility");
  assert.equal(ideas.pending[1].id, "IDEA-002");
});

test("parseArgs parses idea, findings, doctor, and archive subcommands correctly", () => {
  const ideaAdd = parseArgs(["idea", "add", "My new idea", "--title", "Custom Title"]);
  assert.equal(ideaAdd.command, "idea");
  assert.equal(ideaAdd.subcommandAction, "add");
  assert.equal(ideaAdd.subcommandArg, "My new idea");
  assert.equal(ideaAdd.ideaTitle, "Custom Title");

  const ideasList = parseArgs(["ideas", "list", "--json"]);
  assert.equal(ideasList.command, "ideas");
  assert.equal(ideasList.subcommandAction, "list");
  assert.equal(ideasList.json, true);

  const findingsBlockers = parseArgs(["findings", "--blockers"]);
  assert.equal(findingsBlockers.command, "findings");
  assert.equal(findingsBlockers.blockersOnly, true);

  const findingsResolve = parseArgs(["findings", "resolve", "BUG-123", "--status", "accepted"]);
  assert.equal(findingsResolve.command, "findings");
  assert.equal(findingsResolve.subcommandAction, "resolve");
  assert.equal(findingsResolve.subcommandArg, "BUG-123");
  assert.equal(findingsResolve.findingStatus, "accepted");

  const doctorFix = parseArgs(["doctor", "--fix"]);
  assert.equal(doctorFix.command, "doctor");
  assert.equal(doctorFix.fix, true);

  const archiveStats = parseArgs(["archive", "stats"]);
  assert.equal(archiveStats.command, "archive");
  assert.equal(archiveStats.subcommandAction, "stats");
  assert.equal(archiveStats.statsOnly, true);

  const checkGateStrict = parseArgs(["check-gate", "--strict", "--json"]);
  assert.equal(checkGateStrict.command, "check-gate");
  assert.equal(checkGateStrict.strict, true);
  assert.equal(checkGateStrict.json, true);

  const hookInstall = parseArgs(["hook", "install", "pre-push"]);
  assert.equal(hookInstall.command, "hook");
  assert.equal(hookInstall.subcommandAction, "install");
  assert.equal(hookInstall.hookType, "pre-push");

  const findingsAdd = parseArgs([
    "findings",
    "add",
    "Hardcoded API Key",
    "--severity",
    "P0",
    "--location",
    "src/config.ts:10",
    "--id",
    "SEC-001"
  ]);
  assert.equal(findingsAdd.command, "findings");
  assert.equal(findingsAdd.subcommandAction, "add");
  assert.equal(findingsAdd.subcommandArg, "Hardcoded API Key");
  assert.equal(findingsAdd.findingSeverity, "P0");
  assert.equal(findingsAdd.findingLocation, "src/config.ts:10");
  assert.equal(findingsAdd.findingId, "SEC-001");

  const hookUninstall = parseArgs(["hook", "uninstall"]);
  assert.equal(hookUninstall.command, "hook");
  assert.equal(hookUninstall.subcommandAction, "uninstall");

  const skillAddRec = parseArgs(["skill", "add", "--recommended"]);
  assert.equal(skillAddRec.command, "skill");
  assert.equal(skillAddRec.subcommandAction, "add");
  assert.equal(skillAddRec.recommended, true);

  const skillUpdateRec = parseArgs(["skill", "update", "--recommended"]);
  assert.equal(skillUpdateRec.command, "skill");
  assert.equal(skillUpdateRec.subcommandAction, "update");
  assert.equal(skillUpdateRec.recommended, true);
});

test("readProjectStatus prioritizes current-stage.md Root Switch and calculates nextAction", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-status-switch-"));
  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context", "040-dashboard-parity"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# DevFlow Instructions");

    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "current-stage.md"),
      `# Current Stage
- Active Running ID: 040-dashboard-parity
- Track: feature
- Current Stage: check (Ready for /complete)
- Next Action: /complete 040-dashboard-parity
`
    );

    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "040-dashboard-parity", "spec.md"),
      `# [040-dashboard-parity] Feature: Dashboard Parity
**Status:** Ready
`
    );

    const status = await readProjectStatus(tempDir);
    assert.equal(status.nextAction.command, "/complete 040-dashboard-parity");
    assert.equal(status.currentWork.type, "feature");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("readProjectStatus auto-detects active fast-track spec from task workspace", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-status-autodetect-"));
  try {
    const taskDir = path.join(tempDir, "devflow", "context", "041-test-feature");
    await fs.mkdir(taskDir, { recursive: true });
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# DevFlow Instructions");

    await fs.writeFile(
      path.join(taskDir, "stage.md"),
      `# Current Stage
- Active Running ID: 041-test-feature
- Track: fast
- Current Stage: implement
`
    );

    await fs.writeFile(
      path.join(taskDir, "spec.md"),
      `# Feature: 041-test-feature
- [ ] Task 1
- [ ] Task 2
`
    );

    const status = await readProjectStatus(tempDir);
    assert.equal(status.currentWork.state, "active");
    assert.match(status.nextAction.command || "", /^\/implement/);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("readProjectStatus identifies multi-run active spec queue in devflow/context/{xxx-slug}/", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-status-multirun-"));
  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context", "012-core"), { recursive: true });
    await fs.mkdir(path.join(tempDir, "devflow", "context", "013-kanban"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# DevFlow Instructions");

    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "012-core", "spec.md"),
      "# 📐 [012-core] Core Module\n\n## 3. Implementation Checklist\n- [x] Step 1\n- [ ] Step 2\n"
    );
    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "013-kanban", "spec.md"),
      "# 📐 [013-kanban] Kanban UI\n\n## 3. Implementation Checklist\n- [ ] Step 1\n"
    );

    const status = await readProjectStatus(tempDir);
    assert.equal(status.activeRuns.length, 2);
    assert.equal(status.activeRuns[0].runId, "012-core");
    assert.equal(status.activeRuns[1].runId, "013-kanban");

    const human = formatHumanStatus(status, { color: false });
    assert.ok(human.includes("Spec Queue"));
    assert.ok(human.includes("2 active"));
    assert.ok(human.includes("012-core, 013-kanban"));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("readProjectStatus propagates review verdict and freshness into the completion gate and dashboard API", async (t) => {
  const fixture = await createReviewedProject(t, "001-reviewed-status");

  const status = await readProjectStatus(fixture.root);
  assert.equal(status.review.state, "passed");
  assert.equal(status.review.verdict, "passed");
  assert.equal(status.review.checkResult, "passed");
  assert.equal(status.review.freshness, "current");
  assert.deepEqual(status.review.warnings, []);
  assert.equal(status.completion.state, "ready");

  const human = formatHumanStatus(status, { color: false });
  assert.match(human, /Review\s+passed, verdict passed, check passed, freshness current/);

  const server = await startDashboardServer(fixture.root, {
    snapshotOptions: { fetchImpl: async () => { throw new Error("offline"); } }
  });
  t.after(async () => server.close());

  const dashboardResponse = await fetch(`${server.url}/api/dashboard`);
  assert.equal(dashboardResponse.status, 200);
  const dashboard = await dashboardResponse.json() as {
    status: { review: { verdict: string; freshness: string } };
  };
  assert.equal(dashboard.status.review.verdict, "passed");
  assert.equal(dashboard.status.review.freshness, "current");

  const pageResponse = await fetch(`${server.url}/`);
  const page = await pageResponse.text();
  assert.match(page, /id="review-verdict"/);
  assert.match(page, /status\.review/);

  await fs.appendFile(fixture.specPath, "\n- drift after review\n", "utf8");
  const staleStatus = await readProjectStatus(fixture.root);
  assert.equal(staleStatus.review.freshness, "stale");
  assert.equal(staleStatus.completion.state, "blocked");
  assert.ok(staleStatus.completion.blockers.includes("independent review receipt is stale"));
});

test("readProjectStatus associates an independent review summary with every active run", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-status-run-reviews-"));
  t.after(async () => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, ".agents", "skills"), { recursive: true });
  await fs.writeFile(path.join(root, "AGENTS.md"), "# DevFlow Instructions\n", "utf8");

  const runs = [
    { id: "011-changes", state: "changes-requested" as const, check: "failed" as const },
    { id: "012-passed", state: "passed" as const, check: "passed" as const }
  ];
  for (const run of runs) {
    const runDir = path.join(root, "devflow", "context", run.id);
    const spec = `# [${run.id}] Review association\n\n- [x] Complete\n`;
    await fs.mkdir(runDir, { recursive: true });
    await fs.writeFile(path.join(runDir, "spec.md"), spec, "utf8");
    await fs.writeFile(path.join(runDir, "findings.md"), "# Findings\n", "utf8");
    await fs.writeFile(
      path.join(runDir, "review.md"),
      reviewRecord(run.state, run.check, "a".repeat(40), "b".repeat(40), createHash("sha256").update(spec).digest("hex")),
      "utf8"
    );
  }

  const status = await readProjectStatus(root);
  assert.equal(status.activeRuns.length, 2);
  assert.equal(status.activeRuns[0]?.review.state, "changes-requested");
  assert.equal(status.activeRuns[0]?.review.verdict, "changes-requested");
  assert.equal(status.activeRuns[0]?.review.checkResult, "failed");
  assert.equal(status.activeRuns[1]?.review.state, "passed");
  assert.equal(status.activeRuns[1]?.review.verdict, "passed");
});

async function createReviewedProject(
  t: TestContext,
  runId: string
): Promise<{ root: string; specPath: string }> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-status-reviewed-"));
  t.after(async () => fs.rm(root, { recursive: true, force: true }));
  const runDir = path.join(root, "devflow", "context", runId);
  const specPath = path.join(runDir, "spec.md");
  const spec = `# [${runId}] Reviewed status\n\n**Status:** Ready\n\n- [x] Complete\n`;

  await fs.mkdir(path.join(root, ".agents", "skills"), { recursive: true });
  await fs.mkdir(runDir, { recursive: true });
  await fs.writeFile(path.join(root, "AGENTS.md"), "# DevFlow Instructions\n", "utf8");
  await fs.writeFile(
    path.join(root, "devflow", "config.json"),
    JSON.stringify({ schemaVersion: 1, qualityGates: { regular: { independentReview: "always" } } }),
    "utf8"
  );

  await runGit(root, ["init", "-b", "main"]);
  await runGit(root, ["config", "user.name", "DevFlow Test"]);
  await runGit(root, ["config", "user.email", "test@nexus-devflow.local"]);
  await runGit(root, ["add", "."]);
  await runGit(root, ["commit", "-m", "chore: initialize project"]);
  const base = await runGit(root, ["rev-parse", "HEAD"]);

  await runGit(root, ["checkout", "-b", `feature/${runId}`]);
  await fs.writeFile(specPath, spec, "utf8");
  await fs.writeFile(path.join(runDir, "findings.md"), "# Findings\n", "utf8");
  await fs.writeFile(
    path.join(runDir, "stage.md"),
    `# Current Stage\n- Active Running ID: ${runId}\n- Track: fast\n- Current Stage: check (Passed - Ready for /complete)\n- Next Action: /complete ${runId}\n`,
    "utf8"
  );
  await runGit(root, ["add", "."]);
  await runGit(root, ["commit", "-m", "feat: add reviewed work"]);
  const target = await runGit(root, ["rev-parse", "HEAD"]);
  const specHash = createHash("sha256").update(spec).digest("hex");
  await fs.writeFile(
    path.join(runDir, "review.md"),
    reviewRecord("passed", "passed", target, base, specHash),
    "utf8"
  );

  return { root, specPath };
}

function reviewRecord(
  state: "changes-requested" | "passed",
  checkResult: "failed" | "passed",
  target: string,
  base: string,
  specHash: string
): string {
  return `# Independent Review

**Status:** ${state}
**Target commit:** ${target}
**Base commit:** ${base}
**Base ref:** main
**Spec hash:** ${specHash}
**Prepared by:** codex
**Builder model:** builder-model
**Requested reviewer:** claude
**Requested model:** claude-opus
**Requested at:** 2026-09-01T00:00:00.000Z
**Workflow:** regular
**Check required:** yes
**Reviewer adapter:** claude
**Reviewer model:** claude-opus
**Reviewer context:** fresh session
**Reviewed at:** 2026-09-01T00:10:00.000Z
**Scope:** current
**Lenses:** quality, security, performance, tests
**Verdict:** ${state}
**Check result:** ${checkResult}

## Commands
Command evidence.

## Evidence
Review evidence.

## Findings
Finding evidence.

## Remaining risk
No remaining risk.
`;
}

async function runGit(root: string, args: string[]): Promise<string> {
  const result = await execFileAsync("git", ["-C", root, ...args], { encoding: "utf8" });
  return result.stdout.trim();
}
