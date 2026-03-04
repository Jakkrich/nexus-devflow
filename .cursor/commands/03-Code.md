# 🛠️ Implement Code (Auto-Coder Orchestration)

## Spec Folder: $ARGUMENTS

Execute the implementation plan for a task with a philosophy of "Validation First". Catch mistakes early by running checks after every change.

---

## 🚀 Execution Process

You are an orchestrator. Your goal is to coordinate the coding process using the primary Coder agent.

### Phase 1: Context Setup
- Locate the task directory `.auto-claude/specs/{ID}/`.
- Update `implementation_plan.json`: set `status` to `in_progress`, `planStatus` to `approved`, and `xstateState` to `coding`.
- Update `task_logs.json`: set `coding.status` to `active`.

### Phase 2: Coding Execution
**Call Agent**: `prp-core-coder`
- Provide the task ID and the path to the `plan.md` or `implementation_plan.json`.
- Instruct the agent to:
  - Work through the subtasks iteratively.
  - Read mirror patterns for every change.
  - Perform a **Validation Loop** after every file modification.
  - Update subtask statuses in `implementation_plan.json`.
  - Record detailed activity logs in `task_logs.json`.

### Phase 3: Finalization
- Once all subtasks are `completed`, verify the full suite passes (Lint, Test).
- Update `implementation_plan.json`: set `status` to `ai_review`, `planStatus` to `review`, and `xstateState` to `qa_review`.
- Update `task_logs.json`: set `coding.status` to `completed`.

---

📌 **Next Step**: Run `/04-Verify {ID}` to start the senior code review.
