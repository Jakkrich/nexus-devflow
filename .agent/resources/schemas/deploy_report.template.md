---
id: "deploy-report-{Timestamp}"
title: "Production Deployment And Pre-Flight Report"
doc_type: "report"
category: "release"
status: "draft"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
source_workflow: "Deploy"
related_task: null
related_files: []
tags:
  - nexus-devflow
  - report
  - release
aliases:
  - "Deployment Report {Timestamp}"
summary: "Deployment pre-flight and verification report."
metadata_version: 1
qa_result: "pending"
risk_level: "medium"
---

# Production Deployment And Pre-Flight Report #doc/report #report/release

> **Source Trigger**: `Deploy`
> **Target Environment**: {e.g. Staging, Production}
> **Timestamp**: {Timestamp}

## 1. Pre-Flight Checklist Validation #section/verification

| Check Category | Validation Step / Command | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| **Lint And Syntax** | `npm run lint` | No lint errors | [OK | Failed] |
| **Unit Tests** | `npm test` | All unit tests pass | [OK | Failed] |
| **Build Check** | `npm run build` | Bundle compiles successfully | [OK | Failed] |
| **Git Status** | `git status` | Clean working tree | [OK | Failed] |

## 2. Execution Log And Staged Rollout #section/evidence

- **Build Output Size**: [Bundle size in MB]
- **Deployment Strategy**: [e.g. Blue-Green, staged rollout, direct push]
- **Command Run**:

```bash
[Deployment command run, e.g. npm run deploy]
```

## 3. Post-Deployment Verification #section/decision

- **Application Health Check URL**: [URL tested]
- **Smoke Tests Run**: [API endpoint check results]
- **Rollback Strategy**: [How to revert if error rate increases]
- **Deployment Verdict**: [Successful Deployment | Rolled Back]

## 4. Sources #section/sources

- {Sources}
