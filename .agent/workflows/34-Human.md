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

Use PRP CLI commands for `implementation_plan.json` status changes. Do not manually rewrite dashboard JSON.

#### ✅ Approve (Mark as DONE)
- **Update status**: Run `npm run agent -- update {ID} --status done`
- **Record lesson**: If this task contains good techniques or a structure that acts as a good prototype, add a note to `.workspaces/lessons.md` as a Best Practice. Must strictly follow the template in [../resources/schemas/lessons.template.md](../resources/schemas/lessons.template.md). Run `npm run agent -- markdown:validate .workspaces/lessons.md lessons.template.md` before reporting the lesson as complete.
- **End of lifecycle** — The task is completed.

#### 🔄 Reject (Send back for fixes)
- **Update status**: Run `npm run agent -- update {ID} --status in_progress`
- **Template Verification**: Before creating or updating `qa_report.md`, inspect `.agent/resources/schemas/qa_report.template.md` and preserve its required headings. Before reporting completion, run `npm run agent -- markdown:validate {qa_report_path} qa_report.template.md` and replace any placeholder/template text with concrete approval/rejection/feedback evidence.
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
- **Record lesson**: Add a note of the mistake and what needs to be fixed to `.workspaces/lessons.md` to prevent repeating the bug in the next task. Must strictly follow the template in [../resources/schemas/lessons.template.md](../resources/schemas/lessons.template.md). Run `npm run agent -- markdown:validate .workspaces/lessons.md lessons.template.md` before reporting the lesson as complete.

#### 📝 Feedback (Add Note and loop back)
- **Update status**: Run `npm run agent -- update {ID} --status in_progress`
- **Template Verification**: Before creating or updating `qa_report.md`, inspect `.agent/resources/schemas/qa_report.template.md` and preserve its required headings. Before reporting completion, run `npm run agent -- markdown:validate {qa_report_path} qa_report.template.md` and replace any placeholder/template text with concrete approval/rejection/feedback evidence.
- **Record Feedback** in `qa_report.md` under the heading `## Feedback History`:
  ```markdown
  ## Feedback History
  ### Round {N} — {Date}
  - **From**: Human
  - **Feedback**: {Message}
  ```
- **Recommend Next Step**: _"Run `/32-Code {ID}` to improve based on the Feedback"_
- **Record lesson (Optional)**: If the Feedback represents a rule or style that should be memorized permanently, add a note to `.workspaces/lessons.md`. Must strictly follow the template in [../resources/schemas/lessons.template.md](../resources/schemas/lessons.template.md). Run `npm run agent -- markdown:validate .workspaces/lessons.md lessons.template.md` before reporting the lesson as complete.

#### Follow-Up Planning Addon

When the user asks for additional functionality after completion, apply the `followup_planner` pattern:

- Extend the existing implementation plan; do not replace completed phases or subtasks.
- Preserve all existing statuses.
- Add new phase(s) and subtask(s) with `npm run agent -- plan:add-phase` and `npm run agent -- plan:add-subtask`.
- Run `npm run agent -- plan:validate {ID}` and `npm run agent -- validate {ID}`.
- Recommend `/32-Code {ID}` only after the user approves the added follow-up plan.

When the task is approved or rejected, optionally apply the `insight_extractor` pattern to record reusable lessons, gotchas, and future recommendations.

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

## Next Workflow Recommendation

- **Primary**: `/54-Insight {ID}` after approval, or `/32-Code {ID}` after rejection or feedback.
- **Why**: Approved work should preserve lessons; rejected work should loop back to implementation.
- **Alternatives**:
  - `/50-Commit {ID}` - choose this after approval when changes are ready to commit.
  - `/59-Wiki project ingest .workspaces/specs/{ID}-*/` - choose this when approval or feedback contains reusable knowledge.
  - `/35-Followup {ID}` - choose this when the human requests additional scope after approval.

## Wiki Update Recommendation

- **Needed**: `yes` when human approval, rejection, or feedback creates a durable preference, rule, or project lesson.
- **Scope**: `project` unless the feedback is about DevFlow itself.
- **Reason**: Human feedback is high-value project memory and should not remain only in chat.
- **Suggested Command**: `/59-Wiki project ingest .workspaces/specs/{ID}-*/qa_report.md`
