# Root-Cause Tracing

Read when an error occurs deep in the call stack or the source of invalid data is unclear.
Use with Phase 4 of [debug](SKILL.md); hand repair plans to /fix and /implement.

## 5-Step Backward Trace

1. **Observe symptom**: Capture the error, stack, and exact location.
2. **Immediate cause**: Identify the failing operation and invalid input.
3. **Caller**: Find who supplied that input.
4. **Trace upward**: Follow the parameter back one call at a time to its origin.
5. **Original trigger**: Reproduce the root cause and propose a regression test.

Example: a test reads tempDir before beforeEach runs, passes an empty value,
and git init uses the wrong cwd. Prove the setup order before proposing a source guard.

## Stack Trace Instrumentation

Use a scratch reproduction or debugger within /debug's boundaries.
Record only redacted data; never dump the environment or secrets.

```typescript
console.error('[DEBUG-trace]', {
  hasDirectory: Boolean(directory?.trim()),
  stack: new Error().stack,
});
```

Use `rg 'DEBUG-trace' diagnostic.log` to locate probes, then remove them when finished.
Across multiple layers, compare inputs and outputs at each seam using SET/UNSET status only.

If the bug appears only when tests run together, repeatedly bisect the test set
to find the polluter, checking state before and after each subset.

Finish when the trigger, call chain, and reproduction evidence are established.
Then use [defense-in-depth.md](defense-in-depth.md) to plan protective checks.
