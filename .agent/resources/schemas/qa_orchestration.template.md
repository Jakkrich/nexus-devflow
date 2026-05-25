---
id: "qa-orchestration-{ID}"
title: "QA Orchestration Plan: Task {ID} - {Task Title}"
doc_type: "plan"
category: "qa"
status: "draft"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
source_workflow: "/39-QA-Orchestrate"
related_task: "{ID}"
related_files: []
tags:
  - nexus-devflow
  - plan
  - qa
aliases:
  - "QA Orchestration {ID}"
summary: "QA orchestration plan for {Task Title}."
metadata_version: 1
qa_result: "pending"
risk_level: "medium"
---

# QA Orchestration Plan: Task {ID} - {Task Title} #doc/plan #report/qa

> **Source Trigger**: `/39-QA-Orchestrate`
> **Target Task ID**: {ID}
> **Status**: QA-PLANNING

## 1. QA Strategy And Multi-Lane Allocation #section/strategy

To ensure comprehensive test coverage, the following QA lanes are activated:

- **Correctness And Acceptance Criteria**: [Verify functional deliverables]
- **Tests And Regressions**: [Verify test suite coverage and prevent regression]
- **Security And Data Safety**: [Verify input sanitation, authentication, and permissions]
- **Performance And Scalability**: [Verify load speed, DB index hits, and resource locks]
- **UX / Manual Verification**: [Verify responsiveness, styling, and premium interactive flow]

## 2. Recommended Specialist Reviews #section/recommendations

To drill down into specific areas, the following senior specialist agents are recommended:

- `/90-Agent code-reviewer .workspaces/specs/{ID}-*/` - Codebase fit, architecture check
- `/90-Agent test-engineer .workspaces/specs/{ID}-*/` - Missing test cases discovery
- `/90-Agent security-auditor .workspaces/specs/{ID}-*/` - Deep vulnerability check

## 3. Test Routing And Action Items #section/findings

*Actionable findings identified during the orchestration scan:*

| Finding / Target | Severity | Lanes Affected | Action Item / Fix Instructions |
| :--- | :--- | :--- | :--- |
| [e.g. Unhandled error fallback] | [Low | Medium | High] | Correctness, UX | [e.g. Implement custom catch block] |

## 4. Concrete Next Command #section/followup

If findings are minor, proceed to:

```text
/33-Verify {ID}
```

If significant fixes are needed, proceed to:

```text
/32-Code {ID}
```

## 5. Sources #section/sources

- {Sources}
