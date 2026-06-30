---
name: pr-review-analysis
description: Review pull requests or local diffs with structured finding discipline, selective review lanes, and Nexus-DevFlow report templates. Use when the team needs a substantial review without turning review into a numbered workflow stage.
---

# PR Review Analysis

## Overview

This skill is the shared behavior layer behind `PR-Review`.

It preserves the stronger PR review UX from the legacy workflow while fitting DevFlow 2.0 as a non-mainline support capability.

## Related Foundation Skills

This skill should reuse and align with:

- `.agent/skills/9arm-skills/scrutinize/SKILL.md`
- `.agent/resources/schemas/pr_review.template.md`

## When to Use

- after `/50-Verify` when the change needs structured review before `/60-Report` and `/70-Release`
- when a local diff, branch, or pull request needs findings-first analysis
- when the user wants review without directly editing code

Do not use this skill as a substitute for implementation, debugging, or formal release packaging.

## Process

### 1. Load Review Context

Read the minimum relevant context:

- PR diff or local `git diff`
- changed files
- linked stage artifacts under the running workspace when available
- nearby project patterns and affected runtime paths

### 2. Apply Scrutiny First

Start with the `scrutinize` discipline:

- intent check
- smaller or safer alternative
- actual runtime path trace
- precision and evidence check

### 3. Select Review Lanes

Use only the lanes that match scope:

- correctness
- maintainability
- simplicity
- testability and coverage
- docs accuracy
- AGENTS or instruction adherence
- security
- performance

### 4. Validate Findings

Before reporting a finding:

- verify it against the changed code
- confirm whether it is new or pre-existing
- keep it actionable
- include file and line references whenever possible

### 5. Save Reusable Report

When saving a substantial report, preserve:

```text
.workspaces/specs/{ID}-*/pr_review.md
```

Use `.agent/resources/schemas/pr_review.template.md` and replace all placeholder text with real findings, questions, risks, and evidence gaps.

## Output

Return:

- findings ordered by severity
- open questions or assumptions
- residual risks or test gaps
- where the review report was saved
- the recommended next route such as `/40-Implement`, `/70-Release`, or `PR-Followup`
