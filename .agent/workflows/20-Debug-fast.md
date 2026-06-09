---
description: Fast Markdown Debug - Investigate a symptom and save root-cause notes in Markdown without creating JSON task artifacts.
---
# Phase 20-fast: Debug Fast Markdown Task

Find the actual cause of an issue using a lightweight Markdown RCA. Do not jump to a fix before reproduction, fail-path tracing, hypothesis falsification, and evidence are recorded.

## Usage

```text
/20-Debug-fast "<symptom or task-slug>"
```

## Fast Mode Contract

- Save debug evidence in `.workspaces/debug/fast-<slug>.md` or `.workspaces/tasks/<task-slug>/debug.md` when a fast task exists.
- Do not create or mutate JSON task artifacts.
- Do not require PRP CLI validation or dashboard state.
- Use target project commands and logs for reproduction evidence.
- Convert the fix into `/30-Task-fast` or `/32-Code-fast` only after the root cause is credible.

## Source Discipline

Apply the debug discipline:

- Reproduce
- Trace the fail path
- Falsify the hypothesis
- Cross-reference breadcrumbs

## Process

### 1. Reproduce And Classify

- Restate the symptom.
- Record expected vs actual behavior.
- Capture exact reproduction steps or explain why it is not yet reproducible.
- Record command output, logs, screenshots, or file references.

### 2. Isolate

- List 2-4 hypotheses ordered by likelihood.
- For each hypothesis, define the evidence that would falsify it.
- Test hypotheses one at a time.

### 3. Trace The Fail Path

- Follow the runtime path through source files, config, data, API calls, or UI state.
- Record concrete breadcrumbs with file paths, line numbers, command output, or observed state.
- Separate facts from guesses.

### 4. Write Debug Report

Use this structure:

```markdown
---
id: "fast-<slug>"
workflow: "fast"
status: "<investigating|root_cause_found|blocked>"
source_workflow: "/20-Debug-fast"
---

# Debug: <Symptom>

## Symptom

## Reproduction

## Evidence

## Hypotheses

## Fail Path Trace

## Root Cause

## Fix Direction

## Verification Plan

## Handoff
```

If no root cause is proven, write the next evidence-gathering step instead of proposing a speculative fix.

## Output

Report:

- Reproduction status
- Root cause or current leading hypothesis
- Evidence gathered
- Fix direction
- Next command: `/30-Task-fast` for an untracked fix, or `/32-Code-fast <task-slug>` for an existing fast task

## Next Workflow Recommendation

- **Primary**: `/30-Task-fast "{fix title}"` when the fix is not tracked yet.
- **Alternative**: `/32-Code-fast <task-slug>` when the fast task exists and the root cause is proven.
