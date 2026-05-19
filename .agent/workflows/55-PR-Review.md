---
description: PR Review Addon - Review a pull request using GitHub review prompt patterns.
---

# Phase 55: PR Review Addon

## Target: $ARGUMENTS

Use this workflow when you need a structured PR review without creating or changing the PR. It can review a local diff, a PR URL/number, or a task-linked branch.

## Prompt Sources

Adapted from:

- `github/QA_REVIEW_SYSTEM_PROMPT.md`
- `github/pr_reviewer.md`
- `github/pr_parallel_orchestrator.md`
- `github/pr_orchestrator.md`
- `github/pr_quality_agent.md`
- `github/pr_logic_agent.md`
- `github/pr_security_agent.md`
- `github/pr_structural.md`
- `github/pr_codebase_fit_agent.md`
- `github/pr_finding_validator.md`
- `github/partials/full_context_analysis.md`

## Process

### 1. Load Review Context

Read the available context:

- PR diff or local `git diff`
- changed filenames
- linked task artifacts under `.workspaces/specs/{ID}-*/`
- `spec.md`, `implementation_plan.json`, `qa_report.md`
- project patterns and existing code around the changed files

### 2. Select Review Lanes

Use lanes that match the change:

- correctness and business logic
- security and data exposure
- code quality and maintainability
- structure, boundaries, and codebase fit
- tests and validation coverage
- user-facing behavior and regressions

### 3. Validate Findings

Before reporting a finding:

- verify it against the changed code
- check whether it affects new code or pre-existing code
- ensure it is actionable
- include file and line references when possible
- avoid style-only comments unless they hide real risk

### 4. Output Findings First

Use code-review style:

1. Findings ordered by severity
2. Open questions or assumptions
3. Short summary
4. Test gaps or residual risk

## Output

Return a PR review. Do not modify files unless the user explicitly asks for fixes.
