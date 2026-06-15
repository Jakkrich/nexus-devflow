---
description: Smart Commit (Git Orchestration) - Stage files intelligently and write a concise, imperative commit message according to project standards.
---
# 💾 Smart Commit (Git Orchestration)

## Target: $ARGUMENTS

Stage files intelligently and write a concise, imperative commit message according to project standards.

---

## 🛠️ Internal Process

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

📌 **Next Step**: Run `/51-PR` to create a Pull Request.
