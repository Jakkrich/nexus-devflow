---
description: Fast Markdown Commit - Prepare and optionally create a commit using Markdown task evidence instead of JSON task state.
---
# Phase 50-fast: Commit Fast Markdown Task

Prepare a focused commit from a fast Markdown task, using task evidence and git diff as the source of truth.

## Usage

```text
/50-Commit-fast <task-slug> [scope]
```

## Fast Mode Contract

- Read `.workspaces/tasks/<task-slug>/task.md`, `plan.md`, `implementation.md`, and `verify.md`.
- Write `.workspaces/tasks/<task-slug>/commit.md`.
- Do not create or mutate JSON task artifacts.
- Do not require dashboard state.
- Commit only files that belong to the verified task.
- If the current branch is `main` or `master`, create or ask for a task branch before committing according to the active Git rules.

## Process

### 1. Assess Git State

- Check current branch.
- Check changed files.
- Compare changed files with the fast task evidence.
- Identify unrelated changes and leave them unstaged unless the user explicitly includes them.

### 2. Read Verification Evidence

Confirm `verify.md` has a passing verdict. If verification is missing or failed, recommend `/33-Verify-fast <task-slug>` before committing unless the user explicitly asks to commit anyway.

### 3. Prepare Commit Summary

Create `commit.md`:

```markdown
---
id: "<task-slug>"
workflow: "fast"
status: "ready_to_commit"
source_workflow: "/50-Commit-fast"
---

# Commit: <Title>

## Files To Stage

- path/to/file

## Files To Leave Unstaged

- path/to/unrelated-file

## Verification

- Command or method:
- Result:

## Suggested Commit Message

type: Imperative summary

## Notes
```

Do not leave placeholder brackets, `TODO`, or `TBD`.

### 4. Commit

If the user asked to commit:

- Stage only the selected files.
- Create a concise imperative commit message.
- Report commit hash and final message.

If the user asked only to prepare:

- Stop after writing `commit.md` and present the suggested message.

## Output

Report:

- Files staged or recommended for staging
- Files intentionally left unstaged
- Commit message
- Commit hash if created
- Next command: `/51-PR` when a pull request is desired

## Next Workflow Recommendation

- **Primary**: `/51-PR` after a successful commit when the user wants a pull request.
- **Alternative**: `/33-Verify-fast <task-slug>` if verification is missing or stale.
