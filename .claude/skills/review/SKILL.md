---
name: review
description: "[Devflow] Multi-axis code and PR review. Reviews diffs against standards, specs, correctness, security, performance, and 9arm scrutinize discipline."
---

# Code Review, Quality & PR Analysis

## Overview

This is the comprehensive review master skill for Nexus-DevFlow. It evaluates code modifications, local diffs, branches, and pull requests across multiple dimensions before merging or releasing. Every change gets reviewed before merge — no exceptions.

**The approval standard**: Approve a change when it definitely improves overall code health and satisfies the specification, even if it isn't perfect.

---

## 1. The Scrutinize Discipline (9arm Review Pattern)

Before jumping into line-by-line comments, apply the 4-step Scrutiny check:
1. **Intent Check**: What problem is this change truly trying to solve? Is this the right problem?
2. **Safer / Smaller Alternative**: Could this be achieved with fewer lines, zero new dependencies, or less complexity?
3. **Runtime Path Trace**: Trace the execution path through inputs, error handling, async boundaries, and state mutations.
4. **Precision & Evidence**: Does the code contain unproven assumptions or missing test evidence?

---

## 2. The Five-Axis Review Framework

Every review evaluates code across these 5 core axes:

```text
┌──────────────────────────────────────────────────────────┐
│                 FIVE-AXIS CODE REVIEW                    │
├──────────────┬───────────────────────────────────────────┤
│ 1. Correctness│ Logic, edge cases, error paths, races     │
│ 2. Simplicity │ Readable, concise, no dead code, DAMP/DRY │
│ 3. Architecture│ Boundaries, dependencies, design patterns │
│ 4. Security   │ Input validation, auth, no secrets/XSS    │
│ 5. Performance│ No N+1 queries, async I/O, memoization    │
└──────────────┴───────────────────────────────────────────┘
```

---

## 3. Review Lenses & Finding Severities

Categorize all findings into actionable severities:

- **P0 (Critical Blocker)**: Security vulnerability, data loss, runtime crash, broken main functionality. (Blocks `70-release`)
- **P1 (Major Blocker)**: Spec mismatch, broken error handling, severe regression risk. (Blocks `70-release`)
- **P2 (Normal Improvement)**: Readability, missing edge-case test, minor performance optimization.
- **P3 (Nit / Suggestion)**: Naming polish, optional refactor, comment clarity.

---

## 4. PR Review Process

1. **Load Context**: Pin fixed point (merge-base with `main`), read spec (`20-spec.md`) and coding standards.
2. **Review Standards vs. Spec**: Check adherence to project instructions (`AGENTS.md`) and acceptance criteria.
3. **Validate Findings**: Ensure every finding is reproducible and points to specific files and line numbers.
4. **Generate Report**: Save substantial review reports under:
   ```text
   devflow/runs/{ID}-{slug}/pr_review.md
   ```

---

## Relationship To DevFlow 2.0

- **Classification**: Companion command & Verification support
- **Mainline stages**: `50-verify` (QA & Code Review lane), `70-release` (Pre-merge review)
- **Handoff**: `40-execute` (for fixes), `50-verify`, `70-release`
