---
name: prp-dev-multiplatform
description: Auto-detect platform (FastAPI, Odoo, PHP) and route to appropriate platform-specific skill. Use when the user is coding, refactoring, or asking about implementation details but platform is not yet determined. This skill helps select the right platform skill automatically.
---

# PRP Dev – Platform Router

## Purpose

Skill นี้ทำหน้าที่เป็น **router** ที่ตรวจจับ platform อัตโนมัติและแนะนำให้ใช้ platform-specific skill ที่เหมาะสม

---

## Platform Detection Logic

เมื่อเริ่มทำงานหรือเมื่อ platform ยังไม่ชัดเจน:

1. **ตรวจสอบ FastAPI indicators:**
   - มี `main.py` หรือ `app.py` ที่ `from fastapi import FastAPI`
   - มี `fastapi` ใน `requirements.txt` / `pyproject.toml`
   - มี `uvicorn` หรือ `gunicorn` ใน dependencies
   - → **แนะนำใช้ skill: `prp-dev-fastapi`**

2. **ตรวจสอบ Odoo indicators:**
   - มี `addons/` folder หรือโครง `models/`, `views/`
   - มี `__manifest__.py` (Odoo 13+) หรือ `__openerp__.py` (Odoo 8)
   - → **แนะนำใช้ skill: `prp-dev-odoo`**

3. **ตรวจสอบ PHP indicators:**
   - มี `application/config/config.php` → CodeIgniter 3
   - มี `composer.json` กับ `"yiisoft/yii2"` → Yii Framework
   - มี `application/` folder → CodeIgniter 3
   - มี `vendor/yiisoft/` folder → Yii Framework
   - → **แนะนำใช้ skill: `prp-dev-php`**

---

## Behavior

เมื่อตรวจพบ platform:

1. **รายงาน platform ที่ตรวจพบ:**
   - "Detected: FastAPI + SQLAlchemy + Pydantic"
   - "Detected: Odoo 13 module structure"
   - "Detected: PHP CodeIgniter 3"

2. **แนะนำ platform-specific skill:**
   - FastAPI → ใช้ `prp-dev-fastapi` skill
   - Odoo → ใช้ `prp-dev-odoo` skill
   - PHP → ใช้ `prp-dev-php` skill

3. **ถ้า platform ชัดเจนแล้ว:**
   - ให้ platform-specific skill จัดการต่อ
   - ไม่ต้องผ่าน skill นี้ซ้ำ

---

## Fallback

ถ้าไม่สามารถตรวจจับ platform ได้:

1. ถามผู้ใช้โดยตรงว่าใช้ platform อะไร
2. หรือดูจาก context ของคำถาม (เช่น พูดถึง "async/await" → FastAPI, พูดถึง "module" → Odoo)
3. แนะนำให้ใช้ platform-specific skill ที่เหมาะสม

---

## Related Skills

- `prp-dev-fastapi` - สำหรับ FastAPI projects
- `prp-dev-odoo` - สำหรับ Odoo projects
- `prp-dev-php` - สำหรับ PHP projects (CodeIgniter 3 / Yii Framework)
