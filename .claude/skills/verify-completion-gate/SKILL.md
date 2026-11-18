---
name: verify-completion-gate
description: "Prove status completion never reports a DevFlow run ready to archive while steps, blocking findings, Git, the review gate health uses, or a real passed-check signal is still open. Use when editing project-status-engine completion or review gates, or for /verify-completion-gate."
---

# Verify the completion gate

## Property

A run is ready to archive and merge only when the checklist, blocking findings, Git, the review gate that health uses, and a real passed-check signal are all clear.

Harm: a false ready tells the user to run `/complete`, which archives the run and merges it, while delivery is still blocked.

## When to run

Run this after a change to any of these in `packages/create-nexus-devflow/lib/project-status-engine.ts`:

- `ProjectStatusEngine.getStatus` where it calls `classifyWorkEvidence` then `selectCompletion` (lines 216-225)
- `selectCompletion` (lines 681-706 and 712-719)
- `classifyWorkEvidence` (lines 864-912, stage patterns at 871-887)
- `isReviewBlocked` and `selectIndependentReviewPolicy` (lines 914-936)

Also run it when the user invokes `/verify-completion-gate`.

From the repo root:

```text
npm run verify:completion-gate
```

That runs `tsx scripts/verify-completion-gate.ts`. Node and `tsx` are already dev dependencies. The run takes a few seconds.

## How to read the result

Exit 0: the safety clauses pass, and only the recorded findings `stage-mention` and `workflow-gate` reproduce. Those two are known gaps. Report them when the user asks what the check found. Do not treat them as a regression you just introduced, and do not edit the checker or the property to make them disappear.

Exit 1: a clause outside that list failed. The printed sample is a bug in the completion gate. Report the sample as steps in the code's words. Do not change product code unless the user asks. Do not weaken `scripts/verify-completion-gate.ts` so the run exits 0.

Exit 2: a recorded finding no longer reproduces. The code and the checker disagree. Re-read the covered functions. Update `RECORDED_FINDINGS` in the script and this skill only after the script describes the code you just read. Then move the sync commit below forward.

A modeling error is a sample whose deciding field is not read by the function the clause names. `selectCompletion` reads work `state` and `remaining`, finding blocker length and ids, `git.available`, evidence `verification` and `recordFaults`, review `state` and `freshness`, and `config.qualityGates.regular.independentReview`. It does not read `review.workflow` or the continuous gate. `isReviewBlocked` reads those through `selectIndependentReviewPolicy`. `classifyWorkEvidence` reads work `status`, finding warning codes, review `state` only for `malformed`, and the stage text. If a failure turns on some other field, fix the checker.

## Recorded findings

`stage-mention`. `classifyWorkEvidence` treats stage text that contains `/complete` as verified, including `Next Action: /complete`, because the pattern includes `/\/complete/i` (line 873). With an active run, no remaining steps, no blocking findings, Git available, and both review gates `manual`, `selectCompletion` returns `ready`. A stage file that only names the command is not a passed check. Passed-check markers are `ready for /complete`, `Passed -> Ready`, and `Current Stage: check (Passed)`.

`workflow-gate`. Health uses `isReviewBlocked`, which applies `qualityGates.continuous.independentReview` when `review.workflow` is `continuous` (lines 924-935). `selectCompletion` applies only `qualityGates.regular.independentReview` (line 696). An active run, a real passed-check stage (`Current Stage: check (Passed)`), review state `none`, workflow `continuous`, regular gate `manual`, and continuous gate `always` is `ready` while `isReviewBlocked` is true. The continuous run is told it can archive while its review gate still requires a review.

## Scope

The check calls those functions. It does not reimplement them. The finite sets are the arrays in `scripts/verify-completion-gate.ts`: work state `active|idle|malformed`, remaining `0|1`, status empty, `verified`, `verification failed`, or `incomplete` (the `ready`, `failed`, and `verification incomplete` spellings share those arms), a blocking finding present or absent, a malformed findings warning present or absent, Git available or not, every review state, freshness `current|stale` (`unknown` and `not-applicable` take the same not-current branch as `stale`), workflow `continuous|regular|unset`, both gates `always|manual|when-sensitive`, run mode `manual|continuous` (`autopilot` takes the regular path, the same as `manual`), and the six stage strings in the script. That is 622080 cases.

A pass covers that set, not every string, and not the markdown parsers in `current-work.ts`, `findings.ts`, or `review.ts`. It does not cover `selectNextAction`. `getStatus` always passes evidence, review, and config into `selectCompletion`. The checker does the same.

## Sync

Covered file: `packages/create-nexus-devflow/lib/project-status-engine.ts`.

Sync commit: `0ebac7a380225ce42f065b736cff48c106e828e7`.

The exports of `selectCompletion` and `isReviewBlocked` are the seam the checker calls. They do not change the decision.

Move this commit forward only after you re-read the covered functions at the new commit, confirm this skill and the script still describe them, and `npm run verify:completion-gate` exits 0, or you have updated the recorded findings to match a real change. If those functions changed after this commit and this command was not re-run, the verification needs another look before you trust it.

## After a change that skipped this check

Run `/maintain-formal-verification-skill` to bring this skill back in line with the code.
