---
description: Human feedback - Add human feedback to a task and loop back to implementation.
---
# Phase 34: Human Feedback

Record human feedback on reviewed work and return the task to implementation without treating the feedback as a hard rejection.

Primary behavior now lives in:

```text
.agent/skills/human-review-decisions/SKILL.md
```

Treat this workflow file as a compatibility wrapper around that skill in `feedback` mode.

## Usage

```text
Human-Feedback {ID} "{Feedback}"
```

## Arguments

- **ID**: Task ID
- **Feedback**: Required feedback message for requested improvements, preferences, or non-blocking changes

## Process

### Step 1: Locate Task

Search for `.workspaces/specs/{ID}-*/` and read `50-verify.md` and `40-implement.md` first.

### Step 2: Execute Feedback

- Record the feedback in the review artifact, preferring `50-verify.md`.
- Preserve clear feedback history with:
  - round
  - date
  - source
  - requested improvement
- If the feedback represents a durable rule or style preference, add a note to `.workspaces/lessons.md`.

### Step 3: Recommend Next Step

Route back into the mainline:

```text
/40-Implement {ID}
```

Use `/30-Plan {ID}` instead only if the feedback changes scope, sequencing, or architecture enough to require replanning.

### Step 4: Notify

```text
Human Action: Feedback on Task {ID}
Status: in_progress
Next Step: /40-Implement {ID}
```

## Output

- updated feedback history in `50-verify.md`
- optional lesson entry

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Human feedback helper, not a numbered stage
- Typical entry points: after `/50-Verify` or manual review
- Typical handoff targets: `/40-Implement`, `/50-Verify`, `Followup`

## Sources

- `AGENTS.md`
- `.agent/skills/human-review-decisions/SKILL.md`
- Related commands: `/40-Implement`, `/50-Verify`, `Followup`, `Human-ReCheck`

## Next Workflow Recommendation

- **Primary**: `/40-Implement {ID}`
- **Why**: feedback requests another implementation pass while preserving human context
- **Alternatives**:
  - `/30-Plan {ID}` when the feedback changes plan structure
  - `Wiki project ingest .workspaces/specs/{ID}-*/50-verify.md` when the feedback captures reusable knowledge

