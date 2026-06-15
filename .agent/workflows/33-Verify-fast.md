---
description: Fast Markdown Verify - Review implementation quality and record QA evidence in Markdown without JSON validation.
---
# Phase 33-fast: Verify Fast Markdown Task

Review implementation quality, run target project verification, and produce a Markdown QA report.

## Usage

```text
/33-Verify-fast {ID}-{slug}
```

## Fast Mode Contract

- Read `.workspaces/specs/{ID}-{slug}-spec.md`, `{ID}-{slug}-plan.md`, and `{ID}-{slug}-task.md`.
- Write `.workspaces/specs/{ID}-{slug}-qa_report.md`.
- Do not create or mutate JSON task artifacts.
- Do not require PRP CLI validation.
- Prefer target project verification commands first.
- Record pass/fail, evidence, gaps, and next action in Markdown.

## Process

### 1. Gather Context

Read:

- `spec.md`
- `plan.md`
- `task.md`
- Git diff or changed files
- Test output, build output, screenshots, or manual check notes when available

### 2. Run Verification

Use the plan's verification commands where available. Otherwise inspect the target project for likely commands such as lint, test, typecheck, build, or targeted smoke tests.

Review:

- Acceptance criteria coverage
- Correctness
- Readability and maintainability
- Architecture fit
- Security and data handling risk
- Performance risk
- Test decision alignment (including compliance with **Test-Design First & Schema-Driven Design** rules for `Required` subtasks)
- Manual verification gaps

### 3. Write `qa_report.md` (Save directly as `.workspaces/specs/{ID}-{slug}-qa_report.md`)

Use this structure:

```markdown
---
id: "{ID}-{slug}"
doc_type: "qa_report"
workflow: "fast"
status: "<pass|fail>"
source_workflow: "/33-Verify-fast"
---

# QA Report: <Title>

## Verdict

- Status:
- Summary:

## Evidence

| Check | Command Or Method | Result | Notes |
| --- | --- | --- | --- |

## Acceptance Criteria Review

- [ ] Criterion:

## Findings

### High

### Medium

### Low

## Residual Risks

## Handoff

- Next command:
```

Do not leave placeholder brackets, `TODO`, or `TBD`. If a section has no findings, write `None`.

### 4. Route Next Step

If pass:

- Recommend `/50-Commit-fast {ID}-{slug}` or human review when needed.

If fail:

- Record focused fix instructions.
- Recommend `/32-Code-fast {ID}-{slug}`.

## Output

Report:

- QA verdict
- Key findings
- Commands run
- Manual checks or gaps
- Next command: `/50-Commit-fast {ID}-{slug}` if pass, or `/32-Code-fast {ID}-{slug}` if fail

## Next Workflow Recommendation

- **Primary**: `/50-Commit-fast {ID}-{slug}` when QA passes.
- **Alternative**: `/32-Code-fast {ID}-{slug}` when QA fails.
