---
name: report-html
description: "[devflow] Standalone HTML Report Generator - render an interactive standalone HTML dashboard from devflow/context/{xxx-slug}/spec.md or history archives on demand."
argument-hint: "[{running-id or workspace path}]"
---

# Standalone: Report HTML

$ARGUMENTS

Standalone companion command to generate an interactive, self-contained HTML report dashboard on demand from task-specific context `devflow/context/{xxx-slug}/spec.md`, or archived history files in `devflow/history/`.

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
   - Active Living Spec: `devflow/context/{xxx-slug}/spec.md`
   - Archived History: `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`
2. Parse spec sections, checklist steps, QA evidence, and verification logs.

### 2. Diagram Pre-Check & Skill Auto-Install (Optional)
If the spec involves architectural design, system topology, sequence flows, or if the user requests diagrams:
1. **Inspect Existing Diagrams**:
   Check `devflow/context/{xxx-slug}/diagrams/`. Any `.svg`, `.html`, or image files will be automatically embedded into the **System & Architecture Diagrams** showcase.
2. **Auto-Detect & Install Diagram Skills**:
   If diagrams are requested but not yet generated:
   - Check if `.agents/skills/archify/` or `.agents/skills/diagram-design/` exists.
   - If not installed, run CLI installation:
     ```bash
     # For technical architecture, dataflows, sequence traces, interactive motion
     npx create-nexus-devflow skill add archify

     # For editorial, business, quadrant, timeline, or radar diagrams
     npx create-nexus-devflow skill add diagram-design
     ```
3. **Generate Diagram**:
   Use the installed skill to create the diagram artifact in `devflow/context/{xxx-slug}/diagrams/{name}.html` (or `.svg`).
4. **Native Mermaid Support**:
   Any ` ```mermaid ` code block inside the document is automatically rendered visually via the dashboard's built-in theme-aware Mermaid.js engine.

### 3. Render Interactive HTML Dashboard
Execute the HTML generation engine or script:
```bash
npm run report:html -- {RUNNING_ID}
```
Or transform Markdown into a styled, standalone HTML document:
- Output: `devflow/context/{xxx-slug}/report.html` (or adjacent `{xxx-slug}.html`)

### 4. Output
Provide:
- Generated HTML file path: `file:///devflow/context/{xxx-slug}/report.html`
- Summary of sections rendered (Spec, Plan, Progress, QA Evidence, Diagrams Showcase, Release Notes)
- Instructions to open the file in any browser