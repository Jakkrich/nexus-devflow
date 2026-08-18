---
name: followup
description: "[Devflow] Followup task tracking, post-verification iteration, and routing unresolved items to subsequent runs."
---

﻿---
description: Follow-up Planning - Extend an existing completed or reviewed task without replacing the existing implementation plan.
---

# Phase 35: Follow-up Planning

## Request: $ARGUMENTS

Use this workflow when the user wants to add more functionality to an existing task after implementation, QA, or human review.

Primary behavior now lives in the `review-followup-routing` skill using `task-followup` mode. Keep this workflow as the compatibility wrapper for extending an existing running ID.

## Prompt Source

Adapted from:

- `followup_planner.md`

## Core Rule

Extend, do not replace.

Preserve existing phases, subtasks, statuses, logs, QA results, and completed context.

## Process

### 1. Load Existing Task

Read:

- `devflow/runs/{ID}-*/10-define.md`
- `devflow/runs/{ID}-*/20-spec.md`
- `devflow/runs/{ID}-*/30-plan.md`
- `devflow/runs/{ID}-*/40-implement.md`
- `devflow/runs/{ID}-*/50-verify.md` if present

### 2. Classify The Follow-Up

Classify the request:

- extension
- enhancement
- integration
- refinement
- bug fix after review

### 3. Append New Work

Use plan helpers:

Append the follow-up scope directly to the relevant stage markdown files for the same running ID. Add new phases, subtasks, and validation notes in `30-plan.md` and carry resulting work into later stages.

### 4. Ask For Confirmation

After adding or proposing follow-up subtasks, ask the user to confirm before `/40-Implement`.

## Output

Return:

- follow-up category
- new phase/subtask plan
- validation result
- next command: `/40-Implement {ID}`

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: after review, triage, or release follow-up work is identified
- Typical handoff targets: `/10-Define`, `/20-Spec`, `/30-Plan`, `/40-Implement`

## Sources

- `AGENTS.md`
- Related commands: `PR-Followup`, `Issue-Triage`, `Human-Feedback`, `/10-Define`, `/20-Spec`, `/40-Implement`


