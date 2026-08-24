# @jakkrichm/create-nexus-devflow

Install and manage **Nexus-DevFlow 2.0** — an agentic workflow layer supporting **The 3-Pillars Model & Dual-Track Delivery** into any web app, backend, or existing codebase.

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
- `AGENTS.md` & `CLAUDE.md` (Universal AI guidelines)
- `.agents/skills/` (28 Core Skills for Google Antigravity & OpenAI Codex)
- `.claude/skills/` (28 Core Skills for Claude Code)
- `devflow/ideas.md` (Idea inbox & backlog)
- `devflow/context/` (Living spec & active state)
- `devflow/history/` (Categorized delivery archives)

---

## 🏎️ Dual-Track Delivery Model

### 1. Fast-Track (Blueprint Mode — 4 Steps)
*Recommended for 85% of daily work (features, bug fixes, UI improvements):*
```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

### 2. Deep-Track (Architect Mode — 8 Steps)
*Recommended for large architectural epics and database migrations:*
```text
discovery ──▶ 10-define ──▶ 20-spec ──▶ 30-plan ──▶ 40-execute ──▶ 50-verify ──▶ 60-report ──▶ 70-deliver
```

---

## 🛠️ CLI Management Commands

```bash
# Quality Gatekeeper & Pre-commit Hooks
npx @jakkrichm/create-nexus-devflow check-gate [--strict]
npx @jakkrichm/create-nexus-devflow hook install pre-commit

# Model Context Protocol (MCP) Server Hub
npx @jakkrichm/create-nexus-devflow mcp

# JIT Dynamic Context Slicing (60-70% Token Savings)
npx @jakkrichm/create-nexus-devflow slice --stage implement

# Git Drift Detection & Self-Healing State
npx @jakkrichm/create-nexus-devflow drift
npx @jakkrichm/create-nexus-devflow reconcile --fix

# Visual Webview Studio Dashboard
npx @jakkrichm/create-nexus-devflow studio

# Multi-Agent Swarm Orchestration & Code Graph Blast Radius
npx @jakkrichm/create-nexus-devflow swarm
npx @jakkrichm/create-nexus-devflow graph --file <path>

# Status & Updates
npx @jakkrichm/create-nexus-devflow status
npx @jakkrichm/create-nexus-devflow update
npx @jakkrichm/create-nexus-devflow uninstall --keep-history -y
npx @jakkrichm/create-nexus-devflow eject -y
```

---

## 🤖 Model Context Protocol (MCP) Server & Tools

Exposes 12 typed MCP tools for AI Coding Agents (`devflow_get_status`, `devflow_get_sliced_context`, `devflow_get_context`, `devflow_query_code_graph`, `devflow_swarm_plan`, `devflow_detect_drift`, `devflow_reconcile_state`, `devflow_evaluate_gate`, `devflow_get_studio_html`, `devflow_add_idea`, `devflow_record_finding`, `devflow_resolve_finding`).


---

## 🤖 Tool Support & Invocation

| Tool | Installed Adapter | Example Invocations |
| :--- | :--- | :--- |
| **Google Antigravity** | `.agents/skills/` | `/feature`, `/fix`, `/implement`, `/devflow`, `/adopt`, `/doctor` |
| **OpenAI Codex** | `.agents/skills/` | `$feature`, `$fix`, `$implement`, `$devflow`, `$adopt`, `$doctor` |
| **Claude Code** | `.claude/skills/` | `/feature`, `/fix`, `/implement`, `/devflow`, `/adopt`, `/doctor` |
| **Cursor / Others** | `AGENTS.md` + `.agents/` | Follow `SKILL.md` or invoke matching command names |

---

## 📄 License

MIT © [Jakkrich](https://github.com/Jakkrich)
