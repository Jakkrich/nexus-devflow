---
description: Fast Markdown Task - Create a lightweight task workspace using Markdown only, without JSON artifacts, scripts, or dashboard requirements.
---
# Phase 30-fast: Create Fast Markdown Task

**Strict mode: task notes only. Do not edit source code in this phase.**

Create a lightweight Markdown-first task workspace for small or medium work that does not need PRP JSON tracking or dashboard visibility.

## Usage

```text
/30-Task-fast "{Title}" ["Description"]
```

## Fast Mode Contract

- Keep artifacts in `.workspaces/tasks/<task-slug>/`.
- Use Markdown files as the handoff source of truth.
- Do not create or mutate JSON task artifacts.
- Do not require PRP CLI scripts, dashboard data, or `.workspaces/specs/`.
- Prefer target project verification commands later in the flow.
- Escalate to normal `/30-Task` when the work needs formal PRP traceability, dashboard tracking, multi-agent orchestration, or long-lived audit history.

## Process

### 1. Clarify Intent

- Confirm the task in one sentence.
- Identify workflow type: `feature`, `bugfix`, `refactor`, `docs`, `test`, `investigation`, `migration`, or `simple`.
- Capture acceptance criteria and constraints.
- Ask only necessary clarifying questions when the request is ambiguous or risky.

### 2. Create Workspace

1. Generate a kebab-case slug from the title.
2. Create `.workspaces/tasks/<task-slug>/`.
3. Create `task.md`.
4. Do not create or switch branches during task creation. Later implementation, commit, or PR workflows must use the user's current branch unless the user explicitly asks to create or switch to a named branch.

### 3. Write `task.md`

Use this structure:

```markdown
---
id: "<task-slug>"
title: "<Title>"
workflow: "fast"
workflow_type: "<feature|bugfix|refactor|docs|test|investigation|migration|simple>"
status: "draft"
created: "<YYYY-MM-DD>"
updated: "<YYYY-MM-DD>"
source_workflow: "/30-Task-fast"
---

# <Title>

## Goal

## Context

## Acceptance Criteria

- [ ] Criterion with observable outcome.

## Constraints

- Constraint or assumption.

## Open Questions

- Question or `None`.

## Handoff

- Next command: `/31-Plan-fast <task-slug>`
```

Do not leave placeholder brackets, `TODO`, or `TBD`. If information is missing, record a concrete assumption or open question.

## Output

Report:

- Task slug and directory
- Workflow type
- Key acceptance criteria
- Open questions or assumptions
- Next command: `/31-Plan-fast <task-slug>`

## Next Workflow Recommendation

- **Primary**: `/31-Plan-fast <task-slug>`
- **Why**: The task has a Markdown source of truth and should be turned into a small implementation checklist before coding.
- **Alternative**: `/30-Task "{Title}" "{Description}"` when the task needs JSON artifacts, dashboard tracking, or strict PRP validation.
