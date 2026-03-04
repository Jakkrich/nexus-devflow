# 📚 Cursor Skills (Knowledge Banks)

This directory gathers collections of knowledge and coding guidelines (Skills) specifically tailored for this project, allowing the AI to act in alignment with the structure and technologies you employ.

## 📋 Complete Skills List

| Skill Name | Tech Stack | Main Responsibility |
|:---|:---|:---|
| **`prp-sa-ba`** | Requirement Analysis | Assists with task analysis, Spec creation, and initial planning |
| **`prp-dev-fastapi`**| Python / FastAPI | Develops APIs using FastAPI, Pydantic, and Async patterns |
| **`prp-dev-odoo`** | Python / Odoo ERP | Develops Odoo Modules (8 & 13+), emphasizing Models/Views structures |
| **`prp-dev-php`** | PHP (CI/Yii) | Develops PHP Apps utilizing CodeIgniter 3 or Yii Framework 2 |
| **`prp-dev-multiplatform`**| Router Agent | Facilitates automatic Stack detection and recommends appropriate Skills |

---

## 🛠️ How AI Uses Skills
The AI (Cursor) will automatically retrieve data from the `SKILL.md` files within these directories when:
1. **Context Match**: When you issue a command or ask a question pertinent to the respective Tech Stack.
2. **Explicit Instruction**: When you explicitly instruct the AI to "use Skill [name]" to resolve an issue.
3. **Workflow Start**: Upon initiating main commands like `/01-Task` or `/02-Plan`.

---

## 🛡️ Pure Agentic Standards
All Skills are architected to operate in **Zero-Script** mode, meaning:
- The AI reads and modifies JSON/Markdown files directly without depending on external scripts.
- Prioritizes executing a **Validation Loop** to independently verify code correctness.
- Consistently references project files in the `.auto-claude/specs/` directory.

---
*Developed for PRPs-Framework — Pure Agentic Mode*
