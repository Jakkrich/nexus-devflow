---
description: Fast Markdown PR Review - Review a local diff or PR using fast task Markdown evidence instead of JSON task artifacts.
---
# Phase 55-fast: PR Review Fast Markdown Task

Review a PR, branch, or local diff with findings-first output and save the report in the fast task workspace when available.

## Usage

```text
/55-PR-Review-fast <task-slug|pr-url|branch|diff-target>
```

## Fast Mode Contract

- Read `.workspaces/tasks/<task-slug>/` Markdown artifacts when a slug is provided.
- Write `.workspaces/tasks/<task-slug>/review.md` when task-linked, or `.workspaces/reports/pr-review-fast-<slug>.md` for standalone reviews.
- Do not create or mutate JSON task artifacts.
- Do not modify source files unless the user explicitly asks for fixes.
- Keep findings actionable and proportional to the diff.

## Process

### 1. Load Review Context

Read:

- PR diff or local git diff
- changed filenames
- fast task artifacts if available
- relevant source files around changed code
- project instructions such as `AGENTS.md` when in scope

### 2. Select Review Lanes

Always start with:

- Intent check
- Smaller alternative considered
- Actual code path trace
- Verification evidence check

Then select relevant lanes:

- Correctness
- Type safety
- Maintainability
- Simplicity
- Testability and coverage
- Docs accuracy
- Security
- Performance
- Project instruction adherence

### 3. Validate Findings

Before reporting:

- confirm the issue is caused or exposed by the reviewed change
- include file and line references when possible
- avoid duplicate findings
- avoid style-only comments unless they hide real risk
- separate open questions from findings

### 4. Write `review.md`

Use this structure:

```markdown
---
id: "<task-slug-or-review-slug>"
workflow: "fast"
status: "<pass|changes_requested|commented>"
source_workflow: "/55-PR-Review-fast"
---

# PR Review: <Title>

## Findings

## Open Questions

## Summary

## Test Gaps And Residual Risk

## Handoff
```

If there are no findings, state that clearly and list residual test gaps or risk.

## Output

Return findings first, ordered by severity, followed by open questions, a short summary, and test gaps.

## Next Workflow Recommendation

- **Primary**: `/32-Code-fast <task-slug>` when required fixes are found.
- **Alternative**: `/50-Commit-fast <task-slug>` when the review is clean and verification has passed.
