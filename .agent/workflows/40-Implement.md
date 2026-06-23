---
description: Implement code in DevFlow 2.0 - execute one planned unit at a time with markdown-first implementation evidence.
---
# Phase 40: Implement Code

Implement the approved plan incrementally. Source code edits are allowed in this phase.

## Usage

```text
/40-Implement {ID}
```

## Markdown-First Contract

Use `40-implement.md` as the primary implementation artifact.
Before writing `40-implement.md`, read `artifact_language` from `.agent/resources/schemas/implement.template.md` and produce the artifact in that language.

Use controlled task-engine commands when progress state must be synchronized:

Before implementation, confirm the plan is approved in the stage artifacts. Track subtask progress, implementation notes, and completion evidence directly in `40-implement.md` and related stage markdown files.

## Process

### 1. Get Bearings

Read:

- `30-plan.md`
- `20-spec.md`
- `checklists/master-checklist.md` when present
- `checklists/implementation-checklist.md` when present
- referenced pattern files
- `10-define.md` when the intent needs a quick reminder

Confirm the current Git branch with `git branch --show-current` and use that branch as the user's chosen working branch. Do not create, switch, or checkout branches automatically.

Select one scoped unit of work at a time. Do not implement the whole plan as one blob.

### 2. Implement One Scoped Unit

Use the original coder discipline, adapted to 2.0:

- **STRICT MANDATE (กฎเหล็ก Unit Test)**: ต้องสร้าง/แก้ไข Unit Test ควบคู่กับการแก้ไขโค้ดเสมอ โดยห้ามแก้ไขเฉพาะไฟล์โค้ดหลัก (Production Code) โดยไม่แก้ไขหรือสร้างไฟล์เทสต์ควบคู่กัน
- read referenced pattern files before editing
- read the test decision from `30-plan.md`
- confirm assumptions, target files, and success criteria before editing
- make the smallest useful code change
- preserve project style
- run the planned verification
- record the result in `40-implement.md`
- update checklist item status, timestamps, and evidence links as work progresses

If tests are `Required`:

1. **TDD Cycle (RED)**: ออกแบบและเขียนตัวเทสต์ให้พังก่อน (หรือเขียนโครงสร้างเทสต์ที่คาดหวังผลลัพธ์ที่ถูกต้อง) ตามแนวทางของ [test-driven-development](file:///.agent/skills/test-driven-development/SKILL.md)
2. **GREEN**: เขียนโค้ดระบบจริงให้สอดคล้องเพื่อให้เทสต์ผ่าน
3. **REFACTOR**: ปรับปรุงโครงสร้างโค้ดโดยยังคงรันเทสต์ผ่านอย่างต่อเนื่อง

### 3. Recovery

Use the old recovery discipline when blocked:

- capture the blocker with evidence
- mark failure only when the current unit truly cannot continue
- recommend `Debug` when root cause analysis is needed
- return to Plan when the work no longer matches the plan

### 4. Finalize Implementation

When the scoped work is complete:

- summarize the completed units
- list changed files
- record verification performed
- record deviations, blockers, and manual checks
- follow the `artifact_language` configured in `implement.template.md`
- make sure checklist statuses match the actual state of the code and tests
- make sure `40-implement.md` is ready for Verify

## Output

Report:

- scoped units completed
- files changed
- verification commands run
- test decisions followed or changed, with reasons
- blocked items or manual checks
- next command: `/50-Verify {ID}`

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `/30-Plan`
- Next state: `/50-Verify` when scoped implementation is complete
- Common companion commands: `Debug` for blockers, `Preview` for local checks

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/implement.template.md`
- Related commands: `/30-Plan`, `Debug`, `Preview`, `/50-Verify`

## Next Workflow Recommendation

- **Primary**: `/50-Verify {ID}` when the planned work is complete.
- **Why**: Implementation needs independent verification before release or human acceptance.
- **Alternatives**:
  - `Debug "{blocker}"` - choose this when implementation is blocked by an unexplained failure.
  - `/30-Plan {ID}` - choose this when the plan is incomplete or no longer matches the work.
  - `Preview` - choose this when a local runtime or visual check is useful before formal verification.

## Wiki Update Recommendation

- **Needed**: `yes` when coding discovers a reusable implementation pattern, gotcha, or context optimization.
- **Scope**: `project` unless the discovery is about DevFlow itself.
- **Reason**: Coding findings are useful only when they are stable enough to help future tasks.
- **Suggested Command**: `Wiki project ingest .workspaces/specs/{ID}-*/40-implement.md`

