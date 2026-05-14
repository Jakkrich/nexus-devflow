# Agent Output Contract

This contract keeps Antigravity agent output stable enough for the PRP dashboard.

## Golden Rules

1. Do not hand-write dashboard JSON when the CLI can update it.
2. Always use `npx agent-flow` for task state transitions, phase logs, repair, and validation.
3. Never delete JSON keys. Use `null`, `[]`, `{}`, or `""` when data is not available yet.
4. Every JSON file must include `schema_version`.
5. Every meaningful action must append an event to `task_logs.json.events`.
6. Every phase must end with `npx agent-flow validate {ID}`.

## Required Task Files

Every `.workspaces/specs/{ID}-{slug}/` folder must contain:

- `implementation_plan.json`
- `task_metadata.json`
- `requirements.json`
- `task_logs.json`
- `context.json`
- `complexity_assessment.json`
- `spec.md`

## State Commands

```bash
npx agent-flow init 007 "Add Billing" add-billing "Implement Stripe billing"
npx agent-flow update 007 --status in_progress
npx agent-flow update 007 --subtask subtask-1.1 --substatus completed
npx agent-flow log 007 "Implemented checkout API" --phase coding
npx agent-flow event 007 "Stripe webhook verified" --event validation.evidence --phase validation --ref subtask-2.1
npx agent-flow validate 007
npx agent-flow repair 007
```

## Dashboard Event Shape

```json
{
  "timestamp": "2026-05-09T12:00:00.000Z",
  "actor": "agent",
  "event": "subtask.completed",
  "phase": "coding",
  "ref": "subtask-1.1",
  "message": "Implemented checkout API",
  "metadata": {}
}
```


