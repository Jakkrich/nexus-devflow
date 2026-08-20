# Nexus-DevFlow 2.0 (Dual-Track Blueprint & Architect Model)

Instructions for AI coding agents working in this project. This is the cross-tool entry point: Codex, Google Antigravity, Cursor, GitHub Copilot, Gemini CLI, Aider, Zed, Windsurf, and others read `AGENTS.md`. Claude Code reads `CLAUDE.md`, which imports this file (`@AGENTS.md`), so there is a single source of truth.

## What this is

This project uses **Nexus-DevFlow**, an agentic workflow layer supporting **Dual-Track Delivery**:
1. **🏎️ Fast-Track (Blueprint Mode - 4 Steps)**: High-velocity spec-driven loop driven by a **Single Living Spec (`spec.md`)**.
2. **🏗️ Deep-Track (Architect Mode - 8 Steps)**: Full-lifecycle delivery pipeline with modular stage artifacts (`00-70`).

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
4. **State-Aware Inspection**: When unsure what to do next, invoke `devflow` to automatically inspect `devflow/context/current-stage.md` and active runs in `devflow/runs/`.
5. **Default Artifact & Communication Language (Thai)**: All generated markdown stage artifacts (`spec.md`, `00-discover.md`...`70-release.md`) and user communication MUST default to **Thai (`th`)**, while code, technical terms, file paths, and identifiers remain in English.

---

## 🏎️ Track 1: Fast-Track (Blueprint Mode - 4 Steps)

Recommended for 85% of daily work (features, bug fixes, UI improvements, iterative tasks):

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. **`feature` / `fix` (`/feature`, `/fix`, `/spec`)**:
   - **Purpose**: Combines Discover, Define, Spec, and Plan into one unified step. Allocates sequential Running ID (`RUN-xxx`) and creates the **Single Living Spec (`spec.md`)**.
   - **Artifact**: `devflow/runs/{running-id}-{slug}/spec.md`
2. **`implement` (`/implement`)**:
   - **Purpose**: Incrementally executes checklist tasks with TDD discipline and appends progress to `spec.md`.
3. **`check` (`/check`)**:
   - **Purpose**: Senior QA review, multi-lane verification matrix (Typecheck, Lint, Test suites, manual proof), and records evidence into `spec.md`.
4. **`complete` (`/complete`)**:
   - **Purpose**: Final safety pass, records Release Digest in `spec.md`, performs git merge, and closes the run without auto HTML generation.

---

## 🏗️ Track 2: Deep-Track (Architect Mode - 8 Steps)

Recommended for large architectural epics, database migrations, and multi-agent coordination:

```text
00-discover ──▶ 10-define ──▶ 20-spec ──▶ 30-plan ──▶ 40-execute ──▶ 50-verify ──▶ 60-report ──▶ 70-release
```

1. `00-discover`: Explore request before delivery commitment without allocating running ID (`00-discover.md`).
2. `10-define`: Turn approved discovery into bounded delivery run(s) with sequential Running IDs (`10-define.md`).
3. `20-spec`: Formalize markdown-first delivery contract & acceptance criteria (`20-spec.md`).
4. `30-plan`: Breakdown spec into executable tasks with test decisions (`30-plan.md` + checklists).
5. `40-execute`: Incremental task execution behind review gates (`40-execute.md`).
6. `50-verify`: Senior QA review & multi-lane verification checks (`50-verify.md`).
7. `60-report`: Standardized markdown delivery digest (`60-report.md`).
8. `70-release`: Release packaging, release notes, git merge, and deployment (`70-release.md`).

---

## 🌐 Standalone HTML Reporting Policy

> [!IMPORTANT]
> **No Auto-Generated HTML**: Mainline flows (`/complete` and `60-report`) strictly output Markdown only.
> When an interactive web dashboard is desired for presentation or sharing, invoke the standalone companion command:
> `/report:html` (or `npm run report:html -- {RUNNING_ID}`).

---

## Public Companion Commands

- `devflow`: Flagship interactive guide, state inspector, and intent router.
- `idea` (`/idea`): Quick idea capture and AI feasibility enrichment into `devflow/ideas.md`.
- `report-html` (`/report:html`): Standalone interactive HTML report dashboard generator.
- `onboard`: Initial stack detection and baseline setup for fresh/scaffolded projects.
- `adopt`: Survey existing brownfield codebases and bootstrap DevFlow context.
- `doctor`: Read-only health check for context files, adapters, commands, and workflow drift.
- `try`: Step-by-step human manual QA review guide (where to go, what to click, what to expect).
- `rollback`: Safe feature/run reversal planner with dependency and commit risk analysis.
- `ci`: Automatic GitHub Actions workflow (`.github/workflows/verify.yml`) setup and alignment.
- `brief`: Read-only scope, dependency, and size pre-briefing before speccing a run.
- `autopilot`: Optional explicit mode for one bounded spec/plan/implement/verify/report pass.
- `goal`: Route broad, open-ended goals before Discovery.
- `brainstorm`: Structured divergent & convergent ideation without creating running IDs.
- `research`: Conduct deep codebase or web research with source-backed citations.
- `debug`: Root cause investigation before or during implementation without editing code.
- `overview`: Refresh `devflow/context/project-overview.md`.
- `wiki`: Knowledge base management under `devflow/wiki/`.
- `check-for-updates`: Verify or upgrade DevFlow setup.
- `help`: Routing and process assistance across DevFlow workflows.

---

## Invocation Reference

| Track / Category | Canonical Name | Claude / Antigravity (`/`) | OpenAI Codex (`$`) | Purpose / Action |
| :--- | :--- | :--- | :--- | :--- |
| **Fast: Feature** | `feature` | `/feature` | `$feature` | 4-step Fast-Track spec & living spec creation for new features (supports `IDEA-xxx`) |
| **Fast: Fix** | `fix` | `/fix` | `$fix` | 4-step Fast-Track spec & living spec creation for bug fixes (supports `IDEA-xxx`) |
| **Fast: Implement** | `implement` | `/implement` | `$implement` | Fast-Track incremental execution with TDD |
| **Fast: Check** | `check` | `/check` | `$check` | Fast-Track QA review & multi-lane verification |
| **Fast: Complete** | `complete` | `/complete` | `$complete` | Fast-Track safety pass, release digest & git merge |
| **Idea Capture** | `idea` | `/idea` | `$idea` | Quick idea capture and AI feasibility enrichment |
| **HTML Report** | `report-html` | `/report:html` | `$report:html` | Standalone interactive HTML dashboard generator |
| **Deep: 00** | `00-discover` | `/00-discover` | `$00-discover` | Explore request and decide Proceed, Defer, or Reject |
| **Deep: 10** | `10-define` | `/10-define` | `$10-define` | Turn approved discovery into bounded delivery run(s) |
| **Deep: 20** | `20-spec` | `/20-spec` | `$20-spec` | Formal markdown delivery contract & acceptance criteria |
| **Deep: 30** | `30-plan` | `/30-plan` | `$30-plan` | Breakdown spec into executable tasks with test decisions |
| **Deep: 40** | `40-execute` | `/40-execute` | `$40-execute` | Execute planned tasks in small reviewable increments (`40-execute.md`) |
| **Deep: 50** | `50-verify` | `/50-verify` | `$50-verify` | Senior QA review & multi-lane verification checks |
| **Deep: 60** | `60-report` | `/60-report` | `$60-report` | Standalone markdown summary report |
| **Deep: 70** | `70-release` | `/70-release` | `$70-release` | Package for delivery, git merge, PR, or deployment |
| **Router** | `devflow` | `/devflow` | `$devflow` | Interactive guide, state inspector, and intent router |

## Verification & Commands

- Verify framework integrity: `npm run check`
- Static contract check: `npm run check:static`
- Test installer package: `npm test`
- Package smoke test: `npm run test:package`
