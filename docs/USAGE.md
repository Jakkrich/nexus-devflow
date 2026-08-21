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
   - **Deep-Track Active Work**: `current-run/` (Artifacts `10-define.md` through `70-release.md`).
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
00-discover ──▶ 10-define ──▶ 20-spec ──▶ 30-plan ──▶ 40-execute ──▶ 50-verify ──▶ 60-report ──▶ 70-release
```

| Stage | Command | Artifact | Stage Responsibility |
| :--- | :--- | :--- | :--- |
| **00** | `/00-discover` | `discoveries/DISC-xxx/00-discover.md` | Problem exploration, research, and Go/No-Go decision without allocating a delivery ID. |
| **10** | `/10-define` | `context/current-run/10-define.md` | Locks delivery boundary, allocates sequential ID `xxx-slug`, and sets scope. |
| **20** | `/20-spec` | `context/current-run/20-spec.md` | Markdown delivery contract with testable Given-When-Then criteria. |
| **30** | `/30-plan` | `context/current-run/30-plan.md` | Breakdown into executable task units with TDD test decisions. |
| **40** | `/40-execute` | `context/current-run/40-execute.md` | Step-by-step task implementation behind review gates. |
| **50** | `/50-verify` | `context/current-run/50-verify.md` | Multi-lane verification matrix (9arm Scrutinize QA, edge cases, null-safety). |
| **60** | `/60-report` | `context/current-run/60-report.md` | Standardized markdown delivery digest and retrospective lessons learned. |
| **70** | `/70-release` | `history/{cat}/{xxx-slug}/` | Release packaging, Conventional Commit, SemVer calculation, git merge, and archive. |

---

## 3. Core Skills Inventory (28 Skills)

DevFlow provides exactly **28 Core Skills** synchronized 1:1 across `.agents/skills/` (Codex / Antigravity) and `.claude/skills/` (Claude Code):

### A. Fast-Track Skills (5)
- `feature`: Break down a planned build item into a living spec.
- `fix`: Document and spec an ad-hoc bug or issue.
- `implement`: Step-by-step implementation behind review gates.
- `check`: Senior QA verification matrix against the running app.
- `complete`: Final safety audit, Conventional Commit, archiving, and branch merge.

### B. Deep-Track Skills (8)
- `00-discover`: Problem space exploration and Go/No-Go routing.
- `10-define`: Delivery run definition and scope boundaries.
- `20-spec`: Formal markdown specification contract.
- `30-plan`: Task breakdown with TDD test strategy.
- `40-execute`: Incremental unit execution.
- `50-verify`: Senior QA 6-lane verification.
- `60-report`: Standardized delivery digest and retrospective insights.
- `70-release`: Release packaging, git operations, and history archiving.

### C. Companion Tools & Quality Gates (15)
- `devflow`: Flagship interactive guide and state router.
- `doctor`: Read-only health check for setup, adapters, and workflow drift.
- `overview`: Regenerate and validate `project-overview.md` from plans.
- `debug`: Non-destructive root-cause analysis and defect reproduction.
- `onboard`: Setup baseline context on fresh or scaffolded projects.
- `adopt`: Survey existing codebase and bootstrap DevFlow context.
- `try`: Generate step-by-step human manual QA review guide.
- `rollback`: Safe feature reversal with dependency risk analysis.
- `idea`: Idea inbox management and AI feasibility scoring.
- `ci`: Configure GitHub Actions verify workflow.
- `test`: Test suite runner, missing test generation, and coverage check.
- `autopilot`: Bounded autonomous spec-build-check-audit loop.
- `prototype`: Throwaway pre-build static HTML/CSS mockups.
- `report-html`: Standalone interactive HTML dashboard generator.
- `brief`: Pre-briefing on upcoming features before speccing.

---

## 4. In-Flow Engineering Best Practices

Best practices are absorbed directly into the workflow:
- **Conventional Commits & SemVer**: Managed in `/complete` and `/70-release`.
- **9arm Scrutinize QA**: Embedded into `/check` and `/50-verify` (checking null safety, array bounds, async race conditions, security review).
- **Deep Modules & Code Simplification**: Defined in `devflow/context/coding-standards.md`.
- **Standalone HTML Dashboard**: Mainline stages output clean Markdown only. When an HTML dashboard is needed, run `/report-html` or `npm run report:html -- {ID}` on demand.

---

## 5. CLI & Status Commands

```bash
# Check status, active work, and next action
npx @jakkrichm/create-nexus-devflow status

# Safe update to latest DevFlow version
npx @jakkrichm/create-nexus-devflow update

# Clean eject / uninstall
npx @jakkrichm/create-nexus-devflow uninstall --keep-history -y
```
