import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import { parseRunState, readAllRunStates } from "../lib/run-state.js";

const execFileAsync = promisify(execFile);

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

test("parseRunState treats autopilot and devflow-mode as autopilot mode", () => {
  for (const command of ["autopilot", "devflow-mode"]) {
    const run = parseRunState(JSON.stringify({
      schemaVersion: 1,
      command,
      status: "ready",
      summary: "Autonomous mode reached review boundary",
      boundary: "reviewed",
      startedAt: "2026-08-26T12:00:00.000Z",
      updatedAt: "2026-08-26T12:05:00.000Z",
      resumeCommand: "/complete"
    }));

    assert.equal(run.mode, "autopilot");
    assert.equal(run.command, command);
    assert.equal(run.status, "ready");
  }
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

test("run-state.mjs creates devflow/.state/.gitignore and inherits previous progress label on update", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-runstate-cli-"));
  const repoRoot = path.resolve(import.meta.dirname, "../../..");
  const scriptPath = path.join(repoRoot, ".agents", "skills", "devflow-help", "scripts", "run-state.mjs");
  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });
    await execFileAsync(process.execPath, [
      scriptPath,
      "start",
      "--command", "devflow-mode",
      "--summary", "Starting task",
      "--boundary", "local-only",
      "--run-id", "001-demo",
      "--current", "0",
      "--total", "3",
      "--label", "features",
      "--target", tempDir
    ]);

    const gitignore = await fs.readFile(path.join(tempDir, "devflow", ".state", ".gitignore"), "utf8");
    assert.match(gitignore, /^\*\r?\n!\.gitignore/m);
    const reportsGitignore = await fs.readFile(path.join(tempDir, "devflow", "reports", ".gitignore"), "utf8");
    assert.equal(reportsGitignore, "*\n");

    await execFileAsync(process.execPath, [
      scriptPath,
      "update",
      "--run-id", "001-demo",
      "--current", "2",
      "--total", "3",
      "--target", tempDir
    ]);

    const updated = JSON.parse(
      await fs.readFile(path.join(tempDir, "devflow", ".state", "runs", "001-demo.json"), "utf8")
    );
    assert.deepEqual(updated.progress, { current: 2, total: 3, label: "features" });
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
