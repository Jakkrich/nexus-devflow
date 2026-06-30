---
description: Release stage in DevFlow 2.0 - package verified work for delivery, merge, PR, deployment, or handoff.
argument-hint: "{running-id or workspace path}"
---

# Phase 70: Release

$ARGUMENTS

Package approved work for delivery after the report stage has captured the final verified story. This stage turns report sign-off into release-ready execution and handoff.

## Usage

```text
/70-Release {running-id or workspace path}
```

Use this when:

- `/60-Report` is complete
- the work needs release execution or a release-facing handoff packet
- downstream stakeholders need delivery notes instead of raw implementation detail

## Markdown-First Contract

Write the primary stage artifact to:

```text
.workspaces/specs/{ID}-{slug}/70-release.md
```

using:

```text
.agent/resources/schemas/release.template.md
```

Before writing `70-release.md`, read `artifact_language` from `release.template.md` and produce the artifact in that language.

## Process

### 1. Load Verified Context

Read:

- `60-report.md`
- `50-verify.md`
- `40-implement.md`
- `20-spec.md`
- any PR, deploy, merge, or handoff notes already captured

### 2. Package The Release Outcome

Summarize:

- what is being delivered
- what changed in user or system terms
- what state the work is in for PR, deploy, merge, or handoff
- what follow-up items remain

### 3. Write `70-release.md`

Keep the language understandable for someone who did not do the work.
Follow the `artifact_language` configured in `release.template.md`.

Prefer clear release-note style wording:

- what was added
- what changed
- what was fixed
- what is intentionally deferred

### 4. Confirm Readiness

If release readiness changes because unresolved issues are found:

- route back to `/50-Verify` or `/40-Implement`

Do not package unfinished work as release-ready through wording tricks.

### 5. Manual Review Soft Gate

Before closing the mainline run, warn when release approval is still pending.
If release blockers, operator questions, or handoff approvals remain open:

- mark them visibly in `70-release.md`
- recommend human confirmation before closing the phase
- keep the mainline closeout as a soft recommendation only

## Output

Report:

- delivered scope
- release, PR, merge, deploy, or handoff state
- follow-up items
- recommended next step

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `/60-Report`
- Next state: End of the mainline run when release packaging or handoff is complete
- Common companion commands: `Commit`, `PR`, `Deploy`, `Changelog`, `Merge`, `Wiki`

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/release.template.md`
- Related commands: `/60-Report`, `Commit`, `PR`, `Deploy`, `Changelog`, `Merge`, `Wiki`

## Next Workflow Recommendation

- **Primary**: End of Timeline flow
- **Why**: The report is already complete, and this phase is the final release-facing execution step.
- **Alternatives**:
  - `/60-Report` - choose this when the release package diverges from the approved report and the summary must be refreshed first.
  - `/50-Verify` - choose this when release readiness becomes uncertain.
  - `/40-Implement` - choose this when additional fixes are needed before release can proceed.

## Nexus Event

- Use `Commit`, `PR`, `Deploy`, `Merge`, or `Changelog` when release execution still needs a concrete lane.
- Return to `/60-Report` when release notes, scope, or handoff wording diverge from the approved summary.
- Return to `/50-Verify` or `/40-Implement` when release readiness changes because unresolved issues are discovered.

