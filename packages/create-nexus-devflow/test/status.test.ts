import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseArgs } from "../bin/create-nexus-devflow.js";
import { formatHumanStatus, readProjectStatus } from "../lib/status.js";

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
