---
name: to-issues
description: Break a PRD, spec, or plan into independently-grabbable vertical slices behind /30-Plan or Issue-Triage.
disable-model-invocation: true
---

# To Issues

Use this support skill when a DevFlow plan needs issue-ready vertical slices.

`/30-Plan` owns work breakdown. This skill packages slices for issue trackers or agent handoff.

## Process

1. Gather source material.
   - PRD
   - `20-spec.md`
   - `30-plan.md`
   - implementation and verification checklists

2. Draft tracer-bullet slices.
   - Each slice should cut through the necessary layers end-to-end.
   - Each slice should be independently verifiable.
   - Prefactoring slices may come first when they make later work safer.

3. Record dependencies.
   - `Blocked by`
   - user stories or requirements covered
   - acceptance criteria
   - verification command or manual check

4. Save issue-ready briefs.
   - Prefer `.workspaces/specs/{ID}-{slug}/issues/` for task-owned output.
   - Use an issue tracker only when configured or explicitly requested.

## Output

Return:

- slice list
- dependency order
- acceptance criteria per slice
- issue brief paths or issue URLs
- recommended next route
