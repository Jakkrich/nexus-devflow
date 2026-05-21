---
description: Root Cause Analysis (Debug Orchestration) - Find the actual origin of an issue, not just the symptoms, following systematic debugging, the 5 Whys, and the credited 9arm-skills/debug-mantra discipline.
---
# 🔍 Phase 20: Root Cause Analysis (Debug Orchestration)

## Issue: $ARGUMENTS

Find the actual origin of an issue, not just the symptoms. Follow Systematic Debugging, the "5 Whys" principle, and the credited `9arm-skills/debug-mantra` discipline to identify the root cause.

## Source Discipline

Apply the local skill pack at `.agent/skills/9arm-skills/debug-mantra/SKILL.md`.

- Source pack: `9arm-skills`
- Credit: `thananon/9arm-skills`
- Upstream: https://github.com/thananon/9arm-skills
- Adapted for: Antigravity IDE / Nexus-DevFlow
- Mantra: `Reproduce -> Trace fail path -> Falsify hypothesis -> Cross-reference breadcrumbs`

---

## 🛠️ Internal Process (4-Phase Debugging)

You are an orchestrator. Your goal is to call the specialized Deep Debugging agent (`prp-core-debugger`) to perform a Root Cause Analysis (RCA).

### Phase 1: REPRODUCE & Classify
**Call Agent**: `prp-core-debugger`
- Provide the error message, stack trace, or symptom description.
- Get exact reproduction steps and determine the reproduction rate.
- Document expected vs actual behavior.
- Ensure the agent restates the symptom clearly before diving in.
- Do not recommend or apply a fix until there is a credible reproduction story or an explicit non-reproducible investigation plan.

### Phase 2: ISOLATE (Hypothesize)
- When did it start? What changed? Which component is responsible?
- Generate 2-4 hypotheses ordered by likelihood.
- Create a minimal reproduction case if possible.
- For each hypothesis, record the test or evidence that would falsify it.

### Phase 3: UNDERSTAND (Investigation)
- Facilitate the agent's work through the **5 Whys** protocol to drill down to the Fixable Root Cause.
- Test each hypothesis methodically using the elimination method.
- Ensure every "Because" step is backed by **Concrete Evidence** (file:line, command output).
- In deep mode, ensure the agent checks Git History to understand when/why the bug was introduced.
- Trace the actual fail path end-to-end instead of inspecting only the most suspicious diff or stack frame.
- Maintain a breadcrumb ledger of observations, sources, claims supported, and follow-up actions.

### Phase 4: FIX & VERIFY (Report & Output)
- Verify that the agent confirms the root cause via the **Three Tests** (Causation, Necessity, Sufficiency).
- **MANDATORY:** Before generating the RCA report, inspect `.agent/resources/schemas/rca.template.md` and use its required headings and table structure.
- Ensure the agent generates the detailed RCA report in `.workspaces/debug/rca-{slug}.md`.
- Add a short `Source Discipline` section crediting `9arm-skills/debug-mantra` while preserving the RCA template headings.
- Capture the **Fix Specification**, **Verification Plan**, and **Prevention Measures**.
- If the bug reveals a systemic misunderstanding or a new pattern, ensure it is carefully recorded in `.workspaces/lessons.md` (Strictly using the [../resources/schemas/lessons.template.md](../resources/schemas/lessons.template.md) template).

---

## 📝 Output Format

When presenting the RCA summary to the user:
1. **Symptom**: [What is happening]
2. **Information**: Error log, File, Line
3. **Investigation Path**: What was tested and the result
4. **Root Cause**: 🎯 [Explanation of why this happened]
5. **The Fix**: Before/After code snippets
6. **Prevention**: 🛡️ [How to prevent this in the future]

---

📌 **Next Step**: Once the cause is found, run `/30-Task` to track the fix, or `/32-Code {ID}` if the task already exists.
