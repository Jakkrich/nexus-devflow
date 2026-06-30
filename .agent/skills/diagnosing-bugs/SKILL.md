---
name: diagnosing-bugs
description: Diagnosis loop for hard bugs and performance regressions. Use inside Debug, /40-Implement, or /50-Verify when behavior is broken, throwing, failing, flaky, or slow.
---

# Diagnosing Bugs

Use this support skill when the active DevFlow owner needs a disciplined root-cause loop.

Do not let this skill replace `Debug`, `/40-Implement`, or `/50-Verify`. It supplies the method; the owning workflow records the artifact.

## Phase 1: Build A Tight Feedback Loop

Before hypothesizing, create a command or repeatable action that can catch the exact symptom.

Preferred loops:

1. failing automated test
2. CLI command with fixture input
3. HTTP request or curl script
4. browser automation
5. captured trace replay
6. throwaway harness
7. property or stress loop
8. bisection loop
9. differential loop
10. structured human-in-the-loop notes when automation is impossible

The loop must be:

- red-capable for the user's exact symptom
- deterministic, or high-reproduction-rate for flaky bugs
- fast enough to run repeatedly
- runnable by an agent or explicitly documented when human input is required

If no loop can be built, stop and ask for missing artifacts such as logs, HAR files, screen recordings, production access, or permission for temporary instrumentation.

## Phase 2: Reproduce And Minimize

Run the loop and confirm it reproduces the described symptom.

Then minimize:

- reduce inputs
- reduce configuration
- reduce steps
- remove dependencies one at a time

Stop minimizing only when every remaining element is load-bearing.

## Phase 3: Hypothesize

Write 3-5 ranked, falsifiable hypotheses.

Each hypothesis must say:

```text
If <cause> is true, then <probe or change> should produce <observable result>.
```

Proceed with the best hypothesis when user input is unavailable, but keep the ranked list in the artifact.

## Phase 4: Instrument

Probe one variable at a time.

- Prefer debugger or REPL inspection when available.
- Use targeted logs only at boundaries that distinguish hypotheses.
- Tag temporary logs with a unique prefix such as `[DEBUG-a4f2]`.
- For performance bugs, establish a measurement baseline before changing code.

## Phase 5: Fix And Guard

When a correct test seam exists:

1. Convert the minimized repro into a failing regression test.
2. Watch it fail.
3. Apply the fix.
4. Watch it pass.
5. Re-run the original feedback loop.

If no correct seam exists, record that architecture finding and route to `codebase-design` or `/30-Plan` after the bug is fixed.

## Phase 6: Cleanup And Post-Mortem

Before reporting done:

- original repro no longer reproduces
- regression test passes, or missing test seam is documented
- temporary debug instrumentation is removed
- throwaway harnesses are deleted or clearly marked
- root cause is recorded in the owning stage artifact
- prevention follow-up is captured when useful
