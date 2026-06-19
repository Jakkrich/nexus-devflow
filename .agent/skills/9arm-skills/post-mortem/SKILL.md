---
name: 9arm-skills/post-mortem
description: Use after a bug, outage, or regression has been fixed and validated. Converts the fix into durable engineering knowledge.
source_pack: 9arm-skills
credit: thananon/9arm-skills
upstream: https://github.com/thananon/9arm-skills
adapted_for: Antigravity IDE / Nexus-DevFlow
---

# Post-Mortem

## Purpose

Convert a resolved issue into team memory. A fix is not complete until the team can explain what broke, why it broke, how it was fixed, how it was validated, and why it slipped through.

This skill is a credited adaptation of `9arm-skills/post-mortem` for Nexus-DevFlow.

## When To Use

Use after:

- `Debug` found a root cause
- `/40-Implement` applied a fix
- `/50-Verify` or manual validation proved the fix
- a production incident, regression, or high-risk bug deserves durable learning

Do not write a confident post-mortem before the fix and validation evidence exist.

## Required Inputs

- reliable reproduction or incident timeline
- root cause
- fix summary
- validation evidence
- affected user or system impact
- prevention measure or follow-up

If inputs are missing, list the gaps and request the missing evidence.

## Report Sections

Use these sections inside `.workspaces/lessons.md`, task logs, or a task-linked report when appropriate:

```md
## Source Discipline
- Source pack: 9arm-skills
- Applied skill: post-mortem
- Credit: thananon/9arm-skills
- Adapted for: Antigravity IDE / Nexus-DevFlow

## What Broke
## Impact
## Reliable Repro / Timeline
## Root Cause
## Fix
## Validation Evidence
## Why It Slipped Through
## Prevention / Follow-up
```

## Nexus-DevFlow Output

Prefer existing destinations:

- task-specific insight: record the final lesson in the active markdown artifacts for that running ID, or in `.workspaces/lessons.md`
- project-wide lesson: `.workspaces/lessons.md` using `.agent/resources/schemas/lessons.template.md`
- release-facing summary: `/60-Release`
- stakeholder summary: `management-talk`

Keep the output concise and actionable. Avoid blame.

