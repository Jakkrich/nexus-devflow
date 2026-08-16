<p align="center">
  <img src="docs/logo-nexus-devflow.png" alt="Nexus-DevFlow 2.0" width="120">
</p>

<h1 align="center">Nexus-DevFlow 2.0</h1>

<p align="center"><strong>An agent-ready stage-based workflow layer for building production software with AI.</strong></p>

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

**Nexus-DevFlow 2.0** provides an 8-stage agentic workflow layer (`/00-Discover` through `/70-Release`) for building production software with AI assistants. Instead of unstructured "vibe coding", DevFlow guides AI through an explicit, markdown-first, auditable delivery lifecycle.

Install it inside any scaffolded or existing Git repository:

```bash
npx @jakkrichm/create-nexus-devflow
```

> [!NOTE]
> Nexus-DevFlow 2.0 is designed as a workflow layer overlay that sits on top of your application codebase, bringing multi-agent skills (`.agents/skills` & `.claude/skills`), structured stage artifacts (`devflow/`), and senior QA gates to your favorite AI IDE (Google Antigravity, OpenAI Codex, Claude Code, Cursor, Gemini CLI, and others).

## What this is

"Vibe coding" without structure leads to unmaintainable code, hidden regressions, and context loss. 

DevFlow establishes a rigorous, stage-based control system for AI-assisted development:

1. **Explicit 8-Stage Mainline.** Clear progression from Discovery (`/00-Discover`), Definition (`/10-Define`), Specification (`/20-Spec`), Planning (`/30-Plan`), Implementation (`/40-Implement`), Verification (`/50-Verify`), Reporting (`/60-Report`), to Release (`/70-Release`).
2. **Markdown-First State.** Every stage produces durable markdown artifacts under `devflow/discoveries/` and `devflow/runs/{RUNNING_ID}/`. Your work survives chat clears and context limits.
3. **Dual Tool Adapters.** Native skills for OpenAI Codex & Google Antigravity (`.agents/skills/`) and Claude Code (`.claude/skills/`).
4. **Senior QA & Verification Gates.** Stage `/50-Verify` performs automated and specialist verification before generating human-friendly HTML/markdown reports (`/60-Report`).

## At a glance

| Principle | What it means |
| --- | --- |
| **Stage-based Mainline** | Linear progression (`/00-Discover` ➔ `/70-Release`) guarantees structured software engineering. |
| **Markdown-First State** | All specs, plans, implementation logs, and QA verdicts live in human-readable markdown files under `devflow/`. |
| **Dual Adapter Layer** | Shared `.agents/skills` for Codex & Antigravity, `.claude/skills` for Claude Code. |
| **Companion Commands** | On-demand specialists (`Brainstorm`, `PRD`, `Debug`, `Research`, `Security-Review`, `Issue-Triage`) support the mainline without breaking stage linearity. |
| **Automatic Verification** | Built-in test execution, framework validation, and static contracts prevent regressions. |

## Contents

- [What this is](#what-this-is)
- [At a glance](#at-a-glance)
- [Quick start](#quick-start)
- [Mainline Timeline Workflow](#mainline-timeline-workflow)
- [Public Companion Commands](#public-companion-commands)
- [Tool Adapter Support](#tool-adapter-support)
- [Workspace Artifact Layout](#workspace-artifact-layout)
- [Updating DevFlow](#updating-devflow)
- [Documentation & References](#documentation--references)
- [License](#license)

## Quick start

### 1. Overlay into your project

Scaffold your application first (using Next.js, Vite, FastAPI, etc.), navigate into your Git repository, and run the overlay installer:

```bash
npx @jakkrichm/create-nexus-devflow
```

You can also specify a target path or select specific tool adapters:

```bash
# Target directory
npx @jakkrichm/create-nexus-devflow ./my-app

# Specific tool adapter (codex, antigravity, claude, or both)
npx @jakkrichm/create-nexus-devflow --adapter both
```

### 2. Launch DevFlow in your AI Assistant

Open your project in your AI Assistant (Google Antigravity, OpenAI Codex, Claude Code, etc.) and run the flagship guide command:

```text
/devflow
```

> **Tip:** `/devflow` is your entry command. It inspects your workspace state, checks framework health, and routes you to the exact next command (`/00-Discover`, `/10-Define`, `/40-Implement`, `/50-Verify`, etc.).

Alternatively, start directly with request discovery:

```text
/00-Discover
```

## Mainline Timeline Workflow

```text
/00-Discover ➔ /10-Define ➔ /20-Spec ➔ /30-Plan ➔ /40-Implement ➔ /50-Verify ➔ /60-Report ➔ /70-Release
```

| Stage | Command | Purpose & Artifact |
| --- | --- | --- |
| **00** | `/00-Discover` | Explore a request, route supporting inquiries, and make delivery commitment decisions (`devflow/discoveries/`). |
| **10** | `/10-Define` | Lock delivery boundaries and allocate Running IDs (`devflow/runs/{RUNNING_ID}/10-define.md`). |
| **20** | `/20-Spec` | Formalize markdown-first specifications and acceptance criteria (`20-spec.md`). |
| **30** | `/30-Plan` | Transform spec into executable task breakdowns and execution checklists (`30-plan.md`). |
| **40** | `/40-Implement` | Execute planned tasks incrementally with step evidence (`40-implement.md`). |
| **50** | `/50-Verify` | Conduct Senior QA review, test verification, and verdict decision (`50-verify.md`). |
| **60** | `/60-Report` | Produce standardized markdown and self-contained HTML summary report (`60-report.md`, `60-report.html`). |
| **70** | `/70-Release` | Package verified work for merge, PR, or deployment handoff (`70-release.md`). |

## Public Companion Commands

Companion commands provide specialized support without interrupting the linear mainline stage progression:

| Companion | Purpose |
| --- | --- |
| `Brainstorm` | Brainstorm ideas and explore concepts without allocating running IDs. |
| `PRD` | Product framing and requirement documentation before delivery commitment. |
| `Research` | Codebase or web research to support discovery and spec stages. |
| `Debug` | Root cause investigation for bugs before or during implementation. |
| `Security-Review` | High-severity security review for code, diffs, or architecture. |
| `Issue-Triage` | Intake, triage, and duplicate checking for reported issues. |
| `Wiki` | Knowledge base management under `devflow/wiki/`. |
| `Help` | Process assistance, intent routing, and sitemap guidance. |

## Tool Adapter Support

| Tool | Adapter Path | Invocation |
| --- | --- | --- |
| **Google Antigravity** | `.agents/skills/<skill>/SKILL.md` | Slash commands (e.g. `/00-Discover`, `/20-Spec`, `/40-Implement`) |
| **OpenAI Codex** | `.agents/skills/<skill>/SKILL.md` | `$00-discover`, `$20-spec`, or natural language |
| **Claude Code** | `.claude/skills/<skill>/SKILL.md` | Slash commands (e.g. `/00-Discover`, `/10-Define`, `/50-Verify`) |
| **Cursor / Gemini / Aider** | `AGENTS.md` / `CLAUDE.md` | Natural language instructions referencing `AGENTS.md` |

## Workspace Artifact Layout

DevFlow 2.0 maintains a clean, human-readable workspace under `devflow/`:

```text
devflow/
├── context/
│   ├── project-overview.md     # Source of truth project context
│   ├── coding-standards.md     # Project conventions & guidelines
│   ├── ai-interaction.md       # AI operational preferences
│   └── findings.md             # Quality & audit findings ledger
├── discoveries/                # Pre-delivery discovery artifacts (00-discover.md)
├── runs/                       # Per-running-ID delivery artifacts
│   └── {RUNNING_ID}-{slug}/
│       ├── 10-define.md
│       ├── 20-spec.md
│       ├── 30-plan.md
│       ├── 40-implement.md
│       ├── 50-verify.md
│       ├── 60-report.md
│       ├── 60-report.html
│       └── 70-release.md
├── research/                   # Durable research library
├── prds/                       # Product Requirements Documents
├── debug/                      # Root cause analysis reports
└── reports/                    # Standardized cross-cutting reports
```

## Updating DevFlow

Keep your project's DevFlow setup up to date:

```bash
# Preview changes before updating
npx @jakkrichm/create-nexus-devflow update --dry-run

# Apply update
npx @jakkrichm/create-nexus-devflow update
```

The updater manages only DevFlow framework files under `.agents/skills/`, `.claude/skills/`, and `devflow/reference/`, preserving your project's custom code, context, and run history.

## Documentation & References

- [Quick Start Guide](docs/quickstart.md)
- [Usage & Lifecycle Guide](docs/USAGE.md)
- [Workspace Artifacts Specification](docs/workspace-artifacts.md)
- [Workflow Surface Map](docs/workflow-surface-map.md)
- [Manual Review Workflow Spec](docs/manual-review-workflow-spec.md)
- [Governance Rules](docs/governance-rules.md)

## License

This project is licensed under the [MIT License](LICENSE).
