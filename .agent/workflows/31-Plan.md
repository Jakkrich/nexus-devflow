---
description: Plan Implementation (Auto-Orchestration) - Transform a spec.md into a battle-tested implementation plan.
---
# 📋 Phase 31: Plan Implementation (Auto-Orchestration)

## Spec File: $ARGUMENTS

Transform a `spec.md` into a battle-tested implementation plan through systematic codebase exploration, pattern extraction, and strategic design.

---

## 🛠️ Internal Process
**⚠️ STRICT MODE: PLAN ONLY! NO CODING ALLOWED. DO NOT TOUCH SOURCE CODE.**


You are an orchestrator. Your goal is to coordinate specialized agents to create a high-quality implementation plan.


### Phase 1: Complexity Assessment
**Call Agent**: `complexity-assessor`
- Provide the spec file or task description.
- **Mandatory Output**: Must generate `complexity_assessment.json` by strictly following the template in [../resources/schemas/complexity_assessment.template.json](../resources/schemas/complexity_assessment.template.json). Do not use alternate filenames.
- **Primary Data**: Must define **Complexity level** and **Approach (Reasoning)**.
- Determine if the task requires standard agentic planning or legacy deep analysis based on the assessment.

### Phase 2: Plan Generation
**Call Agent**: `auto-planner` (Default) or `prp-core-planner` (High Complexity/Legacy)
- Provide the spec content and the complexity assessment result.
- **Initialize Plan**: Run `npx agent-flow update {ID} --status planning`
- Instruct the agent to generate:
  - `implementation_plan.json` (Must strictly follow the template format in [../resources/schemas/implementation_plan.template.json](../resources/schemas/implementation_plan.template.json). Initial states: `status: "in_progress"`, `planStatus: "approved"`, `xstateState: "coding"`)
    - **CRITICAL**: Use the **Atomic Task Principle**:
      - Break down specs into small, verifiable tasks (2-5 mins each).
      - Ensure **Dependency Ordering** (implement dependencies before consumers).
      - Each `subtask` MUST include:
        - `title`: Short descriptive title.
        - `service`: "frontend", "backend", or "fullstack".
        - `files_to_modify` and `files_to_create`: Explicit file paths.
        - `patterns_from`: References to existing code patterns.
        - `verification`: Detailed `command` and `expected` outcome.
  - `context.json` (Must strictly follow the template format in [../resources/schemas/context.template.json](../resources/schemas/context.template.json))
  - `plan.md` (Must strictly follow the template format in [../resources/schemas/plan.template.md](../resources/schemas/plan.template.md))
  - Initialize `task_logs.json` (Must strictly follow the template format in [../resources/schemas/task_logs.template.json](../resources/schemas/task_logs.template.json))

### Phase 3: Final Review & Metadata
- Verify that all artifacts are created in `.workspaces/specs/{ID}/`.
- Ensure `task_logs.json` marks the planning phase as `completed`.
- Run `npx agent-flow validate {ID}` before reporting completion.
- Confirm the plan is ready for execution.

---

## 🏁 Output Checklist
- [ ] `complexity-assessor` has analyzed the task (Result: **Complexity** & **Approach** defined).
- [ ] `auto-planner` or `prp-core-planner` has generated the full plan suite.
- [ ] `implementation_plan.json` contains `complexity_assessment` data.
- [ ] All JSON artifacts follow the project schema.
- [ ] `task_logs.json` is updated.

📌 **Next Step**: Run `/32-Code {ID}` to start the implementation.

