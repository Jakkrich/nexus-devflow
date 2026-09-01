---
name: complete
description: "[devflow] Wrap up a finished feature, fix, or rollback. Supports Multi-Run: given an optional ID (/complete 12), archives that run from devflow/context/{xxx-slug}/ to devflow/history/, verifies independent review receipt and findings ledger, cleans up the run workspace, updates build-plan and HISTORY.md, and makes the work commit. Enforces mandatory user gate (Squash-merge vs MR/PR)."
argument-hint: "[{run-id, number, or name}]"
---

# complete - log the finished work, make the work commit, and deliver

$ARGUMENTS

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

Where this sits in the workflow:

    /feature, /fix, or /rollback  ->  /implement  ->  [complete]  ->  next
    (the spec)                         (build it)      (commit + delivery gate)

`/implement` built the feature, fix, or rollback on its branch, with optional per-step commit
checkpoints. This skill closes it out: it logs the work, makes the single
work-level commit, archives from `devflow/context/{xxx-slug}/`, cleans up the active run workspace, and guides the delivery through a **Mandatory User Delivery Gate**. Run it only when the work is done,
reviewed, and the documented `Verify` command, or the fallback build and tests,
passes.

## Multi-Run Target Resolution

- **Given an ID or name** (e.g. `/complete 12`, `/complete 058`) -> targets `devflow/context/{xxx-slug}/` for archiving and cleanup.
- **With no argument** (`/complete`) -> targets the run matching the active branch or single active spec.

## Before you start

Read `devflow/config.json`. A missing file means the built-in defaults apply.
If the file exists but is invalid, stop and point the user to `/doctor`.

Confirm the target work is actually finished: `devflow/context/{xxx-slug}/spec.md`
holds a real spec, its steps are built on a branch, and `Verify`, or the fallback
build and tests, passes. If any of the
spec's done-whens are behavioral, `/check` should have proven them against the
running app first - don't merge or complete on an unverified claim. Uncommitted step work is
expected (per-step checkpoints are optional); this skill commits it. Don't require
the steps to be pre-committed.

Read `devflow/context/{xxx-slug}/review.md` (or `devflow/context/review.md`) when present. A pending,
changes-requested, malformed, or stale record is always a blocker because the
user already initiated that gate, even when its configured policy is `manual`.

## Configured regular quality gates

Use `qualityGates.regular` for this work item:

- **Audit:** `manual` runs only when the user explicitly requests `/audit`; `when-sensitive` runs for sensitive categories; `always` runs for every work item.
- **Independent review:** `manual` runs only when explicitly requested (`/audit independent current`); `when-sensitive` requires it for sensitive domains; `always` requires it for every work item.
- **Check:** `manual` runs only when explicitly requested; `when-behavioral` runs when done-whens need observed runtime behavior; `always` runs for every work item.
- **Try guide:** `manual` runs only when explicitly requested; `when-user-facing` generates guide when change affects UI/UX; `always` generates one for every work item.

## Step 0 - final safety pass

Before logging or committing, run a short safety pass and report blockers only:

- active spec exists in `devflow/context/{xxx-slug}/spec.md` and the work is not being completed directly from `main` or `master`
- changed files are tied to the active spec, with no unrelated dirty work mixed in
- the exact `Verify` command from `AGENTS.md` passed in this session, when one is
  declared; otherwise the build passed, and tests passed when the project has a
  declared test command and the change touched logic
- behavioral done-whens have `/check` evidence or equivalent proof, and there is
  a clear manual try path
- any check required by `qualityGates.regular` has evidence, and there is a clear manual try path
- a selected independent-review gate has a `passed` receipt in `review.md` whose target equals `HEAD`, whose spec hash matches, and whose receipt is current. Any mismatch is stale and blocks completion.
- if workflow files changed, `.agents` and `.claude` stayed in sync where both adapters exist
- no P0 or P1 finding in `devflow/context/{xxx-slug}/findings.md` is `open` or `fixed`.
  `fixed` still blocks on purpose: the repair exists but no review has looked at
  it - run `/audit` to close it. The only waivers are `accepted` or `invalid`.

Do not claim "passed", "verified", or "working" without naming the command,
route, screenshot, or output that proves it. Stop before Step 1 if required
evidence is missing.

## Step 1 - log the work

Check whether the spec is a feature, fix, or rollback. A fix is marked
`Type: Fix` and has no build-plan number. A rollback is marked `Type: Rollback`
and records the exact target feature, archive, commit, and parent.

- **Feature** - archive `devflow/context/{xxx-slug}/spec.md` to `devflow/history/features/{xxx-slug}.md`, check it off in `devflow/build-plan.md` (and its parent item once all sub-items are checked), and record an entry into `devflow/history/HISTORY.md`.
- **Fix** - archive `devflow/context/{xxx-slug}/spec.md` to `devflow/history/fixes/{xxx-slug}.md`, and record an entry into `devflow/history/HISTORY.md`.
- **Rollback** - archive `devflow/context/{xxx-slug}/spec.md` to `devflow/history/rollbacks/YYYY-MM-DD-{xxx-slug}.md`, preserving the original completed feature archive. Uncheck the target item in `devflow/build-plan.md` and record in `devflow/history/HISTORY.md`.

**Archive resolved findings & review receipts.**
- If `devflow/context/{xxx-slug}/findings.md` holds findings, append `## Findings` to the archive file with resolved entries.
- If `devflow/context/{xxx-slug}/review.md` holds a completed passing receipt, append `## Independent Review` to the archive file with the receipt summary.

**Clean up run workspace.** Delete the task directory `devflow/context/{xxx-slug}/`. In Pure Multi-Run architecture, completed work leaves zero residual stubs in `devflow/context/`.

**Discard consumed prototypes.** If this feature built the look from `prototypes/`
delete the `prototypes/` folder now.

## Step 2 - make the work commit on feature branch

Stage everything on the branch (any uncommitted step work plus the Step 1 logging
changes) and make one conventional work commit on the active branch (for example `feat: <feature>`,
`fix: <name>`, or `revert: roll back <feature>`). `Verify`, or the fallback build
and tests, must pass first.

## Step 3 - Mandatory Delivery Gate (Ask User First)

> [!IMPORTANT]
> **MANDATORY USER SELECTION**: In real-world engineering teams, developers often do NOT have direct merge/push access to `main` or `master` (protected branches).
> Therefore, you **MUST STOP AND ASK** the user to choose their desired delivery flow. **NEVER automatically merge into `main` or `master` without explicit user choice.**

Present the user with two clear delivery options:

### 🔀 Option 1: Team MR / PR Flow (Pull latest main/master & Push dev branch) [Default for Teams]
- **When to choose**: When working in a team where code reviews happen via GitLab Merge Request (MR) or GitHub Pull Request (PR), or where developers lack direct write access to protected `main`/`master` branches.
- **Execution Actions**:
  1. Detect default base branch name (`main` or `master`).
  2. Run `git pull origin <main/master>` (or `git fetch origin <main/master> && git merge origin/<main/master>`) to bring the latest upstream changes into the active feature/dev branch.
  3. If merge conflicts occur, highlight them clearly and help the user resolve them.
  4. Run `Verify` (or build & tests) to ensure integrity after the merge.
  5. Run `git push origin <current-feature-branch>` to push the up-to-date branch to the remote repository.
  6. Stop and inform the user that the branch is synchronized and pushed, ready for them to open a Merge Request (MR / PR) on GitLab/GitHub.
  7. **Do NOT merge into local `main`/`master` and do NOT delete the branch.**

### 🔀 Option 2: Direct Local Squash-Merge (Solo / Direct Access Mode)
- **When to choose**: Only when the user explicitly instructs that they want to merge directly into `main` or `master` locally now (e.g. solo projects or Tech Leads with merge privileges).
- **Execution Actions**:
  1. Switch to `main` or `master`: `git checkout <main/master>`.
  2. Squash-merge the branch: `git merge --squash <feature-branch>`.
  3. Commit the squash-merge.
  4. Delete the local feature branch only with the user's explicit consent.
  5. **Stop and ask separately** before pushing local `main`/`master` to remote upstream. The merge approval does NOT count as push approval.
  6. Run `git push origin <main/master>` only after separate explicit confirmation.

---

## Step 4 - Finish & Try Path

Point the user at `/feature`, `/fix`, or `/rollback` for the next task.
Finish with a concise **How to try it** note for the completed work.