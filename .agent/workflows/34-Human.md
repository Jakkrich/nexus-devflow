---
description: Human actions compatibility dispatcher - Routes legacy /34-Human commands to explicit human action workflows.
---
# Phase 34: Human Actions Compatibility Dispatcher

Route legacy `/34-Human [Action] {ID} [Message]` commands to the first-class human action workflows.

## Usage

```
/34-Human [Action] {ID} [Message]
```

Legacy examples:

```
/34-Human Approve 003
/34-Human Reject 003 "Needs better error handling"
/34-Human Feedback 003 "Please add validation for email format as well"
/34-Human ReCheck 003 "Did verification cover the fallback path?"
```

Preferred first-class commands:

```
/34-Human-Approve 003
/34-Human-Reject 003 "Needs better error handling"
/34-Human-Feedback 003 "Please add validation for email format as well"
/34-Human-ReCheck 003 "Did verification cover the fallback path?"
```

## Arguments

- **Action**:
  - `Approve`: Route to `/34-Human-Approve {ID} [Approval message]`
  - `Reject`: Route to `/34-Human-Reject {ID} "{Reason}"`
  - `Feedback`: Route to `/34-Human-Feedback {ID} "{Feedback}"`
  - `ReCheck` or `Review`: Route to `/34-Human-ReCheck {ID} [Question]`
- **ID**: Task ID (e.g., `003`).
- **Message**: Optional for Approve and ReCheck. Required for Reject and Feedback.

---

## Process

### Step 1: Parse Legacy Action
Read the first argument and map it to the explicit workflow:

| Legacy Action | First-Class Workflow | Lifecycle Effect |
|---|---|---|
| `Approve` | `/34-Human-Approve` | Transitions task to `done` |
| `Reject` | `/34-Human-Reject` | Transitions task to `in_progress` and records rejection history |
| `Feedback` | `/34-Human-Feedback` | Transitions task to `in_progress` and records feedback history |
| `ReCheck` or `Review` | `/34-Human-ReCheck` | Read-only review; status unchanged by default |

### Step 2: Enforce Required Message Rules
- `Reject` requires a reason.
- `Feedback` requires a feedback message.
- `Approve` may use `"Approved by human"` when no message is provided.
- `ReCheck` may run without a question and perform a general review.

### Step 3: Delegate To The Explicit Workflow
Follow the matching first-class workflow file as the source of truth:

- [34-Human-Approve.md](34-Human-Approve.md)
- [34-Human-Reject.md](34-Human-Reject.md)
- [34-Human-Feedback.md](34-Human-Feedback.md)
- [34-Human-ReCheck.md](34-Human-ReCheck.md)

### Step 4: Notify
Show a summary to the user:

```
Human Action: {Action} on Task {ID}
Status: {new_status_or_unchanged}
Next Step: {recommendation from delegated workflow}
```

---

## Output
- **Updated Files**: Determined by the delegated workflow. ReCheck updates no files by default.

## Next Workflow Recommendation

- **Primary**: Use the explicit workflow that matches the human action: `/34-Human-Approve {ID}`, `/34-Human-Reject {ID} "{Reason}"`, `/34-Human-Feedback {ID} "{Feedback}"`, or `/34-Human-ReCheck {ID} [Question]`.
- **Why**: The explicit commands are easier to discover, validate, document, and maintain than a single action-dispatch command.
- **Alternatives**:
  - `/33-Verify {ID}` - choose this before human action when validation evidence is missing.
  - `/32-Code {ID}` - choose this after rejection or feedback.
  - `/54-Insight {ID}` - choose this after approval.

## Wiki Update Recommendation

- **Needed**: `yes` when the delegated action records durable approval, rejection, feedback, or project preference.
- **Scope**: `project` unless the action concerns DevFlow framework behavior.
- **Reason**: Human decisions are high-value project memory and should not remain only in chat.
- **Suggested Command**: `/59-Wiki project ingest .workspaces/specs/{ID}-*/qa_report.md`
