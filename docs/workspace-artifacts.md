# Workspace Artifacts

Nexus-DevFlow stores generated project memory and machine-readable workflow artifacts under `.workspaces`.

## Canonical Layout

```text
.workspaces/
|-- active-agent.json
|-- project_index.json
|-- lessons.md
|-- debug/
|-- issues/
|-- prds/
|-- reports/
|-- research/
|-- roadmap/
|   |-- project_index.json
|   |-- roadmap_discovery.json
|   `-- roadmap.json
`-- specs/
```

## Folder Responsibilities

| Path | Stores | Related Workflows | Keep? |
| :--- | :--- | :--- | :--- |
| `.workspaces/specs/` | Per-task workspaces: `spec.md`, `requirements.json`, `implementation_plan.json`, `context.json`, `task_logs.json`, `qa_report.md` | `/30-Task`, `/31-Plan`, `/32-Code`, `/33-Verify`, `/34-Human`, `/35-Followup`, `/39-QA-Orchestrate`, `/54-Insight`, `/90-Agent` | Yes. This is the core PRP task store. |
| `.workspaces/roadmap/` | Product discovery, roadmap phases, feature priorities, roadmap project index | `/16-Competitor`, `/17-Roadmap`, `/18-Spec-Orchestrate` | Yes. Required by `npm run roadmap:validate`. |
| `.workspaces/research/` | Reusable research reports, integration notes, codebase research, source-backed findings | `/11-Research`, `/15-Spec-Research`, `/16-Competitor`, `/18-Spec-Orchestrate` | Yes. It is the durable research library. |
| `.workspaces/issues/` | Staged issue analysis, triage notes, duplicate/spam decisions, source issue summaries | `/57-Issue-Triage`, `/20-Debug`, `/30-Task` | Yes. It links external issues to PRP tasks. |
| `.workspaces/prds/` | Product Requirements Documents generated before task creation | `/12-PRD`, `/18-Spec-Orchestrate`, `/16-Competitor`, `/17-Roadmap` | Yes. It bridges product thinking to executable tasks. |
| `.workspaces/debug/` | Root cause analysis reports and debugging notes | `/20-Debug`, `/39-QA-Orchestrate`, `/54-Insight` | Yes. It keeps RCA separate from implementation artifacts. |
| `.workspaces/reports/` | Specialist agent reports and cross-cutting review outputs | `/14-Orchestrate`, `/39-QA-Orchestrate`, `/55-PR-Review`, `/56-PR-Followup`, `/90-Agent` | Yes. It captures reports that are not tied to one task artifact. |

## Top-Level Files

| File | Purpose | Related Workflows |
| :--- | :--- | :--- |
| `.workspaces/active-agent.json` | Records the active `.agent` bundle and npm command surface | `/00-Init`, `npm run activate` |
| `.workspaces/project_index.json` | Project-wide structure, services, conventions, and commands | `/00-Init`, `/11-Research`, `/31-Plan`, `npm run index` |
| `.workspaces/lessons.md` | Durable project lessons, gotchas, patterns, and human preferences | `/20-Debug`, `/34-Human`, `/53-Changelog`, `/54-Insight`, `/99-Coach` |

## Task Workspace Files

Each PRP task lives under `.workspaces/specs/{ID}-{slug}/`.

| File | Purpose |
| :--- | :--- |
| `spec.md` | Human-readable task specification |
| `requirements.json` | Structured requirements, constraints, acceptance criteria, and metadata |
| `implementation_plan.json` | Phases, subtasks, dependency order, verification commands, and progress |
| `context.json` | Relevant codebase context and reusable project patterns |
| `complexity_assessment.json` | Scope, risk, and complexity classification |
| `task_logs.json` | Progress logs and structured events |
| `qa_report.md` | Human-readable verification result |

JSON files should be changed with `npm run agent -- artifact:*`, `npm run agent -- plan:*`, `npm run agent -- json:repair`, and `npm run agent -- validate` whenever possible.

## Workflow Relationships

```text
Discovery:
  /10-Brainstorm
  /11-Research       -> .workspaces/research/
  /12-PRD            -> .workspaces/prds/
  /15-Spec-Research  -> .workspaces/research/
  /16-Competitor     -> .workspaces/research/ and .workspaces/roadmap/
  /17-Roadmap        -> .workspaces/roadmap/
  /18-Spec-Orchestrate -> .workspaces/prds/, research/, specs/

Execution:
  /30-Task           -> .workspaces/specs/{ID}-*/
  /31-Plan           -> .workspaces/specs/{ID}-*/implementation_plan.json
  /32-Code           -> .workspaces/specs/{ID}-*/task_logs.json
  /33-Verify         -> .workspaces/specs/{ID}-*/qa_report.md
  /34-Human          -> .workspaces/specs/{ID}-*/qa_report.md and .workspaces/lessons.md
  /35-Followup       -> .workspaces/specs/{ID}-*/implementation_plan.json

Quality and Review:
  /20-Debug          -> .workspaces/debug/
  /39-QA-Orchestrate -> .workspaces/reports/ or task qa_report.md
  /55-PR-Review      -> .workspaces/reports/
  /56-PR-Followup    -> .workspaces/reports/ and/or specs/{ID}-*/
  /57-Issue-Triage   -> .workspaces/issues/
  /54-Insight        -> .workspaces/lessons.md and task logs
```

## Deletion Policy

Do not delete the canonical `.workspaces` folders just because they are empty. Empty folders with `.gitkeep` are intentional staging areas for workflows.

Safe cleanup targets:

- generated test workspaces such as `.agent/.test-workspace-node`
- obsolete task folders only after the user confirms they are no longer needed
- temporary research/report files that are not linked from PRDs, tasks, roadmap, or lessons

Not safe to delete by default:

- `.workspaces/specs`
- `.workspaces/roadmap`
- `.workspaces/research`
- `.workspaces/issues`
- `.workspaces/prds`
- `.workspaces/debug`
- `.workspaces/reports`
- `.workspaces/lessons.md`

## Regeneration

```powershell
npm.cmd run activate
npm.cmd run index
```

`npm run activate` prepares canonical directories and metadata. `npm run index` refreshes project index files after structure changes.

## Validation

```powershell
npm.cmd run validate
npm.cmd run roadmap:validate
```

Validation checks JSON syntax, required fields, roadmap feature references, workflow numbering, and expected file locations.

Task-level validation:

```powershell
npm.cmd run agent -- plan:validate 001
npm.cmd run agent -- validate 001
```

