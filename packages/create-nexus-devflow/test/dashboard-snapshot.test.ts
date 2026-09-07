import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { clearDashboardSnapshotCache, readDashboardSnapshot, selectDashboardNextAction } from "../lib/dashboard-snapshot.js";
import type { ProjectStatus } from "../lib/status.js";
import type { WorkflowState } from "../lib/workflow-state.js";

test("readDashboardSnapshot composes status, workflow, history, doctor and offline update", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-snapshot-"));
  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });
    await fs.mkdir(path.join(tempDir, "devflow", "history", "features"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# Nexus-DevFlow");
    await fs.writeFile(path.join(tempDir, "devflow", "context", "current-feature.md"), "# Current Feature\n\n_Nothing in progress.");
    await fs.writeFile(path.join(tempDir, "devflow", "context", "current-stage.md"), "- **Active Running ID**: `None`\n- **Current Stage**: `idle`");
    await fs.writeFile(path.join(tempDir, "devflow", "context", "findings.md"), "# Findings Ledger\n\n_No active findings recorded._");
    await fs.writeFile(path.join(tempDir, "devflow", "history", "features", "001-one.md"), "# [001] Feature: One\n**Status:** Completed");
    clearDashboardSnapshotCache();
    const snapshot = await readDashboardSnapshot(tempDir, {
      fetchImpl: async () => { throw new Error("offline"); },
      now: () => Date.parse("2026-08-22T00:00:00.000Z")
    });
    assert.equal(snapshot.schemaVersion, 1);
    assert.equal(snapshot.workflow.track, "idle");
    assert.equal(snapshot.history.total, 1);
    assert.equal(snapshot.update.state, "offline");
    assert.equal(Array.isArray(snapshot.doctor.checks), true);
    assert.equal(Array.isArray(snapshot.commands), true);
    assert.ok(snapshot.gatekeeper);
    assert.equal(snapshot.gatekeeper.passed, true);
    assert.ok(snapshot.drift);
    assert.equal(snapshot.drift.hasDrift, false);
    assert.ok(snapshot.swarm);
    assert.equal(Array.isArray(snapshot.swarm.agentRoster), true);
    assert.ok(snapshot.graph);
    assert.equal(typeof snapshot.graph.totalFiles, "number");
    assert.ok(Array.isArray(snapshot.mcpTools));
    assert.equal(snapshot.mcpTools.length, 12);
    assert.ok(Array.isArray(snapshot.recommendedSkills));
    assert.ok(snapshot.recommendedSkills.length >= 5);
    assert.ok(Array.isArray(snapshot.activeTickets));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("readDashboardSnapshot detects active tracer-bullet tickets from context", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-tickets-"));
  try {
    const taskDir = path.join(tempDir, "devflow", "context", "080-test-task");
    const ticketsDir = path.join(taskDir, "tickets");
    await fs.mkdir(ticketsDir, { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# Nexus-DevFlow");
    await fs.writeFile(path.join(taskDir, "spec.md"), "# Spec 080\nStatus: In Progress");

    await fs.writeFile(
      path.join(ticketsDir, "01-first.md"),
      "# Ticket 01: First Seam\n- **Status**: Done\n- **Blocked by**: None"
    );
    await fs.writeFile(
      path.join(ticketsDir, "02-second.md"),
      "# Ticket 02: Second Adapters\n- **Status**: In Progress\n- **Blocked by**: 01"
    );

    clearDashboardSnapshotCache();
    const snapshot = await readDashboardSnapshot(tempDir);
    assert.ok(Array.isArray(snapshot.activeTickets));
    assert.equal(snapshot.activeTickets.length, 2);
    assert.equal(snapshot.activeTickets[0].id, "01");
    assert.equal(snapshot.activeTickets[0].status, "done");
    assert.equal(snapshot.activeTickets[1].id, "02");
    assert.equal(snapshot.activeTickets[1].status, "in_progress");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});



test("selectDashboardNextAction prefers the active workflow stage", () => {
  const status = {
    nextAction: { command: "/check", reason: "No checklist steps remain." }
  } as ProjectStatus;
  const workflow = {
    track: "deep",
    currentStage: "discovery",
    activeRunId: "DISC-001"
  } as WorkflowState;
  assert.deepEqual(selectDashboardNextAction(status, workflow), {
    command: "/discovery DISC-001",
    reason: "Continue active workflow at /discovery."
  });
});
