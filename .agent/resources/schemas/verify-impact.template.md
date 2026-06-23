---
id: "{running_id}-verify-impact"
title: "Impact & Safety Report: {Task ID} - {Task Title}"
doc_type: "report"
stage: "50-verify-impact"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
status: "draft"
artifact_language: "en"
related_run: "{running_id}"
related_files: []
---

# Impact & Safety Report: {Task ID} - {Task Title}

This report documents change impact and safety evidence so the team can confirm that existing client flows remain safe after the implementation.

## 1. Changed Files

| File | Change Type | Details And Reason |
| :--- | :--- | :--- |
| `path/to/file` | `Core Logic` | Explain what changed and why. |

Notes:

- Mark lint-only or cleanup-only edits clearly so reviewers know they do not change business logic.

## 2. Client Impact Analysis

| Client Flow | Before | After | Impact And Risk |
| :--- | :--- | :--- | :--- |
| `Client Flow 1` | Describe previous behavior. | Describe new behavior. | `Positive` / `No impact` / `Low risk` |

## 3. Verification Metrics

### A. Unit Verification

- **Tests Run**: `[X] passed, [Y] failed, [Z] skipped`
- **Directly Relevant Cases**:
  - `test_case_name`: explain the result and why it matters.

### B. Integration Verification

- **Tests Run**: `[X] passed, [Y] failed, [Z] skipped`
- **Directly Relevant Cases**:
  - `test_case_name`: explain the result and why it matters.

## 4. Rollback & Mitigation Plan

- **Rollback Strategy**: explain how to restore the previous safe state.
- **Risk Mitigation**: explain rollout controls, feature flags, manual guardrails, or staged deployment steps.

## 5. Additional Notes

- Add extra headings below when useful.

