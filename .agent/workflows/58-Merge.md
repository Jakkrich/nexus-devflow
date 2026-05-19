---
description: PR Merge (Git Orchestration) - Safely merge the current feature branch into the base branch and clean up.
---
# 🔀 Smart Merge (Git Orchestration)

## Target Branch: $ARGUMENTS (default: main)

Safely merge the current feature branch into the base branch (e.g., `main`), push the updates to the remote repository, and perform branch clean-up.

---

## 🛠️ Internal Process

You are an orchestrator. Your goal is to safely integrate code and clean up local/remote branches.

### Phase 1: Pre-flight Validation
**Call Agent**: `prp-core-git-committer` or `orchestrator`
- The agent will:
  - Check the current Git branch. Ensure you are **NOT** on `main` or `master`.
  - Capture the name of the current feature branch (e.g., `feature/001-setup-vault`).
  - Verify that the working directory is completely clean (`git status`).
  - Verify that there are no uncommitted changes.

### Phase 2: Switch & Update Base
- The agent will:
  - Checkout the target base branch (default: `main` or `master`).
  - Fetch and pull the latest changes from the remote base branch to avoid drift (`git pull origin <base>`).

### Phase 3: Integration (Merge)
- The agent will:
  - Merge the feature branch into the base branch. Use standard merge (`git merge <feature-branch>`) or squash depending on project policies.
  - Push the updated base branch to the remote repository (`git push origin <base>`).

### Phase 4: Clean-up
- The agent will:
  - Safely delete the local feature branch (`git branch -d <feature-branch>`).
  - Optionally, delete the remote feature branch if it was pushed (`git push origin --delete <feature-branch>`).
  - Switch back to the base branch as the active working branch.

---

📌 **Next Step**: Run `/02-Status` to confirm everything is clean, or `/30-Task` to start a new task.
