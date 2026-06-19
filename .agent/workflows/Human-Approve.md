---
description: Human approval - Mark a reviewed task as approved after human verification.
---
# Phase 34: Human Approve

Mark a task as approved by a human reviewer and complete the review loop.

Primary behavior now lives in:

```text
.agent/skills/human-review-decisions/SKILL.md
```

Treat this workflow file as a compatibility wrapper around that skill in `approve` mode.

## Usage

```text
Human-Approve {ID} [Approval message]
```

Example: `Human-Approve 003`

## Arguments

- **ID**: Task ID
- **Approval message**: Optional summary. Use `"Approved by human"` when omitted.

## Process

### Step 1: Locate Task

Search for `.workspaces/specs/{ID}-*/` and read `50-verify.md` first. Read `60-release.md` or `70-report.md` when they help explain the approval decision.

### Step 2: Confirm Review Gate

- Confirm the task is genuinely human-review-ready, usually after `/50-Verify {ID}`.
- If verification evidence is missing or stale, warn the user and recommend `/50-Verify {ID}` before approval.

### Step 3: Execute Approval

- Record the approval result in the current review-facing artifact, preferring `50-verify.md` or `60-release.md`.
- If the approval reveals a durable lesson or preferred pattern, add it to `.workspaces/lessons.md` and validate against `lessons.template.md`.

### Step 4: Notify

Show a concise summary:

```text
Human Action: Approve on Task {ID}
Status: approved
Next Step: /60-Release {ID} or /70-Report {ID}
```

## Output

- updated approval note in `50-verify.md`, `60-release.md`, or equivalent stage artifact
- optional lesson entry

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Human decision helper, not a numbered stage
- Typical entry points: after `/50-Verify` or a manual review gate
- Typical handoff targets: `/60-Release`, `/70-Report`

## Sources

- `AGENTS.md`
- `.agent/skills/human-review-decisions/SKILL.md`
- Related commands: `/50-Verify`, `/60-Release`, `/70-Report`, `Wiki`

## Next Workflow Recommendation

- **Primary**: `/60-Release {ID}`
- **Why**: human approval means the work can move into delivery packaging
- **Alternatives**:
  - `/70-Report {ID}` when the main need is a clear final summary
  - `Wiki project ingest .workspaces/specs/{ID}-*/50-verify.md` when approval contains reusable project knowledge

