# AI Agent Instructions & Chief of Staff

Before acting on the first message of a chat, read:

1. [`.agents/skills/chief-of-staff/SKILL.md`](./.agents/skills/chief-of-staff/SKILL.md) (and follow it as the operator's Chief of Staff).
2. [`AI_HANDOFF.md`](./AI_HANDOFF.md) (repository invariants, architecture, pitfalls, and change log).
3. [`.context/cos-board.md`](./.context/cos-board.md) (active task board and latest summary).

All tooling in this repo is **self-contained locally** (no global plugin install required):
- Chief of Staff skill: `.agents/skills/chief-of-staff/`
- pstack / poteto-mode: `.agents/plugins/pstack/skills/poteto-mode/SKILL.md`
- Model config: `.agents/rules/pstack-models.md`
- Project verification skill: `.agents/skills/verify-project/SKILL.md`

Subagents whose kickoff starts `Read <poteto>/...` skip this file and follow their delegated brief.

When you finish any change, add an entry at the top of `## 5. Change Log` in [`AI_HANDOFF.md`](./AI_HANDOFF.md), update `## 1. Current State` if state changes, and update [`.context/cos-board.md`](./.context/cos-board.md).
