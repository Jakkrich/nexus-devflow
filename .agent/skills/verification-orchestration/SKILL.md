---
name: verification-orchestration
description: Coordinate multi-lane QA, specialist review, test planning, and verification follow-up. Use when /50-Verify needs more structure than a single pass and the team needs a QA matrix or specialist routing.
---

# Verification Orchestration

## Overview

This skill structures complex verification work across multiple QA lanes without replacing the main verification stage.

## When to Use

- `/50-Verify` is too broad for a single simple pass
- the change needs correctness, regression, security, performance, and UX checks together
- the team needs specialist routing for QA

## Process

### 1. Validate The Verification Context

- inspect the owning stage artifacts first
- confirm what implementation scope is actually under review
- keep markdown stage artifacts as the source of truth

### 2. Choose QA Lanes

Typical lanes:

- correctness and acceptance criteria
- tests and regressions
- security and data safety
- performance and scalability
- UX or manual verification
- codebase fit and maintainability

### 3. Route Specialist Help

Use specialist agents only when needed, such as:

- `code-reviewer`
- `test-engineer`
- `security-auditor`

### 4. Save Reusable Report

Write reusable output under:

```text
.workspaces/reports/{date}-qa-orchestrate-{id}.md
```

Use `.agent/resources/schemas/qa_orchestration.template.md` when saving a reusable report.

### 5. Route Back

- `/50-Verify` when the QA matrix strengthens verification evidence
- `/40-Implement` when actionable fixes are required
- `Followup` when findings become new scope

## Output

Return:

- QA lanes used
- specialist recommendations
- findings and blockers
- recommended return stage
