---
description: Human rejection - Send reviewed work back for fixes with a required reason.
---
# Phase 34: Human Reject

Reject reviewed work and return the task to implementation with explicit action items.

## Usage

```
/34-Human-Reject {ID} "{Reason}"
```

Example: `/34-Human-Reject 003 "Needs better error handling"`

## Arguments

- **ID**: Task ID (e.g., `003`).
- **Reason**: Required rejection reason. Include concrete fix expectations when possible.

---

## Process

### Step 1: Locate Task
Search for the folder `.workspaces/specs/{ID}-*/` and read `implementation_plan.json`.

### Step 2: Execute Rejection
Use PRP CLI commands for `implementation_plan.json` status changes. Do not manually rewrite dashboard JSON.

- **Update status**: Run `npm run agent -- transition {ID} in_progress --actor "Human" --summary "{Rejection reason}"`
- **Template Verification**: Before creating or updating `qa_report.md`, inspect `.agent/resources/schemas/qa_report.template.md` and preserve its required headings. Before reporting completion, run `npm run agent -- markdown:validate {qa_report_path} qa_report.template.md` and replace any placeholder/template text with concrete rejection evidence.
- **Record Rejection** in `qa_report.md` under the heading `## Rejection History`:
  ```markdown
  ## Rejection History
  ### Round {N} - {Date}
  - **Reviewer**: Human
  - **Reason**: {Message}
  - **Action Items**:
    - [ ] {Things to fix based on the Message}
  ```
- **Recommend Next Step**: Run `/32-Code {ID}` to apply fixes according to the rejection reason.
- **Record lesson**: Add a note of the mistake and what needs to be fixed to `.workspaces/lessons.md` to prevent repeating the bug in the next task. Must strictly follow the template in [../resources/schemas/lessons.template.md](../resources/schemas/lessons.template.md). Run `npm run agent -- markdown:validate .workspaces/lessons.md lessons.template.md` before reporting the lesson as complete.

### Step 3: Notify
Show a summary to the user:

```
Human Action: Reject on Task {ID}
Status: in_progress
Next Step: Run /32-Code {ID} to apply fixes according to the rejection reason.
```

---

## Output
- **Updated Files**: `implementation_plan.json` (status), `qa_report.md` (rejection history), optionally `.workspaces/lessons.md`

## Next Workflow Recommendation

- **Primary**: `/32-Code {ID}`
- **Why**: Rejected work must loop back to implementation with the recorded action items.
- **Alternatives**:
  - `/31-Plan {ID}` - choose this if the rejection changes scope or requires new phases.
  - `/20-Debug {ID}` - choose this if the rejection points to a reproduced bug or regression.
  - `/59-Wiki project ingest .workspaces/specs/{ID}-*/qa_report.md` - choose this when the rejection captures reusable project knowledge.

## Wiki Update Recommendation

- **Needed**: `yes` when the rejection identifies a durable rule, gotcha, or human preference.
- **Scope**: `project` unless the rejection concerns DevFlow framework behavior.
- **Reason**: Rejection feedback is high-value project memory and should not remain only in chat.
- **Suggested Command**: `/59-Wiki project ingest .workspaces/specs/{ID}-*/qa_report.md`
