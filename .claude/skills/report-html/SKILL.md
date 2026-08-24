---
name: report-html
description: "[devflow][B] Standalone HTML Report Generator - render an interactive standalone HTML dashboard from current-feature.md or 60-report.md on demand."
argument-hint: "{running-id or workspace path}"
---

# Standalone: Report HTML

$ARGUMENTS

Standalone companion command to generate an interactive, self-contained HTML report dashboard on demand from either a Fast-Track `current-feature.md` or a Deep-Track `60-report.md`.

> [!NOTE]
> HTML reports are **never automatically generated** during normal mainline stages (`/complete` or `60-report`). Use this command whenever you or stakeholders wish to view or share an interactive web report.

## Invocations & Aliases

- `/report:html`: Generate HTML report for the active or most recent run
- `/report:html {running-id}`: Generate HTML report for the specified running ID
- `npm run report:html -- {running-id}`: CLI npm script invocation
- `$report:html`: Codex CLI invocation

## Behavior & Contract

When invoked:

### 1. Identify Target Run
1. Locate target run directory in `devflow/runs/{running-id}` from argument or `devflow/context/current-stage.md`.
2. Check for either:
   - Fast-Track Living Spec: `devflow/runs/{RUNNING_ID}/current-feature.md` (or `spec.md` / `blueprint.md`)
   - Deep-Track Report Digest: `devflow/runs/{RUNNING_ID}/60-report.md`

### 2. Render Interactive HTML Dashboard
Execute the HTML generation engine:
```bash
npm run report:html -- {RUNNING_ID}
```
Or execute the renderer to transform Markdown into a styled, standalone HTML document:
- Path: `devflow/runs/{RUNNING_ID}/report.html`

### 3. Output
Provide:
- Generated HTML file path: `file:///devflow/runs/{RUNNING_ID}/report.html`
- Summary of sections rendered (Spec, Plan, Progress, QA Evidence, Release Notes)
- Instructions to open the file in any browser