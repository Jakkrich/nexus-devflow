---
description: Spec Orchestrate - Coordinate PRD, research, competitor analysis, and task creation without autonomous execution.
---

# Phase 18: Spec Orchestrate

## Topic: $ARGUMENTS

Use this workflow when an idea is too broad for a single `/30-Task` and needs discovery, research, competitor context, and spec refinement first.

## Prompt Source

Adapted from:

- `spec_orchestrator_agentic.md`
- `spec_gatherer.md`
- `spec_researcher.md`
- `spec_critic.md`
- `spec_writer.md`

## Manual PRPs Conversion

This workflow does not run all phases automatically. It recommends the next user-approved command.

## Process

### 1. Clarify The Idea

- Identify user, problem, desired outcome, constraints, and acceptance signals.
- If the idea is vague, recommend `/10-Brainstorm`.

### 2. Choose Supporting Workflows

Route as needed:

- `/15-Spec-Research` for integrations and dependencies
- `/16-Competitor` for market and differentiator research
- `/12-PRD` for product requirements
- `/30-Task` for executable PRP artifacts
- `/31-Plan` after task artifacts are validated

### 3. Critique Before Execution

Apply `spec_critic` before recommending implementation:

- missing acceptance criteria
- unverified dependencies
- unclear scope
- risk areas
- ambiguous UX or data behavior

### 4. Create Spec Orchestration Report
- **MANDATORY:** Before generating the final report, the agent MUST inspect the layout, required sections, and format defined in `.agent/resources/schemas/spec_orchestration.template.md` to ensure a consistent output layout.
- Save the final report to `.workspaces/reports/spec_orchestration-{slug}.md` (where `{slug}` is a URL-friendly name derived from the topic/arguments).

## Output

Return a short orchestration plan in the chat, verify that the full report has been successfully written to the specified path, and recommend the exact next command the user should run.
