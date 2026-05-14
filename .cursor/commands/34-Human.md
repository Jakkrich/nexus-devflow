---
description: Create Human Actions - Perform explicit human actions on a task, such as approving, rejecting, or providing feedback.
---
# Phase 34: Human Actions

Perform explicit human actions on a task, such as approving, rejecting, or providing feedback.

## Usage

```
/34-Human [Action] {ID} [Message]
```

Example: `/34-Human Approve 003`
Example: `/34-Human Reject 003 "Needs better error handling"`
Example: `/34-Human Feedback 003 "Please add validation for email format as well"`

## Arguments

- **Action**:
  - `Approve`: Mark task as DONE ✅
  - `Reject`: Send the work back for fixes → Loops back to `/32-Code` 🔄
  - `Review`: Mark task as REVIEW NEEDED.
  - `Feedback`: Add a feedback note → Loops back to `/32-Code` 🔄
- **ID**: Task ID (e.g., `003`).
- **Message**: Reason or feedback (Required for Reject/Feedback)

---

## Process

### Step 1: Locate Task
Search for the folder `.workspaces/specs/{ID}-*/` and read `implementation_plan.json`.

### Step 2: Execute Action (PURE AGENTIC)

Instruct the Agent to use the `replace_file_content` tool to modify the `status` in `implementation_plan.json` according to the received command:

#### ✅ Approve (Mark as DONE)
- **Update status**: Change `"status": "..."` to `"status": "done"` and `"xstateState": "done"`
- **Record lesson**: If this task contains good techniques or a structure that acts as a good prototype, add a note to `.workspaces/lessons.md` as a Best Practice. Must strictly follow the template in [../resources/schemas/lessons.template.md](../resources/schemas/lessons.template.md).
- **End of lifecycle** — The task is completed.

#### 🔄 Reject (Send back for fixes)
- **Update status**: Change the status back to `"status": "in_progress"`
- **Record Rejection** in `qa_report.md` under the heading `## Rejection History`:
  ```markdown
  ## Rejection History
  ### Round {N} — {Date}
  - **Reviewer**: Human
  - **Reason**: {Message}
  - **Action Items**:
    - [ ] {Things to fix based on the Message}
  ```
- **Recommend Next Step**: _"Run `/32-Code {ID}` to apply fixes according to the Feedback"_
- **Record lesson**: Add a note of the mistake and what needs to be fixed to `.workspaces/lessons.md` to prevent repeating the bug in the next task. Must strictly follow the template in [../resources/schemas/lessons.template.md](../resources/schemas/lessons.template.md).

#### 📝 Feedback (Add Note and loop back)
- **Update status**: Change the status back to `"status": "in_progress"`
- **Record Feedback** in `qa_report.md` under the heading `## Feedback History`:
  ```markdown
  ## Feedback History
  ### Round {N} — {Date}
  - **From**: Human
  - **Feedback**: {Message}
  ```
- **Recommend Next Step**: _"Run `/32-Code {ID}` to improve based on the Feedback"_
- **Record lesson (Optional)**: If the Feedback represents a rule or style that should be memorized permanently, add a note to `.workspaces/lessons.md`. Must strictly follow the template in [../resources/schemas/lessons.template.md](../resources/schemas/lessons.template.md).

### Step 3: Notify
Show a summary to the user:

```
📋 Human Action: {Action} on Task {ID}
📌 Status: {new_status}
📌 Next Step: {recommendation}
```

---

## Workflow Diagram

```
/32-Code {ID}
    ↓
/33-Verify {ID} (QA Report + Manual Guide)
    ↓
Status: human_review
    ↓
Human verifies according to Manual Verification Guide
    ↓
    ├── /34-Human Approve {ID}  → ✅ Done (Finished)
    ├── /34-Human Reject {ID}   → 🔄 in_progress → /32-Code (Loop back)
    └── /34-Human Feedback {ID} → 🔄 in_progress → /32-Code (Loop back)
```

> **Reject/Feedback Loop**: Will loop continuously until Approved
> Each round will increment the Round number (Round 1, Round 2, ...)

---

## Output
- **Updated Files**: `implementation_plan.json` (status), `qa_report.md` (rejection/feedback history)
