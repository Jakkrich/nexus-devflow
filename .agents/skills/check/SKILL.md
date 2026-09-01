---
name: check
description: "[devflow] Prove the current work actually does what its spec says and adheres to architectural standards through a Dual-Axis Independent Review. Supports Multi-Run: given an optional ID or name (/check 12), targets that spec and records proof to devflow/context/{xxx-slug}/findings.md. Drives the app, captures empirical evidence using Playwright and MCP browseros-neo, checks Fowler smells, and reports pass/fail. Use when running /check, confirming work, or validating before /complete."
argument-hint: "[{run-id, number, or name}]"
---

# check - Dual-Axis Independent Verification Engine

$ARGUMENTS

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

Where this sits in the workflow:

    /implement  ->  [check]  ->  /complete
    (built a       (dual-axis       (only once both
     step or        review with      axes pass with
     the feature)   empirical proof) evidence)

`/implement` builds and does a quick build-plus-screenshot check inline. `/check` is the rigorous, repeatable gate for when a feature or step needs **empirical proof** on the running app and **two-axis code review** before merging.

It changes no source and commits nothing — it executes, inspects, and reports observed facts.

---

## Input

- **Given an ID or name** (e.g. `/check 12`, `/check 012`) -> targets `devflow/context/{xxx-slug}/` and records audit ledger to `{xxx-slug}/findings.md`.
- **With no argument** (`/check`) -> verifies the active run matching current git branch or single active spec.

---

## Hybrid Browser Verification Engine

Nexus-DevFlow uses a **Dual-Layer Browser Verification Hierarchy**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🌐 Hybrid Browser Verification Engine                    │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 1. Code-Driven Test Automation (CI)  │ 2. Interactive AI Visual QA (MCP)    │
│    • Framework: Playwright           │    • Server: MCP browseros-neo       │
│    • Command: npm run test:browser   │    • URL: http://127.0.0.1:9010/mcp  │
│    • Purpose: Assertions, Headless,  │    • Purpose: Live DOM Inspection,   │
│      Regression Suite & Pre-commit   │      Real Screenshot Proofs, /try    │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

1. **Layer 1: Code-Driven Repeatable Tests (Playwright)**:
   - If `AGENTS.md` declares `Browser tests: <command>`, run that exact command as repeatable automated evidence.
2. **Layer 2: Interactive AI Visual QA (MCP browseros-neo)**:
   - When the `browseros-neo` MCP server (`http://127.0.0.1:9010/mcp`) is active, use it to inspect the live running app, verify rendered CSS/layout, test click flows, and capture actual screenshot proofs.

---

## Step 1 - Build the Dual-Axis Review Matrix

Read the target spec from `devflow/context/{xxx-slug}/spec.md` and `devflow/context/coding-standards.md`. Prepare the inspection criteria across two independent axes:

1. **Axis 1 (Standards & Architecture Criteria)**:
   - Coding conventions in `coding-standards.md`
   - Deep Modules discipline (Small interface, deep implementation, clean seams, no leaky abstractions)
   - Baseline 12 Fowler Code Smells (Primitive obsession, Feature envy, Shotgun surgery, Speculative generality, etc.)
   - Multi-lane technical gates (Typecheck, test suites, zero secrets, zero P0/P1 findings)
2. **Axis 2 (Spec Fidelity & Behavioral Observables)**:
   - Line-by-line Acceptance Criteria (ACs) and "Done When" observables from `devflow/context/{xxx-slug}/spec.md`
   - Scope Creep detection (Unrequested behavior in the diff)
   - Missing Requirements detection (Unimplemented edge cases)

---

## Step 2 - Get the App Running & Exercise Live Proof

Use the project's real commands (from `AGENTS.md`):

- **Web app**: Start (or reuse) the local dev server. Drive a real browser to relevant routes. If `Browser tests: <command>` is declared, run it. When MCP `browseros-neo` is active, connect to inspect live visual state.
- **CLI**: Execute commands with representative input fixtures, asserting exit codes and output snapshots.
- **Server / API**: Hit endpoints with real payloads and assert on HTTP response status and bodies.
- **Library**: Exercise public interfaces through integration tests or sample scripts.

> [!IMPORTANT]
> **Evidence or it didn't happen**: Every verdict must be backed by empirical evidence (screenshot, command output, status code, response time). Never assume a pass from reading source code alone.

---

## Step 3 - Dual-Axis Independent Report & State Update

Format the report into two distinct, un-merged review axes:

```markdown
# 🔍 Verification Report: [Feature Name]

## ⚖️ Axis 1: Standards, Architecture & Quality Gate

- **Technical Lanes**:
  - [pass] Type Safety: `tsc --noEmit` (0 errors)
  - [pass] Automated Tests: `npm test` (All tests green)
  - [pass] Browser Tests: `npm run test:browser` (Playwright passed)
  - [pass] Visual Inspection: MCP browseros-neo verified UI layout & zero console errors
  - [pass] Security & Hygiene: Zero secrets, sanitized inputs
  - [pass] Findings Ledger: 0 blocking P0/P1 in `devflow/context/{xxx-slug}/findings.md`
- **Deep Modules & Architecture**:
  - [pass] Seam Integrity: Public interfaces remain small, implementation details hidden.
  - [pass] The Deletion Test: Complexity is concentrated inside the module, not scattered across callers.
- **Code Smells Assessment**:
  - [clean] 12 Fowler Code Smells evaluated across git diff: No critical smells detected.

## 🎯 Axis 2: Spec Fidelity & Behavioral Acceptance Gate

Line-by-line verification against `devflow/context/{xxx-slug}/spec.md`:
- [pass] **AC-1 (<title>)**: <Observed empirical evidence / screenshot path>
- [pass] **AC-2 (<title>)**: <Observed empirical evidence / terminal output>
- [fail] **AC-3 (<title>)**: <Exact observed failure with reproduction command>
- [clean] **Scope Creep Check**: No unrequested features or unnecessary abstractions introduced.
- [clean] **Completeness Check**: 100% of spec requirements addressed.

---

## 🚦 Final Routing & Verdict

- **ALL PASSED**: Both axes green. Update `stage.md` (Passed -> Ready for `/complete`).
- **ANY FAILURE**: Hand back to `/implement` with exact failure evidence and reproduction steps.
- **UNVERIFIABLE**: Clearly document the gap and residual risk. Never fabricate a pass.
```