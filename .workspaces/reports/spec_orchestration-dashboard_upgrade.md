# 🎼 Spec Orchestration Report: Dashboard Upgrade

> **Source Trigger**: `/18-Spec-Orchestrate`
> **Orchestrator**: Spec Orchestrator Agent
> **Date**: 2026-05-19

---

## 🏗️ 1. Conceptual Framework & Scope
- **Problem Statement**:
  The Nexus-DevFlow local operations dashboard at `.agent/dashboard/html` has drifted from the actual developer workflows and schemas:
  1. The Kanban status lanes do not align with the standard DevFlow stages (`Planning`, `In Progress`, `AI Review`, `Human Review`, `Done`). Instead, it displays system lanes (`Backlog`, `Queue`, `Error`) as default columns, which are rarely populated in normal development.
  2. The file explorer is limited to a small subset of spec files, failing to expose workspace-wide artifacts like research logs, PRDs, competitor analyses, lessons, and debug summaries grouped logically by system ownership.
  3. Safe non-AI script executions (e.g. status updates, validation, Graphify updates, project index generation) lack visible UI controls, command execution drawers, durational metrics, and exit code captures.
  4. The visual elements have text encoding issues (mojibake) and lack lightweight transition micro-animations to feel cohesive and premium.

- **MVP Boundaries**:
  - **In-Scope (Deliverables)**:
    - **Phase 1: Contract Alignment**: Re-align default Kanban columns to represent the 5 default workflow lanes: `Planning`, `In Progress`, `AI Review`, `Human Review`, `Done`. Keep `Backlog`, `Queue`, and `Error` as system lanes that remain collapsed/hidden unless tasks exist in them or the user explicitly enables them. Map statuses from `plan.status` (primary) and use `plan.xstateState` only as a fallback.
    - **Phase 2: Grouped File Visibility**: Expose a workspace files panel that groups files by ownership: Project, Roadmap, Specs, Research, PRDs, Reports, Debug, Issues, Lessons. Expand the per-spec view to include all markdown deliverables (`spec.md`, `plan.md`, `qa_report.md`).
    - **Phase 3: Command Runner UI**: Add an interactive command runner console that executes non-AI scripts (e.g. `validate`, `status`, `index`, `roadmap:validate`, `sync:check`, `graphify`) through local Node endpoints, printing live command outputs, exit codes, and durations.
    - **Phase 4: Aesthetic & UX Modernization**: Fix mojibake characters to clean UTF-8. Introduce modern Inter/Outfit Google Fonts, harmonic HSL styling palettes, glassmorphism headers, subtle page-entry transitions, loading skeletons, and a dark/light mode optimization.
    - **Phase 5: Feature Pruning**: Hide/remove unsupported legacy UI elements or demo data behind `?demo=1`. Prevent direct client-side state mutations, routing all task state operations strictly through copyable PRP CLI commands or safe Node server scripts.
  - **Out-of-Scope (Future Phases)**:
    - Direct write-back file editing from the browser bypassing the PRP CLI (violates the script-first JSON rule).
    - Remote web deployment or cloud authentication (keep local IndexedDB and static-first design).

- **Acceptance Signals**:
  1. All root commands (`npm run validate`, `npm run agent -- validate`, `npm run dashboard`) compile and pass.
  2. Default Kanban columns render exactly as: `Planning`, `In Progress`, `AI Review`, `Human Review`, `Done`.
  3. Interactive Ops tab executes framework validation and status checks, displaying real-time shell stdout/stderr logs.
  4. Grouped sidebar in Files tab accurately displays all `.workspaces` files separated by category (Roadmap, Specs, PRDs, Reports, etc.).
  5. Standard CSS transitions operate smoothly across all major view switches.

---

## 🗺️ 2. Supporting Workflows Route Map
To assemble the final requirements, the following workflows are recommended in sequential order:

1.  **`/30-Task 003-dashboard-upgrade`** or **`npm run agent -- task:create 003-dashboard-upgrade`**: Initialize task tracking workspaces and generate `spec.md` with detailed requirements.
2.  **`/31-Plan`**: Develop a rigorous phase-by-phase implementation plan based on the specification.
3.  **`/32-Code`**: Execute the coded modifications to `dashboard.js`, `dashboard-status.js`, `dashboard-files.js`, `dashboard.css`, and `serve-dashboard.mjs` in verified increments.
4.  **`/33-Verify`**: Trigger comprehensive manual and automated smoke tests to confirm visual and operational compliance.

---

## ⚠️ 3. Spec Critic Analysis
*A Senior Spec Critic evaluation of potential risks and underspecified details:*

- **Missing Acceptance Criteria**:
  - *Direct writes vs. PRP CLI*: Allowing the browser to directly edit workspace JSON files poses a high risk of schema corruption. All mutations must be handled by copyable PRP CLI statements or backend Node scripts calling `prp.mjs`.
  - *Column State Persistence*: Toggled columns (`collapsed`/`expanded` states) should persist in `localStorage` so that auto-refresh intervals do not reset the user's customized Kanban layout.
  - *Fallback Directory Mode*: If the dashboard is loaded via the `file://` protocol where CORS blocks HTTP requests, it should automatically hide the Operations (Ops) tab and gracefully switch into read-only folder-browse mode.

- **Unverified Dependencies**:
  - *Windows Command Spawning*: Spawning Node commands via `child_process.spawn` on Windows can encounter execution issues when space characters exist in project roots. The dashboard server must spawn processes directly using Node's executable path with an arguments array, avoiding unsafe shell execution.

- **Ambiguous Data Behaviors**:
  - *Missing Workspace Configs*: If `.workspaces/project_index.json` or `roadmap.json` are absent or corrupted, the dashboard must not crash. It should gracefully fallback to default placeholders and render warning banners.
  - *Encoding Discrepancy*: Text and file encodings must be explicitly defined as `utf-8` on both client meta-tags and server response headers to prevent mojibake artifacts.

- **Mitigation Action**:
  - Add robust ErrorBoundaries to `dashboard.js`. Provide helper functions inside `dashboard-status.js` that check for File System Access API availability. Ensure the Node server uses `{ shell: false, windowsHide: true }` when spawning commands to avoid terminal popups and command injection vulnerabilities.

---

## 📌 4. Concrete Next Command
Run this command to proceed with discovery/planning:
```text
/30-Task 003-dashboard-upgrade
```
