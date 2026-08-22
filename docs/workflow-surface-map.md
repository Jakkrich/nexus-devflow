# Workflow Surface Map (28 Core Skills)

This document outlines the active workflow surfaces and command taxonomy in **Nexus-DevFlow 2.0**.

---

## 1. Universal Command Invocations

Each command in DevFlow has exactly **one canonical name** and can be invoked across AI IDEs:
- **Slash Prefix (`/`)**: For Google Antigravity, Claude Code, Gemini CLI (e.g. `/feature`, `/devflow`, `/00-explore`).
- **Dollar Prefix (`$`)**: For OpenAI Codex (e.g. `$feature`, `$devflow`, `$00-explore`).
- **Plain Canonical Name**: Direct tool/skill calling in generic terminals or non-native agents.

---

## 2. Canonical Surface Taxonomy (28 Core Skills)

### 🏎️ Track 1: Fast-Track (5 Skills)
| Command | Category | Purpose | Artifact |
| :--- | :--- | :--- | :--- |
| `feature` | Spec & Plan | Combines discovery, specification, and task breakdown for planned work. | `devflow/context/current-feature.md` |
| `fix` | Spec & Plan | Documents and specs ad-hoc bug repairs or small changes. | `devflow/context/current-feature.md` |
| `implement` | Execution | Incrementally executes checklist tasks with TDD discipline. | `devflow/context/current-feature.md` |
| `check` | Quality Gate | Senior QA multi-lane verification matrix (Typecheck, Lint, Tests, Security). | `devflow/context/current-feature.md` |
| `complete` | Delivery | Final safety audit, Conventional Commit, SemVer, branch merge, and archiving. | `devflow/history/{features\|fixes\|rollbacks}/` |

---

### 🏗️ Track 2: Deep-Track (8 Skills)
| Command | Category | Purpose | Artifact |
| :--- | :--- | :--- | :--- |
| `00-explore` | Exploration | Problem exploration and Go/No-Go routing before delivery commitment. | `devflow/discoveries/DISC-xxx/00-explore.md` |
| `10-define` | Definition | Locks delivery boundaries, allocates sequential ID `xxx-slug`, and sets scope. | `devflow/context/current-run/10-define.md` |
| `20-spec` | Specification | Formal markdown specification contract with acceptance criteria. | `devflow/context/current-run/20-spec.md` |
| `30-plan` | Planning | Breaks down spec into executable tasks with TDD test decisions. | `devflow/context/current-run/30-plan.md` |
| `40-execute` | Execution | Step-by-step task implementation behind review gates. | `devflow/context/current-run/40-execute.md` |
| `50-verify` | Quality Gate | Senior QA 6-lane verification matrix. | `devflow/context/current-run/50-verify.md` |
| `60-report` | Reporting | Standardized delivery digest and retrospective insights. | `devflow/context/current-run/60-report.md` |
| `70-release` | Delivery | Release packaging, SemVer, git merge, and history archiving. | `devflow/history/{category}/{xxx-slug}/` |

---

### 🧰 Companion Tools & Quality Gates (15 Skills)
| Command | Category | Purpose |
| :--- | :--- | :--- |
| `devflow` | Navigation | Flagship interactive guide, state inspector, and intent router. |
| `doctor` | Diagnostics | Read-only health check for setup, adapters, and workflow drift. |
| `overview` | Context | Regenerate and validate `project-overview.md` from planning docs. |
| `debug` | Diagnostics | Non-destructive root-cause analysis and defect reproduction. |
| `onboard` | Onboarding | Setup baseline context on fresh or scaffolded projects. |
| `adopt` | Onboarding | Survey existing codebase and bootstrap DevFlow context into brownfield apps. |
| `try` | Quality Gate | Generate step-by-step human manual QA review guide. |
| `rollback` | Delivery | Safe feature reversal with dependency risk analysis. |
| `idea` | Backlog | Idea inbox capture and AI feasibility scoring into `devflow/ideas.md`. |
| `ci` | Automation | Configure GitHub Actions verify workflow (`.github/workflows/verify.yml`). |
| `test` | Quality Gate | Test runner, missing test generation, and coverage check. |
| `autopilot` | Autonomous | Bounded autonomous spec-build-check loop stopping before merge. |
| `prototype` | Ideation | Throwaway pre-build static HTML/CSS mockups sharing design tokens. |
| `report-html` | Reporting | Standalone interactive HTML dashboard generator on demand. |
| `brief` | Planning | Pre-briefing on upcoming features before speccing. |
