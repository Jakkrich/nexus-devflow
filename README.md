<p align="center">
  <img src="docs/logo-nexus-devflow.png" alt="Nexus-DevFlow 2.0" width="120">
</p>

<h1 align="center">Nexus-DevFlow 2.0</h1>

<p align="center"><strong>The 3-Pillars & Dual-Track Agentic Workflow Layer for Building Production Software with AI.</strong></p>

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

**Nexus-DevFlow 2.0** provides a robust, dual-track agentic workflow layer supporting **The 3-Pillars Workspace Architecture** and **Dual-Track Delivery** (Fast-Track 4 Steps & Deep-Track 8 Steps) for building production software with AI assistants. Instead of unstructured "vibe coding", DevFlow guides AI through an explicit, markdown-first, auditable delivery lifecycle.

Install it inside any scaffolded or existing Git repository:

```bash
npx -y @jakkrichm/create-nexus-devflow@latest -y
```

> [!NOTE]
> Nexus-DevFlow 2.0 is designed as a workflow layer overlay that sits on top of your application codebase, bringing multi-agent skills (`.agents/skills` & `.claude/skills`), structured 3-pillars context (`devflow/`), and senior QA gates to your favorite AI IDE (Google Antigravity, OpenAI Codex, Claude Code, Cursor, Gemini CLI, and others).

---

## 🏛️ The 3-Pillars Workspace Architecture

DevFlow 2.0 organizes all project intelligence and workflow history into three clean pillars representing Future, Present, and Past:

```text
devflow/
│
├── 🔮 ideas.md                 # [1. Future / Backlog] Centralized Idea Inbox with AI scoring
│
├── ⚡ context/                  # [2. Present / Active] Living Source of Truth & Active Work
│   ├── project-overview.md     # Primary source of truth for architecture and tech stack
│   ├── coding-standards.md     # Engineering conventions, TDD rules, and test gates
│   ├── ai-interaction.md       # AI agent interaction rules and operational preferences
│   ├── findings.md             # Quality, security, and verification ledger (P0-P3)
│   ├── current-stage.md        # Active stage run tracker and state pointer
│   ├── current-feature.md      # Fast-Track Single Living Spec (Active work / stub when idle)
│   └── current-run/            # Deep-Track Active Run folder (Temporary during execution)
│
├── 📦 history/                  # [3. Past / Completed] Permanent Categorized Delivery Archives
│   ├── features/               # Completed features, migrations, and tooling (xxx-slug.md or folder)
│   ├── fixes/                  # Completed bug fixes, hotfixes, security patches (xxx-slug.md)
│   ├── rollbacks/              # Safely reversed feature records (YYYY-MM-DD-xxx-slug.md)
│   └── HISTORY.md              # Master release history ledger summary table
│
└── 🔍 discoveries/              # Pre-delivery discovery records (DISC-YYYYMMDD-NNN-slug/00-explore.md)
```

---

## 🏎️ Dual-Track Delivery Model

Nexus-DevFlow 2.0 supports two distinct delivery tracks based on task scope and governance requirements:

### 🏎️ Track 1: Fast-Track (Blueprint Mode — 4 Steps)
> **Recommended for 85% of daily engineering work** (features, bug fixes, UI improvements, iterative refactoring) driven by the **Single Living Spec (`devflow/context/current-feature.md`)**:

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. **`feature` / `fix` (`/feature`, `/fix`)**: Combines Discover, Define, Spec, and Plan. Checks Single Active Run Guardrail, allocates sequential ID (`xxx-slug`), and writes `devflow/context/current-feature.md`. Supports intake from Idea Inbox (`/feature IDEA-xxx`).
2. **`implement` (`/implement`)**: Incrementally executes checklist tasks with TDD discipline (Red-Green-Refactor) and appends progress to `current-feature.md`.
3. **`check` (`/check`)**: Senior QA review, multi-lane verification matrix (Typecheck, Lint, Test suites, manual proof), and records evidence into `current-feature.md`.
4. **`complete` (`/complete`)**: Final safety pass, records Release Digest, auto-archives `current-feature.md` ➔ `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`, resets idle stub, performs git merge, and closes the run.

---

### 🏗️ Track 2: Deep-Track (Architect Mode — 8 Steps)
> **Recommended for large architectural epics, database migrations, security audits, and multi-agent coordination**:

```text
00-explore ➔ 10-define ➔ 20-spec ➔ 30-plan ➔ 40-execute ➔ 50-verify ➔ 60-report ➔ 70-deliver
```

| Stage | Canonical Command Name | Description & Core Artifacts |
| :--- | :--- | :--- |
| **00** | `00-explore` | Explore a request, route supporting inquiries, and make delivery commitment decisions (`devflow/discoveries/`). |
| **10** | `10-define` | Lock delivery boundaries and allocate sequential IDs (`devflow/context/current-run/10-define.md`). |
| **20** | `20-spec` | Formalize markdown-first specifications and acceptance criteria (`20-spec.md`). |
| **30** | `30-plan` | Transform spec into executable task breakdowns and execution checklists (`30-plan.md`). |
| **40** | `40-execute` | Execute planned tasks incrementally with step evidence and unit tests (`40-execute.md`). |
| **50** | `50-verify` | Conduct Senior QA review, test verification, and verdict decision (`50-verify.md`). |
| **60** | `60-report` | Produce standardized markdown delivery digest report (`60-report.md`). |
| **70** | `70-deliver` | Package verified work, archive `current-run/` ➔ `devflow/history/{category}/{xxx-slug}/`, git merge, and close run. |

---

## 🛠️ CLI Quick Start & Commands

The zero-dependency CLI `@jakkrichm/create-nexus-devflow` manages the entire DevFlow lifecycle directly from your terminal:

```bash
# 1. Install DevFlow into current repository
npx -y @jakkrichm/create-nexus-devflow@latest -y

# 2. Inspect project status, active tasks, findings, and recommended next action
npx @jakkrichm/create-nexus-devflow status

# Output machine-readable JSON for CI/CD pipelines
npx @jakkrichm/create-nexus-devflow status --json

# 3. Update existing DevFlow installation safely to latest version
npx @jakkrichm/create-nexus-devflow update

# 4. Completely uninstall DevFlow while preserving past delivery history
npx @jakkrichm/create-nexus-devflow uninstall --keep-history -y

# Or completely remove all DevFlow files and adapters (eject)
npx @jakkrichm/create-nexus-devflow eject -y
```

---

## 🔄 Migration Guide (Upgrading from DevFlow 1.x / Runs Structure)

If your existing codebase uses the older DevFlow layout (with `devflow/runs/RUN-xxx` folders), upgrade to **DevFlow 2.0 (The 3-Pillars Model)** using either of the following methods:

### Option A: Clean Reinstall (Recommended)
```bash
# 1. Uninstall legacy files while preserving your history
npx @jakkrichm/create-nexus-devflow@latest uninstall --keep-history -y

# 2. Install the fresh DevFlow 2.0 baseline
npx @jakkrichm/create-nexus-devflow@latest -y

# 3. In your AI IDE, scan codebase to bootstrap context
/adopt
```

### Option B: In-Place Update
```bash
# 1. Run updater
npx @jakkrichm/create-nexus-devflow@latest update

# 2. Move completed legacy runs from devflow/runs/RUN-xxx to devflow/history/features/xxx-slug
# 3. Delete the empty devflow/runs/ directory
# 4. In your AI IDE, refresh project overview
/overview
```

---

## 🌐 Public Companion Commands

| Canonical Command Name | Purpose |
| :--- | :--- |
| `devflow` | Flagship interactive guide, state inspector, and intent router. |
| `doctor` | Read-only health check for setup, scripts, adapters, and workflow drift. |
| `overview` | Distill plans into `project-overview.md` as the living source of truth. |
| `idea` | Quick idea capture and AI feasibility enrichment into `devflow/ideas.md`. |
| `debug` | Root cause investigation for bugs before or during implementation. |
| `onboard` | Baseline stack detection and setup for fresh/scaffolded projects. |
| `adopt` | Survey existing codebase and bootstrap DevFlow into brownfield apps. |
| `try` | Step-by-step human manual QA review guide (where to go, what to click, what to expect). |
| `rollback` | Safe feature/run reversal planner with dependency risk analysis. |
| `ci` | Automatic GitHub Actions workflow (`.github/workflows/verify.yml`) setup. |
| `test` | Verify test suites and test runner configuration. |
| `brief` | Read-only scope, dependency, and size pre-briefing before speccing a run. |
| `autopilot` | Optional explicit bounded loop for Fast-Track (`feature`/`fix` -> `implement` -> `check`) or Deep-Track (`20` -> `30` -> `40` -> `50` -> `60`) |
| `prototype` | Rapid throwaway static HTML/CSS mockups to lock UI/UX before build. |
| `report-html` | Standalone interactive HTML report dashboard generator (`/report:html`). |

---

## 🔌 Tool Adapter Support

| AI Assistant / IDE | Adapter Path | Supported Invocations |
| :--- | :--- | :--- |
| **Google Antigravity** | `.agents/skills/<skill>/SKILL.md` | Plain names (`00-explore`, `devflow`), slash commands (`/00-explore`, `/feature`), or natural language |
| **OpenAI Codex** | `.agents/skills/<skill>/SKILL.md` | Plain names (`feature`), skill command (`$feature`), or natural language |
| **Claude Code** | `.claude/skills/<skill>/SKILL.md` | Plain names (`feature`), slash commands (`/feature`), or natural language |
| **Cursor / Gemini / Aider** | `AGENTS.md` / `CLAUDE.md` | Plain names or natural language referencing `AGENTS.md` |

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
