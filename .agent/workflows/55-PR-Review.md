---
description: PR Review Addon - Review a pull request using GitHub review prompt patterns and the credited 9arm-skills/scrutinize discipline.
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

Additional credited discipline:

- `.agent/skills/9arm-skills/scrutinize/SKILL.md`
- Source pack: `9arm-skills`
- Credit: `thananon/9arm-skills`
- Upstream: https://github.com/thananon/9arm-skills
- Adapted for: Antigravity IDE / Nexus-DevFlow

## Process

### 1. Load Review Context

Read the available context:

- PR diff or local `git diff`
- changed filenames
- linked task artifacts under `.workspaces/specs/{ID}-*/`
- `spec.md`, `implementation_plan.json`, `qa_report.md`
- project patterns and existing code around the changed files

### 2. Select Review Lanes

Start with the `scrutinize` lens before detailed lane review:

- Intent check: should this change exist in this form?
- Smaller alternative: can the same outcome be reached with less code, lower risk, or existing patterns?
- Actual path trace: follow runtime behavior beyond the diff.

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

When saving a substantial report, include a short `Source Discipline` section crediting `9arm-skills/scrutinize` and, where useful, brief `Intent Check`, `Smaller Alternative Considered`, and `Actual Path Trace` sections. Preserve the required PR review template headings.

## Output

Return a PR review. Do not modify files unless the user explicitly asks for fixes.

**MANDATORY RULE:** Before saving a PR review report, inspect `.agent/resources/schemas/pr_review.template.md` and use its required headings and table structure. Before reporting completion, run `npm run agent -- markdown:validate {report_path} pr_review.template.md` and replace any placeholder/template text with concrete findings, file references, risk, and verification gaps.
**MANDATORY RULE:** If a Task ID is linked to this PR, ALWAYS save this review report to a file named `pr_review.md` inside that task's workspace directory (e.g., `.workspaces/specs/{ID}-*/pr_review.md`).

## Next Workflow Recommendation

- **Primary**: `/32-Code {ID}` when review finds required fixes, or `/50-Commit {ID}` when the review is clean and the task is approved.
- **Why**: PR review either creates corrective work or clears the path toward commit/PR completion.
- **Alternatives**:
  - `/54-Insight {review_report}` - choose this when review findings reveal reusable lessons.
  - `/59-Wiki project ingest {review_report}` - choose this when review establishes a durable project convention or risk pattern.
  - `/56-PR-Followup {target}` - choose this when the PR has comments that need classification and response.

## Wiki Update Recommendation

- **Needed**: `yes` when review finds a reusable risk pattern, convention, architectural decision, or testing gap.
- **Scope**: `project` unless the finding changes DevFlow review behavior.
- **Reason**: Review findings compound well when stored as patterns and gotchas rather than isolated comments.
- **Suggested Command**: `/59-Wiki project ingest .workspaces/specs/{ID}-*/pr_review.md`
