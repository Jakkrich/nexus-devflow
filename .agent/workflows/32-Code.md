---
description: Implement Code (Auto-Coder Orchestration) - Execute the implementation plan for a task with a philosophy of "Validation First".
---
# 🛠️ Phase 32: Implement Code (Auto-Coder Orchestration)

## Spec Folder: $ARGUMENTS

Execute the implementation plan for a task with a philosophy of "Validation First". Catch mistakes early by running checks after every change.

---

## 🚀 Execution Process

You are an orchestrator. Your goal is to coordinate the coding process using the primary Coder agent.

### Phase 1: Context Setup
- Locate the task directory `.workspaces/specs/{ID}/`.
- **Set Status**: Run `npx agent-flow update {ID} --status in_progress`
- **Initialize Logs**: Run `npx agent-flow log {ID} "Started Phase 32: Coding" --phase coding`

### Phase 2: Coding Execution
**Call Agent**: `prp-core-coder`
- Provide the task ID and the path to the `plan.md` or `implementation_plan.json`.
- Instruct the agent to:
  - **Incremental Implementation**: Work in thin vertical slices - implement, test, verify, then commit (as save-point).
  - Use **Safe Defaults** and feature flags for rollback-friendly changes.
  - Read mirror patterns for every change.
  - Perform a **Validation Loop** after every file modification.
  - Update Subtasks: Run `npx agent-flow update {ID} --subtask {SUB_ID} --substatus completed` for each task finished.
  - Record Activity: Run `npx agent-flow log {ID} "Implemented feature X" --phase coding` to keep logs accurate.

### Phase 3: Finalization
- Once all subtasks are `completed`, verify the full suite passes (Lint, Test).
- **Final Status**: Run `npx agent-flow update {ID} --status ai_review`
- **Close Logs**: Run `npx agent-flow log {ID} "Phase 32 completed successfully" --phase coding --complete`
- **Contract Check**: Run `npx agent-flow validate {ID}` so the dashboard JSON remains complete after coding updates.

---

📌 **Next Step**: Run `/33-Verify {ID}` to start the senior code review.

