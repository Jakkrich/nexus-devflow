# Autonomous Multi-Feature Queue Playbook (`--all` / `--max <N>` / `--merge`)

**Execute unchecked `devflow/build-plan.md` features serially in local isolation without remote pushes or deployments.**

Use this playbook when `/devflow-mode` is invoked with `--all`, `--max <N>`, `--merge` (or legacy `/autopilot --all` / `/continuous`).

## Safety Boundaries
- **NEVER** push to remote repositories, deploy, publish, or delete production data.
- **NEVER** waive failing quality gates, fabricate receipts, or run on `Type: Rollback` (stop and route rollbacks to reviewed `/implement`).
- **Authorized Local Actions**: Create/switch `feature/{xxx-slug}` branches, create local branch checkpoints and immutable review checkpoints, archive via `../../complete/reference/completion-archive.md`, and when `--merge` or `--all` is active, squash-merge verified features onto local `main` and delete the merged local feature branch.

## Steps
1. **Completion Screen & Preflight**: Run `../../complete/reference/completion-screen.md` first (never repeat archival/merge). Verify clean Git state, fresh `project-overview.md`, zero open/fixed P0/P1 findings, and usable `Verify` command. Record starting default-branch SHA.
2. **Select Next Leaf**: Resume an active `devflow/context/{xxx-slug}/spec.md` or pick the next unchecked leaf `- [ ]` in `devflow/build-plan.md` up to `continuous.maxFeatures` / `--max <N>`.
3. **Spec & Isolate**: Create `spec.md` (splitting into `Na`, `Nb` if oversized) and work on `feature/{xxx-slug}` in an isolated worktree/branch with Strict TDD (`[TDD-Red]` -> `[TDD-Green]` -> `[TDD-Refactor]`).
4. **Evaluate `qualityGates.continuous`**:
   - Read `qualityGates.continuous` (`audit`, `independentReview`, `check`, `tryGuide`) and `review.independentExecution` from `devflow/config.json`.
   - Run deterministic `verify-layers`, real-app `verify` / `/check`, and `pstack:interrogate` / `audit independent current` (when `independentReview` is active, spawn and wait for the fresh isolated reviewer subagent against an immutable local checkpoint; if `manual`, stop with handoff).
   - For browser-facing features, run `npm run test:browser` when declared and capture interactive browser evidence when available.
5. **Bounded Repair**: Auto-repair confirmed in-scope P0/P1 findings via a fresh subagent up to `continuous.maxRepairAttempts` (default `2`), then re-verify. Unresolved P0/P1 findings stop the queue.
6. **Local Archive & Delivery**:
   - With `--merge` or `--all`: archive to `devflow/history/features/{xxx-slug}.md`, update `build-plan.md` & `HISTORY.md`, remove `devflow/context/{xxx-slug}/`, squash-merge onto local `main`, delete the merged local branch, and continue to step 2.
   - Without `--merge`/`--all` (single feature or `option-a-evidence-packet` pause): stop on `feature/{xxx-slug}` with the Evidence Packet.
7. **Stop & Report**: If `continuous.finalIntegrationAudit` is `true`, run a cross-feature check from starting SHA to `HEAD`. Report starting/ending SHAs, delivered features, gate verdicts, proof paths, and explicit confirmation that no remote push occurred.
