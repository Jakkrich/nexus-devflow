---
name: devflow
description: "[Devflow] Flagship interactive guide, state inspector, and intent router for DevFlow workflows."
---

# devflow - Interactive Workflow Guide & Intent Router for Nexus-DevFlow

Use this skill to guide the user on what to do next, inspect current workspace state, map their natural language intent to the right Nexus-DevFlow track (Fast-Track or Deep-Track) or companion command, or display a sitemap of available DevFlow skills.

## Input

- **No argument (`devflow`, `devflow`, `$devflow`, or `status`)**: Inspect current workspace state (active run in `devflow/runs/` or `devflow/context/current-stage.md`, active discovery in `devflow/discoveries/`, pending ideas in `devflow/ideas.md`, open findings in `devflow/context/findings.md`, and project overview in `devflow/context/project-overview.md`) and recommend the exact next action.
- **With user request (`devflow "<request>"`)**: Classify the user's intent and guide them to the matching DevFlow workflow track or companion command path.

## Dual-Track Architecture

Nexus-DevFlow supports two seamless workflow tracks:
1. **🏎️ Fast-Track (Blueprint Mode - 4 Steps)**: `/spec` ➔ `/implement` ➔ `/check` ➔ `/complete`  
   *Driven by a **Single Living Spec (`spec.md`)** for fast, high-velocity daily development and bugfixes (85% of tasks).*
2. **🏗️ Deep-Track (Architect Mode - 8 Steps)**: `00-discover` ➔ `10-define` ➔ `20-spec` ➔ `30-plan` ➔ `40-execute` ➔ `50-verify` ➔ `60-report` ➔ `70-release`  
   *Driven by modular separate stage files for large, high-stakes architectural epics and multi-agent coordination.*

---

## Workspace State Inspection

When invoked without an argument (or when determining the next step), inspect:

1. **Project Setup Baseline**: Read `devflow/context/project-overview.md` and `devflow/context/coding-standards.md`. If empty or default placeholders, recommend `onboard` (for fresh projects) or `adopt` (for existing codebases).
2. **Active Delivery Run**: Read `devflow/context/current-stage.md` and check `devflow/runs/{RUNNING_ID}/`.
   - **If Fast-Track (`spec.md` or `blueprint.md` present)**:
     - If `spec.md` has incomplete checklist items -> Recommend `/implement` (or `implement {RUNNING_ID}`).
     - If all tasks done but no passing verification evidence -> Recommend `/check` (or `check {RUNNING_ID}`).
     - If verification evidence passed -> Recommend `/complete` (or `complete {RUNNING_ID}`).
   - **If Deep-Track (numbered stage files present)**:
     - If at `10-define.md` -> Recommend `20-spec {RUNNING_ID}`.
     - If at `20-spec.md` -> Recommend `30-plan {RUNNING_ID}`.
     - If at `30-plan.md` -> Recommend `40-execute {RUNNING_ID}`.
     - If at `40-execute.md` with all tasks done -> Recommend `50-verify {RUNNING_ID}`.
     - If passed `50-verify.md` -> Recommend `60-report {RUNNING_ID}` then `70-release {RUNNING_ID}`.
3. **Active Discovery**: Check `devflow/discoveries/` for open discovery notes.
4. **Pending Ideas Inbox**: Check `devflow/ideas.md`. If items exist under `## 📌 Pending Ideas`, summarize them in a **💡 Pending Ideas (Inbox)** list with their IDs (`[IDEA-xxx]`), feasibility, and mention that they can be started with `/spec IDEA-xxx`.
5. **Audit Findings Ledger**: Check `devflow/context/findings.md` for open high-severity findings.

### Default State Recommendations
- If no run is active and user wants to start a feature -> Recommend `/spec <name>` (or `/feature <name>`).
- If no run is active and user wants to fix a bug -> Recommend `/fix <bug>`.
- If no run is active and user has pending ideas in `devflow/ideas.md` -> Highlight `/spec IDEA-xxx`.
- If no run is active and user wants deep architectural exploration -> Recommend `00-discover`.
- If user asks to check system health -> Recommend `doctor`.

---

## Intent Classification & Skill Routing

| User Intent / Request Type | Recommended Skill | Normal Name / Alias | Track / Lifecycle Path |
| :--- | :--- | :--- | :--- |
| **"Spec new feature / lean workflow"** | `spec` | `/spec` / `/feature` | **Fast-Track**: `/spec` -> `/implement` -> `/check` -> `/complete` |
| **"Quick bugfix / ad-hoc change"** | `spec` | `/fix` | **Fast-Track**: `/fix` -> `/implement` -> `/check` -> `/complete` |
| **"Capture quick idea / thought"** | `idea` | `/idea` | **Companion**: Enriches & saves to `devflow/ideas.md` |
| **"Execute implementation tasks"** | `implement` | `/implement` | **Fast-Track**: `/implement` -> `/check` |
| **"Run QA verification & check"** | `check` | `/check` | **Fast-Track**: `/check` -> `/complete` |
| **"Complete run & git merge"** | `complete` | `/complete` | **Fast-Track**: `/complete` |
| **"Generate HTML dashboard report"**| `report-html` | `/report:html` | **Standalone**: Converts `spec.md` / `60-report.md` to HTML |
| "Setup DevFlow on fresh/new project" | `onboard` | `onboard` / `setup` | `onboard` -> `/spec` or `10-define` |
| "Adopt DevFlow on existing codebase" | `adopt` | `adopt` / `bootstrap` | `adopt` -> `/spec` or `10-define` |
| "Check setup health & diagnostics" | `doctor` | `doctor` / `health` | `doctor` |
| "Explore a new request / deep idea" | `00-discover` | `discover` | **Deep-Track**: `00` -> `10` -> `20` -> ... |
| "Define delivery boundaries and ID" | `10-define` | `define` | **Deep-Track**: `10` -> `20` -> `30` |
| "Break down spec into plan (Deep)" | `30-plan` | `plan` | **Deep-Track**: `30` -> `40` -> `50` |
| "Deep code implementation" | `40-execute` | `implement` | **Deep-Track**: `40` -> `50` |
| "Deep QA verification" | `50-verify` | `verify` | **Deep-Track**: `50` -> `60` -> `70` |
| "Deep markdown digest report" | `60-report` | `report` | **Deep-Track**: `60` -> `70` |
| "Deep release packaging & merge" | `70-release` | `release` | **Deep-Track**: `70-release` |
| "Human manual QA walkthrough guide" | `try` | `try` | Companion (after implement or check) |
| "Safely plan feature or run reversal" | `rollback` | `rollback` | Companion |
| "Set up automatic GitHub Actions CI" | `ci` | `ci` | Companion |
| "Pre-check scope & risks before spec" | `brief` | `brief` | Companion |
| "Run autonomous bounded delivery loop"| `autopilot` | `autopilot` | Companion |
| "Brainstorm ideas without ID" | `brainstorm` | `brainstorm` | Companion |
| "Investigate failure or root cause" | `debug` | `debug` | Companion |

---

## Available Skills Sitemap

### 1. Fast-Track (Blueprint Mode - 4 Steps)
- `spec` (`/spec`, `/feature`, `/fix`, `$spec`) - Define, spec, plan, and create `spec.md`
- `implement` (`/implement`, `$implement`) - Execute planned checklist tasks with TDD
- `check` (`/check`, `$check`) - Senior QA review, multi-lane verification, record evidence
- `complete` (`/complete`, `$complete`) - Safety pass, release digest, git merge, close run

### 2. Deep-Track (Architect Mode - 8 Steps)
- `00-discover` - Explore request and decide Proceed/Defer/Reject
- `10-define` - Lock delivery boundaries and allocate Running ID
- `20-spec` - Formalize markdown delivery contract
- `30-plan` - Breakdown spec into phased tasks with test decisions
- `40-execute` - Incremental task implementation
- `50-verify` - Senior QA review and multi-lane validation
- `60-report` - Generate standardized markdown digest report
- `70-release` - Release packaging, release notes, and merge

### 3. Public Companion Commands
- `devflow` (`status`, `/devflow`) - Interactive guide, state inspector, and router
- `idea` (`/idea`) - Quick idea capture and AI feasibility enrichment into `devflow/ideas.md`
- `report-html` (`/report:html`) - Standalone interactive HTML report dashboard generator
- `onboard` - Baseline stack setup for freshly scaffolded projects
- `adopt` - Bootstrap DevFlow into existing brownfield projects
- `doctor` - Read-only health check for setup and drift
- `try` - Step-by-step human manual QA review guide
- `rollback` - Safe feature/run reversal planner
- `ci` - Automatic GitHub Actions workflow setup
- `brief` - Read-only scope and risk pre-briefing
- `autopilot` - Autonomous bounded delivery loop
- `brainstorm` - Ideate without allocating running IDs
- `debug` - Root cause investigation before or during implementation
- `overview` - Living context synchronization into project-overview.md
