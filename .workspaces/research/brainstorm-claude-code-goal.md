# 🧠 Brainstorming Report: Integration of Claude Code's /goal Feature into Nexus-DevFlow

> **Source Trigger**: `/10-Brainstorm`
> **Date**: 2026-05-20
> **Target Goal**: Brainstorming how to implement or adapt a `/goal` autonomous loop feature in the Nexus-DevFlow framework, inspired by Claude Code's newly introduced `/goal` command.

---

## 🔍 1. Context & Objectives
- **Problem Statement**: 
  Currently, Nexus-DevFlow features a robust, structured task workflow (`/30-Task` -> `/31-Plan` -> `/32-Code` -> `/33-Verify`). However, `/32-Code` executes only one planned subtask at a time. The user (เจ้านาย) has to manually trigger each subtask step-by-step and inspect results. This can be time-consuming for large features or bug-fixes requiring dozens of minor tweaks. We want to design an autonomous "loop" that runs until a specific, verifiable "finish line" is reached.
- **Key Constraints**: 
  - Must run within the current Nexus-DevFlow Node.js/CLI environment (`.agent` bundle runtime).
  - Must not break the safety, verification, and auditability model of standard PRPs workflows.
  - Must run reliably on Windows PowerShell/CMD.
  - Token and API cost management is critical (prevent infinite looping).
- **Target Audience**: 
  - Advanced developers and project architects who want hands-off multi-step code generation.

---

## 🔀 2. Explored Options

### Option A: The Native `/goal` Slash Command Workflow
- **Description**: Add a new workflow file `/05-Goal` (e.g. `.agent/workflows/05-Goal.md`) and a corresponding CLI script that wraps the lifecycle of standard tasks into an automated execution loop.
- **Architecture/Data Flow**:
  1. The user triggers `/goal "Verifiable finish line" --max-turns 20 --time-cap 30`.
  2. The system dynamically creates a temporary task spec or initializes an existing one.
  3. A loop manager executes the following loop:
     - Check: Has the finish line been met? (Invokes a mini-evaluator model acting as the "Boss").
     - If yes -> break.
     - If no -> Identify the next implementation gap (Worker task) and execute `prp-core-coder` or `/32-Code` on that subtask.
     - Run `npm run validate` and verification scripts to verify.
     - Feed output back to the evaluator.
  4. Ensure safety caps (turns/duration) are checked at each iteration.
- **Pros & Cons**:
  - ✅ **Pros**:
    - Complete alignment with the Claude Code `/goal` model.
    - Highly intuitive for the user; they just define the finish line and watch it run.
    - The Boss-Worker separation prevents premature exits and ensures high quality.
  - ❌ **Cons**:
    - High complexity to implement the dynamic "Boss" evaluation logic inside shell-bound script commands.
    - Can consume a significant amount of tokens due to full-history loops.
- **Effort & Complexity**: High

---

### Option B: Dual-Agent Autonomous Framework (`prp-core-boss` + `prp-core-worker` model)
- **Description**: Instead of modifying the orchestration scripts, introduce two dedicated agent personas (`prp-core-boss.md` and `prp-core-worker.md` in `.agent/agents/`) that conduct a back-and-forth conversation in a single session to implement the goal.
- **Architecture/Data Flow**:
  1. User starts `/90-Agent discuss-goal` and specifies the goal.
  2. `prp-core-boss` parses the goal, analyzes the workspace, and writes a detailed checklist to `.workspaces/specs/{ID}/goal_plan.json`.
  3. `prp-core-boss` instructs `prp-core-worker` on what to do first.
  4. `prp-core-worker` performs the code/file edits.
  5. `prp-core-boss` runs tests/verification and audits the output. If there are gaps, it gives concrete feedback to the worker.
  6. The loop runs inside the LLM context workspace rather than a custom outer shell script.
- **Pros & Cons**:
  - ✅ **Pros**:
    - Extremely modular: keeps CLI tools and standard workflows clean while encapsulating autonomous behaviors in specific system agent prompts.
    - Leverage LLM reasoning for flexible, non-deterministic audit criteria.
  - ❌ **Cons**:
    - Requires large context windows, as the conversation between the two agents will accumulate token usage rapidly.
    - Hard to run parallel build/test processes safely without context leaks.
- **Effort & Complexity**: Medium

---

### Option C: Smarter Phase-Gated Auto-Execution Flag (`npm run agent -- auto-exec`)
- **Description**: Rather than using a cognitive "Boss Agent" to verify open-ended text, enhance the existing PRP CLI runner (`prp.mjs`) to support an auto-execution sequence flag. The verification is strictly governed by the pre-configured automated test suites (`plan.md` test commands).
- **Architecture/Data Flow**:
  1. The user defines the spec and implementation plan normally.
  2. The user runs `/32-Code {ID} --auto` or `npm run agent -- execute {ID} --auto`.
  3. The runner reads `.workspaces/specs/{ID}/implementation_plan.json`.
  4. It sequentially executes every `pending` subtask:
     - Runs the code generation prompt for that subtask.
     - Automatically triggers the verification command associated with that subtask.
     - If the verification passes -> Marks the subtask as `completed` and moves to the next one.
     - If the verification fails -> Retries code generation once with the error log, or halts if it fails twice.
  5. The loop finishes when all planned subtasks are marked as `completed`.
- **Pros & Cons**:
  - ✅ **Pros**:
    - Built on top of Nexus-DevFlow's existing robust, phase-gated execution engine.
    - Extremely safe: relies on concrete, developer-written unit tests rather than fuzzy LLM opinions.
    - Low token overhead compared to a conversational Boss-Worker loop.
  - ❌ **Cons**:
    - Lacks flexibility if the "finish line" involves qualitative or UI/UX details not easily covered by automated test scripts.
- **Effort & Complexity**: Low

---

## 🎯 3. Recommendation & Strategy
- **Selected Approach**: **Option C (Auto-Execution Flag)** as the initial foundation, with **Option A (Slash Command Workflow)** built on top of it.
- **Reasoning**: 
  Implementing a pure LLM-driven Boss-Worker loop (Option A/B) from scratch is error-prone, costly, and hard to debug. However, Nexus-DevFlow already possesses a highly structured and validated implementation plan structure. If we add a programmatic `--auto` flag (Option C), we gain immediate execution automation. We can then wrap this with a new slash command `/goal` that:
  1. Uses `prp-core-prd-architect` to build the PRD and Plan automatically from the user's "finish line".
  2. Launches the `--auto` runner to implement the plan.
  3. Uses a final Boss Audit prompt to perform a qualitative sanity check at the end.
  This hybrid approach delivers the best of both worlds: safety, speed, predictability, and custom safety caps.

- **Migration & Implementation Steps**:
  1. **Enhance CLI script**: Update `.agent/scripts/prp.mjs` to support automated sequential execution of subtasks when `--auto` is passed to the run command.
  2. **Add dynamic planning**: Create a workflow `/goal` inside `.agent/workflows/` that translates the finish line into a structured spec and plan.
  3. **Safety Caps integration**: Add default constraints to the CLI (e.g. max 15 subtask iterations and mandatory token usage validation).

---

## 📌 4. Next Suggested Actions
- [ ] Run `/11-Research` to audit the code generator module in `.agent/scripts/prp.mjs` to see how subtasks are executed.
- [ ] Run `/12-PRD` to formulate a formal product requirement document for the Nexus-DevFlow `/goal` capability.
- [ ] Run `/30-Task` to initialize the task workspace for implementing the `/goal` automation features.
