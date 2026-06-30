---
name: handoff
description: Compact active context into a handoff note. Use when a DevFlow run must continue in another session, agent, or report without duplicating existing artifacts.
disable-model-invocation: true
---

# Handoff

Use this support skill when work needs to move to another session or agent.

DevFlow stage artifacts remain the source of truth. This skill should reference them instead of duplicating them.

## Process

1. Identify the continuation purpose.
   - next stage
   - specialist agent
   - interrupted implementation
   - verification follow-up
   - release/report handoff

2. Collect existing durable artifacts.
   - stage markdown files
   - checklists
   - ADRs
   - issues or PR links
   - commits and diffs

3. Write only the missing bridge context.
   - current state
   - decisions already made
   - open blockers
   - files or commands the next agent should inspect first
   - suggested skills

4. Redact secrets and sensitive data.

## Output Location

Prefer the active task workspace when the handoff belongs to the work item:

```text
.workspaces/specs/{ID}-{slug}/handoff-{date}.md
```

Use the OS temp directory only for throwaway cross-session transfer that should not become project history.
