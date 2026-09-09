# Two-Stage Review Template

Use with /audit independent after reading [SKILL.md](SKILL.md)
and the [receipt contract](reference/independent-review.md).
This template organizes review questions; it does not replace requests, receipts, or permission gates.

## Reviewer Dispatch Context

Fill in actual values from the immutable checkpoint:

```text
Feature: {ID and title}
Spec: {path and SHA-256}
Base ref / Base SHA: {ref / full SHA}
Target SHA: {full SHA}
Builder adapter / model: {actual identity}
Requested reviewer / model / execution: {request values}
Acceptance criteria: {copy from spec}
Check evidence: {commands and results}
Scope: {paths and exclusions}
```

Dispatch to a fresh reviewer using the execution mode recorded in the request.
Always follow Phase A/B and the required fields in the receipt contract.

## Stage 1: Spec Compliance

Check every AC against its implementation and supporting evidence.
Identify scope creep, incomplete requirements, and tests/evidence for behavioral ACs.
Report PASS/FAIL with path:line references and missing items.
On FAIL, stop before Stage 2 and return the work for repair.

## Stage 2: Code Quality

After Stage 1 passes, inspect security, error paths, performance,
maintainability, and the correctness of documentation/examples.
For each finding, record ID, P0–P3, path:line, impact, evidence, and a suggested fix.

## Review Output

Use verdicts and statuses from the receipt contract, including findings, check commands,
remaining risk, reviewer identity, fresh-context declaration, and review time.
The reviewer reports findings without editing product code.
Open or fixed P0/P1 findings still block completion; close them through re-review under /audit.
Preserve the original target/base SHAs and spec hash; never prefill passing results.
