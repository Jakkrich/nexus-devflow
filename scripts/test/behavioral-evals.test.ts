import assert from "node:assert/strict";
import test from "node:test";
import { scoreObservations, type Scenario } from "../evals/behavioral.js";

const scenarios: Scenario[] = [{ id: "th", prompt: "ร่างแผนแก้บั๊ก", expectedAction: "plan", expectedSkills: ["fix"] }];
const observation = { id: "th", action: "plan", skills: ["fix"], reason: "Planning requested" };
const record = (observations: unknown[]) => ({ reviewer: "isolated-probe", model: "unknown", observations });

test("scores a complete independent observation", () => {
  assert.deepEqual(scoreObservations(scenarios, record([observation])), { passed: 1, total: 1, failures: [] });
});
test("missing observations cannot inflate the score", () => {
  assert.equal(scoreObservations(scenarios, record([])).passed, 0);
});
test("wrong skill and wrong action both fail", () => {
  assert.equal(scoreObservations(scenarios, record([{ ...observation, skills: [] }])).passed, 0);
  assert.equal(scoreObservations(scenarios, record([{ ...observation, action: "implement" }])).passed, 0);
});
test("rejects duplicate and unknown observations", () => {
  assert.throws(() => scoreObservations(scenarios, record([observation, observation])), /Duplicate/);
  assert.throws(() => scoreObservations(scenarios, record([{ ...observation, id: "other" }])), /unknown/);
});
test("requires attributable observations with a reason", () => {
  assert.throws(() => scoreObservations(scenarios, {}), /Missing/);
  assert.throws(() => scoreObservations(scenarios, record([{ ...observation, reason: "" }])), /Malformed/);
  assert.throws(() => scoreObservations([], record([])), /Empty/);
});
