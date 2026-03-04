# 📋 PRPs Rules Templates

Contains "Standardized Iron Rules" for controlling code quality and AI behavior across different languages and frameworks. These templates ensure that the project consistently maintains high standards, regardless of the IDE used.

## 📑 Template List
- **`rules.template-base-fastapi`**: Rules for Python/FastAPI (Async, Pydantic, Code modularity).
- **`rules.template-base-odoo`**: Rules for Odoo ERP (Models, Views, Security, Version detection).
- **`rules.template-base-php`**: Rules for PHP (MVC patterns, Security, SQL injection prevention).

---

## 🚀 How to Use

### 1. Via `/00-Init` Workflow (Recommended)
When you run the `/00-Init` workflow, the AI will:
1. **Auto-Detect**: Inspect the codebase to determine the technology stack.
2. **Auto-Apply**: Copy rules from the matching template to create or update the rules file at the root of the project (e.g., `.cursorrules`, `.cursorrules`, or `.cursorrules`).

### 2. Manual Use
You can copy the contents of your desired template file and paste them into your active rules file to activate those rules in the AI Chat immediately.

---

## 🔄 Multi-IDE Folder Mapping
Depending on your active IDE, this folder may have a different name. Use `active-ide.py` to switch:

| IDE | Folder Location | Rules File Created |
| :--- | :--- | :--- |
| **Cursor** | `.cursor/rules-templates/` | `.cursorrules` |
| **Antigravity** | `.cursor/rules-templates/` | `.cursorrules` |
| **Windsurf** | `.cursor/rules-templates/` | `.cursorrules` |

---

## 🛠️ Adding a New Template
If you have a new stack (e.g., Node.js, React, Go):
1. Create a new file using the format `rules.template-base-{stack_name}`.
2. Define important rules such as naming conventions, file size limits, and AI behavior.
3. Update the logic in the `/00-Init` workflow to support detecting this new stack.

---
*Note: These files serve as the "central standard" for the team. Any changes should be carefully considered regarding their broader impact across all supported IDEs.*
