# Nexus-DevFlow (The 3-Pillars & Pure Task-Isolated Living Spec Model)

Instructions for AI coding agents working in this project. This is the cross-tool entry point: Codex, Google Antigravity, Cursor, GitHub Copilot, Gemini CLI, Aider, Zed, Windsurf, and others read `AGENTS.md`. Claude Code reads `CLAUDE.md`, which imports this file (`@AGENTS.md`), so there is a single source of truth.

## What this is

This project uses **Nexus-DevFlow**, an agentic workflow layer supporting **The 3-Pillars Workspace Architecture & Pure Task-Isolated Living Spec Model**:
1. **🔮 Future (Backlog)**: `devflow/ideas.md`, `devflow/project-plan.md`, `devflow/build-plan.md` — Centralized Idea Inbox & Master Build Plan.
2. **⚡ Present (Active Context)**: `devflow/context/` — Global Shared Source of Truth (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `glossary.md`) & Active Task Workspaces (`devflow/context/{xxx-slug}/`).
3. **📦 Past (History Archive)**: `devflow/history/` — Categorized delivery archives (`features/`, `fixes/`, `rollbacks/`, and `HISTORY.md`).

To start a new project, scaffold the application first in an empty folder, then run `npx nexus-devflow` (or `npm create @jakkrichm/nexus-devflow`) to overlay DevFlow onto your codebase.

## Read these for full context

- `devflow/config.json` - deterministic project workflow settings
- `devflow/context/project-overview.md` - the project's source of truth
- `devflow/context/coding-standards.md` - engineering conventions & rules to follow
- `devflow/context/ai-interaction.md` - how to interact with the user on this project
- `devflow/context/glossary.md` - domain terms & architecture definitions
- `devflow/context/{xxx-slug}/` - active task living spec, stage, findings ledger, and independent review receipt

## Project configuration

`devflow/config.json` is the user-owned, machine-readable workflow policy for this project. Workflow skills read the relevant settings before acting. A missing file means built-in defaults. An invalid file falls back to defaults for read-only status reporting, but mutating workflow commands stop and point to `/doctor` instead of guessing.

`qualityGates.regular` controls automatic audit, independent-review, check, and try-guide behavior for the normal workflow and Autopilot. `qualityGates.continuous` controls the same per-feature gates for Continuous Mode. Independent review defaults to `when-sensitive` in both workflows, while audit, check, and try guide default to `manual`. Sensitive or unusually broad work therefore selects independent review automatically; ordinary small work does not. Setting a workflow's independent review to `manual` disables that automatic selection, while an explicit `/audit independent current` remains available. The other conditional modes are `when-sensitive` for audit, `when-behavioral` for check, and `when-user-facing` for try guides. `always` runs the gate for every work item in that workflow.

`review.independentExecution` controls how a selected independent-review gate runs. Its default, `automatic`, uses a fresh isolated reviewer child when the active adapter can prove isolation, exact reviewer identity and model, and completion. Otherwise it preserves the request and falls back to the manual handoff. This setting changes execution only; the quality-gate policy still decides whether review is selected. The automatic path spawns a generic child through the current runtime and gives it the installed project-local Audit skill and review contract. It never requires global agent roles or skills. New review requests record requested execution and completed receipts record actual execution. Manual uses `fresh session`; automatic uses `fresh subagent`; an explicit automatic fallback records actual manual with `fresh session`.

New projects default to one review packet after all small implementation steps (`workflow.stepReview: "feature"`) with step checkpoint commits disabled (`workflow.checkpointCommits: "disabled"`). This keeps the normal loop reviewable without repeating the full session context after every step. Set `stepReview` to `every` when teaching, pairing closely, or working on a high-risk change. That restores the per-step approval pauses. To fully restore the previous workflow, including optional checkpoint prompts after an approved step, also set `checkpointCommits` to `enabled`. Onboarding presents these pairs as Efficient and Guided choices, but stores only the two low-level settings. They can be changed at any time. Both styles end with an optional read-only code walkthrough. Review cadence controls approval pauses, not whether the user can ask for an explanation of the finished implementation.

## Tool-Specific Adapters & Execution Rules

The workflow and skills are exposed through tool-specific adapters:

- **OpenAI Codex, Google Antigravity & GitHub Copilot**: `.agents/skills/<skill>/SKILL.md`
- **Claude Code**: `.claude/skills/<skill>/SKILL.md`
- **OpenCode**: `AGENTS.md` plus the compatible `.agents/skills/` or `.claude/skills/` tree already installed for the selected tools

Unused adapter families can be removed. Codex, Antigravity, GitHub Copilot, and OpenCode share `.agents/` and `AGENTS.md`. OpenCode can also reuse `.claude/` when Claude Code is selected. Claude Code projects keep `.claude/` and `AGENTS.md` (via `CLAUDE.md`). Do not duplicate the same DevFlow skills under `.opencode/skills/`; OpenCode already discovers the compatible trees.

### Universal Invocation & Agent Directives:

1. **Canonical Command Names & AI Provider Invocation**: Each workflow stage and companion tool has exactly **one Canonical Name** (e.g. `feature`, `fix`, `implement`, `check`, `complete`, `continuous`, `analyze`, `discovery`, `idea`, `grill`, `brainstorm`, `bughunter`, `devflow`, `doctor`, `overview`, `debug`, `onboard`, `adopt`, `try`, `rollback`, `ci`, `test`, `setup-tests`, `browser-tests`, `autopilot`, `prototype`, `report-html`, `brief`, `audit`, `release`, `convert-any-to-md`, `publish-devflow`, `vendor`). The way you invoke commands depends on your AI Provider / Tool:
   - **Canonical Name (Plain text)**: Directly invoke or prompt the command by its standard name (e.g., `feature`, `implement`, `continuous`, `devflow`, `discovery`, `analyze`).
   - **Slash Prefix (`/`)**: For tools supporting slash commands (Claude Code, Google Antigravity, Gemini CLI), e.g., `/feature`, `/fix`, `/implement`, `/continuous`, `/devflow`, `/discovery`, `/analyze`.
   - **Dollar Prefix (`$`)**: For OpenAI Codex CLI or skill-invocation tools, e.g., `$feature`, `$fix`, `$continuous`, `$devflow`, `$discovery`, `$analyze`.
2. **OpenAI Codex & Non-Native CLI Tools**: In environments without automatic background skill discovery (such as OpenAI Codex CLI, Aider, or generic terminals), **you MUST use your file reading tool to inspect `.agents/skills/<skill>/SKILL.md` before executing the stage** to strictly follow its schema, artifact contract, and quality gates.
3. **Google Antigravity & Claude Code**: Native skill engines automatically discover and surface `.agents/skills/` and `.claude/skills/`.
4. **State-Aware Inspection**: When unsure what to do next, invoke `devflow` to automatically inspect active task directories in `devflow/context/{xxx-slug}/`, `devflow/discoveries/`, and `devflow/ideas.md`.
5. **Default Artifact & Communication Language (Thai)**: All generated markdown stage artifacts (`spec.md`, `discovery.md`, etc.) and user communication MUST default to **Thai (`th`)**, while code, technical terms, file paths, and identifiers remain in English.
6. **Universal Contextual Help & Playbook Protocol (`help`, `--help`, `-h`, `?`)**:
   Whenever any skill or command is invoked with a help keyword or flag (e.g., `/bughunter help`, `bughunter --help`, `/archify -h`, `/check ?`, `/feature help`):
   - **Execution Safety Gate**: DO NOT execute the skill's primary or mutating actions (do not launch scans/attacks, do not modify source code, and do not initialize new task runs).
   - **Dynamic Workspace Inspection**: Read the target skill definition (`.agents/skills/<skill>/SKILL.md`, `.claude/skills/<skill>/SKILL.md`, and any vendored resources such as `devflow/.vendor/<skill>/`), then scan the active workspace (`devflow/context/project-overview.md`, `package.json`, tech stack, active tasks, endpoints, and file hierarchy).
   - **Persistent HTML Playbook & Token-Saving Cache**:
     - **Output Location & Light Theme Mandate**: Compile and persist the tailored playbook as a standalone, styled HTML report at `devflow/docs/playbooks/{skill}.html` adhering to the **Paper/Ink Light Theme Standard** (`data-theme="light"`, teal accent, ruler corner, terminal mockup UI, and diagram slot per `devflow/docs/playbooks/template.html`). Never generate dark-mode-first documentation.
     - **First Run**: Render the comprehensive 5W1H playbook in chat and write the complete HTML report to `devflow/docs/playbooks/{skill}.html`.
     - **Subsequent Invocations (Delta Updates & Zero Token Bloat)**: If `devflow/docs/playbooks/{skill}.html` already exists:
       - Inspect the existing HTML file and compute the diff/delta against the current repository state (e.g., new file paths, modified endpoints, or newly installed vendor assets).
       - DO NOT repeat unchanged boilerplate or full static content in chat.
       - Provide a concise **Delta Summary** in chat (highlighting what changed, new recommendations, or newly available commands).
       - In-place update `devflow/docs/playbooks/{skill}.html` with the fresh timestamp and state.
       - Provide a direct clickable link to [devflow/docs/playbooks/{skill}.html](file:///d:/devtools/nexus-devflow/devflow/docs/playbooks/{skill}.html) for browser viewing.
   - **Render the User-Friendly 5W1H Playbook**: Emit an easy-to-read, practical guide organized around the **5W 1H Framework** (rendered on initial run or updated in the HTML playbook):
      1. **What (Concept & Capabilities)**: Clear, jargon-free summary of what this skill does, its core concept, and its bundled tools/capabilities.
      2. **Why (Problems Solved & Key Benefits)**: The problems it solves, key advantages, and why you should use it instead of ad-hoc manual work.
      3. **Who (Target Roles & Personas)**: Target audience or engineering role (e.g., Feature Developer, Senior QA, Security Auditor, Solo Dev, or Tech Lead).
      4. **Where (Boundaries & Artifact Locations)**: Target workspace boundaries, affected directories, and generated artifact locations (e.g., `devflow/context/`, `devflow/discoveries/`, `findings.md`).
      5. **When (Timing & Prerequisites/Next Steps)**:
         - **Timing & Triggers**: Practical situations or milestones when this skill should be invoked.
         - **Run Before (Prerequisites)**: What to check, prepare, or run beforehand to get the best result.
         - **Run After (Next Steps)**: What DevFlow command or lifecycle stage should follow next (e.g., handing off to `/fix`, `/feature`, or `/complete`).
      6. **How (Execution Lifecycle & Real Command Examples)**:
         - **How It Works (Lifecycle)**: Simple, plain-language breakdown of the execution steps or phases.
         - **Available Commands & Options**: Common sub-commands, arguments, and flags with brief explanations.
         - **Safety, Guardrails & Precautions**: Operational boundaries, credential hygiene, read-only vs. mutating constraints, and explicit special safety constraints / precautions.
      7. **Diagram Slot & Architecture Flow**:
         - **Real Diagram Mandate**: MUST embed a real, verified vector SVG or interactive diagram reflecting actual skill lifecycle, state transitions, or threat models in Light Theme (`data-theme="light"`).
         - **Thai Language & Legible Typography**: Architecture and flow diagrams must describe workflows and nodes in Thai language while preserving technical identifiers, paths, and commands in English. Typography must be sufficiently sized and legible for Thai script (Headers 13–14px, box content/descriptions 11–12px, line spacing 18–22px) to prevent tone marks and vowels from clipping or overlapping.
         - **Strictly No Placeholders**: NEVER output empty placeholder cards, generic instruction text, or phrases like *"when invoking archify..."*. Every playbook must ship with a real visual architectural diagram.
   - Always conclude the response with: `"Help menu displayed successfully"`.

---

## ⚡ The Unified 4-Stage Task-Isolated Living Spec Lifecycle

All development tasks execute through the 4-step progressive lifecycle:

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. **`feature` / `fix` (`/feature`, `/fix`)**:
   - **Purpose**: Combines Discover, Define, Spec, and Plan into one unified step. Allocates sequential ID (`xxx-slug`) and initializes the **Task-Isolated Living Spec (`devflow/context/{xxx-slug}/spec.md`)**, stage pointer (`stage.md`), and dedicated audit ledger (`findings.md`).
   - **Artifact**: `devflow/context/{xxx-slug}/spec.md`
2. **`implement` (`/implement [id]`)**:
   - **Purpose**: Checks out `feature/{xxx-slug}` (or auto-detects from branch), incrementally executes checklist tasks in `devflow/context/{xxx-slug}/spec.md` with TDD discipline (Red-Green-Refactor), and appends diff evidence.
3. **`check` (`/check [id]`)**:
   - **Purpose**: Senior QA review, multi-lane verification matrix (Typecheck, Lint, Test suites, manual proof), and records empirical proof into `devflow/context/{xxx-slug}/spec.md` and findings into `findings.md`.
4. **`complete` (`/complete [id]`)**:
   - **Purpose**: Final safety pass, records Release Digest, automatically archives to `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`, cleanly removes `devflow/context/{xxx-slug}/`, updates `HISTORY.md` and `build-plan.md`, and performs git squash-merge.

---

## 🔮 Pre-Flight Discovery, SA & Architectural Alignment (Companions)

- `analyze`: Unified SA requirement ingestion, multi-format doc parsing (PDF, Word, Excel, images, text), codebase impact scan (`devflow/inbox/`, `devflow/analysis/`).
- `discovery`: Unified pre-delivery discovery & exploration (`devflow/discoveries/{DISC-ID}/discovery.md`).
- `idea`: Quick idea capture and AI feasibility scoring (`devflow/ideas.md`).
- `grill` (or `align`): Socratic alignment, domain modeling, and ADR recording (`devflow/decisions/`).
- `brainstorm`: Divergent/convergent ideation with trade-off analysis.

---

## 📊 Dashboard Activity State Contract

The dashboard and status reporting can show the active or most recent substantial DevFlow command from `devflow/.state/run.json`. This file is generated local state, ignored by Git, and never part of a feature commit.

Commands with meaningful progress or a durable handoff should write it when the state directory exists: `onboard`, `adopt`, `analyze`, `discovery`, `overview`, `feature`, `fix`, `rollback`, `implement`, `debug`, `check`, `audit`, `bughunter`, `setup-tests`, `browser-tests`, `test`, `ci`, `prototype`, `autopilot`, `continuous`, `complete`, and `release`. Short read-only orientation commands such as `brief`, `try`, `status`, and `doctor` do not need activity state. Doctor's optional approved reset removes malformed activity instead of recording another run.

Writing the initial activity record is the first action of a tracked command, before project inspection, preflight, or other tool calls. This one generated state write does not authorize product changes or bypass any safety check.

Never create or edit `run.json` directly. From the project root, use the first helper that exists:

```text
node .agents/skills/doctor/scripts/run-state.mjs <action> <options>
node .claude/skills/doctor/scripts/run-state.mjs <action> <options>
```

Start with `start --command <skill> --summary <truthful-summary> --boundary <boundary>`. Use `update` at meaningful milestones or for a blocker, with `--status blocked` and `--resume <exact-command>` when recovery is needed. End with `finish --status ready|completed --summary <truthful-summary>`. The helper validates every field before atomically replacing the generated file. If it is missing or fails, report the activity warning and continue the workflow without writing a manual fallback.

The helper writes this schema:

```json
{
  "schemaVersion": 1,
  "command": "continuous",
  "status": "running",
  "summary": "Completing the remaining build plan",
  "detail": "Implementing feature 3.",
  "boundary": "local-only",
  "startedAt": "<ISO-8601 timestamp>",
  "updatedAt": "<ISO-8601 timestamp>",
  "resumeCommand": "/continuous resume",
  "progress": { "current": 2, "total": 5, "label": "features" },
  "feature": { "id": "3", "title": "Export reports" }
}
```

`status` must be `running`, `blocked`, `ready`, or `completed`. Use `ready` when the command reached its intended review handoff, such as Autopilot waiting for review before `/complete`. Use `blocked` with the exact recovery command when work can resume. `boundary` must be `read-only`, `reviewed`, or `local-only`. The progress, feature, detail, boundary, and resume fields are optional. Never put secrets, raw logs, prompts, or user content in this file. Activity tracking must not change a command's approval boundaries or turn a reporting failure into a workflow failure.

---

## Verification & Commands

<!-- devflow:onboarding-required -->
- Verify framework integrity: `npm run check`
- Static contract check: `npm run check:static`
- Test installer package: `npm test`
- Package smoke test: `npm run test:package`
- Browser tests (Optional): `npm run test:browser` (via Playwright) + MCP `browseros-neo` (`http://127.0.0.1:9010/mcp`) for interactive live visual QA

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
