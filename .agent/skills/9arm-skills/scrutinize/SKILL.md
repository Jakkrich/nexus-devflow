---
name: 9arm-skills/scrutinize
description: Use for plan, PR, and code review. Starts by challenging whether the change should exist, then checks smaller alternatives and traces actual code paths.
source_pack: 9arm-skills
credit: thananon/9arm-skills
upstream: https://github.com/thananon/9arm-skills
adapted_for: Antigravity IDE / Nexus-DevFlow
---

# Scrutinize

## Purpose

Review with an outsider perspective before accepting a plan, PR, or code change. The first question is not "is this code correct?" but "should this change exist in this form?"

This skill is a credited adaptation of `9arm-skills/scrutinize` for Nexus-DevFlow.

## Review Sequence

### 1. Intent Check

Clarify:

- what problem the change is solving
- what user or system behavior should change
- what is explicitly out of scope
- whether the change matches the task, spec, or PR description

### 2. Smaller / Safer Alternative

Before reviewing details, ask:

- can this be solved with less code?
- can this reuse an existing pattern?
- can the risk be split into smaller changes?
- is any dependency, abstraction, migration, or API surface unnecessary?

### 3. Trace The Actual Path

Do not review only the diff. Follow the end-to-end path that will execute after the change:

- entrypoint
- existing callers
- changed module
- downstream effects
- persistence or external boundaries
- error path and fallback behavior

### 4. Findings First

Report actionable findings first, ordered by severity. Avoid style-only comments unless style hides real risk.

## Nexus-DevFlow Output

When used by `PR-Review`, preserve `.agent/resources/schemas/pr_review.template.md` and add scrutiny context without replacing the required sections.

Recommended extra sections:

```md
## Source Discipline
- Source pack: 9arm-skills
- Applied skill: scrutinize
- Credit: thananon/9arm-skills
- Adapted for: Antigravity IDE / Nexus-DevFlow

## Intent Check
## Smaller Alternative Considered
## Actual Path Trace
```

For `Agent code-reviewer`, save substantial reports under `.workspaces/reports/` unless the invoking workflow has a more specific destination.

