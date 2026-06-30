---
description: Report stage in DevFlow 2.0 - produce the final standardized markdown and HTML summary for the full running flow.
argument-hint: "{running-id or workspace path}"
---

# Phase 60: Report

$ARGUMENTS

Produce the final human-friendly summary of the full running flow in both Markdown and HTML so the outcome is easy to communicate every time.

## Usage

```text
/60-Report {running-id or workspace path}
```

Use this when:

- verification is complete and the run is ready for a final standardized summary before release
- the team needs a standardized summary for communication
- non-technical readers should be able to understand what happened

## Markdown-First Contract

Write the primary stage artifacts to:

```text
.workspaces/specs/{ID}-{slug}/60-report.md
.workspaces/specs/{ID}-{slug}/60-report.html
```

using:

```text
.agent/resources/schemas/report.template.md
```

Before writing `60-report.md`, read `artifact_language` from `report.template.md` and produce the markdown artifact in that language.

## Process

### 1. Gather Full Run Context

Read all relevant stage artifacts:

- `00-discover.md`
- `10-define.md`
- `20-spec.md`
- `30-plan.md`
- `40-implement.md`
- `50-verify.md`
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
- what approval or review state remained at each important gate
- what the release recommendation is
- what follow-up items still exist

### 3. Produce Standardized Outputs

Write:

- a readable Markdown report for contributors
- a consistent HTML report for stakeholder sharing

In phase 1, `artifact_language` governs the markdown report text. HTML output is derived directly from `60-report.md` through the shared markdown-to-html renderer.

To render the HTML consistently from the markdown report, use one of:

```text
npm run report:html -- <workspace-path-or-running-id>
npm run render:html -- --stage 60-report <workspace-path-or-running-id>
```

Keep checklist summaries and follow-up status inside `60-report.md` so they carry through into the rendered HTML.

Both outputs should summarize checklist state when checklist artifacts exist, including:

- completion progress
- blocked or skipped items
- notable evidence snapshots
- approval status, review blockers, and next allowed command when they still matter
- remaining follow-up work

The HTML should stay visually consistent across runs while preserving the report markdown as the source of truth.

### 4. Keep The Audience In Mind

Prefer clarity over internal detail.

Do not bury the outcome inside implementation trivia. The report should help a reader understand the run without replaying the whole workflow.

When checklists exist, use them as the most human-readable operational record of what actually happened.

### 5. Manual Review Soft Gate

Use the report as the final visibility checkpoint before release.
If any stage still shows unresolved approval, blockers, or deferred work:

- surface that state clearly in `60-report.md`
- pull the relevant signal forward from checklist approval sections when they exist
- do not imply the phase is fully closed when review is still open
- recommend the real next action, even if that means returning to an earlier stage

## Output

Report:

- what the run accomplished
- checklist completion status and remaining items
- important remaining follow-ups
- where `60-report.md` and `60-report.html` were written
- render command used or recommended:

```text
npm run report:html -- <workspace-path-or-running-id>
```

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `/50-Verify`
- Next state: `/70-Release` when the summary is aligned and release can proceed
- Common companion commands: `Wiki` for durable knowledge capture, `Help` for routing or explanation

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/report.template.md`
- Related commands: `/50-Verify`, `/70-Release`, `Wiki`, `Help`

## Next Workflow Recommendation

- **Primary**: `/70-Release {ID}` after `60-report.md` and `60-report.html` reflect the verified state clearly.
- **Render HTML**: `npm run report:html -- {ID}` after `60-report.md` is finalized so the standardized stakeholder HTML stays in sync
- **Alternative**: `Wiki` when the completed run should be promoted into durable reusable knowledge before release packaging continues

## Nexus Event

- Use `Wiki` when the final summary should become durable project or framework knowledge.
- Use `Help` when approval signals, ownership, or route timing still feel ambiguous.
- Return to `/50-Verify` when unresolved evidence, blockers, or review state mean the report should not advance yet.
