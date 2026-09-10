# nexus-devflow

Official Unscoped CLI for **Nexus-DevFlow** — Enterprise-Grade Agentic Workflow Layer supporting **The 3-Pillars Model & Pure Task-Isolated Living Spec Model** for AI coding agents (Google Antigravity, OpenAI Codex, Claude Code, Cursor, Copilot, OpenCode).

[![npm version](https://img.shields.io/npm/v/nexus-devflow?style=flat-square&color=155eef)](https://www.npmjs.com/package/nexus-devflow)
[![Validate DevFlow](https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml/badge.svg)](https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml)
[![MIT license](https://img.shields.io/npm/l/nexus-devflow?style=flat-square&color=155eef)](LICENSE)

[GitHub Repository](https://github.com/Jakkrich/nexus-devflow) |
[Documentation](https://github.com/Jakkrich/nexus-devflow#readme) |
[Changelog](https://github.com/Jakkrich/nexus-devflow/blob/main/CHANGELOG.md)

---

## 🚀 Quick Start

Run directly without prior installation using `npx`:

```bash
# 1. Overlay Nexus-DevFlow into your project directory
npx nexus-devflow

# 2. Launch local real-time Web Dashboard (http://127.0.0.1:4318)
npx nexus-devflow dashboard

# 3. Install all recommended companion skills (archify, diagram-design, bughunter, ponytail)
npx nexus-devflow skill add --recommended

# 4. Check active workspace status, living specs, and findings
npx nexus-devflow status
```

> **For existing users:** Backward-compatible invocation via `npm create @jakkrichm/nexus-devflow` and `npx @jakkrichm/create-nexus-devflow` is fully supported.

---

## 🏛️ The 3-Pillars Architecture & Task-Isolated Living Spec Model

Nexus-DevFlow structures your project into three clear temporal pillars:

1. **🔮 Future (Backlog)**:
   - `devflow/ideas.md` — Idea inbox with instant AI feasibility scoring.
   - `devflow/project-plan.md` & `devflow/build-plan.md` — Master build plan & chronological roadmap.
2. **⚡ Present (Active Context)**:
   - `devflow/context/` — Global Shared Source of Truth (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `glossary.md`).
   - `devflow/context/{xxx-slug}/` — Pure Task-Isolated Living Spec workspace (`spec.md`, `stage.md`, `findings.md`).
3. **📦 Past (History Archive)**:
   - `devflow/history/` — Categorized delivery archives (`features/`, `fixes/`, `rollbacks/`, and `HISTORY.md`).

---

## ⚡ The Unified 4-Stage Living Spec Lifecycle

All development tasks execute systematically through a 4-step progressive lifecycle:

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

| Stage | Command | Purpose |
|---|---|---|
| **1. Feature / Fix** | `/feature`, `/fix` | Combines Discover, Define, Spec, and Plan. Allocates sequential ID (`xxx-slug`) and initializes the Task-Isolated Living Spec (`devflow/context/{xxx-slug}/spec.md`). |
| **2. Implement** | `/implement [id]` | Checks out branch `feature/{xxx-slug}`, executes checklist tasks incrementally with strict **TDD discipline (Red-Green-Refactor)**, and records diff evidence. |
| **3. Check** | `/check [id]` | Senior QA review, multi-lane verification matrix (Typecheck, Lint, Test suites, behavioral proof), and records empirical proof into `spec.md` and findings into `findings.md`. |
| **4. Complete** | `/complete [id]` | Final safety pass, records Release Digest, auto-archives to `devflow/history/`, cleans up active task folder, updates `HISTORY.md`, and manages git squash-merge. |

---

## 🛠️ CLI Command Reference

The `nexus-devflow` CLI bundles complete management commands for agents and developers:

### 📊 Dashboard & Status
```bash
# Launch interactive web dashboard with 0ms SSR First Paint
npx nexus-devflow dashboard [--port 4318] [--no-open]

# Show project overview, progress, findings, git status, and next action
npx nexus-devflow status [--json]
```

### 🧠 Skills Management (Extensible Ecosystem)
```bash
# List all installed skills across adapters
npx nexus-devflow skill list

# Install all recommended community companion skills in one command
npx nexus-devflow skill add --recommended

# Or install individual skills by name or git URL:
npx nexus-devflow skill add archify        # Architecture, sequence & data flow trace diagrams
npx nexus-devflow skill add diagram-design # 39 editorial charts & presentation diagram templates
npx nexus-devflow skill add bughunter      # Offensive security audit & vulnerability testing
npx nexus-devflow skill add ponytail       # Lazy senior dev mode - cuts code bloat & tokens (YAGNI)

# Update installed skills to latest versions
npx nexus-devflow skill update --recommended

# Synchronize skill inventory between .agents and .claude adapters
npx nexus-devflow skill sync
```

### 🛡️ Quality Gatekeeper & CI/CD Hooks
```bash
# Verify active branch gates before commit/merge (exit code 0 or 1)
npx nexus-devflow check-gate [--strict]

# Install automatic local Git pre-commit or pre-push hook
npx nexus-devflow hook install pre-commit
npx nexus-devflow hook install pre-push
```

### ⚡ Context Optimization & Agent Tooling
```bash
# Model Context Protocol (MCP) JSON-RPC Stdio Server
npx nexus-devflow mcp

# Just-In-Time (JIT) Dynamic Context Slicing (reduces AI tokens by 60-70%)
npx nexus-devflow slice --stage implement [--max-tokens 4000]

# Detect drift between code changes and active living spec
npx nexus-devflow drift
npx nexus-devflow reconcile [--fix]

# Workspace health doctor and auto-healing
npx nexus-devflow doctor [--fix]

# Safe framework updater (preserves your custom rules & project context)
npx nexus-devflow update [--dry-run]
```

---

## 🤖 Multi-Agent Compatibility

Nexus-DevFlow installs cross-compatible adapters for every major AI coding environment:

- **Google Antigravity & OpenAI Codex**: `.agents/skills/` & `AGENTS.md`
- **Claude Code**: `.claude/skills/` & `CLAUDE.md`
- **Cursor & GitHub Copilot**: `AGENTS.md`
- **OpenCode & Aider**: Automatic workspace discovery

---

## 📄 License

MIT © [Jakkrich](https://github.com/Jakkrich)
