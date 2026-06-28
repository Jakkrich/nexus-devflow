# Workspace Artifacts

Nexus-DevFlow 2.0 uses `.workspaces/` as the primary store for task artifacts and supporting run history, following the framework's `markdown-first` contract.

Operational source of truth for command surfaces lives in [AGENTS.md](/D:/Projects/nexus-devflow/AGENTS.md:1) and [workflow-surface-map.md](/D:/Projects/nexus-devflow/docs/workflow-surface-map.md:1). This document explains artifact layout, not command ownership policy.

Phase 1 artifact language control uses `artifact_language: "th"|"en"` in `.agent/resources/schemas/*.template.md`. Workflows should read that value before generating markdown artifact output.

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
|   |-- roadmap-discovery.md
|   `-- {other roadmap notes}.md
|-- wiki/
|   |-- framework/
|   `-- project/
`-- specs/
```

## Folder Responsibilities

| Path | Stores | Related workflows or commands | Keep? |
| :--- | :--- | :--- | :--- |
| `.workspaces/specs/` | Per-running-ID stage artifacts such as `00-discover.md`, `10-define.md`, `20-spec.md`, `30-plan.md`, `40-implement.md`, `50-verify.md`, optional `50-verify-impact.md`, `60-release.md`, `70-report.md`, `70-report.html`, and optional `checklists/` tracking files | `/00-Discover`, `/10-Define`, `/20-Spec`, `/30-Plan`, `/40-Implement`, `/50-Verify`, `/60-Release`, `/70-Report`, `Brainstorm`, `Research`, `Debug`, `Preview` | Yes. This is the core DevFlow 2.0 task store. |
| `.workspaces/roadmap/` | Product discovery notes and supporting roadmap context in markdown form | `Roadmap` work outside the mainline | Yes. This is the roadmap support area. |
| `.workspaces/research/` | Reusable research notes, source-backed findings, brainstorm outputs | `Research`, `Brainstorm`, Discover, Define, Spec | Yes. It is the durable research library. |
| `.workspaces/issues/` | Issue analysis, triage notes, duplicate/spam decisions, source issue summaries | issue triage and debugging support | Yes. It links external issues to implementation work. |
| `.workspaces/prds/` | Product Requirements Documents created before mainline execution | `PRD` and product-definition work | Yes. It bridges product thinking to executable work. |
| `.workspaces/debug/` | Root cause analysis reports and debugging notes | `Debug`, verify follow-up work | Yes. It keeps RCA separate from implementation artifacts. |
| `.workspaces/reports/` | Cross-cutting reports that are not tied to one stage file | verification, review, specialist summaries | Yes. It captures reusable reports outside a single run. |
| `.workspaces/wiki/` | Compiled framework and project knowledge pages with source-backed links | `Wiki`, `Report`, `Help` | Optional. Create it only when wiki capture is actually needed. |

## Top-Level Files

| File | Purpose | Related workflows or commands |
| :--- | :--- | :--- |
| `.workspaces/active-agent.json` | Records the active `.agent` bundle and npm command surface | activation/bootstrap tasks |
| `.workspaces/project_index.json` | Project-wide structure, services, conventions, and commands | indexing, research, planning support during migration |
| `.workspaces/lessons.md` | Durable project lessons, gotchas, patterns, and human preferences | `Debug`, `Wiki`, `Report`, release/review follow-up |

## Task Workspace Files

Each mainline run lives under `.workspaces/specs/{ID}-{slug}/` and uses flat stage filenames in one directory so the work stays easy to inspect, resume, and validate.

### Markdown And HTML Policy

- Markdown stage files are the source of truth across the mainline.
- HTML files are derived artifacts created only when a stage policy requires or enables them.
- In the current framework round, `70-report.html` is the only required HTML stage artifact.
- Future stage HTML outputs should be rendered through the shared renderer path instead of re-implementing markdown-to-html logic per stage.

### Mainline Stage Files

| File | Purpose |
| :--- | :--- |
| `00-discover.md` | Captures the request, context, and opening questions. |
| `10-define.md` | Locks scope, decisions, constraints, and success criteria. |
| `20-spec.md` | Defines the delivery contract and acceptance criteria. |
| `30-plan.md` | Breaks the work down into execution order, risks, and verification approach. |
| `40-implement.md` | Records the implementation work, key changes, and any meaningful deviation. |
| `50-verify.md` | Stores verification evidence, findings, and the quality conclusion. |
| `60-release.md` | Records release readiness, impact, and release-facing cautions. |
| `70-report.md` | Produces the readable final run summary. |
| `70-report.html` | Produces the human-facing rendered version of the final report. |

`50-verify-impact.md` is an optional companion artifact. Create it during `/50-Verify` when the run needs explicit impact, regression-risk, or rollback analysis.

### HTML Rendering Commands

Use the existing report wrapper when rendering the final report:

```powershell
npm.cmd run report:html -- <workspace-path-or-running-id>
```

Use the shared renderer CLI when you want the stage-aware renderer surface directly:

```powershell
npm.cmd run render:html -- --stage 70-report <workspace-path-or-running-id>
```

### Checklist Layer

Use a dedicated checklist folder when people need a live view of task execution:

```text
.workspaces/specs/{ID}-{slug}/checklists/
  implementation-checklist.md
  verification-checklist.md
```

Preferred live checklist format:

```markdown
- [ ] Pending item
- [x] Completed item
- [/] In-progress item
- [!] Blocked item
- [-] Skipped item
```

Supported marker mapping:

| Marker | Status |
| :--- | :--- |
| `[ ]` | `pending` |
| `[x]` | `done` |
| `[/]` or `[~]` | `in_progress` |
| `[!]` | `blocked` |
| `[-]` | `skipped` |

Principles:

1. Checklist files are tied to one running ID.
2. Checklist files make work visible during the run, not only after it finishes.
3. Checklist items should include `status`, `owner`, `updated`, and `evidence`.
4. Checklist files support the stage files. They do not replace `30-plan.md`, `40-implement.md`, or `50-verify.md`.
5. Markdown tables with a `Status` column remain supported for backward compatibility, but checklist UI lines are the preferred human-facing format.
6. Mainline stages use stage-local loop evidence: intent, context, action, observation, adjustment, stop condition, and handoff. Each stage owns only the loop needed for its responsibility; this does not create one global loop across the whole flow.

Recommended use:

- Create initial checklist files during `/30-Plan`.
- Update implementation status during `/40-Implement`.
- Update validation status and release gates during `/50-Verify`.
- Carry any final gate items into `/60-Release`.
- Summarize completion, blockers, and evidence snapshots during `/70-Report`.

### Retired Legacy Files

Legacy task JSON files, roadmap JSON files, and `qa_report.md` are no longer part of the active DevFlow 2.0 workflow surface.

If you find those files in an older workspace:

1. Use them only for historical reading or migration work.
2. Do not treat them as the source of truth for new work.
3. Move any still-needed context back into the relevant stage `.md` file for the current run.

## Workflow Relationships

```text
Mainline:
  /00-Discover       -> .workspaces/specs/{ID}-*/00-discover.md
  /10-Define         -> .workspaces/specs/{ID}-*/10-define.md
  /20-Spec           -> .workspaces/specs/{ID}-*/20-spec.md
  /30-Plan           -> .workspaces/specs/{ID}-*/30-plan.md
  /40-Implement      -> .workspaces/specs/{ID}-*/40-implement.md
  /50-Verify         -> .workspaces/specs/{ID}-*/50-verify.md
  Verify companion   -> .workspaces/specs/{ID}-*/50-verify-impact.md (optional)
  /60-Release        -> .workspaces/specs/{ID}-*/60-release.md
  /70-Report         -> .workspaces/specs/{ID}-*/70-report.md and 70-report.html
  Checklist layer    -> .workspaces/specs/{ID}-*/checklists/*.md

Companion commands:
  Goal               -> routing before a running ID exists or before mainline entry
  Brainstorm         -> usually .workspaces/research/ or appended notes in discover/define
  Research           -> .workspaces/research/
  Debug              -> .workspaces/debug/
  PRD                -> .workspaces/prds/
  Issue-Triage       -> .workspaces/issues/
  Wiki               -> .workspaces/wiki/framework/ or .workspaces/wiki/project/ when the wiki surface is explicitly used
  Help               -> workflow recommendation or routing note
```

## Markdown Metadata Contract

Markdown artifacts in `.workspaces`, `docs`, and the template set should follow the shared rules in [markdown-metadata-contract.md](/D:/Projects/nexus-devflow/docs/markdown-metadata-contract.md).

Core rules:

1. Use YAML frontmatter for document-level metadata.
2. Use heading and tag patterns when the artifact needs to support querying.
3. Keep the required primary headings defined by the relevant stage or workflow template.
4. Allow an open-ended final section when extra context is needed.

## Wiki Layer

The DevFlow wiki is compiled knowledge, not the primary source of truth.

Primary source-of-truth material still lives in:

- code
- stage artifacts
- research notes
- review and debug evidence
- release and report outputs

## Deletion Policy

Avoid creating speculative workspace folders that are never used, and feel free to remove empty or obsolete folders that are no longer referenced.

Safe cleanup targets:

- generated test workspaces such as `.agent/.test-workspace-node`
- obsolete temporary files that are no longer referenced
- migration leftovers that the team has already confirmed are unused

Not safe to delete by default:

- `.workspaces/specs`
- `.workspaces/wiki` once wiki capture has started
- `.workspaces/lessons.md`

## Regeneration

```powershell
npm.cmd run activate
npm.cmd run index
```

## Legacy Migration

Use the migration helper when a project still has legacy run folders such as `.workspaces/001-some-task/00-discover/discover.md`:

```powershell
npm.cmd run migrate:artifacts -- D:\Projects\some-project
npm.cmd run migrate:artifacts -- D:\Projects\some-project --write
```

The command runs as a dry-run by default and moves legacy task artifacts into `.workspaces/specs/{ID}-{slug}/` with flat stage filenames only when `--write` is provided.

## Validation

```powershell
npm.cmd run roadmap:validate
npm.cmd run validate
npm.cmd run validate:all
```

Framework validation checks the main workspace structure, workflow naming, report naming, and roadmap markdown contracts.
