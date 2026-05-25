---
description: Human recheck - Ask a read-only review question about completed or verified work without changing task status.
---
# Phase 34: Human ReCheck

Ask the agent to re-evaluate completed or verified work before the human chooses approval, rejection, or feedback.

## Usage

```
/34-Human-ReCheck {ID} [Question]
```

Example: `/34-Human-ReCheck 003`
Example: `/34-Human-ReCheck 003 "Did the implementation cover the empty-state requirement?"`

## Arguments

- **ID**: Task ID (e.g., `003`).
- **Question**: Optional focused review question. When omitted, perform a general recheck of implementation plan status, QA evidence, and remaining risks.

---

## Process

### Step 1: Locate Task
Search for the folder `.workspaces/specs/{ID}-*/` and read available task artifacts:

- `spec.md`
- `requirements.json`
- `implementation_plan.json`
- `context.json`
- `qa_report.md`
- `task_logs.json`

### Step 2: Perform Read-Only Review
- Do not transition task status by default.
- Do not edit `implementation_plan.json`, `qa_report.md`, or `.workspaces/lessons.md` unless the user explicitly asks to record the recheck.
- Compare completed work, QA evidence, and the human question against the task requirements.
- Identify concrete gaps, uncertainties, and evidence-backed risks.

### Step 3: Recommend Decision Path
- If the work looks ready, recommend `/34-Human-Approve {ID}`.
- If required fixes are found, recommend `/34-Human-Reject {ID} "{Reason}"`.
- If the work is acceptable but the human wants improvements or preferences applied, recommend `/34-Human-Feedback {ID} "{Feedback}"`.
- If verification evidence is stale or missing, recommend `/33-Verify {ID}`.

### Step 4: Notify
Show a summary to the user:

```
Human Action: ReCheck on Task {ID}
Status: unchanged
Next Step: {Approve | Reject | Feedback | Verify recommendation}
```

---

## Output
- **Updated Files**: None by default. This workflow is read-only unless the user explicitly asks to record results.

## Next Workflow Recommendation

- **Primary**: `/34-Human-Approve {ID}`, `/34-Human-Reject {ID} "{Reason}"`, or `/34-Human-Feedback {ID} "{Feedback}"` depending on the recheck result.
- **Why**: ReCheck is a decision-support workflow, not a lifecycle transition.
- **Alternatives**:
  - `/33-Verify {ID}` - choose this when validation evidence is missing, stale, or incomplete.
  - `/40-Test {ID}` - choose this when the question requires additional automated or manual test coverage.
  - `/59-Wiki project ingest .workspaces/specs/{ID}-*/qa_report.md` - choose this only if the user asks to preserve recheck insights.

## Wiki Update Recommendation

- **Needed**: `no` by default.
- **Scope**: `project` only when the user asks to preserve the recheck result.
- **Reason**: ReCheck is intentionally read-only decision support; durable knowledge should be recorded only when it becomes a confirmed rule, lesson, or preference.
- **Suggested Command**: `/59-Wiki project ingest .workspaces/specs/{ID}-*/qa_report.md`
