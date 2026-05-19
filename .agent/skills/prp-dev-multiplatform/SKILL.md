---
name: prp-dev-multiplatform
description: Intelligent platform router for PRP development. Automatically detects whether the project is FastAPI, Odoo, or PHP and provides guidance on which specific skill to use.
---

# 🚦 PRP Dev – Platform Router (Pure Agentic)

This Skill functions as an **"Intelligent Receptionist"**, helping detect the technology powering your current project and directing other AIs (or myself) to adopt the appropriate specialized Skill for the job.

## 🔍 Platform Detection Logic

When kick-starting a new task or if the environment is ambiguous, I will scan the files as follows:

### 1. 🐍 FastAPI
- **Check**: `main.py`, `app.py` featuring `from fastapi import FastAPI`, or a `requirements.txt` file listing `fastapi`.
- **Recommended Skill**: `prp-dev-fastapi`

### 2. 📦 Odoo (ERP)
- **Check**: The `addons/` folder, `__manifest__.py` (for versions 13+), or `__openerp__.py` (for version 8).
- **Recommended Skill**: `prp-dev-odoo`

### 3. 🐘 PHP (CI/Yii)
- **Check**: The `application/` folder (CodeIgniter) or the `vendor/yiisoft/` folder (Yii).
- **Recommended Skill**: `prp-dev-php`

---

## 🛠️ Action Flow

Upon detecting a Platform:
1. **Notification**: I will inform you of the detected Stack (e.g., "Detected: Odoo 13 module").
2. **Mode Switch**: I will instantly harness the knowledge from the relevant specialized Skill to plan (/02-Plan) and write code (/03-Code).
3. **Fallback**: If an unrecognized Stack is spotted, I will ask you for details or default to the standard **Generic Python/JS** pattern.

---
*Developed for Nexus-DevFlow — Hybrid Development Support*
