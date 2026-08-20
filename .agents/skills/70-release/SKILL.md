---
name: 70-release
description: "[Devflow] Release stage in DevFlow 2.0 - package verified work for delivery, archive run to categorized history, git merge, PR, or deployment."
argument-hint: "{running-id or workspace path}"
---

# Phase 70: Release

$ARGUMENTS

Package approved work for delivery after the report stage has captured the final verified story. Archives the active run from `devflow/context/current-run/` to `devflow/history/{features|fixes|rollbacks}/{xxx-slug}/`, updates `HISTORY.md`, performs git merge, and closes the run.

## Usage

```text
70-release {id or workspace path}
```

## Markdown-First Contract

Write the primary stage artifact to:

```text
devflow/context/current-run/70-release.md
```

using:

```text
.agent/resources/schemas/release.template.md
```

## Process & Quality Gates

### 0. Step 0 Safety Pass & Findings Ledger Gate

Before packaging, merging, or releasing:

1. **Findings Ledger Blockers**:
   - Inspect `devflow/context/findings.md`.
   - No Finding of severity `P0` or `P1` in `open` or `fixed` status is permitted.
   - `fixed` still blocks release until reviewed and closed in `50-verify`.
2. **2-Stage Approval Separation**:
   - Consent to merge into `main` is strictly separate from consent to `git push` to remote or deploy.
3. **Archive Resolved Findings**:
   - Move resolved findings (`closed`, `accepted`, `invalid`) into release archive notes and clean `findings.md`.
4. **Archive Run Folder to Categorized History**:
   - Determine Category (`features`, `fixes`, `rollbacks`).
   - Move directory `devflow/context/current-run/` (or `devflow/runs/{xxx-slug}/`) ➔ `devflow/history/{category}/{xxx-slug}/`.
5. **Append to Master History Ledger**:
   - Append entry to `devflow/history/HISTORY.md` linking to `history/{category}/{xxx-slug}/60-report.md`.
6. **Update Workspace State**:
   - Set `devflow/context/current-stage.md` to `Idle`.
