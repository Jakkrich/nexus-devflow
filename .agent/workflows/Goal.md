---
description: Goal Router - Route a high-level goal into the correct DevFlow 2.0 path and record recommendation metrics.
---
# Phase 05: Goal Router

Route a high-level `/goal` request into the most appropriate DevFlow path.

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

The goal router turns an open-ended request into a routed DevFlow recommendation plan.

It should:

- classify the goal into the right path
- decompose large goals into worker-sized chunks
- recommend the exact next command
- record routing decisions, turn budget, and context notes in a session log

The current goal runner is a routing and recommendation surface. It does not replace the mainline workflow or silently execute the full delivery lifecycle.

## Boss-Worker Roles

- `prp-core-boss` owns routing, decomposition, turn budgets, validation gates, and final synthesis.
- `prp-core-worker` owns focused implementation or analysis subtasks assigned by the Boss.
- Specialist agents may still be invoked with `Agent` when a task needs deeper domain expertise.

## Flow Routing

The Boss first classifies the request into one of these paths:

| Flow | Use When | Typical Next Step |
| :--- | :--- | :--- |
| DevFlow Mainline | Feature work, bug fixes, tests, docs, migrations, or refactors that should produce stage artifacts or code. | `/00-Discover`, `/10-Define`, `/20-Spec`, `/30-Plan`, `/40-Implement`, `/50-Verify` |
| PRD / Spec Orchestration | Product ideas, requirements, or high-level planning before a running ID exists. | `PRD` or `Spec-Orchestrate` |
| Brainstorm Flow | Early ambiguous ideas that need options and tradeoff analysis. | `Brainstorm` |
| Research Flow | The user needs external facts, docs, or feasibility proof before defining scope. | `Research` or `Spec-Research` |
| RCA / Debug Flow | Failures, errors, regressions, or investigation-heavy bug reports. | `Debug` |

## Process

1. Parse the goal text and runtime config.
2. Select a flow path and record the reasoning.
3. Estimate complexity and split large goals into worker-sized tasks.
4. Recommend the relevant DevFlow commands in the correct order.
5. Track turns by phase and stop when the configured `max-turns` budget is reached.
6. Run validation gates appropriate to the selected flow.
7. Add lightweight context usage notes when the runtime or operator can provide them.
8. Save a structured session report.

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
- `execution_mode`
- `config`
- `metrics`
- `context_usage`
- `flow_selected`
- `tasks_decomposed`
- `execution_steps`
- `recommended_commands`

### Context Usage Notes

`context_usage` is intentionally manual and optional until the runtime exposes exact token telemetry. Use it to capture:

- `context_loaded`
- `files_read`
- `artifacts_read`
- `token_usage`
- `optimization_notes`

## Validation

After changing goal runner behavior, run:

```powershell
npm run validate
node .agent/scripts/test-goal-runner.mjs
npm run goal -- goal "Create a small test task" max-turns 15 dry-run
```

## Output

Report:

- selected flow
- task decomposition summary
- session log path
- recommended next command
- key assumptions or routing risks

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: broad goals before a running ID exists
- Typical handoff targets: `/00-Discover`, `Brainstorm`, `Research`, `PRD`, `Spec-Orchestrate`, `Debug`

## Sources

- `AGENTS.md`
- `.agent/scripts/goal-runner.mjs`
- Related commands: `/00-Discover`, `Brainstorm`, `Research`, `PRD`, `Spec-Orchestrate`, `Debug`

## Next Workflow Recommendation

- **Primary**: the first command listed in `recommended_commands`
- **Why**: `Goal` exists to route broad intent into the correct DevFlow 2.0 entry point
- **Alternatives**:
  - `Brainstorm "{goal}"` when the goal is still exploratory
  - `Debug "{goal}"` when the goal is primarily a failure investigation
  - `/10-Define` when the goal is stable but still needs scope locking
  - `/20-Spec` when the work is ready to become a delivery contract

## Wiki Update Recommendation

- Update the wiki only when the goal-routing session reveals a durable pattern, intake heuristic, or onboarding note worth reusing.
- If the output is only a one-off routing decision, do not create or update wiki pages.

