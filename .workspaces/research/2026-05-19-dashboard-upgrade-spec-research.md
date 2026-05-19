# Spec Research: Dashboard Upgrade

## 1. Integration Scope
- **Topic**: Dashboard Upgrade
- **Task / PRD Reference**: `dashboard_upgrade_roadmap.md`
- **Dependencies Reviewed**: Node.js standard libraries (`node:child_process`, `node:fs/promises`, `node:http`, `node:path`), File System Access API (`window.showDirectoryPicker`), HTTP CORS & fallbacks, DOMParser directory listing, Marked.js (Markdown parsing), FontAwesome (icons).

## 2. Official Sources
| Source | What Was Verified | Notes |
|---|---|---|
| MDN Web Docs - File System Access API | `window.showDirectoryPicker` constraints and permissions | Requires a secure context (localhost, 127.0.0.1, or HTTPS). Fallbacks are necessary for browsers lacking support or when CORS prevents filesystem access. |
| Node.js child_process.spawn | Process spawning, stdout/stderr streams, and environment variables | `{ shell: false }` protects against shell injections. Passing `{ FORCE_COLOR: '0', NO_COLOR: '1' }` in env eliminates ANSI color codes, ensuring clean plaintext rendering in HTML `<pre>` tags. |
| Marked.js Documentation | Client-side HTML parsing of Markdown files via CDN | CDN import of `marked.min.js` works out of the box and is stable for rendering spec artifacts (`spec.md`, `plan.md`, `qa_report.md`). |
| USAGE.md & SCHEMA.md | DevFlow default workflow statuses and schema properties | Real default stages: `planning`, `in_progress`, `ai_review`, `human_review`, and `done`. Primary column state is `plan.status` with `plan.xstateState` as a fallback. |

## 3. Implementation Facts
- **Package / SDK Names**: Standard Node.js library modules, client-side vanilla Javascript ES modules, CSS-first design, FontAwesome 6, Marked.js CDN.
- **Install Commands**: No new npm installations are required. The dashboard remains static-first, lightweight, and zero-dependency beyond standard Node.js runtime.
- **Imports / Initialization**:
  - Backend: `import { spawn } from 'node:child_process';`
  - Frontend: `import { KANBAN_COLUMNS } from './dashboard-status.js';`
  - Markdown CDN: `<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js"></script>`
- **Configuration Requirements**:
  - Environment variables: `PORT` or `DASHBOARD_PORT` defaults to `5050`.
  - Secure context is auto-guaranteed on `http://localhost:5050/` or `http://127.0.0.1:5050/`.
- **Auth / Permissions**:
  - Filesystem permission is read-only.
  - No credentials or authentication keys are needed as it operates strictly on a localhost loopback.

## 4. Constraints And Limits
- **Rate Limits / Quotas**: No rate limits exist for localhost API calls.
- **Compatibility Constraints**: Supported on Node.js >= 18.17. Compatible with modern Chromium-based browsers (Chrome, Edge) supporting ES modules and File System Access APIs.
- **Security Requirements**:
  - **CRITICAL**: To prevent arbitrary command injection, the server command registry must remain strictly hardcoded. The dashboard client can only execute pre-registered command IDs (e.g., `validate`, `status`, `index`).
  - **CRITICAL**: The `safeResolve` helper in `serve-dashboard.mjs` must filter out any directory traversal paths (e.g., `..`) to prevent accessing files outside the project root workspace.
- **Operational Gotchas**:
  - In a non-Chromium browser or secure context failure, the browser won't allow folder picking. An HTTP JSON fallback (`/api/files`) is recommended so that the dashboard remains fully functional without permission prompts.

## 5. Recommended Implementation Notes
- **Suggested Approach**:
  1. **API Optimization**: Add a `GET /api/files` endpoint in `serve-dashboard.mjs` that scans `.workspaces` and returns a structured JSON of files grouped by ownership category. This replaces the brittle client-side DOMParser scraping.
  2. **Kanban stage alignment**: Update `dashboard-status.js` constants to hide `backlog`, `queue`, and `error` system lanes unless they contain active tasks or the user enables them.
  3. **File browser sidebar**: Refactor `dashboard.js` and `dashboard-files.js` to render the grouped layout (Project, Roadmap, Specs, Research, PRDs, Reports, Debug, Issues, Lessons) with nice custom icons.
  4. **Command Runner Output**: Style the commands UI in `dashboard.css` using sleek dark themes, copyable buttons, exit status badges, and lightweight entry transitions.
- **Validation Commands**:
  - Run framework validation: `npm run validate`
  - Run artifact schema validation: `npm run agent -- validate`
  - Start preview server: `npm run dashboard`
- **Follow-Up Tasks**: Create a spec file and initialize the development lifecycle.

## 6. Unknowns
- [ ] Determine if spawning commands on Windows shells pops up visible terminal windows (mitigated by setting `{ windowsHide: true }` in spawn options).
- [ ] Verify if Marked.js successfully renders complex inline Mermaid diagrams or HTML blocks without extra sanitizer issues.
