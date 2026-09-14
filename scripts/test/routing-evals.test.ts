import assert from "node:assert/strict";
import test from "node:test";
import * as routing from "../evals/routing.js";
import { parseSkillFrontmatter, tokenize, type SkillInfo } from "../evals/routing.js";
const { evaluateCases, rankSkill } = routing;

const skills = new Map<string, SkillInfo>([
  ["fix", { name: "fix", description: "Draft a task-isolated spec for a bug or small change. Use when invoking /fix or requesting a fix plan.", descTokens: new Set(tokenize("Draft a task-isolated spec for a bug or small change. Use when invoking /fix or requesting a fix plan.")) }],
  ["test", { name: "test", description: "Run automated test suites and coverage analysis.", descTokens: new Set(tokenize("Run automated test suites and coverage analysis.")) }]
]);

test("explicit invocation supports slash, dollar and Thai surrounding text", () => {
  for (const prompt of ["/fix login", "$fix login", "ช่วยเรียก /fix ให้หน่อย", "invoke fix skill"]) {
    assert.equal(rankSkill(prompt, skills), "fix");
  }
});

test("unrelated prompts abstain instead of picking the first skill", () => {
  assert.equal(rankSkill("hello there", skills), null);
  assert.equal(rankSkill("tell me the weather", skills), null);
});

test("a verb alone does not receive an explicit invocation bonus", () => {
  assert.equal(rankSkill("fix this typo", skills), null);
  assert.equal(rankSkill("a test", skills), null);
});

test("tokenization preserves Thai text", () => {
  assert.ok(tokenize("ช่วยวางแผนแก้ไขบั๊ก").some(token => /[ก-๙]/u.test(token)));
});

test("negative cases count and false activations fail", () => {
  const result = evaluateCases([{ skill: "fix", positive: ["/fix login"], negative: ["hello"] }], () => "fix");
  assert.equal(result.totalCases, 2);
  assert.equal(result.negativeFailures, 1);
  assert.equal(result.accuracy, 50);
});

test("negative cases allow another relevant skill", () => {
  const result = evaluateCases([{ skill: "fix", positive: [], negative: ["/test"] }], () => "test");
  assert.equal(result.accuracy, 100);
});

test("empty evaluation is an error, not a perfect score", () => {
  assert.throws(() => evaluateCases([], () => null), /No routing cases/);
});

test("frontmatter quotes are removed without altering description", () => {
  assert.deepEqual(parseSkillFrontmatter('---\nname: fix\ndescription: "Draft a fix plan."\n---\n'), { name: "fix", description: "Draft a fix plan." });
});
