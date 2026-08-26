# Nexus-DevFlow 2.6.2 (The 3-Pillars & Single Living Spec Model)

Instructions for AI coding agents working in this project. This is the cross-tool entry point: Codex, Google Antigravity, Cursor, GitHub Copilot, Gemini CLI, Aider, Zed, Windsurf, and others read `AGENTS.md`. Claude Code reads `CLAUDE.md`, which imports this file (`@AGENTS.md`), so there is a single source of truth.

## What this is

This project uses **Nexus-DevFlow**, an agentic workflow layer supporting **The 3-Pillars Workspace Architecture & Single Living Spec Model**:
1. **🔮 Future (Backlog)**: `devflow/ideas.md` — Centralized Idea Inbox with AI scoring.
2. **⚡ Present (Active Context)**: `devflow/context/` — Living Source of Truth & Active Work (`current-feature.md` Single Living Spec).
3. **📦 Past (History Archive)**: `devflow/history/` — Categorized delivery archives (`features/`, `fixes/`, `rollbacks/`, and `HISTORY.md`).

To start a new project, scaffold the application first in an empty folder, then run `npx @jakkrichm/create-nexus-devflow` to overlay DevFlow onto your codebase.

## Read these for full context

- `devflow/config.json` - deterministic project workflow settings
- `devflow/context/project-overview.md` - the project's source of truth
- `devflow/context/coding-standards.md` - engineering conventions & rules to follow
- `devflow/context/ai-interaction.md` - how to interact with the user on this project
- `devflow/context/current-stage.md` - active discovery or running delivery state
- `devflow/context/findings.md` - quality, security, and verification ledger
- `devflow/context/glossary.md` - domain terms & architecture definitions

## Project configuration

`devflow/config.json` is the user-owned, machine-readable workflow policy for this project. Workflow skills read the relevant settings before acting. A missing file means built-in defaults. An invalid file falls back to defaults for read-only status reporting, but mutating workflow commands stop and point to `/doctor` instead of guessing.

`qualityGates.regular` controls automatic audit, check, and try-guide behavior for the normal workflow and Autopilot. `qualityGates.continuous` controls the same per-feature gates for Continuous Mode. Every gate defaults to `manual`.

## Tool-Specific Adapters & Execution Rules

The workflow and skills are exposed through tool-specific adapters:

- **OpenAI Codex, Google Antigravity & GitHub Copilot**: `.agents/skills/<skill>/SKILL.md`
- **Claude Code**: `.claude/skills/<skill>/SKILL.md`
- **OpenCode**: `AGENTS.md` plus the compatible `.agents/skills/` or `.claude/skills/` tree already installed for the selected tools

Unused adapter families can be removed. Codex, Antigravity, GitHub Copilot, and OpenCode share `.agents/` and `AGENTS.md`. OpenCode can also reuse `.claude/` when Claude Code is selected. Claude Code projects keep `.claude/` and `AGENTS.md` (via `CLAUDE.md`). Do not duplicate the same DevFlow skills under `.opencode/skills/`; OpenCode already discovers the compatible trees.

### Universal Invocation & Agent Directives:

1. **Canonical Command Names & AI Provider Invocation**: Each workflow stage and companion tool has exactly **one Canonical Name** (e.g. `feature`, `fix`, `implement`, `check`, `complete`, `continuous`, `discovery`, `idea`, `grill`, `brainstorm`, `devflow`, `doctor`, `overview`, `debug`, `onboard`, `adopt`, `try`, `rollback`, `ci`, `test`, `tests`, `autopilot`, `prototype`, `report-html`, `brief`, `audit`, `release`, `convert-any-to-md`). The way you invoke commands depends on your AI Provider / Tool:
   - **Canonical Name (Plain text)**: Directly invoke or prompt the command by its standard name (e.g., `feature`, `implement`, `continuous`, `devflow`, `discovery`).
   - **Slash Prefix (`/`)**: For tools supporting slash commands (Claude Code, Google Antigravity, Gemini CLI), e.g., `/feature`, `/fix`, `/implement`, `/continuous`, `/devflow`, `/discovery`.
   - **Dollar Prefix (`$`)**: For OpenAI Codex CLI or skill-invocation tools, e.g., `$feature`, `$fix`, `$continuous`, `$devflow`, `$discovery`.
2. **OpenAI Codex & Non-Native CLI Tools**: In environments without automatic background skill discovery (such as OpenAI Codex CLI, Aider, or generic terminals), **you MUST use your file reading tool to inspect `.agents/skills/<skill>/SKILL.md` before executing the stage** to strictly follow its schema, artifact contract, and quality gates.
3. **Google Antigravity & Claude Code**: Native skill engines automatically discover and surface `.agents/skills/` and `.claude/skills/`.
4. **State-Aware Inspection**: When unsure what to do next, invoke `devflow` to automatically inspect `devflow/context/current-stage.md` and active context in `devflow/context/`.
5. **Default Artifact & Communication Language (Thai)**: All generated markdown stage artifacts (`current-feature.md`, `discovery.md`, etc.) and user communication MUST default to **Thai (`th`)**, while code, technical terms, file paths, and identifiers remain in English.

---

## ⚡ The Unified 4-Stage Living Spec Lifecycle

All development tasks (from lean UI fixes to deep architectural epics) execute through the 4-step progressive lifecycle:

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. **`feature` / `fix` (`/feature`, `/fix`, `/spec`)**:
   - **Purpose**: Combines Discover, Define, Spec, and Plan into one unified step. Checks Single Active Run Guardrail, allocates sequential ID (`xxx-slug`), and creates the **Single Living Spec (`devflow/context/current-feature.md`)** with 6 structured sections.
   - **Artifact**: `devflow/context/current-feature.md`
2. **`implement` (`/implement`)**:
   - **Purpose**: Incrementally executes checklist tasks with TDD discipline (Red-Green-Refactor) and appends diff evidence to `current-feature.md`.
3. **`check` (`/check`)**:
   - **Purpose**: Senior QA review, multi-lane verification matrix (Typecheck, Lint, Test suites, manual proof), and records empirical proof into `current-feature.md`.
4. **`complete` (`/complete`)**:
   - **Purpose**: Final safety pass, records Release Digest, automatically archives to `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`, resets the stub, and performs git squash-merge.

---

## 🔮 Pre-Flight Discovery & Architectural Alignment (Companions)

- `discovery`: Unified pre-delivery discovery & exploration (`devflow/discoveries/{DISC-ID}/discovery.md`).
- `idea`: Quick idea capture and AI feasibility scoring (`devflow/ideas.md`).
- `grill` (or `align`): Socratic alignment, domain modeling, and ADR recording (`devflow/decisions/`).
- `brainstorm`: Divergent/convergent ideation with trade-off analysis.

---

## 🌐 Standalone HTML Reporting Policy

> [!IMPORTANT]
> **No Auto-Generated HTML**: Mainline flows (`/complete`) strictly output Markdown only.
> When an interactive web dashboard is desired for presentation or sharing, invoke the standalone companion command:
> `/report:html` (or `npm run report:html -- {ID}`).

---

## Verification & Commands

- Verify framework integrity: `npm run check`
- Static contract check: `npm run check:static`
- Test installer package: `npm test`
- Package smoke test: `npm run test:package`
