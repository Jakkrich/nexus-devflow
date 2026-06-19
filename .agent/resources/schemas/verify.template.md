---
id: "{running_id}-verify"
title: "Verify: {Work Title}"
doc_type: "stage"
stage: "50-verify"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
status: "draft"
related_run: "{running_id}"
related_files: []
---

# Verify: {Work Title}

## 1. Purpose

- Validate that implementation matches the spec and is safe to release.

## 2. Inputs

- `40-implement.md`
- `20-spec.md`
- Supporting debug, preview, or review notes if they exist

## 3. Required Content

### Checks Run

- [Check 1]

### Results

- [Result summary]

### Issues Found

- [Issue 1]

### Approval Notes

- [Merge/rework recommendation]

## 4. Decisions

- [Decision 1]

## 5. Outputs

- Verification verdict
- Release blockers, if any
- Manual checks still required, if any

## 6. Next Step Guidance

- Mainline recommendation: `/60-Release`
- If defects block progress: return to `/40-Implement`
- If deeper investigation is needed: use `Debug`

## 7. Additional Notes

- Add any extra headings below this section when useful.
