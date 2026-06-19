---
name: test-execution-and-coverage
description: Generate missing tests, run existing tests, and summarize coverage and failures. Use when implementation or verification needs explicit testing evidence beyond a general TDD reminder.
---

# Test Execution And Coverage

## Overview

This skill complements TDD by handling test generation, execution, and persistent reporting.

## When to Use

- During `/40-Implement` when tests need to be added
- During `/50-Verify` when the test suite must be run and summarized
- During `Debug` when a bug needs a reproduction test

## Process

### 1. Decide Test Mode

- generate tests for a target
- run the existing test suite
- inspect coverage when the project supports it

### 2. Use Project-Native Test Commands

- prefer the project's real framework and real commands
- highlight failed assertions clearly
- distinguish test generation from test execution

### 3. Save Reusable Report

Write reusable output under:

```text
.workspaces/reports/{date}-test-report-{slug}.md
```

Use `.agent/resources/schemas/test_report.template.md` when saving a reusable report.

### 4. Route Back

- `/50-Verify` when tests support formal verification
- `/40-Implement` when missing or failing tests require code changes
- `Debug` when failures need RCA

## Output

Return:

- what tests were generated or run
- command output summary
- pass/fail state
- gaps and risks
- recommended return stage
