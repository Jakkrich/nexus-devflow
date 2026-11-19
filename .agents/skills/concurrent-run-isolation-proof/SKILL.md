---
name: concurrent-run-isolation-proof
description: "Prove concurrent DevFlow runs never overwrite sibling per-run state, never allocate duplicate running IDs across worktrees, obey worktree guards, and aggregate handoffs into status. Use when editing run-state, branch-context, or worktree aggregation."
---

# Concurrent run isolation proof

## Property

Two concurrent DevFlow runs never overwrite each other's `devflow/.state/runs/{run-id}.json` file, never allocate duplicate 3-digit running IDs across worktrees, are blocked by `evaluateWorktreeGuard` before colliding on the same checkout or sibling branch, and aggregate cleanly into `ProjectStatusEngine.getStatus()`.

Harm: concurrent chats silently corrupt another chat's activity state, assign the same `{xxx-slug}` ID, overwrite each other's working tree, or lose sibling worktree handoffs.

## When to run

Run this after any change to:

- `.agents/skills/devflow/scripts/run-state.mjs` (`--run-id`, `writeState`, `findProjectRoot`)
- `packages/create-nexus-devflow/lib/run-state.ts` (`readAllRunStates`, `parseRunState`)
- `packages/create-nexus-devflow/lib/branch-context.ts` (`calculateNextRunningId`, `reserveNextRunningId`, `evaluateWorktreeGuard`, `listWorktreeRunContexts`)
- `packages/create-nexus-devflow/lib/active-context-engine.ts` (`getWorktreeRuns`)
- `packages/create-nexus-devflow/lib/project-status-engine.ts` (`getStatus`, `formatHuman` worktree aggregation)

Also run it when the user invokes `/concurrent-run-isolation-proof`.

From the repo root:

```text
npm run verify:concurrent-isolation
```

That runs `tsx scripts/verify-concurrent-run-isolation.ts` against real temp Git repos, linked worktrees, and concurrent processes/promises.

## How to read the result

Exit 0: all four safety clauses pass (`state-isolation`, `worktree-guard`, `id-uniqueness`, `aggregation-completeness`).

Exit 1: at least one clause printed `FAIL` with the counterexample parameters or collided IDs. Report the counterexample in the code's words. Do not weaken `scripts/verify-concurrent-run-isolation.ts` to hide a failure.

Distinguishing a real bug from a modeling error: the script executes the real exported functions and CLI helper on real filesystems and `git worktree add` checkouts. A failure is a modeling error only if the test setup omitted a required directory precondition (such as a valid `git init` commit before `git worktree add`).

## Updating after an intended change

1. Re-read the modified files listed above.
2. Update `scripts/verify-concurrent-run-isolation.ts` and this skill to reflect the intended contract.
3. Prove the verifier catches a temporary broken mutation, drop the mutation, and confirm `npm run verify:concurrent-isolation` exits `0`.
4. Update the Sync commit below once verified.

## Scope

Covers `9` concurrent `(cmdA, cmdB)` per-run `run-state.mjs` isolation pairs, `16` `evaluateWorktreeGuard` matrix combinations (`2` intents × `2` sibling-branch states × `4` checkout activity states), `3` parallel `reserveNextRunningId` race waves (`4` same-checkout callers, `2` split-worktree callers, `4` split-worktree callers), and `1` end-to-end worktree status + handoff aggregation check (`29` total checks).

Does not cover multi-machine remote branches not fetched into `refs/heads/`, manual edits to `devflow/build-plan.md`, or symlinked parent paths inside `.state/runs/` (covered separately by `scripts/run-state-helper.test.ts`).

## Sync

Covered files: `.agents/skills/devflow/scripts/run-state.mjs`, `packages/create-nexus-devflow/lib/run-state.ts`, `packages/create-nexus-devflow/lib/branch-context.ts`, `packages/create-nexus-devflow/lib/active-context-engine.ts`, `packages/create-nexus-devflow/lib/project-status-engine.ts`.

Base commit before Feature 130: `8ae2f530d29771db26b9f3744034f3bb73994c68` (update to the Feature 130 commit after `/complete`).

## After a change that skipped this check

Run `/maintain-formal-verification-skill` to bring this verification back in line with the code.
