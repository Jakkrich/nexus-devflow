---
name: tdd
description: Test-driven development. Use inside /30-Plan, /40-Implement, or /50-Verify when behavior changes should be built or fixed test-first.
---

# Test-Driven Development

Use this support skill when the active DevFlow stage needs test-first behavior change.

Tests should verify behavior through public interfaces, not implementation details. A good test reads like a specification and survives refactors.

## DevFlow Placement

- `/30-Plan`: decide which subtasks require automated tests and name the behavior cases.
- `/40-Implement`: run red-green-refactor one behavior at a time.
- `/50-Verify`: confirm regression coverage and behavior evidence.

## Workflow

### 1. Plan Behavior

Before code changes:

- identify the public interface or test seam
- list behaviors, not implementation steps
- prioritize critical paths and tricky logic
- use `codebase-design` when the test seam is awkward

Record the test decision in the owning stage artifact or checklist.

### 2. Tracer Bullet

Write one test for one behavior.

```text
RED: write one failing behavior test
GREEN: write the minimum code to pass
```

This proves the path works end-to-end.

### 3. Incremental Loop

For each remaining behavior:

- write the next failing test
- implement only enough code to pass it
- avoid speculative features
- run the relevant test command

### 4. Refactor

Refactor only while green.

Look for:

- duplication
- long methods
- shallow modules
- misplaced logic
- primitive obsession
- existing code revealed as problematic

Run tests after each refactor step.

## Test Quality Rules

- Test observable behavior.
- Use public interfaces.
- Mock system boundaries, not internal collaborators.
- Prefer integration-style tests where practical.
- One logical assertion per test.
- A test that breaks on harmless refactor is probably testing implementation.

Use `tests.md`, `mocking.md`, and `refactoring.md` for reference.
