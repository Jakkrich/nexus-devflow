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

Before requiring a real active spec, check for pending completion using
`reference/completion-recovery.md`. A matching archive may mean archival was
interrupted, the work commit awaits merge, or the merge already finished. Follow
that phase instead of restarting logging. Missing or ambiguous evidence stops
with concrete recovery steps; an archive or clean context never authorizes selecting new work.
Recovery uses archive and Git proof, never dashboard activity as authority.

For a normal completion with no recovery in progress, continue below.

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

### Independent review execution

After final Verify and required Check pass, set the active spec to `verified`.
If a selected or previously initiated independent review does not already have a
current passing receipt:

1. Use an existing current pending request and its immutable target when one is
   present. Otherwise show the exact product, test, and verified-spec candidate
   for the immutable review checkpoint. Obtain explicit commit approval under
   the normal Git rules, then create or use that clean checkpoint. Configuration,
   including `review.independentExecution: "automatic"`, never grants permission
   to commit. A pending request without `Requested execution` is legacy and
   manual-only; never add execution fields or run a subagent against it.
2. Prepare Phase A of `/audit independent current` when no current request
   exists. Record `Requested execution` from `review.independentExecution`.
3. For requested `automatic`, start the generic isolated current-runtime child
   from the installed project-local Audit skill, wait, and validate the normal
   receipt. Freeze parent product, test, spec, and config changes while it runs.
4. For requested `manual`, or when automatic isolation, identity, model, or
   completion is unavailable, preserve the pending request, set activity to
   `ready`, and stop with the manual fresh-session handoff.
5. Continue Complete only with a current passing receipt whose requested and
   actual execution fields match the allowed review contract. Never self-review
   or silently skip the gate.

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

Follow `reference/completion-recovery.md` to capture the source tree and compact
archive annotation before any logging edits. Preserve the exact verified spec
prefix, its UTF-8 byte length and SHA-256, branch, original HEAD, and local base.
Record the reference's narrow `absentOptional` proof before creating any optional
findings/review stub on an older installation; tree absence alone is insufficient.
Prepare the entire archive, including the sections below and any generated try
guide, before placing it at its destination in `devflow/history/features/`, `fixes/`, or `rollbacks/`. An existing matching archive
enters recovery; never overwrite it or append duplicate sections.

Check whether the spec is a feature, fix, or rollback. A fix is marked
`Type: Fix` and has no build-plan number. A rollback is marked `Type: Rollback`
and records the exact target feature, archive, commit, and parent.

- **Feature** - archive `devflow/context/{xxx-slug}/spec.md` to `devflow/history/features/{xxx-slug}.md`, check it off in `devflow/build-plan.md` (and its parent item once all sub-items are checked), recompute the overview fingerprint using `/overview`'s checkbox-normalized hash contract and update `devflow:source-hash` in `devflow/context/project-overview.md`, and record an entry into `devflow/history/HISTORY.md`.
- **Fix** - archive `devflow/context/{xxx-slug}/spec.md` to `devflow/history/fixes/{xxx-slug}.md` preserving canonical post-mortem blocks (Summary, Symptom, Root Cause mechanism, Why it produced symptom, Fix, How found, Why slipped through, Validation, Action items), and record an entry into `devflow/history/HISTORY.md`.
- **Rollback** - archive `devflow/context/{xxx-slug}/spec.md` to `devflow/history/rollbacks/YYYY-MM-DD-{xxx-slug}.md`, preserving the original completed feature archive. Uncheck the target item in `devflow/build-plan.md` and record in `devflow/history/HISTORY.md`.

**Archive resolved findings & review receipts.**
- If `devflow/context/{xxx-slug}/findings.md` holds findings, append `## Findings` to the archive file with resolved entries.
- If `devflow/context/{xxx-slug}/review.md` holds a completed passing receipt, append a `## Independent review` section to the archive file with the receipt fields, commands, safe evidence references, findings, and remaining risk from `review.md`. Preserve the full target and base SHAs, spec hash, base ref, builder adapter and model, requested reviewer, model, and execution, actual reviewer adapter, model, and execution, Check result, fresh-context declaration, and review time. Do not archive a stale, pending, changes-requested, or malformed record.

**Clean up run workspace.** Delete the task directory `devflow/context/{xxx-slug}/`. In Pure Multi-Run architecture, completed work leaves zero residual stubs in `devflow/context/`.

**Discard consumed prototypes.** If this feature built the look from `prototypes/`
delete the `prototypes/` folder now.

## Step 2 - make the work commit on feature branch

Show the complete product and logging diff with the proposed commit message,
then obtain explicit commit approval. Only then stage the reviewed branch work
(any uncommitted step work plus the Step 1 logging
changes) and make one conventional work commit on the active branch (for example `feat: <feature>`,
`fix: <name>`, or `revert: roll back <feature>`). `Verify`, or the fallback build
and tests, must pass first.


## Step 3 - Mandatory Delivery Gate (Ask User First)

> [!IMPORTANT]
> **MANDATORY USER SELECTION**: In real-world engineering teams, developers often do NOT have direct merge/push access to `main` or `master` (protected branches).
> Therefore, you **MUST STOP AND ASK** the user to choose their desired delivery flow. **NEVER automatically merge into `main` or `master` without explicit user choice.**

Present the user with two clear delivery options:

### 🔀 Option 1: Direct Local Squash-Merge / Direct Commit (Solo Mode - For Solo Development)
- **When to choose**: When working alone (Solo Developer) or possessing direct merge/commit authority to `main` or `master` locally.
- **Execution Actions**:
  1. If on a feature branch: Switch to `main` or `master` (`git checkout <main/master>`), squash-merge the branch (`git merge --squash <feature-branch>`), and commit the work.
  2. If working directly on local `main`/`master`: Commit the changes directly to the active branch.
  3. Delete the local feature branch only upon explicit user confirmation.
  4. **Always stop and ask separately** before pushing local `main`/`master` to the remote upstream repository. Merge approval never implies push approval.
  5. Run `git push origin <main/master>` only after separate explicit confirmation.

### 🔀 Option 2: Team MR / PR Flow (Team Mode - For Teams / Multi-Developer)
- **When to choose**: When collaborating in a team with more than one person where code changes require peer review via GitLab Merge Request (MR) or GitHub Pull Request (PR), or where developers lack direct write access to protected `main`/`master` branches.
- **Execution Actions**:
  1. Detect the default base branch name (`main` or `master`).
  2. Run `git pull origin <main/master>` (or `git fetch origin <main/master> && git merge origin/<main/master>`) to bring the latest upstream changes into the active feature/dev branch.
  3. If merge conflicts occur, highlight them clearly and guide the user through resolution.
  4. Run `Verify` (or build & tests) to ensure integrity after the merge.
  5. Run `git push origin <current-feature-branch>` to push the up-to-date branch to the remote repository.
  6. Stop and inform the user that the branch is synchronized and pushed, ready for them to open a Merge Request (MR / PR) on GitLab/GitHub.
  7. **Do NOT merge into local `main`/`master` and do NOT delete the branch.**



---

## Step 4 - Finish & Try Path

Point the user at `/feature`, `/fix`, or `/rollback` for the next task.
Finish with a concise **How to try it** note for the completed work.

### 📢 Leadership & Stakeholder Summary (Channel-Ready)

Optionally output a concise, leadership-flavored digest (ready for Slack, JIRA comment, or standup):
- **Translate**: Reframe engineering mechanism into customer/business impact in 1-2 plain sentences.
- **Keep**: Product/feature names, PR number, JIRA ticket keys, and owner.
- **Strip**: Function names, file paths, struct fields, and internal code minutiae.