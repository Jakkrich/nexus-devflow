---
description: Verify quality in DevFlow 2.0 - perform senior QA review, record evidence, and decide pass or return-to-implement.
---
# Phase 50: Verify Quality

Review implementation quality, run validation, produce a verification report, and route the task forward or back to implementation.

## Usage

```text
/50-Verify {ID}
```

## Markdown-First Contract

Use `50-verify.md` as the primary verification artifact.
Use `50-verify-impact.md` as an optional companion artifact when the run changes behavior, touches core logic, crosses integration boundaries, or needs explicit rollback and client impact analysis.
Before writing either verification artifact, read `artifact_language` from the matching template and produce the markdown output in that language.

Use these commands only to keep workflow status aligned with the task engine:

Record verification start, results, open issues, and approval direction directly in `50-verify.md`. Use the stage markdown itself to indicate whether the work is ready for human review or needs to return to implementation.
If an impact report is needed, create it in the same task directory and summarize its conclusions from `50-verify.md`.
Keep the verification checklist aligned with the same soft-gate state so downstream report and release stages can see the current approval direction without re-reading the full verify narrative.

## Process

### 1. Context Gathering

Read:

- `20-spec.md`
- `30-plan.md`
- `40-implement.md`
- `checklists/verification-checklist.md` when present
- changed files
- test output, command output, screenshots, or manual-check evidence

### 2. Artifact Gate

Run the necessary validation for the current state before doing the full review.

### 3. QA Review

Use the old QA reviewer discipline, adapted to 2.0:

- **STRICT MANDATE (กฎเหล็ก Unit Test)**: ตรวจสอบว่าโค้ดใหม่หรือการแก้ไข Bug (ที่มี behavior change) มีการสร้างหรืออัปเดต Unit Test คู่กันมาด้วยหรือไม่ หากไม่มีให้ทำเครื่องหมายว่า FAIL ทันที
- correctness
- readability
- architecture (DIP, SRP, Loose Coupling)
- security
- performance
- test coverage (และตรวจสอบว่าไม่มีการ skip หรือ disable เทสต์)
- test decision alignment
- manual verification gaps
- assumptions and scope discipline

Run project validation commands when available: lint, tests, typecheck, build, or targeted commands from the plan.

For test-decision alignment, verify that planned verification was actually executed and that the evidence matches the claimed result.

### 4. Verification Report

Create or update `50-verify.md` in the task directory.
Create or update `50-verify-impact.md` when the run includes behavior changes, client-facing flow changes, integration risk, or rollback considerations worth reviewing separately.

Base the structure on:

```text
.agent/resources/schemas/verify.template.md
.agent/resources/schemas/verify-impact.template.md
```

Before reporting completion, validate the markdown and replace all placeholders with concrete command output, manual checks, failures, screenshots, and residual risks.
Follow the `artifact_language` configured in the selected template for both `50-verify.md` and `50-verify-impact.md`.

Include:

- verdict: pass or fail
- evidence: commands and results
- test-decision alignment
- checklist alignment and any stale status corrections
- approval gate summary copied into the verification checklist when relevant
- findings grouped by severity
- manual checks required
- recommended next action
- impact report summary or explicit note that no impact report was needed

### 5. Decision

**STRICT GATING (CRITICAL FAIL)**: หากพบว่าไม่มีการสร้าง/แก้ไข Unit Test ตามกฎ Unit Test Mandate หรือรันเทสต์แล้วไม่ผ่านทั้งหมด **บังคับให้ตัดสินเป็น FAIL ทันที**

If pass:

- route to `/60-Report`

If fail:

- route back to `/40-Implement`

Use `Debug` when investigation is needed before implementation can resume.

### 6. Manual Review Soft Gate

Verification is the main human review checkpoint for implemented work.
If the evidence is incomplete or `Approval Status` remains pending:

- warn that release is not yet ready for confident handoff
- recommend additional review or a return to `/40-Implement`
- keep `/60-Report` as a soft recommendation only

## Output

Report:

- QA verdict
- key findings
- commands run
- validation status
- impact and rollback analysis when `50-verify-impact.md` is present
- next command: `/60-Report {ID}` if pass, or `/40-Implement {ID}` if fail

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `/40-Implement`
- Next state: `/60-Report` when evidence is sufficient
- Common companion commands: `Debug`, `Test`, `QA-Orchestrate`, `PR-Review`, `Agent`, `Wiki`

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/verify.template.md`
- `.agent/resources/schemas/verify-impact.template.md`
- Related commands: `/40-Implement`, `Debug`, `Test`, `QA-Orchestrate`, `PR-Review`, `Agent`, `/60-Report`

## Next Workflow Recommendation

- **Primary**: `/60-Report {ID}` when verification passes, or `/40-Implement {ID}` when verification fails.
- **Why**: Verification decides whether work moves forward to the final report stage or loops back for fixes.
- **Alternatives**:
  - `Debug` - choose this when the failure needs root cause analysis before more implementation.
  - `Wiki project ingest .workspaces/specs/{ID}-*/50-verify.md` - choose this when verification reveals reusable project knowledge.

## Nexus Event

- Use `Debug` when failures need deeper investigation before rework.
- Use `PR-Review`, `QA-Orchestrate`, or `Agent code-reviewer` when a narrower review lane would change the verification decision quality.
- Use `Wiki` when verified findings should become reusable project knowledge before the run continues.

## Wiki Update Recommendation

- **Needed**: `yes` when QA confirms a reusable lesson, regression pattern, manual check, or validation command.
- **Scope**: `project` unless QA reveals a DevFlow framework rule.
- **Reason**: Verified QA evidence is one of the safest sources for project wiki updates.
- **Suggested Command**: `Wiki project ingest .workspaces/specs/{ID}-*/50-verify.md`

