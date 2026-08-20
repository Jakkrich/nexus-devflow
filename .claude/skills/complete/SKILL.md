---
name: complete
description: "[Devflow] Fast-Track Complete stage in DevFlow (Blueprint Mode) - perform final safety pass, record release digest in spec.md, git merge, and close run without auto HTML generation."
argument-hint: "{running-id or workspace path}"
---

# Fast-Track: Complete (Blueprint Mode)

$ARGUMENTS

Final delivery, safety pass, and run closure stage in Fast-Track. Validates verification status, records the Release Digest into `spec.md`, performs git merge, and marks the run as completed **without auto-generating HTML reports**.

## Invocations & Aliases

- `/complete`: Complete current active run
- `/complete {running-id}`: Complete specified running ID
- `$complete`: Codex CLI invocation

## Fast-Track Mainline Workflow

```text
/spec ──▶ /implement ──▶ /check ──▶ /complete
```

## Behavior & Contract

When invoked:

### 1. Validate Delivery Pre-conditions
1. Identify active Running ID from `devflow/context/current-stage.md` or argument.
2. Read `devflow/runs/{RUNNING_ID}/spec.md`.
3. Confirm:
   - All checklist items in `## 3. Implementation Checklist` are marked `- [x]`.
   - `## 5. Verification Evidence` contains passing verification results.

### 2. Final Safety Pass & Changelog
1. Verify working directory hygiene (no accidental leftover test files or debug statements).
2. Update `CHANGELOG.md` with release summary under the current version if applicable.

### 3. Update Living Spec (`spec.md`)
Append or update `## 6. Release & Handoff` in `spec.md` in **Thai (`th`)**:

```markdown
## 6. Release & Handoff
- **Release Digest**: สรุปสิ่งที่ส่งมอบในรอบนี้
- **Git Branch**: `{branch_name}`
- **Merge Status**: Merged into `main` (Commit `{commit_hash}`)
- **Artifact Contract**: Fast-Track Single Living Spec completed.
```
Update header status in `spec.md`: `> **Status**: Completed`.

### 4. Policy on HTML Reports (Strict Rule)
> [!IMPORTANT]
> **No Auto-Generated HTML**: ห้ามสร้างไฟล์ `report.html` หรือ `60-report.html` แบบอัตโนมัติในขั้นตอนนี้โดยเด็ดขาด!
> หากผู้ใช้ต้องการดู HTML Dashboard สวยงาม ให้แจ้งผู้ใช้ว่าสามารถเรียกคำสั่งแยกได้: `/report:html`

### 5. Git Merge & Branch Cleanup
1. Commit all modified tracking files (including `spec.md` and `current-stage.md`).
2. Merge feature branch into target base branch (`main` / `master`).

### 6. Close Active Run
Update `devflow/context/current-stage.md`:
- `Active Running ID`: `None (Idle)`
- `Current Stage`: `Idle (Ready for new /spec, /feature, /fix, or /00-discover)`
- `Last Completed Run`: `{RUNNING_ID} ({YYYY-MM-DD})`
- `Last Updated`: `{YYYY-MM-DD}`

### 7. Output Completion Report
Report to the user:
- Run successfully completed and merged
- Living Spec path: `devflow/runs/{RUNNING_ID}/spec.md`
- Standalone HTML command tip: `/report:html` (if HTML view is desired)
- Workspace is now Idle and ready for the next task.
