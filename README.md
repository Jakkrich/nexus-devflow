<p align="center">
  <img src="docs/logo-nexus-devflow.png" alt="Nexus-DevFlow 2.5.0" width="120">
</p>

<h1 align="center">Nexus-DevFlow 2.5.0</h1>

<p align="center"><strong>The 3-Pillars & Single Living Spec Model for Building Production Software with AI Coding Agents.</strong></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@jakkrichm/create-nexus-devflow"><img src="https://img.shields.io/npm/v/@jakkrichm/create-nexus-devflow?style=flat-square&color=155eef" alt="npm version"></a>
  <a href="https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml"><img src="https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml/badge.svg" alt="Validate DevFlow"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/Jakkrich/nexus-devflow?style=flat-square&color=155eef" alt="MIT license"></a>
</p>

<p align="center"><strong>English</strong> | <a href="README.th.md">ไทย</a></p>

<p align="center">
  <a href="https://github.com/Jakkrich/nexus-devflow">Repository</a> |
  <a href="https://www.npmjs.com/package/@jakkrichm/create-nexus-devflow">npm</a> |
  <a href="https://github.com/Jakkrich/nexus-devflow/releases">Releases</a> |
  <a href="CHANGELOG.md">Changelog</a>
</p>

**Nexus-DevFlow 2.5.0** is an enterprise-grade agentic workflow layer supporting **The 3-Pillars Workspace Architecture** and the **Single Living Spec Model**. Instead of unstructured "vibe coding", DevFlow guides AI assistants through an auditable, markdown-first, spec-driven engineering lifecycle with automated quality gates and real-time dashboard observability.

Install it inside any scaffolded or existing Git repository in seconds:

```bash
npx -y @jakkrichm/create-nexus-devflow@latest -y
```

> [!NOTE]
> Nexus-DevFlow is designed as a non-intrusive workflow layer that overlays on top of your application codebase, bringing multi-agent skills (`.agents/skills` & `.claude/skills`), structured context (`devflow/`), and senior QA gates to your favorite AI IDE (**Google Antigravity**, **Claude Code**, **OpenAI Codex**, **Cursor**, **GitHub Copilot**, **Gemini CLI**, **Aider**, **OpenCode**, and others).

---

## 🏛️ 1. The 3-Pillars Workspace Architecture

DevFlow organizes all project intelligence and workflow history into three clean pillars representing Future, Present, and Past:

```text
devflow/
│
├── 🔮 ideas.md                 # [1. Future / Backlog] Centralized Idea Inbox with AI feasibility scoring
│
├── ⚡ context/                  # [2. Present / Active] Living Source of Truth & Active Work
│   ├── project-overview.md     # Primary source of truth for architecture and tech stack
│   ├── coding-standards.md     # Engineering conventions, strict TDD rules, and test gates
│   ├── ai-interaction.md       # AI agent interaction rules and operational preferences
│   ├── findings.md             # Quality, security, and verification findings ledger (P0-P3)
│   ├── current-stage.md        # Active stage run tracker and state pointer
│   └── current-feature.md      # The Single Living Spec (Active delivery spec / idle stub)
│
├── 🏛️ decisions/                # Architecture Decision Records (ADR-xxx-slug.md)
│
├── 📦 history/                  # [3. Past / Completed] Permanent Categorized Delivery Archives
│   ├── features/               # Completed features, migrations, and tooling (xxx-slug.md)
│   ├── fixes/                  # Completed bug fixes, hotfixes, security patches (xxx-slug.md)
│   ├── rollbacks/              # Safely reversed feature records (YYYY-MM-DD-xxx-slug.md)
│   └── HISTORY.md              # Master release history ledger summary table
│
└── 🔍 discoveries/              # Pre-delivery discovery records (DISC-YYYYMMDD-NNN-slug.md)
```

---

## ⚡ 2. The Unified 4-Stage Living Spec Lifecycle

All development tasks (from lean UI fixes to deep architectural epics) execute through a progressive, 4-stage single living spec lifecycle:

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

| Stage | Command | Purpose & Description | Output Artifact |
| :--- | :--- | :--- | :--- |
| **1. Spec** | `/feature` or `/fix` | Discovers, defines, sizes, breaks down tasks, and establishes acceptance criteria. Allocates sequential ID (`xxx-slug`) and initializes the living spec. | `devflow/context/current-feature.md` |
| **2. Build** | `/implement` | Incrementally executes checklist tasks with strict **TDD discipline (Red-Green-Refactor)**, proving each step with diffs and test logs. | `current-feature.md` (Appended) |
| **3. Verify** | `/check` | Senior QA review, multi-lane verification matrix (Typecheck, Lint, Test suites, manual proof), and records empirical verification evidence. | `current-feature.md` (Evidence) |
| **4. Deliver** | `/complete` | Runs final safety pass, records Release Digest, auto-archives living spec to `devflow/history/`, resets the stub, and manages the git delivery gate. | `devflow/history/` & `HISTORY.md` |

### 📄 The 6 Structured Sections of the Living Spec:
1. **🎯 1. Define & Boundaries**: Problem statement, proposed solution, scope boundaries, and non-breaking invariants.
2. **📐 2. Technical Spec & Contracts**: Data contracts, API schemas, and testable Acceptance Criteria (AC-1..AC-N).
3. **📋 3. Execution Plan & TDD Checklist**: Sequential task breakdown with granular `[TDD-Red]`, `[TDD-Green]`, and `[TDD-Refactor]` sub-tasks.
4. **⚡ 4. Implementation Log & Evidence**: Live engineering log recording step-by-step implementation evidence.
5. **🧪 5. Multi-Lane Verification Matrix**: Empirical test logs, benchmark data, and manual proof verification.
6. **📦 6. Release Digest & Retrospective**: Release summary, key architectural decisions, and retrospective notes.

---

## 🔮 3. Pre-Flight Discovery & Architectural Alignment

Before committing to delivery, use specialized companion skills to brainstorm, stress-test, and refine complex concepts:

```text
/idea (Inbox) ──▶ /grill (Socratic ADR) ──▶ /discovery (Explore) ──▶ /feature (Deliver)
```

- **`/idea`**: Capture raw ideas in `devflow/ideas.md` with instant AI feasibility, effort, and value scoring.
- **`/grill`** (or **`/align`**): Socratic alignment & domain modeling. Stress-tests requirements, extracts domain terminology into `devflow/context/glossary.md`, and generates Architecture Decision Records (`devflow/decisions/ADR-xxx.md`).
- **`/brainstorm`**: Structured divergent and convergent ideation, generating 2–3 viable options with trade-off matrices.
- **`/discovery`**: Unified pre-delivery discovery and deep exploration (`devflow/discoveries/DISC-xxx.md`).

---

## 🌐 4. Enterprise Web Dashboard & Real-Time Studio

Launch the local interactive Web Dashboard with sub-millisecond snapshot response and zero-second first paint:

```bash
npm run dashboard
# Or via CLI directly:
npx @jakkrichm/create-nexus-devflow dashboard
```

```text
+----------------------------------------------------------------------------------------------------+
|  nexus-devflow                                                                                     |
|  D:\Projects\devtools\nexus-devflow                                                                |
|                                                                                                    |
|  [v2.5.0]  [HEALTH OK]  [✔ GATE PASSED]  [✔ IN SYNC]  [TRACK FAST]                                 |
+----------------------------------------------------------------------------------------------------+
|  [🔮 Pre-Flight Discovery]   [⚡ Living Spec · 4 steps]   [🤖 Multi-Agent Swarm]   [🗺️ Code Graph]   |
+----------------------------------------------------------------------------------------------------+
|  [ Card: Current Work ]        |  [ Card: Git & Branch ]                                           |
+--------------------------------+-------------------------------------------------------------------+
|  [ Card: Findings Ledger ]     |  [ Card: Completion & Gate ]                                      |
+----------------------------------------------------------------------------------------------------+
```

### Key Dashboard Capabilities:
- ⚡ **0ms First Paint**: Server-Side Hydration (`window.__INITIAL_SNAPSHOT__`) renders UI instantly on cold start.
- ⚡ **Single-Flight Git Caching**: In-flight Promise coalescing eliminates subprocess storms on Windows/Linux.
- 🤖 **Multi-Agent Swarm Visualizer**: Live orchestration panel for 4 specialized AI roles:
  - 👑 **Lead Architect**: Architecture boundaries, data contracts, ADR sign-off.
  - 👨‍💻 **Core Coder**: Clean, type-safe implementation adhering to standards.
  - 🕵️ **QA Verifier**: Red-team test writing, edge-case validation, behavioral proof.
  - 🛡️ **Security Auditor**: Vulnerability scanning, secret detection, zero-blocker sign-off.
- 🗺️ **Semantic Code Graph RAG**: AST dependency parser with transitive blast-radius calculation.
- 📋 **Live Kanban Studio**: Real-time visualization of living spec tasks and stage transitions.

---

## 🛠️ 5. CLI Management Commands

Nexus-DevFlow provides a comprehensive CLI for workspace automation:

```bash
# Start Web Dashboard
npx @jakkrichm/create-nexus-devflow dashboard [--port 4318]

# Automated Quality Gatekeeper & Pre-commit Hooks
npx @jakkrichm/create-nexus-devflow check-gate [--strict]
npx @jakkrichm/create-nexus-devflow hook install pre-commit

# Model Context Protocol (MCP) Server Hub (12 Native Tools)
npx @jakkrichm/create-nexus-devflow mcp

# Just-In-Time (JIT) Dynamic Context Slicing
npx @jakkrichm/create-nexus-devflow slice --stage implement

# Git Diff Drift Detection & Reconciler
npx @jakkrichm/create-nexus-devflow drift
npx @jakkrichm/create-nexus-devflow reconcile

# Multi-Agent Swarm & Code Graph
npx @jakkrichm/create-nexus-devflow swarm
npx @jakkrichm/create-nexus-devflow graph --file src/index.ts

# Interactive HTML Delivery Report
npm run report:html -- 054-optimize-dashboard-snapshot-latency

# Framework Update & Safety Rollback
npx @jakkrichm/create-nexus-devflow update [--check]
```

---

## 🧪 6. Verification & Engineering Standards

Nexus-DevFlow enforces rigorous engineering discipline across all development:

1. **Strict TDD Discipline**: Every checklist task enforces `[TDD-Red]` (failing test), `[TDD-Green]` (minimal passing code), and `[TDD-Refactor]` (clean up and optimize).
2. **Two-Stage Review Pattern**:
   - **Stage 1 (Spec Gate)**: The AI pauses after writing the spec to review edge cases, sizing, and non-goals with the developer.
   - **Stage 2 (Delivery Gate)**: Mandatory user approval gate before any squash-merge or pull-request push.
3. **Automated CI Quality Gate**: Documented in `AGENTS.md` and automated via `.github/workflows/verify.yml`.

---

## 🎯 7. Supported AI IDEs & Tools

Nexus-DevFlow integrates seamlessly with all leading AI coding assistants:

| AI Tool / IDE | Adapter Location | Invocation Method |
| :--- | :--- | :--- |
| **Google Antigravity** | `.agents/skills/<skill>/` | Slash command (e.g. `/feature`, `/implement`) |
| **Claude Code** | `.claude/skills/<skill>/` | Slash command (e.g. `/feature`, `/implement`) |
| **OpenAI Codex CLI** | `.agents/skills/<skill>/` | Skill invocation (e.g. `$feature`, `$implement`) |
| **Cursor / Copilot** | `AGENTS.md` + `.agents/` | Prompting by Canonical name |
| **OpenCode / Windsurf** | Compatible adapter trees | Direct skill execution |

---

## 📄 License

MIT © [Jakkrich](https://github.com/Jakkrich)
