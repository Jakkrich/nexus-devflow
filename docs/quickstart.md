# Quickstart Guide

Getting started with **Nexus-DevFlow 2.13.0** — an enterprise agentic workflow layer supporting **The 3-Pillars Workspace Architecture & Pure Task-Isolated Living Spec Model** for Google Antigravity, OpenAI Codex, Claude Code, Cursor, GitHub Copilot, and other AI IDEs.

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

## 3. The Unified 4-Stage Task-Isolated Living Spec Lifecycle

All development tasks (from small UI fixes to deep architectural features) execute through the 4-stage task-isolated living spec lifecycle:

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. **`/feature {title}`** (or **`/fix {bug}`**): Allocates sequential ID (`xxx-slug`) and initializes the Task-Isolated Living Spec in `devflow/context/{xxx-slug}/spec.md`, stage pointer (`stage.md`), and dedicated audit ledger (`findings.md`).
2. **`/implement [id]`**: Incrementally executes checklist tasks in `devflow/context/{xxx-slug}/spec.md` with strict TDD discipline (Red-Green-Refactor).
3. **`/check [id]`**: Senior QA multi-lane verification (Typecheck, Lint, Test suites, and behavioral manual proof), records empirical proof into `spec.md` and findings into `findings.md`.
4. **`/complete [id]`**: Final safety audit, records Release Digest, auto-archives to `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`, cleanly removes `devflow/context/{xxx-slug}/`, updates `HISTORY.md` and `build-plan.md`, and manages git squash-merge.

---

## 4. Pre-Flight Discovery, SA & Architectural Alignment

Before committing to delivery, use specialized companion skills to refine complex requirements:

```text
/analyze ──▶ /idea (Inbox) ──▶ /grill (Socratic ADR) ──▶ /discovery (Explore) ──▶ /feature (Deliver)
```

- **`/analyze`**: Multi-format requirement ingestion (PDF, Word, Excel, Images) and codebase impact scan.
- **`/idea`**: Quick idea capture in `devflow/ideas.md` with instant AI feasibility scoring.
- **`/grill`** (or **`/align`**): Socratic alignment & domain modeling; records Architecture Decision Records (`devflow/decisions/ADR-xxx.md`).
- **`/brainstorm`**: Structured ideation with trade-off analysis.
- **`/discovery`**: Deep inception and exploratory discovery (`devflow/discoveries/DISC-xxx.md`).

---

## 5. The 3-Pillars Workspace Architecture

```text
devflow/
├── ideas.md                    # 🔮 Future (Backlog): Idea Inbox with AI scoring
├── project-plan.md             # 🔮 Future (Backlog): Product Vision & Architectural Roadmap
├── build-plan.md               # 🔮 Future (Backlog): Master Feature Delivery Sequence
├── context/                    # ⚡ Present (Active Context): Global Truth & Task Workspaces
│   ├── project-overview.md     # Single Source of Truth
│   ├── coding-standards.md     # Engineering standards & conventions
│   ├── ai-interaction.md       # AI interaction guidelines
│   ├── glossary.md             # Domain glossary & architecture terms
│   └── {xxx-slug}/             # Active Task-Isolated Workspace
│       ├── spec.md             # Living Spec & Task Breakdown
│       ├── stage.md            # Stage pointer & status
│       └── findings.md         # Dedicated audit & quality ledger
├── decisions/                  # 🏛️ Decisions: Architecture Decision Records (ADR-xxx.md)
├── history/                    # 📦 Past (History Archive): Categorized delivery archives
│   ├── features/               # Shipped features ({xxx-slug}.md)
│   ├── fixes/                  # Resolved bug fixes ({xxx-slug}.md)
│   ├── rollbacks/              # Reversal audit logs (YYYY-MM-DD-{xxx-slug}.md)
│   └── HISTORY.md              # Master release ledger
└── discoveries/                # 🔍 Discoveries: Pre-delivery discovery records (DISC-xxx.md)
```

---

## 6. Maintenance & CLI Commands

```bash
# Launch interactive Real-Time Local Dashboard (0ms SSR Hydration & Git Cache)
npx @jakkrichm/create-nexus-devflow dashboard

# Check active project status across 3-Pillars
npx @jakkrichm/create-nexus-devflow status

# Automated Quality Gatekeeper
npx @jakkrichm/create-nexus-devflow gate [--strict]

# Model Context Protocol (MCP) Server Hub
npx @jakkrichm/create-nexus-devflow mcp

# Multi-Agent Swarm & Code Graph RAG
npx @jakkrichm/create-nexus-devflow swarm
npx @jakkrichm/create-nexus-devflow graph --file src/index.ts

# JIT Context Slicing Engine
npx @jakkrichm/create-nexus-devflow slice --stage implement

# Manage vendor skills (e.g. bughunter, matt-pocock)
npx @jakkrichm/create-nexus-devflow skill list
npx @jakkrichm/create-nexus-devflow skill restore
```
