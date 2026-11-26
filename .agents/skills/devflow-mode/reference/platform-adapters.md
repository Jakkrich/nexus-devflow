# Cross-IDE Subagent & `pstack` Adapter Mapping

DevFlow v3 writes all workflow contracts once and adapts subagent/worktree execution across all 5 supported runtimes without modifying `pstack`.

## 1. Runtime Capability Matrix

| Capability | Google Antigravity | Claude Code | OpenAI Codex | GitHub Copilot / OpenCode |
| :--- | :--- | :--- | :--- | :--- |
| **Spawn Writer Subagent** | `invoke_subagent` (`TypeName: "self"`) | `Agent` (`subagent_type: "general-purpose"`) | `spawn_agent` | Sequential isolated pass if no subagent tool is exposed |
| **Worktree Isolation** | `Workspace: "share"` (or `git worktree add`) | `isolation: "worktree"` (or `git worktree add`) | `git worktree add <path> -b <branch>` | `git worktree add` or single clean feature branch |
| **Spawn Read-Only Reviewer** | `invoke_subagent` (`TypeName: "research"`, or `"self"` when shell needed, with no-edit prompt) | `Agent` (isolated reviewer child) | `spawn_agent` (`wait_agent` + `close_agent`) | Fresh session handoff if isolated child is unavailable |
| **Wait for Background Child** | End turn (reactive wakeup) or inspect `manage_subagents` | `run_in_background: true` / task wait | `wait_agent` | Synchronous completion |
| **UI / Browser Verification** | Browser subagent / Chrome DevTools MCP / `npm run test:browser` | Playwright / Chrome DevTools MCP / `npm run test:browser` | CLI / headless `npm run test:browser` | Headless `npm run test:browser` or explicit `[unverified]` gap |

## 2. `pstack` Engine Resolution (`execution.engine`)

1. **`auto` (Default)**: Resolve `pstack` read-only in this order:
   1. **In-session `<skills>` catalog**: check whether `poteto-mode`, `pstack:poteto-mode`, or `pstack-poteto-mode` is already registered in the active IDE session.
   2. **Explicit / On-project paths**: `PSTACK_PLUGIN_DIR`, `<project>/.agents/plugins/pstack/`, `<project>/.claude/plugins/pstack/`, and `<project>/.agents` or `.claude/skills/poteto-mode/`.
   3. **`open-pstack` & User Plugin Caches**: `$XDG_DATA_HOME/open-pstack/pstack/`, `~/.local/share/open-pstack/pstack/`, `%LOCALAPPDATA%/open-pstack/pstack/`, `~/.gemini/config/plugins/pstack/`, `${CLAUDE_CONFIG_DIR:-~/.claude}/plugins/{pstack,cache/*,marketplaces/*}`, `${CODEX_HOME:-~/.codex}/plugins/{pstack,cache/*,marketplaces/*}`, `${COPILOT_HOME:-~/.copilot}/{installed-plugins/*,plugins/cache/*}`, and `~/.agents/skills/poteto-mode/`.
   - **When present**: Delegate specialized leaf steps to `pstack` skills (`arena`, `architect`, `interrogate`, `swarm`, `create-verification-skill`, `maintain-verification-skill`, `deslop`, `no-comments`, `unslop`, `why`, `principle-*`) using `pstack`'s own platform references (`poteto-mode/references/{agy,codex,copilot,opencode}-tools.md`). Never edit files inside `pstack`.
   - **When absent**: Use DevFlow's **Native Single-Verifier Fallback** (`verify-layers` + project `verify` skill or `/check` + 1 fresh isolated reviewer subagent via the active runtime's table above).
2. **`pstack`**: Require `pstack` availability; if missing, run `/devflow-help doctor` diagnostics and warn instead of silently skipping verification.
3. **`native`**: Always use DevFlow native subagents and skip `pstack` probing.

## 3. Closed Review Gate & Fallback Rule

- Never let the builder subagent review or approve its own code.
- If the active runtime has subagent dispatch disabled or hits a capacity limit during a required `independentReview` gate, keep work on the feature branch, mark `BLOCKED: independent verification` in `stage.md`, and present the exact manual fresh-session handoff.

## 4. Coordinator Precedence & `pstack` SessionStart Hook

- **Single Lead Coordinator**: When DevFlow and `pstack` are installed together, DevFlow (`/devflow-mode` and the 3-Pillars contracts `build-plan.md`, `spec.md`, `findings.md`, `/complete`) owns planning, branch state, and final delivery gates. Use `pstack` as leaf skills (`arena`, `architect`, `swarm`, `interrogate`, `deslop`, `no-comments`, `why`, `create-verification-skill`), and do **not** run `pstack`'s `Shipping`, `Opening a PR`, or `Autopilot-*` playbooks over DevFlow's `/complete` gate.
- **Prevent Dual-Coordinator Hooks**: Set `session hook: off` in your `pstack-models.md` sheet (or export `PSTACK_SESSION_HOOK=off`) so `pstack`'s `SessionStart` hook does not bypass `/feature` or `/devflow-mode` on multi-file tasks.
- **Playbook Namespace Isolation**: Place custom DevFlow playbook extensions under `devflow/playbooks/*.md` (checked strictly by DevFlow). If placing extensions in shared `.agents/playbooks/*.md`, prefix `extends: devflow:<stem>` or set `namespace: devflow` so `check-playbooks.mjs` keeps DevFlow and `poteto-mode` playbooks separate.
