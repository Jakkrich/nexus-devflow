---
name: report-html
description: "[devflow] Standalone HTML Report Generator - render an interactive standalone HTML dashboard from current-feature.md or history archives on demand."
argument-hint: "[{running-id or workspace path}]"
---

# Standalone: Report HTML

$ARGUMENTS

Standalone companion command to generate an interactive, self-contained HTML report dashboard on demand from `current-feature.md`, task-specific context `devflow/context/{xxx-slug}/spec.md`, or archived history files in `devflow/history/`.

> [!NOTE]
> HTML reports are **never automatically generated** during normal mainline stages (`/complete`). Use this command whenever you or stakeholders wish to view or share an interactive web report.

## Invocations & Aliases

- `/report:html`: Generate HTML report for the active run
- `/report:html {running-id}`: Generate HTML report for the specified running ID
- `npm run report:html -- {running-id}`: CLI npm script invocation
- `$report:html`: Codex CLI invocation

## Behavior & Contract

When invoked:

### 1. Identify Target Run
1. Locate target markdown document:
   - Active Living Spec: `devflow/context/current-feature.md` or `devflow/context/{xxx-slug}/spec.md`
   - Archived History: `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`
2. Parse spec sections, checklist steps, QA evidence, and verification logs.

### 2. Render Interactive HTML Dashboard
Execute the HTML generation engine or script:
```bash
npm run report:html -- {RUNNING_ID}
```
Or transform Markdown into a styled, standalone HTML document:
- Output: `devflow/reports/{RUNNING_ID}-report.html` (or adjacent `{xxx-slug}.html`)

### 3. Output
Provide:
- Generated HTML file path: `file:///devflow/reports/{RUNNING_ID}-report.html`
- Summary of sections rendered (Spec, Plan, Progress, QA Evidence, Release Notes)
- Instructions to open the file in any browser