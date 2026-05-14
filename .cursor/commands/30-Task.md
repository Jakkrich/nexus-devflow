---
description: Create New Task (Structured Entry) - Create a task directory, spec.md, and initial metadata for any work item.
---
# 🎯 Phase 30: Create New Task (Structured Entry)
**⚠️ STRICT MODE: PLAN/SPEC ONLY! NO CODING ALLOWED DURING THIS PHASE.**

Create a task directory, `spec.md`, and initial metadata for any work item (feat, fix, refactor, doc).

## Usage

```
/30-Task {ID} {Title} ["Description"]
```
*Note: If ID is not provided, AI will automatically detect the next available ID (e.g., 007).*

---

## 🛠️ Internal Process (ZERO-SCRIPT MODE)

### Phase 0: Idea Refinement
1. **Clarify Objective**: If the prompt is vague, use `idea-refine` logic (Divergent/Convergent thinking) to ask clarifying questions before creating specs.
2. **Context Engineering**: Feed the agent relevant patterns using `context-engineering` skill. Ensure `spec.md` is complete and covers objectives, commands, and boundaries.

### Step 1: Identity & Classification
1. **ID Detection**: Scan the `.workspaces/specs/` folder to find the next available ID sequence.
2. **Slug Generation**: Create a kebab-case slug from the Title (e.g., `user-auth-fix`).
3. **Classification**: Analyze the Category, Priority, and Complexity from the initial data.

### Step 2: Workspace Creation (TOOL-ASSISTED MODE)
1. **Execute Initialization**: Run the following command to create the folder structure and all required JSON files (`task_metadata.json`, `implementation_plan.json`, `requirements.json`, `task_logs.json`):
   ```bash
   npx agent-flow init {ID} "{Title}" {slug}
   ```
2. **Populate Spec**: After the tool creates `spec.md`, fill it with details following the template in [../resources/schemas/spec.template.md](../resources/schemas/spec.template.md).
3. **Validate Contract**: Run `npx agent-flow validate {ID}`. If any dashboard JSON file is missing keys, run `npx agent-flow repair {ID}` and re-check.

### Step 3: Initialization Summary
Notify the user of the task creation result and recommend the next steps.

---

## 🛡️ Execution Gate (Pre-Start Check)

1. **Phase Validation**: Before proceeding, verify that no source code files are currently open for editing.
2. **Explicit Intent**: State clearly: "I am starting Phase 30: Task Creation. I will NOT modify any source code files during this process."
3. **Requirement Extraction**: If the user provides implementation details, extract them into `spec.md` only. **BLOCK** all attempts to use `replace_file_content` on project source code until `/32-Code` is initiated.

---

## 🛡️ Best Practices
- **Define "Done"**: Write Acceptance Criteria as clearly as possible so that the AI in the `/33-Verify` step can check accurately.
- **Keep it Simple**: If the task is too large, recommend splitting it into multiple tasks.
- **Preserve JSON Shape**: Never remove keys from generated JSON. Use `null`, `[]`, or `""` when data is not available yet.

📌 **Next Step**: Run `/31-Plan {ID}` to generate a deep implementation plan.

