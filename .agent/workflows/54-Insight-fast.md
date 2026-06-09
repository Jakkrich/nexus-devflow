---
description: Fast Markdown Insight - Extract reusable lessons from a fast task and save them in Markdown.
---
# Phase 54-fast: Insight Fast Markdown Task

Capture reusable lessons from a completed or failed fast task without JSON task logs.

## Usage

```text
/54-Insight-fast <task-slug>
```

## Fast Mode Contract

- Read `.workspaces/tasks/<task-slug>/` Markdown artifacts.
- Write `.workspaces/tasks/<task-slug>/insight.md` for task-local lessons.
- Suggest `.workspaces/lessons.md` or `/59-Wiki` only for durable project knowledge.
- Do not create or mutate JSON task artifacts.

## Process

### 1. Load Evidence

Inspect:

- `task.md`
- `plan.md`
- `implementation.md`
- `verify.md`
- `debug.md`, `test.md`, `review.md`, or `commit.md` when present
- changed files or recent commits when needed

### 2. Extract Useful Knowledge

Capture only lessons that would change future behavior:

- reusable implementation pattern
- workflow gotcha
- validation command worth reusing
- testing gap or prevention note
- context-loading shortcut
- bug root-cause lesson after validation evidence exists

Avoid generic observations.

### 3. Write `insight.md`

Use this structure:

```markdown
---
id: "<task-slug>"
workflow: "fast"
status: "captured"
source_workflow: "/54-Insight-fast"
---

# Insight: <Title>

## Reusable Lessons

## Gotchas

## Validation Notes

## Future Recommendations

## Wiki Candidates

## Handoff
```

## Output

Report:

- Lessons captured
- Gotchas
- Suggested wiki candidates
- Next command if follow-up work is needed

## Next Workflow Recommendation

- **Primary**: `/59-Wiki project ingest .workspaces/tasks/<task-slug>/insight.md` when the lesson is durable.
- **Alternative**: `/53-Changelog-fast <task-slug>` when the learning should become user-facing release notes.
