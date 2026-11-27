# Feature Playbook

**Coordinator owns design, 3-Pillars state (`spec.md`, `build-plan.md`, `findings.md`), verification, and verdict. Delegate implementation to isolated worktree subagents.**

1. Trace the affected subsystem and load `devflow/context/project-overview.md` plus `devflow/build-plan.md`.
2. Initialize `devflow/context/{xxx-slug}/spec.md` (`stage.md`, `findings.md`) via `/feature`; proceed autonomously when `execution.autoApproveSpec` is `true` and all 4 pre-flight gates pass.
3. For multi-shape or boundary-crossing designs (`execution.tier: "high-risk"` or ambiguous architecture), run `/explore` or `/prototype` before locking contracts.
4. Delegate code-writing in an isolated worktree (`feature/{xxx-slug}` or `Workspace: "share"` / `git worktree add`) with Strict TDD (`[TDD-Red]` -> `[TDD-Green]` -> `[TDD-Refactor]`) and named data shapes.
5. Run pre-review hygiene (remove dead debug logs, unused comments, and duplication) and commit locally on the non-default branch when `execution.autoCommitFeatureBranch` is `true`.
6. Run the **Verifier Swarm** in fresh contexts (never the builder):
   - Lane 1: `verify-layers` (`lint`/`typecheck` -> `tests` -> `formal`).
   - Lane 2: Project `verify` driver skill (or `/check`) on the real surface with artifacts saved to `devflow/reports/{run-id}/`.
   - Lane 3: `audit independent current` keeping only findings reproduced by an actual run.
7. Auto-repair confirmed in-scope P0/P1 findings via a fresh repair subagent and re-verify (up to `continuous.maxRepairAttempts`, default `2`).
8. Stop at **Option A Final Human Delivery Gate** (`delivery.gate: "option-a-evidence-packet"`): present branch, diff summary, lane verdicts, proof artifact paths, and exact rerun commands for `/complete`.
