# Defense-in-Depth Validation

Read after confirming the root cause to plan protective checks in /fix.
/debug diagnoses only; add guards and tests during /implement.

## The Four Layers

1. **Entry point**: Reject invalid input before the operation starts.
2. **Business logic**: Check invariants when other callers can bypass the entry point.
3. **Environment guard**: Restrict risky test operations to a sandbox.
4. **Instrumentation**: Capture redacted diagnostic evidence; logging is not validation.

```typescript
// Entry point
if (!directory.trim()) throw new Error('directory required');

// Business invariant
if (!session.ready) throw new Error('session not ready');

// Test sandbox: canonical paths, not a string-prefix check
const root = realpathSync(sandboxRoot);
const target = realpathSync(directory);
const rel = relative(root, target);
if (rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) {
  throw new Error('outside sandbox');
}

// Instrumentation
console.error('[DEBUG-guard]', { sessionReady: session.ready });
```

This example uses realpathSync from node:fs and relative, sep, isAbsolute from node:path.
The target must exist; for a new path, check its canonical parent before creation.
This guard does not prevent filesystem races if another actor changes a symlink between checking and use.

## Verification

Trace the data flow with [root-cause-tracing.md](root-cause-tracing.md).
Choose layers based on invariants and risk; avoid redundant guards without a reason.
Test entry-point bypasses, sibling paths, and symlinks leading outside the sandbox.
Finish when each selected guard demonstrably rejects invalid input and accepts valid input.
