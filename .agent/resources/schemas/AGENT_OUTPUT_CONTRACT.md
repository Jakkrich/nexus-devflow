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
9. Markdown artifacts must contain real task-specific content. Do not leave bracket instructions, `{Placeholder}` tokens, `Requirement 1`, `Option A`, `TODO`, `TBD`, or similar template scaffolding in saved output.
10. Before reporting a Markdown artifact as complete, run `npm.cmd run agent -- markdown:validate {path} {template_name}` when the CLI is available. For task workspaces, `npm.cmd run agent -- validate {ID}` also checks `spec.md`.

## Required Task Files

Every `.workspaces/specs/{ID}-{slug}/` folder must contain:

- `implementation_plan.json`
- `task_metadata.json`
- `requirements.json`
- `task_logs.json`
- `context.json`
- `complexity_assessment.json`
- `spec.md`

`spec.md` is created from `spec.template.md` and is validated for required headings and placeholder-free content by `npm run agent -- validate {ID}`.

## Markdown Quality Gate

For every generated Markdown artifact:

- Preserve the headings and tables required by the matching template.
- Replace template guidance with specific content from the user request, code inspection, research, command output, or explicit assumptions.
- If information is missing, write a concrete question or assumption instead of leaving a placeholder.
- Run `npm.cmd run agent -- markdown:validate {path} {template_name}` for reusable reports, research files, PRDs, QA reports, plans, RCA reports, triage reports, and agent reports.

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


