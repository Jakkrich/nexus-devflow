# 🔍 Verify Quality (Auto-QA Orchestration)

## Spec Folder: $ARGUMENTS

Perform a thorough, senior-engineer-level quality check on the implementation. Generate a QA report and decide on the next steps.

---

## 🧠 Review Process

You are an orchestrator. Your goal is to call the specialized QA agent to verify the work.

### Phase 1: Context Gathering
- Locate the task directory `.auto-claude/specs/{ID}/`.
- Update `task_logs.json`: set `validation.status` to `active`.

### Phase 2: QA Execution
**Call Agent**: `auto-qa-expert`
- Provide the ID, the implementation plan, and the original spec.
- Instruct the agent to:
  - Perform a deep code review (Correctness, Patterns, Security).
  - Run the validation suite (Type-check, Lint, Test, Build).
  - **Run automated checklist**: You MUST run `python <ROOT_AI_FOLDER>/scripts/checklist.py .` (e.g., `.cursor/scripts` or `.agent/scripts` based on environment) to perform quick checks (Security, Lint, Schema, UX, SEO) before summarizing the QA report.
  - Categorize any issues found.
  - **Identify Manual Checks**: Specify exactly what the human needs to check manually (e.g., UI feel, specific business logic edge cases that can't be auto-tested).
  - Generate the `qa_report.md` (Must strictly follow the template in [../PRPs/templates/qa_report.template.md](../PRPs/templates/qa_report.template.md)).

### Phase 3: Final Decision
- Based on the QA report:
  - **If Pass**: Set `implementation_plan.json` values: `status: "human_review"`, `planStatus: "review"`, `xstateState: "human_review"`.
  - **If Fail**: Set `implementation_plan.json` values: `status: "in_progress"`, `planStatus: "approved"`, `xstateState: "coding"` and return to coding phase.
  - Mark `validation.status` in `task_logs.json` as `completed` or `failed`.

---

## 📄 Generation: QA Report (`qa_report.md`)
The `auto-qa-expert` agent will generate this report in the task folder.

---

📌 **Next Step**: Run `/10-Human Approve {ID}` (when the user is satisfied).
