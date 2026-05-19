# Product Requirements Document: Nexus-DevFlow Local Operations Dashboard Upgrade

## 1. Problem Statement
- **Target User**: Software developers, SA/BAs, QA engineers, and system operators who run Nexus-DevFlow locally to build software using AI-human pair programming.
- **Problem**: The local companion dashboard (`.agent/dashboard/html`) has drifted from standard DevFlow schemas and workflows:
  1. The Kanban columns do not represent the 5 active stages of the real PRP task cycle (`Planning`, `In Progress`, `AI Review`, `Human Review`, `Done`). Instead, it forces system/optional columns like `Backlog`, `Queue`, and `Error` as default lanes, creating unnecessary visual clutter.
  2. The file browser is restricted to a small subset of spec JSONs and fails to show workspace-wide artifacts like research logs, PRDs, competitor analyses, lessons, and debug reports grouped by ownership.
  3. Safe non-AI automation scripts (e.g. status updates, validation check, Graphify indexer) lack simple visual buttons, live console output drawers, execution durations, and exit code monitors.
  4. The user interface has minor text encoding errors (mojibake) and lacks lightweight modern transitions to feel premium and polished.
- **Why Now**: As agentic coding workflows mature, developers lose time repeatedly navigating directories, copying task JSONs, and typing terminal check commands. Upgrading this visual companion dashboard immediately eliminates terminal fatigue and prevents manual state sync mistakes.

## 2. Goals And Success Metrics
- **Goals**:
  - Re-align Kanban columns to match default workflow schemas, keeping system lanes hidden conditionally.
  - Deliver a grouped workspace file browser that organizes project files, roadmap docs, specs, research, PRDs, reports, debug sheets, issues, and lessons.
  - Implement a secure console panel that triggers, monitors, and prints live logs of pre-registered safe npm/Node scripts.
  - Clean all visual text of encoding errors and introduce Outfit/Inter typography, harmonious HSL dark/light modes, glassmorphism headers, and sleek animations.
- **Non-Goals**:
  - Enabling direct client-side code modification from the browser (violates the CLI script-first JSON rule).
  - Building cloud synchronization, databases, or user auth systems (must remain local-first and private).
- **Success Metrics**:
  - **100% Schema Alignment**: Tasks are mapped to standard columns flawlessly.
  - **Zero Telemetry / Privacy**: No cloud calls or external analytics, operating 100% on localhost loopback.
  - **Zero Mojibake**: All visual text and characters render in clear, clean UTF-8.
  - **Sleek Ops Spawner**: Registered scripts run, capture exit code, and print stdout/stderr in under 100ms lag.

## 3. Hypotheses
- **Product Hypothesis**: Providing a unified visual board for Kanban and grouped workspace files reduces developers' cognitive load from command-line navigation and increases confidence in task status.
- **Technical Hypothesis**: Exposing a secure HTTP JSON endpoint `/api/files` on the local Node server eliminates browser directory picker permission prompts (`window.showDirectoryPicker`), enabling frictionless load times.
- **Risk Hypothesis**: Executing scripts from a web page poses command execution vulnerabilities. Spawning strictly hardcoded pre-registered command IDs in an arguments array (with `{ shell: false }`) completely mitigates this.

## 4. Scope
- **Must Have**:
  - Kanban columns: `Planning`, `In Progress`, `AI Review`, `Human Review`, `Done`.
  - Conditional system lanes: `Backlog`, `Queue`, `Error` (collapsed/hidden unless they contain tasks).
  - Column persistence: Toggled column states are saved in `localStorage`.
  - Grouped sidebar in Files view: Project, Roadmap, Specs, Research, PRDs, Reports, Debug, Issues, Lessons.
  - Expanded spec markdown reader: Load `spec.md`, `plan.md`, and `qa_report.md` on demand.
  - Secure Operations panel: Command buttons with terminal output drawer, duration, exit code, and last-run timestamp.
  - UTF-8 validation: Elimination of mojibake characters.
  - Modern transition styles and page-entry cards.
- **Should Have**:
  - `/api/files` server directory scan API.
  - Copyable command buttons next to Kanban cards.
  - Premium dark/light themes with Outfit and Inter fonts.
- **Won't Have**:
  - Direct browser-based write-backs to project files (read-only views only).
  - Multi-user logins or cloud databases.

## 5. User Experience
- **Primary Workflow**:
  1. Developer starts the server: `npm run dashboard`.
  2. Browser auto-opens to `http://localhost:5050/`.
  3. Dashboard automatically detects secure localhost context, fetches `/api/files` and `.workspaces` state, and populates the Kanban and Files sidebar in under 100ms.
  4. Developer clicks the **Ops** tab to run `validate` or `graphify` and monitors the live command output inside the drawer.
- **Edge Cases**:
  - *No Server Connection*: If opened via static `file://` protocol, the UI displays a helpful prompt to run `npm run dashboard` and falls back gracefully to folder-picker mode, hiding the Ops tab.
  - *Missing files*: If `project_index.json` is missing or corrupted, the dashboard falls back to standard placeholders and renders a warning banner rather than crashing.
- **Accessibility / UX Notes**:
  - Dark/light mode support.
  - Fluid card entrance transitions.
  - Glassmorphic top headers.
  - High-contrast typography with 80/20 hierarchical emphasis.

## 6. Implementation Phases
| Phase | Outcome | Dependencies | Validation |
|---|---|---|---|
| Phase 1 | **Contract Alignment**: Kanban shows 5 standard workflow columns. System lanes collapsed by default. Fallback logic maps schema states correctly. | None | Kanban view verification, `npm run agent -- validate` check. |
| Phase 2 | **File Visibility**: Files tab groups files by ownership. Expanded spec markdown renderer works in detailed modals. | Phase 1 | Verify sidebar lists specs, research, prds, reports, debug, etc. and loads files cleanly. |
| Phase 3 | **No-AI Operations**: Secure script command panel executes status, validation, indexing, and Graphify with stdout/stderr capture drawers. | Phase 2 | Trigger validation from Ops panel, confirm exit status, duration, and output logs. |
| Phase 4 | **UX Modernization**: Google Fonts (Inter/Outfit), clean UTF-8 text, glassmorphism UI, page entrance transitions, dark theme support. | Phase 3 | Visual smoke checks, verify all mojibake is eliminated. |
| Phase 5 | **Feature Pruning & Release**: Clean codebase, legacy code paths pruned, demo data under `?demo=1`, release checklists pass. | Phase 4 | Run `npm run validate`, standard checks, and verify correct terminal server start. |

## 7. Open Questions
- [ ] Should the Operations panel support real-time execution termination (killing a long-running validation task)? *(Yes, already supported in server process registry via `child.kill()` inside timeout timers)*.
- [ ] Should we provide a quick button next to Kanban cards to copy the exact `npm run agent -- plan:set-subtask-status` command? *(Yes, this is an excellent middle ground that respects the script-first JSON rule)*.
