# Roadmap: Nexus-DevFlow Dashboard Upgrade

## 1. Product Direction
- **Vision**: Upgrade `.agent/dashboard/html` into a reliable local operations dashboard for the current Nexus-DevFlow artifact model. The dashboard should show what exists, what is stale, what can be run without AI, and where each file belongs.
- **Target Users**: Developers, SA/BA users, QA reviewers, and maintainers who run Nexus-DevFlow through `.agent` workflows and root npm scripts.
- **Strategic Constraints**: Keep the dashboard static-first where possible, but use the existing local server for actions that require Node.js. Treat `.workspaces` files as source-of-truth artifacts. Use PRP CLI commands instead of manual JSON mutation for any write action.

## 2. Current State
- **Completed Capabilities**: The dashboard already has Kanban, Strategy, Timeline, Stats, Search, modal detail tabs, file viewing for key spec artifacts, folder picker support, local server support through `npm run dashboard`, roadmap artifact health cards, and auto-refresh.
- **Active Work**: Root package scripts already expose `agent`, `agent:status`, `agent:validate`, `dashboard`, `index`, `roadmap:validate`, `sync:check`, `validate`, and Graphify commands. The PRP CLI supports task status updates, logs, events, artifact get/set/append/merge, JSON repair, plan phase/subtask commands, validation, and status.
- **Known Gaps**: Kanban status mapping is not fully aligned with the actual workflow. The real default workflow uses `Planning`, `In Progress`, `AI Review`, `Human Review`, and `Done`, while `Backlog`, `Queue`, and `Error` are supported operational states but are not currently normal workflow steps. Dashboard file viewing only loads a small per-spec subset and does not clearly separate spec files from project-level files. Demo/sample UI features remain visible even though they are not part of real DevFlow operations. There is no dashboard action panel for safe non-AI scripts. Existing text has mojibake artifacts in HTML/JS comments and labels. CSS has animations, but they are not yet organized as a coherent interaction system.

## 3. Roadmap Phases
| Phase | Theme | Outcome | Evidence |
|---|---|---|---|
| Phase 1 | Contract Alignment | Dashboard reads the current DevFlow schema accurately and labels stages consistently. | Default Kanban shows the five active workflow columns: `Planning`, `In Progress`, `AI Review`, `Human Review`, `Done`. `Backlog`, `Queue`, and `Error` are hidden optional/system lanes unless data exists or the user enables them. No task is forced into In Progress just because phases exist. |
| Phase 2 | File Visibility | Every generated workspace artifact is visible from dashboard with clear grouping. | Project files, roadmap files, research, PRDs, reports, debug, issues, lessons, and spec files render in separated sections. |
| Phase 3 | No-AI Operations | Safe scripts can be run from dashboard without invoking an AI agent. | Dashboard exposes validate/status/index/roadmap validation/sync check/Graphify report through a local server API with command output and exit status. |
| Phase 4 | UX Modernization | Dashboard feels current, readable, and useful during daily workflow. | Responsive layout, meaningful micro-interactions, loading/skeleton states, reduced-motion support, and polished file browser/search interactions. |
| Phase 5 | Feature Pruning | Unsupported or misleading legacy dashboard behavior is removed. | Demo data is hidden behind dev mode or removed, stale Strategy assumptions are replaced with current roadmap paths, and unsupported status mutations are routed through PRP CLI only. |
| Phase 6 | Verification And Release | Dashboard upgrade is tested against real workspace artifacts. | `npm run validate`, `npm run agent -- validate`, `npm run dashboard`, browser smoke checks, and sample artifact checks pass. |

## 4. Prioritized Features
| Priority | Feature | Rationale | Source |
|---|---|---|---|
| Must | Replace Kanban stage mapping with the real default DevFlow flow: Planning, In Progress, AI Review, Human Review, Done. | These are the statuses actively used by current numbered workflows. The dashboard should avoid presenting supported-but-unused states as normal workflow steps. | `.agent/workflows/31-Plan.md`, `.agent/workflows/32-Code.md`, `.agent/workflows/33-Verify.md`, `.agent/workflows/34-Human.md`, `.agent/scripts/prp.mjs` |
| Must | Treat Backlog, Queue, and Error as optional/system lanes, not default columns. | `backlog`, `queue`, and `error` are supported by schema/CLI, but current workflows do not normally set them. They should appear only when tasks exist in those states or when a user enables system lanes. | `.agent/resources/schemas/implementation_plan.schema.json`, `.agent/scripts/prp.mjs` |
| Must | Prefer `implementation_plan.status` for Kanban column, then use `xstateState` only as a fallback/resume hint. | The schema describes `status` as Kanban location and `xstateState` as state-machine/resume state. | `.agent/resources/schemas/SCHEMA.md` |
| Must | Add a Workspace Files view with grouped sections: Project, Roadmap, Specs, Research, PRDs, Reports, Debug, Issues, Lessons. | User needs every generated file visible from dashboard and separated by file ownership. | `.workspaces`, `.agent/resources/schemas/README.md` |
| Must | Expand per-spec file manifest to include all current spec artifacts and markdown outputs. | Existing `buildFilesTab()` only loads `implementation_plan.json`, `task_metadata.json`, `task_logs.json`, `spec.md`, `context.json`, `requirements.json`, `plan.md`, and `qa_report.md`. | `.agent/dashboard/html/dashboard.js` |
| Must | Add dashboard-safe script actions for status and validation. | Users should be able to run non-AI operational commands from the dashboard. | `package.json`, `.agent/scripts/prp.mjs`, `.agent/scripts/serve-dashboard.mjs` |
| Should | Add local server API endpoints such as `/api/commands/status`, `/api/commands/validate`, `/api/commands/index`, `/api/files`, and `/api/file?path=...`. | Browser-only static HTML cannot execute npm scripts safely; the existing Node server is the right boundary. | `.agent/scripts/serve-dashboard.mjs` |
| Should | Add command output drawer with copyable output, exit code, duration, and last run timestamp. | Makes no-AI operations auditable and useful without leaving the dashboard. | Dashboard UX |
| Should | Add artifact health states: exists, missing, invalid, stale, generated, unknown. | Current health checks are mostly existence/parse checks and should become workflow-aware. | `.workspaces/project_index.json`, `.workspaces/roadmap/*.json` |
| Should | Replace Demo with real sample detection or move it behind `?demo=1`. | Demo cards can confuse real project state and are not part of current DevFlow. | `.agent/dashboard/html/dashboard.js` |
| Should | Normalize visible text and file encoding to UTF-8. | HTML currently shows mojibake such as `Â·`, `â€”`, and `â€¦`. | `.agent/dashboard/html/dashboard.html`, `.agent/dashboard/html/dashboard.js` |
| Should | Add animation system with lightweight tokens: page enter, card enter, progress fill, command running, toast, and file preview transitions. | Existing animations are scattered; a small system will make the dashboard feel polished without hurting clarity. | `.agent/dashboard/html/dashboard.css` |
| Could | Add task action buttons that generate PRP CLI commands for copy or execute through server API. | Useful middle ground for command safety and script-first JSON rule. | AGENTS.md script-first rule |
| Could | Add schema-aware JSON viewer with validation markers and field descriptions. | Helps users understand artifacts without opening templates manually. | `.agent/resources/schemas/*.schema.json` |
| Could | Add dashboard release checklist. | Prevents future drift when schemas/scripts change. | `npm run validate`, `npm run agent -- validate` |

## 5. Risks And Dependencies
- **Risks**: Browser security prevents running scripts directly from a static page; write actions can corrupt JSON if they bypass PRP CLI; adding too many dashboard controls can make it feel like a partial IDE instead of a workflow monitor; file browsing can expose noisy implementation directories unless grouped carefully.
- **Dependencies**: Node.js local server, root `package.json` scripts, `.agent/scripts/prp.mjs`, `.agent/scripts/serve-dashboard.mjs`, `.agent/resources/schemas`, and the canonical `.workspaces` directory layout.
- **Validation Needed**: Run `npm run validate`, `npm run agent -- validate`, `npm run roadmap:validate`, `npm run dashboard`, and browser smoke tests for Kanban, file browsing, script execution, command output, search, and responsive layout.

## Recommended Implementation Notes
- Use a dashboard data contract module in `dashboard.js` or a new local JS file to centralize status mapping, file manifests, and artifact groups.
- Default Kanban columns should be `planning`, `in_progress`, `ai_review`, `human_review`, and `done`. System lanes should be `backlog`, `queue`, and `error`.
- The dashboard should map display labels with spaces, but keep artifact values as schema values: `in_progress`, `ai_review`, and `human_review`.
- Keep all artifact mutations behind server-side PRP CLI calls. The dashboard may display raw files, but writes should call commands such as `npm run agent -- artifact:set`, `plan:add-phase`, `plan:add-subtask`, `plan:set-subtask-status`, `validate`, and `repair`.
- Treat project-level files and spec-level files differently in the UI:
  - Project files: `.workspaces/project_index.json`, `.workspaces/active-agent.json`, `.workspaces/lessons.md`.
  - Roadmap files: `.workspaces/roadmap/project_index.json`, `.workspaces/roadmap/roadmap_discovery.json`, `.workspaces/roadmap/roadmap.json`, and dashboard roadmap docs.
  - Spec files: `.workspaces/specs/{ID}/spec.md`, JSON artifacts, plan docs, QA docs, review docs.
  - Shared generated files: `.workspaces/research`, `.workspaces/prds`, `.workspaces/reports`, `.workspaces/debug`, `.workspaces/issues`.
- Start with read-only visibility and validation commands first. Add write actions only after command execution, output capture, path safety, and PRP CLI routing are stable.
