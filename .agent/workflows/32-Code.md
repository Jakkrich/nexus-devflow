---
description: Implement Code - Execute one planned subtask at a time with validation-first progress tracking.
---
# Phase 32: Implement Code

Implement the approved plan incrementally. Source code edits are allowed in this phase.

## Usage

```text
/32-Code {ID}
```

## Script-First JSON Rule

Do not edit progress JSON manually. Use:

```powershell
npm run agent -- update {ID} --status in_progress
npm run agent -- log {ID} "Started Phase 32: Coding" --phase coding
npm run agent -- plan:set-subtask-status {ID} {SUBTASK_ID} in_progress
npm run agent -- plan:set-subtask-status {ID} {SUBTASK_ID} completed
npm run agent -- log {ID} "Implemented {SUBTASK_ID}: {summary}" --phase coding --ref {SUBTASK_ID}
npm run agent -- validate {ID}
```

If artifact validation fails:

```powershell
npm run agent -- json:repair {ID} implementation_plan
npm run agent -- validate {ID}
```

**MANDATORY RULE:** If you create temporary script files (e.g., `.ps1`, `.sh`) to execute multiple CLI commands in batch, you MUST save them inside the task workspace directory (e.g., `.workspaces/specs/{ID}-*/scratch/` or `.workspaces/specs/{ID}-*/`) and NEVER in the project's central `scripts/` directory.

## Process

### 1. Get Bearings

Read:

- `spec.md`
- `requirements.json`
- `context.json`
- `implementation_plan.json`

Select the first `pending` or `in_progress` subtask. Work on only one subtask at a time.

### 2. Implement One Subtask

Use the `coder` pattern:

- Read referenced pattern files before editing.
- Make the smallest useful code change.
- Preserve project style.
- Run the subtask verification.
- Update subtask status through `plan:set-subtask-status`.
- Log the result.

### 3. Recovery

Use the `coder_recovery` pattern when blocked:

- Mark the subtask `failed` only when it truly cannot continue.
- Log the blocker with evidence.
- Recommend `/20-Debug {ID}` or `/90-Agent prp-core-debugger {target}` if root cause analysis is needed.

### 4. Finalize Coding

When all subtasks are completed:

```powershell
npm run agent -- update {ID} --status ai_review
npm run agent -- log {ID} "Phase 32 completed successfully" --phase coding --complete
npm run agent -- validate {ID}
```

## Output

Report:

- Subtasks completed
- Files changed
- Verification commands run
- Any blocked or manual checks
- Next command: `/33-Verify {ID}`

## Next Workflow Recommendation

- **Primary**: `/33-Verify {ID}` when the planned subtask or full implementation is complete.
- **Why**: Implementation needs independent QA before human acceptance or commit.
- **Alternatives**:
  - `/20-Debug "{blocker}"` - choose this when implementation is blocked by an unexplained failure.
  - `/90-Agent prp-core-debugger {target}` - choose this for focused root-cause help inside an existing task.
  - `/31-Plan {ID}` - choose this when the implementation plan is incomplete or no longer matches the work.

## Wiki Update Recommendation

- **Needed**: `yes` when coding discovers a reusable implementation pattern, gotcha, or context optimization.
- **Scope**: `project` unless the discovery is about DevFlow itself.
- **Reason**: Coding findings are useful only when they are stable enough to help future tasks.
- **Suggested Command**: `/59-Wiki project ingest .workspaces/specs/{ID}-*/task_logs.json`
