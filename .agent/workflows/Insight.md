---
description: Insight Extraction - Extract reusable lessons, file insights, patterns, gotchas, recommendations, and 9arm-skills/post-mortem learning from completed work.
---

# Phase 54: Insight Extraction

## Target: $ARGUMENTS

Use this workflow after implementation, QA, human approval, PR review, or a debugging session to preserve useful knowledge for future work.

Primary behavior now lives in the `insight-capture` skill. Keep this workflow as the compatibility wrapper and knowledge-capture entry point.

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
- `40-implement.md`
- `50-verify.md`
- `60-release.md`
- `70-report.md`
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

- stage artifacts when the lesson is specific to the current run
- `.workspaces/lessons.md` for project-wide lessons
- `/60-Release` for release-facing notes
- `/70-Report` for final narrative communication

For token/context learning, prefer the smallest concrete note:

- what context was loaded unnecessarily
- which file, artifact, or agent handoff caused repeated reading
- what should be passed as minimal context next time
- exact token counts only when they are available from the runtime or provider

When updating `.workspaces/lessons.md`, inspect `.agent/resources/schemas/lessons.template.md` first and replace any placeholder text with concrete incident facts, insight, prevention, and follow-up action.

If task logs are appropriate:

If this insight must be tied back to the running work item, record it in `50-verify.md`, `60-release.md`, `70-report.md`, or `.workspaces/lessons.md` rather than a legacy task log command.

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

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Knowledge capture command, not a numbered stage
- Typical entry points: after `Debug`, `/50-Verify`, incident work, or review findings
- Typical handoff targets: `Wiki`, `/70-Report`, `Help`

## Sources

- `AGENTS.md`
- `.agent/resources/schemas/lessons.template.md`
- Related commands: `Debug`, `/50-Verify`, `Wiki`, `/70-Report`, `Help`

## Next Workflow Recommendation

- **Primary**: `Wiki project ingest {source}` when the insight is reusable project knowledge.
- **Why**: `Insight` extracts lessons; `Wiki` compiles selected lessons into navigable knowledge pages.
- **Alternatives**:
  - `/60-Release {ID}` - choose this when the insight should shape release packaging.
  - `/70-Report {ID}` - choose this when the insight should become the final communication summary.
  - `Help {ID}` - choose this when the next route is unclear.

## Wiki Update Recommendation

- **Needed**: `yes` for reusable lessons, gotchas, decisions, validated root causes, or token/context optimizations.
- **Scope**: `project` for target-project lessons, `framework` for DevFlow workflow lessons.
- **Reason**: Insight extraction is the safest handoff point for wiki compilation.
- **Suggested Command**: `Wiki project ingest {source}`

