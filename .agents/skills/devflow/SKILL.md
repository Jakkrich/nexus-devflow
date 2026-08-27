---
name: devflow
description: "[devflow] Flagship interactive guide, state inspector, and intent router for DevFlow workflows."
---

# devflow - Interactive Workflow Guide & Intent Router for Nexus-DevFlow

Use this skill to guide the user on what to do next, inspect current workspace state, map their natural language intent to the matching Nexus-DevFlow stage or companion command, or display a sitemap of available DevFlow skills.

## Input

- **No argument (`devflow`, `/devflow`, `$devflow`, or `status`)**: Inspect current workspace state (active tasks in `devflow/context/{xxx-slug}/`, active discovery in `devflow/discoveries/`, pending ideas in `devflow/ideas.md`, and project overview in `devflow/context/project-overview.md`) and recommend the exact next action.
- **With user request (`devflow "<request>"`)**: Classify the user's intent and guide them to the matching DevFlow workflow stage or companion command path.

## The Task-Isolated Living Spec Architecture

Nexus-DevFlow uses a **Task-Isolated Living Spec Model**:
- **The 4-Stage Lifecycle**: `/feature` (or `/fix`) ➔ `/implement` ➔ `/check` ➔ `/complete`
- Driven by a **Task-Isolated Living Spec (`devflow/context/{xxx-slug}/spec.md`)** that integrates architectural depth (Define, Spec, Plan, Execution Log, Multi-Lane QA, and Release Digest) into dedicated task workspaces without root bottleneck.
- **Pre-Flight Inception Engine**: Companion skills (`/discovery`, `/idea`, `/grill`, `/brainstorm`) feed directly into `/feature`.

---

## Workspace State Inspection

When invoked without an argument (or when determining the next step), inspect:

1. **Project Setup Baseline**: Read `devflow/context/project-overview.md` and `devflow/context/coding-standards.md`. If empty or default placeholders, recommend `onboard` (for fresh projects) or `adopt` (for existing codebases).
2. **Active Delivery Runs**: Scan `devflow/context/{xxx-slug}/` subdirectories.
   - If active `spec.md` has incomplete checklist tasks (`- [ ]`) -> Recommend `/implement [id]`.
   - If all tasks are completed (`- [x]`) but no passing verification evidence in Section 5 -> Recommend `/check [id]`.
   - If verification evidence passed in Section 5 -> Recommend `/complete [id]`.
3. **Active Discovery**: Check `devflow/discoveries/` for open discovery notes.
4. **Pending Ideas Inbox**: Check `devflow/ideas.md`. If items exist under `## 📌 Pending Ideas`, summarize them in a **💡 Pending Ideas (Inbox)** list with their IDs (`[IDEA-xxx]`), feasibility, and mention that they can be started with `/feature IDEA-xxx` or `/discovery IDEA-xxx`.
5. **Audit Findings Ledger**: Check `devflow/context/{xxx-slug}/findings.md` for open high-severity findings.

### Default State Recommendations
- If no run is active and user wants to start a feature -> Recommend `/feature <name>`.
- If no run is active and user wants to fix a bug -> Recommend `/fix <bug>`.
- If no run is active and user has pending ideas in `devflow/ideas.md` -> Highlight `/feature IDEA-xxx` or `/discovery IDEA-xxx`.
- If no run is active and user wants deep architectural exploration -> Recommend `/discovery`.
- If user asks to check system health -> Recommend `doctor`.

---

## Intent Classification & Skill Routing

| User Intent / Request Type | Recommended Skill | Normal Name / Alias | Lifecycle Path |
| :--- | :--- | :--- | :--- |
| **"Spec new feature / living spec"** | `feature` | `/feature` / `/spec` | **Unified**: `/feature` -> `/implement` -> `/check` -> `/complete` |
| **"Quick bugfix / ad-hoc change"** | `fix` | `/fix` | **Unified**: `/fix` -> `/implement` -> `/check` -> `/complete` |
| **"Capture quick idea / thought"** | `idea` | `/idea` | **Companion**: Enriches & saves to `devflow/ideas.md` |
| **"Pre-delivery exploration / research"**| `discovery`| `/discovery` | **Pre-Flight**: `discovery` -> `/feature` |
| **"Socratic alignment / ADR / glossary"**| `grill` | `/grill` / `/align` | **Pre-Flight**: `grill` -> `/feature` |
| **"Execute implementation tasks"** | `implement` | `/implement` | **Core Loop**: `/implement` -> `/check` |
| **"Run QA verification & check"** | `check` | `/check` | **Core Loop**: `/check` -> `/complete` |
| **"Complete run & git merge"** | `complete` | `/complete` | **Core Loop**: `/complete` |
| **"Generate HTML dashboard report"**| `report-html` | `/report:html` | **Standalone**: Converts living spec or archive to HTML |
| **"Create editorial diagram / flowchart"**| `diagram-design`| `/diagram-design` | **Third-Party**: 39 visual diagrams (HTML/SVG) |
| "Setup DevFlow on fresh/new project" | `onboard` | `onboard` / `setup` | `onboard` -> `/feature` |
| "Adopt DevFlow on existing codebase" | `adopt` | `adopt` / `bootstrap` | `adopt` -> `/feature` |
| "Check setup health & diagnostics" | `doctor` | `doctor` / `health` | `doctor` |
| "Human manual QA walkthrough guide" | `try` | `try` | Companion (after implement or check) |
| "Safely plan feature or run reversal"| `rollback` | `rollback` | Companion |
| "Set up automatic GitHub Actions CI" | `ci` | `ci` | Companion |
| "Pre-check scope & risks before spec"| `brief` | `brief` | Companion |
| "Run autonomous bounded delivery loop"| `autopilot` | `autopilot` | Companion |
| "Brainstorm ideas without ID" | `brainstorm` | `brainstorm` | Companion |
| "Investigate failure or root cause" | `debug` | `debug` | Companion |

---

## Available Skills Sitemap

### 1. Mainline Living Spec Loop (4 Steps)
- `feature` (`/feature`, `/spec`) - Define, spec, and plan in `devflow/context/{xxx-slug}/spec.md`
- `fix` (`/fix`) - Document an ad-hoc bug or change in `devflow/context/{xxx-slug}/spec.md`
- `implement` (`/implement`) - Execute planned checklist tasks with TDD
- `check` (`/check`) - Senior QA review, multi-lane verification, record evidence
- `complete` (`/complete`) - Safety pass, release digest, git merge, close run

### 2. Pre-Flight Discovery Engine
- `discovery` - Project roadmap planning or feature exploration before delivery commitment
- `idea` - Quick idea capture with AI feasibility scoring
- `grill` (or `align`) - Socratic alignment, domain modeling, and ADR recording
- `brainstorm` - Multi-option ideation with trade-off analysis

### 3. Verification & Diagnostic Companions
- `doctor` - Health check for setup, adapters, and workspace state
- `audit` - Branch-aware or full-project code, security, and quality review
- `test` / `tests` - Test suite runner and unit test scaffolding
- `ci` - Set up or normalize GitHub Actions checks
- `status` - Read-only progress summary and next action suggestion
- `try` - Human manual QA walkthrough guide
- `report-html` - Standalone interactive HTML report dashboard
- `debug` - Root-cause investigation without editing code
- `rollback` - Safe reversal of completed features
- `release` - Deployment readiness check

### 4. Installed Third-Party Skills & Extensions
- `diagram-design` (`/diagram-design`) - 39 editorial visual diagram types (HTML/SVG) for system architecture, sequence flows, ER models, data platform pipelines, and journeys.
- *Use `nexus-devflow skill add <url>` to install more third-party skills.*