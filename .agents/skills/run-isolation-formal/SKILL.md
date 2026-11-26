---
name: run-isolation-formal
description: "Formal verification for DevFlow concurrent run-ID reservation and same-checkout worktree isolation (RunStateAllocation). Use when editing branch-context.ts, run-state.mjs, or formal/ specs."
---

# Run Isolation Formal Verification

Verifies two concurrency invariants for DevFlow's multi-run orchestration:
1. **NoDuplicateRunningId:** Two concurrent runs never reserve or commit the same 3-digit running ID (`reserveNextRunningId` atomic `wx` lock).
2. **NoSharedMainCheckout:** Two concurrent runs never execute `/implement` simultaneously in the same main checkout without worktree isolation (`evaluateWorktreeGuard`).

## Coverage & Sync Record

- **Guarded source files:**
  - `packages/create-nexus-devflow/lib/branch-context.ts` (`reserveNextRunningId`, `evaluateWorktreeGuard`)
  - `.agents/skills/devflow-help/scripts/run-state.mjs`
- **Formal artifacts (excluded from user package template):**
  - `formal/RunStateAllocation.tla`
  - `formal/RunStateAllocation.cfg`
  - `formal/check-run-isolation.ts`
  - `formal/check-layers.json`
- **Last confirmed in sync at commit:** `99b327b6818dd25a79bc6f143194ce49bddb755a`

## Tool Choice & Scope Bounds

- **Primary runnable verifier (`tsx`):** `formal/check-run-isolation.ts` exhaustively explores every reachable interleaving of the `RunStateAllocation` state machine (`Actors = 2`, `MaxId = 3`) and runs a live parity check against `branch-context.ts` (`reserveNextRunningId` + `evaluateWorktreeGuard`). Chosen because every DevFlow developer already has Node.js + `tsx` installed.
- **TLA+ / TLC & `/statechart`:** `formal/RunStateAllocation.tla` and `formal/RunStateAllocation.cfg` express the exact same state machine for TLC. When Java/TLC is available, inspect any violation or state graph with the pstack `/statechart` skill (`formal/RunStateAllocation.tla`).
- **Scope left out:** TTL-expired lock reclamation race (`expiresAt <= Date.now()` unlink window) and OS crash mid-`writeState` are outside the non-expiring lock bound (`MaxId = 3`).

## Run

Run the formal check plus broken-variant detection proof:

```sh
npx tsx formal/check-run-isolation.ts --prove-detection
```

Or run via DevFlow's Layer 3 gate when guarded files changed:

```sh
npx tsx scripts/tooling.ts verify-layers
```

## Interpreting Results

- Exit `0`: All reachable model states hold `NoDuplicateRunningId` and `NoSharedMainCheckout`, and `branch-context.ts` parity passed.
- Exit `1`: Reports the violated invariant and shortest transition counterexample path (`ReserveId(...) -> ...`). Do not weaken invariants to pass; trace whether the model drifted from `branch-context.ts` or uncovered a real concurrency bug.
- If `branch-context.ts` or `run-state.mjs` changed after the sync commit above, inspect the diff, update `formal/RunStateAllocation.tla` and `formal/check-run-isolation.ts` if transitions changed, verify with `--prove-detection`, and update the sync commit hash.
