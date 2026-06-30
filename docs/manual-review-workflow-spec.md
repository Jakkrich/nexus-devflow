---
title: Manual Review Workflow Spec
status: active
updated: 2026-06-30
owner: Codex
---

# Manual Review Workflow Spec

## Purpose

This document defines the manual-first workflow profile for Nexus-DevFlow 2.0.
It now reflects the active stage-template contract for the mainline workflow.

The target use case is requirement-heavy work where people want to move one step at a time, inspect every artifact, and approve each stage before the next command is allowed.

## Problem Statement

The current DevFlow 2.0 mainline already provides stage artifacts, but it assumes a relatively smooth handoff from one stage to the next.
For large or requirement-sensitive work, teams often need stronger answers to these questions:

- What command should the human run next
- Where should the output be stored
- What exactly did AI do in this stage
- What must a human reviewer verify before proceeding
- How should broad project requirements be preserved while work is split into phases and subtasks

## Scope Of This Spec

This spec covers:

- a manual-first operating model for the existing mainline
- artifact placement rules in `.workspaces/`
- a recommended naming scheme for project, phase, and running-id work
- stage-level review gates for `00-Discover`, `10-Define`, `20-Spec`, and `30-Plan`
- example template structure for those four stages

This spec does not fully define:

- runtime implementation changes
- validator changes
- command parser changes
- migration of existing workspaces
- future automation or command-routing behavior beyond the current template and validation surface

## Expected Outcomes After Adoption

With this workflow profile active, the expected results are:

- people can run DevFlow one command at a time without losing track of the current state
- each stage artifact shows its source inputs, AI actions, and required human review
- broad project constraints stay visible across phase-level running ids
- phase work is easier to audit because every stage declares the next allowed command
- reviewers can see what to approve before implementation starts
- AI is less likely to silently redefine requirements during planning

The tradeoff is that the workflow becomes more explicit and slightly slower, because human review is treated as a real gate rather than an informal suggestion.

## Anti-Bloat Rule

This flow should stay lightweight.
To avoid turning DevFlow into a form-heavy process:

- do not add new public commands for manual review mode
- prefer soft warnings over hard runtime blocks
- use `Help` for routing rather than introducing a new review command
- keep the same Timeline stages for both normal and manual review work
- treat the extra fields as visibility and audit aids, not paperwork for its own sake

## Operating Model

### Primary Rule

Use DevFlow mainline runs primarily at the phase or capability-slice level, not at the one-task level.

### Context Model

Store project-wide context outside individual running ids, then carry it forward into each phase artifact.

Recommended levels:

1. Project context
2. Phase delivery run
3. Task and subtask execution

### Project Context Layer

Project context should live in durable shared artifacts such as:

- `.workspaces/prds/{project-slug}.md`
- `.workspaces/research/{project-slug}/source-summary.md`
- `.workspaces/research/{project-slug}/open-questions.md`
- `.workspaces/wiki/project/{project-slug}-global-rules.md`
- `.workspaces/wiki/project/{project-slug}-phase-map.md`

This layer stores broad requirements, domain language, global constraints, unresolved questions, and phase boundaries.

### Phase Delivery Layer

Each phase should use one running id under:

```text
.workspaces/specs/{ID}-{phase-slug}/
```

Each running id owns the full mainline artifact set for one phase or capability slice.

### Task Execution Layer

Tasks and subtasks should normally stay inside:

- `30-plan.md`
- `checklists/implementation-checklist.md`
- `checklists/verification-checklist.md`

Do not create a new running id for every small implementation task unless that task truly becomes a separate delivery phase.

## Artifact Placement

### Recommended Layout

```text
.workspaces/
  prds/
    {project-slug}.md
  research/
    {project-slug}/
      source-summary.md
      open-questions.md
      stakeholder-notes.md
  wiki/
    project/
      {project-slug}-domain.md
      {project-slug}-global-rules.md
      {project-slug}-phase-map.md
  specs/
    {ID}-{phase-slug}/
      00-discover.md
      10-define.md
      20-spec.md
      30-plan.md
      40-implement.md
      50-verify.md
      70-release.md
      60-report.md
      checklists/
        implementation-checklist.md
        verification-checklist.md
```

### Human Reading Model

Humans should know where to look:

- project framing: `prds/`
- evidence and research: `research/`
- durable rules and domain language: `wiki/project/`
- current phase state: `specs/{ID}-{phase-slug}/`
- live execution progress: `checklists/`

For a quick read-only summary across active runs, use the internal helper:

```text
node scripts/summarize-run-status.mjs
```

This helper is intended to support `Help` and manual status reviews without adding a new public workflow command.

## Naming Rules

### Project Slug

Use one stable project slug for the whole initiative.

Example:

```text
activity-application-system
```

### Phase Slug

Use a phase slug that states the delivery boundary clearly.

Examples:

```text
001-activity-application-p1-requirements-boundary
002-activity-application-p2-intake-tracking
003-activity-application-p3-review-approval
```

### Why This Matters

Stable names help people understand:

- what phase they are in
- whether a run is still active
- how later phases relate to earlier ones
- where to look for the source-of-truth artifact

## Manual Review Rules

Each stage must answer these audit questions:

1. What inputs did AI use
2. What actions did AI perform
3. What must a human reviewer inspect
4. What command is allowed next
5. What optional branches could help before returning to the next Timeline step

Checklist and report artifacts should carry the same soft-gate signals forward so reviewers can inspect downstream state without reopening every earlier stage file.

### Required Review Fields

Each manual-review-ready stage template should include:

- `Source Inputs`
- `Project Context To Preserve`
- `AI Actions Performed`
- `Human Review Required`
- `Approval Status`
- `Next Allowed Command`
- `Nexus Event`
- `Change Log`

### Approval States

Recommended values:

- `Pending`
- `Approved`
- `Needs Revision`
- `Rejected`

### Gate Rule

The next mainline command should not be considered the default path until the current stage has:

- a completed artifact
- explicit human review notes
- an `Approval Status`
- a `Next Allowed Command`
- optional `Nexus Event` when side routes may help before the next Timeline step

## Stage Responsibilities

### `00-Discover`

Purpose:

- anchor a new run
- restate the request
- identify constraints and unknowns
- propose a phase boundary

Human checks:

- the phase title is correct
- the source documents are the right ones
- the proposed boundary does not merge unrelated work

### `10-Define`

Purpose:

- lock the phase boundary
- record in-scope and out-of-scope items
- preserve global constraints

Human checks:

- scope is not drifting
- confirmed requirements are carried forward
- open questions are not hidden as assumptions

### `20-Spec`

Purpose:

- create the delivery contract
- define acceptance criteria
- state role, workflow, data, and constraint rules clearly

Human checks:

- spec traces back to approved source inputs
- acceptance criteria are testable
- exclusions are explicit

### `30-Plan`

Purpose:

- break the spec into executable work
- identify file and component impact
- define verification and test expectations

Human checks:

- subtasks stay inside the approved phase scope
- sequence and dependencies make sense
- every behavior change has a test decision

## Command Guidance

Recommended manual progression:

```text
Goal -> /00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release
```

Recommended prompt style for large work:

```text
/00-Discover {phase title}
Use existing project documents as source of truth.
Treat this as one phase of a larger initiative.
Do not redefine confirmed requirements.
Carry forward cross-module constraints and open questions.
```

## Template Extension Rules

When extending the manual review mode further, preserve:

- current frontmatter style
- current stage filename contract
- current mainline ordering
- open-ended final section behavior

Add the manual review fields without removing the existing core stage purpose.

## Future Implementation Targets

The likely follow-up work after this first implementation is:

1. update schema templates for `discover`, `define`, `spec`, and `plan`
2. add validation guidance for approval and next-command fields
3. document the manual review mode in `quickstart.md` and `workspace-artifacts.md`
4. consider `Help` routing guidance for large initiative manual-first work

## Deliverables In This Draft

This draft is paired with example template files under:

```text
docs/examples/manual-review-flow/
```

Those files remain examples only.
The active schema templates live under `.agent/resources/schemas/`.

## Decision Summary

Recommendation:

- keep DevFlow mainline phase-oriented by default
- keep tasks inside `30-plan.md` and checklist files
- add explicit human review fields to the early planning stages before changing runtime behavior

This gives teams stronger control and auditability without changing the core DevFlow stage model.
