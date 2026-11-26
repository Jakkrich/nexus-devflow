---
name: verify-project
description: "Maintainer verification workflow for the nexus-devflow repository. Run static contract checks, unit/integration suites, and tarball template-isolation smoke checks before completing any change."
---

# Verify Project (`nexus-devflow` Maintainers)

Prove behavior against the real repository, built CLI, and packaged npm tarballs — never rely on compilation alone.

## Launch

Confirm execution is at the `nexus-devflow` repository root (`package.json` `"name": "nexus-devflow"`, Node.js `>=18.17`):

```powershell
node -v
Test-Path package.json
```

## Doctor

Run static, contract, security-hygiene, and workspace doctor checks:

```powershell
npm run typecheck
npm run check:static
npm run validate:docs
npx tsx scripts/tooling.ts scan-security-hygiene --dir packages/create-nexus-devflow/bin
npx tsx scripts/tooling.ts scan-security-hygiene --dir packages/create-nexus-devflow/lib
npx tsx scripts/tooling.ts scan-security-hygiene --dir packages/create-nexus-devflow/scripts
npx tsx scripts/tooling.ts scan-security-hygiene --dir packages/nexus-devflow
npx tsx packages/create-nexus-devflow/bin/create-nexus-devflow.ts doctor
```

Expected: `0` TypeScript errors, `Nexus-DevFlow framework static validation completed successfully!`, zero doc-contract or security-hygiene violations, and `doctor` reports `0 warnings, 0 failed`.

## Drive

Exercise the full automated verification matrix and built package smoke checks:

1. **Framework & Routing Gate** (runs `typecheck`, workspace paths, `validate-framework.ts`, `routing.ts`, eval/link tests, `create-nexus-devflow` build + unit tests, and `smoke-package.ts`):
   ```powershell
   npm run check
   ```
2. **Root & Tooling Suites** (`create-nexus-devflow` tests, `test:overview`, `test:sandbox`, `test:run-state`, `test:tooling`):
   ```powershell
   npm test
   ```
3. **Release & Tarball Boundary Gate** (4-way SemVer lockstep, 15 Core Skills/adapter, 8 extras, sanitized starter plans & `AGENTS.md`/`CLAUDE.md`, zero leaked maintainer or `agent-starter-kit` files):
   ```powershell
   npm run check:release
   ```
4. **Targeted Concurrency & Resilience Proofs** (required when editing `branch-context.ts`, `run-state.mjs`, `update.ts`, `project-status-engine.ts`, or `formal/`):
   ```powershell
   npm run verify:concurrent-isolation
   npm run verify:update-resilience
   npm run verify:completion-gate
   ```

## Evidence

Record exact commands executed and observed pass/file counts (never extrapolate) in:
- [`.context/cos-board.md`](../../../.context/cos-board.md)
- [`AI_HANDOFF.md`](../../../AI_HANDOFF.md) (`## 5. Change Log`)

## Cleanup

Confirm no temporary template build outputs or forbidden legacy artifacts remain, and inspect the working tree:

```powershell
npm --prefix packages/create-nexus-devflow run clean-template
Test-Path .cursor
Test-Path packages/create-nexus-devflow/template
git status --short
git diff --stat
```

Expected: both `Test-Path` checks return `False`, and `git status --short` shows only intended changes.
