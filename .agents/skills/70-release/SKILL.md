---name: 70-release

description: "[Devflow] Release stage in DevFlow 2.0 - package verified work for delivery, git merge, PR, or deployment."
argument-hint: "{running-id or workspace path}"
---

# Phase 70: Release

$ARGUMENTS

Package approved work for delivery after the report stage has captured the final verified story. This stage turns report sign-off into release-ready execution and handoff.

## Usage

```text
70-release {running-id or workspace path}
```

Use this when:

- `60-report` is complete
- the work needs release execution or a release-facing handoff packet
- downstream stakeholders need delivery notes instead of raw implementation detail

## Markdown-First Contract

Write the primary stage artifact to:

```text
devflow/runs/{ID}-{slug}70-release.md
```

using:

```text
.agent/resources/schemas/release.template.md
```

Before writing `70-release.md`, read `artifact_language` from `release.template.md` and produce the artifact in that language.

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

Run release as a readiness-packaging loop, not as a celebratory summary.

- **Intent**: convert verified work into a clear release, PR, merge, deploy, or handoff packet without hiding unresolved risk.
- **Context**: read `50-verify.md`, `50-verify-impact.md` when present, `40-implement.md`, `20-spec.md`, checklist state, and any PR, deploy, merge, or handoff notes.
- **Action**: summarize delivered scope, user/system impact, readiness state, validation evidence, rollback or mitigation notes, and follow-up items.
- **Observation**: use concrete evidence such as verify verdict, failed or skipped checks, impact notes, residual risks, merge/deploy constraints, and checklist status.
- **Adjustment**: if release readiness becomes uncertain, return to `50-verify`; if fixes are required, return to `40-implement`; if context must transfer, use `handoff`.
- **Stop Condition**: stop when the release state is explicit, evidence supports readiness, residual risks and follow-ups are named, and the next delivery or reporting route is clear.
- **Handoff**: `70-release.md` must close the mainline run or tell the next reader what shipped, what did not ship, what evidence supports readiness, and what follow-ups remain.

### 0. Step 0 Safety Pass & Findings Ledger Gate

Before packaging, merging, or releasing:

1. **Findings Ledger Blockers**:
   - ตรวจสอบ `devflow/context/findings.md`
   - ต้องไม่มี Finding ระดับ P0 หรือ P1 ในสถานะ `open` หรือ `fixed` ค้างอยู่
   - สถานะ `fixed` ยังคงบล็อก release เสมอจนกว่าจะผ่านการ Review ใน `50-verify` เพื่อเลื่อนเป็น `closed`
2. **2-Stage Approval Separation**:
   - การขออนุมัติ Merge เข้า `main` หรือ `master` เป็นการอนุมัติขั้นแรก
   - **การ Push ไปยัง Remote หรือ Deploy จะต้องขออนุมัติแยกต่างหากอย่างชัดเจน (Merge approval DOES NOT equal Push approval)**
3. **Archive Resolved Findings**:
   - ย้ายรายการ Findings ที่ปิดแล้ว (`closed`, `accepted`, `invalid`) ไปบันทึกในเอกสาร Release และรีเซ็ต `findings.md` ให้สะอาด
4. **Append to Master History Ledger**:
   - บันทึก Entry ใหม่ลงใน `devflow/history/HISTORY.md` พร้อมระบุ Running ID, Title, วันที่, Git Commit Hash / Tag, สถานะ (`Released`), และลิงก์ไปยังรายงานสรุป `60-report.md`

### 1. Load Verified Context

Read:

- `60-report.md`
- `50-verify.md`
- `40-implement.md`
- `20-spec.md`
- `devflow/context/findings.md`
- any PR, deploy, merge, or handoff notes already captured

### 2. Package The Release Outcome

Summarize:

- what is being delivered
- what changed in user or system terms
- what state the work is in for PR, deploy, merge, or handoff
- resolved and archived findings
- what follow-up items remain

### 3. Write `70-release.md`

Keep the language understandable for someone who did not do the work.
Follow the `artifact_language` configured in `release.template.md`.

Prefer clear release-note style wording:

- what was added
- what changed
- what was fixed
- what is intentionally deferred
- archived findings summary

### 4. Confirm Readiness & 2-Stage Execution

If release readiness changes because unresolved issues are found:

- route back to `50-verify` or `40-implement`

Do not package unfinished work as release-ready through wording tricks.
When executing git operations:
1. Obtain explicit user confirmation before merging.
2. Obtain separate explicit user confirmation before running `git push` or deployment.

### 5. Manual Review Soft Gate

Before closing the mainline run, warn when release approval is still pending.
If release blockers, operator questions, or handoff approvals remain open:

- mark them visibly in `70-release.md`
- recommend human confirmation before closing the phase
- keep the mainline closeout as a soft recommendation only

## Output

Report:

- delivered scope
- release, PR, merge, deploy, or handoff state
- follow-up items
- recommended next step

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `60-report`
- Next state: End of the mainline run when release packaging or handoff is complete
- Common companion commands: `Commit`, `PR`, `Deploy`, `Changelog`, `Merge`, `Wiki`, `overview`
- Support skills: `resolving-merge-conflicts`, `handoff`, and `setup-pre-commit` when release packaging needs conflict resolution, transfer notes, or local quality gates

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/release.template.md`
- Related commands: `60-report`, `Commit`, `PR`, `Deploy`, `Changelog`, `Merge`, `Wiki`, `overview`

## Next Workflow Recommendation

- **Primary**: End of Timeline flow (or run `/overview` to sync living project context)
- **Why**: The report is already complete, and this phase is the final release-facing execution step.
- **Alternatives**:
  - `overview` - choose this to immediately sync newly shipped capabilities into `devflow/context/project-overview.md`.
  - `60-report` - choose this when the release package diverges from the approved report and the summary must be refreshed first.
  - `50-verify` - choose this when release readiness becomes uncertain.
  - `40-implement` - choose this when additional fixes are needed before release can proceed.
  - `handoff` - choose this when release-ready context must move to another session, agent, or stakeholder packet.

## Nexus Event

- Use `Commit`, `PR`, `Deploy`, `Merge`, `Changelog`, or `overview` when release execution still needs a concrete lane.
- Return to `60-report` when release notes, scope, or handoff wording diverge from the approved summary.
- Return to `50-verify` or `40-implement` when release readiness changes because unresolved issues are discovered.

