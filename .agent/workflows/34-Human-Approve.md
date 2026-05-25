---
description: Human approval - Mark a reviewed task as done after human verification.
---
# Phase 34: Human Approve

Mark a task as approved by a human reviewer and complete the task lifecycle.

## Usage

```
/34-Human-Approve {ID} [Approval message]
```

Example: `/34-Human-Approve 003`
Example: `/34-Human-Approve 003 "Approved after manual smoke test"`

## Arguments

- **ID**: Task ID (e.g., `003`).
- **Approval message**: Optional summary. Use `"Approved by human"` when omitted.

---

## Process

### Step 1: Locate Task
Search for the folder `.workspaces/specs/{ID}-*/` and read `implementation_plan.json` and `qa_report.md` when present.

### Step 2: Confirm Review Gate
- Confirm the task has reached a human-review-ready state, usually after `/33-Verify {ID}`.
- If verification evidence is missing, warn the user and recommend `/33-Verify {ID}` before approval.

### Step 3: Execute Approval
Use PRP CLI commands for `implementation_plan.json` status changes. Do not manually rewrite dashboard JSON.

- **Update status**: Run `npm run agent -- transition {ID} done --actor "Human" --summary "{Approval message}"`
- **Record lesson**: If this task contains good techniques or a structure that acts as a good prototype, add a note to `.workspaces/lessons.md` as a Best Practice. Must strictly follow the template in [../resources/schemas/lessons.template.md](../resources/schemas/lessons.template.md). Run `npm run agent -- markdown:validate .workspaces/lessons.md lessons.template.md` before reporting the lesson as complete.
- **End of lifecycle**: The task is completed.

### Step 4: Notify
Show a summary to the user:

```
Human Action: Approve on Task {ID}
Status: done
Next Step: Run /54-Insight {ID} to preserve reusable lessons, or /50-Commit {ID} when changes are ready to commit.
```

---

## Output
- **Updated Files**: `implementation_plan.json` (status), optionally `.workspaces/lessons.md`

## Next Workflow Recommendation

- **Primary**: `/54-Insight {ID}` after approval.
- **Why**: Approved work should preserve reusable lessons, gotchas, and approach outcomes.
- **Alternatives**:
  - `/50-Commit {ID}` - choose this when approved changes are ready to commit.
  - `/59-Wiki project ingest .workspaces/specs/{ID}-*/` - choose this when approval contains reusable project knowledge.
  - `/35-Followup {ID}` - choose this when the human requests additional scope after approval.

## Wiki Update Recommendation

- **Needed**: `yes` when approval includes a durable preference, best practice, or reusable project lesson.
- **Scope**: `project` unless the approval captures DevFlow framework behavior.
- **Reason**: Human approval often contains useful project memory that should not remain only in chat.
- **Suggested Command**: `/59-Wiki project ingest .workspaces/specs/{ID}-*/qa_report.md`
