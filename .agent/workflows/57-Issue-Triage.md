---
description: Issue Triage Addon - Analyze GitHub issues, detect duplicates or spam, and route actionable work into PRPs workflows.
---

# Phase 57: Issue Triage Addon

## Target: $ARGUMENTS

Use this workflow to evaluate GitHub issues, bug reports, feature requests, support requests, duplicates, or noisy reports before creating PRP tasks.

## Prompt Sources

Adapted from:

- `github/issue_analyzer.md`
- `github/issue_triager.md`
- `github/duplicate_detector.md`
- `github/spam_detector.md`
- `github/pr_ai_triage.md`

## Process

### 1. Read Issue Context

Collect:

- issue title and body
- comments and maintainer notes
- labels and linked PRs
- reproduction steps
- affected versions or environment
- related files, logs, or screenshots

### 2. Triage

Classify the issue:

- bug
- feature request
- documentation request
- question/support
- duplicate
- spam/noise
- needs more information

Assess:

- severity
- user impact
- reproducibility
- affected area
- confidence

### 3. Route

Use:

- `/20-Debug` for confirmed bugs needing root cause
- `/15-Spec-Research` for external dependency uncertainty
- `/12-PRD` for product-level feature requests
- `/30-Task` for actionable implementation work
- `/99-Coach` when the issue is not actionable yet

### 4. Output Triage Recommendation

Return:

- classification
- duplicate/spam assessment
- missing information
- recommended labels
- suggested next workflow
- draft response when useful
