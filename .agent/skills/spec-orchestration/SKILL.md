---
name: spec-orchestration
description: Coordinate Brainstorm, Research, PRD, competitor context, and spec critique before the work re-enters the numbered mainline. Use when a broad idea needs orchestration rather than a straight pass.
---

# Spec Orchestration

## Overview

This skill is the shared behavior layer behind `Spec-Orchestrate`.

It keeps the valuable orchestration UX from the legacy prompt while making sure DevFlow 2.0 still routes back into the numbered mainline cleanly.

## Related Assets

This skill should reuse and align with:

- `.agent/resources/schemas/spec_orchestration.template.md`
- `Brainstorm`
- `Research`
- `Spec-Research`
- `Competitor`
- `PRD`

## When to Use

- when an idea is too broad for one straight pass through Discover, Define, and Spec
- when multiple evidence lanes are needed before a real delivery contract can be written
- when the user needs orchestration, not autonomous execution

## Process

### 1. Clarify The Idea

Identify:

- target user
- core problem
- desired outcome
- constraints
- acceptance signals

### 2. Choose Only The Needed Support

Route proportionally:

- `Brainstorm` for option generation
- `Research` or `Spec-Research` for external or technical proof
- `Competitor` for market context
- `PRD` for product framing
- `/10-Define` for scope and decision locking
- `/20-Spec` for delivery contract writing

Do not stack every support surface by default.

### 3. Critique Before Execution

Check for:

- missing acceptance criteria
- unverified dependencies
- unclear boundaries
- hidden risks
- ambiguous UX, API, or data behavior
- wrong sequencing between framing and execution

### 4. Save A Reusable Report

Write the orchestration report to:

```text
.workspaces/reports/{date}-{slug}-spec-orchestration.md
```

Use `.agent/resources/schemas/spec_orchestration.template.md` and replace placeholder text fully.

### 5. Route Back To Mainline

- `/10-Define` when the idea still needs scope decisions
- `/20-Spec` when enough evidence exists to write the delivery contract
- `/30-Plan` only when the spec is already solid

## Output

Return:

- what is already stable
- what still needs proof or discovery
- the supporting commands chosen
- where the orchestration report was saved
- the exact next command
