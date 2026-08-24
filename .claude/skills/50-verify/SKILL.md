---
name: 50-verify
description: "[devflow][D] Verify stage in DevFlow 2.0 - perform senior QA review, record evidence, and decide pass or return-to-implement."
---

# Phase 50: Verify Quality

Review implementation quality, run multi-lane validation, produce a verification report, and route the task forward or back to implementation.

## Usage

```text
50-verify {ID}
```

## Markdown-First Contract

Use `50-verify.md` as the primary verification artifact.
Use `50-verify-impact.md` as an optional companion artifact when the run changes behavior, touches core logic, crosses integration boundaries, or needs explicit rollback and client impact analysis.

## Process & Quality Gates (Two-Stage Review Pattern)

### Stage 1: Spec Fidelity & Acceptance Criteria Gate
Before evaluating technical code metrics, verify that the implementation faithfully delivers what was specified:
1. **Acceptance Criteria Validation**: Cross-check each Acceptance Criterion (AC-1, AC-2, ...) in `20-spec.md` or `current-feature.md` and verify concrete evidence of completion.
2. **Done-When Observable Verification**: Check that all observable conditions ("Done when...") are satisfied in the running application or test suite.
3. **Scope Discipline**: Ensure zero scope creep (no unrequested features added) and no unfulfilled functional requirements.
4. **Boundary & Negative Scenarios**: Verify unhappy paths, empty inputs, and error states defined in the specification.

### Stage 2: Code Quality, Security & Architecture Gate
Execute multi-lane technical verification across all essential quality dimensions:

1. **Lane 1: Typecheck & Static Code Quality**:
   - Run typecheck and static analysis (`tsc --noEmit`, `npm run lint`).
2. **Lane 2: Automated Test Suites (Strict TDD Gate)**:
   - Run automated unit and integration tests (`npm test`).
   - Confirm 100% test pass rate with zero disabled or skipped tests.
3. **Lane 3: Scrutinize QA & Edge Cases Review**:
   - **Boundary Conditions**: Check empty inputs, 0/1 counts, off-by-one errors.
   - **Null / Undefined Safety**: Verify nullish handling and strict type invariants.
   - **Error Handling & Propagation**: Verify errors provide actionable diagnostics without swallowing.
4. **Lane 4: Security & Hygiene Audit**:
   - **Secrets Check**: Ensure no hardcoded credentials or API keys exist.
   - **Input Sanitization**: Ensure parameterized queries and validated inputs.
5. **Lane 5: Findings Ledger State Machine (`findings.md`)**:
   - Inspect `devflow/context/findings.md`.
   - **P0/P1 HARD GATE**: Any Finding of severity `P0` or `P1` in `open` or `fixed` status unconditionally blocks pass.
6. **Lane 6: Manual Scenario Proof**:
   - Provide clear manual verification instructions: "Where to go", "What to run/click", "What to expect".

### 2. Decision & Route

- **Pass**: Both Stage 1 and Stage 2 pass with 0 blockers -> Route to `60-report {ID}`.
- **Fail**: Either Stage 1 or Stage 2 fails -> Route back to `40-execute {ID}` with exact failure evidence and remediation steps.

## Output

Report:
- **Stage 1 Verdict**: Spec Fidelity & Acceptance Criteria status
- **Stage 2 Verdict**: Technical Multi-lane quality & security matrix
- Evidence commands and outputs
- Next command: `60-report {ID}` (if pass) or `40-execute {ID}` (if fail)