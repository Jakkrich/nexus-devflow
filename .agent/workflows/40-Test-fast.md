---
description: Fast Markdown Test - Plan, add, or run tests and save results in a fast task Markdown report.
---
# Phase 40-fast: Test Fast Markdown Task

Generate or run focused tests for a fast task and record evidence in Markdown.

## Usage

```text
/40-Test-fast {ID}-{slug} [target]
```

## Fast Mode Contract

- Prefer `.workspaces/specs/{ID}-{slug}-test.md` when a fast task exists.
- Use `.workspaces/reports/test-fast-<slug>.md` for standalone test investigations.
- Do not create or mutate JSON task artifacts.
- Use the target project's native test framework and commands.
- Keep test scope proportional to the behavior risk.

## Process

### 1. Load Context

Read:

- `spec.md`, `plan.md`, `task.md`, and `qa_report.md` when available
- Target files and existing nearby tests
- Project test scripts or documented commands

### 2. Choose Test Action

Choose one:

- Generate missing tests for planned behavior.
- Run existing tests for the changed area.
- Investigate coverage or gaps.
- Record why tests are not appropriate and what command/manual verification replaces them.

### 3. Execute

- For new tests, follow the project's existing test style.
- For test runs, use the smallest command that proves the behavior, then broaden if risk remains.
- Record failures with expected vs actual behavior.

### 4. Write `test.md`

Use this structure:

```markdown
---
id: "{ID}-{slug}"
workflow: "fast"
status: "<planned|passed|failed|blocked>"
source_workflow: "/40-Test-fast"
---

# Test: <Title>

## Scope

## Test Decisions

## Cases

## Commands And Results

## Failures

## Coverage Gaps

## Handoff
```

## Output

Report:

- Tests added or commands run
- Pass/fail results
- Coverage gaps
- Next command: `/32-Code-fast {ID}-{slug}` if fixes are needed, or `/33-Verify-fast {ID}-{slug}` when ready for QA

## Next Workflow Recommendation

- **Primary**: `/33-Verify-fast {ID}-{slug}` when tests pass.
- **Alternative**: `/32-Code-fast {ID}-{slug}` when tests fail and source fixes are needed.
