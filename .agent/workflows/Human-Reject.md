---
description: Human rejection - Send reviewed work back for fixes with a required reason.
---
# Phase 34: Human Reject

Reject reviewed work and return the task to implementation with explicit action items.

Primary behavior now lives in:

```text
.agent/skills/human-review-decisions/SKILL.md
```

Treat this workflow file as a compatibility wrapper around that skill in `reject` mode.

## Usage

```text
Human-Reject {ID} "{Reason}"
```

## Arguments

- **ID**: Task ID
- **Reason**: Required rejection reason. Include concrete fix expectations when possible.

## Process

### Step 1: Locate Task

Search for `.workspaces/specs/{ID}-*/` and read `50-verify.md` and `40-implement.md` first.

### Step 2: Execute Rejection

- Record the rejection in the review artifact, preferring `50-verify.md`.
- Preserve:
  - round
  - date
  - reviewer
  - reason
  - concrete action items
- If the rejection reveals a durable mistake pattern, add it to `.workspaces/lessons.md`.

### Step 3: Recommend Next Step

Route back into:

```text
/40-Implement {ID}
```

Use `/30-Plan {ID}` only if the rejection changes plan structure or scope enough to require replanning. Use `Debug` if the rejection points to a concrete reproduced bug.

### Step 4: Notify

```text
Human Action: Reject on Task {ID}
Status: in_progress
Next Step: /40-Implement {ID}
```

## Output

- updated rejection history in `50-verify.md`
- optional lesson entry

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Human rejection helper, not a numbered stage
- Typical entry points: after review or acceptance gate failure
- Typical handoff targets: `/40-Implement`, `/50-Verify`, `Followup`

## Sources

- `AGENTS.md`
- `.agent/skills/human-review-decisions/SKILL.md`
- Related commands: `/40-Implement`, `/50-Verify`, `Followup`, `Human-ReCheck`

## Next Workflow Recommendation

- **Primary**: `/40-Implement {ID}`
- **Why**: rejected work must loop back to implementation with explicit action items
- **Alternatives**:
  - `/30-Plan {ID}` when the rejection changes the execution shape
  - `Debug {ID}` when the rejection is fundamentally a bug investigation
  - `Wiki project ingest .workspaces/specs/{ID}-*/50-verify.md` when the rejection contains reusable project knowledge

