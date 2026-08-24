# Nexus-DevFlow 2.0 Comprehensive Usage Guide

This guide provides full operating instructions for **Nexus-DevFlow 2.0 (The 3-Pillars & Dual-Track Model)** across Google Antigravity, OpenAI Codex, Claude Code, Cursor, and related AI development environments.

---

## 1. Core Architecture: The 3-Pillars Model

Nexus-DevFlow structures development history and active context into three distinct temporal pillars:

1. **🔮 Future (Backlog)**: [`devflow/ideas.md`](file:///d:/Projects/devtools/nexus-devflow/devflow/ideas.md)
   - Centralized Idea Inbox with AI feasibility, value scoring, and priority tagging (`[IDEA-xxx]`).
   - Quick idea capture via `/idea {description}`.
2. **⚡ Present (Active Context)**: `devflow/context/`
   - Single Source of Truth: `project-overview.md`, `coding-standards.md`, `ai-interaction.md`.
   - **Fast-Track Active Work**: `current-feature.md` (Single Living Spec).
   - **Deep-Track Active Work**: `current-run/` (Artifacts `10-define.md` through `70-deliver.md`).
   - Active Stage Inspector & Single Active Run Guardrail: `current-stage.md`.
   - Findings Ledger: `findings.md` (P0/P1 quality & security blockers).
3. **📦 Past (History Archive)**: `devflow/history/`
   - Categorized delivery archives: `features/`, `fixes/`, `rollbacks/`.
   - Master Release Ledger: `HISTORY.md`.

---

## 2. Dual-Track Delivery Lifecycle

### 🏎️ Track 1: Fast-Track (Blueprint Mode — 4 Steps)
Recommended for 85% of daily work (iterative features, UI updates, bug fixes):

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

| Step | Command | Artifact | Description |
| :--- | :--- | :--- | :--- |
| **1. Spec** | `/feature {title}`<br>`/fix {bug}` | `context/current-feature.md` | Allocates sequential ID (`xxx-slug`), writes spec with acceptance criteria and task checklist behind review gate. |
| **2. Build** | `/implement` | `context/current-feature.md` | Executes tasks incrementally with TDD discipline, small diffs, and evidence recording. |
| **3. Verify**| `/check` | `context/current-feature.md` | Senior QA 6-lane verification (Typecheck, Lint, Tests, Manual Proof, Security). |
| **4. Close** | `/complete` | `history/{cat}/{xxx-slug}.md` | Final safety audit, Conventional Commit, archives spec, squash-merges branch, and resets stub. |

---

### 🏗️ Track 2: Deep-Track (Architect Mode — 8 Steps)
Recommended for complex architectural epics, database schema migrations, and multi-agent coordination:

```text
discovery ──▶ 10-define ──▶ 20-spec ──▶ 30-plan ──▶ 40-execute ──▶ 50-verify ──▶ 60-report ──▶ 70-deliver
```

| Stage | Command | Artifact | Stage Responsibility |
| :--- | :--- | :--- | :--- |
| **00** | `/discovery` | `discoveries/DISC-xxx/discovery.md` | Problem exploration, roadmap planning, research, and Go/No-Go decision without allocating a delivery ID. |
| **10** | `/10-define` | `context/current-run/10-define.md` | Locks delivery boundary, allocates sequential ID `xxx-slug`, and sets scope. |
| **20** | `/20-spec` | `context/current-run/20-spec.md` | Markdown delivery contract with testable Given-When-Then criteria. |
| **30** | `/30-plan` | `context/current-run/30-plan.md` | Breakdown into executable task units with TDD test decisions. |
| **40** | `/40-execute` | `context/current-run/40-execute.md` | Step-by-step task implementation behind review gates. |
| **50** | `/50-verify` | `context/current-run/50-verify.md` | Multi-lane verification matrix (9arm Scrutinize QA, edge cases, null-safety). |
| **60** | `/60-report` | `context/current-run/60-report.md` | Standardized markdown delivery digest and retrospective lessons learned. |
| **70** | `/70-deliver` | `history/{cat}/{xxx-slug}/` | Release packaging, Conventional Commit, SemVer calculation, git merge, and archive. |

---

## 3. Core Skills Inventory (36 Skills)

DevFlow provides **36 Core Skills** synchronized 1:1 across `.agents/skills/` (Codex / Antigravity / Copilot) and `.claude/skills/` (Claude Code):

### A. Fast-Track Skills (5)
- `feature`: Break down a planned build item into a living spec (`devflow/context/current-feature.md`).
- `fix`: Document and spec an ad-hoc bug or issue.
- `implement`: Step-by-step implementation behind review gates.
- `check`: Senior QA verification matrix against the running app.
- `complete`: Final safety audit, Conventional Commit, archiving, and branch merge.

### B. Deep-Track Skills (8)
- `discovery`: Unified discovery and exploration (`devflow/discoveries/DISC-xxx/discovery.md`).
- `10-define`: Delivery run definition and scope boundaries (`10-define.md`).
- `20-spec`: Formal markdown specification contract (`20-spec.md`).
- `30-plan`: Task breakdown with TDD test strategy (`30-plan.md`).
- `40-execute`: Incremental unit execution behind review gates (`40-execute.md`).
- `50-verify`: Senior QA 6-lane verification (`50-verify.md`).
- `60-report`: Standardized delivery digest and retrospective insights (`60-report.md`).
- `70-deliver`: Release packaging, git operations, and history archiving (`70-deliver.md`).

### C. Discovery, Architecture & Planning Skills (6)
- `grill`: Interactive Socratic alignment & domain modeling - codebase-grounded interview, domain glossary extraction (`devflow/context/glossary.md`), and ADR recording (`devflow/decisions/`).
- `discovery`: Deep, multi-turn guided planning interview that drafts user-owned plans (`project-plan.md` & `build-plan.md`).
- `brief`: Read-only briefing on an upcoming build-plan feature (scope, dependencies, sizing, and automatic splitting).
- `brainstorm`: Structured divergent & convergent ideation generating 2-3 viable options with trade-off analysis.
- `prototype`: Throwaway pre-build static HTML/CSS mockups sharing a common design theme.
- `convert-any-to-md`: Unified document parser converting Excel (`.xlsx`), PDF (`.pdf`), Word (`.docx`), and plaintext to clean Markdown in `devflow/reference/`.

### D. Verification, Governance & Deployment Skills (8)
- `audit`: Comprehensive code, security, performance, and test quality audit maintaining `devflow/context/findings.md`.
- `doctor`: Read-only health check for setup, adapters, planning readiness, and workflow drift (`--fix` supported).
- `overview`: Regenerate and compile `devflow/context/project-overview.md` from plans and history.
- `debug`: Non-destructive root-cause analysis and defect reproduction without modifying source code.
- `tests` / `test`: Test suite runner, missing test generation, and coverage decision matrix.
- `ci`: Configure project-specific Verify command and matching GitHub Actions CI workflow.
- `release`: Cloud deployment readiness check and config generator (Render `render.yaml` or Vercel `vercel.json`).
- `rollback`: Safe reversal of completed features with dependency risk analysis.

### E. Companion & Workflow Guidance Skills (9)
- `devflow`: Flagship interactive guide and state router.
- `onboard`: Setup baseline context on fresh or scaffolded projects.
- `adopt`: Survey existing codebase and bootstrap DevFlow context.
- `try`: Generate step-by-step human manual QA review guide.
- `idea`: Idea inbox management, AI feasibility scoring, and status backlog integration.
- `autopilot`: Autonomous spec/build/check/audit loop for Fast-Track or Deep-Track.
- `report-html`: Standalone interactive HTML dashboard generator on demand.
- `status`: Show project progress, build queue, and exact next action.

---

## 4. Real-Time Web Dashboard & Dual-Track Visualizer

Launch the local interactive dashboard in your browser:

```bash
npx @jakkrichm/create-nexus-devflow dashboard
```

- **Blueprint Parity Theme**: High-contrast `#071626` deep navy theme with semantic status indicators.
- **Dual-Track Visualizer**: Dynamic pipeline steppers for Fast-Track (4 steps) and Deep-Track (8 stages).
- **Auto-Focus & Active Badge**: Automatically selects the active track tab from `devflow/context/current-stage.md` and displays a pulsing `● ACTIVE` badge indicator.
- **Quick Commands & Copy**: Hover tooltips with skill documentation and one-click command copy with visual feedback.
- **Live Auto-Refresh**: Polls `/api/dashboard` every 2 seconds for real-time synchronization with active AI workflows.

---

## 5. In-Flow Engineering Best Practices

Best practices are absorbed directly into the workflow:
- **Unified Root Switch**: `devflow/context/current-stage.md` serves as the authoritative source of truth for active track and stage lifecycle.
- **Conventional Commits & SemVer**: Managed in `/complete` and `/70-deliver`.
- **9arm Scrutinize QA**: Embedded into `/check` and `/50-verify` (null safety, array bounds, async race conditions, security review).
- **Deep Modules & Code Simplification**: Defined in `devflow/context/coding-standards.md`.
- **Standalone HTML Dashboard**: Mainline stages output clean Markdown only. When an HTML dashboard is needed, run `/report-html` or `npm run report:html -- {ID}` on demand.

---

## 6. CLI & Status Commands

```bash
# Launch interactive Real-Time Local Dashboard
npx @jakkrichm/create-nexus-devflow dashboard

# Check status, active work, and next action in terminal
npx @jakkrichm/create-nexus-devflow status

# Safe update to latest DevFlow version with automatic backup
npx @jakkrichm/create-nexus-devflow update

# Clean eject / uninstall
npx @jakkrichm/create-nexus-devflow uninstall --keep-history -y
```
