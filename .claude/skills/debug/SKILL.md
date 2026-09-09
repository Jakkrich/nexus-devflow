---
name: debug
description: "[devflow] Diagnose a failing test, build, crash, regression, or unexpected behavior without editing source. Reproduce the symptom, test hypotheses, identify the supported root cause, and hand off a repair. Use for /debug or root-cause investigation."
---

# debug - 6-Phase Scientific Debugging Protocol

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

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

## 🧘 Phase 0: The 4 Debug Mantras (Mindset & Discipline)

Recite and apply these four ironclad discipline constraints at the start of any debugging session:

> **The 4 Mantras:**
> 1. **First is reproducibility.** Can the issue be reproduced reliably? Build a fast, deterministic pass/fail signal before hypothesizing.
> 2. **Know the fail path.** Debugger first; then source trace + knob enumeration; then in-code instrumentation.
> 3. **Question your hypothesis.** What would disprove it? Run the disproof first before chasing phantoms.
> 4. **Every run is a breadcrumb.** Maintain a running ledger of every experiment and cross-reference all observations.

Never propose a fix, edit production code, or speculate without satisfying the mantras below.

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

**Phase 4 JIT Reference Guides** (read as needed):
- **Deep call-stack failure or unclear source of invalid data** → Read [`root-cause-tracing.md`](root-cause-tracing.md): 5-step backward trace + stack trace instrumentation
- **Confirmed root cause requiring recurrence prevention** → Read [`defense-in-depth.md`](defense-in-depth.md): The Four Layers validation pattern
- **Flaky async tests or CI timeouts** → Read [`condition-based-waiting.md`](condition-based-waiting.md): `waitFor()` instead of arbitrary `setTimeout`

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

### Phase 7: Post-Mortem & Fix Handoff (Canonical Engineering Record)

Once a fix is identified and validated (or when prompted: "write the post-mortem", "document this fix", "RCA"), draft the canonical engineering record for other engineers:

- **Prerequisites (Refuse to draft without all 4)**:
  1. Reliable repro exists (from Phase 1 & 2).
  2. Root cause mechanism is confirmed (from Phase 5).
  3. Fix is identified (commit / PR / branch).
  4. Fix is validated (original red loop is now green).
- **Canonical Structure**:
  1. *Summary*: One paragraph: what broke, what fixed it, JIRA/PR keys, owner.
  2. *Symptom*: Actual observed error, test failure, or log lines with concrete identifiers.
  3. *Root cause*: Actual bug mechanism with code identifiers (functions, files, fields, conditions).
  4. *Why it produced the symptom*: Cause-and-effect chain linking mechanism to symptom.
  5. *Fix*: What changed and why this addresses the cause rather than masking the symptom.
  6. *How it was found*: Repro path, rejected hypotheses, decisive experiment.
  7. *Why it slipped through*: CI gap, latent code, workload gap, or review miss (blameless).
  8. *Validation*: Concrete proof (tests passing, benchmark delta, workload completion).
  9. *Action items*: Concrete follow-ups with owners and ticket keys.

---

## 🔴 3-Strike Architecture Review Rule

Apply this rule to the supplied history of repair attempts; `/debug` still only diagnoses and hands off repair plans.

After **3 unsuccessful repair attempts** → **STOP before attempting Fix 4**.

```text
Fix 1 fails → Return to Phase 1 and reassess
Fix 2 fails → Return to Phase 1 with the new evidence
Fix 3 fails → STOP before Fix 4
```

**Patterns suggesting an architectural problem:**
- Each fix reveals shared state or coupling in another area
- A fix requires extensive refactoring to implement
- Each fix creates a new symptom elsewhere

**When these patterns appear, stop and consult the user:**
- Consider an architectural refactor before further symptom fixes
- Propose a `/fix` scope for the architectural change while preserving the active-run guardrail

---

## Rules

- **Diagnose, do not repair**: Never edit production source, package lockfiles, or DevFlow state inside `/debug`.
- **Evidence outranks confidence**: Label uncertainty honestly (`Likely` vs `Confirmed`).
- **Preserve git state**: Never switch branches, commit, reset, or clean the working tree.
- **Clean up probes**: Ensure any temporary test scripts in scratch/ are cleanly referenced.
