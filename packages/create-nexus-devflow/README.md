# @jakkrichm/create-nexus-devflow

Install and manage **Nexus-DevFlow 2.5.0** — an enterprise-grade agentic workflow layer supporting **The 3-Pillars Model & Single Living Spec Model** into any web app, backend, or existing codebase.

[![npm version](https://img.shields.io/npm/v/@jakkrichm/create-nexus-devflow?style=flat-square&color=155eef)](https://www.npmjs.com/package/@jakkrichm/create-nexus-devflow)
[![Validate DevFlow](https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml/badge.svg)](https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml)
[![MIT license](https://img.shields.io/npm/l/@jakkrichm/create-nexus-devflow?style=flat-square&color=155eef)](LICENSE)

[GitHub Repository](https://github.com/Jakkrich/nexus-devflow) |
[Documentation](https://github.com/Jakkrich/nexus-devflow#readme) |
[Changelog](https://github.com/Jakkrich/nexus-devflow/blob/main/CHANGELOG.md)

---

## 🚀 Quick Installation

Requires Node.js 18 or newer. Run the installer in your target project directory:

```bash
# Automated install (Recommended)
npx -y @jakkrichm/create-nexus-devflow@latest -y

# Interactive install
npx @jakkrichm/create-nexus-devflow@latest
```

The installer overlays the DevFlow workflow layer into your workspace:
- `AGENTS.md` & `CLAUDE.md` (Universal AI guidelines & cross-tool entry point)
- `.agents/skills/` (28 Core Skills for Google Antigravity, OpenAI Codex, Cursor, Copilot)
- `.claude/skills/` (28 Core Skills for Claude Code)
- `devflow/ideas.md` (Idea inbox with AI feasibility scoring)
- `devflow/context/` (Living spec & active delivery context)
- `devflow/history/` (Categorized delivery archives)

The 28 names come from the canonical bundled inventory. Local or Personal Skills
may coexist in a maintainer workspace, but the package builder excludes them
unless they are explicitly promoted into that inventory.

---

## ⚡ The Unified 4-Stage Living Spec Lifecycle

All development tasks execute through the 4-stage single living spec lifecycle:

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. **`feature` / `fix` (`/feature`, `/fix`)**: Combines Discover, Define, Spec, and Plan. Allocates sequential ID (`xxx-slug`) and initializes the **Single Living Spec (`devflow/context/current-feature.md`)**.
2. **`implement` (`/implement`)**: Incrementally executes checklist tasks with strict **TDD discipline (Red-Green-Refactor)**.
3. **`check` (`/check`)**: Dual-Axis review combining empirical spec fidelity with independent standards, architecture, and quality gates.
4. **`complete` (`/complete`)**: Final safety pass, records Release Digest, auto-archives living spec to `devflow/history/`, resets the stub, and manages the git delivery gate.

---

## 🔮 Pre-Flight Discovery Suite

- **`/idea`**: Capture raw ideas in `devflow/ideas.md` with instant AI feasibility scoring.
- **`/grill`** (or **`/align`**): Socratic alignment & domain modeling; records Architecture Decision Records (`devflow/decisions/ADR-xxx.md`).
- **`/brainstorm`**: Structured divergent/convergent ideation with trade-off analysis.
- **`/discovery`**: Deep inception and exploratory discovery (`devflow/discoveries/DISC-xxx.md`).

For failures, `/debug` follows a scientific six-phase diagnosis built around a
red-capable feedback loop and does not modify source. Architecture review follows
Deep Modules principles: small public interfaces, hidden implementation
complexity, and stable seams.

Maintainer contracts and examples are available in the repository:
[governance rules](https://github.com/Jakkrich/nexus-devflow/blob/main/docs/governance-rules.md),
[Markdown metadata](https://github.com/Jakkrich/nexus-devflow/blob/main/docs/markdown-metadata-contract.md),
[manual review workflow](https://github.com/Jakkrich/nexus-devflow/blob/main/docs/manual-review-workflow-spec.md), and
[Living Spec examples](https://github.com/Jakkrich/nexus-devflow/tree/main/docs/examples/living-spec).

---

## 🌐 Web Dashboard & Real-Time Studio

Launch the local interactive Web Dashboard with 0ms SSR First Paint and Single-Flight Git caching:

```bash
# Launch dashboard on http://127.0.0.1:4318
npx @jakkrichm/create-nexus-devflow dashboard
```

---

## 🛠️ CLI Management Commands

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

# Framework Update & Safety Rollback
npx @jakkrichm/create-nexus-devflow update [--check]
```

---

## 📄 License

MIT © [Jakkrich](https://github.com/Jakkrich)
