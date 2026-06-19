---
description: Root cause analysis and debugging. Transitional compatibility path for the Debug companion command in DevFlow 2.0.
---

# Debug - Root Cause Analysis

## Issue: $ARGUMENTS

This file keeps its old numeric path for migration compatibility.

In DevFlow 2.0, `Debug` is a companion command, not a numbered mainline workflow. Its investigative depth should remain comparable to the original debug workflow.

## Purpose

Use `Debug` to find the actual origin of an issue, not just the visible symptom.

Use it when:

- implementation work is blocked by a defect
- verification reveals a failure that needs root-cause analysis
- the team needs RCA before deciding the next implementation step

Preferred DevFlow 2.0 pairing:

- from `/40-Implement`
- from `/50-Verify`

## Source Discipline

Apply the local skill pack at `.agent/skills/9arm-skills/debug-mantra/SKILL.md`.

- Source pack: `9arm-skills`
- Credit: `thananon/9arm-skills`
- Upstream: https://github.com/thananon/9arm-skills
- Mantra: `Reproduce -> Trace fail path -> Falsify hypothesis -> Cross-reference breadcrumbs`

---

## Internal Process

You are doing Root Cause Analysis, not just symptom triage. Keep the richer original debugging discipline and map the next step back into DevFlow 2.0.

### Phase 1: Reproduce And Classify

- restate the symptom clearly
- capture expected vs actual behavior
- determine whether the issue is reproducible
- do not recommend a fix before the reproduction story is credible

### Phase 2: Isolate And Hypothesize

- identify likely components, recent changes, or conditions
- generate 2-4 hypotheses ordered by likelihood
- define what evidence would falsify each hypothesis

### Phase 3: Investigate With Evidence

- trace the real fail path end-to-end
- test hypotheses methodically
- record evidence with file:line or command output
- maintain a breadcrumb trail of observations and conclusions

### Phase 4: Conclude With RCA

- name the root cause
- explain why it is the root cause
- describe the fix direction
- capture prevention or follow-up measures

This command supports the active stage. It does not replace the mainline stage itself.

## Output Format

Save the RCA report to `.workspaces/debug/rca-{slug}.md`.

Before generating the report:

1. Inspect `.agent/resources/schemas/rca.template.md`
2. Preserve its required headings and structure
3. Replace placeholder text with concrete evidence
4. Re-check the output against `rca.template.md`, ensure required headings remain, and remove all placeholders before completion

Present the summary in this shape:

```markdown
## Debug Summary

1. **Symptom**: [What is happening]
2. **Evidence**: [error log, file, line, failing command]
3. **Investigation Path**: [what was tested and what happened]
4. **Root Cause**: [why this happened]
5. **Fix Direction**: [what should be changed]
6. **Prevention**: [how to avoid recurrence]
```

## Examples

```text
Debug flaky login redirect
Debug failing migration in CI
Debug why webhook verification breaks in staging
Debug unexpected duplicate records
```

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: `/40-Implement`, `/50-Verify`, `Issue-Triage`, production failure analysis
- Typical handoff targets: `/40-Implement`, `/50-Verify`, `Insight`, `Wiki`

## Sources

- `AGENTS.md`
- `.agent/resources/schemas/rca.template.md`
- Related commands: `/40-Implement`, `/50-Verify`, `Test`, `Insight`, `Wiki`, `Agent`

## Next Workflow Recommendation

- Default: return to `/40-Implement` when a tracked fix already exists
- Alternate: `/30-Plan` if the fix needs planning changes
- Alternate: `/50-Verify` when the issue is resolved and needs re-checking

