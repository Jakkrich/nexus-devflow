# Quickstart Guide

Getting started with **Nexus-DevFlow 2.5.0** — an enterprise agentic workflow layer supporting **The 3-Pillars Workspace Architecture & Single Living Spec Model** for Google Antigravity, OpenAI Codex, Claude Code, Cursor, GitHub Copilot, and other AI IDEs.

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

## 3. The Unified 4-Stage Living Spec Lifecycle

All development tasks (from small UI fixes to deep architectural features) execute through the 4-stage single living spec lifecycle:

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. **`/feature {title}`** (or **`/fix {bug}`**): Allocates sequential ID (`xxx-slug`) and initializes the Single Living Spec in `devflow/context/current-feature.md` with 6 structured sections.
2. **`/implement`**: Incrementally executes checklist tasks with strict TDD discipline (Red-Green-Refactor).
3. **`/check`**: Senior QA multi-lane verification (Typecheck, Lint, Test suites, and behavioral manual proof).
4. **`/complete`**: Final safety audit, records Release Digest, auto-archives to `devflow/history/{features|fixes|rollbacks}/`, manages the git delivery gate, and resets workspace to Idle.

---

## 4. Pre-Flight Discovery & Architectural Alignment

Before committing to delivery, use specialized companion skills to refine complex requirements:

```text
/idea (Inbox) ──▶ /grill (Socratic ADR) ──▶ /discovery (Explore) ──▶ /feature (Deliver)
```

- **`/idea`**: Quick idea capture in `devflow/ideas.md` with instant AI feasibility scoring.
- **`/grill`** (or **`/align`**): Socratic alignment & domain modeling; records Architecture Decision Records (`devflow/decisions/ADR-xxx.md`).
- **`/brainstorm`**: Structured ideation with trade-off analysis.
- **`/discovery`**: Deep inception and exploratory discovery (`devflow/discoveries/DISC-xxx.md`).

---

## 5. The 3-Pillars Workspace Architecture

```text
devflow/
├── ideas.md                    # 🔮 Future (Backlog): Idea Inbox with AI scoring
├── context/                    # ⚡ Present (Active Context): Single Living Spec & Active State
│   ├── current-feature.md      # The Single Living Spec (Active delivery spec / idle stub)
│   ├── current-stage.md        # Active stage inspector & guardrail pointer
│   ├── project-overview.md     # Single Source of Truth
│   ├── coding-standards.md     # Engineering standards & conventions
│   ├── ai-interaction.md       # AI interaction guidelines
│   ├── findings.md             # Quality & security findings ledger
│   └── glossary.md             # Domain glossary & architecture terms
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

# Automated Quality Gatekeeper & Pre-commit Hooks
npx @jakkrichm/create-nexus-devflow check-gate [--strict]
npx @jakkrichm/create-nexus-devflow hook install pre-commit

# Model Context Protocol (MCP) Server Hub
npx @jakkrichm/create-nexus-devflow mcp

# Multi-Agent Swarm & Code Graph RAG
npx @jakkrichm/create-nexus-devflow swarm
npx @jakkrichm/create-nexus-devflow graph --file src/index.ts

# JIT Context Slicing Engine
npx @jakkrichm/create-nexus-devflow slice --stage implement
```
