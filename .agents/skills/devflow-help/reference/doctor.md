# DevFlow Doctor Checklist (`/devflow-help doctor` / `/devflow doctor`)

Read-only diagnostic pass for setup drift, incomplete onboarding, missing files, placeholder plans, stale overview, `pstack` engine availability, playbook anchor drift, and malformed `devflow/.state/run.json`. Never edits project code, commits, installs, runs builds/tests, or switches branches. Its only repair is an approved reset of a malformed regular `devflow/.state/run.json` file.

## What it checks

1. **Required DevFlow files**
   - Confirm `AGENTS.md`, `devflow/workflow.md`, `devflow/project-plan.md`, `devflow/build-plan.md`, and `devflow/context/` (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `glossary.md`) exist.
   - Confirm `devflow/history/features/` and `devflow/history/fixes/` exist.
   - Check `devflow/context/{xxx-slug}/findings.md` (format `### <id> [<severity>] <status> - <title>`) and `review.md` (pending, changes-requested, malformed, or stale state). Report open/fixed P0/P1 blockers without blocking Doctor itself.
   - Read `devflow/config.json` when present (require regular non-symlink JSON with `schemaVersion: 1`; reject unknown keys/unsupported values). Report regular & continuous quality gates (`audit`, `independentReview`, `check`, `tryGuide`, `specCheck`), `review.independentExecution`, `execution` (`engine`, `tier`, `autoApproveSpec`, `autoCommitFeatureBranch`), and `delivery.gate`.
2. **Tool adapters, `pstack` & playbooks**
   - Read `.nexus/nexus-devflow.json` and report logical adapters (`codex`, `claude`, `copilot`, `antigravity`, `opencode`).
   - Confirm at least one compatible skill tree (`.agents/skills/` or `.claude/skills/`) contains `devflow-help/scripts/run-state.mjs`.
   - Flag missing mirror skills when both trees exist, duplicate `.opencode/skills/`, or incomplete `/onboard` (`CLAUDE.md` placeholder `# Project Name`).
   - Probe `execution.engine` (`auto` / `pstack` / `native`) via `execution_engine_pstack`: report detected `poteto-mode/SKILL.md` path (including on-project `.agents/plugins/pstack/`, `open-pstack`, and Claude/Codex/Copilot caches) or native fallback status (warn if `engine: "pstack"` and `pstack` is absent). When `pstack` is detected, advise setting `session hook: off` in `pstack-models.md` (or `PSTACK_SESSION_HOOK=off`) so DevFlow remains sole Coordinator.
   - If `devflow/playbooks/`, `.agents/playbooks/`, or `~/.agents/playbooks/` exists, run `node .agents/skills/devflow-mode/scripts/check-playbooks.mjs` and report any broken `when:` or `extends:` anchor (`poteto-mode` playbooks in shared `.agents/playbooks/` are automatically ignored).
3. **Commands, setup & visibility**
   - Check root `README.md` is not an obsolete `# AI Coding Blueprint` doc and `devflow/README.md` is absent.
   - Check `AGENTS.md` is compact (`<= 8,000` bytes), has proportional-engineering guidance and real `## Commands`, and verify `.github/workflows/verify.yml` if present.
   - Confirm whether DevFlow files are tracked or local-only via `.gitignore`.
4. **Plans, Overview freshness & Run state**
   - Report build-plan counts and placeholder text.
   - Report `devflow/context/project-overview.md` size (**At or above 20,000 bytes, call it oversized** and require `/overview` before `/feature`) and `devflow:source-hash` freshness.
   - Inspect `devflow/.state/run.json`: refuse symlinks; if malformed regular JSON, explain resetting removes only run activity and offer: `Reset the malformed run state now?` On approval, run `node .agents/skills/devflow-help/scripts/run-state.mjs reset` (never delete `devflow/.state/`, manifest, or backups).
5. **Git & Worktrees**
   - Report branch, clean/dirty state, last commit, ahead count, and `git worktree list --porcelain` conflicts (`main` ahead of merge-base, `commondir` hooks).

## Output format

    Health: Pass | Needs attention | Blocked
    Setup: ...
    Engine & pstack: ...
    Verification: ...
    Adapters: ...
    Visibility: ...
    Plans: ...
    Workflow: ...
    Git: ...
    Watch: ...
    Repair order: ...
