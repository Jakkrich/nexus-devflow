---
name: debug
description: "[Devflow] Root cause investigation and diagnostic loop before or during implementation without editing code. Use when encountering broken behavior, test failures, or bugs."
---

# Debug & Root Cause Analysis (RCA)

## Overview

This is the comprehensive debugging master skill for Nexus-DevFlow. It guides systematic root-cause investigation without blindly editing code. The goal is to find the actual origin of an issue, not merely suppress visible symptoms.

**The Debug Mantra (9arm Pattern)**:
```text
Reproduce ➔ Trace Fail Path ➔ Falsify Hypotheses ➔ Cross-reference Breadcrumbs ➔ RCA Proof
```

---

## 1. The 4-Phase Diagnostic Loop

### Phase 1: Reproduce & Classify
- Restate the observed symptom vs. expected behavior with exact steps.
- Create a minimal reproduction script, test case, or curl command.
- Rule: **Do not propose a code fix before the reproduction story is verified.**

### Phase 2: Isolate & Hypothesize
- Generate 2–4 distinct hypotheses ranked by probability.
- Formulate specific criteria and evidence that would *falsify* each hypothesis.

### Phase 3: Non-Destructive Investigation
- Trace code execution paths end-to-end (stack traces, logs, variable states, async boundaries).
- Inspect recent commits or configuration changes that touch the affected boundary.
- Test hypotheses methodically using tests and logging without altering business logic.

### Phase 4: Root Cause Conclusion (RCA)
- State precisely *why* the bug occurred (underlying invariant violation).
- Define the minimal, robust architectural fix direction.
- Propose regression prevention measures (unit test, type guard, linter rule).

---

## 2. Output Format (RCA Report)

Save substantial RCA investigations under:
```text
devflow/debug/rca-{slug}.md
```

Structure:
```markdown
## Debug Summary

1. **Symptom**: [What is happening vs expected]
2. **Evidence**: [Error logs, stack trace, file:line references]
3. **Investigation Path**: [Hypotheses tested and falsification proof]
4. **Root Cause**: [The exact mechanism causing the failure]
5. **Fix Direction**: [Recommended scoped change]
6. **Regression Guard**: [Reproduction test to add before fixing]
```

---

## Relationship To DevFlow 2.0

- **Classification**: Companion command & Investigation lane
- **Mainline integration**:
  - During `00-discover`: Unclear failure intake before allocation
  - During `40-execute`: Hard test failure or unexpected runtime exception
  - During `50-verify`: Defect found during QA inspection
- **Handoff**: `test` (write repro test), `40-execute` (execute fix), `50-verify` (re-check)
