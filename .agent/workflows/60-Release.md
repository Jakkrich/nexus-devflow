---
description: Release stage in DevFlow 2.0 - package verified work for delivery, merge, PR, deployment, or handoff.
argument-hint: "{running-id or workspace path}"
---

# Phase 60: Release

$ARGUMENTS

Package verified work for delivery after verification has passed. This stage turns technical completion into release-ready communication and handoff.

## Usage

```text
/60-Release {running-id or workspace path}
```

Use this when:

- verification has passed
- the work needs a release-ready summary or handoff packet
- downstream stakeholders need delivery notes instead of raw implementation detail

## Markdown-First Contract

Write the primary stage artifact to:

```text
.workspaces/specs/{ID}-{slug}/60-release.md
```

using:

```text
.agent/resources/schemas/release.template.md
```

Before writing `60-release.md`, read `artifact_language` from `release.template.md` and produce the artifact in that language.

## Process

### Loop Contract

Run release as a readiness-packaging loop, not as a celebratory summary.

- **Intent**: convert verified work into a clear release, PR, merge, deploy, or handoff packet without hiding unresolved risk.
- **Context**: read `50-verify.md`, `50-verify-impact.md` when present, `40-implement.md`, `20-spec.md`, checklist state, and any PR, deploy, merge, or handoff notes.
- **Action**: summarize delivered scope, user/system impact, readiness state, validation evidence, rollback or mitigation notes, and follow-up items.
- **Observation**: use concrete evidence such as verify verdict, failed or skipped checks, impact notes, residual risks, merge/deploy constraints, and checklist status.
- **Adjustment**: if release readiness becomes uncertain, return to `/50-Verify`; if fixes are required, return to `/40-Implement`; if context must transfer, use `handoff`.
- **Stop Condition**: stop when the release state is explicit, evidence supports readiness, residual risks and follow-ups are named, and the next delivery or reporting route is clear.
- **Handoff**: `60-release.md` must tell `/70-Report` what shipped, what did not ship, what evidence supports readiness, and what follow-ups remain.

### 1. Load Verified Context

Read:

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

### 3. Write `60-release.md`

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
Use `resolving-merge-conflicts` when merge or rebase conflicts block packaging. Use `handoff` when release output must transfer to another agent or session without duplicating artifacts.

## Output

Report:

- delivered scope
- release, PR, merge, deploy, or handoff state
- follow-up items
- recommended next step

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `/50-Verify`
- Next state: `/70-Report` when release packaging or handoff is complete
- Common companion commands: `Commit`, `PR`, `Deploy`, `Changelog`, `Merge`, `Wiki`; support skills: `resolving-merge-conflicts`, `handoff`, and `setup-pre-commit` when release packaging needs conflict resolution, transfer notes, or local quality gates

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/release.template.md`
- Related commands: `/50-Verify`, `Commit`, `PR`, `Deploy`, `Changelog`, `Merge`, `/70-Report`

## Next Workflow Recommendation

- **Primary**: `/70-Report`
- **Why**: The work is packaged and ready for the final standardized summary.
- **Alternatives**:
  - `/50-Verify` - choose this when release readiness becomes uncertain.
  - `/40-Implement` - choose this when additional fixes are needed before release can proceed.
  - `handoff` - choose this when release-ready context must move to another session, agent, or stakeholder packet.

