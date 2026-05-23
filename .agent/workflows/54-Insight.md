---
description: Insight Extraction - Extract reusable lessons, file insights, patterns, gotchas, recommendations, and 9arm-skills/post-mortem learning from completed work.
---

# Phase 54: Insight Extraction

## Target: $ARGUMENTS

Use this workflow after implementation, QA, human approval, PR review, or a debugging session to preserve useful knowledge for future work.

## Prompt Source

Adapted from:

- `insight_extractor.md`

Additional credited discipline when the source work is a bug, regression, or incident:

- `.agent/skills/9arm-skills/post-mortem/SKILL.md`
- Source pack: `9arm-skills`
- Credit: `thananon/9arm-skills`
- Upstream: https://github.com/thananon/9arm-skills
- Adapted for: Antigravity IDE / Nexus-DevFlow

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
- context or token usage notes that explain avoidable overhead
- recommendations for future sessions

Avoid generic notes that do not help future work.

For bug, regression, or incident work, apply the `post-mortem` lens only after fix and validation evidence exist:

- what broke
- impact
- reliable repro or timeline
- root cause
- fix
- validation evidence
- why it slipped through
- prevention or follow-up

### 3. Save Or Route Insights

Use the smallest durable destination:

- task logs for task-specific notes
- `qa_report.md` for QA lessons
- `.workspaces/lessons.md` for project-wide lessons
- `/53-Changelog` for user-facing release notes

For token/context learning, prefer the smallest concrete note:

- what context was loaded unnecessarily
- which file, artifact, or agent handoff caused repeated reading
- what should be passed as minimal context next time
- exact token counts only when they are available from the runtime or provider

When updating `.workspaces/lessons.md`, inspect `.agent/resources/schemas/lessons.template.md` first. Before reporting completion, run `npm run agent -- markdown:validate .workspaces/lessons.md lessons.template.md` and replace any placeholder/template text with concrete incident facts, insight, prevention, and follow-up action.

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
- context usage notes
- recommendations
- where the insight was recorded or should be recorded

If `post-mortem` was applied, include a short `Source Discipline` note crediting `9arm-skills/post-mortem`.

## Next Workflow Recommendation

- **Primary**: `/59-Wiki project ingest {source}` when the insight is reusable project knowledge.
- **Why**: `/54-Insight` extracts lessons; `/59-Wiki` compiles selected lessons into navigable knowledge pages.
- **Alternatives**:
  - `/50-Commit {ID}` - choose this when the task is approved and ready for commit.
  - `/53-Changelog {ID}` - choose this when the insight should become user-facing release notes.
  - `/99-Help {ID}` - choose this when the next route is unclear.

## Wiki Update Recommendation

- **Needed**: `yes` for reusable lessons, gotchas, decisions, validated root causes, or token/context optimizations.
- **Scope**: `project` for target-project lessons, `framework` for DevFlow workflow lessons.
- **Reason**: Insight extraction is the safest handoff point for wiki compilation.
- **Suggested Command**: `/59-Wiki project ingest {source}`
