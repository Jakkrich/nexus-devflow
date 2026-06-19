---
id: "{running_id}-release"
title: "Release: {Work Title}"
doc_type: "stage"
stage: "60-release"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
status: "draft"
related_run: "{running_id}"
related_files: []
---

# Release: {Work Title}

## 1. Purpose

- Package the verified work for delivery, release, merge, or handoff.

## 2. Inputs

- `50-verify.md`
- Supporting PR, deploy, changelog, or merge notes if they exist

## 3. Required Content

### Delivery Summary

- [What is being delivered]

### PR Or Deploy Notes

- [PR/deploy/merge information]

### Follow-Ups

- [Post-release follow-up items]

## 4. Decisions

- [Decision 1]

## 5. Outputs

- Release-ready summary
- Handoff information for final reporting

## 6. Next Step Guidance

- Mainline recommendation: `/70-Report`
- If release blockers appear: return to `/50-Verify` or `/40-Implement`

## 7. Additional Notes

- Add any extra headings below this section when useful.
