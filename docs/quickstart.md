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

## 4. First Example Path

If you are starting new feature work:

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan
```

If the work is large, multi-phase, requirement-heavy, or high-risk, use the same command path but treat it as a manual review flow.
Review each stage artifact before moving to the next command and pay attention to `Approval Status` and `Next Allowed Command`.

If you are fixing a bug:

```text
Debug -> /10-Define -> /20-Spec -> /30-Plan
```

See [docs/example-runs.md](example-runs.md) for a fuller walkthrough.

## 5. Understand The Mainline

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release
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
Check-For-Updates
Help
```

For the full current command policy, see [workflow-surface-map.md](/D:/Projects/nexus-devflow/docs/workflow-surface-map.md:1).
Use `Help` when you are unsure whether a run should stay lightweight or switch into the manual review flow.
For a quick read-only status scan across existing runs, agents or maintainers can also use `node scripts/summarize-run-status.mjs`.

## 6. Workspace Model

DevFlow 2.0 uses markdown-first stage artifacts under `.workspaces/specs/`.
In phase 1, markdown artifact language is controlled by `artifact_language` in the matching schema template under `.agent/resources/schemas/`.
The mainline stage templates also include manual review sections so humans can inspect `Source Inputs`, `AI Actions Performed`, `Human Review Required`, `Approval Status`, and `Next Allowed Command` before moving forward.

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
  60-report.md
  60-report.html
  70-release.md
```

`50-verify-impact.md` is optional and is typically created during `/50-Verify` when the run needs explicit impact, regression-risk, or rollback analysis.

See [workspace-artifacts.md](workspace-artifacts.md) for the canonical artifact contract.
See [manual-review-workflow-spec.md](manual-review-workflow-spec.md) for the manual review operating model and naming guidance.
Use `npm.cmd run artifact-language:switch -- en` or `npm.cmd run artifact-language:switch -- th` to change the template default for all markdown artifacts.

## Internal Surfaces

Some additional workflow files still exist under `.agent/workflows/`, but they are now considered internal support surfaces or future skill/agent candidates. Do not treat them as the default public command set unless a stage document explicitly points to them.

## Troubleshooting

- If `.agent` files are missing, restore the framework bundle before running validation.
- If `.workspaces/specs/` is missing, run `npm.cmd run activate`.
- If validation fails after structural edits, fix the missing files or docs, then re-run `npm.cmd run validate`.

Do not route new work through retired JSON artifacts. Use the stage markdown templates under `.agent/resources/schemas/` instead.
