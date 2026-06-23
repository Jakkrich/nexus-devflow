---
id: "{running_id}-verify"
title: "Verify: {Work Title}"
doc_type: "stage"
stage: "50-verify"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
status: "draft"
artifact_language: "en"
related_run: "{running_id}"
related_files: []
---

# Verify: {Work Title}

## 1. Purpose

- Validate that implementation matches the spec and is safe to release.

## 2. Inputs

- `40-implement.md`
- `20-spec.md`
- `checklists/master-checklist.md`
- `checklists/verification-checklist.md`
- `50-verify-impact.md` when impact analysis is needed
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

### Checklist Alignment

- [Confirm checklist statuses, evidence links, and any blocked items]

### Impact Report Status

- [State whether `50-verify-impact.md` was created. If not, explain why it was not needed.]

## 4. Decisions

- [Decision 1]

## 5. Outputs

- Verification verdict
- Release blockers, if any
- Manual checks still required, if any
- Checklist updates required before release, if any
- Reference to `50-verify-impact.md`, if created

## 6. Next Step Guidance

- Mainline recommendation: `/60-Release`
- If defects block progress: return to `/40-Implement`
- If deeper investigation is needed: use `Debug`

## 7. Additional Notes

- Add any extra headings below this section when useful.

