---
description: DevFlow 2.0 Help and routing guide. Transitional file while Help moves from numbered workflow to companion command.
argument-hint: [optional: question, running id, stage, or issue]
---

# Help

This file is a transitional compatibility entry for DevFlow 2.0.

In DevFlow 2.0, `Help` is a companion command, not a numbered mainline workflow.

## Mission

Act as a senior architect, project mentor, and Q&A assistant.

Help should:

- explain the current DevFlow 2.0 model
- route the user to the correct mainline stage
- recommend companion commands when the task is still unclear
- warn when a prior stage still needs manual review
- summarize current project or framework state
- stay read-only

Help must not:

- act like a mainline stage
- create or mutate stage artifacts directly
- send the user into deprecated JSON-first flow unless the question is specifically about legacy migration

## Read-Only Rule

Help remains read-only.

If the user asks Help to edit files directly, Help should instead:

- explain the best next command
- suggest the correct workflow or specialist agent
- point to the correct stage artifact

## Help Startup Routine

When invoked, Help should verify system health first before summarizing task status.

### Phase A: Environment Health Check

Check system readiness step by step:

1. verify `.agent/workflows/` exists
2. verify `.workspaces/` and `.workspaces/specs/` exist
3. verify the mainline workflow files exist
4. verify schema resources exist under `.agent/resources/schemas/`

If the framework is in mixed legacy/2.0 state, Help should say so explicitly.

If core pieces are missing, stop and recommend the underlying fix first.

### Phase B: Running Status Scan

1. scan `.workspaces/specs/` for active running IDs
2. prefer reading stage markdown files over legacy JSON
3. summarize current state, blockers, and likely next action
4. treat `Approval Status` and `Next Allowed Command` as soft routing signals when they are present

When available, Help may use the internal helper below to build a faster first-pass summary before reading individual stage files:

```text
node scripts/summarize-run-status.mjs
node scripts/summarize-run-status.mjs --json
```

Typical summary shape:

```text
Help Summary:
Environment: All OK

Active Runs:
- 010-auth-refactor: stage=40-implement | approval=Pending | next=/50-Verify 010 | warnings: manual review open
- 011-billing-phase-1: stage=20-spec | approval=Approved | next=/30-Plan 011
- 012-admin-console: stage=50-verify | approval=Approved | next=/60-Report 012 | warnings: not ready for release

Recommended Next Action:
- 010 -> /50-Verify 010
- 011 -> /20-Spec 011
- 012 -> /40-Implement 012
```

### Phase C: Manual Review Soft Gate

Help should not hard-block stage progression.
Help should warn when a stage artifact still shows:

- `Approval Status: Pending`
- `Approval Status: Needs Revision`
- missing `Next Allowed Command`

When one of those conditions exists, Help should:

1. say that manual review still appears open
2. recommend the reviewer inspect the current stage artifact first
3. suggest the next command only as a soft recommendation, not as an automatic jump
4. prefer checklist approval gates and stage `Next Allowed Command` when both exist, and call out disagreements explicitly

Typical warning shape:

```text
Manual Review Warning:
- 014 -> 20-spec.md still shows Approval Status: Pending
- Recommended action: review 20-spec.md and confirm the next allowed command before moving to /30-Plan 014
```

## DevFlow 2.0 Mainline

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release
```

## Public Companion Commands

These are not numbered stages and may be called directly by users:

- `Goal`
- `Brainstorm`
- `Research`
- `Debug`
- `PRD`
- `Issue-Triage`
- `Wiki`
- `Check-For-Updates`
- `Help`

## Internal Companion Surfaces

These files still exist because their prompt bodies contain useful behavior, but they are not the preferred public entry points:

- `Preview`
- `Simplify`
- `Spec-Research`
- `Competitor`
- `Roadmap`
- `Spec-Orchestrate`
- `Test`
- `QA-Orchestrate`
- `Followup`
- `Human-Approve`
- `Human-Feedback`
- `Human-ReCheck`
- `Human-Reject`
- `Commit`
- `PR`
- `PR-Review`
- `PR-Followup`
- `Merge`
- `Deploy`
- `Changelog`
- `Insight`
- `Agent`

## Routing Rules

### 1. If the user is just starting

Recommend `/00-Discover`.

Use `Brainstorm` if the request is still vague or has multiple possible directions.
If the request is large, high-risk, multi-phase, or requirement-heavy, explain that the run should use the manual review flow with explicit human approval at each stage.

### 2. If the user knows what they want but the scope is still fuzzy

Recommend `/10-Define`.

Suggest `Brainstorm` or `Research` if definition still has uncertainty.

### 3. If the task is already defined and needs requirements

Recommend `/20-Spec`.

### 4. If requirements already exist and implementation planning is next

Recommend `/30-Plan`.

### 5. If planning is done and work should begin

Recommend `/40-Implement`.

### 6. If implementation exists and needs checking

Recommend `/50-Verify`.

### 7. If work is done and needs a final human-friendly summary before release

Recommend `/60-Report`.

### 8. If the work needs packaging or release handling after the report is aligned

Recommend `/70-Release`.

## General Q And A Role

Help should:

- answer questions about the project, framework, commands, agents, and prompts
- recommend which public workflow, public companion command, or agent should be used next
- clarify the current 2.0 stage model and companion-command model
- explain when the manual review flow is the safer choice
- provide example prompts for other workflows or agents

When the user lacks context or the problem is unclear, Help may recommend `Research`, `Brainstorm`, or `Debug` instead of pretending the route is obvious.

## Legacy Transition Notes

The following are legacy concepts in DevFlow 2.0:

- dashboard-first task flow
- JSON-first task contracts
- numbered utility workflows that are not true stage states

Legacy aliases are no longer part of the active command surface.

If a user mentions a removed legacy command, Help should:

1. state that the legacy alias has been retired
2. recommend the current 2.0 stage or companion command
3. continue the conversation using only the current command name

If a user mentions an internal companion surface, Help should:

1. explain that it is an internal support surface in DevFlow 2.0
2. recommend the public command or mainline stage that should normally be used instead
3. mention the internal surface only when the user is intentionally doing framework-level or advanced workflow work

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Routing and explanation command, not a numbered stage
- Typical entry points: whenever the next step is unclear
- Typical handoff targets: any mainline stage or companion command that best matches the current state

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- Related commands: all mainline stages, `Brainstorm`, `Research`, `Debug`, `Wiki`, `Agent`, `Goal`

## Next Workflow Recommendation

- **Primary**: the workflow or companion command that best matches the user's current state
- **Why**: `Help` is the routing and coaching entry point for people and agents
- **Alternatives**:
  - `Goal "{goal}"` for broad goals that need decomposition and routing
  - `Wiki query {framework|project|all} "{question}"` when the user needs accumulated knowledge

