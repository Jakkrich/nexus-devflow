---
name: continuous
description: "[devflow] Autonomous multi-feature delivery loop in Nexus-DevFlow: completes planned features serially from devflow/build-plan.md without review pauses. Maintains safety boundaries, Task-Isolated Living Spec, branch isolation, TDD verification, quality gates, and local squash-merges into main. Use when running /continuous, $continuous, or executing Continuous Mode."
argument-hint: "[{resume, max-features, or start-feature}]"
---

# continuous - Complete the Build Plan One Local Feature at a Time

**Context reuse:** Reuse any required file already loaded in project instructions or the current session. Read it again only if absent, changed, or exact current bytes or line references are needed.

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

Where this sits in the workflow:

```text
/status  ──▶  [continuous]  ──▶  Final Review Packet
(ready)       (Serial Loop:      (Local main only,
               Spec ➔ TDD ➔       never pushed)
               Gates ➔ Merge)
```

Continuous Mode (`/continuous` or `$continuous`) is an explicit opt-in loop for
completing planned features serially from `devflow/build-plan.md` in local isolation
without pausing at normal human review prompts. It preserves the same strict
**The 3-Pillars Model & Task-Isolated Living Spec (`devflow/context/{xxx-slug}/spec.md`)**,
disciplined TDD verification, quality gates, findings ledger, branch isolation, and
one clean local main commit per feature that a careful human workflow would produce.

### Authorized Local Actions for this Run:
- Create and switch local feature branches (`feature/{xxx-slug}`)
- Create configured checkpoint commits on those branches
- Create required immutable independent-review checkpoints
- Create the final local feature commit
- Squash-merge a completed feature into the local default branch (`main`)
- Delete the merged local feature branch
- Repeat with the next unchecked build-plan item

### Strict Safety Boundaries:
- **NEVER** push to remote repositories
- **NEVER** deploy or publish externally
- **NEVER** delete production data, destroy databases, or run irreversible migrations
- **NEVER** accept findings or waive failing quality gates on behalf of the user
- Always stop before those actions and hand off to the user

---

## Input & Target Selection

Before selecting a new feature or requiring an active live spec, always inspect
pending completion using the installed Complete skill and
`../complete/reference/completion-recovery.md`. Use its read-only candidate screen
first: settled clean default-branch history needs no historical transient objects
for a new run. An actual completion candidate or an explicit request to resume
interrupted completion requires full recovery proof, using this run's scoped Git
authority and `qualityGates.continuous`. Do not repeat archival or a work commit/merge.
Missing, conflicting, or unprovable recovery evidence stops before next-feature work.
An active feature with no completion candidate resumes implementation normally; its
ordinary `resume` does not require an archive or completion proof.

With no argument after pending completion has been reconciled:

1. Resume an active feature in `devflow/context/{xxx-slug}/spec.md`.
2. Otherwise select the next unchecked leaf item (`- [ ]`) in `devflow/build-plan.md`.
3. Continue in build-plan order until no unchecked leaf remains or
   `continuous.maxFeatures` completed features have been counted.

`resume` explicitly resumes the active feature or its pending completion.
A feature number or name may set the starting item only when no different work item
is active. After that item, continue with the next unchecked leaf items in normal
build-plan order.

Continuous Mode handles planned features only. If the active work is a fix or rollback,
stop and point to its normal reviewed workflow. Never overwrite active work to make
the requested target fit.

---

## Step 1: Preflight Safety Check

Read initial context:
- `AGENTS.md`
- `devflow/config.json` (if missing, use safe defaults; if invalid, stop and point to `/doctor`)
- `devflow/project-plan.md` and `devflow/build-plan.md`
- `devflow/context/project-overview.md`
- `devflow/context/{xxx-slug}/` (if work is already active)
- `devflow/context/coding-standards.md` and `devflow/context/ai-interaction.md`
- Git status (`git status`, `git branch`, default branch, and recent log)

### Start Conditions:
1. The project is a Git repository.
2. The working tree is clean on the default branch, or all dirty work belongs to the
   active feature on its matching configured feature branch, including proven pending
   completion handled through the recovery contract.
3. `devflow/build-plan.md` is a valid ordered checkbox plan with at least one remaining leaf.
4. Overview is fresh. If stale but both plans are clear and consistent, refresh it
   using `/overview` behavior and include that change with the first feature.
5. Existing P0 or P1 findings are not `open` or `fixed`.
6. Project commands and the exact `Verify` command, when declared, are usable.
7. Record the starting default-branch commit SHA for the final integration summary.

The initial `devflow/.state/run.json` record required by `AGENTS.md` must already show
command `continuous` and status `running` before preflight begins. After preflight passes,
enrich it with boundary `local-only`, the current feature, and completed-feature progress
against the smaller of the remaining queue or configured limit. Update it when a feature
starts, after every passing build step, after each quality gate, and after each local main
commit. On a stop, set status `blocked` with `/continuous resume` when resuming is safe.
At the end of the queue or limit, set status `completed`.

---

## Step 2: Serial Feature Lifecycle

Execute the loop one feature at a time in strict order:

### 2.1 Select & Spec
- If resuming: Reuse the existing spec in `devflow/context/{xxx-slug}/spec.md`.
- If new feature: Extract requirements from `devflow/build-plan.md` and initialize the
  task workspace at `devflow/context/{xxx-slug}/` with `spec.md`, `stage.md`, and `findings.md`.
  Check `../feature/reference/build-history.md` for `--build-N` naming conventions if
  rebuilding a previously rolled-back feature, ensuring existing archives in
  `devflow/history/features/` are never overwritten. Self-review the spec before coding.

### 2.2 Create / Resume Feature Branch
- Use the configured branch prefix (e.g., `feature/{xxx-slug}`) from the current local default branch.
- When resuming, require the existing branch and active spec to agree.
- If switching would strand unrelated work or the default branch changed unsafely, stop.
  Never stash, reset, or discard work automatically.

### 2.3 Implement Small Steps with Strict TDD
Execute the spec in order, one small diff at a time:
1. `[TDD-Red]`: Write the failing unit test first.
2. `[TDD-Green]`: Implement the minimal code to pass the test.
3. `[TDD-Refactor]`: Clean up and ensure all verifications pass cleanly.
4. Check off the step (`- [x]`) in `spec.md`.
5. When `workflow.checkpointCommits` is `enabled`, create a conventional local
   checkpoint commit containing that passing step and its checked spec state.
   When `disabled`, keep the work uncommitted until feature completion.

### 2.4 Apply Continuous Quality Gates
Evaluate `qualityGates.continuous` in `devflow/config.json`:
- **Audit**: `manual` skips automatic audit; `when-sensitive` runs `/audit current`
  for authentication, authorization, payments, secrets, personal or user data, migrations,
  destructive operations, external side effects, security boundaries, or unusually broad changes;
  `always` audits every feature.
- **Independent Review**: Read `qualityGates.continuous.independentReview`; `manual` skips
  automatic review; `when-sensitive` requires an isolated reviewer for the same sensitive
  categories as Audit; `always` requires an isolated reviewer for every feature. A passing
  independent receipt satisfies the Audit gate for that feature.
- **Check**: `manual` skips automatic `/check`; `when-behavioral` runs it when a done-when
  needs observed runtime behavior (UI, CLI, API, background job); `always` checks every feature.
- **Try Guide**: `manual` skips automatic generation; `when-user-facing` generates a guide
  for UI, CLI, or user-facing workflows; `always` generates one for every feature.

Run required gates in order: check, review, then try guide. When independent review is
selected, ensure application code is in a clean immutable checkpoint. First rerun final
verification and selected Check gate and set spec status to `verified`. This review
checkpoint is covered by Continuous Mode authority even when step checkpoint commits are
disabled. Follow `/audit independent current`.

With `review.independentExecution: "automatic"`, spawn and wait for the isolated reviewer
subagent and validate its receipt before continuing. With `manual`, or when runtime cannot
prove isolation, identity, model, or completion, set activity to `ready` and stop with the
manual handoff. Continuous Mode never audits its own work.

The request records `Requested execution`; the receipt records `Actual execution`. Require
the execution and reviewer-context pairing defined by the review contract. A pending request
without `Requested execution` is legacy manual-only.

For browser-facing features, run `npm run test:browser` when `test:browser` script exists
and collect interactive evidence via `browseros-neo` when available.

### 2.5 Repair Findings
- Automatically repair confirmed P0 and P1 findings directly caused by the feature, up to
  `continuous.maxRepairAttempts` times.
- After repair, rerun affected verification and re-audit the repaired area.
- Any unresolved P0 or P1 finding left `open` or `fixed` stops the loop before completion.

### 2.6 Complete Locally Like a Human
Apply the `/complete` safety, logging, and archive behavior without asking commit and merge prompts:
1. Run final documented verification.
2. Confirm the current spec status is `verified`.
3. Capture source tree / annotation proof per `../complete/reference/completion-recovery.md`
   and embed `<!-- devflow:completion {...} -->` in the archive.
4. Place the archive at `devflow/history/features/{xxx-slug}.md`.
5. Update checkboxes in `devflow/build-plan.md` and append entry to `devflow/history/HISTORY.md`.
6. Remove the active run directory `devflow/context/{xxx-slug}/`.
7. Switch to the local default branch, squash-merge the feature branch, and create one
   conventional commit containing product work, tests, and DevFlow history.
8. Delete the merged local feature branch.
9. Confirm the default branch is clean before selecting the next feature.

---

## Step 3: Optional Final Integration Audit

When the feature queue completes or `continuous.maxFeatures` is reached, if
`continuous.finalIntegrationAudit: true`, execute an integration compatibility check
(Cross-Feature Contracts & Seams) covering the span from the starting commit to current HEAD.

---

## Step 4: Stop & Report

When Continuous Mode finishes (either fully completed or stopped at a safety boundary),
present a concise summary report in Thai (per user communication rules):
- Starting and ending commit SHAs of the local default branch.
- List of features delivered in this run with their commit hashes.
- Summary of quality gates executed and findings resolved.
- Overall progress of `devflow/build-plan.md` and next upcoming feature.
- Clear reminder that **no remote push or deployment has occurred**.
