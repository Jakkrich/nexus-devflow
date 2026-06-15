---
description: Fast Markdown Plan - Create a lightweight implementation plan from spec.md without JSON plan helpers or dashboard state.
---
# Phase 31-fast: Plan Fast Markdown Task

**Strict mode: planning only. Do not edit source code in this phase.**

Create a codebase-informed Markdown plan that is small enough to execute directly, while preserving test decisions and handoff context.

## Usage

```text
/31-Plan-fast {ID}-{slug}
```

## Fast Mode Contract

- Read `.workspaces/specs/{ID}-{slug}-spec.md`.
- Write `.workspaces/specs/{ID}-{slug}-plan.md`.
- Do not create or mutate JSON task artifacts.
- Do not use `plan:add-phase`, `plan:add-subtask`, or other PRP JSON helpers.
- Use target project commands for verification planning when known.
- Ask for approval before recommending `/32-Code-fast`.

## Process

### 1. Read Task Context

Read:

- `.workspaces/specs/{ID}-{slug}-spec.md`
- Relevant source files, docs, config, and test scripts needed to plan safely

### 2. Assess Scope

Classify the task:

- `tiny`: 1-2 checklist items, low risk.
- `small`: 2-5 checklist items, clear files and verification.
- `medium`: multiple steps or risk areas, but still suitable for Markdown-first tracking.

Escalate to `/30-Task` and `/31-Plan` if the work is complex, cross-team, security-sensitive, migration-heavy, or requires auditable JSON artifacts.

### 3. Build Plan

Create `plan.md` (Save directly as `.workspaces/specs/{ID}-{slug}-plan.md`) with:

- Scope and non-goals
- Files likely to read or modify
- Ordered implementation checklist
- Test decision for each item (Must follow **Test-Design First** when `Required`)
- Verification commands or manual checks
- Risks and rollback notes

For every checklist item, decide one of:

- `Required`: automated tests must be created or updated. **MANDATORY**: Specify the Schema/Contract (Zod, Pydantic, types) and the target test file to implement *before* coding.
- `Manual/Command Only`: command, smoke test, screenshot, or manual verification is enough.
- `Not Required`: no automated tests are useful because the change has no behavior surface.

### 4. Write `plan.md`

Use this structure:

```markdown
---
id: "{ID}-{slug}"
title: "<Title>"
doc_type: "plan"
workflow: "fast"
status: "planned"
source_workflow: "/31-Plan-fast"
---

# Plan: <Title>

## Scope

## Files And Patterns

## Implementation Checklist

- [ ] F1: Item title
  - Change:
  - Files:
  - Test decision:
  - Schema/Contract:
  - Verification:
```,StartLine:44,TargetContent:

## Risks

## Approval

- Status: pending
- Approver:
- Notes:

## Handoff

- Next command after approval: `/32-Code-fast {ID}-{slug}`
```

Do not leave placeholder brackets, `TODO`, or `TBD`. If information is missing, record an explicit assumption or open question.

### 5. Present For Approval

Present the plan summary to the user and wait for explicit approval before recommending `/32-Code-fast`. Approval can be recorded by updating the `Approval` section in `plan.md`.

## Output

Report:

- Scope classification
- Planned checklist items
- Test decisions
- Verification commands
- Approval status
- Next command: `/32-Code-fast {ID}-{slug}` after approval

## Next Workflow Recommendation

- **Primary**: `/32-Code-fast {ID}-{slug}` after the user approves `plan.md`.
- **Alternative**: `/30-Task` and `/31-Plan` if planning reveals full PRP tracking is needed.
