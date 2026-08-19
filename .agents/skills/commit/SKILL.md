---
name: commit
description: "[Devflow] Smart Commit (Git Orchestration) - Stage files intelligently, write conventional imperative commit messages, and manage trunk-based versioning."
---

# Smart Commit & Git Workflow Versioning

## Overview

This is the Git orchestration and versioning master skill for Nexus-DevFlow. It enforces atomic commits, conventional commit formatting, intelligent staging, and safe trunk-based workflows. Commits are save points, branches are sandboxes, and Git history is durable documentation.

---

## 1. Commit Discipline & The Conventional Commits Standard

Each commit should represent one atomic, self-contained change:

```text
<type>(<scope>): <short imperative summary>

[optional detailed body explaining WHY, not WHAT]
```

### Commit Types:
- `feat`: A new user-facing feature or capability
- `fix`: A bug fix
- `docs`: Documentation only changes
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Maintenance, build tasks, package updates

### Formatting Rules:
- Use the imperative mood: `"feat(auth): add password reset flow"` (NOT `"added"` or `"adds"`).
- Never mix formatting/refactoring with behavioral feature changes in the same commit.

---

## 2. Trunk-Based Branching & Safety

- **Keep `main` deployable**: Feature branches (`feature/{slug}-{running-id}`) must be short-lived.
- **Never commit directly to `main` without review**: Use feature/fix branches during development.
- **Small, verified increments**: Test and verify before committing each checkpoint.

---

## 3. Execution Flow

1. Check `git status` and verify current branch.
2. Stage relevant files explicitly (`git add <files>` — avoid blindly running `git add .` if untracked temporary files exist).
3. Generate concise conventional commit message.
4. Execute `git commit` and capture commit hash.

---

## Relationship To DevFlow 2.0

- **Classification**: Companion command & Version control support
- **Mainline integration**: Used during `40-implement` (checkpoint commits), `70-release` (final release commit).
- **Handoff**: `pr`, `merge`, `70-release`
