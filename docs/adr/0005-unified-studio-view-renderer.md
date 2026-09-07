# 0005: Unify Web Dashboard and Webview Studio under StudioViewRenderer

## Context & Decision

Nexus-DevFlow previously maintained two independent presentation engines that rendered 3-Pillars status interfaces:
1. `dashboard-page.ts` (47.7 KB): generated the full HTML page, CSS design tokens, steppers, stats cards, and client-side polling scripts for the local HTTP browser server (`DashboardHttpServerAdapter`).
2. `webview-studio.ts` (19.9 KB): generated an isolated HTML document with VS Code theme awareness and iframe message passing for the IDE Webview Studio (served via MCP `devflow_get_studio_html`).

These two implementations duplicated over 67 KB of boilerplate code, including HTML escaping logic, JSON snapshot serialization, 3-Pillars card components (Ideas Inbox, Active Tasks, History Archive), and CSS styling tokens. Updating a badge, theme color, or component required dual maintenance in two separate files.

We decided to create a deep **Studio View Renderer** (`StudioViewRenderer` class in `packages/create-nexus-devflow/lib/studio-view-renderer.ts`) that unifies the component presentation layer across both web and webview environments. It provides shared design tokens (with adaptive VS Code CSS variable support), centralized HTML escaping, reusable 3-Pillars component cards, and pluggable transport scripts (`web` vs `webview`).

## Considered Options

- **Keep two independent template strings**: Rejected because maintaining 67 KB of duplicated UI code increases visual drift, doubles maintenance cost, and duplicates security-critical XSS escaping logic.
- **Render minimal HTML fragments without unified styles**: Rejected because IDE webviews and browser pages require full document scaffolding with isolated styling.

## Consequences

- Web Dashboard and IDE Webview Studio share a single authoritative component and rendering seam (`StudioViewRenderer`).
- CSS variables adapt automatically between native VS Code themes in IDE Webviews and Nexus Enterprise Dark in browsers.
- Security and serialization logic (`escapeHtml`, `escapeJsonForHtml`) is consolidated into one tested location.
- Legacy helper functions (`renderDashboardPage`, `renderStudioHtml`) remain supported as backward-compatible facade wrappers delegating to `StudioViewRenderer`.
