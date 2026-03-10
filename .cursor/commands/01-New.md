# 🎯 Create New Task (Structured Entry)
**⚠️ STRICT MODE: PLAN/SPEC ONLY! NO CODING ALLOWED DURING THIS PHASE.**

Create a task directory, `spec.md`, and initial metadata for any work item (feat, fix, refactor, doc).

## Usage

```
/01-Task {ID} {Title} ["Description"]
```
*Note: If ID is not provided, AI will automatically detect the next available ID (e.g., 007).*

---

## 🛠️ Internal Process (ZERO-SCRIPT MODE)

### Step 1: Identity & Classification
1. **ID Detection**: Scan the `.auto-claude/specs/` folder to find the next available ID sequence.
2. **Slug Generation**: Create a kebab-case slug from the Title (e.g., `user-auth-fix`).
3. **Classification**: Analyze the Category, Priority, and Complexity from the initial data.

### Step 2: Workspace Creation
Create the `.auto-claude/specs/{ID}-{slug}/` folder and the following files:

#### 1. `task_metadata.json`
Must strictly follow the template in [../PRPs/templates/task_metadata.template.json](../PRPs/templates/task_metadata.template.json).
```json
{
  "sourceType": "manual",
  "category": "{feat|bug_fix|refactoring|documentation|testing}",
  "priority": "{low|medium|high|urgent}",
  "complexity": "{trivial|small|medium|large|complex}",
  "impact": "medium",
  "status": "todo",
  "created_at": "{TIMESTAMP}"
}
```

#### 2. `spec.md` (Requirement Spec)
Create task details by strictly following the template in [../PRPs/templates/spec.template.md](../PRPs/templates/spec.template.md). Fill out the data logically based on the user's initial prompt.

#### 3. `requirements.json` (Detail Specification)
Extract details from the user into the structure matching [../PRPs/templates/requirements.template.json](../PRPs/templates/requirements.template.json) to ensure the Dashboard can display complete task details. Must strictly follow this template.

#### 4. `implementation_plan.json` (Dashboard Hub)
**CRITICAL**: Must strictly follow the template in [../PRPs/templates/implementation_plan.template.json](../PRPs/templates/implementation_plan.template.json) and follow the standards in [../PRPs/templates/README.md](../PRPs/templates/README.md).
```json
{
  "feature": "{ID}: {Title}",
  "description": "{Description}",
  "workflow_type": "standard",
  "status": "todo",
  "planStatus": "pending",
  "xstateState": "backlog",
  "created_at": "{ISO_TIMESTAMP}",
  "updated_at": "{ISO_TIMESTAMP}",
  "spec_file": ".auto-claude/specs/{ID}-{slug}/spec.md",
  "phases": [],
  "final_acceptance": []
}
```

### Step 3: Initialization Summary
Notify the user of the task creation result and recommend the next steps.

---

## 🛡️ Execution Gate (Pre-Start Check)

1. **Phase Validation**: Before proceeding, verify that no source code files are currently open for editing.
2. **Explicit Intent**: State clearly: "I am starting Phase 1: Task Creation. I will NOT modify any source code files during this process."
3. **Requirement Extraction**: If the user provides implementation details, extract them into `spec.md` only. **BLOCK** all attempts to use `replace_file_content` on project source code until `/03-Code` is initiated.

---

## 🛡️ Best Practices
- **Define "Done"**: Write Acceptance Criteria as clearly as possible so that the AI in the `/04-Verify` step can check accurately.
- **Keep it Simple**: If the task is too large, recommend splitting it into multiple tasks.

📌 **Next Step**: Run `/02-Plan {ID}` to generate a deep implementation plan.
