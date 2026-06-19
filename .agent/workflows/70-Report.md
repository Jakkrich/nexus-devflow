---
description: Report stage in DevFlow 2.0 - produce the final standardized markdown and HTML summary for the full running flow.
argument-hint: "{running-id or workspace path}"
---

# Phase 70: Report

$ARGUMENTS

Produce the final human-friendly summary of the full running flow in both Markdown and HTML so the outcome is easy to communicate every time.

## Usage

```text
/70-Report {running-id or workspace path}
```

Use this when:

- the mainline run is effectively complete
- the team needs a standardized summary for communication
- non-technical readers should be able to understand what happened

## Markdown-First Contract

Write the primary stage artifacts to:

```text
.workspaces/specs/{ID}-{slug}/70-report.md
.workspaces/specs/{ID}-{slug}/70-report.html
```

using:

```text
.agent/resources/schemas/report.template.md
```

## Process

### 1. Gather Full Run Context

Read all relevant stage artifacts:

- `00-discover.md`
- `10-define.md`
- `20-spec.md`
- `30-plan.md`
- `40-implement.md`
- `50-verify.md`
- `60-release.md`

Include supporting artifacts only when they add real context.

### 2. Summarize The Run

Explain:

- what problem was addressed
- what direction was chosen
- what was implemented
- how it was verified
- what the final outcome was
- what follow-up items still exist

### 3. Produce Standardized Outputs

Write:

- a readable Markdown report for contributors
- a consistent HTML report for stakeholder sharing

The HTML should stay structurally consistent across runs.

### 4. Keep The Audience In Mind

Prefer clarity over internal detail.

Do not bury the outcome inside implementation trivia. The report should help a reader understand the run without replaying the whole workflow.

## Output

Report:

- what the run accomplished
- important remaining follow-ups
- where `70-report.md` and `70-report.html` were written

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `/60-Release`
- Next state: End of the mainline run
- Common companion commands: `Wiki` for durable knowledge capture, `Help` for routing or explanation

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/report.template.md`
- Related commands: `/60-Release`, `Wiki`, `Help`

## Next Workflow Recommendation

- **Primary**: End of mainline flow
- **Alternative**: `Wiki` when the completed run should be promoted into durable reusable knowledge

