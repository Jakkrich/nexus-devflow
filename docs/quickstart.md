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

## 3. Choose A Start Point

- Start with `/00-Discover` when the work is new
- Start with `Help` when the route is unclear
- Start with `Debug` when you need root-cause investigation before scoping the fix

## 4. Understand The Mainline

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

## 5. Workspace Model

DevFlow 2.0 uses markdown-first stage artifacts under `.workspaces/specs/`.
In phase 1, markdown artifact language is controlled by `artifact_language` in the matching schema template under `.agent/resources/schemas/`.

Typical running-id layout:

```text
.workspaces/specs/{ID}-{slug}/
  00-discover.md
  10-define.md
  20-spec.md
  30-plan.md
  40-implement.md
  50-verify.md
  50-verify-impact.md
  60-release.md
  70-report.md
  70-report.html
```

`50-verify-impact.md` is optional and is typically created during `/50-Verify` when the run needs explicit impact, regression-risk, or rollback analysis.

See [workspace-artifacts.md](workspace-artifacts.md) for the canonical artifact contract.
Use `npm.cmd run artifact-language:switch -- en` or `npm.cmd run artifact-language:switch -- th` to change the template default for all markdown artifacts.

## 6. First Example Path

If you are starting new feature work:

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan
```

If you are fixing a bug:

```text
Debug -> /10-Define -> /20-Spec -> /30-Plan
```

See `docs/example-runs.md` for a fuller walkthrough.

## Internal Surfaces

Some additional workflow files still exist under `.agent/workflows/`, but they are now considered internal support surfaces or future skill/agent candidates. Do not treat them as the default public command set unless a stage document explicitly points to them.

## Troubleshooting

- If `.agent` files are missing, restore the framework bundle before running validation.
- If `.workspaces/specs/` is missing, run `npm.cmd run activate`.
- If validation fails after structural edits, fix the missing files or docs, then re-run `npm.cmd run validate`.

Do not route new work through retired JSON artifacts. Use the stage markdown templates under `.agent/resources/schemas/` instead.
