---
description: PR Follow-up Addon - Convert PR review comments and follow-up discussion into focused fixes or follow-up subtasks.
---

# Phase 56: PR Follow-up Addon

## Target: $ARGUMENTS

Use this workflow when a PR has review comments, requested changes, new-code concerns, or discussion that must be resolved.

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
- linked task artifacts if available

### 2. Classify Each Comment

Classify as:

- valid fix required
- already resolved
- needs clarification
- out of scope follow-up
- pre-existing issue
- non-actionable or incorrect

### 3. Route Work

For in-scope fixes:

```text
/32-Code {ID}
```

For new scope:

```text
/35-Followup {ID} "address PR follow-up: {summary}"
```

For review-only response:

```text
/55-PR-Review {PR}
```

### 4. Preserve Artifacts

If the PR is linked to a PRP task, log key follow-up decisions:

```powershell
npm run agent -- log {ID} "PR follow-up: {short decision}" --phase validation
npm run agent -- validate {ID}
```

## Output

Return:

- comment classification
- required fixes
- out-of-scope follow-ups
- suggested reply or next command
