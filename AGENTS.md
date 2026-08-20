# Nexus-DevFlow 2.0 (The 3-Pillars & Dual-Track Model)

Instructions for AI coding agents working in this project. This is the cross-tool entry point: Codex, Google Antigravity, Cursor, GitHub Copilot, Gemini CLI, Aider, Zed, Windsurf, and others read `AGENTS.md`. Claude Code reads `CLAUDE.md`, which imports this file (`@AGENTS.md`), so there is a single source of truth.

## What this is

This project uses **Nexus-DevFlow**, an agentic workflow layer supporting **The 3-Pillars Workspace Architecture & Dual-Track Delivery**:
1. **🔮 Future (Backlog)**: `devflow/ideas.md` — Centralized Idea Inbox with AI scoring.
2. **⚡ Present (Active Context)**: `devflow/context/` — Living Source of Truth & Active Work (`current-feature.md` for Fast-Track, `current-run/` for Deep-Track).
3. **📦 Past (History Archive)**: `devflow/history/` — Categorized delivery archives (`features/`, `fixes/`, `rollbacks/`, and `HISTORY.md`).

To start a new project, scaffold the application first in an empty folder, then run `npx @jakkrichm/create-nexus-devflow` to overlay DevFlow onto your codebase.

## Read these for full context

- `devflow/context/project-overview.md` - the project's source of truth
- `devflow/context/coding-standards.md` - engineering conventions & rules to follow
- `devflow/context/ai-interaction.md` - how to interact with the user on this project
- `devflow/context/current-stage.md` - active discovery or running delivery state
- `devflow/context/findings.md` - quality, security, and verification ledger

## Tool-Specific Adapters & Execution Rules

The workflow and skills are exposed through tool-specific adapters:

- **OpenAI Codex & Google Antigravity**: `.agents/skills/<skill>/SKILL.md`
- **Claude Code**: `.claude/skills/<skill>/SKILL.md`

Unused adapter families can be removed. Codex and Antigravity projects keep `.agents/` and `AGENTS.md`. Claude Code projects keep `.claude/` and `AGENTS.md` (via `CLAUDE.md`).

### Universal Invocation & Agent Directives:

1. **Canonical Command Names & AI Provider Invocation**: Each workflow stage and companion tool has exactly **one Canonical Name** (e.g. `feature`, `fix`, `implement`, `check`, `complete`, `00-discover`, `10-define`, `20-spec`, `30-plan`, `40-execute`, `50-verify`, `60-report`, `70-release`, `report-html`, `devflow`, `onboard`, `adopt`, `doctor`, `try`, `rollback`, `ci`, `brief`, `autopilot`, `idea`, `spec`). The way you invoke commands depends on your AI Provider / Tool:
   - **Canonical Name (Plain text)**: Directly invoke or prompt the command by its standard name (e.g., `feature`, `40-execute`, `devflow`).
   - **Slash Prefix (`/`)**: For tools supporting slash commands (Claude Code, Google Antigravity, Gemini CLI), e.g., `/feature`, `/fix`, `/implement`, `/40-execute`, `/devflow`.
   - **Dollar Prefix (`$`)**: For OpenAI Codex CLI or skill-invocation tools, e.g., `$feature`, `$fix`, `$40-execute`, `$devflow`.
2. **OpenAI Codex & Non-Native CLI Tools**: In environments without automatic background skill discovery (such as OpenAI Codex CLI, Aider, or generic terminals), **you MUST use your file reading tool to inspect `.agents/skills/<skill>/SKILL.md` before executing the stage** to strictly follow its schema, artifact contract, and quality gates.
3. **Google Antigravity & Claude Code**: Native skill engines automatically discover and surface `.agents/skills/` and `.claude/skills/`.
4. **State-Aware Inspection**: When unsure what to do next, invoke `devflow` to automatically inspect `devflow/context/current-stage.md` and active context in `devflow/context/`.
5. **Default Artifact & Communication Language (Thai)**: All generated markdown stage artifacts (`current-feature.md`, `00-discover.md`...`70-release.md`) and user communication MUST default to **Thai (`th`)**, while code, technical terms, file paths, and identifiers remain in English.

---

## 🏎️ Track 1: Fast-Track (Blueprint Mode - 4 Steps)

Recommended for 85% of daily work (features, bug fixes, UI improvements, iterative tasks):

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. **`feature` / `fix` (`/feature`, `/fix`, `/spec`)**:
   - **Purpose**: Combines Discover, Define, Spec, and Plan into one unified step. Checks Single Active Run Guardrail, allocates sequential ID (`xxx-slug`), and creates the **Single Living Spec (`devflow/context/current-feature.md`)**.
   - **Artifact**: `devflow/context/current-feature.md`
2. **`implement` (`/implement`)**:
   - **Purpose**: Incrementally executes checklist tasks with TDD discipline and appends progress to `devflow/context/current-feature.md`.
3. **`check` (`/check`)**:
   - **Purpose**: Senior QA review, multi-lane verification matrix (Typecheck, Lint, Test suites, manual proof), and records evidence into `devflow/context/current-feature.md`.
4. **`complete` (`/complete`)**:
   - **Purpose**: Final safety pass, records Release Digest, automatically archives to `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`, resets the stub, performs git merge, and closes the run without auto HTML generation.

---

## 🏗️ Track 2: Deep-Track (Architect Mode - 8 Steps)

Recommended for large architectural epics, database migrations, and multi-agent coordination:

```text
00-discover ──▶ 10-define ──▶ 20-spec ──▶ 30-plan ──▶ 40-execute ──▶ 50-verify ──▶ 60-report ──▶ 70-release
```

1. `00-discover`: Explore request before delivery commitment without allocating running ID (`00-discover.md`).
2. `10-define`: Turn approved discovery into bounded delivery run in `devflow/context/current-run/10-define.md`.
3. `20-spec`: Formalize markdown-first delivery contract & acceptance criteria (`20-spec.md`).
4. `30-plan`: Breakdown spec into executable tasks with test decisions (`30-plan.md` + checklists).
5. `40-execute`: Incremental task execution behind review gates (`40-execute.md`).
6. `50-verify`: Senior QA review & multi-lane verification checks (`50-verify.md`).
7. `60-report`: Standardized markdown delivery digest (`60-report.md`).
8. `70-release`: Release packaging, git merge, archives `devflow/context/current-run/` ➔ `devflow/history/{category}/{xxx-slug}/`, and closes run.

---

## 🌐 Standalone HTML Reporting Policy

> [!IMPORTANT]
> **No Auto-Generated HTML**: Mainline flows (`/complete` and `60-report`) strictly output Markdown only.
> When an interactive web dashboard is desired for presentation or sharing, invoke the standalone companion command:
> `/report:html` (or `npm run report:html -- {ID}`).

---

## Verification & Commands

- Verify framework integrity: `npm run check`
- Static contract check: `npm run check:static`
- Test installer package: `npm test`
- Package smoke test: `npm run test:package`
