import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test, { type TestContext } from "node:test";
import { promisify } from "node:util";

import {
  parseIndependentReview,
  readIndependentReview
} from "../lib/review.js";

const execFileAsync = promisify(execFile);
const TARGET = "1".repeat(40);
const BASE = "2".repeat(40);
const SPEC_HASH = "3".repeat(64);

test("parseIndependentReview recognizes the reset stub", () => {
  const review = parseIndependentReview(`# Independent Review

_No independent review requested. Run /audit independent current to prepare one._
`);

  assert.equal(review.state, "none");
  assert.equal(review.freshness, "not-applicable");
  assert.deepEqual(review.warnings, []);
});

test("parseIndependentReview reads pending and completed records", () => {
  const pending = parseIndependentReview(
    reviewRecord("pending", false, { requested: "automatic" })
  );

  assert.equal(pending.state, "pending");
  assert.equal(pending.targetCommit, TARGET);
  assert.equal(pending.requestedReviewer, "claude");
  assert.equal(pending.requestedModel, "claude-opus");
  assert.equal(pending.requestedExecution, "automatic");

  const passed = parseIndependentReview(reviewRecord("passed", true));

  assert.equal(passed.state, "passed");
  assert.equal(passed.reviewerAdapter, "claude");
  assert.equal(passed.reviewerModel, "claude-opus");
  assert.equal(passed.reviewerContext, "fresh session");
  assert.equal(passed.requestedExecution, null);
  assert.equal(passed.actualExecution, null);
  assert.equal(passed.checkResult, "not-required");

  const subagent = parseIndependentReview(
    reviewRecord("passed", true, {
      requested: "automatic",
      actual: "automatic",
      context: "fresh subagent"
    })
  );
  assert.equal(subagent.state, "passed");
  assert.equal(subagent.reviewerContext, "fresh subagent");
  assert.equal(subagent.requestedExecution, "automatic");
  assert.equal(subagent.actualExecution, "automatic");
});

test("parseIndependentReview keeps legacy pending and completed reviews manual-only", () => {
  const pending = parseIndependentReview(reviewRecord("pending"));
  assert.equal(pending.state, "pending");
  assert.equal(pending.requestedExecution, null);

  const completed = parseIndependentReview(reviewRecord("passed", true));
  assert.equal(completed.state, "passed");
  assert.equal(completed.reviewerContext, "fresh session");
  assert.equal(completed.requestedExecution, null);
  assert.equal(completed.actualExecution, null);

  const actualAdded = parseIndependentReview(
    reviewRecord("passed", true).replace(
      "**Reviewer context:** fresh session",
      "**Reviewer context:** fresh session\n**Actual execution:** manual"
    )
  );
  assert.equal(actualAdded.state, "malformed");

  const pendingActualAdded = parseIndependentReview(
    reviewRecord("pending").replace(
      "**Requested at:**",
      "**Actual execution:** manual\n**Requested at:**"
    )
  );
  assert.equal(pendingActualAdded.state, "malformed");

  const subagent = parseIndependentReview(
    reviewRecord("passed", true).replace(
      "**Reviewer context:** fresh session",
      "**Reviewer context:** fresh subagent"
    )
  );
  assert.equal(subagent.state, "malformed");
});

test("parseIndependentReview accepts an explicit automatic-to-manual fallback", () => {
  const review = parseIndependentReview(
    reviewRecord("passed", true, {
      requested: "automatic",
      actual: "manual",
      context: "fresh session"
    })
  );

  assert.equal(review.state, "passed");
  assert.equal(review.requestedExecution, "automatic");
  assert.equal(review.actualExecution, "manual");
});

test("parseIndependentReview accepts an explicitly bound manual review", () => {
  const review = parseIndependentReview(
    reviewRecord("passed", true, {
      requested: "manual",
      actual: "manual",
      context: "fresh session"
    })
  );

  assert.equal(review.state, "passed");
  assert.equal(review.requestedExecution, "manual");
  assert.equal(review.actualExecution, "manual");
});

test("parseIndependentReview rejects invalid execution and context pairings", () => {
  const manualSubagent = parseIndependentReview(
    reviewRecord("passed", true, {
      requested: "manual",
      actual: "automatic",
      context: "fresh subagent"
    })
  );
  assert.equal(manualSubagent.state, "malformed");

  const mismatchedAutomatic = parseIndependentReview(
    reviewRecord("passed", true, {
      requested: "automatic",
      actual: "automatic",
      context: "fresh session"
    })
  );
  assert.equal(mismatchedAutomatic.state, "malformed");
});

test("parseIndependentReview rejects incomplete receipts", () => {
  const review = parseIndependentReview(`# Independent Review

**Status:** passed
**Target commit:** ${TARGET}
`);

  assert.equal(review.state, "malformed");
  assert.equal(review.warnings[0]?.code, "malformed_review");
});

test("parseIndependentReview rejects an unsupported reviewer context", () => {
  const review = parseIndependentReview(
    reviewRecord("passed", true).replace(
      "**Reviewer context:** fresh session",
      "**Reviewer context:** builder session"
    )
  );

  assert.equal(review.state, "malformed");
});

test("parseIndependentReview requires completed evidence and a passing required Check", () => {
  const withoutEvidence = parseIndependentReview(
    reviewRecord("passed", true).replace(/\n## Commands[\s\S]*$/, "\n")
  );
  assert.equal(withoutEvidence.state, "malformed");

  const failedRequiredCheck = parseIndependentReview(
    reviewRecord("passed", true)
      .replace("**Check required:** no", "**Check required:** yes")
      .replace("**Check result:** not-required", "**Check result:** failed")
  );
  assert.equal(failedRequiredCheck.state, "malformed");

  const passedRequiredCheck = parseIndependentReview(
    reviewRecord("passed", true)
      .replace("**Check required:** no", "**Check required:** yes")
      .replace("**Check result:** not-required", "**Check result:** passed")
  );
  assert.equal(passedRequiredCheck.state, "passed");

  const unresolvedReviewerModel = parseIndependentReview(
    reviewRecord("passed", true)
      .replace(
        "**Requested model:** claude-opus",
        "**Requested model:** runtime default (exact model not known until reviewer starts)"
      )
      .replace(
        "**Reviewer model:** claude-opus",
        "**Reviewer model:** runtime default (exact model not known until reviewer starts)"
      )
  );
  assert.equal(unresolvedReviewerModel.state, "malformed");
});

test("readIndependentReview marks product changes stale but ignores review evidence in task context", async (t) => {
  const projectRoot = await createProject(t);
  const taskDir = path.join(projectRoot, "devflow", "context", "001-test-task");
  const specPath = path.join(taskDir, "spec.md");
  const specContent = await fs.readFile(specPath, "utf8");
  const target = await runGit(projectRoot, ["rev-parse", "HEAD"]);
  const base = await runGit(projectRoot, ["rev-parse", "main"]);
  const specHash = createHash("sha256").update(specContent).digest("hex");
  const reviewPath = path.join(taskDir, "review.md");
  const findingsPath = path.join(taskDir, "findings.md");

  await fs.writeFile(
    reviewPath,
    reviewRecord("passed", true)
      .replaceAll(TARGET, target)
      .replaceAll(BASE, base)
      .replaceAll(SPEC_HASH, specHash)
  );
  await fs.writeFile(findingsPath, "# Findings\n\nReview evidence.\n");

  const current = await readIndependentReview(projectRoot, "001-test-task");
  assert.equal(current.state, "passed");
  assert.equal(current.freshness, "current");

  await fs.writeFile(
    reviewPath,
    (await fs.readFile(reviewPath, "utf8")).replace(
      "**Reviewer adapter:** claude",
      "**Reviewer adapter:** codex"
    )
  );
  const mismatched = await readIndependentReview(projectRoot, "001-test-task");
  assert.equal(mismatched.freshness, "stale");
  await fs.writeFile(
    reviewPath,
    (await fs.readFile(reviewPath, "utf8")).replace(
      "**Reviewer adapter:** codex",
      "**Reviewer adapter:** claude"
    )
  );

  await fs.appendFile(path.join(projectRoot, "src.ts"), "export const changed = true;\n");

  const stale = await readIndependentReview(projectRoot, "001-test-task");
  assert.equal(stale.freshness, "stale");
});

test("readIndependentReview rejects an incorrect base and reviewer model", async (t) => {
  const projectRoot = await createProject(t);
  const currentWorkPath = path.join(
    projectRoot,
    "devflow",
    "context",
    "001-test-task",
    "spec.md"
  );
  const currentWork = await fs.readFile(currentWorkPath, "utf8");
  const target = await runGit(projectRoot, ["rev-parse", "HEAD"]);
  const base = await runGit(projectRoot, ["rev-parse", "main"]);
  const specHash = createHash("sha256").update(currentWork).digest("hex");
  const reviewPath = path.join(
    projectRoot,
    "devflow",
    "context",
    "001-test-task",
    "review.md"
  );

  await fs.writeFile(
    reviewPath,
    reviewRecord("passed", true)
      .replaceAll(TARGET, target)
      .replaceAll(BASE, base)
      .replaceAll(SPEC_HASH, specHash)
      .replace("**Base ref:** main", "**Base ref:** missing-branch")
  );

  const missingBaseRef = await readIndependentReview(projectRoot, "001-test-task");
  assert.equal(missingBaseRef.freshness, "stale");

  await fs.writeFile(
    reviewPath,
    reviewRecord("passed", true)
      .replaceAll(TARGET, target)
      .replaceAll(BASE, base)
      .replaceAll(SPEC_HASH, specHash)
      .replace("**Reviewer model:** claude-opus", "**Reviewer model:** codex-max")
  );

  const mismatchedModel = await readIndependentReview(projectRoot, "001-test-task");
  assert.equal(mismatchedModel.freshness, "stale");
});

function reviewRecord(
  status: "changes-requested" | "passed" | "pending",
  completed = false,
  execution?: {
    requested: "automatic" | "manual";
    actual?: "automatic" | "manual";
    context?: "fresh session" | "fresh subagent";
  }
): string {
  const fields = [
    `**Status:** ${status}`,
    `**Target commit:** ${TARGET}`,
    `**Base commit:** ${BASE}`,
    "**Base ref:** main",
    `**Spec hash:** ${SPEC_HASH}`,
    "**Prepared by:** codex",
    "**Builder model:** gpt-5",
    "**Requested reviewer:** claude",
    "**Requested model:** claude-opus",
    ...(execution ? [`**Requested execution:** ${execution.requested}`] : []),
    "**Requested at:** 2026-08-31T00:00:00.000Z",
    "**Workflow:** regular",
    "**Check required:** no"
  ];

  if (completed) {
    fields.push(
      "**Reviewer adapter:** claude",
      "**Reviewer model:** claude-opus",
      `**Reviewer context:** ${execution?.context || "fresh session"}`,
      ...(execution?.actual ? [`**Actual execution:** ${execution.actual}`] : []),
      "**Reviewed at:** 2026-08-31T00:10:00.000Z",
      "**Scope:** current",
      "**Lenses:** quality, security, performance, tests",
      `**Verdict:** ${status}`,
      "**Check result:** not-required"
    );
  }

  return `# Independent Review

${fields.join("\n")}
${completed ? `
## Commands

- \`npm test\`: passed

## Evidence

- Unit test output reviewed.

## Findings

- None

## Remaining risk

- None identified
` : ""}`;
}

async function createProject(t: TestContext): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-review-test-"));
  const taskDir = path.join(tempDir, "devflow", "context", "001-test-task");
  t.after(async () => {
    await fs.rm(tempDir, { force: true, recursive: true });
  });

  await fs.mkdir(taskDir, { recursive: true });
  await fs.writeFile(path.join(taskDir, "spec.md"), "# Spec\n\nTask content.\n");
  await fs.writeFile(path.join(taskDir, "findings.md"), "# Findings\n");
  await fs.writeFile(path.join(taskDir, "review.md"), "# Independent Review\n\n_No independent review requested.\n");
  await fs.writeFile(path.join(tempDir, "src.ts"), "export {};\n");

  await runGit(tempDir, ["init", "-b", "main"]);
  await runGit(tempDir, ["config", "user.name", "DevFlow Test"]);
  await runGit(tempDir, ["config", "user.email", "test@nexus-devflow.local"]);
  await runGit(tempDir, ["add", "."]);
  await runGit(tempDir, ["commit", "-m", "chore: initial commit"]);

  await runGit(tempDir, ["switch", "-c", "feature/review"]);
  await fs.appendFile(path.join(tempDir, "src.ts"), "export const feature = true;\n");
  await runGit(tempDir, ["add", "src.ts"]);
  await runGit(tempDir, ["commit", "-m", "feat: add review target"]);

  return tempDir;
}

async function runGit(cwd: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync("git", args, { cwd });
  return stdout.trim();
}
