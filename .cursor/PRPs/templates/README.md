# 📋 PRPs Framework Templates & Standards

This folder contains the **Source of Truth** for all JSON and Markdown templates used by the PRPs-Framework. These templates ensure consistent communication with the **PRPs Dashboard** and provide a standardized structure for AI Agents.

> 📖 **Standard Reference**: For full details on all Attributes and their Allowed Values, see [SCHEMA.md](./SCHEMA.md)

> 💡 **Framework Note**: These templates are the core DNA of the framework. They are located within your active IDE root (e.g., `.cursor/PRPs/templates/`) but manage data in the `.auto-claude/` project folder.

## 🔄 State Mapping Table

| Dashboard Column | `status` | `planStatus` | `xstateState` |
| :--- | :--- | :--- | :--- |
| **Backlog** | `backlog` | `pending` | `backlog` |
| **Planning** | `in_progress` | `planning` | `planning` |
| **In Progress** | `in_progress` | `approved` | `coding` |
| **AI Review** | `ai_review` | `review` | `qa_review` |
| **Human Review** | `human_review` | `review` | `human_review` |
| **Done** | `done` | `done` | `done` |

## 📋 File Manifest & Purpose

| File | Primary Purpose | When to Create |
| :--- | :--- | :--- |
| `implementation_plan.json` | Kanban state, phases, and subtasks. | `/01-Task` (init), `/02-Plan` (fill) |
| `task_metadata.json` | Badges, categorization, and AI settings. | `/01-Task` |
| `spec.md` | Human-readable requirement specification. | `/01-Task` |
| `requirements.json` | Deep requirement details (System-readable). | `/01-Task` |
| `context.json` | Task-specific codebase intelligence (RAG). | `/02-Plan` |
| `task_logs.json` | Real-time timeline for the Dashboard "Logs" tab. | `/02-Plan`, `/03-Code`, `/04-Verify` |
| `qa_report.md` | Verification and review summary. | `/04-Verify` |

## 🛡️ Critical Rules for AI
1. **Source of Truth**: Always check `*.template.json` in this folder.
2. **Never delete attributes**: Keep all keys, even if empty.
3. **Strings for IDs**: Subtask IDs like `"1.1"` must be strings.
4. **ISO Dates**: All timestamps must be ISO 8601.
5. **Integers for Phases**: Phase numbers must be integers.
6. **Timeline Logging**: Update `task_logs.json` after every major step or tool usage.

## 🏷️ Allowed Values (Metadata)
- **Category**: `feat`, `bug_fix`, `refactoring`, `documentation`, `security`, `performance`, `ui_ux`, `infrastructure`, `testing`
- **Complexity**: `trivial`, `small`, `medium`, `large`, `complex`
- **Priority**: `low`, `medium`, `high`, `urgent`
- **Impact**: `low`, `medium`, `high`, `critical`
