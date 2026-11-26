---
trigger: always_on
---
<!-- BEGIN AGENT-STARTER-KIT -->
# pstack in Antigravity (On-Project `pstack-claude`)

When running `pstack` skills in Antigravity, use the repo-local `pstack-claude` copy at `.agents/plugins/pstack/` and follow `.agents/plugins/pstack/skills/poteto-mode/references/agy-tools.md` along with `.agents/skills/chief-of-staff/harness.md`.

Key rules:
- **On-project only:** Never look for or install `pstack` globally (`~/.gemini/config/plugins/`). If `.agents/plugins/pstack/skills/poteto-mode/SKILL.md` is missing, run `.agents/tools/sync-pstack.bat -NoPause` (Windows) or `sh .agents/tools/sync-pstack.sh` (POSIX).
- **Read full skills:** Use `read_file` on `.agents/plugins/pstack/skills/<name>/SKILL.md` in full (native loaders truncate above 24 KB).
- **Subagents (`invoke_subagent`):** Use `TypeName: "self"` for workers that write files, run commands, or call MCP tools; use `"research"`, `"comment-sicko"`, `"thermo-nuclear-review-subagent"`, or `"thermo-nuclear-code-quality-review-subagent"` only for read-only work that needs no shell or MCP access.
- **Worktrees:** Use `Workspace: "share"` or `"branch"` for parallel file-writing workers.
- **Models (`.agents/rules/pstack-models.md`):** `invoke_subagent` `Model` accepts ONLY `inherit`, `pro`, `flash`, `flash_lite`. Omit `Model` or pass `"inherit"` when the role says `inherit-parent` or `auto` — never pass Claude or Cursor model slugs.
- **Questions & Schedules:** Map `AskUserQuestion` -> `ask_question`; `/loop` / `ScheduleWakeup` -> `schedule` (`DurationSeconds` or `CronExpression`).
- **Bundled skills:** `/deslop`, `/thermos`, `/babysit`, `/fix-ci`, and `/fix-merge-conflicts` live inside `.agents/plugins/pstack/skills/`. Grok Bot webhook + Tailscale UIs use `.agents/skills/make-bot-ui/SKILL.md`.
<!-- END AGENT-STARTER-KIT -->
