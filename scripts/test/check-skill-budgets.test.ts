import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { checkSkillBudgets, parseFrontmatter } from "../check-skill-budgets.mjs";

test("parseFrontmatter extracts YAML frontmatter properly", () => {
  const sample = `---
name: test-skill
description: "A test skill for DevFlow verification"
---
# Test Skill
Content here`;

  const fm = parseFrontmatter(sample);
  assert.equal(fm.name, "test-skill");
  assert.equal(fm.description, "A test skill for DevFlow verification");
});

test("checkSkillBudgets detects oversized description (>400 chars)", () => {
  const longDesc = "a".repeat(405);
  const sampleSkill = `---
name: long-desc
description: "${longDesc}"
---
# Body`;

  const tempDir = path.resolve("devflow/tmp/test-budgets-desc");
  fs.mkdirSync(path.join(tempDir, "sample-skill"), { recursive: true });
  fs.writeFileSync(path.join(tempDir, "sample-skill", "SKILL.md"), sampleSkill, "utf8");

  try {
    const result = checkSkillBudgets(tempDir, { warnThreshold: 0.9 });
    assert.ok(result.violations.some((v: string) => v.includes("description is 405 chars (cap 400)")));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("checkSkillBudgets flags files exceeding byte budget", () => {
  const bigBody = "x".repeat(35 * 1024); // 35KB > 32KB default
  const sampleSkill = `---
name: big-skill
description: "A big skill"
---
# Big Skill
${bigBody}`;

  const tempDir = path.resolve("devflow/tmp/test-budgets-size");
  fs.mkdirSync(path.join(tempDir, "sample-skill"), { recursive: true });
  fs.writeFileSync(path.join(tempDir, "sample-skill", "SKILL.md"), sampleSkill, "utf8");

  try {
    const result = checkSkillBudgets(tempDir, { skillBudget: 32 * 1024 });
    assert.ok(result.violations.some((v: string) => v.includes("exceeds its budget of 32768")));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("checkSkillBudgets produces warnings when utilization is >= 90%", () => {
  const midBody = "x".repeat(30 * 1024); // ~30KB (>= 90% of 32KB)
  const sampleSkill = `---
name: warn-skill
description: "A warning skill"
---
# Warn Skill
${midBody}`;

  const tempDir = path.resolve("devflow/tmp/test-budgets-warn");
  fs.mkdirSync(path.join(tempDir, "sample-skill"), { recursive: true });
  fs.writeFileSync(path.join(tempDir, "sample-skill", "SKILL.md"), sampleSkill, "utf8");

  try {
    const result = checkSkillBudgets(tempDir, { skillBudget: 32 * 1024, warnThreshold: 0.9 });
    assert.equal(result.violations.length, 0);
    assert.ok(result.warnings.some((w: string) => w.includes("% of budget")));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
