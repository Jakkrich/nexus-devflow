<!-- BEGIN AGENT-STARTER-KIT -->
# AI Agent Instructions & Chief of Staff

Before acting on the first message of a chat, read:

1. [`.agents/skills/chief-of-staff/SKILL.md`](./.agents/skills/chief-of-staff/SKILL.md) (and follow it as the operator's Chief of Staff).
2. [`.agents/skills/chief-of-staff/harness.md`](./.agents/skills/chief-of-staff/harness.md) (on-project tool/subagent/model map for Antigravity, Codex, Claude Code, and Grok).
3. [`AI_HANDOFF.md`](./AI_HANDOFF.md) (repository invariants, architecture, pitfalls, and change log).
4. [`.context/cos-board.md`](./.context/cos-board.md) (active task board and latest summary).

All tooling in this repo is **on-project only** (never install `pstack` globally):
- Chief of Staff skill: `.agents/skills/chief-of-staff/`
- pstack (`pstack-claude`): `.agents/plugins/pstack/skills/poteto-mode/SKILL.md`
- Model config: `.agents/rules/pstack-models.md`
- Project verification skill: `.agents/skills/verify-project/SKILL.md`
- Grok Bot webhook UI skill: `.agents/skills/make-bot-ui/SKILL.md`

Subagents whose kickoff starts `Read <poteto>/...` or `Read <path>/worker.md` skip this file and follow their delegated brief.

When you finish any change, add an entry at the top of `## 5. Change Log` in [`AI_HANDOFF.md`](./AI_HANDOFF.md), update `## 1. Current State` if state changes, and update [`.context/cos-board.md`](./.context/cos-board.md).
<!-- END AGENT-STARTER-KIT -->

# CLAUDE.md

@AGENTS.md

Instructions for Claude Code. This file imports `AGENTS.md` as the single source of truth for Nexus-DevFlow operating rules, stage lifecycles, and tool capabilities. Read `devflow/context/coding-standards.md` before changing code and `devflow/context/ai-interaction.md` when running a DevFlow workflow.
