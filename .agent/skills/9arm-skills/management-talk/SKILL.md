---
name: 9arm-skills/management-talk
description: Use to translate engineering detail into stakeholder-readable updates, PR summaries, changelog notes, standups, Slack/JIRA comments, or leadership talking points.
source_pack: 9arm-skills
credit: thananon/9arm-skills
upstream: https://github.com/thananon/9arm-skills
adapted_for: Antigravity IDE / Nexus-DevFlow
---

# Management Talk

## Purpose

Translate engineering-to-engineering detail into decision-ready communication for PMs, leads, release managers, support, and executives.

This skill is a credited adaptation of `9arm-skills/management-talk` for Nexus-DevFlow.

## What To Preserve

Keep:

- current status
- user or business impact
- risk
- owner
- next step
- timeline or blocking condition
- validation status

Remove or compress unless needed:

- internal function names
- long file paths
- commit SHAs
- implementation details that do not affect decisions
- speculative blame

## Output Shapes

### Status Update

```md
## Source Discipline
- Source pack: 9arm-skills
- Applied skill: management-talk
- Credit: thananon/9arm-skills
- Adapted for: Antigravity IDE / Nexus-DevFlow

## Current Status
## Impact
## Owner
## Next Step
## Risk / Blocker
```

### PR / Release Summary

```md
## What Changed
## Why It Matters
## Validation
## Risk
## Rollback / Follow-up
```

### Incident / Bug Summary

```md
## What Happened
## Who Was Affected
## Current State
## Fix / Mitigation
## Prevention
```

## Nexus-DevFlow Output

Use this skill inside `/51-PR`, `/53-Changelog`, and `/99-Coach` when the user needs a human-readable summary. Keep existing Nexus output formats and destinations intact.
