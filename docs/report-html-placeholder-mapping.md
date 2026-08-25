---
title: Standalone HTML Report Generation Notes
status: active
updated: 2026-08-25
---

# Standalone HTML Report Generation Notes

Nexus-DevFlow provides a standalone HTML dashboard generator for sharing interactive delivery digests with stakeholders, product managers, or engineering leads.

## Policy & Core Principles

> [!IMPORTANT]
> **No Auto-Generated HTML**: Mainline delivery flows (`/complete`) strictly output Markdown only (`current-feature.md`, `devflow/history/features/`, and `HISTORY.md`).
> The standalone HTML dashboard is generated **on demand** via the dedicated companion command:
> `/report-html` (or `npm run report:html -- {ID}`).

---

## 1. Renderer Entry Points

```bash
# Render report for active or completed work by ID:
npm run report:html -- 001-user-authentication

# Or invoke the companion skill in AI IDE:
/report-html
```

Internal script boundary:
```text
scripts/generate-report-html.mjs
scripts/render-html.mjs
```

---

## 2. Source of Truth Priority

1. `devflow/context/current-feature.md` (Active Living Spec)
2. `devflow/history/features/{ID}.md` / `fixes/{ID}.md` (Archived Delivery Specs)
3. Frontmatter metadata (`title`, `artifact_language`, `owner`, `created`, `status`)
4. Markdown body sections (1. Define, 2. Spec, 3. Plan, 4. Logs, 5. Verification Matrix, 6. Release Digest)

---

## 3. Frontmatter Used By The Renderer

| Field | Purpose |
| :--- | :--- |
| `title` | HTML `<title>` and main dashboard header |
| `artifact_language` | Sets `<html lang="...">` (`th` or `en`; default is `th`) |
| `status` | Displayed status badge (e.g. `completed`, `in-progress`) |
| `owner` | Displayed author / AI Lead badge |
| `created` / `updated` | Timestamp metadata in report header |

---

## 4. Presentation Shell & Features

The generated HTML dashboard includes:
- 📱 Responsive layout with dark / light theme toggle
- 📑 Interactive Table of Contents (TOC) with scroll-spy navigation
- 🧪 Multi-Lane Verification status badges with expandable test logs
- ⚡ Interactive Diff viewer and syntax-highlighted code blocks
- 🖨️ Clean print layout for PDF generation and team sharing
