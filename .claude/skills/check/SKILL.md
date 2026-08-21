---
name: check
description: "[Devflow] Fast-Track Check stage in DevFlow (Blueprint Mode) - perform senior QA review, run multi-lane verification, and record evidence in current-feature.md in context."
argument-hint: "{running-id or workspace path}"
---

# Fast-Track: Check (Blueprint Mode)

$ARGUMENTS

Quality assurance and multi-lane verification stage in Fast-Track. Validates implementation against Acceptance Criteria, executes Scrutinize QA & Security checks, runs test suites, checks for regressions, and records evidence in the Single Living Spec (`devflow/context/current-feature.md`).

## Invocations & Aliases

- `/check`: Run verification on current active run
- `/check {id}`: Run verification on specified ID
- `$check`: Codex CLI invocation

## Fast-Track Mainline Workflow

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

## Behavior & Contract

When invoked:

### 1. Load Active Context
1. Identify active Running ID from `devflow/context/current-stage.md` or `devflow/context/current-feature.md`.
2. Read `devflow/context/current-feature.md`.
3. Locate `## 1. Specification & Scope` (Acceptance Criteria) and `## 3. Implementation Checklist`.

### 2. Multi-lane Verification & Scrutinize QA

Execute verification gates across all lanes:

1. **Lane 1: Typecheck & Static Code Quality**:
   - Run typecheck and linting (e.g. `npm run typecheck`, `npm run lint`).
   - Confirm 0 type errors, 0 lint warnings.
2. **Lane 2: Automated Test Suites (TDD Gate)**:
   - Run automated unit and integration tests (e.g. `npm test`).
   - Confirm 100% tests pass with no disabled/skipped tests.
3. **Lane 3: Scrutinize & Edge Cases Review**:
   - **Boundary Conditions**: Check empty collections, 0/1 limits, off-by-one errors.
   - **Null / Undefined Safety**: Verify optional chaining and nullish coalescing.
   - **Error Handling & Propagation**: Verify errors are logged and handled without swallow.
4. **Lane 4: Security & Hygiene Audit**:
   - **Secrets Check**: No hardcoded API keys, passwords, or tokens in source code.
   - **Injection & Sanitization**: Ensure inputs are validated and parameterized.
5. **Lane 5: Manual Scenario Proof**:
   - Verify specific scenarios against Acceptance Criteria (`AC-1`, `AC-2`).
   - Provide concrete walkthrough: "Where to go", "What to run/click", "What to expect".

### 3. Update Living Spec (`current-feature.md`)
Append or update `## 5. Verification Evidence` in `devflow/context/current-feature.md` in **Thai (`th`)**:

```markdown
## 5. Verification Evidence
- **Typecheck & Linter**: Passed (0 errors, 0 warnings)
- **Automated Test Suites**: All tests passed (e.g. 12/12 passed, 0 failed)
- **Scrutinize & Security Audit**: Clean (No boundary issues, 0 secrets, safe inputs)
- **Acceptance Criteria Verification**:
  - [x] AC-1: {ผลการตรวจสอบเงื่อนไขที่ 1 ผ่าน 100%}
  - [x] AC-2: {ผลการตรวจสอบเงื่อนไขที่ 2 ผ่าน 100%}
- **Manual Verification Guide**:
  - *Where to go*: `http://localhost:3000/api/auth`
  - *Action*: Send POST request with test credentials
  - *Expected Result*: Received HTTP 200 with valid JWT token
```

### 4. Update Workspace Status
Update `devflow/context/current-stage.md`:
- `Current Stage`: `check (Fast-Track -> Verification Passed -> Ready for /complete)`

### 5. Output Summary & Next Step
Report to the user:
- Summary of verification results across all lanes
- Evidence recorded in `devflow/context/current-feature.md`
- **Next Command**: `/complete` (or `/complete {ID}`)
