---
description: PR Merge (Git Orchestration) - Safely merge the current feature branch into the base branch and clean up.
---
# Smart Merge (Git Orchestration)

## Target Branch: $ARGUMENTS (default: main)

Safely merge the current feature branch into the base branch, push the updates to the remote repository, and perform branch cleanup.

Primary behavior now lives in:

```text
.agent/skills/release-git-operations/SKILL.md
```

Treat this workflow file as a compatibility wrapper around that skill in `merge` mode.

In DevFlow 2.0, this is a release-adjacent workflow. It should happen only after review and verification evidence are already in place.

---

## Internal Process

You are an orchestrator. Your goal is to safely integrate code and clean up local or remote branches without skipping quality gates.

### Phase 1: Pre-flight Validation
**Call Agent**: `prp-core-git-committer` or `orchestrator`

- Check the current Git branch and ensure you are not already on `main` or `master`.
- Capture the feature branch name.
- Verify the working directory is clean.
- Confirm there are no uncommitted changes hiding outside the intended merge.
- Confirm the work has already passed the expected review and verification path.

### Phase 2: Switch And Update Base

- Checkout the target base branch.
- Fetch and pull the latest changes from the remote base branch to avoid drift before integration.
- If the repository uses a protected or queue-based merge model, follow that instead of forcing a local-only merge pattern.

### Phase 3: Integration

- Merge the feature branch into the base branch using the repository-standard strategy.
- Use standard merge, squash, or rebase-based merge only if that matches project policy.
- Push the updated base branch to the remote repository when appropriate.
- If conflicts appear, stop and route back to implementation or follow-up work instead of hand-waving them away.

### Phase 4: Cleanup

- Safely delete the local feature branch only after the merge is confirmed.
- Optionally delete the remote feature branch if repository policy allows it.
- Switch back to the base branch as the active working branch.

---

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Release support command, not a numbered stage
- Typical entry points: after `PR` and review gates are complete
- Typical handoff targets: `/70-Release`, `Wiki`

## Sources

- `AGENTS.md`
- `.agent/skills/release-git-operations/SKILL.md`
- `.agent/skills/git-workflow-and-versioning/SKILL.md`
- Related commands: `PR`, `PR-Review`, `PR-Followup`, `/60-Report`, `/70-Release`

## Next Workflow Recommendation

- **Primary**: `/70-Release`
- **Why**: after merge, the remaining work is usually release execution, deployment coordination, or final packaging against the already aligned report.
- **Alternative**: `/60-Report` if merge outcomes changed the story enough that the final summary must be refreshed first.

