---
name: debug
description: "[devflow][B] Diagnose a failing test, broken build, crash, error, regression, or unexpected behavior without editing source or DevFlow state. Follows a strict 6-Phase Scientific Debugging Loop: builds a red-capable tight feedback loop, reproduces & minimises, tests 3-5 falsifiable hypotheses, localizes the failure to a root cause, and reports a repair handoff to /fix or /implement. Use when the user runs /debug, invokes $debug, asks why something is failing or broken, wants a root-cause investigation, or asks to diagnose before fixing."
---

# debug - 6-Phase Scientific Debugging Protocol

Where this sits in the workflow:

    reported failure  ->  [debug]  ->  /fix or /implement
    (test, build,          (reproduce,    (spec a new fix, or
     crash, behavior)       isolate,       repair active work)
                            explain)

`/debug` separates diagnosis from repair. It gathers empirical evidence, narrows the failure to a specific root cause using scientific method, and stops with an actionable repair handoff. It does not guess, assume, or perform ad-hoc "vibe debugging".

---

## Input

Accept a symptom, failing command, error message, or unexpected behavior. Examples:

    /debug npm test fails in cart-total.test.ts
    /debug the upload route returns 500 for PNG files
    /debug why does the build fail on Windows?

With no useful symptom, ask for expected behavior, actual behavior, and smallest known reproduction. Do not guess.

---

## 🔬 The 6-Phase Scientific Debugging Loop

### Phase 1: Build a Red-Capable Feedback Loop (Golden Rule)

**This is the core discipline.** If you have a **tight** pass/fail command that actively goes RED on this bug, you will find the root cause. If you do not have one, staring at code will not save you.

**Spend disproportionate effort here. Ways to construct one (in order):**
1. **Failing Unit / Integration Test** at the responsible module seam.
2. **Curl / HTTP script** against the running local dev server.
3. **CLI invocation** diffing stdout/stderr against expected output.
4. **Headless browser script** (Playwright) asserting on DOM/network/console.
5. **Replay captured trace**: Replay isolated payload/event log through the code path.

**Completion Criterion for Phase 1**:
You must name **one single command** (a test invocation, a script, or curl) that you have **already run at least once** and proven:
- [ ] **Red-capable**: It exercises the actual code path and catches the user's exact symptom (fails red now, will pass green once fixed).
- [ ] **Deterministic**: Returns the same verdict every run.
- [ ] **Fast & Agent-runnable**: Completes in seconds, executable without manual intervention.

> [!CAUTION]
> **No Red-Capable Command = No Phase 2.** If you catch yourself reading code to form theories before this command exists, **STOP**. Jumping straight to a hypothesis is the exact failure this protocol prevents.

---

### Phase 2: Reproduce & Minimise

Run the feedback loop and watch it go RED.

1. **Confirm Symptom**: Ensure the failure mode matches what the user reported (not a nearby unrelated error).
2. **Minimise the Repro**: Cut inputs, configs, dependencies, and steps **one at a time**, re-running the command after each cut. Keep only what is load-bearing for the failure.
3. **Done when**: Every remaining parameter is load-bearing (removing any one makes the loop go green).

---

### Phase 3: Form 3–5 Ranked Falsifiable Hypotheses

Generate **3 to 5 ranked hypotheses** before testing or inspecting deeply. Never anchor on the first plausible idea.

Every hypothesis MUST be **falsifiable** using this exact format:
> *"If `<X>` is the cause, then `<changing Y>` will make the bug disappear / `<changing Z>` will make it worse."*

If you cannot state the prediction, it is a vibe: sharpen or discard it.

---

### Phase 4: Targeted Instrumentation & Isolation

Test hypotheses by changing **one variable at a time**:
1. **Tool preference**: Read-only inspection > REPL/debugger > Targeted probe logs.
2. **Debug Tag Rule**: If temporary diagnostic logs are necessary, tag every log line with a unique prefix, e.g. `[DEBUG-a4f2]`. This guarantees a single `grep` can find and remove all probes.
3. **Redaction**: Redact all secrets, tokens, and credentials in terminal outputs (`<REDACTED>`).

---

### Phase 5: Confirm Root Cause at Real Seam

A root cause is **Confirmed** only when empirical evidence connects all three:
1. The triggering input or state
2. The responsible code / configuration boundary
3. The observed failure

**Seam Identification**: Identify the exact architectural seam (per `devflow/context/coding-standards.md` Deep Modules) where the regression test must live. If no clean seam exists, note that as an architectural finding.

---

### Phase 6: Report & Hand-off

Give a structured, concise debug report:

```markdown
### 🐞 Debug Report: <Concise Title>

- **Symptom**: <Exact user symptom observed>
- **Reproduction Command**: `<Single red-capable command>`
- **Verdict**: Confirmed | Likely | Blocked
- **Root Cause**: <Precise technical explanation of why it failed>
- **Responsible Seam**: `<path/to/file.ts#line>`
- **Evidence**:
  - Test/Curl output confirming the red signal
  - Trace connecting triggering state to failure
- **Next Action**:
  - For active feature -> Hand back to `/implement` with instructions to write failing test first.
  - For standalone bug -> Recommend `/fix "<concise description>"` to create spec and implement regression test.
```

---

## Rules

- **Diagnose, do not repair**: Never edit production source, package lockfiles, or DevFlow state inside `/debug`.
- **Evidence outranks confidence**: Label uncertainty honestly (`Likely` vs `Confirmed`).
- **Preserve git state**: Never switch branches, commit, reset, or clean the working tree.
- **Clean up probes**: Ensure any temporary test scripts in scratch/ are cleanly referenced.