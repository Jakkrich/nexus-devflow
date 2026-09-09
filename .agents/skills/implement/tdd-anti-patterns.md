# TDD Anti-Patterns

Read when planning RED/GREEN or reviewing test quality.
Follow the test decision in the spec and [implement](SKILL.md).

## The Iron Law

`NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST`

For behavior changes, observe the intended test failure before writing production code.
If code came first, revert only your own work for that step and restart from the test.
Preserve the user's existing work; verify docs/config without logic as specified in the spec.

## Red-Phase Checklist

- The test actually fails, rather than encountering a syntax/import error.
- The failure message identifies missing or incorrect behavior.
- Test setup is valid, and the intended assertion fails.

If the test passes immediately, check whether it exercises the new behavior.
Fix setup errors and rerun before GREEN.

| Bad | Good |
| :--- | :--- |
| Name: `retry works` | `returns success after transient failure` |
| Assert only mock calls | Assert outcomes and attempt counts when part of the contract |
| Combine multiple behaviors | Separate success, retry, and exhausted failure |
| Write tests without running them | RED → GREEN → REFACTOR with evidence at each stage |
| Add options for future use | Implement only behavior required by the spec/test |

```typescript
let attempts = 0;
const result = await retryOperation(async () => {
  attempts++;
  if (attempts < 3) throw new Error('transient');
  return 'ok';
});
assert.equal(result, 'ok');
assert.equal(attempts, 3);
```

During GREEN, write the minimum code needed to pass; then REFACTOR while tests stay green.
Mock only necessary boundaries; check the dependency's contract before creating a fake.
Finish with evidence of RED for the intended reason, GREEN for the behavior, and regression checks.
