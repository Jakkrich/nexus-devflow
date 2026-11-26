---
trigger: always_on
---
# pstack in Antigravity

When running `pstack` skills in Antigravity, map Cursor-specific tool and path names as follows:

- Plugin root: `.agents/plugins/pstack/` (read bundled skills from `.agents/plugins/pstack/skills/<name>/SKILL.md`).
- `Task` → `invoke_subagent` (or `swarm` for parallel fan-out; use `Workspace: "share"` or `"branch"` instead of `environment: "cloud"`).
- `subagent_type: "poteto-agent"` or `"generalPurpose"` → `TypeName: "self"` (for write/command/MCP workers), `"research"` (for read-only investigation), or `"comment-sicko"`.
- `AskQuestion` → `ask_question`.
- `Grep` / `Glob` → `run_command` with `rg --no-ignore` / `Get-ChildItem`.
- `/loop` → `schedule` tool (`CronExpression` or `DurationSeconds`).
- `~/.cursor/rules/pstack-models.mdc` → `.agents/rules/pstack-models.md` (or omit subagent `Model` to inherit the session model).
- `create-skill` → create `.agents/skills/<name>/SKILL.md` following Antigravity skill structure.
- Cursor-only features (Bugbot, Cursor Automations, Cursor cloud agent dashboard, `cursor-team-kit` `/deslop`) → handle diff cleanup / browser checks (`browser` subagent) directly, or skip with a one-line note and continue.
