import assert from "node:assert/strict";
import test from "node:test";

import { parseWorkflowState } from "../lib/workflow-state.js";
import type { StatusCurrentWork } from "../lib/status.js";

const idleWork: StatusCurrentWork = {
  state: "idle", type: null, title: null, status: null, runId: null,
  completed: 0, remaining: 0, total: 0, nextStep: null
};

test("parseWorkflowState maps idle workspace to pending pipelines", () => {
  const state = parseWorkflowState("- **Active Discovery ID**: `None`\n- **Active Running ID**: `None`\n- **Current Stage**: `idle`", idleWork);
  assert.equal(state.track, "idle");
  assert.equal(state.fast.every((node) => node.state === "pending"), true);
  assert.equal(state.deep.length, 4);
  assert.equal(state.deep[0].id, "idea");
  assert.equal(state.deep[3].id, "discovery");
});

test("parseWorkflowState maps Active Discovery ID to active discovery stage", () => {
  const state = parseWorkflowState("- **Active Discovery ID**: `DISC-20260824-001`\n- **Active Running ID**: `None`\n- **Current Stage**: `discovery`", idleWork);
  assert.equal(state.track, "deep");
  assert.equal(state.currentStage, "discovery");
  assert.equal(state.deep.find((node) => node.id === "discovery")?.state, "active");
});

test("parseWorkflowState maps Pre-Flight stage progression correctly", () => {
  const state = parseWorkflowState("- **Current Stage**: `grill`\n- **Track**: `preflight`", idleWork);
  assert.equal(state.track, "deep");
  assert.equal(state.currentStage, "grill");
  assert.equal(state.deep.find((node) => node.id === "idea")?.state, "done");
  assert.equal(state.deep.find((node) => node.id === "grill")?.state, "active");
});

test("parseWorkflowState maps active feature to Fast-Track implementation", () => {
  const active: StatusCurrentWork = {
    state: "active", type: "feature", title: "Feature", status: "In Progress", runId: "041-feature",
    completed: 1, remaining: 2, total: 3, nextStep: { title: "Build UI" }
  };
  const state = parseWorkflowState("- **Active Running ID**: `None`\n- **Current Stage**: `idle`", active);
  assert.equal(state.track, "fast");
  assert.equal(state.currentStage, "implement");
  assert.equal(state.fast.find((node) => node.id === "implement")?.state, "active");
});

test("parseWorkflowState respects explicit Track field and flexible markdown headers", () => {
  const deepState = parseWorkflowState("- Track: `preflight`\n- Current Stage: `brainstorm`", idleWork);
  assert.equal(deepState.track, "deep");
  assert.equal(deepState.currentStage, "brainstorm");

  const fastState = parseWorkflowState("- Active Running ID: `041-test`\n- Track: `fast`\n- Current Stage: `implement`", idleWork);
  assert.equal(fastState.track, "fast");
});

test("parseWorkflowState maps Track: fast with Current Stage: idle to idle track", () => {
  const state = parseWorkflowState("- Active Running ID: `None`\n- Track: `fast`\n- Current Stage: `idle`", idleWork);
  assert.equal(state.track, "idle");
  assert.equal(state.currentStage, null);
  assert.equal(state.fast.every((node) => node.state === "pending"), true);
});

