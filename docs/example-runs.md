# Example Runs

This page shows three canonical DevFlow 2.0 runs using the current public surface only.

## 1. New Feature

Use the full numbered mainline when the work is a new deliverable and the team needs the full artifact chain.

```text
/00-Discover "Add password reset"
/10-Define
/20-Spec
/30-Plan
/40-Implement
/50-Verify
/60-Report
/70-Release
```

Typical outcome:

- `/00-Discover` creates the running ID and captures the request.
- `/10-Define` locks scope, constraints, and success criteria.
- `/20-Spec` turns the defined work into an acceptance-ready delivery contract.
- `/30-Plan` breaks the spec into implementation phases and verification gates.
- `/40-Implement` executes the planned changes.
- `/50-Verify` records the evidence and verdict before the final report.
- `/60-Report` produces the final summary for the run.
- `/70-Release` prepares the release-facing packaging after report sign-off.

## 2. Bug Fix

Use `Debug` when the first job is root-cause investigation, then move into the numbered mainline once the issue is understood well enough to define and deliver the fix.

```text
Debug "Login redirects forever after session expiry"
/10-Define
/20-Spec
/30-Plan
/40-Implement
/50-Verify
```

Why this route fits:

- `Debug` is a public companion command, so it supports the run without replacing the mainline.
- `/10-Define` captures the confirmed bug scope, affected behavior, and fix boundaries.
- `/20-Spec` records the intended fix and acceptance criteria.
- `/30-Plan` converts the fix into concrete implementation and verification work.
- `/40-Implement` applies the code changes.
- `/50-Verify` confirms the redirect loop is resolved and the fix is safe.

## 3. Verification-Heavy Work

For work where proof matters as much as implementation, use a tracked run and let the stage markdown files stay the source of truth. A concrete repository example already exists at [.workspaces/specs/001-integrate-md2html/](D:/Projects/nexus-devflow/.workspaces/specs/001-integrate-md2html/). This run still follows the full mainline overall. The sequence below is the verification-focused portion after the earlier discovery, definition, and spec stages are already in place.

```text
/30-Plan
/40-Implement
/50-Verify
/60-Report
/70-Release
```

How the tracked run artifacts relate:

- [30-plan.md](D:/Projects/nexus-devflow/.workspaces/specs/001-integrate-md2html/30-plan.md) is the planning hub for the run. It defines the execution phases, planned checks, success criteria, and the checklist layer.
- [checklists/implementation-checklist.md](D:/Projects/nexus-devflow/.workspaces/specs/001-integrate-md2html/checklists/implementation-checklist.md) is the live execution source of truth and tracks implementation completion against the planned tasks.
- [checklists/verification-checklist.md](D:/Projects/nexus-devflow/.workspaces/specs/001-integrate-md2html/checklists/verification-checklist.md) tracks the required evidence and validation work for `/50-Verify`.
- [50-verify.md](D:/Projects/nexus-devflow/.workspaces/specs/001-integrate-md2html/50-verify.md) records the checks run, the results, the verdict, and the route to the next stage.
- [60-report.md](D:/Projects/nexus-devflow/.workspaces/specs/001-integrate-md2html/60-report.md) is the source report, and [60-report.html](D:/Projects/nexus-devflow/.workspaces/specs/001-integrate-md2html/60-report.html) is the primary human-friendly output for reading the final result.
- `70-release.md` is created after the report is aligned and the work moves into release packaging.

Reading order for this kind of run:

1. Start with [30-plan.md](D:/Projects/nexus-devflow/.workspaces/specs/001-integrate-md2html/30-plan.md) to understand the intended phases and validation gates.
2. Check the files under [checklists/](D:/Projects/nexus-devflow/.workspaces/specs/001-integrate-md2html/checklists) to see live execution and verification status.
3. Read [50-verify.md](D:/Projects/nexus-devflow/.workspaces/specs/001-integrate-md2html/50-verify.md) for evidence and the route into the report stage.
4. Finish with [60-report.html](D:/Projects/nexus-devflow/.workspaces/specs/001-integrate-md2html/60-report.html) for the readable final output, and use [60-report.md](D:/Projects/nexus-devflow/.workspaces/specs/001-integrate-md2html/60-report.md) when you need the source markdown behind it before release packaging begins.
