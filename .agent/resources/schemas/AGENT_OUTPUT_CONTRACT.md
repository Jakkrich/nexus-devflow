# Agent Output Contract

This contract keeps Antigravity agent output stable enough for the PRP dashboard.

## Golden Rules

1. Do not hand-write dashboard JSON when the CLI can update it.
2. Always use `npm.cmd run agent -- ...` for task state transitions, phase logs, repair, and validation in this repository.
3. Never delete JSON keys. Use `null`, `[]`, `{}`, or `""` when data is not available yet.
4. Every JSON file must include `schema_version`.
5. Every meaningful action must append an event to `task_logs.json.events`.
6. Every phase must end with `npm.cmd run agent -- validate {ID}`.
7. Every generated Markdown artifact must be based on the matching `*.template.md` in `.agent/resources/schemas/`.
8. Before creating or updating a Markdown artifact, read the template first and preserve its required headings.

## Required Task Files

Every `.workspaces/specs/{ID}-{slug}/` folder must contain:

- `implementation_plan.json`
- `task_metadata.json`
- `requirements.json`
- `task_logs.json`
- `context.json`
- `complexity_assessment.json`
- `spec.md`

`spec.md` is created from `spec.template.md` and is validated for required template headings by `npm run agent -- validate {ID}`.

## State Commands

```powershell
npm.cmd run agent -- init 007 "Add Billing" add-billing "Implement Stripe billing"
npm.cmd run agent -- update 007 --status in_progress
npm.cmd run agent -- update 007 --subtask subtask-1.1 --substatus completed
npm.cmd run agent -- log 007 "Implemented checkout API" --phase coding
npm.cmd run agent -- event 007 "Stripe webhook verified" --event validation.evidence --phase validation --ref subtask-2.1
npm.cmd run agent -- validate 007
npm.cmd run agent -- repair 007
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


