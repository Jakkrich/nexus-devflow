import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { parseRunState, readAllRunStates } from "../lib/run-state.js";

test("parseRunState returns a recorded Continuous run", () => {
  const run = parseRunState(JSON.stringify({
    schemaVersion: 1,
    command: "continuous",
    status: "running",
    summary: "Completing the remaining build plan",
    detail: "Implementing the current feature.",
    boundary: "local-only",
    startedAt: "2026-08-26T12:00:00.000Z",
    updatedAt: "2026-08-26T12:05:00.000Z",
    resumeCommand: "/continuous resume",
    progress: { current: 2, total: 5, label: "features" },
    feature: { id: "19", title: "Campaign deletion" }
  }), new Date("2026-08-26T12:10:00.000Z"));

  assert.equal(run.state, "recorded");
  assert.equal(run.mode, "continuous");
  assert.equal(run.command, "continuous");
  assert.equal(run.status, "running");
  assert.equal(run.freshness, "current");
  assert.deepEqual(run.progress, { current: 2, total: 5, label: "features" });
  assert.deepEqual(run.feature, { id: "19", title: "Campaign deletion" });
  assert.deepEqual(run.warnings, []);
});

test("parseRunState marks interrupted running activity as stale", () => {
  const run = parseRunState(JSON.stringify({
    schemaVersion: 1,
    command: "continuous",
    status: "running",
    summary: "Completing the remaining build plan",
    startedAt: "2026-08-26T10:00:00.000Z",
    updatedAt: "2026-08-26T10:30:00.000Z",
    resumeCommand: "/continuous resume"
  }), new Date("2026-08-26T12:00:01.000Z"));

  assert.equal(run.freshness, "stale");
  assert.equal(run.state, "recorded");
  assert.equal(run.status, "running");
  assert.equal(run.resumeCommand, "/continuous resume");
  assert.deepEqual(run.warnings, []);
});

test("parseRunState treats other commands as manual mode", () => {
  const run = parseRunState(JSON.stringify({
    schemaVersion: 1,
    command: "audit",
    status: "completed",
    summary: "Audited the active feature",
    boundary: "read-only",
    startedAt: "2026-08-26T12:00:00.000Z",
    updatedAt: "2026-08-26T12:03:00.000Z"
  }));

  assert.equal(run.mode, "manual");
  assert.equal(run.command, "audit");
  assert.equal(run.status, "completed");
});

test("parseRunState treats autopilot as autopilot mode", () => {
  const run = parseRunState(JSON.stringify({
    schemaVersion: 1,
    command: "autopilot",
    status: "ready",
    summary: "Autopilot reached review boundary",
    boundary: "reviewed",
    startedAt: "2026-08-26T12:00:00.000Z",
    updatedAt: "2026-08-26T12:05:00.000Z",
    resumeCommand: "/complete"
  }));

  assert.equal(run.mode, "autopilot");
  assert.equal(run.command, "autopilot");
  assert.equal(run.status, "ready");
});

test("parseRunState rejects malformed or incomplete state", () => {
  assert.equal(parseRunState("not-json").state, "malformed");
  assert.equal(parseRunState("{}").state, "malformed");
  assert.equal(
    parseRunState(JSON.stringify({
      schemaVersion: 1,
      command: "continuous",
      status: "running",
      summary: "Running",
      startedAt: "not-a-date",
      updatedAt: "2026-08-26T12:03:00.000Z"
    })).state,
    "malformed"
  );
});

test("parseRunState and readAllRunStates aggregate isolated runs/*.json sorted by updatedAt", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-runstate-all-"));
  try {
    const runsDir = path.join(tempDir, "devflow", ".state", "runs");
    await fs.mkdir(runsDir, { recursive: true });
    await fs.writeFile(
      path.join(runsDir, "130-alpha.json"),
      JSON.stringify({
        schemaVersion: 1,
        runId: "130-alpha",
        branch: "feature/130-alpha",
        worktreePath: tempDir,
        command: "feature",
        status: "ready",
        summary: "Spec ready",
        startedAt: "2026-11-19T10:00:00.000Z",
        updatedAt: "2026-11-19T10:05:00.000Z",
        handoff: { nextStep: "/implement 130-alpha", notes: "Schema settled" }
      }),
      "utf8"
    );
    await fs.writeFile(
      path.join(runsDir, "131-beta.json"),
      JSON.stringify({
        schemaVersion: 1,
        runId: "131-beta",
        branch: "feature/131-beta",
        worktreePath: `${tempDir}-wt`,
        command: "implement",
        status: "running",
        summary: "Implementing beta",
        startedAt: "2026-11-19T10:10:00.000Z",
        updatedAt: "2026-11-19T10:20:00.000Z",
        handoff: { touchedFiles: ["a.ts"], nextStep: "/check 131-beta" }
      }),
      "utf8"
    );

    const collection = await readAllRunStates(tempDir, new Date("2026-11-19T10:25:00.000Z"));
    assert.equal(collection.runs.length, 2);
    assert.equal(collection.primary.runId, "131-beta");
    assert.equal(collection.runs[0]?.runId, "131-beta");
    assert.equal(collection.runs[1]?.runId, "130-alpha");
    assert.equal(collection.runs[1]?.handoff?.notes, "Schema settled");
    assert.deepEqual(collection.warnings, []);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
