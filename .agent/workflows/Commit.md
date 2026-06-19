---
description: Smart Commit (Git Orchestration) - Stage files intelligently and write a concise, imperative commit message according to project standards.
---
# ๐’พ Smart Commit (Git Orchestration)

## Target: $ARGUMENTS

Stage files intelligently and write a concise, imperative commit message according to project standards.

Primary behavior now lives in:

```text
.agent/skills/release-git-operations/SKILL.md
```

Treat this workflow file as a compatibility wrapper around that skill in `commit` mode.

---

## ๐ ๏ธ Internal Process

You are an orchestrator. Your goal is to call the specialized Git Committer agent to perform a high-quality commit.

### Phase 1: Assessment & Staging
**Call Agent**: `prp-core-git-committer`
- Provide the target description (e.g., "all", "backend only", "staged").
- The agent will:
  - Check the current Git status and branch.
  - **MANDATORY BRANCH RULE:** Use the user's current branch as-is. Do not create, switch, or checkout a branch automatically. Only create or switch branches when the user explicitly asks for that exact branch action in the current request.
  - If the current branch appears risky for the intended commit (for example `main`/`master` or a protected branch), warn the user and ask whether they want to continue on the current branch or explicitly create/switch to another branch.
  - Interpret your description to stage the correct files.
  - Review the staged changes to understand the context.

### Phase 2: Message Generation & Commit
- Ensure the agent generates an imperative commit message (e.g., `feat: Add user auth`).
- The agent will execute the commit and capture the result.

### Phase 3: Result Summary
- Verify the agent reports:
  - Commit Hash.
  - Final Commit Message.
  - Statistics (Files changed, additions, deletions).

---

๐“ **Next Step**: Run `PR` to create a Pull Request.

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Release support command, not a numbered stage
- Typical entry points: `/60-Release` after verification is complete
- Typical handoff targets: `PR`, `Deploy`, `/60-Release`

## Sources

- `AGENTS.md`
- `.agent/skills/release-git-operations/SKILL.md`
- `.agent/skills/git-workflow-and-versioning/SKILL.md`
- Related commands: `/60-Release`, `PR`, `Deploy`, `Merge`


