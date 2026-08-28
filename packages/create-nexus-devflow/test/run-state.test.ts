import assert from "node:assert/strict";
import test from "node:test";

import { parseRunState } from "../lib/run-state.js";

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
  assert.equal(run.warnings[0]?.code, "stale_run_state");
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
