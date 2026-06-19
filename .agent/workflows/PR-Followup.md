---
description: PR Follow-up Addon - Convert PR review comments and follow-up discussion into focused fixes or follow-up tasks.
---

# Phase 56: PR Follow-up Addon

## Target: $ARGUMENTS

Use this workflow when a PR has review comments, requested changes, new-code concerns, or discussion that must be resolved.

Primary behavior now lives in the `review-followup-routing` skill using `pr-followup` mode. Keep this workflow as the compatibility wrapper for PR-specific routing.

## Prompt Sources

Adapted from:

- `github/pr_followup.md`
- `github/pr_followup_orchestrator.md`
- `github/pr_followup_comment_agent.md`
- `github/pr_followup_newcode_agent.md`
- `github/pr_followup_resolution_agent.md`
- `github/pr_fixer.md`
- `github/pr_finding_validator.md`

## Process

### 1. Gather Comments

Collect:

- unresolved PR comments
- requested changes
- review summaries
- related CI failures
- latest diff after review
- linked stage artifacts if available

### 2. Classify Each Comment

Classify each item as:

- valid fix required
- already resolved
- needs clarification
- out-of-scope follow-up
- pre-existing issue
- non-actionable or incorrect

Do not collapse all review feedback into a single bucket. Preserve the distinction between immediate corrective work and future-scope work.

### 3. Create PR Follow-Up Report

- **MANDATORY:** Before generating the final report, inspect `.agent/resources/schemas/pr_followup.template.md` for layout, required sections, and format.
- Before reporting completion, run:

Review `{report_path}` against `pr_followup.template.md`, keep the required headings, and remove placeholder text before completion.

- Replace any placeholder or template text with concrete review comments, decisions, tasks, and risks.
- Save the final report to:

```text
.workspaces/reports/{date}-pr-followup-{ID}.md
```

### 4. Route Work

For in-scope fixes, route back into the mainline:

```text
/40-Implement {ID}
```

For genuinely new scope that should not be hidden inside the current PR:

```text
/10-Define
```

or start a new running ID when the work becomes large enough to deserve its own line.

For review-only response:

```text
PR-Review {PR}
```

### 5. Preserve Decision History

If the PR is linked to a running ID, summarize the key follow-up decisions in the relevant markdown stage artifact or report so the reasoning does not live only in PR comments.

## Output

Return:

- comment classification summary
- what must be fixed now
- what should become separate follow-up work
- where the report was saved
- the exact next command

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Review follow-up support, not a numbered stage
- Typical entry points: after `PR-Review` or active pull request comments
- Typical handoff targets: `/40-Implement`, `/50-Verify`, `PR`, `Merge`

## Sources

- `AGENTS.md`
- `.agent/resources/schemas/pr_followup.template.md`
- Related commands: `PR-Review`, `/40-Implement`, `/50-Verify`, `PR`, `Merge`


