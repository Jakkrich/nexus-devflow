---
name: 40-execute
description: "[devflow][D] Execute stage in DevFlow 2.0 - execute planned tasks incrementally with evidence and unit tests."
---
# Phase 40: Execute Code

Implement and execute the approved plan incrementally. Source code edits are allowed in this phase.

## Usage

```text
40-execute {ID}
```

## Markdown-First Contract

Use `40-execute.md` as the primary execution artifact.
Before writing `40-execute.md`, produce the artifact in Thai (`th`).

Before execution, confirm the plan is approved in the stage artifacts. Track subtask progress, execution notes, and completion evidence directly in `40-execute.md` and related stage markdown files.

## Required Section Content

Before completing any generated artifact:

- preserve every heading required by the selected template
- write concrete information under every heading
- when no information exists or the section does not apply, write exactly `-`
- never leave a heading immediately followed by another heading with no body content
- remove template placeholders from the final artifact
- do not invent facts merely to avoid using `-`
- re-read the saved artifact and verify every heading satisfies this rule

## Process

### Loop Contract

Run execution as scoped execution loops, one unit at a time.

- **Intent**: complete the selected planned unit while preserving the spec, plan, and repository conventions.
- **Context**: read `30-plan.md`, `20-spec.md`, relevant checklist items, target files, pattern files, and test decisions before editing.
- **Action**: make the smallest useful change for the current unit, update or create tests when required, run the planned verification, and record the result.
- **Observation**: inspect concrete evidence from diffs, command output, tests, manual checks, and checklist status before claiming progress.
- **Adjustment**: if evidence does not match intent, fix within the current unit, capture the blocker, use `Debug`, or return to `30-plan` or `20-spec` when the work no longer matches the contract.
- **Stop Condition**: stop the unit when the planned change is complete, verification evidence is recorded, deviations are explained, and the next unit or handoff is clear.
- **Handoff**: `40-execute.md` must tell `50-verify` what changed, why it changed, which checks ran, what failed or was skipped, and what residual risk remains.

### 1. Get Bearings

Read:

- `30-plan.md`
- `20-spec.md`
- `checklists/implementation-checklist.md` when present
- referenced pattern files
- `10-define.md` when the intent needs a quick reminder

Confirm the current Git branch with `git branch --show-current` and use that branch as the user's chosen working branch. Do not create, switch, or checkout branches automatically.

Select one scoped unit of work at a time. Do not implement the whole plan as one blob.

### 2. Execute One Scoped Unit (Strict TDD Red-Green-Refactor)

Use the strict coder discipline:

- **STRICT MANDATE (กฎเหล็ก Unit Test & TDD)**: สำหรับทุกงานที่มีการแก้ไข logic การทำงาน ต้องสร้างหรือแก้ไข Unit Test ควบคู่กับการแก้ไขโค้ดเสมอ โดยห้ามเขียนเฉพาะ Production Code โดยไม่มีเทสต์
- **🔴 RED (Test First)**: ออกแบบและเขียน Test Case ในไฟล์เทสต์ก่อนเสมอ แล้วรันคำสั่งเทสต์เพื่อพิสูจน์ว่า **Test ล้มเหลว (FAIL)** ตามที่คาดหวัง
- **🟢 GREEN (Minimal Implementation)**: เขียน Production Code เท่าที่จำเป็นเพื่อให้เทสต์ผ่าน แล้วรันคำสั่งเทสต์เพื่อพิสูจน์ว่า **Test ผ่าน 100% (PASS)**
- **🔵 REFACTOR (Clean Code)**: ปรับปรุงโครงสร้างโค้ดให้อ่านง่าย กำจัดความซ้ำซ้อน (DRY) โดยที่เทสต์ยังคงเขียว 100%
- **Code Deletion / Reversion Rule**: หากเผลอเขียน Production Code ก่อนมีเทสต์ ให้ Revert หรือลบโค้ดส่วนนั้น แล้วเริ่มวงจร RED ก่อนเสมอ
- start each scoped unit by naming its intent, context, expected observation, adjustment route, and stop condition
- read referenced pattern files before editing
- read the test decision from `30-plan.md`
- confirm assumptions, target files, and success criteria before editing
- preserve project style
- run the planned verification and capture concrete terminal outputs
- record observation, adjustment, stop condition status, and the result in `40-execute.md`
- update checklist item status, timestamps, and evidence links as work progresses

### 3. Recovery

Use the old recovery discipline when blocked:

- capture the blocker with evidence
- mark failure only when the current unit truly cannot continue
- recommend `Debug` when root cause analysis is needed
- return to Plan when the work no longer matches the plan

Use `tdd` for behavior-change implementation loops, `diagnosing-bugs` when a tight repro is needed before a fix, and `codebase-design` when implementation exposes an awkward seam or shallow module.

### 4. Finalize Execution

When the scoped work is complete:

- summarize the completed units
- list changed files
- record verification performed
- record loop evidence for each completed unit: intent, observation, adjustment, and stop condition
- record deviations, blockers, and manual checks
- make sure checklist statuses match the actual state of the code and tests
- make sure `40-execute.md` is ready for Verify

### 5. Manual Review Soft Gate

If the plan was not clearly approved, warn that execution proceeded under review risk.
When finishing `40-execute.md`:

- record any deviation from the approved plan explicitly
- set reviewer expectations before `50-verify`
- keep `50-verify` as the next soft recommendation rather than an unconditional jump

## Output

Report:

- scoped units completed
- files changed
- verification commands run
- test decisions followed or changed, with reasons
- loop evidence and handoff notes for Verify
- blocked items or manual checks
- next command: `50-verify {ID}`

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `30-plan`
- Next state: `50-verify` when scoped execution is complete
- Common companion commands: `Debug` for blockers, `Preview` for local checks; support skills: `tdd`, `diagnosing-bugs`, and `codebase-design` for behavior changes, root-cause loops, and implementation-time design pressure

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- Related commands: `30-plan`, `Debug`, `Preview`, `50-verify`

## Next Workflow Recommendation

- **Primary**: `50-verify {ID}` when the planned work is complete.
- **Why**: Implementation needs independent verification before release or human acceptance.
- **Alternatives**:
  - `Debug "{blocker}"` - choose this when execution is blocked by an unexplained failure.
  - `30-plan {ID}` - choose this when the plan is incomplete or no longer matches the work.
  - `Preview` - choose this when a local runtime or visual check is useful before formal verification.
  - `codebase-design` - choose this when the implementation cannot be tested cleanly because the module shape is wrong.

## Nexus Event

- Use `Debug` when the conversation reveals an unexplained blocker, flaky behavior, or root-cause gap.
- Use `Preview` when a runtime, UI, or local interaction check would reduce verification risk.
- Return to `30-plan` when execution drift shows the plan no longer matches reality.

## Wiki Update Recommendation

- **Needed**: `yes` when coding discovers a reusable implementation pattern, gotcha, or context optimization.
- **Scope**: `project` unless the discovery is about DevFlow itself.
- **Reason**: Coding findings are useful only when they are stable enough to help future tasks.
- **Suggested Command**: `Wiki project ingest devflow/runs/{ID}-*40-execute.md`