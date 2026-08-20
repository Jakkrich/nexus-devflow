---
name: complete
description: "[Devflow] Fast-Track Complete stage in DevFlow (Blueprint Mode) - final safety pass, archive living spec into categorized history, reset stub, git merge, and close run."
argument-hint: "{running-id or workspace path}"
---

# Fast-Track: Complete (Blueprint Mode)

$ARGUMENTS

Final delivery, safety pass, archive, and run closure stage in Fast-Track. Validates verification status, archives `devflow/context/current-feature.md` to `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`, resets the stub, performs git merge, and closes the run **without auto-generating HTML reports**.

## Invocations & Aliases

- `/complete`: Complete current active run
- `/complete {id}`: Complete specified ID
- `$complete`: Codex CLI invocation

## Fast-Track Mainline Workflow

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

## Behavior & Contract

When invoked:

### 1. Validate Delivery Pre-conditions
1. Identify active Running ID from `devflow/context/current-stage.md` or `devflow/context/current-feature.md`.
2. Read `devflow/context/current-feature.md`.
3. Confirm:
   - File contains an active spec (not the idle stub `_Nothing in progress._`).
   - All checklist items in `## 3. Implementation Checklist` are marked `- [x]`.
   - `## 5. Verification Evidence` contains passing verification results and empirical command outputs.

### 2. Final Safety Pass & Findings Check
1. Verify working directory hygiene (no accidental leftover test files or debug statements).
2. Inspect `devflow/context/findings.md`:
   - No `P0` or `P1` finding is in `open` or `fixed` status (`fixed` requires re-audit).
   - Only `closed`, `accepted` (user waived), or `invalid` findings are permitted for completion.

### 3. Update Living Spec & Archive to Categorized History
1. Append `## 6. Release & Handoff` in `current-feature.md` in **Thai (`th`)**:
   ```markdown
   ## 6. Release & Handoff
   - **Release Digest**: สรุปสิ่งที่ส่งมอบในรอบนี้
   - **Git Branch**: `{branch_name}`
   - **Merge Status**: Merged into `main` (Commit `{commit_hash}`)
   - **Archive Date**: {YYYY-MM-DD}
   ```
2. Determine Category:
   - If spec has `Category: Fix` or `Type: Fix` ➔ `fixes`
   - If spec has `Category: Rollback` or `Type: Rollback` ➔ `rollbacks`
   - Otherwise ➔ `features`
3. Archive `devflow/context/current-feature.md` ➔ `devflow/history/{category}/{xxx-slug}.md`.
4. If `findings.md` contains resolved entries (`closed`, `accepted`, `invalid`), append a `## Resolved Findings` section to the archive file and clean those resolved entries from `findings.md`.
5. **Reset Living Spec Stub**: Reset `devflow/context/current-feature.md` to:
   ```markdown
   # Current Feature

   _Nothing in progress. Run /feature, /fix, or /rollback to start._
   ```

### 4. Update Master Ledger (`HISTORY.md`)
Append a new row to `devflow/history/HISTORY.md` under `## 📜 Master Release Log`:
```markdown
| {YYYY-MM-DD} | `{ID}` | {Category} | {Title} | `{commit_hash}` | `Released` | [`{xxx-slug}.md`]({category}/{xxx-slug}.md) |
```

### 5. Policy on HTML Reports (Strict Rule)
> [!IMPORTANT]
> **No Auto-Generated HTML**: ห้ามสร้างไฟล์ `report.html` หรือ `60-report.html` แบบอัตโนมัติในขั้นตอนนี้โดยเด็ดขาด!
> หากผู้ใช้ต้องการดู HTML Dashboard สวยงาม ให้แจ้งผู้ใช้ว่าสามารถเรียกคำสั่งแยกได้: `/report:html`

### 6. Git Merge & Branch Cleanup
1. Commit all modified tracking files.
2. Squash-merge feature branch into target base branch (`main` / `master`) with explicit user approval.

### 7. Close Active Run
Update `devflow/context/current-stage.md`:
- `Active Discovery ID`: `None`
- `Active Running ID`: `None (Idle)`
- `Current Stage`: `Idle (Ready for new /feature, /fix, or /00-discover)`
- `Living Spec`: `None`
- `Last Completed Run`: `{ID} ({YYYY-MM-DD})`
- `Last Updated`: `{YYYY-MM-DD}`

### 8. Output Completion Report
Report to the user:
- Run successfully completed and merged
- Archived path: `devflow/history/{category}/{xxx-slug}.md`
- Standalone HTML command tip: `/report:html` (if HTML view is desired)
- Workspace is now Idle and ready for the next task.
