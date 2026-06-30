---
description: Create Pull Request (Git Orchestration) - Create a well-formatted pull request from the current branch with a clear summary of changes and linked artifacts.
---
# Create Pull Request (Git Orchestration)

## Base Branch: $ARGUMENTS (default: main)

Create a well-formatted pull request from the current branch with a clear summary of changes and linked artifacts.

Primary behavior now lives in:

```text
.agent/skills/release-git-operations/SKILL.md
```

Treat this workflow file as a compatibility wrapper around that skill in `pr` mode.

In DevFlow 2.0, this is a release-adjacent workflow. It usually follows `/60-Report` and pairs naturally with `/70-Release` once the final summary is aligned.

---

## Internal Process

You are an orchestrator. Your goal is to call the specialized Git PR Maker agent and preserve the quality of the original PR workflow: clean preflight checks, strong summary construction, repository-template fidelity, and explicit next steps.

### Phase 1: Pre-flight Validation
**Call Agent**: `prp-core-git-pr-maker`

- Provide the base branch.
- Ensure the branch is not `main` or `master`.
- Check for unpushed commits.
- Verify the working directory is clean enough for PR submission.
- Confirm the implementation has already passed the expected verification gate. If it has not, route back to `/50-Verify` first.

### Phase 2: Context And Template

- Search for PR templates in the repository, such as `.github/`.
- Analyze commit history, diff, and linked task artifacts.
- Prefer markdown-first stage artifacts as the source narrative:
  - `20-spec.md`
  - `30-plan.md`
  - `40-implement.md`
  - `50-verify.md`
  - `60-report.md` when the final summary already exists
  - `70-release.md` when release execution notes already exist
- Automatically identify and link referenced issues when supported by repository conventions.
- When the PR body needs stakeholder-readable language, apply `.agent/skills/9arm-skills/management-talk/SKILL.md` as a credited communication lens while preserving the repository PR template.
- Apply GitHub prompt addons when useful:
  - `pr_template_filler` for PR body structure
  - `pr_reviewer`, `pr_quality_agent`, `pr_logic_agent`, `pr_security_agent`, `pr_structural` for review perspectives
  - `pr_finding_validator` to confirm findings are actionable
  - `pr_followup_*` to convert review comments into focused fixes
  - `issue_analyzer`, `issue_triager`, `duplicate_detector`, `spam_detector` for issue-linked context

### Phase 3: Push And Submission

- Push the branch to the remote repository.
- Use GitHub CLI or the repository-standard submission flow to create the PR with the generated body.
- Preserve any repository policy on draft PRs, labels, reviewers, or linked issue syntax.

### Phase 4: Final Summary

Verify that the workflow returns:

- PR number
- PR URL
- base and head branches
- draft or ready status
- any follow-up actions still expected from the user

---

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Release support command, not a numbered stage
- Typical entry points: `/70-Release`, `Commit`
- Typical handoff targets: `PR-Review`, `PR-Followup`, `Merge`, `/70-Release`

## Sources

- `AGENTS.md`
- `.agent/skills/release-git-operations/SKILL.md`
- `.agent/skills/git-workflow-and-versioning/SKILL.md`
- Related commands: `Commit`, `PR-Review`, `PR-Followup`, `Merge`, `/60-Report`, `/70-Release`

## Next Workflow Recommendation

- **Primary**: `/70-Release`
- **Why**: after PR creation, release execution and handoff details should stay consistent with the approved report.
- **Alternative**: `PR-Review` for structured review before broader sharing, or `/60-Report` when the final communication summary still needs to be refreshed first.

