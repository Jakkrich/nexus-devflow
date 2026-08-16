# Nexus-DevFlow 2.0

> **Agent-ready stage-based workflow layer for building production software with AI.**

[![npm version](https://img.shields.io/npm/v/@jakkrichm/create-nexus-devflow?style=flat-square&color=155eef)](https://www.npmjs.com/package/@jakkrichm/create-nexus-devflow)
[![license](https://img.shields.io/github/license/Jakkrich/nexus-devflow?style=flat-square&color=155eef)](LICENSE)

**English** | [ไทย](README.th.md)

[Repository](https://github.com/Jakkrich/nexus-devflow) | [npm](https://www.npmjs.com/package/@jakkrichm/create-nexus-devflow) | [Releases](https://github.com/Jakkrich/nexus-devflow/releases) | [Changelog](CHANGELOG.md)

---

## Quick Start

Install or overlay **Nexus-DevFlow** into any newly scaffolded or existing Git repository:

```bash
# Overlay into current project
npx @jakkrichm/create-nexus-devflow

# Specify target directory
npx @jakkrichm/create-nexus-devflow ./my-app

# Choose specific AI tool adapter (codex, antigravity, claude, or both)
npx @jakkrichm/create-nexus-devflow --adapter both
```

---

## What is Nexus-DevFlow?

**Nexus-DevFlow** is a stage-based workflow layer designed for agentic AI coding assistants (Google Antigravity, OpenAI Codex, Claude Code, Cursor, Gemini CLI, Aider, and Zed).

Instead of "vibe coding" without structure, DevFlow guides AI through an explicit, auditable 8-stage lifecycle:

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release
```

### Mainline Lifecycle Stages:
1. **`/00-Discover`**: Explore request, route supporting inquiries, and make go/no-go delivery decisions under a Discovery ID (`.workspaces/discoveries/...`).
2. **`/10-Define`**: Lock delivery boundaries and allocate Running IDs (`.workspaces/specs/{RUNNING_ID}/10-define.md`).
3. **`/20-Spec`**: Formalize markdown-first specification contracts and acceptance criteria (`20-spec.md`).
4. **`/30-Plan`**: Transform specs into executable task breakdowns (`30-plan.md`).
5. **`/40-Implement`**: Execute planned tasks incrementally with implementation evidence (`40-implement.md`).
6. **`/50-Verify`**: Senior QA review and runtime validation checks (`50-verify.md`).
7. **`/60-Report`**: Generate standardized markdown and HTML summary reports (`60-report.md`, `60-report.html`).
8. **`/70-Release`**: Package verified work for PR merge or production deployment (`70-release.md`).

---

## Public Companion Commands

Companion commands provide supporting context without disrupting mainline numbering:

- `Goal`: Route broad, long-running goals before Discovery.
- `Brainstorm`: Ideate without allocating running IDs.
- `Research`: Conduct codebase or web research.
- `Debug`: Root cause investigation before or during implementation.
- `PRD`: Product framing before delivery commitment.
- `Issue-Triage`: Intaking and triaging incoming bug reports.
- `Security-Review`: High-severity security review.
- `Wiki`: Knowledge base management under `.workspaces/wiki/`.
- `Check-For-Updates`: Verify or upgrade DevFlow setup.
- `Help`: Process assistance and stage routing.

---

## Tool-Specific Adapters

DevFlow provides native adapter support across popular AI tools:

- **`AGENTS.md`**: Universal entry point for Codex, Google Antigravity, Cursor, Gemini CLI, Aider, and Zed.
- **`CLAUDE.md`**: Imports `@AGENTS.md` for Claude Code.
- **`.agents/skills/`**: Stores stage workflows and discipline skills for Codex & Google Antigravity.
- **`.claude/skills/`**: Stores synced stage workflows and skills for Claude Code.

---

## Repository Structure

```text
nexus-devflow/
├── .agents/                        # Codex & Google Antigravity adapter skills
├── .claude/                        # Claude Code adapter skills (synced)
├── .github/                        # GitHub Templates (Issue Forms, PR Template, CODEOWNERS)
├── .nexus/                         # DevFlow metadata manifest (.nexus/nexus-devflow.json)
├── devflow/                        # Framework context (project-overview.md, coding-standards.md)
├── evals/                          # Routing accuracy evaluation datasets (127 skills)
├── packages/
│   └── create-nexus-devflow/       # NPX Overlay Installer package
├── scripts/                        # Maintenance, check, and evaluation scripts
├── AGENTS.md                       # Universal AI entry point
├── CLAUDE.md                       # Claude Code entry point (@AGENTS.md)
├── LICENSE                         # Independent MIT License
└── package.json                    # Maintainer package.json
```

---

## Maintenance & Validation Commands

```bash
# Framework workspace integrity check
npm run check

# Static contract validation
npm run check:static

# Run installer package unit tests
npm test

# Run skill routing evaluation suite (100% accuracy check)
npm run test:routing

# Package smoke test (tarball & temporary overlay test)
npm run test:package
```

---

## License

MIT License — Copyright (c) 2026 Nexus-DevFlow Contributors / Jakkrich
