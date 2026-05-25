---
description: Follow-up Planning - Extend an existing completed or reviewed task without replacing the existing implementation plan.
---

# Phase 35: Follow-up Planning

## Request: $ARGUMENTS

Use this workflow when the user wants to add more functionality to an existing task after implementation, QA, or human review.

## Prompt Source

Adapted from:

- `followup_planner.md`

## Core Rule

Extend, do not replace.

Preserve existing phases, subtasks, statuses, logs, QA results, and completed context.

## Process

### 1. Load Existing Task

Read:

- `.workspaces/specs/{ID}-*/spec.md`
- `.workspaces/specs/{ID}-*/requirements.json`
- `.workspaces/specs/{ID}-*/implementation_plan.json`
- `.workspaces/specs/{ID}-*/context.json`
- `.workspaces/specs/{ID}-*/qa_report.md` if present

### 2. Classify The Follow-Up

Classify the request:

- extension
- enhancement
- integration
- refinement
- bug fix after review

### 3. Append New Work

Use plan helpers:

```powershell
npm run agent -- followup:start {ID} "{Summary}"
npm run agent -- plan:add-phase {ID} "Follow-up: {Name}" --type followup
npm run agent -- plan:add-subtask {ID} {PHASE_ID} "{Title}" --description "{Description}" --service {service}
npm run agent -- plan:validate {ID}
npm run agent -- validate {ID}
```

### 4. Ask For Confirmation

After adding or proposing follow-up subtasks, ask the user to confirm before `/32-Code`.

## Output

Return:

- follow-up category
- new phase/subtask plan
- validation result
- next command: `/32-Code {ID}`
