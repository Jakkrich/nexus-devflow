---
name: prp-dev-odoo
description: Comprehensive skill for Odoo development following the PRP Pure Agentic workflow. Supports Odoo 8 and Odoo 13+ patterns, model/view/controller architecture, and automated validation in a Zero-Script environment.
---

# 📦 PRP Dev – Odoo (Pure Agentic)

This Skill operates to facilitate feature development on **Odoo** (ERP) in obedience to PRP Framework standards. It encompasses both Legacy (Odoo 8) and Modern (Odoo 13+) versions, enforcing correct Inheritance practices and optimal Security measures.

## 🎯 Scope of Work
Apply this Skill when:
- **Module Dev**: Building or revising Odoo Modules (Models, Views, Controllers, Wizards).
- **Migration/Fix**: Squashing Bugs or ameliorating features within Odoo 8 and 13+.
- **Security**: Configuring Access Rights (CSV) and Record Rules (XML).
- **Workflow**: Engaging in Odoo-related tasks throughout its lifecycle.

---

## 1. 🔍 Platform & Version Detection
Check the Odoo environment preceding any actions:
1. **Odoo 8**: Search for `__openerp__.py` or the `openerp` namespace.
2. **Odoo 13+**: Search for `__manifest__.py` or the `odoo` namespace.
3. **Module Structure**: Inspect directories like `addons/` or `models/`, `views/`.

---

## 2. 🧱 Implementation Guidelines

### Naming Conventions
- **Module/Model**: `snake_case` (e.g., `sale_order_line`)
- **Class**: `PascalCase` (e.g., `SaleOrderLine`)
- **Fields**: `snake_case`

### Persistence Patterns (Inheritance)
- **Model**: Leverage `_inherit` to extend an existing model's capability.
- **View**: Always utilize `<xpath expr="..." position="...">` to adjust existing UI to mitigate conflict.

### Security (Mandatory)
Every time a new Model is fabricated, it must include:
1. `security/ir.model.access.csv`: Group-level access rights.
2. `security/ir.rule.xml`: (If necessary) Record visibility specifications (e.g., visible only to the record owner).

---

## 3. 🛡️ Pattern References

| Version | Root Header | Namespace | Decorators |
|:---|:---|:---|:---|
| **Odoo 8** | `<openerp>` | `from openerp import ...` | `@api.one`, `@api.multi` |
| **Odoo 13+** | `<odoo>` | `from odoo import ...` | `@api.model`, `@api.depends` |

---

## 🔄 PRP Workflow Integration (Zero-Script)
For each Task, the Agent must adhere to these principles:

### Phase: Planning (/30-Plan)
- Designate the files to be created/modified in the `File & Directory Index`.
- Formulate a `Validation Loop`:
    - **Step 1**: Lint (flake8/pylint-odoo)
    - **Step 2**: Odoo Test (`--test-enable` / `--init` module)

### Phase: Implement (/40-Implement)
- Proceed with subtasks sequentially and record status in `implement.md`.
- **Gotcha**: Be mindful of Odoo's Caching. Following any Python modifications, inevitably Restart the service and update the Module.

---

## 🧪 Testing & Validation
- **Common Case**: Utilize `TransactionCase` to execute Business Logic Tests.
- **UI Check**: Propose instructions for verification via a Browser inside `verify.md`.
