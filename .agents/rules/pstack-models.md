---
trigger: always_on
description: Cross-harness pstack per-role model choices
---
# pstack-models (on-project cross-harness role sheet)
# Used by Antigravity, Codex, Claude Code, and Grok Build via .agents/skills/chief-of-staff/harness.md
#
# Values per harness:
# - Portable default: inherit-parent (omits model parameter so subagents inherit the active session model)
# - Antigravity: inherit | pro | flash | flash_lite
# - Claude Code: opus @xhigh | opus @high | sonnet @high | haiku @medium (or opus | sonnet | haiku)
# - Codex: <codex-model> @high (only when spawn_agent exposes model / reasoning_effort)
# - Grok Build: inherit-parent (spawn_subagent omits model unless explicitly supported)
#
# defaults: 3
# default effort: session
feature, refactoring: inherit-parent
bug-fix: inherit-parent
perf-issue: inherit-parent
hillclimb: inherit-parent
judgment and prose: inherit-parent
strongest judgment: inherit-parent
arena runners: inherit-parent
arena cross-judge pool: inherit-parent
swarm workers: inherit-parent
interrogate reviewers: inherit-parent
thermos reviewers: inherit-parent
no-comments reviewer: inherit-parent
architect runners: inherit-parent
