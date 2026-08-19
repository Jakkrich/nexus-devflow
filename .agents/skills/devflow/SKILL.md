---
name: devflow
description: "[Devflow] Flagship interactive guide, state inspector, and intent router for DevFlow workflows."
---

# devflow - Interactive Workflow Guide & Intent Router for Nexus-DevFlow

Use this skill to guide the user on what to do next, inspect current workspace state, map their natural language intent to the right Nexus-DevFlow stage or companion command, or display a sitemap of available DevFlow skills.

## Input

- **No argument (`devflow`, `devflow`, `$devflow`, or `status`)**: Inspect current workspace state (active run in `devflow/runs/` or `devflow/context/current-stage.md`, active discovery in `devflow/discoveries/`, open findings in `devflow/context/findings.md`, and project overview in `devflow/context/project-overview.md`) and recommend the exact next action.
- **With user request (`devflow "<request>"`)**: Classify the user's intent and guide them to the matching DevFlow 2.0 stage or companion command path.

## Workspace State Inspection

When invoked without an argument (or when determining the next step), inspect:

1. **Project Setup Baseline**: Read `devflow/context/project-overview.md` and `devflow/context/coding-standards.md`. If they are empty or default placeholders, recommend `onboard` (for fresh projects) or `adopt` (for existing codebases).
2. **Active Delivery Run**: Read `devflow/context/current-stage.md` and check `devflow/runs/{RUNNING_ID}/` for active artifacts (`10-define.md`, `20-spec.md`, `30-plan.md`, `40-implement.md`, `50-verify.md`, `60-report.md`, `70-release.md`).
3. **Active Discovery**: Check `devflow/discoveries/` for open discovery notes.
4. **Audit Findings Ledger**: Check `devflow/context/findings.md` for open high-severity findings.

### State-Based Recommendation Rules

- If context is empty/unconfigured -> Recommend `onboard` (for fresh project) or `adopt` (for brownfield codebase).
- If a run is at `10-define.md` -> Recommend `20-spec {RUNNING_ID}` (or `20-spec`, `$20-spec`, `spec`).
- If a run is at `20-spec.md` -> Recommend `30-plan {RUNNING_ID}` (or `30-plan`, `$30-plan`, `plan`).
- If a run is at `30-plan.md` -> Recommend `40-implement {RUNNING_ID}` (or `40-implement`, `$40-implement`, `implement`).
- If a run is at `40-implement.md` with incomplete tasks -> Recommend `40-implement {RUNNING_ID}`.
- If a run is at `40-implement.md` with all tasks done -> Recommend `50-verify {RUNNING_ID}` (or `50-verify`, `$50-verify`, `verify`).
- If a run passed `50-verify.md` -> Recommend `60-report {RUNNING_ID}` then `70-release {RUNNING_ID}`.
- If no run is active and user wants to explore an idea -> Recommend `00-discover` (or `discover`, `Brainstorm`).
- If no run is active and open P0/P1 findings exist -> Recommend `security-review` or `debug`.
- If user asks to check system health or configuration -> Recommend `doctor` (or `doctor`, `$doctor`).

## Intent Classification & Skill Routing

When the user specifies a request, map it to the matching DevFlow 2.0 stage or companion command:

| User Intent / Request Type | Recommended Skill | Normal Name / Alias | Lifecycle Path |
| :--- | :--- | :--- | :--- |
| "Setup DevFlow on fresh/new project" | `onboard` | `onboard` / `setup` | `onboard` -> `00-discover` or `10-define` |
| "Adopt DevFlow on existing codebase" | `adopt` | `adopt` / `bootstrap` | `adopt` -> `00-discover` or `10-define` |
| "Check setup health & diagnostics" | `doctor` | `doctor` / `health` | `doctor` |
| "Explore a new request / idea" | `00-discover` | `discover` | `00-discover` -> `10-define` -> `20-spec` -> ... |
| "Define delivery boundaries and ID" | `10-define` | `define` | `10-define` -> `20-spec` -> `30-plan` |
| "Write formal markdown specification" | `20-spec` | `spec` | `20-spec` -> `30-plan` -> `40-implement` |
| "Break down spec into actionable plan" | `30-plan` | `plan` | `30-plan` -> `40-implement` -> `50-verify` |
| "Execute code implementation" | `40-implement` | `implement` | `40-implement` -> `50-verify` |
| "Verify code quality & QA review" | `50-verify` | `verify` | `50-verify` -> `60-report` -> `70-release` |
| "Generate summary HTML/MD report" | `60-report` | `report` | `60-report` -> `70-release` |
| "Package for PR merge or deployment" | `70-release` | `release` | `70-release` |
| "Human manual QA walkthrough guide" | `try` | `try` | `try` (after implement or verify) |
| "Safely plan feature or run reversal" | `rollback` | `rollback` | `rollback` -> `40-implement` |
| "Set up automatic GitHub Actions CI" | `ci` | `ci` | `ci` (after onboard or adopt) |
| "Pre-check scope & risks before spec" | `brief` | `brief` | `brief` -> `20-spec` |
| "Run autonomous bounded delivery loop"| `autopilot` | `autopilot` | `autopilot` -> `70-release` |
| "High-level goal or long-running task" | `goal` | `goal` | `goal` -> `00-discover` |
| "Brainstorm ideas without allocating ID" | `brainstorm` | `brainstorm` | `brainstorm` -> `00-discover` |
| "Deep codebase or web research" | `research` | `research` | `research` |
| "Investigate failure or root cause" | `debug` | `debug` | `debug` -> `40-implement` or `10-define` |
| "Product framing & PRD creation" | `prd` | `prd` | `prd` -> `00-discover` |
| "Intake and triage incoming bugs" | `issue-triage` | `issue-triage` | `issue-triage` -> `debug` or `10-define` |
| "High-severity security audit" | `security-review` | `security-review` | `security-review` |
| "Manage project knowledge base" | `wiki` | `wiki` | `wiki` |
| "Verify or update DevFlow setup" | `check-for-updates` | `check-for-updates` | `check-for-updates` |

## Available Skills Sitemap

Always provide a clean summary of available Nexus-DevFlow skills grouped by lifecycle stage:

### 1. Mainline Lifecycle Stages (Linear Order)
- `00-discover` (`discover`, `00-discover`, `$00-discover`) - Explore request, route inquiries, go/no-go under Discovery ID
- `10-define` (`define`, `10-define`, `$10-define`) - Lock delivery boundaries and allocate Running ID (`devflow/runs/{ID}`)
- `20-spec` (`spec`, `20-spec`, `$20-spec`) - Formalize markdown-first specifications and acceptance criteria
- `30-plan` (`plan`, `30-plan`, `$30-plan`) - Transform spec into executable task breakdown with test decisions
- `40-implement` (`implement`, `40-implement`, `$40-implement`) - Execute planned tasks incrementally with evidence
- `50-verify` (`verify`, `50-verify`, `$50-verify`) - Senior QA review, validation checks, and pass/fail gate
- `60-report` (`report`, `60-report`, `$60-report`) - Generate standardized markdown and HTML summary report
- `70-release` (`release`, `70-release`, `$70-release`) - Package verified work for PR merge or deployment

### 2. Public Companion Commands
- `devflow` (`status`, `devflow`, `$devflow`) - Guide, state inspector, and intent router
- `onboard` (`onboard`, `$onboard`) - Baseline stack setup for freshly scaffolded projects
- `adopt` (`adopt`, `$adopt`) - Survey and bootstrap DevFlow into existing brownfield projects
- `doctor` (`doctor`, `$doctor`) - Read-only health check for setup, scripts, and workflow drift
- `try` (`try`, `$try`) - Step-by-step human manual QA review guide (where to go, what to click, what to expect)
- `rollback` (`rollback`, `$rollback`) - Safe feature/run reversal planner with dependency risk analysis
- `ci` (`ci`, `$ci`) - Automatic GitHub Actions workflow (`.github/workflows/verify.yml`) setup
- `brief` (`brief`, `$brief`) - Read-only scope, dependency, and size pre-briefing before speccing
- `autopilot` (`autopilot`, `$autopilot`) - Optional bounded autonomous loop (spec -> plan -> implement -> verify -> report)
- `goal` - Route broad goals before Discovery
- `brainstorm` - Ideate without allocating running IDs
- `research` - Conduct codebase or web research
- `debug` - Root cause investigation before or during implementation
- `prd` - Product framing before delivery commitment
- `issue-triage` - Intake and triage incoming bug reports
- `security-review` - High-severity security review
- `wiki` - Knowledge base management under `devflow/wiki/`
- `check-for-updates` - Verify or upgrade DevFlow setup
- `help` - Process assistance and stage routing

### 3. Engineering & Specialist Skills
- **Frontend & UI**: `frontend-ui-engineering`, `nextjs-react-expert`, `tailwind-patterns`, `ui-ux-pro-max`, `mobile-design`
- **Quality & Security**: `code-review-and-quality`, `security-and-hardening`, `test-driven-development`, `vulnerability-scanner`, `performance-optimization`
- **Architecture & System**: `architecture`, `database-design`, `domain-modeling`, `codebase-design`, `api-and-interface-design`
- **Tools & Productivity**: `md2html`, `obsidian-markdown`, `git-workflow-and-versioning`, `parallel-agents`, `context-engineering`
