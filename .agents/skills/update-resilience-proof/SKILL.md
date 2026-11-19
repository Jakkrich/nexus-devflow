---
name: update-resilience-proof
description: "Prove overlay update and rollback never overwrite customized, non-regular, symlinked, or protected files and roll back atomically on failure. Use when editing update.ts or running /update-resilience-proof."
---

# Update resilience proof

## Property

`prepareUpdate` and `applyPreparedUpdate` never silently overwrite customized or non-regular files, never prune protected/vendor/modified orphans, reject symlinked parent paths, and roll back disk and manifest state atomically when a write fails mid-update.

Harm: a broken update silently destroys user-edited specs, custom skills, or third-party skills, or leaves a project half-updated with a mismatched `.nexus/nexus-devflow.json`.

## When to run

Run this after any change to `packages/create-nexus-devflow/lib/update.ts`, especially:

- `prepareUpdate` conflict and orphan classification (lines 294-460)
- `applyPreparedUpdate` staging, backup, apply, and rollback (lines 488-639)
- `copyFileAtomic` and `assertNoSymlinkParents` (lines 667-789)

Also run it when the user invokes `/update-resilience-proof`.

From the repo root:

```text
npm run verify:update-resilience
```

That runs `tsx scripts/verify-update-resilience.ts` using Node and `tsx` (already dev dependencies). It completes in a few seconds using isolated temp directories.

## How to read the result

Exit 0: all five safety clauses pass (`conflict-guard`, `no-overwrite-gate`, `protected-orphan-guard`, `rollback-atomicity`, `symlink-guard`).

Exit 1: at least one clause printed `FAIL` with the counterexample parameters (`category`, `rel`, `prevRecord`, `templatePresence`, `diskState`) or failure state. Report the counterexample as short steps in the code's terms. Do not weaken `scripts/verify-update-resilience.ts` or edit `update.ts` unless the user asks for a fix.

Distinguishing a real bug from a modeling error: `scripts/verify-update-resilience.ts` calls the real `prepareUpdate`, `applyPreparedUpdate`, `assertNoSymlinkParents`, and `createManifest` exports against real files on disk. A failure is a modeling error only if the test setup violated a precondition of `update.ts` (for example, malformed manifest JSON or unrequested `replaceConflicts: true`).

## Updating after an intended change

If a change in `update.ts` intentionally alters conflict, protection, or rollback behavior:

1. Re-read the changed functions in `packages/create-nexus-devflow/lib/update.ts`.
2. Update `scripts/verify-update-resilience.ts` and this skill to match the intended contract.
3. Prove the updated verifier catches a temporary broken mutation, drop the mutation, and confirm `npm run verify:update-resilience` exits `0`.
4. Update the Sync commit below only after verification passes.

## Scope

Covers an exhaustive matrix of `180` combinations (`6` file categories x `3` manifest record states x `2` template presence states x `5` on-disk states), `48` `applyPreparedUpdate(..., { replaceConflicts: false })` conflict-gate checks, `1` mid-apply directory-collision rollback check, and `1` symlinked parent check (`junction` in temp dir; skipped only if the OS denies symlink/junction creation, which is printed explicitly).

Does not cover `role` skill filtering (`getSkillsForRole`), `thirdPartySkills` live network sync, `handleExtrasSkillsSetup`, or uninstall (`uninstall.ts`).

## Sync

Covered file: `packages/create-nexus-devflow/lib/update.ts`.

Sync commit: `ee050bf3042d5848d3f5387c9ad3d7b7af8a32ae`.

Move this commit forward only after re-reading `update.ts` at the new commit, confirming this skill and `scripts/verify-update-resilience.ts` still match, and observing `npm run verify:update-resilience` exit `0`.

## After a change that skipped this check

Run `/maintain-formal-verification-skill` to bring this verification back in line with the code.
