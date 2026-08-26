---
name: test
description: "[devflow] Test execution, missing test generation, and coverage analysis across unit, integration, and smoke test suites."
---

# Test-Driven Development, Generation & Execution

## Overview

This is the comprehensive testing master skill for Nexus-DevFlow. It drives development with tests (TDD), handles test generation, execution, coverage analysis, and bug reproduction. Tests are proof — "seems right" is not done.

```text
    RED                GREEN              REFACTOR
 Write a test    Write minimal code    Clean up the
 that fails  ──→  to make it pass  ──→  implementation  ──→  (repeat)
      │                  │                    │
      ▼                  ▼                    ▼
   Test FAILS        Test PASSES         Tests still PASS
```

## Usage & Sub-Commands

- `/test`                - Run all project test suites
- `/test [file/feature]` - Generate tests for a specific target
- `/test coverage`       - Show test coverage report
- `/test watch`          - Run tests in watch mode

---

## 1. The TDD Cycle

### Step 1: RED — Write a Failing Test
Write the test first. It must fail. A test that passes immediately proves nothing.

### Step 2: GREEN — Make It Pass
Write the minimum code to make the test pass. Avoid premature over-engineering.

### Step 3: REFACTOR — Clean Up
Improve code readability, naming, structure, and eliminate duplication while keeping tests green.

---

## 2. The Prove-It Pattern (Bug Reproduction)

When fixing any defect, **do not attempt a fix without proving the bug exists first**:

```text
Bug report arrives ➔ Write reproduction test (FAILS) ➔ Implement fix ➔ Test PASSES ➔ Guard regression
```

---

## 3. The Test Pyramid & Resource Sizes

| Level | Size | Target % | Scope & Characteristics |
| :--- | :--- | :--- | :--- |
| **Unit** | Small | ~80% | Pure logic, in-memory, single process, milliseconds each |
| **Integration** | Medium | ~15% | API boundaries, database interaction, component seams |
| **E2E** | Large | ~5% | Critical user journeys, full workflows, browser automation |

---

## 4. Key Testing Principles & Best Practices

1. **Test behavior, not implementation details**: Assert on output and state changes, not private method call sequences.
2. **DAMP over DRY in tests**: Descriptive and meaningful test setup beats overly abstract shared helpers.
3. **Arrange-Act-Assert**: Distinct setup, action, and verification phases in every test case.
4. **Prefer real implementations & fakes over heavy mocks**: Mock only at boundaries where real dependencies are slow or non-deterministic.
5. **One assertion concept per test**: Isolate test failure reasons clearly.

---

## 5. Browser Testing & Runtime Verification

For browser and UI features, unit tests alone are insufficient:
- **Console**: Zero errors and unhandled exceptions in production code.
- **Network**: Accurate status codes, payload shapes, and CORS handling.
- **DOM & Styles**: Verified layout rendering, accessibility tree, and responsive behaviors.

---

## 6. Test Generation & Persistent Execution Reports

When generating or logging test runs during `40-execute` or `50-verify`:
- Save summary reports to `devflow/reports/{date}-test-report-{slug}.md`
- Include: Target, Test Cases (Happy Path, Error, Edge Cases), Pass/Fail statistics, and gaps/risks.

---

## Relationship To DevFlow 2.0

- **Classification**: Companion command & Engineering standard
- **Mainline stages**: `30-plan` (TDD decisions), `40-execute` (TDD execution), `50-verify` (QA gate)
- **Handoff**: `50-verify`, `Debug`, `autopilot`