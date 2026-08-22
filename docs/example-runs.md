# Example Runs & Lifecycle Walkthroughs

This page shows canonical DevFlow 2.0 delivery runs across Fast-Track and Deep-Track modes.

---

## 1. Fast-Track: Daily Feature Delivery (4 Steps)

Use Fast-Track for 85% of daily work (features, UI adjustments, refactoring) driven by the Single Living Spec.

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
   - Creates the Single Living Spec in `devflow/context/current-feature.md` with Given-When-Then acceptance criteria and task checklist.
   - Stops at review gate for human alignment.
2. **`/implement`**:
   - Executes checklist tasks one by one with TDD discipline (Red-Green-Refactor).
   - Appends implementation evidence to `current-feature.md`.
3. **`/check`**:
   - Runs Senior QA 6-lane verification matrix (Typecheck, Lint, Tests, Manual Proof, Security).
   - Records pass/fail evidence into `current-feature.md`.
4. **`/complete`**:
   - Performs final safety audit and Conventional Commit.
   - Archives `current-feature.md` ➔ `devflow/history/features/024-add-password-reset-flow.md`.
   - Resets `current-feature.md` to idle stub and squash-merges git branch.

---

## 2. Fast-Track: Ad-hoc Bug Fix with Root-Cause Analysis

Use `/debug` for non-destructive reproduction, then resolve via `/fix`.

```text
/debug "Session expires prematurely on refresh"
/fix "Session expiry race condition repair"
/implement
/check
/complete
```

### Lifecycle Walkthrough:
1. **`/debug`**: Reproduces defect and isolates root cause without editing code.
2. **`/fix`**: Records bug spec and test assertions into `devflow/context/current-feature.md`.
3. **`/implement`**: Implements fix with regression unit test.
4. **`/check`**: Proves fix in running app.
5. **`/complete`**: Archives fix to `devflow/history/fixes/025-session-expiry-repair.md` and merges.

---

## 3. Deep-Track: Architectural Epic (8 Steps)

Use Deep-Track for database migrations, core architectural shifts, or multi-agent orchestration.

```text
/00-explore "Migrate user authentication to OAuth2 & ThaID"
/10-define
/20-spec
/30-plan
/40-execute
/50-verify
/60-report
/70-deliver
```

### Lifecycle Walkthrough:
1. **`/00-explore`**: Explores problem space, evaluates feasibility, and records Go/No-Go decision in `devflow/discoveries/DISC-xxx/00-explore.md`.
2. **`/10-define`**: Locks delivery boundaries in `devflow/context/current-run/10-define.md` and allocates sequential ID `026-oauth2-thaid-migration`.
3. **`/20-spec`**: Formalizes markdown delivery contract with strict boundary rules.
4. **`/30-plan`**: Breaks down spec into executable task units with TDD test decisions.
5. **`/40-execute`**: Implements tasks incrementally behind review gates (`40-execute.md`).
6. **`/50-verify`**: Senior QA 6-lane verification matrix and edge case proof (`50-verify.md`).
7. **`/60-report`**: Creates standardized delivery digest and retrospective insights (`60-report.md`).
8. **`/70-deliver`**: Packages release, calculates SemVer, archives `current-run/` ➔ `devflow/history/features/026-oauth2-thaid-migration/`, and closes run.
