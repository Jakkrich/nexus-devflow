---
name: autopilot
description: "[Devflow] Optional explicit mode for one bounded Fast-Track or Deep-Track delivery pass with checkpoint commits and review packet."
---

# autopilot - Autonomous Bounded DevFlow Loop

Where this sits in the workflow:

```text
devflow  ->  [autopilot]  ->  review packet  ->  /complete (fast) / 70-deliver (deep)
(where        (fast or deep      (human review,        (package, PR,
 are we?)      track loop)        walkthrough)           merge with approval)
```

Autopilot is an explicit opt-in execution skill for Nexus-DevFlow 2.0. It runs one bounded loop without requiring human confirmation between every sub-step, in either track:

- Fast-Track: `feature` / `fix` -> `implement` -> `check`.
- Deep-Track: `20-spec` -> `30-plan` -> `40-execute` -> `50-verify` -> `60-report`.

It does **not** replace the normal step-by-step workflow. Mainline commands (`feature`, `fix`, `implement`, `check`, `complete`, `20-spec`, `30-plan`, `40-execute`, `50-verify`, `60-report`, `70-deliver`) remain the conservative default.

Do not suggest Autopilot as the default next action. Use it only when the user explicitly asks for it.

The explicit Autopilot request is permission to create checkpoint commits on the feature/fix branch after passing implementation steps. It is **not** permission to merge into `main`, push to remote, deploy, publish, delete data, or run destructive actions.

## Input

Common forms:

- **No argument**: resume the active run in `devflow/context/current-stage.md`, or target the next planned run/feature in `devflow/context/project-overview.md`.
- **`fast`**: force Fast-Track mode. Example: `autopilot fast "add auth header"`
- **`deep`**: force Deep-Track mode. Example: `autopilot deep "data migration"`
- **Running ID or feature name**: target that run, e.g. `autopilot RUN-004` or `autopilot "add user authentication"` (mode auto-selected from context).
- **`fix "<issue>"`**: write and execute an ad-hoc fast-mode fix run.
- **`resume`**: continue the current active run on its existing branch.

If the requested target conflicts with a run already in progress, stop and ask which one should win. Do not overwrite active stage artifacts silently.

> [!IMPORTANT]
> Rollback is intentionally excluded from Autopilot. If the request is a rollback or the stage is marked Rollback, stop and direct the user to `rollback` and reviewed `40-execute`. Reversing completed work requires explicit dependency and human review gates.

## Step 1 - Preflight & Safety Check

Read the project state:

- `AGENTS.md` & `CLAUDE.md`
- `devflow/context/project-overview.md`
- `devflow/context/current-stage.md`
- `devflow/context/current-feature.md`
- `devflow/context/current-run/` artifacts
- `devflow/context/coding-standards.md`
- `devflow/context/ai-interaction.md`
- `devflow/context/findings.md`
- git branch, status, and recent log

Track mode selection:

1. Use explicit `fast` or `deep` if provided.
2. If `devflow/context/current-feature.md` is active and `current-run/` has no deep stage files, default to **fast**.
3. If `devflow/context/current-run/` has deep stage files (`10-define.md`, `20-spec.md`, `30-plan.md`, etc.), default to **deep**.
4. If both tracks are active, stop and ask which track should win.

Stop before changing files when:

1. The repo is not a git repository.
2. The working tree is dirty with uncommitted changes unrelated to this run.
3. `current-stage.md` has an active run and the user requested a different target without resolving conflict.
4. The task requires architectural, financial, auth, billing, or destructive decisions not documented in the context.

## Step 2 - Choose or Write Specification

### Fast-Track

1. If `devflow/context/current-feature.md` already exists and is active, resume it.
2. If no spec exists:
   - Write or refresh the spec in `devflow/context/current-feature.md`.
   - Lock scope, acceptance criteria, and implementation checklist.
   - Add feasibility checks and test hooks.
3. Critique and red-team the spec (edge cases, unhappy paths, testable criteria), then apply fixes.

### Deep-Track

1. If `devflow/context/current-run/20-spec.md` already exists, resume it.
2. If no spec exists:
   - Ensure `10-define.md` exists with locked scope and allocated Running ID.
   - Write `20-spec.md` following the DevFlow specification schema.
   - Critique and red-team the spec (edge cases, unhappy paths, testable criteria), then apply fixes.

## Step 3 - Branch Setup & Implementation Plan (`30-plan`)

1. **Branch Management**:
   - Feature: `feature/{slug}-{running-id}`
   - Fix: `fix/{slug}-{running-id}`
   - Switch to or create the working branch. Never run Autopilot directly on `main` or `master`.
2. **Planning**:
   - **Fast-Track**: maintain the implementation and verification checklist sections in `devflow/context/current-feature.md`.
   - **Deep-Track**: write `devflow/context/current-run/30-plan.md` and seed `checklists/implementation-checklist.md` and `checklists/verification-checklist.md`.

## Step 4 - Implement in Small Increments (`40-execute`)

Work through the implementation checklist in order. Each step must remain reviewable.

For every subtask:

1. Implement only that scoped unit.
2. Run relevant verification (unit tests, typecheck, lint, build).
3. If UI is involved, inspect behavior, verify console errors and network calls.
4. Self-review diff against `coding-standards.md`.
5. Fix issues and rerun failed checks.
6. Mark the task checked `[x]`.
7. **Create a Checkpoint Commit** on the feature/fix branch for the passing step:
   ```bash
   # Fast-Track
   git add <modified-files> devflow/context/current-feature.md
   git commit -m "feat({running-id}): checkpoint <concise step description>"

   # Deep-Track
   git add <modified-files> devflow/context/current-run/{running-id}-{slug}/checklists/implementation-checklist.md
   git commit -m "feat({running-id}): checkpoint <concise step description>"
   ```
8. **Fast-Track**: write implementation status to `devflow/context/current-feature.md`.
9. **Deep-Track**: write `devflow/context/current-run/{running-id}-{slug}40-execute.md`.

## Step 5 - Senior QA Verification (`50-verify`)

1. Execute full project verification commands:
   - Framework integrity (`npm run check` or equivalent)
   - Static contracts (`npm run check:static` when applicable)
   - Project test suite (Unit tests, integration tests)
   - Build / Package smoke tests
2. Update verification evidence with concrete evidence in the active track artifact:
   - **Fast-Track**: `devflow/context/current-feature.md`
   - **Deep-Track**: `checklists/verification-checklist.md`
3. **Deep-Track**: write `devflow/context/current-run/{running-id}-{slug}50-verify.md` with QA verdict (`PASS` / `FAIL`).
4. **Fast-Track**: confirm check stage transition and verification state in `devflow/context/current-feature.md`.

## Step 6 - Targeted Quality Audit & Repair

Review diffs and inspect `devflow/context/findings.md`:

1. **Repair confirmed P0 and P1 findings** within the current run scope.
2. Update finding status in `devflow/context/findings.md`.
3. Rerun verification tests after repairs.
4. Create a checkpoint commit for the fix.
5. If a P0/P1 finding cannot be repaired within scope or fails twice consecutively, stop immediately and report.

## Step 7 - Review Packet & Track Handoff

1. **Deep-Track**: write `devflow/context/current-run/{running-id}-{slug}60-report.md`, render standalone HTML dashboard `devflow/context/current-run/{running-id}-{slug}60-report.html` (via `md2html` or report generator), and set `devflow/context/current-stage.md` to ready for `70-deliver`.
2. **Fast-Track**: keep final checkpoint and evidence in `devflow/context/current-feature.md`.
3. Stop with a concise **Review Packet Dashboard** for human approval, including:
   - Track used (`fast` or `deep`)
   - Evidence summary
   - Commit count
   - Manual next action (`/complete` for fast, `/70-deliver` for deep)

## 🛑 Strict Hard Stops (Never Exceed)

Stop immediately and report to the user instead of continuing when Autopilot would need to:

- Commit directly to `main` or `master`, merge branches, delete branches, or force push.
- Run `git push` to remote repositories.
- Deploy to staging/production or publish packages to npm/registries.
- Delete data, drop databases, or run irreversible destructive migrations.
- Make product, business, or architecture decisions not specified in the context.
- Continue after two failed attempts to fix the same issue (Two-attempt hard stop).

## Output Review Packet Format

When Autopilot finishes successfully, output a scannable review packet:

```markdown
### 🛸 Autopilot Execution Summary: [{running-id}] ({track})

- **Branch**: `{branch-name}`
- **Target Run**: `{running-id} - {title}`
- **Artifacts Generated**:
  - **Fast-Track**:
    - Spec/Build/Verify evidence: `devflow/context/current-feature.md`
  - **Deep-Track**:
    - Spec: `devflow/context/current-run/{id}20-spec.md`
    - Plan: `devflow/context/current-run/{id}30-plan.md`
    - Implement Evidence: `devflow/context/current-run/{id}40-execute.md`
    - QA Verify Report: `devflow/context/current-run/{id}50-verify.md`
    - Digest Report: `devflow/context/current-run/{id}60-report.md`
    - HTML Dashboard: `devflow/context/current-run/{id}60-report.html`
- **Validation & Tests**: track-aware PASS/FAIL evidence
- **Checkpoint Commits**: `{count} commits created on {branch-name}`
- **Manual QA Walkthrough**: Run `try {running-id}` for human review guide

---
👉 **Next Recommended Action**:
Inspect diffs and `try` walkthrough.
- Fast-Track: run `/complete {running-id}` for final safety and merge flow.
- Deep-Track: run `70-deliver {running-id}` to package, merge, or create PR.
```
