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

Before writing `70-report.md`, read `artifact_language` from `report.template.md` and produce the markdown artifact in that language.

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
- `checklists/implementation-checklist.md` when present
- `checklists/verification-checklist.md` when present

Include supporting artifacts only when they add real context.

### 2. Summarize The Run

Explain:

- what problem was addressed
- what direction was chosen
- what was implemented
- how it was verified
- how checklist progress moved across the run
- what the final outcome was
- what follow-up items still exist

### 3. Produce Standardized Outputs

Write:

- a readable Markdown report for contributors
- a consistent HTML report for stakeholder sharing

In phase 1, `artifact_language` governs the markdown report text. HTML output is derived directly from `70-report.md` through the shared markdown-to-html renderer.

To render the HTML consistently from the markdown report, use one of:

```text
npm run report:html -- <workspace-path-or-running-id>
npm run render:html -- --stage 70-report <workspace-path-or-running-id>
```

Keep checklist summaries and follow-up status inside `70-report.md` so they carry through into the rendered HTML.

Both outputs should summarize checklist state when checklist artifacts exist, including:

- completion progress
- blocked or skipped items
- notable evidence snapshots
- remaining follow-up work

The HTML should stay visually consistent across runs while preserving the report markdown as the source of truth.

### 4. Keep The Audience In Mind

Prefer clarity over internal detail.

Do not bury the outcome inside implementation trivia. The report should help a reader understand the run without replaying the whole workflow.

When checklists exist, use them as the most human-readable operational record of what actually happened.

## Output

Report:

- what the run accomplished
- checklist completion status and remaining items
- important remaining follow-ups
- where `70-report.md` and `70-report.html` were written
- render command used or recommended:

```text
npm run report:html -- <workspace-path-or-running-id>
```

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
- **Render HTML**: `npm run report:html -- {ID}` after `70-report.md` is finalized so the standardized stakeholder HTML stays in sync
- **Alternative**: `Wiki` when the completed run should be promoted into durable reusable knowledge
