# Discovery Document: [DISC-20260909-002] Light Theme HTML Standardization & Diagram Architecture

> **Discovery ID**: `DISC-20260909-002`  
> **Topic**: การวิเคราะห์ที่มาของการใช้ Dark Theme ในการสร้างไฟล์ HTML และแผนย้ายสู่ Light Theme (ธีมสว่าง คลีน พรีเมียม) เป็นมาตรฐานหลัก พร้อมการผสาน Diagram ด้วย `archify` และ `diagram-design`  
> **Date**: 2026-09-09  
> **Status**: `Completed & Standardized (บันทึกมาตรฐานลงใน coding-standards.md, AGENTS.md และอัปเกรด Playbooks ทั้งหมดแล้ว)`  
> **Target Scope**: Universal Contextual Help (`devflow/docs/playbooks/`), Standalone Reports (`report-html`), Diagrams (`archify`, `diagram-design`), Coding Standards (`coding-standards.md`, `AGENTS.md`)

---

## 1. Executive Summary & บทสรุปผู้บริหาร (TL;DR)

### ที่มาของ Dark Theme: ทำไมไฟล์ HTML ที่สร้างขึ้นจึงกลายเป็นธีมมืด?
จากการตรวจสอบเชิงลึกทั่วทั้ง Codebase พบว่าการเกิด Dark Theme มาจาก **4 แหล่งประกอบกัน**:
1. **System Prompt & LLM Bias (`<web_application_development>`)**:
   ใน Developer System Prompt มีคำแนะนำการออกแบบระบุว่า *"Use best practices in modern web design (e.g. vibrant colors, dark modes, glassmorphism)"* และ *"sleek dark modes"* ทำให้ AI Agent มีพฤติกรรมอัตโนมัติที่จะเลือก Dark Theme ขึ้นมาเป็นลำดับแรกเสมอเมื่อสร้าง HTML Standalone
2. **Hardcoded GitHub Dark Palette ใน Playbooks (`devflow/docs/playbooks/*.html`)**:
   ไฟล์ Playbook ทุกไฟล์เดิม (เช่น `ponytail.html`, `bughunter.html`, `autopilot.html`, `brief.html`, `devflow.html`) ถูกสร้างขึ้นด้วย CSS Variables มืดสนิท (`--bg: #0d1117; --surface: #161b22; --surface-border: #30363d;`) โดยไม่มีการสลับเป็น Light Theme หรือตรวจจับ System preference
3. **Archify Diagram Engine Default (`.agents/skills/archify/`)**:
   ใน Renderer หลักของ `archify` มีการกำหนดค่าเริ่มต้นในเทมเพลต HTML เป็น:
   `<html lang="en" data-theme="dark" data-preset="classic">`
   แม้ว่าภายในจะมี CSS รองรับ `[data-theme="light"]` อยู่แล้ว แต่ค่าเริ่มต้นที่ถูกเรนเดอร์ออกมาคือ dark เสมอ
4. **Diagram-Design Asset Library (`.agents/skills/diagram-design/`)**:
   มีชุดตัวอย่างและเทมเพลตแยกเป็นคู่ โดยมักมีชื่อลงท้ายด้วย `-dark.html` (เช่น `template-dark.html`, `example-high-level-dark.html`) ซึ่งตัวอย่างส่วนใหญ่นำเสนอสไตล์ Dark Mode

---

## 2. มาตรฐานใหม่: Paper & Ink Light Theme Design System

ยึดแม่แบบจาก `devflow/docs/playbooks/template.html` เป็นมาตรฐานกลางของทุกงาน HTML:
- **Default `data-theme="light"`**: พื้นหลัง Canvas กระดาษนุ่มตา `--bg: #f5f6f8` พร้อมเส้นกริดจาง 32px
- **Pure White Surfaces**: การ์ดและกล่องเนื้อหา `--surface: #ffffff` พร้อมขอบ `--border: #e1e4ea`
- **High Contrast Ink**: เนื้อหาตัวหนังสือ `--ink: #171a21` และ `--ink-muted: #5b6072`
- **Primary Teal Accent**: `--accent: #0f766e` ดูโปรเฟสชันแนล ไม่ฉูดฉาด
- **Single Focal Motion**: จุดนำสายตามุมไม้บรรทัด (ruler-corner) + จุดสถานะ live กระพริบนุ่มนวล (ส่วนอื่นนิ่ง ไม่แย่งสายตา)
- **Interactive Terminal Mockup UI**: บล็อกจำลอง CLI เทอร์มินัลจริง พร้อม cursor กะพริบ
- **Sequential Pipeline Animation**: มีเอฟเฟกต์ step-in เฉพาะเนื้อหาที่เป็นลำดับขั้นจริง
- **Diagram Slot**: ระบุคำสั่งเรียก `archify` / `diagram-design` ด้วย `data-theme="light"` ให้เข้าชุดเสมอ
- **Typography & A11y**: ฟอนต์ Google Sans สำหรับ Display & Body, รองรับ prefers-reduced-motion และ focus-visible

---

## 3. สถาปัตยกรรมและผลการดำเนินงาน (Execution Evidence)

1. **บันทึกมาตรฐานสู่ Living Standards**:
   - `devflow/context/coding-standards.md` (เพิ่มข้อ 12: HTML Documentation & Theming Standards)
   - `AGENTS.md` (อัปเดต Universal Contextual Help & Playbook Protocol บังคับใช้ Light Theme)
2. **แม่แบบหลัก (Master Template)**:
   - จัดเก็บไว้ที่ [devflow/docs/playbooks/template.html](file:///d:/devtools/nexus-devflow/devflow/docs/playbooks/template.html)
3. **แปลงไฟล์ Playbooks ทั้งหมดสู่ Light Theme**:
   - [devflow/docs/playbooks/ponytail.html](file:///d:/devtools/nexus-devflow/devflow/docs/playbooks/ponytail.html)
   - [devflow/docs/playbooks/bughunter.html](file:///d:/devtools/nexus-devflow/devflow/docs/playbooks/bughunter.html)
   - [devflow/docs/playbooks/devflow.html](file:///d:/devtools/nexus-devflow/devflow/docs/playbooks/devflow.html)
   - [devflow/docs/playbooks/discovery.html](file:///d:/devtools/nexus-devflow/devflow/docs/playbooks/discovery.html)
   - [devflow/docs/playbooks/autopilot.html](file:///d:/devtools/nexus-devflow/devflow/docs/playbooks/autopilot.html)
   - [devflow/docs/playbooks/brief.html](file:///d:/devtools/nexus-devflow/devflow/docs/playbooks/brief.html)
   - [devflow/docs/playbooks/setup-tests.html](file:///d:/devtools/nexus-devflow/devflow/docs/playbooks/setup-tests.html)
4. **แผนภาพสถาปัตยกรรม (Light Theme Diagram)**:
   - [devflow/discoveries/DISC-20260909-002-light-theme-html-standardization/diagrams/html-theming-pipeline.html](file:///d:/devtools/nexus-devflow/devflow/discoveries/DISC-20260909-002-light-theme-html-standardization/diagrams/html-theming-pipeline.html)

