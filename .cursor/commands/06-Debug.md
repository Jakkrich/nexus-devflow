# 🔍 Root Cause Analysis (Debug Orchestration)

## Issue: $ARGUMENTS

Find the actual origin of an issue, not just the symptoms. Follow Systematic Debugging and the "5 Whys" principle to identify the root cause.

---

## 🛠️ Internal Process (4-Phase Debugging)

You are an orchestrator. Your goal is to call the specialized Deep Debugging agent (`prp-core-debugger`) to perform a Root Cause Analysis (RCA).

### Phase 1: REPRODUCE & Classify
**Call Agent**: `prp-core-debugger`
- Provide the error message, stack trace, or symptom description.
- Get exact reproduction steps and determine the reproduction rate.
- Document expected vs actual behavior.
- Ensure the agent restates the symptom clearly before diving in.

### Phase 2: ISOLATE (Hypothesize)
- When did it start? What changed? Which component is responsible?
- Generate 2-4 hypotheses ordered by likelihood.
- Create a minimal reproduction case if possible.

### Phase 3: UNDERSTAND (Investigation)
- Facilitate the agent's work through the **5 Whys** protocol to drill down to the Fixable Root Cause.
- Test each hypothesis methodically using the elimination method.
- Ensure every "Because" step is backed by **Concrete Evidence** (file:line, command output).
- In deep mode, ensure the agent checks Git History to understand when/why the bug was introduced.

### Phase 4: FIX & VERIFY (Report & Output)
- Verify that the agent confirms the root cause via the **Three Tests** (Causation, Necessity, Sufficiency).
- Ensure the agent generates the detailed RCA report in `.auto-claude/debug/rca-{slug}.md`.
- Capture the **Fix Specification**, **Verification Plan**, and **Prevention Measures**.
- If the bug reveals a systemic misunderstanding or a new pattern, ensure it is carefully recorded in `.auto-claude/lessons.md` (Strictly using the [../PRPs/templates/lessons.template.md](../PRPs/templates/lessons.template.md) template).

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

📌 **Next Step**: Once the cause is found, run `/03-Code {ID}` to apply the fix, or `/01-Task` if it requires a major architectural plan.
