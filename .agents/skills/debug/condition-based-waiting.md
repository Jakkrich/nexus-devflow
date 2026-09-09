# Condition-Based Waiting

Read when tests guess delays with sleep or pass locally but time out in CI.
Prefer the test runner's waiting helpers; /debug plans and /implement changes tests.

## waitFor Pattern

This example accepts synchronous predicates only; return a boolean based on current state.
For async I/O, use a helper supporting async predicates and that I/O's cancellation or timeout.

```typescript
async function waitFor(
  condition: () => boolean,
  description: string,
  timeoutMs = 5000
): Promise<void> {
  const start = performance.now();
  while (!condition()) {
    if (performance.now() - start >= timeoutMs) {
      throw new Error('Timeout waiting for ' + description);
    }
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}
```

The predicate must return quickly; exceptions propagate and fail the test.
The timeout bounds polling but cannot cancel a blocking predicate.

| Wait target | Pattern |
| :--- | :--- |
| State | `await waitFor(() => state === 'ready', 'ready state')` |
| Stored event | `await waitFor(() => events.some(e => e.type === 'DONE'), 'DONE event')` |
| Count | `await waitFor(() => items.length >= 5, 'five items')` |
| Result that may be zero | `await waitFor(() => result !== undefined, 'result')` |

Register event listeners before starting the operation unless events are stored.
After waiting, assert the actual result; read fresh state inside the loop.
For debounce/throttle tests, use a fake clock or justified timing from the contract.
Finish when tests pass repeatedly under load and timeouts name the unmet condition.
