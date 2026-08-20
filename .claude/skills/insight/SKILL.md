---
name: insight
description: "[Devflow] Extract reusable lessons, patterns, file insights, and post-mortem learning from completed work."
---

# Insight Extraction & Post-Mortem Learning

## Overview

This is the insight and knowledge extraction master skill for Nexus-DevFlow. It captures reusable engineering lessons, architectural patterns, gotchas, post-mortem incident analyses, and token-efficiency notes from completed implementation and verification work.

**9arm Post-Mortem Pattern**:
```text
What Broke ➔ Business Impact ➔ Root Cause ➔ Fix Evidence ➔ Prevention & Guardrails
```

---

## 1. Types of Knowledge Extracted

1. **Architectural Patterns**: Reusable structural patterns, data transformations, or component designs.
2. **Gotchas & Hidden Invariants**: Subtle platform bugs, async timing issues, ORM quirks, or browser edge cases.
3. **Incident Post-Mortems**: Rigorous root cause analysis and why tests/checks failed to catch the bug initially.
4. **Context & Token Optimization**: Notes on avoidable context reading or redundant artifact parsing.

---

## 2. Process & Recording Destinations

1. **Load Evidence**: Review `git diff`, `40-execute.md`, `50-verify.md`, or test logs.
2. **Distill Insights**: Formulate clear, actionable, non-generic takeaways.
3. **Save to Persistent Memory**:
   - Save project-wide engineering lessons to `devflow/context/lessons.md` (or `knowledge/lessons.md`).
   - Feed run-specific learnings into `60-report.md` and `70-release.md`.

---

## Relationship To DevFlow 2.0

- **Classification**: Companion command & Continuous learning
- **Mainline integration**: Invoked after `50-verify` or `60-report`.
- **Handoff**: `60-report`, `70-release`
