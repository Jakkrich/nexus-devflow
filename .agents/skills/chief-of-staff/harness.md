# Harness map (On-project `pstack-claude`)

Read this once per chat after identifying which tools this session exposes. This starter kit runs **strictly on-project** using `michael-denyer/pstack-claude` synced into `.agents/plugins/pstack/` — never fall back to global `~/.gemini`, `~/.claude`, `~/.codex`, `~/.grok`, or `~/.agents` pstack installs. Never pass a field or value a tool schema rejects.

## Detect & Reference Mapping

| Session has | Harness | Additional reference to read |
|---|---|---|
| `invoke_subagent` / `ask_question`, or Antigravity runtime | **Antigravity (`agy`)** | `<poteto>/references/agy-tools.md` |
| `spawn_agent`, or `$CODEX_HOME` / `$CODEX_THREAD_ID` | **Codex** | `<poteto>/references/codex-tools.md` |
| `Agent` / `AskUserQuestion` / `TodoWrite`, or Claude Code runtime | **Claude Code** | None (`pstack-claude` skills are pre-translated for Claude Code) |
| `spawn_subagent` / `run_terminal_command`, or `$GROK_HOME` | **Grok (`Grok Build` / `Grok Bot`)** | `<poteto>/references/grok.md` (plus `.agents/skills/make-bot-ui/SKILL.md` for Grok Bot webhook UIs + Tailscale) |
| Other subagent tool (`Task` / `spawn`) | **Other** | Spawn the closest general worker; kickoff still starts with `Read <poteto>/worker.md before anything else.` |

## Resolve pstack (On-Project Only)

`<pstack>` is ALWAYS `<repo-root>/.agents/plugins/pstack`. `<poteto>` is `<pstack>/skills/poteto-mode`.

1. Verify `.agents/plugins/pstack/skills/poteto-mode/SKILL.md` exists in the repo.
2. If missing, bootstrap it locally first — never install globally:
   - Windows: `.agents/tools/sync-pstack.bat -NoPause`
   - POSIX (macOS/Linux/WSL/Git Bash): `sh .agents/tools/sync-pstack.sh`
3. Read `<poteto>/SKILL.md` in full, plus the harness reference file from the Detect table above.

## Paths

| Role | Antigravity | Codex | Claude Code | Grok |
|---|---|---|---|---|
| Chief of Staff skill | `.agents/skills/chief-of-staff/` | `.agents/skills/chief-of-staff/` | `.agents/skills/chief-of-staff/` | `.agents/skills/chief-of-staff/` |
| Project enable file | `GEMINI.md` / `AGENTS.md` / `.agents/rules/chief-of-staff.md` | `AGENTS.md` | `CLAUDE.md` (or `AGENTS.md`) | `AGENTS.md` |
| Model sheet | `.agents/rules/pstack-models.md` | `.agents/rules/pstack-models.md` | `.agents/rules/pstack-models.md` | `.agents/rules/pstack-models.md` |
| Bundled `pstack-claude` skills | `.agents/plugins/pstack/skills/<name>/SKILL.md` (`deslop`, `thermos`, `babysit`, `fix-ci`, `fix-merge-conflicts`, etc.) | Same | Same | Same |
| Repo-local extra skills | `.agents/skills/verify-project/SKILL.md`, `.agents/skills/make-bot-ui/SKILL.md` | Same | Same | Same |

## Spawn a worker (On-Project Mode)

| Field | Antigravity | Codex | Claude Code | Grok Build |
|---|---|---|---|---|
| Tool | `invoke_subagent` | `spawn_agent` | `Agent` | `spawn_subagent` |
| Writer worker type | `TypeName: "self"` (for file writes, commands, or MCP) | Default agent (no `pstack:*` type; instruct to read `<poteto>/worker.md` first) | `subagent_type: "general-purpose"` (unless `--plugin-dir .agents/plugins/pstack` registered `pstack:poteto-agent`) | Omit `subagent_type` |
| Read-only / review type | `"research"`, `"comment-sicko"`, `"thermo-nuclear-review-subagent"`, or `"thermo-nuclear-code-quality-review-subagent"` (use `"self"` if shell/MCP needed) | Default agent; tell `comment-sicko` / `thermos` workers to read `<pstack>/agents/<agent>.md` in full first | `subagent_type: "Explore"` (say `"do not edit files"`); tell `comment-sicko` / `thermos` workers to read `<pstack>/agents/<agent>.md` first unless `pstack:*` is registered | Omit `subagent_type`; say `"do not edit files"` |
| Background | Asynchronous by default | Asynchronous by default | Asynchronous by default (omit `run_in_background`) | `run_in_background: true` (default) |
| Model | `.agents/rules/pstack-models.md`: accepts ONLY `inherit`, `pro`, `flash`, `flash_lite`. Omit `Model` or pass `"inherit"` on `inherit-parent`/`auto`. Never pass Cursor/Claude slugs | Pass `model` / `reasoning_effort` ONLY when exposed in `spawn_agent` schema; omit on `inherit-parent`/`auto` | Map `.agents/rules/pstack-models.md` (`opus`, `sonnet`, `haiku` + `effort`); omit `model` on `inherit-parent`/`auto` | Omit `model` on `inherit-parent`/`auto`; no effort field |
| Isolated worktree | `Workspace: "share"` or `"branch"` | Create dedicated worktree via `git worktree add -b <branch> <path> <base-sha>` and pass path in brief | `isolation: "worktree"` | `isolation: "worktree"` |
| Question tool | `ask_question` | Ask in plain text or host prompt | `AskUserQuestion` | `ask_user_question` |
| Track tasks | Uncommitted `todo.md` / `.audit/<slug>.todo.md` (and `update_steps` if available) | Host task list or `todo.md` | `TodoWrite` / `TaskCreate` | `todo_write` |
| Schedule / Loop | `schedule` (`DurationSeconds` or `CronExpression`) when operator asks | Host loop / timer if available | `/loop` or `ScheduleWakeup` if available | `scheduler_create` |
| Run another pstack skill | `read_file` `<pstack>/skills/<name>/SKILL.md` and follow it | Read `<pstack>/skills/<name>/SKILL.md` and follow it | `Read` `<pstack>/skills/<name>/SKILL.md` and follow it | `read_file` `<pstack>/skills/<name>/SKILL.md` and follow it |

Kickoff, every harness:

```text
Read <poteto>/worker.md before anything else.
```

Then include the goal, the done-check, proof requested, file pointers, the branch/worktree, and the full path `<poteto>/SKILL.md`.

## Unavailable host features

When a playbook step asks for a host-only feature missing in the current harness (such as Bugbot cloud triggers, Cursor Automations, or a built-in PR UI): use the forge CLI (`gh` / `glab`) for PR operations, or write `Skipped in <harness>: <step>. <reason>.` and continue without stopping.
