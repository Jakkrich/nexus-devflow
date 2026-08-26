---
name: complete
description: "[devflow][F] Wrap up a finished feature, fix, or rollback. Supports Multi-Run: given an optional ID (/complete 12), archives that run from devflow/context/{xxx-slug}/ to devflow/history/, cleans up the run workspace, updates build-plan and HISTORY.md, and makes the work commit. Enforces mandatory user gate (Squash-merge vs MR/PR)."
argument-hint: "[{run-id, number, or name}]"
---

# complete - log the finished work, make the work commit, and deliver

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

Confirm the target work is actually finished: `devflow/context/{xxx-slug}/spec.md` (or `current-feature.md`)
holds a real spec, its steps are built on a branch, and `Verify`, or the fallback
build and tests, passes. If any of the
spec's done-whens are behavioral, `/check` should have proven them against the
running app first - don't merge or complete on an unverified claim. Uncommitted step work is
expected (per-step checkpoints are optional); this skill commits it. Don't require
the steps to be pre-committed.

## Step 0 - final safety pass

Before logging or committing, run a short safety pass and report blockers only:

- active spec exists and the work is not being completed directly from `main` or `master`
- changed files are tied to the active spec, with no unrelated dirty work mixed
  in (a dirty `devflow/context/findings.md` is expected, since `/audit` writes it)
- the exact `Verify` command from `AGENTS.md` passed in this session, when one is
  declared; otherwise the build passed, and tests passed when the project has a
  declared test command and the change touched logic
- behavioral done-whens have `/check` evidence or equivalent proof, and there is
  a clear manual try path
- if workflow files changed, `.agents` and `.claude` stayed in sync where both
  adapters exist
- no P0 or P1 finding in `devflow/context/findings.md` is `open` or `fixed`.
  `fixed` still blocks on purpose: the repair exists but no review has looked at
  it - run `/audit` to close it. The only waivers are `accepted` (the user's
  explicit decision in the current chat, reason recorded; never set it for
  them) or `invalid` (an `/audit` re-examination verdict with recorded
  evidence, or the user's explicit call). A missing ledger file means no
  findings.

Do not claim "passed", "verified", or "working" without naming the command,
route, screenshot, or output that proves it. Stop before Step 1 if required
evidence is missing.

## Step 1 - log the work

Check whether the spec is a feature, fix, or rollback. A fix is marked
`Type: Fix` and has no build-plan number. A rollback is marked `Type: Rollback`
and records the exact target feature, archive, commit, and parent.

- **Feature** - archive `devflow/context/current-feature.md` to `devflow/history/features/NN-name.md`
  (NN is the build-plan number), and check it off in `devflow/build-plan.md`
  (and its parent item once all sub-items are checked).
- **Fix** - archive it to `devflow/history/fixes/name.md`. A fix isn't a build-plan item, so
  there's nothing to check off.
- **Rollback** - archive it to
  `devflow/history/rollbacks/YYYY-MM-DD-NN-name.md`, preserving the original
  completed feature archive. Create `devflow/history/rollbacks/` first if an
  older Blueprint installation does not have it yet. Uncheck the exact target item in
  `devflow/build-plan.md` and its parent when applicable, then append a concise
  note to the target line with the rollback date and archive path. Keep the
  feature number stable. If the user later decides the feature is permanently
  abandoned rather than pending rebuild, that roadmap decision is a separate
  plan edit.

**Archive resolved findings.** If `devflow/context/findings.md` holds any
findings, append a `## Findings` section to the archive file just written with
every `closed`, `accepted`, or `invalid` entry at its final status (`accepted`
entries keep their recorded reason). Prefix each ID with the archive name for
global uniqueness: feature 12's `F-03` becomes `12/F-03`; fixes and rollbacks
use their archive filename as the prefix. An entry carried forward from earlier
work archives with the item that resolved it; its **Found** line preserves
where it came from. Then remove the archived entries from the ledger. Unresolved entries (`open` or `fixed` P2/P3, and `unverified`
leads) stay in the ledger with their IDs so they are never silently dropped.
When nothing remains, reset the ledger to exactly this stub, and create it the
same way if the file is missing (an older install):

    # Findings

    > **Generated file.** The findings ledger: review findings raised by `/audit`
    > against the work in progress, each with a durable ID, severity (P0-P3), and
    > status. `/implement` marks repaired findings `fixed`, a later `/audit` pass
    > moves them to `closed`, and `/complete` refuses to merge while any P0 or P1
    > finding is `open` or `fixed`, then archives resolved findings with the work
    > and resets this file.

    _No findings recorded. `/audit` appends findings here when it finds them._

Then reset `devflow/context/current-feature.md` to its current stub ("nothing
in progress"), including `/rollback` alongside `/feature` and `/fix`. Don't
commit yet; the next step makes one work commit covering the code and these doc
changes. The archive is the build history.

**Discard consumed prototypes.** If this feature built the look from `prototypes/`
- its Design reference pointed there and an early step ported `prototypes/theme.css`
into the app - delete the `prototypes/` folder now. The tokens live in the real
stylesheet and the HTML mockups were always throwaway; fold the deletion into this
feature's commit. Skip this if the feature didn't consume prototypes.

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

Finish with a concise **How to try it** note for the completed work. For a
rollback, explain how to confirm the removed behavior is gone and name one
unaffected regression path. If the
manual path is more than a couple of steps, tell the user to run `/try latest`;
that command can read the archived feature after `current-feature.md` is reset.

## Rules

- **Mandatory User Confirmation Gate**: Always ask before choosing between Team MR/PR Push vs Direct Squash-Merge.
- **Never auto-merge into main/master**: The decision to merge into `main` or `master` belongs strictly to the user.
- The work item is the unit of history: one squashed feature, fix, or rollback
  commit, even if the branch carried several checkpoint commits.
- A rollback preserves the original feature archive and adds a separate rollback
  archive. Never rewrite history to make the feature look as if it never existed.
- Don't merge or push unfinished or failing work. The documented `Verify` command, or
  the fallback build and tests, must pass first.
- Never merge or push while a P0 or P1 finding is `open` or `fixed` in the ledger.
- Pushing to remote is always explicit: confirm before running `git push`.
- One item per completion. If a parent feature still has unchecked sub-features,
  leave the parent unchecked.