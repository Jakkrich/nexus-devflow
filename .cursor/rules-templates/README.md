# 📋 Cursor Rules Templates

Contains "Standardized Iron Rules" for controlling code quality and AI behavior in each language or Framework, ensuring the project consistently maintains the same standards.

## 📑 Template List
- **`rules.template-base-fastapi`**: Rules for Python/FastAPI (Async, Pydantic, Code modularity)
- **`rules.template-base-odoo`**: Rules for Odoo ERP (Models, Views, Security, Version detection)
- **`rules.template-base-php`**: Rules for PHP/CI/Yii (MVC patterns, Security, SQL injection prevention)

---

## 🚀 How to Use
### 1. Via `/00-Init` Command (Recommended)
When you run the `/00-Init` command, the AI will:
1. **Auto-Detect**: Inspect the Codebase to determine the technology stack.
2. **Auto-Apply**: Copy rules from the matching Template to seamlessly create/update the `.cursorrules` file at the root of the project.

### 2. Manual Use
You can copy the contents of your desired Template file and paste them into your `.cursorrules` file to activate those rules in Chat or Composer immediately.

---

## 🛠️ Adding a New Template
If you have a new Stack (e.g., Node.js, React, Go):
1. Create a new file using the format `rules.template-base-{stack_name}`.
2. Define important rules such as Naming conventions, File size limits, and AI behavior.
3. Update the conditions in the `/00-Init` command to support detecting this new Stack.

---
*Note: These files serve as the "central standard" for the team. Any changes should be carefully considered regarding their broader impact.*
