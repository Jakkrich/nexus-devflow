---
description: Insight Extraction - Extract reusable lessons, file insights, patterns, gotchas, and recommendations from completed work.
---

# Phase 54: Insight Extraction

## Target: $ARGUMENTS

Use this workflow after implementation, QA, human approval, PR review, or a debugging session to preserve useful knowledge for future work.

## Prompt Source

Adapted from:

- `insight_extractor.md`

## Process

### 1. Load Evidence

Inspect the available evidence:

- git diff or recent commits
- task `implementation_plan.json`
- `task_logs.json`
- `qa_report.md`
- modified files
- human feedback or PR comments

### 2. Extract Reusable Knowledge

Capture only actionable knowledge:

- file purpose and important changes
- reusable patterns
- gotchas and triggers
- approach outcome
- alternatives tried
- recommendations for future sessions

Avoid generic notes that do not help future work.

### 3. Save Or Route Insights

Use the smallest durable destination:

- task logs for task-specific notes
- `qa_report.md` for QA lessons
- `.workspaces/lessons.md` for project-wide lessons
- `/53-Changelog` for user-facing release notes

If task logs are appropriate:

```powershell
npm run agent -- log {ID} "Insight: {short actionable lesson}" --phase validation
npm run agent -- validate {ID}
```

## Output

Return:

- file insights
- patterns discovered
- gotchas discovered
- approach outcome
- recommendations
- where the insight was recorded or should be recorded
