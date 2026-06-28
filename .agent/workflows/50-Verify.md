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

## Process

### Loop Contract

Run verification as an evidence review loop, not as a single pass/fail guess.

- **Intent**: decide whether the implementation satisfies the spec and plan without introducing unacceptable regression risk.
- **Context**: read `20-spec.md`, `30-plan.md`, `40-implement.md`, checklist state, changed files, test decisions, and available command/manual evidence.
- **Action**: run or inspect validation, compare implementation evidence against the contract, review risk areas, and record findings by severity.
- **Observation**: use concrete evidence from test output, validation output, diff review, manual checks, skipped checks, and impact notes.
- **Adjustment**: if evidence is missing or failing, request targeted implementation follow-up, route to `Debug`, or return to `/40-Implement` with the exact evidence gap.
- **Stop Condition**: stop only with a clear verdict: pass, fail, or blocked; include the evidence, residual risks, and next route.
- **Handoff**: `50-verify.md` must tell `/60-Release` why the work is ready, or tell `/40-Implement` exactly what must change before verification resumes.

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
- compare claimed implementation evidence against the spec, plan, diff, and test decisions before forming a verdict
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
Use `review` for a two-axis standards/spec review, `diagnosing-bugs` when a failure needs root cause analysis, and `silent-failure-audit` when the risk is false-positive success.

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
- loop observation, adjustment, stop condition, and handoff notes
- test-decision alignment
- checklist alignment and any stale status corrections
- findings grouped by severity
- manual checks required
- recommended next action
- impact report summary or explicit note that no impact report was needed

### 5. Decision

**STRICT GATING (CRITICAL FAIL)**: หากพบว่าไม่มีการสร้าง/แก้ไข Unit Test ตามกฎ Unit Test Mandate หรือรันเทสต์แล้วไม่ผ่านทั้งหมด **บังคับให้ตัดสินเป็น FAIL ทันที**

If pass:

- route to `/60-Release` with release-ready evidence and residual risks

If fail:

- route back to `/40-Implement` with exact failed evidence, missing checks, or required changes

Use `Debug` when investigation is needed before implementation can resume.

## Output

Report:

- QA verdict
- key findings
- commands run
- validation status
- impact and rollback analysis when `50-verify-impact.md` is present
- next command: `/60-Release {ID}` if pass, or `/40-Implement {ID}` if fail

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `/40-Implement`
- Next state: `/60-Release` when evidence is sufficient
- Common companion commands: `Debug`, `Test`, `QA-Orchestrate`, `PR-Review`, `Agent`, `Wiki`; support skills: `review`, `diagnosing-bugs`, `tdd`, and `silent-failure-audit` for focused verification lanes

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/verify.template.md`
- `.agent/resources/schemas/verify-impact.template.md`
- Related commands: `/40-Implement`, `Debug`, `Test`, `QA-Orchestrate`, `PR-Review`, `Agent`, `/60-Release`

## Next Workflow Recommendation

- **Primary**: `/60-Release {ID}` when verification passes, or `/40-Implement {ID}` when verification fails.
- **Why**: Verification decides whether work moves forward to packaging or loops back for fixes.
- **Alternatives**:
  - `Debug` - choose this when the failure needs root cause analysis before more implementation.
  - `review` - choose this when changed work needs standards and spec review as separate axes.
  - `Wiki project ingest .workspaces/specs/{ID}-*/50-verify.md` - choose this when verification reveals reusable project knowledge.

## Wiki Update Recommendation

- **Needed**: `yes` when QA confirms a reusable lesson, regression pattern, manual check, or validation command.
- **Scope**: `project` unless QA reveals a DevFlow framework rule.
- **Reason**: Verified QA evidence is one of the safest sources for project wiki updates.
- **Suggested Command**: `Wiki project ingest .workspaces/specs/{ID}-*/50-verify.md`

