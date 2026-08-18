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

1. **Universal Command Names**: You can invoke workflows using plain stage names (`00-discover`, `10-define`, `20-spec`, `30-plan`, `40-implement`, `50-verify`, `60-report`, `70-release`, `devflow`), semantic aliases (`discover`, `define`, `spec`, `plan`, `implement`, `verify`, `report`, `release`, `status`), slash commands (`/00-discover`, `/devflow`), Codex skill format (`$00-discover`, `$spec`), or natural language intents (e.g., "start discovery", "write spec", "implement next step").
2. **OpenAI Codex & Non-Native CLI Tools**: In environments without automatic background skill discovery (such as OpenAI Codex CLI, Aider, or generic terminals), **you MUST use your file reading tool to inspect `.agents/skills/<skill>/SKILL.md` before executing the stage** to strictly follow its schema, artifact contract, and quality gates.
3. **Google Antigravity & Claude Code**: Native skill engines automatically discover and surface `.agents/skills/` and `.claude/skills/`.
4. **State-Aware Inspection**: When unsure what to do next, invoke `devflow` (or `/devflow`, `$devflow`) to automatically inspect `devflow/context/current-stage.md` and active runs in `devflow/runs/`.
5. **Default Artifact & Communication Language (Thai)**: All generated markdown stage artifacts (`00-discover.md`, `10-define.md`, `20-spec.md`, `30-plan.md`, `40-implement.md`, `50-verify.md`, `60-report.md`, `70-release.md`) and user communication MUST default to **Thai (`th`)**, while code, technical terms, file paths, and identifiers remain in English.

## Timeline Workflow

```text
00-discover -> 10-define -> 20-spec -> 30-plan -> 40-implement -> 50-verify -> 60-report -> 70-release
```

### Mainline Stages:

1. `00-discover` (alias: `discover`, `/00-discover`, `$00-discover`)
   - **Purpose**: Explore a request before delivery commitment without allocating a running ID.
   - **Artifact**: `devflow/discoveries/{discovery-id}-{slug}/00-discover.md`
   - **Gate**: Produces `Proceed`, `Defer`, or `Reject` decision.

2. `10-define` (alias: `define`, `/10-define`, `$10-define`)
   - **Purpose**: Turn an approved discovery into one or more bounded delivery runs with stable scope and sequential Running IDs.
   - **Artifact**: `devflow/runs/{running-id}-{slug}/10-define.md`
   - **Gate**: Approved run map and explicit in-scope / out-of-scope boundaries.

3. `20-spec` (alias: `spec`, `/20-spec`, `$20-spec`)
   - **Purpose**: Formalize markdown-first delivery contract and testable acceptance criteria from a stable definition.
   - **Artifact**: `devflow/runs/{running-id}-{slug}/20-spec.md`
   - **Gate**: Unambiguous acceptance criteria and hard constraints.

4. `30-plan` (alias: `plan`, `/30-plan`, `$30-plan`)
   - **Purpose**: Transform `20-spec.md` into phased executable tasks with explicit test decisions (Required / Manual / Not Required).
   - **Artifacts**: `30-plan.md`, `checklists/implementation-checklist.md`, `checklists/verification-checklist.md`
   - **Gate**: Ordered dependencies, scoped subtasks, and TDD decisions.

5. `40-implement` (alias: `implement`, `/40-implement`, `$40-implement`)
   - **Purpose**: Execute planned tasks incrementally one scoped unit at a time behind review gates.
   - **Artifact**: `40-implement.md` (and updated checklists)
   - **Gate**: Code changes tested, verification recorded, deviations documented.

6. `50-verify` (alias: `verify`, `/50-verify`, `$50-verify`)
   - **Purpose**: Senior QA review and multi-lane validation check across functionality, regressions, and quality standards.
   - **Artifact**: `50-verify.md` (optional `50-verify-impact.md`)
   - **Gate**: Pass or return-to-implement decision with evidence.

7. `60-report` (alias: `report`, `/60-report`, `$60-report`)
   - **Purpose**: Produce the standardized final markdown and self-contained HTML summary report for the completed run.
   - **Artifacts**: `60-report.md`, `60-report.html`
   - **Gate**: Completed delivery digest ready for stakeholder review.

8. `70-release` (alias: `release`, `/70-release`, `$70-release`)
   - **Purpose**: Package verified work for delivery, git merge, pull request, changelog update, or deployment.
   - **Artifact**: `70-release.md`
   - **Gate**: Safe handoff, release notes, and deployment readiness.

### Public Companion Commands:

- `devflow` (alias: `status`, `/devflow`, `$devflow`): Flagship interactive guide, state inspector, and intent router.
- `onboard` (alias: `/onboard`, `$onboard`): Initial stack detection and baseline setup for fresh/scaffolded projects.
- `adopt` (alias: `/adopt`, `$adopt`): Survey existing brownfield codebases and bootstrap DevFlow context.
- `doctor` (alias: `/doctor`, `$doctor`): Read-only health check for context files, adapters, commands, and workflow drift.
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

| Stage / Command | Normal Name | Semantic Alias | OpenAI Codex | Slash Command | Natural Language |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Setup (Fresh)**| `onboard` | `setup` | `$onboard`, `$setup` | `/onboard` | "onboard project", "setup devflow" |
| **Adopt (Exist)**| `adopt` | `bootstrap` | `$adopt`, `$bootstrap` | `/adopt` | "adopt codebase", "bootstrap devflow" |
| **Diagnostics** | `doctor` | `health` | `$doctor`, `$health` | `/doctor` | "doctor check", "diagnose devflow" |
| **Stage 00** | `00-discover` | `discover` | `$00-discover`, `$discover` | `/00-discover` | "start discovery", "explore request" |
| **Stage 10** | `10-define` | `define` | `$10-define`, `$define` | `/10-define` | "define run scope", "allocate run" |
| **Stage 20** | `20-spec` | `spec` | `$20-spec`, `$spec` | `/20-spec` | "write spec", "create delivery contract" |
| **Stage 30** | `30-plan` | `plan` | `$30-plan`, `$plan` | `/30-plan` | "plan tasks", "breakdown plan" |
| **Stage 40** | `40-implement` | `implement` | `$40-implement`, `$implement` | `/40-implement` | "implement step", "build task" |
| **Stage 50** | `50-verify` | `verify` | `$50-verify`, `$verify` | `/50-verify` | "verify QA", "run validation" |
| **Stage 60** | `60-report` | `report` | `$60-report`, `$report` | `/60-report` | "generate report", "summarize run" |
| **Stage 70** | `70-release` | `release` | `$70-release`, `$release` | `/70-release` | "package release", "prepare PR/deploy" |
| **Router** | `devflow` | `status` | `$devflow`, `$status` | `/devflow` | "what to do next", "check progress" |

## Mainline Rules

1. Numbered workflows exist only for the linear mainline.
2. Mainline numbers must move from lower to higher with no backward jump.
3. If a command is not a true mainline state, do not give it a number.
4. Companion commands may be suggested by a mainline workflow but do not replace that workflow.

## Verification & Commands

- Verify framework integrity: `npm run check`
- Static contract check: `npm run check:static`
- Test installer package: `npm test`
- Package smoke test: `npm run test:package`
