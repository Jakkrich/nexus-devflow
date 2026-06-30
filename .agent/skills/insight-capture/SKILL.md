---
name: insight-capture
description: Extract durable lessons, patterns, gotchas, and post-mortem knowledge from completed work. Use when implementation or verification work should become reusable team knowledge.
---

# Insight Capture

## Overview

This skill is the shared behavior layer behind `Insight`.

It preserves the valuable learning workflow from the legacy system while treating insight capture as a support capability rather than a numbered stage.

## Related Foundation Skills

This skill should reuse and align with:

- `.agent/skills/9arm-skills/post-mortem/SKILL.md`
- `.agent/resources/schemas/lessons.template.md`

## When to Use

- after `/50-Verify`, release preparation, or a completed implementation run
- after debugging, regression fixes, or incidents that deserve durable learning
- when reusable project knowledge should move into lessons, wiki material, or final reporting

## Process

### 1. Load Evidence

Inspect only the evidence needed:

- `implement.md`
- `verify.md`
- `release.md`
- `report.md`
- recent diff, commits, or review comments when relevant

### 2. Extract Actionable Knowledge

Capture only useful knowledge such as:

- important file or behavior changes
- reusable patterns
- gotchas and triggers
- approach outcome
- alternatives tried
- context loading waste or handoff overhead
- recommendations for future runs

### 3. Apply Post-Mortem When Needed

For bug, regression, or incident work, use the `post-mortem` lens only after fix and validation evidence exist:

- what broke
- impact
- repro or timeline
- root cause
- fix
- validation evidence
- why it slipped through
- prevention or follow-up

### 4. Save To The Smallest Durable Destination

Prefer:

- stage artifacts when the lesson is run-specific
- `.workspaces/lessons.md` for project-wide knowledge
- `Wiki` when the knowledge should become navigable team documentation
- `/60-Report` when the lesson belongs in the final communication package before release

When updating `.workspaces/lessons.md`, use `.agent/resources/schemas/lessons.template.md` and replace placeholder text completely.

## Output

Return:

- lessons captured
- patterns and gotchas
- approach outcome
- recommendations
- where the insight was recorded
- whether `Wiki` or `/60-Report` should be the next handoff
