---
description: Issue Triage Addon - Analyze GitHub issues, detect duplicates or spam, and route actionable work into DevFlow workflows.
---

# Phase 57: Issue Triage Addon

## Target: $ARGUMENTS

Use this workflow to evaluate GitHub issues, bug reports, feature requests, support requests, duplicates, or noisy reports before creating or resuming work.

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
- related files, logs, screenshots, or references

### 2. Triage

Classify the issue:

- bug
- feature request
- documentation request
- question or support
- duplicate
- spam or noise
- needs more information

Assess:

- severity
- user impact
- reproducibility
- affected area
- confidence

Separate:

- what is already evidenced
- what is inferred
- what still needs proof

### 3. Create Issue Triage Report

- **MANDATORY:** Before generating the final report, inspect `.agent/resources/schemas/triage.template.md` for layout, required sections, and format.
- Before reporting completion, run:

Review `{report_path}` against `triage.template.md`, keep the required headings, and remove placeholder text before completion.

- Replace any placeholder or template text with concrete issue summary, classification, impact, routing decision, and next command.
- Save the final report to:

```text
.workspaces/issues/{date}-triage-{issue_number}.md
```

### 4. Route

Use:

- `Debug` for confirmed bugs needing root cause work
- `Research` or `Spec-Research` for external dependency uncertainty
- `PRD` for product-level feature requests that need problem framing
- `/10-Define` for actionable work that still needs scope decisions
- `/20-Spec` for work that is already stable enough to become a delivery contract
- `Help` when the issue is not actionable yet

## Output Triage Recommendation

Return:

- classification
- duplicate or spam assessment
- confidence level
- recommended route into DevFlow 2.0
- where the report was written

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Intake support command, not a numbered stage
- Typical entry points: issue intake before scope or implementation begins
- Typical handoff targets: `Debug`, `PRD`, `/10-Define`, `Research`, `Help`

## Sources

- `AGENTS.md`
- `.agent/resources/schemas/triage.template.md`
- Related commands: `Debug`, `PRD`, `/10-Define`, `Research`, `Help`


