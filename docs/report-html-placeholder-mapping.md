---
title: Report HTML Placeholder Mapping
status: active
updated: 2026-06-24
---

# Report HTML Placeholder Mapping

This guide maps every `{{...}}` placeholder in:

```text
.agent/resources/schemas/report.template.html
.agent/resources/schemas/report.template.th.html
```

to the source field or derived value used by the report HTML generator.

Generator:

```text
scripts/generate-report-html.mjs
npm run report:html -- <workspace-path-or-running-id>
```

Locale selection:

```text
70-report.md frontmatter: artifact_language: "en" | "th"
default: "en"
```

Shared renderer boundary:

```text
scripts/render-html.mjs
scripts/lib/render-html/stage-adapters/report-stage.mjs
scripts/lib/render-html/presets/report.mjs
```

Current responsibility split:

- `scripts/render-html.mjs` exposes the shared DevFlow-native HTML CLI
- `scripts/generate-report-html.mjs` stays as the compatibility wrapper for `70-report`
- `scripts/lib/render-html/stage-adapters/report-stage.mjs` maps `70-report.md` and checklist artifacts into renderer metadata
- `scripts/lib/render-html/presets/report.mjs` selects the canonical HTML scaffold:
  - `.agent/resources/schemas/report.template.html` for `artifact_language: "en"`
  - `.agent/resources/schemas/report.template.th.html` for `artifact_language: "th"`

## Source Priority

1. `70-report.md` frontmatter
2. `70-report.md` section content
3. checklist files under `checklists/`
4. workspace path or running ID derived values
5. template-safe fallback values

`artifact_language` is read from `70-report.md` frontmatter first and controls both:

- the HTML shell template language
- derived fallback labels emitted by `report-stage.mjs`

## Text Placeholders

| Placeholder | Filled from | Notes |
| :--- | :--- | :--- |
| `{{report_title}}` | `title` frontmatter in `70-report.md` | Falls back to `Report: {work_title}` |
| `{{report_id}}` | `id` frontmatter in `70-report.md` | Falls back to `{running_id}-report` |
| `{{doc_type}}` | `doc_type` frontmatter | Falls back to `stage` |
| `{{stage}}` | `stage` frontmatter | Falls back to `70-report` |
| `artifact_language` | `artifact_language` frontmatter | Falls back to `en`; used by the renderer to select the HTML shell and locale-aware fallback strings |
| `{{created}}` | `created` frontmatter | Falls back to `updated`, then current date |
| `{{updated}}` | `updated` frontmatter | Falls back to `created`, then current date |
| `{{owner}}` | `owner` frontmatter | Falls back to `unknown` |
| `{{status}}` | `status` frontmatter | Falls back to `draft` |
| `{{footer_text}}` | derived generator string | Summarizes source artifact and mainline next step |

## Section HTML Placeholders

These placeholders are filled with rendered HTML fragments, not plain text.

| Placeholder | Filled from markdown heading in `70-report.md` | Notes |
| :--- | :--- | :--- |
| `{{executive_summary_html}}` | `### Executive Summary` | Markdown converted to HTML |
| `{{work_completed_html}}` | `### Work Completed` | Markdown converted to HTML |
| `{{validation_outcome_html}}` | `### Validation Outcome` | Markdown converted to HTML |
| `{{checklist_summary_html}}` | `### Checklist Summary` | If empty, generator writes a locale-aware summary from checklist stats |
| `{{open_risks_html}}` | `### Open Risks` | Markdown converted to HTML |
| `{{next_actions_html}}` | `### Next Actions` | Markdown converted to HTML |
| `{{additional_notes_html}}` | content under `## 7. Additional Notes` | Markdown converted to HTML |

## Decision Placeholders

| Placeholder | Filled from | Notes |
| :--- | :--- | :--- |
| `{{decisions_html}}` | content under `## 4. Decisions` | Each bullet or paragraph becomes a `.decision-item` block |

## Checklist Placeholders

Checklist data is aggregated from any of these files when present:

- `checklists/master-checklist.md`
- `checklists/implementation-checklist.md`
- `checklists/verification-checklist.md`

The generator parses markdown tables first and falls back to checkbox lines when needed.

Supported checklist line markers:

- `[ ]` -> `pending`
- `[x]` -> `done`
- `[/]` or `[~]` -> `in_progress`
- `[!]` -> `blocked`
- `[-]` -> `skipped`

| Placeholder | Filled from | Notes |
| :--- | :--- | :--- |
| `{{checklist_total}}` | total parsed checklist items | All checklist sources combined |
| `{{checklist_complete}}` | items with status `done` or `completed` | Case-insensitive |
| `{{checklist_blocked}}` | items with status `blocked` | Case-insensitive |
| `{{checklist_skipped}}` | items with status `skipped` | Case-insensitive |
| `{{checklist_rows_html}}` | blocked/skipped checklist rows | Builds HTML table rows with status tags and evidence or note text |

## File List Placeholders

| Placeholder | Filled from | Notes |
| :--- | :--- | :--- |
| `{{inputs_list_html}}` | existing run artifacts in workspace | Includes stage files and checklist files that exist |
| `{{outputs_list_html}}` | generated output files | Always includes `70-report.md` and `70-report.html` |

## Derived Values

| Derived value | Source | Notes |
| :--- | :--- | :--- |
| `running_id` | `related_run` frontmatter, or workspace folder prefix | Example: `001` from `001-sample-task` |
| `work_title` | `title` frontmatter with `Report:` or `รายงานสรุป:` removed, or workspace slug | Used for fallback title generation |

## Fallback Rules

- Missing markdown section -> generator inserts a locale-aware placeholder paragraph
- Missing checklist files -> checklist stats become `0`, blocked/skipped table shows a locale-aware fallback row
- Missing frontmatter values -> generator fills safe defaults
- Missing `artifact_language` -> generator uses English (`en`) for HTML output
- Missing workspace path argument -> generator exits with usage error

## Expected Workspace Inputs

```text
.workspaces/specs/{ID}-{slug}/
  70-report.md
  checklists/
    master-checklist.md
    implementation-checklist.md
    verification-checklist.md
```

Checklist files are optional, but when present they are part of the HTML summary contract.
