# Continuous Multi-Feature Loop (`--all` / `--max <N>` / `--merge`)

Use this reference when `/autopilot` is invoked in continuous multi-feature mode (`--all`, `--max <N>`, `--merge`, or legacy `/continuous`).

Continuous Queue Mode completes planned features serially from `devflow/build-plan.md` in local isolation without pausing at normal human review prompts. It preserves **The 3-Pillars Model & Task-Isolated Living Spec (`devflow/context/{xxx-slug}/spec.md`)**, strict TDD, quality gates, findings ledger, branch isolation, and one clean local main commit per feature.

### Authorized Local Actions for this Run
- Create and switch local feature branches (`feature/{xxx-slug}`)
- Create configured checkpoint commits and required immutable independent-review checkpoints
- Create the final local feature commit
- Squash-merge a completed feature into the local default branch (`main`) and delete the merged local feature branch
- Repeat with the next unchecked build-plan item

### Strict Safety Boundaries
- **NEVER** push to remote repositories, deploy, or publish externally
- **NEVER** delete production data, destroy databases, or run irreversible migrations
- **NEVER** accept findings or waive failing quality gates on behalf of the user

## Input & Target Selection

Before selecting a new feature or requiring an active live spec, always screen pending completion using the installed Complete skill and `../../complete/reference/completion-screen.md`. Use its read-only candidate screen first. Only when an actual completion candidate or explicit `resume` is detected, read `../../complete/reference/completion-recovery.md` for full recovery proof using `qualityGates.continuous`. Never repeat archival or a work commit/merge.

With no explicit starting item after pending completion is reconciled:
1. Resume an active feature in `devflow/context/{xxx-slug}/spec.md`.
2. Otherwise select the next unchecked leaf item (`- [ ]`) in `devflow/build-plan.md`.
3. Continue in build-plan order until no unchecked leaf remains or `continuous.maxFeatures` / `--max <N>` completed features have been counted.

Continuous Mode handles planned features only. If the active work is a fix or rollback, stop and point to its normal reviewed workflow.

## Step 1: Preflight Safety Check

Read initial context (`AGENTS.md`, `devflow/config.json`, `devflow/project-plan.md`, `devflow/build-plan.md`, `devflow/context/project-overview.md`, `devflow/context/{xxx-slug}/`, `coding-standards.md`, `ai-interaction.md`, git status). Stop if `devflow/config.json` is invalid and point to `/devflow doctor`.

### Start Conditions
1. The project is a Git repository.
2. Working tree is clean on default branch, or all dirty work belongs to the active feature on its matching feature branch.
3. `devflow/build-plan.md` is a valid ordered checkbox plan with at least one remaining leaf.
4. `project-overview.md` is fresh (or regenerate it via `/overview` behavior if plans are clear and consistent).
5. No existing P0 or P1 findings are `open` or `fixed`.
6. Project commands and exact `Verify` command are usable.
7. Record the starting default-branch commit SHA for the final integration summary.

Publish `command: continuous` and `status: running` to `devflow/.state/run.json` via `devflow/scripts/run-state.mjs`, enrich with `boundary: local-only`, update per feature/step/gate/commit, set `blocked` with `/autopilot --all resume` on safe stop, and set `completed` at queue end.

## Step 2: Serial Feature Lifecycle

Execute one feature at a time in strict order:
1. **Select & Spec**: Reuse active `spec.md` or initialize `devflow/context/{xxx-slug}/{spec.md,stage.md,findings.md}`. Check `../../feature/reference/build-history.md` for `--build-N` rules if rebuilding a rolled-back feature.
2. **Branch**: Create or check out `feature/{xxx-slug}` from current local default branch.
3. **Implement Small Steps with Strict TDD**: `[TDD-Red]` -> `[TDD-Green]` -> `[TDD-Refactor]`, check off `- [x]` in `spec.md`. Commit step checkpoints when `workflow.checkpointCommits` is `enabled`.
4. **Apply Continuous Quality Gates (`qualityGates.continuous` in `devflow/config.json`)**:
   - Evaluate `audit`, `independentReview` (`qualityGates.continuous.independentReview`), `check`, and `tryGuide` (`../../check/reference/try-it-now.md`).
   - Run gates in order: check, review, then try guide. When independent review is active, verify final checks, set `spec.md` status to `verified`, create an immutable review checkpoint commit, and execute `/audit independent current` (`review.independentExecution: "automatic"` spawns and waits for isolated reviewer; `"manual"` stops with handoff). Continuous Mode never audits its own work.
   - For browser-facing features, run `npm run test:browser` when declared and collect interactive browser evidence via an active browser MCP when available.
5. **Repair Findings**: Repair confirmed in-scope P0/P1 findings up to `continuous.maxRepairAttempts` times, re-verify, and re-audit. Unresolved P0/P1 findings stop the loop.
6. **Complete Locally Like a Human**:
   - Confirm `spec.md` status is `verified`, capture `sourceTree` and `<!-- devflow:completion {...} -->` per `../../complete/reference/completion-archive.md`, archive to `devflow/history/features/{xxx-slug}.md`, update `devflow/build-plan.md` and `devflow/history/HISTORY.md`, remove `devflow/context/{xxx-slug}/`, switch to local default branch, squash-merge `feature/{xxx-slug}` into one conventional commit, delete the merged local branch, and confirm clean default branch before selecting the next feature.

## Step 3: Optional Final Integration Audit & Step 4: Stop & Report

If `continuous.finalIntegrationAudit: true`, run a cross-feature integration check from starting commit to `HEAD`. When finished or stopped, present a concise Thai report with starting/ending commit SHAs, delivered features & commits, quality gates/findings summary, build-plan progress, and explicit confirmation that **no remote push or deployment has occurred**.
