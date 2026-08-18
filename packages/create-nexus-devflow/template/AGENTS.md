# Nexus-DevFlow 2.0 (Blueprint-Style Model)

Instructions for AI coding agents working in this project. This is the cross-tool entry point: Codex, Google Antigravity, Cursor, GitHub Copilot, Gemini CLI, Aider, Zed, Windsurf, and others read `AGENTS.md`. Claude Code reads `CLAUDE.md`, which imports this file (`@AGENTS.md`), so there is a single source of truth.

## What this is

This project uses **Nexus-DevFlow**, an agentic stage-based workflow layer. To start a new project, scaffold the application first in an empty folder, then run `npx @jakkrichm/create-nexus-devflow` to overlay DevFlow onto your codebase.

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

1. **Canonical Command Names & AI Provider Invocation**: Each workflow stage and companion tool has exactly **one Canonical Name** (e.g. `00-discover`, `10-define`, `20-spec`, `30-plan`, `40-implement`, `50-verify`, `60-report`, `70-release`, `devflow`, `onboard`, `adopt`, `doctor`, `try`, `rollback`, `ci`, `brief`, `autopilot`). The way you invoke commands depends on your AI Provider / Tool:
   - **Canonical Name (Plain text)**: Directly invoke or prompt the command by its standard name (e.g., `00-discover`, `devflow`).
   - **Slash Prefix (`/`)**: For tools supporting slash commands (Claude Code, Google Antigravity, Gemini CLI), e.g., `/00-discover`, `/devflow`.
   - **Dollar Prefix (`$`)**: For OpenAI Codex CLI or skill-invocation tools, e.g., `$00-discover`, `$devflow`.
2. **OpenAI Codex & Non-Native CLI Tools**: In environments without automatic background skill discovery (such as OpenAI Codex CLI, Aider, or generic terminals), **you MUST use your file reading tool to inspect `.agents/skills/<skill>/SKILL.md` before executing the stage** to strictly follow its schema, artifact contract, and quality gates.
3. **Google Antigravity & Claude Code**: Native skill engines automatically discover and surface `.agents/skills/` and `.claude/skills/`.
4. **State-Aware Inspection**: When unsure what to do next, invoke `devflow` to automatically inspect `devflow/context/current-stage.md` and active runs in `devflow/runs/`.
5. **Default Artifact & Communication Language (Thai)**: All generated markdown stage artifacts (`00-discover.md`, `10-define.md`, `20-spec.md`, `30-plan.md`, `40-implement.md`, `50-verify.md`, `60-report.md`, `70-release.md`) and user communication MUST default to **Thai (`th`)**, while code, technical terms, file paths, and identifiers remain in English.

## Timeline Workflow

```text
00-discover -> 10-define -> 20-spec -> 30-plan -> 40-implement -> 50-verify -> 60-report -> 70-release
```

### Mainline Stages:

1. `00-discover`
   - **Purpose**: Explore a request before delivery commitment without allocating a running ID.
   - **Artifact**: `devflow/discoveries/{discovery-id}-{slug}/00-discover.md`
   - **Gate**: Produces `Proceed`, `Defer`, or `Reject` decision.

2. `10-define`
   - **Purpose**: Turn an approved discovery into one or more bounded delivery runs with stable scope and sequential Running IDs.
   - **Artifact**: `devflow/runs/{running-id}-{slug}/10-define.md`
   - **Gate**: Approved run map and explicit in-scope / out-of-scope boundaries.

3. `20-spec`
   - **Purpose**: Formalize markdown-first delivery contract and testable acceptance criteria from a stable definition.
   - **Artifact**: `devflow/runs/{running-id}-{slug}/20-spec.md`
   - **Gate**: Unambiguous acceptance criteria and hard constraints.

4. `30-plan`
   - **Purpose**: Transform `20-spec.md` into phased executable tasks with explicit test decisions (Required / Manual / Not Required).
   - **Artifacts**: `30-plan.md`, `checklists/implementation-checklist.md`, `checklists/verification-checklist.md`
   - **Gate**: Ordered dependencies, scoped subtasks, and TDD decisions.

5. `40-implement`
   - **Purpose**: Execute planned tasks incrementally one scoped unit at a time behind review gates.
   - **Artifact**: `40-implement.md` (and updated checklists)
   - **Gate**: Code changes tested, verification recorded, deviations documented.

6. `50-verify`
   - **Purpose**: Senior QA review and multi-lane validation check across functionality, regressions, and quality standards.
   - **Artifact**: `50-verify.md` (optional `50-verify-impact.md`)
   - **Gate**: Pass or return-to-implement decision with evidence.

7. `60-report`
   - **Purpose**: Produce the standardized final markdown and self-contained HTML summary report for the completed run.
   - **Artifacts**: `60-report.md`, `60-report.html`
   - **Gate**: Completed delivery digest ready for stakeholder review.

8. `70-release`
   - **Purpose**: Package verified work for delivery, git merge, pull request, changelog update, or deployment.
   - **Artifact**: `70-release.md`
   - **Gate**: Safe handoff, release notes, and deployment readiness.

### Public Companion Commands:

- `devflow`: Flagship interactive guide, state inspector, and intent router.
- `onboard`: Initial stack detection and baseline setup for fresh/scaffolded projects.
- `adopt`: Survey existing brownfield codebases and bootstrap DevFlow context.
- `doctor`: Read-only health check for context files, adapters, commands, and workflow drift.
- `try`: Step-by-step human manual QA review guide (where to go, what to click, what to expect).
- `rollback`: Safe feature/run reversal planner with dependency and commit risk analysis.
- `ci`: Automatic GitHub Actions workflow (`.github/workflows/verify.yml`) setup and alignment.
- `brief`: Read-only scope, dependency, and size pre-briefing before speccing a run.
- `autopilot`: Optional explicit mode for one bounded spec/plan/implement/verify/report pass with checkpoint commits and review packet.
- `goal`: Route broad, open-ended goals before Discovery.
- `brainstorm`: Structured divergent & convergent ideation without creating running IDs.
- `research`: Conduct deep codebase or web research with source-backed citations.
- `debug`: Root cause investigation before or during implementation without editing code.
- `prd`: Product Requirements Document drafting before delivery commitment.
- `issue-triage`: Intake, categorize, and prioritize incoming issues and bug reports.
- `security-review`: High-severity vulnerability and security review.
- `wiki`: Knowledge base management and ingestion under `devflow/wiki/`.
- `check-for-updates`: Verify or upgrade DevFlow setup.
- `help`: Routing and process assistance across DevFlow workflows.

## Invocation Reference

> **Note on AI Providers**: Commands use a single Canonical Name. Use the prefix appropriate for your tool (`/` for Claude/Antigravity, `$` for Codex, or plain text).

| Stage / Category | Canonical Name | Claude / Antigravity (`/`) | OpenAI Codex (`$`) | Purpose / Action |
| :--- | :--- | :--- | :--- | :--- |
| **Setup (Fresh)** | `onboard` | `/onboard` | `$onboard` | Detect tech stack and establish initial project baseline |
| **Adopt (Exist)** | `adopt` | `/adopt` | `$adopt` | Adopt existing brownfield codebase into DevFlow |
| **Diagnostics** | `doctor` | `/doctor` | `$doctor` | Read-only health check for configs, tools, and drift |
| **Manual QA** | `try` | `/try` | `$try` | Step-by-step manual testing guide for human verification |
| **Reversal** | `rollback` | `/rollback` | `$rollback` | Reversal planner with dependency & commit risk analysis |
| **CI Setup** | `ci` | `/ci` | `$ci` | Generate GitHub Actions automated verify workflow |
| **Pre-Check** | `brief` | `/brief` | `$brief` | Read-only scope, dependency, and size pre-briefing |
| **Autopilot** | `autopilot` | `/autopilot` | `$autopilot` | Bounded autonomous spec/plan/implement/verify pass |
| **Stage 00** | `00-discover` | `/00-discover` | `$00-discover` | Explore request and decide Proceed, Defer, or Reject |
| **Stage 10** | `10-define` | `/10-define` | `$10-define` | Turn approved discovery into bounded delivery run(s) |
| **Stage 20** | `20-spec` | `/20-spec` | `$20-spec` | Formal markdown delivery contract & acceptance criteria |
| **Stage 30** | `30-plan` | `/30-plan` | `$30-plan` | Breakdown spec into executable tasks with test decisions |
| **Stage 40** | `40-implement` | `/40-implement` | `$40-implement` | Implement tasks in small reviewable increments |
| **Stage 50** | `50-verify` | `/50-verify` | `$50-verify` | Senior QA review & multi-lane verification checks |
| **Stage 60** | `60-report` | `/60-report` | `$60-report` | Standalone markdown & HTML summary report |
| **Stage 70** | `70-release` | `/70-release` | `$70-release` | Package for delivery, git merge, PR, or deployment |
| **Router** | `devflow` | `/devflow` | `$devflow` | Interactive guide, state inspector, and intent router |

## Mainline Rules

1. Numbered workflows exist only for the linear mainline.
2. Mainline numbers must move from lower to higher with no backward jump.
3. If a command is not a true mainline state, do not give it a number.
4. Companion commands may be suggested by a mainline workflow but do not replace that workflow.

## Commands

- Dev Server: `npm run dev`
- Build: `npm run build`
- Test: `npm test`
- Verify: `npm run check` (Run `/onboard` to auto-configure)
