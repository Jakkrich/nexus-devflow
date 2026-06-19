---
name: review-followup-routing
description: Classify review comments, extend existing work safely, and route corrective or future work back into the right DevFlow 2.0 stage. Use for PR follow-up and post-review follow-up planning.
---

# Review Follow-up Routing

## Overview

This skill groups follow-up handling that used to be split across:

- `PR-Followup`
- `Followup`

It keeps follow-up work attached to the right running ID without replacing the numbered mainline.

## Related Foundation Assets

This skill should reuse and align with:

- `.agent/resources/schemas/pr_followup.template.md`
- active stage markdown artifacts under `.workspaces/specs/{ID}-*/`

## Supported Modes

- `pr-followup`
- `task-followup`

## When to Use

- after `PR-Review` when review comments need classification and response
- after human feedback, QA, or release review when a task needs additional scoped work
- when existing work should be extended instead of replaced

## Process

### 1. Load Current Context

Read only the minimum needed:

- existing running ID workspace artifacts
- latest review comments, requested changes, or QA findings
- current implementation or verification notes when relevant

### 2. Classify The Follow-up

Classify each item into a useful bucket such as:

- fix now
- already resolved
- needs clarification
- new scope follow-up
- pre-existing issue
- non-actionable

For task follow-up, also classify the change shape:

- extension
- enhancement
- integration
- refinement
- bug fix after review

### 3. Preserve Existing History

Extend existing markdown artifacts instead of replacing them:

- keep current phases and completed work intact
- append new phases, subtasks, notes, or decision logs
- keep the same running ID unless the new scope truly deserves a separate work line

### 4. Save Reusable Output

For PR-centered follow-up, save a report under:

```text
.workspaces/reports/{date}-pr-followup-{ID}.md
```

Use `.agent/resources/schemas/pr_followup.template.md` when a formal report is required.

For task follow-up, append the approved follow-up work directly into the relevant stage markdown files for the same running ID.

### 5. Route Back

- `/40-Implement` for immediate corrective work
- `/50-Verify` when only verification needs another pass
- `/10-Define` or `/20-Spec` when the follow-up becomes genuinely new scope

## Output

Return:

- mode used
- classification summary
- what changes now versus later
- where the follow-up was recorded
- exact recommended next command
