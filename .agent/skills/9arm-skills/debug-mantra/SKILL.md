---
name: 9arm-skills/debug-mantra
description: Use during debugging and RCA. Requires reproduction, real fail-path tracing, hypothesis falsification, and breadcrumb cross-reference before proposing a fix.
source_pack: 9arm-skills
credit: thananon/9arm-skills
upstream: https://github.com/thananon/9arm-skills
adapted_for: Antigravity IDE / Nexus-DevFlow
---

# Debug Mantra

## Purpose

Stop the Antigravity IDE agent from guessing during debug work. The agent must prove the bug path before recommending or applying a fix.

This skill is a credited adaptation of `9arm-skills/debug-mantra` for Nexus-DevFlow.

## Mantra

```text
Reproduce -> Trace fail path -> Falsify hypothesis -> Cross-reference breadcrumbs
```

## Required Discipline

### 1. Reproduce First

Do not propose a fix until there is a credible reproduction story.

Capture:

- exact symptom
- expected behavior
- observed behavior
- reproduction steps
- reproduction rate
- environment or data conditions

If the issue is intermittent, document the conditions and instrumentation needed to catch it instead of pretending it is solved.

### 2. Trace The Real Fail Path

Follow the actual runtime path end-to-end:

- user action or incoming request
- entrypoint
- service/module boundaries
- data reads and writes
- external calls
- final failure point

Evidence should cite file paths, line numbers when available, commands, logs, or observed runtime output.

### 3. Falsify Hypotheses

List 2-4 plausible hypotheses and try to disprove them. A hypothesis that was ruled out is useful evidence and should be recorded.

Use this table in RCA notes when helpful:

| Hypothesis | Test / Evidence | Result | Ruled In/Out |
|---|---|---|---|
| {Hypothesis} | {Evidence} | {Result} | {Status} |

### 4. Cross-Reference Breadcrumbs

Keep a breadcrumb ledger so the investigation can be audited later:

| Breadcrumb | Source | What It Proves | Follow-up |
|---|---|---|---|
| {Observation} | {File / command / log} | {Claim supported} | {Next step} |

## Nexus-DevFlow Output

When used by `Debug`, preserve the existing RCA output contract:

- inspect `.agent/resources/schemas/rca.template.md`
- write `.workspaces/debug/rca-{slug}.md`
- include the normal RCA sections
- add a short `Source Discipline` note crediting `9arm-skills/debug-mantra`

Do not replace the RCA template with a custom 9arm-only format.

## Hard Stop

If there is no reproduction, no trace, and no falsified hypothesis, the correct output is an investigation plan, not a fix.

