---
title: Report HTML Rendering Notes
status: active
updated: 2026-06-24
---

# Report HTML Rendering Notes

`70-report.html` is rendered directly from `70-report.md`. The markdown report is the source of truth.

Renderer entry points:

```text
scripts/generate-report-html.mjs
scripts/render-html.mjs --stage 70-report <workspace-path-or-running-id>
npm run report:html -- <workspace-path-or-running-id>
```

Renderer boundary:

```text
scripts/lib/render-html/stage-adapters/report-stage.mjs
scripts/lib/render-html/presets/report.mjs
scripts/lib/render-html/markdown.mjs
```

## Current Behavior

- `report-stage.mjs` resolves the workspace and reads `70-report.md`
- `report.mjs` parses frontmatter, sets the document language, and renders the markdown body into the report HTML shell
- `markdown.mjs` converts headings, lists, paragraphs, inline code, links, bold text, and fenced code blocks into HTML

## Source Priority

1. `70-report.md` frontmatter
2. `70-report.md` body content
3. renderer defaults

## Frontmatter Used By The Renderer

| Field | Purpose |
| :--- | :--- |
| `title` | HTML `<title>` and visible report heading fallback |
| `artifact_language` | sets `<html lang="...">`; `th` and `en` are supported, default is `en` |

Other frontmatter can still exist for workflow contract purposes, but it is not required for HTML layout generation.

## Checklist Guidance

Checklist artifacts are no longer injected into `70-report.html` by template placeholder mapping.

If checklist completion, blockers, skipped items, or evidence snapshots matter to the final report, include that summary explicitly in `70-report.md`, typically under:

- `### Checklist Summary`
- `### Validation Outcome`
- `### Next Actions`

## Expected Workspace Inputs

```text
.workspaces/specs/{ID}-{slug}/
  70-report.md
  70-report.html
```

Optional checklist files may still exist beside the report, but the renderer does not pull them into HTML automatically.
