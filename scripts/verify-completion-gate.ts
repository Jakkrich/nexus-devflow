#!/usr/bin/env node
// Exhaustive check of the status completion gate.
// Property: a run is ready to archive only when the checklist, blocking
// findings, Git, the review gate health uses, and a real passed-check signal
// are all clear. A bare mention of /complete is not that signal.
// Bounds and recorded findings live in this file. The skill
// .agents/skills/verify-completion-gate/SKILL.md tells the next agent how to
// read the result.

import { createDefaultProjectConfig } from "../packages/create-nexus-devflow/lib/project-config.js";
import type {
  IndependentReviewGatePolicy,
  ProjectConfig
} from "../packages/create-nexus-devflow/lib/project-config.js";
import { unavailableGitStatusSummary } from "../packages/create-nexus-devflow/lib/git-status.js";
import type { GitStatusSummary } from "../packages/create-nexus-devflow/lib/git-status.js";
import type {
  CurrentWorkState,
  CurrentWorkSummary
} from "../packages/create-nexus-devflow/lib/current-work.js";
import type { FindingsSummary } from "../packages/create-nexus-devflow/lib/findings.js";
import type {
  IndependentReviewSummary,
  ReviewFreshness,
  ReviewState
} from "../packages/create-nexus-devflow/lib/review.js";
import {
  classifyWorkEvidence,
  isReviewBlocked,
  selectCompletion
} from "../packages/create-nexus-devflow/lib/project-status-engine.js";

const RECORDED_FINDINGS = ["stage-mention", "workflow-gate"] as const;

type Clause =
  | "state"
  | "remaining"
  | "findings"
  | "git"
  | "record-fault"
  | "failed-check"
  | "workflow-gate"
  | "stage-mention";

type RunMode = "manual" | "continuous";
type ReviewWorkflow = "continuous" | "regular" | null;

const WORK_STATES: readonly CurrentWorkState[] = ["active", "idle", "malformed"];
const REMAINING = [0, 1] as const;
const STATUSES: readonly (string | null)[] = [
  null,
  "verified",
  "verification failed",
  "incomplete"
];
const REVIEW_STATES: readonly ReviewState[] = [
  "changes-requested",
  "malformed",
  "none",
  "passed",
  "pending"
];
const FRESHNESS: readonly ReviewFreshness[] = ["current", "stale"];
const WORKFLOWS: readonly ReviewWorkflow[] = ["continuous", "regular", null];
const GATES: readonly IndependentReviewGatePolicy[] = [
  "always",
  "manual",
  "when-sensitive"
];
const RUN_MODES: readonly RunMode[] = ["manual", "continuous"];
const STAGES = [
  "",
  "Next Action: /complete",
  "- Current Stage: check (Passed)",
  "ready for /complete",
  "Passed -> Ready",
  "- Current Stage: check (Failed)\nNext Action: /complete"
] as const;

const STRICT_STAGE =
  /ready\s+for\s+\/complete|Passed\s+->\s+Ready|Current Stage:\s*check\s*\(Passed/i;
const FAILED_STAGE = /check\s*\(Failed|verification failed/i;

function statusAloneVerified(status: string | null): boolean {
  const value = status?.trim().toLowerCase() ?? "";
  if (value === "verification failed" || value === "failed") {
    return false;
  }
  if (value === "verification incomplete" || value === "incomplete") {
    return false;
  }
  return value === "verified" ||
    value.includes("verified") ||
    value === "ready" ||
    value.includes("ready");
}

function strictStageVerified(stage: string): boolean {
  return STRICT_STAGE.test(stage) && !FAILED_STAGE.test(stage);
}

function work(
  state: CurrentWorkState,
  remaining: number,
  status: string | null
): CurrentWorkSummary {
  return {
    state,
    type: state === "active" ? "feature" : null,
    title: state === "active" ? "Export reports" : null,
    status,
    buildPlanItem: null,
    runId: state === "active" ? "021-export" : null,
    steps: [],
    completed: remaining === 0 ? 1 : 0,
    remaining,
    total: 1,
    nextStep: null,
    warnings: []
  };
}

function findings(blockers: boolean, malformed: boolean): FindingsSummary {
  const blocker = {
    id: "QA-001",
    severity: "P0" as const,
    status: "open" as const,
    title: "Crash on export",
    line: 1
  };
  return {
    items: blockers ? [blocker] : [],
    total: blockers ? 1 : 0,
    byStatus: {
      unverified: 0,
      open: blockers ? 1 : 0,
      fixed: 0,
      closed: 0,
      accepted: 0,
      invalid: 0
    },
    blockers: blockers ? [blocker] : [],
    warnings: malformed
      ? [{ code: "malformed_findings", message: "bad heading" }]
      : []
  };
}

function git(available: boolean): GitStatusSummary {
  const base = unavailableGitStatusSummary();
  if (!available) {
    return base;
  }
  return {
    ...base,
    available: true,
    branch: "feature/export",
    clean: true
  };
}

function review(
  state: ReviewState,
  freshness: ReviewFreshness,
  workflow: ReviewWorkflow
): IndependentReviewSummary {
  return {
    state,
    freshness,
    targetCommit: null,
    baseCommit: null,
    baseRef: null,
    specHash: null,
    specSnapshot: null,
    preparedBy: null,
    builderModel: null,
    requestedReviewer: null,
    requestedModel: null,
    requestedExecution: null,
    requestedAt: null,
    workflow,
    checkRequired: null,
    reviewerAdapter: null,
    reviewerModel: null,
    reviewerContext: null,
    actualExecution: null,
    reviewedAt: null,
    scope: null,
    lenses: [],
    verdict: state === "passed"
      ? "passed"
      : state === "changes-requested"
        ? "changes-requested"
        : null,
    checkResult: null,
    warnings: state === "malformed"
      ? [{ code: "malformed_review", message: "bad review" }]
      : []
  };
}

function configFor(
  regular: IndependentReviewGatePolicy,
  continuous: IndependentReviewGatePolicy
): ProjectConfig {
  const config = createDefaultProjectConfig();
  config.qualityGates.regular.independentReview = regular;
  config.qualityGates.continuous.independentReview = continuous;
  return config;
}

interface Sample {
  state: CurrentWorkState;
  remaining: number;
  status: string | null;
  blockers: boolean;
  malformedFindings: boolean;
  gitAvailable: boolean;
  reviewState: ReviewState;
  freshness: ReviewFreshness;
  workflow: ReviewWorkflow;
  regularGate: IndependentReviewGatePolicy;
  continuousGate: IndependentReviewGatePolicy;
  runMode: RunMode;
  stage: string;
  verification: string;
  completion: string;
}

function formatSample(sample: Sample): string {
  return [
    `work is ${sample.state}, remaining ${sample.remaining}, status ${sample.status ?? "empty"}`,
    `findings blockers ${sample.blockers ? "QA-001 P0 open" : "none"}, findings warning ${sample.malformedFindings ? "malformed_findings" : "none"}`,
    `git ${sample.gitAvailable ? "available" : "unavailable"}`,
    `review ${sample.reviewState}, freshness ${sample.freshness}, workflow ${sample.workflow ?? "unset"}`,
    `gates regular ${sample.regularGate}, continuous ${sample.continuousGate}, run mode ${sample.runMode}`,
    `stage text: ${JSON.stringify(sample.stage)}`,
    `classifyWorkEvidence returned ${sample.verification}; selectCompletion returned ${sample.completion}`
  ].join("\n  ");
}

function main(): number {
  const found = new Map<Clause, { text: string; isolated: boolean }>();
  let cases = 0;

  const note = (clause: Clause, sample: Sample, isolated: boolean): void => {
    const existing = found.get(clause);
    if (!existing || (isolated && !existing.isolated)) {
      found.set(clause, { text: formatSample(sample), isolated });
    }
  };

  for (const state of WORK_STATES) {
    for (const remaining of REMAINING) {
      for (const status of STATUSES) {
        for (const hasBlockers of [false, true]) {
          for (const malformedFindings of [false, true]) {
            for (const gitAvailable of [false, true]) {
              for (const reviewState of REVIEW_STATES) {
                for (const freshness of FRESHNESS) {
                  for (const workflow of WORKFLOWS) {
                    for (const regularGate of GATES) {
                      for (const continuousGate of GATES) {
                        for (const runMode of RUN_MODES) {
                          for (const stage of STAGES) {
                            cases += 1;
                            const current = work(state, remaining, status);
                            const ledger = findings(hasBlockers, malformedFindings);
                            const repo = git(gitAvailable);
                            const receipt = review(reviewState, freshness, workflow);
                            const config = configFor(regularGate, continuousGate);
                            const evidence = classifyWorkEvidence(
                              current,
                              ledger,
                              receipt,
                              stage
                            );
                            const completion = selectCompletion(
                              current,
                              ledger,
                              repo,
                              stage,
                              receipt,
                              config,
                              evidence
                            );
                            const sample: Sample = {
                              state,
                              remaining,
                              status,
                              blockers: hasBlockers,
                              malformedFindings,
                              gitAvailable,
                              reviewState,
                              freshness,
                              workflow,
                              regularGate,
                              continuousGate,
                              runMode,
                              stage,
                              verification: evidence.verification,
                              completion: completion.state
                            };

                            const reviewBlocked = isReviewBlocked(
                              receipt,
                              config,
                              current,
                              runMode
                            );
                            const passedCheck =
                              statusAloneVerified(status) || strictStageVerified(stage);
                            if (completion.state === "ready") {
                              if (state !== "active") note("state", sample, true);
                              if (remaining > 0) note("remaining", sample, true);
                              if (hasBlockers) note("findings", sample, true);
                              if (!gitAvailable) note("git", sample, true);
                              if (evidence.recordFaults.length > 0) {
                                note("record-fault", sample, true);
                              }
                              if (evidence.verification === "failed") {
                                note("failed-check", sample, true);
                              }
                              if (reviewBlocked) {
                                note("workflow-gate", sample, passedCheck);
                              }
                            }

                            const stageOnly =
                              !statusAloneVerified(status) &&
                              !strictStageVerified(stage) &&
                              evidence.verification === "verified";
                            if (stageOnly && completion.state === "ready") {
                              note("stage-mention", sample, !reviewBlocked);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  const failed = [...found.keys()];
  const unexpected = failed.filter(
    (clause) => !RECORDED_FINDINGS.includes(clause as (typeof RECORDED_FINDINGS)[number])
  );
  const missing = RECORDED_FINDINGS.filter((clause) => !found.has(clause));

  console.log("verify-completion-gate");
  console.log(`cases: ${cases}`);
  console.log("property: ready to archive only when checklist, blocking findings, Git, the review gate health uses, and a real passed-check signal are clear.");
  for (const clause of [
    "state",
    "remaining",
    "findings",
    "git",
    "record-fault",
    "failed-check",
    "workflow-gate",
    "stage-mention"
  ] as const) {
    const detail = found.get(clause);
    if (!detail) {
      console.log(`${clause}: pass`);
      continue;
    }
    const kind = RECORDED_FINDINGS.includes(clause as (typeof RECORDED_FINDINGS)[number])
      ? "recorded finding"
      : "new violation";
    console.log(`${clause}: ${kind}`);
    console.log(`  ${detail.text}`);
  }

  if (unexpected.length > 0) {
    console.log("exit: 1");
    console.log("A clause outside the recorded findings failed. Treat the counterexample as a bug in the completion gate. Do not edit this checker to hide it.");
    return 1;
  }
  if (missing.length > 0) {
    console.log("exit: 2");
    console.log(`Recorded finding no longer reproduces: ${missing.join(", ")}. Re-read the covered functions and update RECORDED_FINDINGS and the skill only after the checker matches the code.`);
    return 2;
  }
  console.log("exit: 0");
  console.log("Only the recorded findings reproduced. They are known gaps, not a new regression.");
  return 0;
}

process.exitCode = main();
