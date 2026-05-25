---
description: Human feedback - Add human feedback to a task and loop back to implementation.
---
# Phase 34: Human Feedback

Record human feedback on reviewed work and return the task to implementation without treating the feedback as a hard rejection.

## Usage

```
/34-Human-Feedback {ID} "{Feedback}"
```

Example: `/34-Human-Feedback 003 "Please add validation for email format as well"`

## Arguments

- **ID**: Task ID (e.g., `003`).
- **Feedback**: Required feedback message. Use this for requested improvements, preferences, or non-blocking changes that still require another implementation pass.

---

## Process

### Step 1: Locate Task
Search for the folder `.workspaces/specs/{ID}-*/` and read `implementation_plan.json`.

### Step 2: Execute Feedback
Use PRP CLI commands for `implementation_plan.json` status changes. Do not manually rewrite dashboard JSON.

- **Update status**: Run `npm run agent -- transition {ID} in_progress --actor "Human" --summary "{Feedback summary}"`
- **Template Verification**: Before creating or updating `qa_report.md`, inspect `.agent/resources/schemas/qa_report.template.md` and preserve its required headings. Before reporting completion, run `npm run agent -- markdown:validate {qa_report_path} qa_report.template.md` and replace any placeholder/template text with concrete feedback evidence.
- **Record Feedback** in `qa_report.md` under the heading `## Feedback History`:
  ```markdown
  ## Feedback History
  ### Round {N} - {Date}
  - **From**: Human
  - **Feedback**: {Message}
  ```
- **Recommend Next Step**: Run `/32-Code {ID}` to improve based on the feedback.
- **Record lesson (Optional)**: If the feedback represents a durable rule or style preference, add a note to `.workspaces/lessons.md`. Must strictly follow the template in [../resources/schemas/lessons.template.md](../resources/schemas/lessons.template.md). Run `npm run agent -- markdown:validate .workspaces/lessons.md lessons.template.md` before reporting the lesson as complete.

### Step 3: Notify
Show a summary to the user:

```
Human Action: Feedback on Task {ID}
Status: in_progress
Next Step: Run /32-Code {ID} to improve based on the feedback.
```

---

## Output
- **Updated Files**: `implementation_plan.json` (status), `qa_report.md` (feedback history), optionally `.workspaces/lessons.md`

## Next Workflow Recommendation

- **Primary**: `/32-Code {ID}`
- **Why**: Feedback requests another implementation pass while preserving human context.
- **Alternatives**:
  - `/31-Plan {ID}` - choose this if the feedback adds new scope that needs planning.
  - `/35-Followup {ID}` - choose this when feedback extends approved work as a follow-up round.
  - `/59-Wiki project ingest .workspaces/specs/{ID}-*/qa_report.md` - choose this when feedback captures reusable project knowledge.

## Wiki Update Recommendation

- **Needed**: `yes` when feedback contains a durable preference, rule, or project lesson.
- **Scope**: `project` unless the feedback concerns DevFlow framework behavior.
- **Reason**: Human feedback is high-value project memory and should not remain only in chat.
- **Suggested Command**: `/59-Wiki project ingest .workspaces/specs/{ID}-*/qa_report.md`
