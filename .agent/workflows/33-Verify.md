---
description: Verify Quality - Perform senior QA review and decide pass/fail with artifact validation.
---
# Phase 33: Verify Quality

Review implementation quality, run validation, produce a QA report, and route the task forward or back to coding.

## Usage

```text
/33-Verify {ID}
```

## Script-First JSON Rule

Use commands for status and validation:

```powershell
npm run agent -- log {ID} "Started Phase 33: Verification" --phase validation
npm run agent -- validate {ID}
npm run agent -- update {ID} --status human_review
npm run agent -- update {ID} --status in_progress
npm run agent -- log {ID} "Phase 33 completed" --phase validation --complete
```

If JSON is invalid, repair it before doing QA:

```powershell
npm run agent -- repair {ID}
npm run agent -- validate {ID}
```

## Process

### 1. Context Gathering

Read:

- `spec.md`
- `requirements.json`
- `implementation_plan.json`
- `task_logs.json`
- Changed files and test output

### 2. Artifact Gate

Run `npm run agent -- validate {ID}` first. If it fails, repair artifacts and re-run validation.

### 3. QA Review

Use the `qa_reviewer` pattern:

- Correctness
- Readability
- Architecture
- Security
- Performance
- Test coverage
- Manual verification gaps

Run project validation commands when available: lint, tests, typecheck, build, or targeted command from the plan.

### 4. QA Report

Create or update `qa_report.md` in the task directory. Include:
**MANDATORY:** Before creating or updating `qa_report.md`, inspect `.agent/resources/schemas/qa_report.template.md` and keep the report aligned to its required headings and tables. Before reporting completion, run `npm run agent -- markdown:validate {qa_report_path} qa_report.template.md` and replace any placeholder/template text with concrete command output, manual checks, failures, screenshots, and residual risks.

- Verdict: pass or fail
- Evidence: commands and results
- Findings grouped by severity
- Manual checks required
- Recommended next action

### 5. Decision

If pass:

```powershell
npm run agent -- update {ID} --status human_review
npm run agent -- log {ID} "QA passed; ready for human review" --phase validation --complete
```

If fail:

```powershell
npm run agent -- update {ID} --status in_progress
npm run agent -- log {ID} "QA failed; returning to coding" --phase validation --complete
```

Use the `qa_fixer` pattern to turn findings into focused instructions for `/32-Code`.

Always finish with:

```powershell
npm run agent -- validate {ID}
```

## Output

Report:

- QA verdict
- Key findings
- Commands run
- Artifact validation status
- Next command: `/34-Human Approve {ID}` if pass, or `/32-Code {ID}` if fail

## Next Workflow Recommendation

- **Primary**: `/34-Human Approve {ID}` when QA passes, or `/32-Code {ID}` when QA fails.
- **Why**: Verification decides whether work moves to human acceptance or loops back to coding.
- **Alternatives**:
  - `/54-Insight {ID}` - choose this after a pass or meaningful failure to preserve lessons.
  - `/59-Wiki project ingest .workspaces/specs/{ID}-*/qa_report.md` - choose this when QA reveals reusable project knowledge.
  - `/55-PR-Review {target}` - choose this when a PR-level risk review is needed before merge.

## Wiki Update Recommendation

- **Needed**: `yes` when QA confirms a reusable lesson, regression pattern, manual check, or validation command.
- **Scope**: `project` unless QA reveals a DevFlow framework rule.
- **Reason**: Verified QA evidence is one of the safest sources for project wiki updates.
- **Suggested Command**: `/59-Wiki project ingest .workspaces/specs/{ID}-*/qa_report.md`
