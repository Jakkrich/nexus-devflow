# Workflow Surface Map (28 Core Skills)

This document outlines the active workflow surfaces and command taxonomy in **Nexus-DevFlow 2.5.0**.

The canonical surface contains **28 Core Skills** from
`agent-bundle.manifest.json#core_skills`. Additional Local or Personal Skills
may exist in a workspace, but are not bundled product commands until explicitly
promoted into that inventory.

---

## 1. Universal Command Invocations

Each command in DevFlow has exactly **one canonical name** and can be invoked across AI IDEs:
- **Slash Prefix (`/`)**: For Google Antigravity, Claude Code, Gemini CLI (e.g. `/feature`, `/devflow`, `/discovery`).
- **Dollar Prefix (`$`)**: For OpenAI Codex (e.g. `$feature`, `$devflow`, `$discovery`).
- **Plain Canonical Name**: Direct tool/skill calling in generic terminals or non-native agents (e.g. `feature`, `implement`, `check`, `complete`).

---

## 2. Canonical Surface Taxonomy (28 Core Skills)

### ⚡ 1. The 4-Stage Living Spec Lifecycle Skills (6 Skills)
| Command | Category | Purpose | Primary Artifact |
| :--- | :--- | :--- | :--- |
| `feature` | Spec & Plan | Combines discovery, specification, and task breakdown for planned work. | `devflow/context/current-feature.md` |
| `fix` | Spec & Plan | Documents and specs ad-hoc bug repairs or small changes. | `devflow/context/current-feature.md` |
| `implement` | Execution | Incrementally executes checklist tasks with strict TDD discipline. | `devflow/context/current-feature.md` |
| `check` | Quality Gate | Dual-Axis review of empirical spec fidelity and independent standards/architecture quality. | `devflow/context/current-feature.md` |
| `complete` | Delivery | Final safety audit, records Release Digest, branch merge, and archiving. | `devflow/history/{features\|fixes\|rollbacks}/` |
| `rollback` | Delivery | Safe feature reversal with dependency risk analysis preserving history. | `devflow/history/rollbacks/` |

---

### 🔮 2. Pre-Flight Discovery & Alignment Suite (4 Skills)
| Command | Category | Purpose | Primary Artifact |
| :--- | :--- | :--- | :--- |
| `idea` | Backlog | Idea inbox capture and AI feasibility scoring. | `devflow/ideas.md` |
| `grill` / `align` | Alignment | Socratic alignment interview, domain glossary extraction, and ADR generation. | `devflow/decisions/` & `glossary.md` |
| `brainstorm` | Ideation | Structured divergent & convergent ideation with trade-off matrices. | Interactive session |
| `discovery` | Exploration | Deep multi-turn inception exploration and discovery records. | `devflow/discoveries/DISC-xxx.md` |

---

### 🧰 3. Workspace Governance & Operations (18 Skills)
| Command | Category | Purpose |
| :--- | :--- | :--- |
| `devflow` | Navigation | Flagship interactive guide, state inspector, and intent router. |
| `doctor` | Diagnostics | Read-only health check for setup, adapters, and workflow drift. |
| `overview` | Context | Regenerate and validate `project-overview.md` from planning docs. |
| `brief` | Planning | Scope and dependency briefing before speccing a feature. |
| `debug` | Diagnostics | Scientific six-phase diagnosis using a deterministic red-capable feedback loop. |
| `onboard` | Onboarding | Setup baseline context on fresh or scaffolded projects. |
| `adopt` | Onboarding | Survey existing codebase and bootstrap DevFlow context into brownfield apps. |
| `try` | Quality Gate | Generate step-by-step human manual QA review guide. |
| `audit` | Quality Gate | Branch-aware or full-project code and security audit. |
| `ci` | Automation | Configure GitHub Actions verify workflow (`.github/workflows/verify.yml`). |
| `test` | Quality Gate | Test runner, missing test generation, and coverage check. |
| `tests` | Quality Gate | Add or normalize unit test suite. |
| `autopilot` | Autonomous | Bounded Living Spec execution loop (`feature`/`fix` -> `implement` -> `check`) stopping before merge. |
| `prototype` | Ideation | Throwaway pre-build static HTML/CSS mockups sharing design tokens. |
| `release` | Deployment | Cloud deployment readiness check (Render / Vercel). |
| `status` | State | Progress summary and next action inspector. |
| `report-html` | Reporting | Generate interactive standalone HTML report dashboard. |
| `convert-any-to-md` | Utility | Document conversion utility into markdown in `devflow/reference/`. |

---

## 3. Bundled Core vs Local Extensions

- **Bundled Core Skill**: listed in `agent-bundle.manifest.json#core_skills`, mirrored across both adapters, validated, and included in the package template.
- **Local/Personal Skill**: present in a maintainer workspace but absent from the canonical inventory; allowed locally and excluded from package output.
- **Promotion rule**: adding a directory does not promote a command. Promotion requires an explicit inventory, documentation, adapter, test, and release decision.

## 4. Review & Authoring References

- [Skill selection policy](skill-selection-policy.md)
- [Governance rules](governance-rules.md)
- [Markdown metadata contract](markdown-metadata-contract.md)
- [Manual review workflow](manual-review-workflow-spec.md)
- [Living Spec examples](examples/living-spec/)
