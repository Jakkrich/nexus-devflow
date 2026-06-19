---
description: Human recheck - Ask a read-only review question about completed or verified work without changing task status.
---
# Phase 34: Human ReCheck

Ask the agent to re-evaluate completed or verified work before the human chooses approval, rejection, or feedback.

Primary behavior now lives in:

```text
.agent/skills/human-review-decisions/SKILL.md
```

Treat this workflow file as a compatibility wrapper around that skill in `recheck` mode.

## Usage

```text
Human-ReCheck {ID} [Question]
```

## Arguments

- **ID**: Task ID
- **Question**: Optional focused review question. When omitted, perform a general recheck of evidence and remaining risks.

## Process

### Step 1: Locate Task

Read the available stage artifacts:

- `10-define.md`
- `20-spec.md`
- `30-plan.md`
- `40-implement.md`
- `50-verify.md`
- `60-release.md` when present

### Step 2: Perform Read-Only Review

- Do not transition task status by default.
- Do not edit stage artifacts unless the user explicitly asks to record the recheck.
- Compare completed work, verification evidence, and the human question against the task contract.
- Identify concrete gaps, uncertainties, and evidence-backed risks.

### Step 3: Recommend Decision Path

- If the work looks ready, recommend `Human-Approve {ID}`
- If required fixes are found, recommend `Human-Reject {ID} "{Reason}"`
- If the work is acceptable but improvements are requested, recommend `Human-Feedback {ID} "{Feedback}"`
- If verification evidence is stale or missing, recommend `/50-Verify {ID}`

### Step 4: Notify

```text
Human Action: ReCheck on Task {ID}
Status: unchanged
Next Step: {Approve | Reject | Feedback | Verify recommendation}
```

## Output

No files updated by default. This workflow is read-only unless the user explicitly asks to record the recheck result.

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Human review helper, not a numbered stage
- Typical entry points: after implementation changes or after feedback is addressed
- Typical handoff targets: `Human-Approve`, `Human-Reject`, `Human-Feedback`, `/50-Verify`

## Sources

- `AGENTS.md`
- `.agent/skills/human-review-decisions/SKILL.md`
- Related commands: `Human-Approve`, `Human-Reject`, `Human-Feedback`, `/50-Verify`, `Test`

## Next Workflow Recommendation

- **Primary**: `Human-Approve {ID}`, `Human-Reject {ID} "{Reason}"`, or `Human-Feedback {ID} "{Feedback}"` depending on the result
- **Why**: ReCheck is decision support, not a lifecycle transition
- **Alternatives**:
  - `/50-Verify {ID}` when evidence is missing, stale, or incomplete
  - `Test {ID}` when the question requires more focused testing

