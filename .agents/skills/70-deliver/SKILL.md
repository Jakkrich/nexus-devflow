---
name: 70-deliver
description: "[devflow][D] Deliver stage in DevFlow 2.0 - package verified work for delivery, archive run to categorized history, git merge, PR, or deployment."
argument-hint: "{running-id or workspace path}"
---

# Phase 70: Deliver

$ARGUMENTS

Package approved work for delivery after the report stage has captured the final verified story. Archives the active run from `devflow/context/current-run/` to `devflow/history/{features|fixes|rollbacks}/{xxx-slug}/`, updates `HISTORY.md` and `CHANGELOG.md`, executes pre-flight smoke checks, performs conventional git commit & merge, and closes the run.

## Usage

```text
70-deliver {id or workspace path}
```

## Markdown-First Contract

Write the primary stage artifact to:

```text
devflow/context/current-run/70-deliver.md
```

## Process & Quality Gates

### 0. Step 0 Safety Pass & Findings Ledger Gate

Before packaging, merging, or delivering:

1. **Findings Ledger Blockers**:
   - Inspect `devflow/context/findings.md`.
   - No Finding of severity `P0` or `P1` in `open` or `fixed` status is permitted.
   - `fixed` still blocks release until reviewed and closed in `50-verify`.
2. **Pre-flight & Deployment Smoke Validation**:
   - Verify environment variables and configuration parameters.
   - Run production build or package smoke check (`npm run build` or `npm run test:package`).
   - Validate that clean state exists with no untracked experimental files.
3. **2-Stage Approval Separation**:
   - Consent to merge into `main` is strictly separate from consent to `git push` to remote or deploy.

### 1. Changelog & SemVer Version Bump

1. Calculate next version according to **Semantic Versioning (SemVer)**:
   - `Major`: Breaking architectural changes, removed public APIs
   - `Minor`: New backward-compatible features added
   - `Patch`: Bug fixes, optimizations, documentation
2. Append new release entry to `CHANGELOG.md` in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format (`Added`, `Changed`, `Fixed`, `Removed`, `Security`).

### 2. Conventional Commit & Git Merge

1. Stage all release and tracking files.
2. Commit with conventional format: `chore(release): release {version}` or `feat({scope}): {summary}`.
3. Squash-merge to base branch (`main`) with explicit user approval.

### 3. Archive Run Folder to Categorized History

1. Determine Category (`features`, `fixes`, `rollbacks`).
2. Move directory `devflow/context/current-run/` ➔ `devflow/history/{category}/{xxx-slug}/`.
3. Clean resolved findings (`closed`, `accepted`, `invalid`) from `devflow/context/findings.md` and append to the release notes.
4. Append entry to `devflow/history/HISTORY.md` linking to `history/{category}/{xxx-slug}/60-report.md`.

### 4. Update Workspace State

Set `devflow/context/current-stage.md` to:
- `Active Discovery ID`: `None`
- `Active Running ID`: `None (Idle)`
- `Current Stage`: `Idle (Ready for new run)`
- `Last Completed Run`: `{ID} ({YYYY-MM-DD})`
- `Last Updated`: `{YYYY-MM-DD}`