# Nexus-DevFlow 2.0 (Blueprint-Style Model)

Instructions for AI coding agents working in this project. This is the cross-tool entry point: Codex, Google Antigravity, Cursor, GitHub Copilot, Gemini CLI, Aider, Zed, Windsurf, and others read `AGENTS.md`. Claude Code reads `CLAUDE.md`, which imports this file (`@AGENTS.md`), so there is a single source of truth.

## What this is

This project uses **Nexus-DevFlow**, an agentic stage-based workflow layer. To start a new project, scaffold the application first in an empty folder, then run `npx @jakkrichm/create-nexus-devflow` to overlay DevFlow onto your codebase.

## Tool-Specific Adapters

The workflow and skills are exposed through tool-specific adapters:

- **Codex & Google Antigravity**: `.agents/skills/<skill>/SKILL.md`
- **Claude Code**: `.claude/skills/<skill>/SKILL.md`

Unused adapter families can be removed. Codex and Antigravity projects keep `.agents/` and `AGENTS.md`. Claude Code projects keep `.claude/` and `AGENTS.md` (via `CLAUDE.md`).

## Timeline Workflow

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release
```

### Mainline Stages:
1. `/00-Discover` - Explore a request before delivery commitment. Creates a Discovery ID (`devflow/discoveries/...`).
2. `/10-Define` - Turn an approved discovery into one or more bounded delivery runs (`devflow/runs/{running-id}/10-define.md`).
3. `/20-Spec` - Formalize markdown-first specifications (`20-spec.md`).
4. `/30-Plan` - Transform spec into executable steps (`30-plan.md`).
5. `/40-Implement` - Execute planned tasks incrementally (`40-implement.md`).
6. `/50-Verify` - Run Senior QA review and validation check (`50-verify.md`).
7. `/60-Report` - Produce markdown and HTML summary report (`60-report.md`, `60-report.html`).
8. `/70-Release` - Package verified work for merge, PR, or deployment (`70-release.md`).

### Public Companion Commands:
- `Goal`: Route broad goals before Discovery
- `Brainstorm`: Brainstorm ideas without creating running IDs
- `Research`: Conduct codebase or web research
- `Debug`: Root cause investigation before/during implementation
- `PRD`: Product framing before delivery commitment
- `Issue-Triage`: Intaking and triaging incoming reports
- `Security-Review`: High-severity security review
- `Wiki`: Knowledge base management under `devflow/wiki/`
- `Check-For-Updates`: Verify or upgrade DevFlow setup
- `Help`: Routing and process assistance

## Mainline Rules

1. Numbered workflows exist only for the linear mainline.
2. Mainline numbers must move from lower to higher with no backward jump.
3. If a command is not a true mainline state, do not give it a number.
4. Companion commands may be suggested by a mainline workflow but do not replace that workflow.

## Verification & Commands

- Verify framework integrity: `npm run check`
- Static contract check: `npm run check:static`
- Test installer package: `npm test`
- Package smoke test: `npm run test:package`
