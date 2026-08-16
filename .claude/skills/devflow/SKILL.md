---
name: devflow
description: Flagship interactive guide, intent router, workspace state inspector, and sitemap for Nexus-DevFlow workflows. Inspects current workspace state, maps natural language requests to matching stages/commands, and provides a cheat sheet of all available DevFlow skills. Use when the user runs /devflow, asks how to use devflow, asks what command to run next, or needs guidance on DevFlow lifecycle paths.
---

# devflow - Interactive Workflow Guide & Intent Router for Nexus-DevFlow

Use this skill to guide the user on what to do next, inspect current workspace state, map their natural language intent to the right Nexus-DevFlow stage or companion command, or display a sitemap of available DevFlow skills.

## Input

- **No argument (`/devflow`)**: Inspect current workspace state (active run in `devflow/runs/` or `devflow/context/current-stage.md`, active discovery in `devflow/discoveries/`, open findings in `devflow/context/findings.md`, and project overview in `devflow/context/project-overview.md`) and recommend the exact next action.
- **With user request (`/devflow "<request>"`)**: Classify the user's intent and guide them to the matching DevFlow 2.0 stage or companion command path.

## Workspace State Inspection

When invoked without an argument (or when determining the next step), inspect:

1. **Active Delivery Run**: Read `devflow/context/current-stage.md` and check `devflow/runs/{RUNNING_ID}/` for active artifacts (`10-define.md`, `20-spec.md`, `30-plan.md`, `40-implement.md`, `50-verify.md`, `60-report.md`, `70-release.md`).
2. **Active Discovery**: Check `devflow/discoveries/` for open discovery notes.
3. **Audit Findings Ledger**: Check `devflow/context/findings.md` for open high-severity findings.
4. **Project Overview**: Read `devflow/context/project-overview.md` for overall stack and context.

### State-Based Recommendation Rules

- If a run is at `10-define.md` -> Recommend `/20-spec {RUNNING_ID}`.
- If a run is at `20-spec.md` -> Recommend `/30-plan {RUNNING_ID}`.
- If a run is at `30-plan.md` -> Recommend `/40-implement {RUNNING_ID}`.
- If a run is at `40-implement.md` with incomplete tasks -> Recommend `/40-implement {RUNNING_ID}`.
- If a run is at `40-implement.md` with all tasks done -> Recommend `/50-verify {RUNNING_ID}`.
- If a run passed `50-verify.md` -> Recommend `/60-report {RUNNING_ID}` then `/70-release {RUNNING_ID}`.
- If no run is active and user wants to explore an idea -> Recommend `/00-discover` or `Brainstorm`.
- If no run is active and open P0/P1 findings exist -> Recommend `Security-Review` or `Debug`.

## Intent Classification & Skill Routing

When the user specifies a request, map it to the matching DevFlow 2.0 stage or companion command:

| User Intent / Request Type | Recommended Skill | Lifecycle Path |
| --- | --- | --- |
| "Explore a new request / idea" | `/00-discover` | `/00-discover` -> `/10-define` -> `/20-spec` -> ... |
| "Define delivery boundaries and ID" | `/10-define` | `/10-define` -> `/20-spec` -> `/30-plan` |
| "Write formal markdown specification" | `/20-spec` | `/20-spec` -> `/30-plan` -> `/40-implement` |
| "Break down spec into actionable plan" | `/30-plan` | `/30-plan` -> `/40-implement` -> `/50-verify` |
| "Execute code implementation" | `/40-implement` | `/40-implement` -> `/50-verify` |
| "Verify code quality & QA review" | `/50-verify` | `/50-verify` -> `/60-report` -> `/70-release` |
| "Generate summary HTML/MD report" | `/60-report` | `/60-report` -> `/70-release` |
| "Package for PR merge or deployment" | `/70-release` | `/70-release` |
| "High-level goal or long-running task" | `Goal` | `Goal` -> `/00-discover` |
| "Brainstorm ideas without allocating ID" | `Brainstorm` | `Brainstorm` -> `/00-discover` |
| "Deep codebase or web research" | `Research` | `Research` |
| "Investigate failure or root cause" | `Debug` | `Debug` -> `/40-implement` or `/10-define` |
| "Product framing & PRD creation" | `PRD` | `PRD` -> `/00-discover` |
| "Intake and triage incoming bugs" | `Issue-Triage` | `Issue-Triage` -> `Debug` or `/10-define` |
| "High-severity security audit" | `Security-Review` | `Security-Review` |
| "Manage project knowledge base" | `Wiki` | `Wiki` |
| "Verify or update DevFlow setup" | `Check-For-Updates` | `Check-For-Updates` |

## Available Skills Sitemap

Always provide a clean summary of available Nexus-DevFlow skills grouped by lifecycle stage:

### 1. Mainline Lifecycle Stages (Linear Order)
- `/00-discover` - Explore request, route inquiries, go/no-go under Discovery ID
- `/10-define` - Lock delivery boundaries and allocate Running ID (`devflow/runs/{ID}`)
- `/20-spec` - Formalize markdown-first specifications and acceptance criteria
- `/30-plan` - Transform spec into executable task breakdown
- `/40-implement` - Execute planned tasks incrementally with evidence
- `/50-verify` - Senior QA review, validation checks, and pass/fail gate
- `/60-report` - Generate standardized markdown and HTML summary report
- `/70-release` - Package verified work for PR merge or deployment

### 2. Public Companion Commands
- `Goal` - Route broad goals before Discovery
- `Brainstorm` - Ideate without allocating running IDs
- `Research` - Conduct codebase or web research
- `Debug` - Root cause investigation before or during implementation
- `PRD` - Product framing before delivery commitment
- `Issue-Triage` - Intake and triage incoming bug reports
- `Security-Review` - High-severity security review
- `Wiki` - Knowledge base management under `devflow/wiki/`
- `Check-For-Updates` - Verify or upgrade DevFlow setup
- `Help` - Process assistance and stage routing

### 3. Engineering & Specialist Skills
- **Frontend & UI**: `frontend-ui-engineering`, `nextjs-react-expert`, `tailwind-patterns`, `ui-ux-pro-max`, `mobile-design`
- **Quality & Security**: `code-review-and-quality`, `security-and-hardening`, `test-driven-development`, `vulnerability-scanner`, `performance-optimization`
- **Architecture & System**: `architecture`, `database-design`, `domain-modeling`, `codebase-design`, `api-and-interface-design`
- **Tools & Productivity**: `md2html`, `obsidian-markdown`, `git-workflow-and-versioning`, `parallel-agents`, `context-engineering`
