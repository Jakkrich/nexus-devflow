# Research Report: Native /goal Command Integration in Nexus-DevFlow

## 1. Research Question
- **Topic**: Native `/goal` Command Integration in Nexus-DevFlow
- **Scope**: Feasibility and design of a fully autonomous `/goal` execution engine that loops planning, coding, and verification until a verifiable "finish line" is reached.
- **Date**: 2026-05-20

## 2. Evidence Map
| Source | Evidence | Relevance |
|---|---|---|
| [.agent/scripts/prp.mjs](file:///d:/Projects/nexus-devflow/.agent/scripts/prp.mjs) | CLI state command mapping: `prp plan:set-subtask-status`, `prp update --status`, and `prp validate` | Defines the CLI surface we can automate to drive the worker loop programmatic transitions. |
| [.agent/workflows/32-Code.md](file:///d:/Projects/nexus-devflow/.agent/workflows/32-Code.md) | Single-subtask coding process: Read bearing, select first `pending` subtask, implement, verify, and repeat. | Explains the exact loop structure we need to automate in a single workflow. |
| [Claude Code_goal.md](file:///d:/Projects/nexus-devflow/.workspaces/research/Claude%20Code_goal.md) | Summary of Claude Code's `/goal` workflow: Boss-Worker dual agent model, safety caps, and verifiable finish lines. | Provides the core design paradigm for the autonomous looping mechanism. |

## 3. Current System Findings
- **Files/Modules Reviewed**:
  - `prp.mjs`: Centralized task state manager that parses, validates, and serializes workspace metadata (`implementation_plan.json`, `task_metadata.json`, etc.).
  - `32-Code.md`: Workflow that forces step-by-step sequential coding. Currently, it expects the user to invoke `/32-Code` after every subtask.
- **Existing Patterns**:
  - **State-Driven Workflow**: Nexus-DevFlow tracks implementation using JSON state machines.
  - **Incremental Testing**: Every subtask contains a `verification` section specifying an automated or manual test command.
- **Data Flow / Integration Points**:
  - A `/goal` workflow would hook directly into the standard `prp.mjs` script. By running `npm run agent -- validate` and specific test suites, the "Boss" can programmatically verify workspace compliance.

## 4. External Findings
- **Confirmed Facts**:
  - Claude Code `/goal` implements a **Boss-Worker** split. The worker makes modifications while the boss acts as a gated reviewer.
  - Safety caps are critical: A loop can run infinitely if the finish line criteria is subjective ("make this code beautiful").
- **Sources**:
  - YouTube: Tristen O'Brien's deep-dive "Claude Code Just Dropped /Goal. (Master it in 8 Minutes)".
- **Assumptions / Inferences**:
  - The "Boss" doesn't have a separate environment; it is a separate system prompt instruction that evaluates the worker's output and validates file existence.

## 5. Risks And Constraints
- **Risks**:
  - **Infinite Looping & Token Depletion**: If a developer specifies a subjective target, the agent could generate updates indefinitely, costing hundreds of dollars.
  - **Shell Integrity**: Automatic commands executing test suites (e.g. `npm test`) could crash or cause side effects without proper isolation.
- **Constraints**:
  - The solution must run natively inside Windows PowerShell/CMD without third-party orchestrator packages.
- **Unknowns**:
  - How well standard LLM models evaluate open-ended finish lines compared to concrete test results.

## 6. Recommendations
- **Recommended Path**:
  We should design `.agent/workflows/05-Goal.md` to run the following integrated lifecycle:
  1. **Dynamic Decompose**: Convert the user's "Goal & Finish Line" into a temporary PRP Task using a Socratic planner prompt.
  2. **Auto-Run Loop**: Programmatically loop through `/32-Code` subtasks sequentially using a shell loop runner or an LLM-managed chain.
  3. **Dual Audit**: At each turn, run automated tests first. If they pass, have the Boss Agent perform a qualitative audit against the finish line text.
  4. **Safety Cap Enforcement**: Force a default cap of 10 turns and 15 minutes unless overridden by the user.
- **Next Step**:
  Create the `/goal` workflow markdown file under `.agent/workflows/05-Goal.md` to outline the prompt instructions for the agent to behave as the Boss-Worker orchestrator.
