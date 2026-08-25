# Example Runs & Lifecycle Walkthroughs

This page demonstrates canonical **Nexus-DevFlow 2.6.0** delivery workflows across various real-world scenarios.

---

## 1. Standard Feature Delivery: The Single Living Spec (4 Steps)

Use this flow for planned features, UI updates, refactorings, or architecture upgrades:

```text
/feature "Add password reset flow"
/implement
/check
/complete
```

### Lifecycle Walkthrough:
1. **`/feature "Add password reset flow"`**:
   - Checks Single Active Run Guardrail (must be idle).
   - Allocates sequential ID `024-add-password-reset-flow`.
   - Creates the Single Living Spec in `devflow/context/current-feature.md` with 6 structured sections (Define, Technical Spec, TDD Checklist, Implementation Log, Multi-Lane Verification Matrix, Release Digest).
   - Pauses at the Spec Gate for human alignment.
2. **`/implement`**:
   - Executes checklist tasks one by one with strict TDD discipline (Red-Green-Refactor).
   - Appends implementation evidence to `current-feature.md`.
3. **`/check`**:
   - Runs Senior QA multi-lane verification (Typecheck, Lint, Test suites, behavioral manual proof).
   - Records pass/fail evidence into `current-feature.md`.
4. **`/complete`**:
   - Performs final safety audit, records Release Digest, and presents the Git Delivery Gate.
   - Archives `current-feature.md` ➔ `devflow/history/features/024-add-password-reset-flow.md`.
   - Resets `current-feature.md` to idle stub and updates master `HISTORY.md`.

---

## 2. Ad-Hoc Bug Fix with Root-Cause Analysis

Use `/debug` for non-destructive reproduction, then resolve via `/fix`:

```text
/debug "Session expires prematurely on refresh"
/fix "Session expiry race condition repair"
/implement
/check
/complete
```

### Lifecycle Walkthrough:
1. **`/debug`**: Reproduces defect and isolates root cause without modifying source code.
2. **`/fix`**: Records bug spec and test assertions into `devflow/context/current-feature.md`.
3. **`/implement`**: Implements fix with regression unit test proof.
4. **`/check`**: Proves fix across test suites and running app.
5. **`/complete`**: Archives fix to `devflow/history/fixes/025-session-expiry-repair.md` and manages branch delivery.

---

## 3. Pre-Flight Discovery & Architectural Alignment

For large initiatives, start with pre-flight discovery before opening `/feature`:

```text
/idea "Migrate authentication to OAuth2 & ThaID"
/grill "OAuth2 & ThaID integration architecture"
/feature "OAuth2 and ThaID integration"
/implement
/check
/complete
```

### Lifecycle Walkthrough:
1. **`/idea`**: Captures raw proposal into `devflow/ideas.md` with instant AI feasibility scoring.
2. **`/grill`**: Socratic interview pressure-tests assumptions, extracts domain terms into `devflow/context/glossary.md`, and generates Architecture Decision Records (`devflow/decisions/ADR-xxx.md`).
3. **`/feature`**: Converts approved discovery and ADRs into a buildable Single Living Spec.
4. **`/implement` ➔ `/check` ➔ `/complete`**: Normal 4-stage delivery execution.
