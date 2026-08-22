import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseArgs } from "../bin/create-nexus-devflow.js";
import { formatHumanStatus, readProjectStatus } from "../lib/status.js";
import { parseIdeasContent } from "../lib/ideas.js";

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

test("readProjectStatus and formatHumanStatus work with 3-Pillars context/current-feature.md", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-status-3pillars-"));
  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# DevFlow Instructions");

    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "findings.md"),
      `
# Findings Ledger
### QA-001 [P2] unverified - Minor UI layout shift
`
    );

    // Active spec directly in devflow/context/current-feature.md
    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "current-feature.md"),
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

test("readProjectStatus returns idle when current-feature.md contains reset stub", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-status-idle-"));
  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# DevFlow Instructions");

    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "current-feature.md"),
      `# Current Feature

_Nothing in progress. Run /feature, /fix, or /rollback to start._`
    );

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
});

