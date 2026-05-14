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
  - Check the current Git status.
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

📌 **Next Step**: Run `/08-PR` to create a Pull Request.
