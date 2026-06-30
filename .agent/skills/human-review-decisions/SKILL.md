---
name: human-review-decisions
description: Handle human approval, feedback, rejection, and recheck decisions around verified work. Use when a task needs a human gate after verification and the result must route cleanly back into the DevFlow 2.0 lifecycle.
---

# Human Review Decisions

## Overview

This skill handles the human review loop after implementation and verification. It does not replace mainline stages; it records or advises the human decision and routes the task back to the right stage.

## Supported Modes

- `approve`
- `feedback`
- `reject`
- `recheck`

## When to Use

- After `/50-Verify` when a human must decide whether the work is acceptable
- When verified work needs non-blocking feedback
- When review fails and the task must be sent back with explicit action items
- When a read-only re-evaluation is needed before the human chooses a decision

## Process

### 1. Load The Review Context

Prefer these artifacts:

- `verify.md`
- `implement.md`
- `release.md`
- `report.md`

Read only what is necessary to understand the review question and evidence.

### 2. Apply The Requested Decision

#### Approve

- confirm the task is genuinely review-ready
- record approval in the current review-facing artifact
- route to `/60-Report` first, then `/70-Release` when release execution is the remaining step

#### Feedback

- record requested improvements without treating them as hard rejection
- preserve the feedback round and source
- route to `/40-Implement` or `/30-Plan` if the feedback changes scope

#### Reject

- record rejection reason and concrete action items
- route to `/40-Implement`, `/30-Plan`, or `Debug` depending on the issue

#### Recheck

- keep the action read-only unless the user explicitly asks to record it
- evaluate the evidence and recommend `approve`, `feedback`, `reject`, or `/50-Verify`

### 3. Record Reusable Lessons

If the review reveals a durable team lesson, add it to `.workspaces/lessons.md` or route to `Wiki`.

## Output

Return:

- decision taken
- artifact updated or not updated
- next recommended stage or companion command
- any reusable lesson worth capturing
