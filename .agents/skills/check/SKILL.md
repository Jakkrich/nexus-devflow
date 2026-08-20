---
name: check
description: "[Devflow] Fast-Track Check stage in DevFlow (Blueprint Mode) - perform senior QA review, run multi-lane verification, and record evidence in current-feature.md in context."
argument-hint: "{running-id or workspace path}"
---

# Fast-Track: Check (Blueprint Mode)

$ARGUMENTS

Quality assurance and multi-lane verification stage in Fast-Track. Validates the implementation against Acceptance Criteria, runs test suites, checks for regressions, and records evidence in the Single Living Spec (`devflow/context/current-feature.md`).

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

### 2. Multi-lane Verification Execution
Execute the verification gates across all lanes:
1. **Lane 1 (Type & Syntax Safety)**:
   - Run typecheck and linting (e.g. `npm run typecheck`, `npm run lint`).
2. **Lane 2 (Test Suites & Coverage)**:
   - Run automated unit and integration tests (e.g. `npm test`).
3. **Lane 3 (Manual / Scenario Proof)**:
   - Verify specific scenarios against Acceptance Criteria (`AC-1`, `AC-2`).
   - Summarize "Where to go", "What to click/call", and "What to expect".

### 3. Update Living Spec (`current-feature.md`)
Append or update `## 5. Verification Evidence` in `devflow/context/current-feature.md` in **Thai (`th`)**:

```markdown
## 5. Verification Evidence
- **Typecheck & Linter**: Passed (0 errors, 0 warnings)
- **Automated Test Suites**: All tests passed (e.g. 12/12 passed, 0 failed)
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
