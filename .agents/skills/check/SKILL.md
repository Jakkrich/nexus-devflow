---
name: check
description: "[devflow][F] Prove the current work actually does what its spec says and adheres to architectural standards through a Dual-Axis Independent Review (Spec Fidelity + Standards & Architecture). Drives the app (browser, CLI, or server), captures empirical evidence (screenshots, output, console/network errors), checks against 12 Fowler smells and deep-module standards, and reports pass/fail. Does not edit source or commit - it observes; fixing stays /implement's job. Use when the user runs /check, asks to confirm a step or feature works, wants proof before /complete, or wants to check a change in the running app rather than just the build."
---

# check - Dual-Axis Independent Verification Engine

Where this sits in the workflow:

    /implement  ->  [check]  ->  /complete
    (built a       (dual-axis       (only once both
     step or        review with      axes pass with
     the feature)   empirical proof) evidence)

`/implement` builds and does a quick build-plus-screenshot check inline. `/check` is the rigorous, repeatable gate for when a feature or step needs **empirical proof** on the running app and **two-axis code review** before merging.

It changes no source and commits nothing — it executes, inspects, and reports observed facts.

---

## Input

Optional: a specific target to check (a step, a flow, a URL). With no argument, verify the whole current feature against `devflow/context/current-feature.md` and `devflow/context/coding-standards.md`.

---

## Step 1 - Build the Dual-Axis Review Matrix

Read `devflow/context/current-feature.md` and `devflow/context/coding-standards.md`. Prepare the inspection criteria across two independent axes:

1. **Axis 1 (Standards & Architecture Criteria)**:
   - Coding conventions in `coding-standards.md`
   - Deep Modules discipline (Small interface, deep implementation, clean seams, no leaky abstractions)
   - Baseline 12 Fowler Code Smells (Primitive obsession, Feature envy, Shotgun surgery, Speculative generality, etc.)
   - Multi-lane technical gates (Typecheck, test suites, zero secrets, zero P0/P1 findings)
2. **Axis 2 (Spec Fidelity & Behavioral Observables)**:
   - Line-by-line Acceptance Criteria (ACs) and "Done When" observables from `current-feature.md`
   - Scope Creep detection (Unrequested behavior in the diff)
   - Missing Requirements detection (Unimplemented edge cases)

---

## Step 2 - Get the App Running & Exercise Live Proof

Use the project's real commands (from `AGENTS.md`):

- **Web app**: Start (or reuse) the local dev server. Drive a real browser to relevant routes. Prefer Playwright when installed for screenshots, network errors, and console assertions.
- **CLI**: Execute commands with representative input fixtures, asserting exit codes and output snapshots.
- **Server / API**: Hit endpoints with real payloads and assert on HTTP response status and bodies.
- **Library**: Exercise public interfaces through integration tests or sample scripts.

> [!IMPORTANT]
> **Evidence or it didn't happen**: Every verdict must be backed by empirical evidence (screenshot, command output, status code, response time). Never assume a pass from reading source code alone.

---

## Step 3 - Dual-Axis Independent Report

Format the report into two distinct, un-merged review axes:

```markdown
# 🔍 Verification Report: [Feature Name]

## ⚖️ Axis 1: Standards, Architecture & Quality Gate

- **Technical Lanes**:
  - [pass] Type Safety: `tsc --noEmit` (0 errors)
  - [pass] Automated Tests: `npm test` (All tests green)
  - [pass] Security & Hygiene: Zero secrets, sanitized inputs
  - [pass] Findings Ledger: 0 blocking P0/P1 in `devflow/context/findings.md`
- **Deep Modules & Architecture**:
  - [pass] Seam Integrity: Public interfaces remain small, implementation details hidden.
  - [pass] The Deletion Test: Complexity is concentrated inside the module, not scattered across callers.
- **Code Smells Assessment**:
  - [clean] 12 Fowler Code Smells evaluated across git diff: No critical smells detected.

## 🎯 Axis 2: Spec Fidelity & Behavioral Acceptance Gate

Line-by-line verification against `current-feature.md`:
- [pass] **AC-1 (<title>)**: <Observed empirical evidence / screenshot path>
- [pass] **AC-2 (<title>)**: <Observed empirical evidence / terminal output>
- [fail] **AC-3 (<title>)**: <Exact observed failure with reproduction command>
- [clean] **Scope Creep Check**: No unrequested features or unnecessary abstractions introduced.
- [clean] **Completeness Check**: 100% of spec requirements addressed.

---

## 🚦 Final Routing & Verdict

- **ALL PASSED**: Both axes green. Ready for `/complete`.
- **ANY FAILURE**: Hand back to `/implement` with exact failure evidence and reproduction steps.
- **UNVERIFIABLE**: Clearly document the gap and residual risk. Never fabricate a pass.
```

---

## Why Two Independent Axes?

A code change can pass one axis and fail the other:
- **Standards Pass, Spec Fail**: Code is beautifully architected and tested, but implements the wrong business behavior.
- **Spec Pass, Standards Fail**: Feature works end-to-end, but violates encapsulation, introduces shallow modules, or leaks secrets.

Reporting both axes side-by-side stops elegance from masking functional bugs, and stops functional completeness from excusing architectural rot.

---

## Rules

- **Observe, don't change**: `/check` runs the app and reports. It never edits source or commits. Fixing is `/implement`'s job.
- **Honest over green**: "Failed" and "Could not verify" are valid, valuable outputs. Faking a pass destroys the gate.
- **Check the spec, not vibes**: Verify against documented ACs, not subjective feelings.