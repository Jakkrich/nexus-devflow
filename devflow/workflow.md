# Nexus-DevFlow Workflow Reference

> On-demand reference for DevFlow workflow configuration, adapters, lifecycle stages, run activity schema, and headless ticket ingestion. Read this when executing or troubleshooting a DevFlow command; keep `AGENTS.md` focused on project-wide session rules.

---

## Project configuration

`devflow/config.json` is the user-owned, machine-readable workflow policy for this project. Workflow skills read the relevant settings before acting. A missing file means built-in defaults. An invalid file falls back to defaults for read-only status reporting, but mutating workflow commands stop and point to `/devflow doctor` instead of guessing.

`qualityGates.regular` controls automatic spec-check, audit, independent-review, check, and try-guide behavior for the normal workflow and Autopilot. `qualityGates.continuous` controls the same per-feature gates for Continuous Mode. Independent review defaults to `when-sensitive` in both workflows, while spec-check (`specCheck`), audit, check, and try guide default to `manual`. Sensitive or unusually broad work therefore selects independent review automatically; ordinary small work does not. Setting a workflow's independent review to `manual` disables that automatic selection, while an explicit `/audit independent current` remains available. The other conditional modes are `when-sensitive` for audit, `when-behavioral` for check, and `when-user-facing` or `when-testable` for try guides (`when-testable` emits a concise 1–3 step `## Try it now` proof for testable/observable changes; `when-user-facing` covers UI changes). `specCheck` accepts `manual` or `always` (opt-in `/feature --check`). `always` runs the gate for every work item in that workflow.

`review.independentExecution` controls how a selected independent-review gate runs. Its default, `automatic`, uses a fresh isolated reviewer child when the active adapter can prove isolation, exact reviewer identity and model, and completion. Otherwise it preserves the request and falls back to the manual handoff. This setting changes execution only; the quality-gate policy still decides whether review is selected. The automatic path spawns a generic child through the current runtime and gives it the installed project-local Audit skill and review contract. It never requires global agent roles or skills. New review requests record requested execution and completed receipts record actual execution. Manual uses `fresh session`; automatic uses `fresh subagent`; an explicit automatic fallback records actual manual with `fresh session`.

New projects default to one review packet after all small implementation steps (`workflow.stepReview: "feature"`) with step checkpoint commits disabled (`workflow.checkpointCommits: "disabled"`), while v3 `execution` (`engine: "auto"`, `tier: "auto"`, `autoApproveSpec: true`, `autoCommitFeatureBranch: true`) and `delivery.gate: "option-a-evidence-packet"` allow `/devflow-mode` to proceed autonomously from spec drafting through local checkpoints until the Option A Final Human Delivery Gate. Direct `/feature` invocation acts as the Spec & Slicing Workbench and pauses at `spec.md` for human review, splitting, or Spec-Ahead grooming unless implementation was requested in the same prompt. Set `stepReview` to `every` (and `autoApproveSpec: false` / `autoCommitFeatureBranch: false`) when teaching, pairing closely, or working on a high-risk change that requires per-step human pauses. Both styles end with an optional read-only code walkthrough. Review cadence controls approval pauses, not whether the user can ask for an explanation of the finished implementation.

### Coexistence with `pstack` (`execution.engine: "auto"`)

When `pstack` is installed alongside DevFlow, DevFlow auto-detects `poteto-mode/SKILL.md` (including in-session `<skills>`, `.agents/plugins/pstack/`, `open-pstack`, and Claude/Codex/Copilot plugin caches) and delegates specialized leaf skills (`arena`, `architect`, `interrogate`, `swarm`, `deslop`, `no-comments`, `why`, `create-verification-skill`) via `/devflow-mode`, `/onboard`, `/check`, and `/audit` while keeping DevFlow as sole Lead Coordinator. Set `session hook: off` in `pstack-models.md` (or `PSTACK_SESSION_HOOK=off`) to prevent dual-coordinator hooks, and place custom DevFlow playbooks in `devflow/playbooks/*.md` (or tag `namespace: devflow` / `devflow:` inside shared `.agents/playbooks/`).

---

## Tool-Specific Adapters & Execution Rules

The workflow and skills are exposed through tool-specific adapters:

- **OpenAI Codex, Google Antigravity & GitHub Copilot**: `.agents/skills/<skill>/SKILL.md`
- **Claude Code**: `.claude/skills/<skill>/SKILL.md`
- **OpenCode**: `AGENTS.md` plus the compatible `.agents/skills/` or `.claude/skills/` tree already installed for the selected tools

Unused adapter families can be removed. Codex, Antigravity, GitHub Copilot, and OpenCode share `.agents/` and `AGENTS.md`. OpenCode can also reuse `.claude/` when Claude Code is selected. Claude Code projects keep `.claude/` and `AGENTS.md` (via `CLAUDE.md`). Do not duplicate the same DevFlow skills under `.opencode/skills/`; OpenCode already discovers the compatible trees.

### Universal Invocation & Agent Directives

1. **Canonical Command Names & AI Provider Invocation**: Each workflow stage and companion tool has **one Canonical Name across the 15 Core Skills** (`feature`, `fix`, `implement`, `check`, `complete`, `discovery`, `explore`, `idea`, `devflow-help`, `overview`, `debug`, `onboard`, `devflow-mode`, `prototype`, `audit`, plus optional opt-in extensions via `npx nexus-devflow skill add` such as `setup-tests`, `ci`, `release`, `rollback`, `vendor`, `convert-any-to-md`, `browseros-neo`). Invocation depends on your AI tool:
   - **Canonical Name (Plain text)**: e.g., `feature`, `implement`, `devflow-mode`, `devflow-help`, `discovery`, `onboard`.
   - **Slash Prefix (`/`)**: Claude Code, Google Antigravity, Gemini CLI, e.g., `/feature`, `/fix`, `/implement`, `/devflow-mode --all`, `/devflow-help`, `/discovery`.
   - **Dollar Prefix (`$`)**: OpenAI Codex CLI, e.g., `$feature`, `$fix`, `$devflow-mode --all`, `$devflow-help`, `$discovery`.
2. **OpenAI Codex & Non-Native CLI Tools**: In environments without automatic background skill discovery, inspect `.agents/skills/<skill>/SKILL.md` before executing the stage to follow its schema, artifact contract, and quality gates.
3. **Google Antigravity & Claude Code**: Native skill engines automatically discover `.agents/skills/` and `.claude/skills/`.
4. **State-Aware Inspection**: When unsure what to do next, invoke `/devflow-help` (or `/devflow`) to inspect active task directories in `devflow/context/{xxx-slug}/`, `devflow/discoveries/`, and `devflow/ideas.md` (or `/devflow-help doctor` for diagnostics).
5. **Default Artifact & Communication Language (Thai)**: All generated markdown stage artifacts (`spec.md`, `discovery.md`, etc.) and user communication MUST default to **Thai (`th`)**, while code, technical terms, file paths, and identifiers remain in English.
6. **Contextual Help**: When a DevFlow command is invoked with `help`, `--help`, `-h`, or `?`, follow [the help protocol](devflow/reference/help-playbook-protocol.md) to render a concise Markdown cheat sheet in chat without running the command's primary action or creating a task run.

---

## ⚡ The Unified 4-Stage Task-Isolated Living Spec Lifecycle

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. **`feature` / `fix` (`/feature`, `/fix`)**: Spec & Slicing Workbench that combines Discover, Define, Spec, and Plan into one unified step. Allocates sequential ID (`xxx-slug`) and initializes `devflow/context/{xxx-slug}/spec.md`, `stage.md`, and `findings.md`; direct `/feature` stops at `spec.md` ready for `/devflow-mode {xxx-slug}` or `/implement {xxx-slug}`.
2. **`implement` (`/implement [id]`)**: Checks out `feature/{xxx-slug}`, incrementally executes checklist tasks in `devflow/context/{xxx-slug}/spec.md` with TDD (Red-Green-Refactor), and appends diff evidence.
3. **`check` (`/check [id]`)**: Senior QA review, multi-lane verification matrix (Typecheck, Lint, Test suites, manual proof), recording empirical proof into `spec.md` and findings into `findings.md`.
4. **`complete` (`/complete [id]`)**: Final safety pass, records completion archive under `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`, cleanly removes `devflow/context/{xxx-slug}/`, updates `HISTORY.md` and `build-plan.md`, and guides local squash-merge or team MR/PR delivery.

### 🔮 Pre-Flight Discovery, SA & Architectural Alignment (Companions)

- `discovery`: Macro roadmap planning, micro pre-delivery exploration (`devflow/discoveries/{DISC-ID}/discovery.md`), SA multi-format requirement intake (`devflow/inbox/`, `devflow/analysis/`), and Socratic alignment (`glossary.md`, `devflow/decisions/`).
- `explore`: Read-only codebase investigation and 2–3 option trade-off comparison (Brainstorm mode).
- `idea`: Quick idea capture and AI feasibility scoring (`devflow/ideas.md`).
- `feature --preview`: Read-only build-plan scope, dependency, and sizing preview before drafting `spec.md`.

### 🧩 Opt-in Team & Ops Extensions (`npx nexus-devflow skill add <name>`)

- `browseros-neo`: Custom team E2E testing (`--verify`) and live E2E debugging (`--debug`) over BrowserOS neo MCP. Resolves `{run-id}` (`{xxx-slug}`, `DISC-*`, or `adhoc-YYYYMMDD-HHMMSS`), tags `name_session` with `{run-id}` for native BrowserOS video/session replay (no video files stored in `devflow/`), and writes mandatory `devflow/reports/{run-id}/browser-test-plan.md` + `evidence.md` (+ `screenshots/`, gitignored).
- `setup-tests`, `ci`, `release`, `rollback`, `vendor`, `convert-any-to-md`: Tier-2 setup, ops, and document conversion extensions stored in `extras/skills/` (`publish-devflow` is repo-local in `.agents/skills/` for framework maintainers only).

### 🌿 Parallel Worktree Workflows & Recovery

- **One work item per worktree / clone**: Keep each active feature, fix, or rollback isolated in its own Git worktree (or separate clone) with its own `devflow/context/{xxx-slug}/` workspace. Never modify or remove sibling worktrees automatically.
- **Pre-created worktree branch start**: `/feature` and `/implement` allow starting on an empty branch already checked out in the *current* linked worktree (for example via `git worktree add ../wt -b feature/xxx-slug`) when it has no commits ahead of local default and no conflicting archive in `devflow/history/`, while refusing branches locked by another worktree.
- **Worktree-safe landing & `main`-advanced recovery**: Inside a linked worktree (`--git-dir` != `--git-common-dir`), `git checkout <main/master>` fails if `<main/master>` is open in the primary checkout — Option 1 runs squash-merge from the primary checkout (or uses Option 2 PR/MR). When parallel merges advance `main`, sync additively (`devflow/build-plan.md`, `devflow/history/HISTORY.md`), regenerate `/overview`, re-verify, and refresh any stale independent review receipt (`HEAD` changed).

---

## Activity state contract

Status reporting shows the active or most recent substantial DevFlow command from per-run state files under `devflow/.state/runs/{run-id}.json` (with `devflow/.state/run.json` retained as legacy single-run fallback). These files are generated local state, ignored by Git, and never part of a feature commit. The `dashboard`, `ui`, and `studio` commands are removed. Use `nexus-devflow status` or `nexus-devflow mcp`.

Substantial mutating or multi-step workflow commands (`onboard`, `overview`, `feature`, `fix`, `rollback`, `implement`, `check` verification mode, `devflow-mode`, `complete`) may publish progress on a best-effort basis when `devflow/.state/` or the helper exists. Read-only, diagnostic, and lightweight commands (`audit`, `debug`, `discovery`, `explore`, `idea`, `prototype`, `devflow-help`, `/feature --preview`, and `/check guide`) do not need to write activity state.

Never create or edit `run.json` or `runs/*.json` directly. When recording best-effort activity from the project root, use the first helper that exists:

```text
node .agents/skills/devflow-help/scripts/run-state.mjs <action> --run-id <xxx-slug> <options>
node .claude/skills/devflow-help/scripts/run-state.mjs <action> --run-id <xxx-slug> <options>
```

Start with `start --run-id <xxx-slug> --branch <branch> --worktree <root> --command <skill> --summary <truthful-summary> --boundary <boundary>`. Use `update` at meaningful milestones, for handoff summaries (`--handoff-next`, `--handoff-note`, `--handoff-files`, `--handoff-decisions`), or for a blocker with `--status blocked` and `--resume <exact-command>`. End with `finish --run-id <xxx-slug> --status ready|completed --summary <truthful-summary>`. The helper validates every field before atomically replacing the generated file. If it is missing or fails, report the activity warning and continue the workflow without writing a manual fallback.

The helper writes this schema:

```json
{
  "schemaVersion": 1,
  "command": "devflow-mode",
  "status": "running",
  "summary": "Completing the remaining build plan",
  "detail": "Implementing feature 3.",
  "boundary": "local-only",
  "startedAt": "<ISO-8601 timestamp>",
  "updatedAt": "<ISO-8601 timestamp>",
  "resumeCommand": "/devflow-mode --all resume",
  "progress": { "current": 2, "total": 5, "label": "features" },
  "feature": { "id": "3", "title": "Export reports" }
}
```

`status` must be `running`, `blocked`, `ready`, or `completed`. Use `ready` when the command reached its intended review handoff, such as Autopilot waiting for review before `/complete`. Use `blocked` with the exact recovery command when work can resume. `boundary` must be `read-only`, `reviewed`, or `local-only`. The progress, feature, detail, boundary, and resume fields are optional. Never put secrets, raw logs, prompts, or user content in this file. Activity tracking must not change a command's approval boundaries or turn a reporting failure into a workflow failure.

---

## 📥 Headless Spec & Tracer-Bullet Tickets Ingestion

Nexus-DevFlow natively supports ingesting specifications and tickets generated by external workflows (such as Matt Pocock's `/to-spec` and `/to-tickets`, prompt-driven sessions, or issue trackers):

1. **Workspace Location**: Place your task specification and tracer-bullet tickets into the task context directory:
   - **Living Spec**: `devflow/context/{xxx-slug}/spec.md`
   - **Tickets**: `devflow/context/{xxx-slug}/issues/<NN>-<slug>.md` or `devflow/context/{xxx-slug}/tickets/<NN>-<slug>.md`
2. **Dependency Frontier Resolution**: Each ticket specifies `Blocked by: <list of blockers | None>` along with its acceptance checklist.
3. **Seamless Execution**:
   - Run `/implement {xxx-slug}` to automatically checkout `feature/{xxx-slug}`, compute the unblocked dependency frontier, and execute the earliest ready ticket with TDD discipline (`--ticket <NN>` for direct targeting).
   - Run `/check {xxx-slug}` and `/complete {xxx-slug}` to verify and archive as standard DevFlow deliveries.
