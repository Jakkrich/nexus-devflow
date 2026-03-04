# 📋 Dashboard JSON Schema Standard

This document is the **Source of Truth** for the structure of all JSON files required by the Dashboard (`Auto-Claude`). This information is derived from the Frontend Source Code (`shared/types/task.ts`) so AI can correctly generate files even if the Frontend Folder doesn't exist in the project.

---

## 🏗️ 1. implementation_plan.json (The Hub)
**Path**: `.auto-claude/specs/{ID}/implementation_plan.json`
The primary file used by the Dashboard to display on Kanban and Progress Bar.

| Key | Type | Allowed Values / Pattern | Description |
| :--- | :--- | :--- | :--- |
| `feature` | string | `{ID}: {Title}` | Task title to display on the Card |
| `description` | string | Markdown string | Short description (displayed below the Card title) |
| `status` | string | `backlog`, `queue`, `in_progress`, `ai_review`, `human_review`, `done`, `error` | **Kanban Column Location** |
| `planStatus` | string | `planning`, `approved`, `rejected` | Plan status |
| `xstateState` | string | `planning`, `coding`, `validation`, `human_review` | State Machine status (used to Resume work) |
| `updated_at` | string | ISO 8601 (UTC) | Used to filter recently updated tasks |
| `phases` | array | `PhaseObject[]` | Task phase details (see below) |

### 🔹 PhaseObject Structure
```json
{
  "phase": 1,
  "name": "Phase Name",
  "type": "infrastructure|ui|logic|testing",
  "subtasks": [
    {
      "id": "1.1",
      "description": "Task description",
      "status": "pending|in_progress|completed|failed",
      "verification": {
        "type": "command|browser",
        "run": "npm run test:target",
        "scenario": "describe test steps"
      }
    }
  ]
}
```

---

## 🏷️ 2. task_metadata.json (Badges & Settings)
**Path**: `.auto-claude/specs/{ID}/task_metadata.json`

| Key | Type | Allowed Values |
| :--- | :--- | :--- |
| `category` | string | `feat`, `bug_fix`, `refactoring`, `documentation`, `security`, `performance`, `ui_ux`, `infrastructure`, `testing` |
| `priority` | string | `low`, `medium`, `high`, `urgent` |
| `complexity` | string | `trivial`, `small`, `medium`, `large`, `complex` |
| `impact` | string | `low`, `medium`, `high`, `critical` |
| `acceptanceCriteria` | string[] | List of success criteria |
| `dependencies` | string[] | List of prerequisite tasks (ID or name) |

---

## 📝 3. requirements.json (Content Fallback)
**Path**: `.auto-claude/specs/{ID}/requirements.json`
Used to store initial details and as a dataset for the Spec Writer.

| Key | Type | Description |
| :--- | :--- | :--- |
| `task_description` | string | **Primary Fallback** for Description if absent in other files |
| `user_goal` | string | The user's goal |
| `workflow_type` | string | `feature`, `bugfix`, `refactor`, `docs`, `test` |

---

## 🕒 4. task_logs.json (Timeline)
**Path**: `.auto-claude/specs/{ID}/task_logs.json`

### 🔹 EntryObject Structure
```json
{
  "timestamp": "ISO_TIMESTAMP",
  "type": "text|tool_start|tool_end|phase_start|phase_end|error|success|info",
  "content": "Message to display",
  "phase": "planning|coding|validation",
  "tool_name": "run_command",
  "tool_input": "input string"
}
```

---

## 🧠 5. context.json (RAG Intelligence)
**Path**: `.auto-claude/specs/{ID}/context.json`

| Key | Type | Description |
| :--- | :--- | :--- |
| `files_to_modify` | string[] | paths (relative) |
| `files_to_reference` | string[] | paths (relative) |
| `patterns` | string[] | snippets or pattern descriptions |

---

## 📡 6. complexity_assessment.json (Complexity & Risk)
**Path**: `.auto-claude/specs/{ID}/complexity_assessment.json`

| Key | Type | Allowed Values / Pattern |
| :--- | :--- | :--- |
| `complexity` | string | `simple`, `standard`, `complex` |
| `workflow_type` | string | `feature`, `refactor`, `investigation`, `migration`, `simple` |
| `confidence` | number | e.g. `0.0` - `1.0` |
| `reasoning` | string | Description of the complexity |
| `analysis` | object | Contains scope, integrations, and risk details |
| `validation_recommendations` | object | Details about testing and validation requirements |

### 🔹 Analysis & Validation Structure
```json
{
  "analysis": {
    "scope": { "estimated_files": 0, "is_cross_cutting": false },
    "integrations": { "new_dependencies": [], "research_needed": false },
    "risk": { "level": "low|medium|high", "concerns": ["Risk 1"] }
  },
  "validation_recommendations": {
    "risk_level": "trivial|low|medium|high|critical",
    "skip_validation": false,
    "test_types_required": ["unit", "integration", "browser", "manual"],
    "security_scan_required": false,
    "reasoning": "Reasoning for validation approach"
  }
}
```
