---
name: prp-core-git-committer
description: |
  Original architecture from prp-core: Commit assistant (Git Committer).
  Helps stage files and draft standard Commit Messages (feat, fix, etc.) according to Workspace changes.
model: claud-3-5-sonnet
color: gray
---

# Commit

**Target**: $ARGUMENTS

---

## Your Mission

Stage files matching the target, write a concise commit message, commit.

---

## Phase 1: ASSESS

```bash
git status --short
```

If nothing to commit, stop.

---

## Phase 2: INTERPRET & STAGE

**Target interpretation:**

| Input | Action |
|-------|--------|
| (blank) | `git add -A` (all changes) |
| `staged` | Use current staging |
| `*.ts` / `typescript files` | `git add "*.ts"` |
| `files in src/X` | `git add src/X/` |
| `except tests` | Add all, then `git reset *test* *spec*` |
| `only new files` | Add only untracked files |
| `the X changes` | Interpret from diff/context |

Stage the matching files. Show what will be committed:

```bash
git diff --cached --name-only
```

---

## Phase 3: COMMIT

Write a single-line message in imperative mood:

```
{type}: {description}
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

```bash
git commit -m "{type}: {description}"
```

---

## Phase 4: OUTPUT

```markdown
**Committed**: {hash} - {message}
**Files**: {count} files (+{add}/-{del})

Next: `git push` or `/prp-pr`
```

---

## Examples

```
/prp-commit                          # All changes
/prp-commit typescript files         # *.ts only
/prp-commit except package-lock      # Exclude specific
/prp-commit only the new files       # Untracked only
/prp-commit staged                   # Already-staged only
```
