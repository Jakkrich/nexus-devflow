---
id: "spec-orchestration-{Topic Slug}"
title: "Spec Orchestration Report: {Topic}"
doc_type: "report"
category: "planning"
status: "draft"
artifact_language: "en"
created: "{Date}"
updated: "{Date}"
owner: "Spec Orchestrator Agent"
source_workflow: "Spec-Orchestrate"
related_task: null
related_files: []
tags:
  - nexus-devflow
  - report
  - planning
aliases:
  - "Spec Orchestration: {Topic}"
summary: "Spec orchestration report for {Topic}."
metadata_version: 1
---

# Spec Orchestration Report: {Topic} #doc/report #report/research

> **Source Trigger**: `Spec-Orchestrate`
> **Orchestrator**: Spec Orchestrator Agent
> **Date**: {Date}

## 1. Conceptual Framework And Scope #section/scope

- **Problem Statement**: [What broad feature/product are we orchestrating specs for?]
- **MVP Boundaries**: [What is in scope for the initial delivery? What is excluded?]
- **Acceptance Signals**: [How will we know this system is successful?]

## 2. Supporting Workflows Route Map #section/strategy

To assemble the final requirements, the following workflows are recommended in sequential order:

1. **`Spec-Research`**: Research integrations first [Links / Context]
2. **`Competitor`**: Research competitor gaps and pain points [Context]
3. **`PRD`**: Synthesize findings into a formal product spec
4. **`/00-Discover`**: Anchor the run and create the workspace before definition/spec work

## 3. Spec Critic Analysis #section/findings

*A Senior Spec Critic evaluation of potential risks and underspecified details:*

- **Missing Acceptance Criteria**: [e.g. Rate limiting details, edge-case UI handling]
- **Unverified Dependencies**: [e.g. Unverified Stripe API compatibility]
- **Ambiguous Data Behaviors**: [e.g. Database schema constraint uncertainties]
- **Mitigation Action**: [How to resolve the critique in the next step]

## 4. Concrete Next Command #section/followup

Run this command to proceed with discovery/planning:

```text
/{Next-Workflow} {Arguments}
```

## 5. Sources #section/sources

- {Sources}

