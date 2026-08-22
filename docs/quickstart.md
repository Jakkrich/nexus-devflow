# Quickstart Guide

Getting started with **Nexus-DevFlow 2.0** — an agentic workflow layer supporting **The 3-Pillars Workspace Architecture & Dual-Track Delivery Model** for Google Antigravity, OpenAI Codex, Claude Code, Cursor, and other AI IDEs.

---

## 1. Client Installation

In your terminal, navigate to your target project folder (either a fresh scaffold or an existing codebase):

```bash
# Automated install (Recommended)
npx -y @jakkrichm/create-nexus-devflow@latest -y

# Interactive install (Select specific tool adapters)
npx @jakkrichm/create-nexus-devflow@latest
```

This overlays the `.agents/`, `.claude/`, and `devflow/` workflow structures into your repository without modifying your existing application source code.

---

## 2. Project Baseline Setup

Open your AI IDE (Antigravity, Claude Code, Codex, or Cursor) and run the appropriate starting command in the chat:

| Situation | Starting Command | Purpose |
| :--- | :--- | :--- |
| **Existing Codebase (Brownfield)** | `/adopt` *(or `$adopt`)* | Surveys your codebase, creates baseline planning docs, coding standards, and registers project context. |
| **Fresh Project (Scaffolded)** | `/onboard` *(or `$onboard`)* | Configures project metadata, stack commands, coding standards, and tool adapters. |
| **Health & Setup Check** | `/doctor` *(or `$doctor`)* | Read-only diagnostic checking adapters, config files, commands, and workflow integrity. |
| **Interactive Navigation** | `/devflow` *(or `$devflow`)* | Flagship guide that analyzes workspace state and recommends the exact next action. |

---

## 3. Choose Your Delivery Track

Nexus-DevFlow provides two optimized delivery tracks depending on task complexity:

### 🏎️ Track 1: Fast-Track (Blueprint Mode — 4 Steps)
*Recommended for 85% of daily work (features, bug fixes, UI improvements, iterative tasks).*

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. `/feature {title}` (or `/fix {bug}`): Allocates sequential ID (`xxx-slug`) and initializes the Single Living Spec in `devflow/context/current-feature.md`.
2. `/implement`: Incrementally executes checklist tasks with TDD discipline.
3. `/check`: Senior QA multi-lane verification (Typecheck, Lint, Tests, manual proof).
4. `/complete`: Final safety audit, archives to `devflow/history/{features|fixes|rollbacks}/`, merges branch, and resets workspace to Idle.

---

### 🏗️ Track 2: Deep-Track (Architect Mode — 8 Steps)
*Recommended for large architectural epics, database migrations, and multi-agent coordination.*

```text
00-explore ──▶ 10-define ──▶ 20-spec ──▶ 30-plan ──▶ 40-execute ──▶ 50-verify ──▶ 60-report ──▶ 70-deliver
```

1. `/00-explore`: Explore request before delivery commitment (`devflow/discoveries/DISC-xxx/00-explore.md`).
2. `/10-define`: Lock delivery boundaries in `devflow/context/current-run/10-define.md`.
3. `/20-spec`: Formalize markdown delivery contract & testable acceptance criteria.
4. `/30-plan`: Break down spec into executable tasks with test decisions.
5. `/40-execute`: Incremental task implementation behind review gates.
6. `/50-verify`: Senior QA review across 6 verification lanes.
7. `/60-report`: Standardized markdown delivery digest and retrospective lessons learned.
8. `/70-deliver`: Package verified work, git merge, and archive `current-run/` ➔ `devflow/history/{category}/{xxx-slug}/`.

---

## 4. The 3-Pillars Workspace Architecture

```text
devflow/
├── ideas.md                    # 🔮 Future (Backlog): Idea Inbox with AI scoring
├── context/                    # ⚡ Present (Active Context): Single Living Spec & Active State
│   ├── current-feature.md      # Fast-Track Single Living Spec
│   ├── current-stage.md        # Active stage inspector & guardrail
│   ├── current-run/            # Deep-Track active stage artifacts (10-define to 70-deliver)
│   ├── project-overview.md     # Single Source of Truth
│   ├── coding-standards.md     # Engineering standards & conventions
│   ├── ai-interaction.md       # AI interaction guidelines
│   └── findings.md             # Quality & security findings ledger
├── history/                    # 📦 Past (History Archive): Categorized delivery archives
│   ├── features/               # Shipped features ({xxx-slug}/ or {xxx-slug}.md)
│   ├── fixes/                  # Resolved bug fixes
│   ├── rollbacks/              # Reversal audit logs
│   └── HISTORY.md              # Master release ledger
└── discoveries/                # Pre-delivery discovery records (DISC-xxx/)
```

---

## 5. Maintenance & CLI Commands

```bash
# Inspect project status, active work, findings, and next action
npx @jakkrichm/create-nexus-devflow status

# Update DevFlow files safely without overwriting project customizations
npx @jakkrichm/create-nexus-devflow update

# Generate interactive standalone HTML report on demand
npm run report:html -- {RUN_ID}

# Clean uninstall / eject from project
npx @jakkrichm/create-nexus-devflow uninstall --keep-history -y
```
