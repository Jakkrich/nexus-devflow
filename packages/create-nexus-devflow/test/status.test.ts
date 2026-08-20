import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseArgs } from "../bin/create-nexus-devflow.js";
import { formatHumanStatus, readProjectStatus } from "../lib/status.js";

test("parseArgs parses status command and options", () => {
  const options1 = parseArgs(["status"]);
  assert.equal(options1.command, "status");
  assert.equal(options1.json, false);

  const options2 = parseArgs(["status", "--json", "--target", "./test-app"]);
  assert.equal(options2.command, "status");
  assert.equal(options2.json, true);
  assert.equal(options2.target, "./test-app");
});

test("readProjectStatus and formatHumanStatus work in a valid DevFlow project", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-status-full-"));
  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });
    await fs.mkdir(path.join(tempDir, "devflow", "runs", "RUN-001-example"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# DevFlow Instructions");

    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "findings.md"),
      `
# Findings Ledger
### QA-001 [P2] unverified - Minor UI layout shift
`
    );

    await fs.writeFile(
      path.join(tempDir, "devflow", "runs", "RUN-001-example", "spec.md"),
      `
# Feature: Example Feature
**Status:** In Progress
**Running ID:** \`RUN-001-example\`

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
    assert.ok(humanOutput.includes("RUN-001-example"));
    assert.ok(humanOutput.includes("1/2 complete"));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
