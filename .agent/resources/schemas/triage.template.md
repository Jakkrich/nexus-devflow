---
id: "triage-{Issue_Number}"
title: "GitHub Issue Triage Report: #{Issue_Number}"
doc_type: "report"
category: "triage"
status: "draft"
artifact_language: "en"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
source_workflow: "Issue-Triage"
related_task: "#{Issue_Number}"
related_files: []
tags:
  - nexus-devflow
  - report
  - triage
aliases:
  - "Issue Triage #{Issue_Number}"
summary: "GitHub issue triage report for #{Issue_Number}."
metadata_version: 1
risk_level: "medium"
---

# GitHub Issue Triage Report: #{Issue_Number} #doc/report #report/review

> **Source Trigger**: `Issue-Triage`
> **Target Issue Number**: #{Issue_Number}
> **Title**: {Issue Title}

## 1. Issue Overview And Diagnosis #section/summary

- **Summary**: [What is reported? Description of bug or feature request]
- **Symptom / Trace**: [Error logs or step to reproduce]
- **Duplicate Detection**: [Search results for similar issues]
- **Spam Verdict**: [Valid Issue | Spam/Noise]

## 2. Severity And Priority Evaluation #section/findings

- **Classification**: [e.g. Bug | Feature Request | Security | Chore]
- **Priority Level**: [Low | Medium | High | Critical]
- **Impact Assessment**: [How many users are affected? Security vulnerability risk?]

## 3. Triage Routing Action Plan #section/decision

- **Triage Action**: [Create PRP Task | Defer | Close | Request Clarification]
- **Recommended Workflow**:
  - For bugfixes: Run `Debug "RCA for #{Issue_Number}"`
  - For features: Run `PRD "PRD for #{Issue_Number}"`
- **Next Command**:

```text
/{Workflow} "{Arguments}"
```

## 4. Sources #section/sources

- {Sources}

