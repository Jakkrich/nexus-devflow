---
description: Spec Orchestrate - Coordinate PRD, research, ideation, and spec refinement without autonomous execution.
---

# Phase 18: Spec Orchestrate

## Topic: $ARGUMENTS

Use this workflow when an idea is too broad for a single straight pass through the mainline and needs orchestration first.

Primary behavior now lives in the `spec-orchestration` skill. Keep this workflow as the compatibility wrapper and user-facing orchestration prompt surface.

This workflow does not replace the DevFlow 2.0 mainline. It assembles the right supporting work so the user can re-enter the line cleanly at the correct stage.

## Prompt Source

Adapted from:

- `spec_orchestrator_agentic.md`
- `spec_gatherer.md`
- `spec_researcher.md`
- `spec_critic.md`
- `spec_writer.md`

## Manual DevFlow 2.0 Conversion

This workflow must not run the full lifecycle autonomously. It should recommend the next user-approved command and keep the mainline state easy to follow.

## Process

### 1. Clarify The Idea

- Identify:
  - target user
  - core problem
  - desired outcome
  - constraints
  - acceptance signals
- If the idea is still unstable, recommend `Brainstorm`.
- If the idea is stable enough to narrow but not yet contract-ready, prefer `/10-Define`.

### 2. Choose Supporting Workflows

Route only the work that is genuinely needed:

- `Brainstorm` for option generation or decision framing
- `Research` or `Spec-Research` for integrations and dependencies
- `PRD` for product framing when the request is still hypothesis-driven
- `/10-Define` for scope and decision locking
- `/20-Spec` for delivery contract writing
- `/30-Plan` after the spec is validated and execution-ready

Avoid stacking every support workflow by default. The orchestration should be proportional to the ambiguity of the problem.

### 3. Critique Before Execution

Apply a specification critique before recommending implementation:

- missing acceptance criteria
- unverified dependencies
- unclear scope boundaries
- hidden risk areas
- ambiguous UX, API, or data behavior
- sequencing problems between product framing and delivery planning

If the idea is still not ready, keep it in supporting workflows rather than prematurely routing into `/30-Plan`.

### 4. Create Spec Orchestration Report

- **MANDATORY:** Before generating the final report, inspect `.agent/resources/schemas/spec_orchestration.template.md` for layout, required sections, and format.
- Before reporting completion, run:

Review `{report_path}` against `spec_orchestration.template.md`, keep the required headings, and remove placeholder text before completion.

- Replace any placeholder or template text with concrete orchestration decisions, risks, task breakdown, and next steps.
- Save the final report to:

```text
.workspaces/reports/spec-orchestration-{slug}.md
```

## Output

Return:

- the short orchestration plan
- what is already stable
- what still needs discovery or proof
- where the report was written
- the exact next command the user should run

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: complex discovery or spec work that needs multiple evidence lanes
- Typical handoff targets: `Spec-Research`, `Competitor`, `PRD`, `/20-Spec`

## Sources

- `AGENTS.md`
- `.agent/resources/schemas/spec_orchestration.template.md`
- Related commands: `Spec-Research`, `Competitor`, `PRD`, `/20-Spec`, `Agent`


