---
description: PR Review Addon - Review a pull request using GitHub review prompt patterns and the credited 9arm-skills/scrutinize discipline.
---

# Phase 55: PR Review Addon

## Target: $ARGUMENTS

Use this workflow when you need a structured PR review without creating or changing the PR. It can review a local diff, a PR URL or number, or a task-linked branch.

In DevFlow 2.0, this remains a supporting review workflow. It should feed corrective work back into `/40-Implement` or clear the path toward `/60-Release`.

Primary behavior now lives in the `pr-review-analysis` skill. Keep this workflow as the compatibility wrapper and user-facing review prompt surface.

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
- linked stage artifacts under `.workspaces/specs/{ID}-*/`
- `20-spec.md`, `30-plan.md`, `40-implement.md`, `50-verify.md`, and `60-release.md` when relevant
- project patterns and existing code around the changed files
- legacy JSON only when migration context is still genuinely relevant

### 2. Select Review Lanes

Start with the `scrutinize` lens before detailed lane review:

- Intent check: should this change exist in this form?
- Smaller alternative: can the same outcome be reached with less code, lower risk, or existing patterns?
- Actual path trace: follow runtime behavior beyond the diff.
- Precision check: were assumptions explicit, edits surgical, success criteria verified, and uncertainty surfaced instead of guessed?

Then select only the review lanes that match the scope. Do not run every lane by default; the review should be proportional to the change.

| Lane | Use When |
| :--- | :--- |
| Correctness / bugs | Always, unless the user explicitly asks for a narrow non-code review. |
| Type safety | Typed code, public types, schema changes, casts, `any`, or boundary parsing changed. |
| Maintainability | The change adds duplication, cross-file patterns, API shape, migration bridges, or technical debt. |
| Simplicity | The change adds abstractions, indirection, configuration, generalized utilities, or complex control flow. |
| Testability | Important logic is mixed with IO, hidden state, time, random values, constructors, globals, or hard-coded dependencies. |
| Coverage | New or changed behavior should have tests, especially bug fixes and business logic. |
| Docs accuracy | Commands, setup, workflows, schemas, public APIs, examples, or user-visible behavior changed. |
| AGENTS.md adherence | An `AGENTS.md` or equivalent project instruction file exists for the changed scope. |
| Security | Auth, authorization, secrets, user input, external data, dependencies, or persistence boundaries changed. |
| Performance | Queries, loops, rendering, data volume, hot paths, or synchronous work changed. |

When a lane is skipped, briefly note why if the omission could surprise the reader. For tiny reviews, it is acceptable to state only the lanes used.

### 3. Validate Findings

Before reporting a finding:

- verify it against the changed code
- check whether it affects new code or pre-existing code
- ensure it is actionable
- include file and line references when possible
- avoid style-only comments unless they hide real risk
- keep each finding in its strongest matching lane; do not report the same issue twice under different labels
- drop findings that are only suspicions, preferences, or theoretical improvements without a concrete failure mode
- for AGENTS.md findings, quote the exact project instruction being violated
- for docs findings, show the mismatch between what the docs say and what the code now does

### 4. Output Findings First

Use code-review style:

1. Findings ordered by severity
2. Open questions or assumptions
3. Short summary
4. Test gaps or residual risk

When saving a substantial report, include a short `Source Discipline` section crediting `9arm-skills/scrutinize` and, where useful, brief `Intent Check`, `Smaller Alternative Considered`, and `Actual Path Trace` sections. Preserve the required PR review template headings.

## Output

Return a PR review. Do not modify files unless the user explicitly asks for fixes.

**MANDATORY RULE:** Before saving a PR review report, inspect `.agent/resources/schemas/pr_review.template.md` and use its required headings and table structure.

Before reporting completion, run:

Review `{report_path}` against `pr_review.template.md`, keep the required headings, and remove placeholder text before completion.

Replace any placeholder or template text with concrete findings, file references, risk, and verification gaps.

**MANDATORY RULE:** If a running ID is linked to this PR, always save this review report to `pr_review.md` inside that workspace directory when possible:

```text
.workspaces/specs/{ID}-*/pr_review.md
```

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Verification and release support command, not a numbered stage
- Typical entry points: `/50-Verify`, `PR`, `Agent code-reviewer`
- Typical handoff targets: `PR-Followup`, `/60-Release`, `/70-Report`, `Wiki`

## Sources

- `AGENTS.md`
- `.agent/resources/schemas/pr_review.template.md`
- Related commands: `/50-Verify`, `PR`, `PR-Followup`, `Agent`, `/60-Release`, `Wiki`

## Next Workflow Recommendation

- **Primary**: `/40-Implement {ID}` when review finds required fixes, or `/60-Release` when the review is clean and the work is ready to move forward.
- **Why**: PR review either creates corrective implementation work or clears the path toward release-facing packaging.
- **Alternatives**:
  - `/70-Report` when the review outcome needs a communication summary
  - `Wiki` when the review establishes a durable convention or risk pattern
  - `PR-Followup {target}` when the PR already has comments that need classification and response

