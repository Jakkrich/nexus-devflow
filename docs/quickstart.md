# Quickstart

This guide gets Nexus-DevFlow ready for local use with the `.agent` bundle and the DevFlow 2.0 stage-based model.

## 1. Activate

```powershell
npm.cmd run activate
```

## 2. Validate

```powershell
npm.cmd run validate
```

## 3. Understand The Mainline

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Release -> /70-Report
```

Public companion commands:

```text
Goal
Brainstorm
Research
Debug
PRD
Issue-Triage
Wiki
Help
```

For the full current command policy, see [workflow-surface-map.md](/D:/Projects/nexus-devflow/docs/workflow-surface-map.md:1).

## 4. Workspace Model

DevFlow 2.0 uses markdown-first stage artifacts under `.workspaces/specs/`.

Typical running-id layout:

```text
.workspaces/specs/{ID}-{slug}/
  00-discover.md
  10-define.md
  20-spec.md
  30-plan.md
  40-implement.md
  50-verify.md
  60-release.md
  70-report.md
  70-report.html
```

See [workspace-artifacts.md](workspace-artifacts.md) for the canonical artifact contract.

## 5. First Useful Commands

```powershell
npm.cmd run activate
npm.cmd run validate
npm.cmd run roadmap:validate
npm.cmd run migrate:artifacts -- <project-root>
```

## 6. Recommended Starting Points

- For new work: start at `/00-Discover`
- For partially clear work: start at `/10-Define`
- For work that already has a stable contract: start at `/20-Spec` or `/30-Plan`
- For route guidance: use `Help`
- For product framing before a stable spec: use `PRD`
- For issue-driven intake: use `Issue-Triage`

## Internal Surfaces

Some additional workflow files still exist under `.agent/workflows/`, but they are now considered internal support surfaces or future skill/agent candidates. Do not treat them as the default public command set unless a stage document explicitly points to them.

## Troubleshooting

- If `.agent` files are missing, restore the framework bundle before running validation.
- If `.workspaces/specs/` is missing, run `npm.cmd run activate`.
- If validation fails after structural edits, fix the missing files or docs, then re-run `npm.cmd run validate`.

Do not route new work through retired JSON artifacts. Use the stage markdown templates under `.agent/resources/schemas/` instead.
