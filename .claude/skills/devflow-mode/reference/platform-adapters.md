# Cross-IDE Subagent Adapter Mapping

DevFlow v3 writes all workflow contracts once and adapts subagent/worktree execution across all 5 supported runtimes.

## 1. Runtime Capability Matrix

| Capability | Google Antigravity | Claude Code | OpenAI Codex | GitHub Copilot / OpenCode |
| :--- | :--- | :--- | :--- | :--- |
| **Spawn Writer Subagent** | `invoke_subagent` (`TypeName: "self"`) | `Agent` (`subagent_type: "general-purpose"`) | `spawn_agent` | Sequential isolated pass if no subagent tool is exposed |
| **Worktree Isolation** | `Workspace: "share"` (or `git worktree add`) | `isolation: "worktree"` (or `git worktree add`) | `git worktree add <path> -b <branch>` | `git worktree add` or single clean feature branch |
| **Spawn Read-Only Reviewer** | `invoke_subagent` (`TypeName: "research"`, or `"self"` when shell needed, with no-edit prompt) | `Agent` (isolated reviewer child) | `spawn_agent` (`wait_agent` + `close_agent`) | Fresh session handoff if isolated child is unavailable |
| **Wait for Background Child** | End turn (reactive wakeup) or inspect `manage_subagents` | `run_in_background: true` / task wait | `wait_agent` | Synchronous completion |
| **UI / Browser Verification** | Browser subagent / Chrome DevTools MCP / `npm run test:browser` | Playwright / Chrome DevTools MCP / `npm run test:browser` | CLI / headless `npm run test:browser` | Headless `npm run test:browser` or explicit `[unverified]` gap |

## 2. Closed Review Gate & Fallback Rule

- Never let the builder subagent review or approve its own code.
- If the active runtime has subagent dispatch disabled or hits a capacity limit during a required `independentReview` gate, keep work on the feature branch, mark `BLOCKED: independent verification` in `stage.md`, and present the exact manual fresh-session handoff.

## 3. Playbook Extensions

- Place custom DevFlow playbook extensions under `devflow/playbooks/*.md`, `.agents/playbooks/*.md`, or `~/.agents/playbooks/*.md` and validate anchors with `node .agents/skills/devflow-mode/scripts/check-playbooks.mjs`.
