---
title: Report HTML Rendering Notes
status: active
updated: 2026-06-24
---

# Report HTML Rendering Notes

`60-report.html` is rendered directly from `60-report.md`. The markdown report is the source of truth.

Renderer entry points:

```text
scripts/generate-report-html.mjs
scripts/render-html.mjs --stage 60-report <workspace-path-or-running-id>
npm run report:html -- <workspace-path-or-running-id>
```

Renderer boundary:

```text
scripts/lib/render-html/stage-adapters/report-stage.mjs
scripts/lib/render-html/md2html-report.mjs
scripts/lib/render-html/markdown.mjs
.agent/skills/md2html/template.html
```

## Current Behavior

- `report-stage.mjs` resolves the workspace and reads `60-report.md`
- `md2html-report.mjs` maps the stage report into the md2html template shell while preserving DevFlow workspace resolution and output paths
- `markdown.mjs` provides the markdown parsing helpers used by the stage bridge

## Source Priority

1. `60-report.md` frontmatter
2. `60-report.md` body content
3. renderer defaults

## Frontmatter Used By The Renderer

| Field | Purpose |
| :--- | :--- |
| `title` | HTML `<title>` and visible report heading fallback |
| `artifact_language` | sets `<html lang="...">`; `th` and `en` are supported, default is `en` |

Other frontmatter can still exist for workflow contract purposes, but it is not required for HTML layout generation.

## Checklist Guidance

Checklist artifacts are not injected into `60-report.html` by template placeholder mapping.

If checklist completion, blockers, skipped items, or evidence snapshots matter to the final report, include that summary explicitly in `60-report.md`, typically under:

- `### Checklist Summary`
- `### Validation Outcome`
- `### Next Actions`

## Expected Workspace Inputs

```text
.workspaces/specs/{ID}-{slug}/
  60-report.md
  60-report.html
```

Optional checklist files may still exist beside the report, but the renderer does not pull them into HTML automatically.

## Presentation Layer

`60-report.html` now uses the md2html presentation shell, including:

- TOC sidebar and mobile drawer
- theme toggle
- print action
- md2html typography and layout

The stage adapter still keeps `60-report.md` as the source of truth and does not turn `/60-Report` into a separate public workflow surface.
