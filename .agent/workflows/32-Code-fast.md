---
description: Fast Markdown Code - Execute an approved Markdown plan one checklist item at a time and record progress in Markdown.
---
# Phase 32-fast: Implement Fast Markdown Task

Implement the approved fast plan incrementally. Source code edits are allowed in this phase.

## Usage

```text
/32-Code-fast <task-slug>
```

## Fast Mode Contract

- Read `.workspaces/tasks/<task-slug>/task.md` and `plan.md`.
- Write or update `.workspaces/tasks/<task-slug>/implementation.md`.
- Do not create or mutate JSON task artifacts.
- Do not require PRP CLI status transitions.
- Work one checklist item at a time.
- Run the planned verification for each completed item when practical.

## Process

### 1. Get Bearings

Read:

- `task.md`
- `plan.md`
- Existing `implementation.md` if present
- Referenced source files and patterns

Confirm the `Approval` section in `plan.md` is approved. If approval is missing, ask for approval or return to `/31-Plan-fast`.

### 2. Implement One Checklist Item

For the first incomplete checklist item:

- Confirm target files and success criteria.
- If tests are `Required`, add or update the planned tests first where practical.
- Make the smallest useful source change.
- Preserve project style and existing patterns.
- Run the planned verification command or manual check.
- Update `implementation.md` with evidence.
- Mark the checklist item completed in `plan.md` only after verification evidence is recorded.

If scope changes, update `plan.md` before continuing. If the task becomes complex or risky, recommend escalating to the normal PRP flow.

### 3. Write `implementation.md`

Use this structure:

```markdown
---
id: "<task-slug>"
workflow: "fast"
status: "in_progress"
source_workflow: "/32-Code-fast"
---

# Implementation: <Title>

## Completed Items

- F1:
  - Summary:
  - Files changed:
  - Verification:
  - Result:

## Changed Files

## Decisions And Notes

## Blockers

## Handoff

- Next command: `/33-Verify-fast <task-slug>`
```

Do not leave placeholder brackets, `TODO`, or `TBD`.

### 4. Finalize Coding

When all planned checklist items are completed:

- Set `implementation.md` status to `implemented`.
- Ensure changed files are listed.
- Ensure verification evidence is present or gaps are explicit.
- Recommend `/33-Verify-fast <task-slug>`.

## Output

Report:

- Checklist items completed
- Files changed
- Verification commands run
- Test decisions followed or changed
- Blockers or manual checks
- Next command: `/33-Verify-fast <task-slug>`

## Next Workflow Recommendation

- **Primary**: `/33-Verify-fast <task-slug>` when implementation is complete.
- **Alternative**: `/20-Debug-fast` or `/20-Debug` if an unexplained failure blocks progress.
