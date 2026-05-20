---
description: Autonomous Goal Runner - Route a high-level goal into the correct Nexus-DevFlow path, coordinate work, and record execution metrics.
---
# Phase 05: Goal Runner

Run a high-level `/goal` request through the Nexus-DevFlow process with a Boss-Worker control loop.

## Usage

```text
/goal {GOAL_DESCRIPTION}
```

Local CLI equivalent:

```powershell
npm run goal -- --goal "Implement goal command" --max-turns 30 --parallel
npm run goal -- goal "Implement goal command" max-turns 30 parallel
```

## Purpose

The goal runner turns an open-ended request into a routed DevFlow execution plan. It records the routing decision, task decomposition, max-turn budget, elapsed time, and worker handoff history in a session log.

## Boss-Worker Roles

- `prp-core-boss` owns routing, decomposition, turn budgets, validation gates, and final synthesis.
- `prp-core-worker` owns focused implementation or analysis subtasks assigned by the Boss.
- Specialist agents may still be invoked with `/90-Agent` when a task needs deeper domain expertise.

## Flow Routing

The Boss first classifies the request into one of these paths:

| Flow | Use When | Typical Next Step |
| :--- | :--- | :--- |
| DevFlow Task Execution | Feature work, bug fixes, tests, docs, or refactors that should produce code or artifacts. | `/30-Task`, `/31-Plan`, `/32-Code`, `/33-Verify` |
| PRD / Spec Flow | Product ideas, requirements, or high-level planning before a task exists. | `/12-PRD` or `/18-Spec-Orchestrate` |
| Brainstorm Flow | Early ambiguous ideas that need options and tradeoff analysis. | `/10-Brainstorm` |
| RCA / Debug Flow | Failures, errors, regressions, or investigation-heavy bug reports. | `/20-Debug` |

## Process

1. Parse goal text and runtime config.
2. Select a flow path and record the decision.
3. Estimate complexity and split large goals into worker-sized tasks.
4. Execute or recommend the relevant DevFlow commands.
5. Track turns by phase and stop when the configured `max-turns` budget is reached.
6. Run validation gates appropriate to the selected flow.
7. Save a structured session report.

## Log Contract

Session logs are written to:

```text
.workspaces/specs/goal-sessions/session-{goal_id}.json
.workspaces/specs/goal_latest_session.json
.workspaces/specs/goal_execution_log.json
```

Each log includes:

- `goal_id`
- `goal_description`
- `status`
- `config`
- `metrics`
- `flow_selected`
- `tasks_decomposed`
- `execution_steps`
- `recommended_commands`

## Validation

After changing goal runner behavior, run:

```powershell
npm run validate
node .agent/scripts/test-goal-runner.mjs
npm run goal -- goal "Create a small test task" max-turns 15 dry-run
```

## Output

Report:

- Selected flow
- Task decomposition summary
- Session log path
- Recommended next command or validation result
