# Phase 30: Implementation Plan

- **Running ID**: `RUN-010-improve-website-documentation-content`
- **Title**: แผนการปรับปรุงเนื้อหาบนเว็บไซต์ Documentation (Workflow เชิงลึกแบบไม่ใช้ตาราง, Companion Commands 70+ ตัวครบทุกโฟลเดอร์, และ Role-Based Usage Guide)
- **Source Spec**: [20-spec.md](20-spec.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Documentation & DX Team

---

## 1. การประเมินความซับซ้อนและยุทธศาสตร์ (Complexity Assessment & Strategy)

- **ระดับความซับซ้อน (Complexity)**: `Standard` (ปรับปรุงและเพิ่มเติมเนื้อหาใน Astro Starlight Docs, ออกแบบการจัดวางข้อมูลแบบ Non-Table, จัดหมวดหมู่ 70+ Skills, จัดทำคู่มือ Persona/Role-Based Guides, และทดสอบ Build)
- **ยุทธศาสตร์ (Strategy)**:
  1. **Phase 1: Mainline Stages Deep-Dive (Non-Table)**: เปลี่ยนรูปแบบการนำเสนอใน `workflow/core-workflow.md` และ `commands/mainline-stages.md` เป็นการ์ดและหัวข้อเชิงลึกที่อธิบาย Intent, Inputs/Context, Execution Loop, Deliverables, และ Review Gate Criteria ครบทั้ง 8 ขั้นตอน
  2. **Phase 2: 70+ Companion Commands Catalog**: จัดหมวดหมู่และแจกแจงทุก Skill ที่มีอยู่ใน `.agents/skills/` ลงใน `commands/companion-commands.md` แบ่งเป็น 8 หมวดหมู่อย่างเป็นระบบ พร้อม Syntax การเรียกใช้งานและตัวอย่าง
  3. **Phase 3: Role-Based Usage Guides**: สร้างหน้า `start/roles-guide.md` และผูกเข้า Sidebar ใน `website/astro.config.mjs` เพื่อแนะนำ Best Practices ตั้งแต่ Junior Developer จนถึง Engineering Manager / Product Manager
  4. **Phase 4: Build Verification & Integrity Check**: ทดสอบ Build เว็บไซต์ด้วย `npm run docs:build` และรัน `npm run check:static` กับ `npm test` เพื่อยืนยันความสมบูรณ์

---

## 2. ลำดับเฟสและรายการงานย่อย (Ordered Phases & Subtasks)

### Phase 1: การปรับปรุง Workflow หลักและ Mainline Stages แบบ Non-Table
- **Subtask 1.1**: ปรับปรุงหน้า `website/src/content/docs/workflow/core-workflow.md`
  - อธิบาย 8 Stages (`00-discover` ถึง `70-release`) เชิงลึกแบบการ์ด/ลำดับขั้น ไม่ใช้ตารางสรุปสั้น
  - *Files*: `website/src/content/docs/workflow/core-workflow.md`
  - *Test Decision*: `Not Required` (Documentation Content)
  - *Verification*: ตรวจสอบโครงสร้างและการจัดวางเนื้อหา
- **Subtask 1.2**: ปรับปรุงหน้า `website/src/content/docs/commands/mainline-stages.md`
  - เสริมรายละเอียดของ Mainline Commands พร้อมตัวอย่าง Arguments, Artifact Paths, และ Review Gates
  - *Files*: `website/src/content/docs/commands/mainline-stages.md`
  - *Test Decision*: `Not Required` (Documentation Content)
  - *Verification*: ตรวจสอบความถูกต้องของคำสั่งและพาธไฟล์

### Phase 2: การรวบรวม Companion Commands ครบทุกโฟลเดอร์ (70+ Skills)
- **Subtask 2.1**: ปรับปรุงหน้า `website/src/content/docs/commands/companion-commands.md`
  - รวบรวมทุก Skill ใน `.agents/skills/` และจัดแบ่งเป็น 8 หมวดหมู่:
    1. Core Utilities & Navigation
    2. Autonomous & Discovery
    3. Investigation & Quality Assurance
    4. Architecture & Engineering Design
    5. Frontend, UI & Full-Stack
    6. Backend, Systems & Platforms
    7. Git & Delivery Lifecycle
    8. AI Collaboration & Metaprogramming
  - *Files*: `website/src/content/docs/commands/companion-commands.md`
  - *Test Decision*: `Not Required` (Documentation Content)
  - *Verification*: ตรวจสอบว่ามีชื่อ Skill ครบทุกตัวตามที่มีใน `.agents/skills/`

### Phase 3: การจัดทำ Role-Based Usage Guide
- **Subtask 3.1**: สร้างหน้าใหม่ `website/src/content/docs/start/roles-guide.md`
  - ครอบคลุม 4 ระดับบทบาท: Junior Developer, Senior Engineer, Tech Lead/Architect, Product/Engineering Manager
  - *Files*: `website/src/content/docs/start/roles-guide.md`
  - *Test Decision*: `Not Required` (Documentation Content)
  - *Verification*: ตรวจสอบเนื้อหา คำแนะนำ และสถานการณ์การใช้งานจริง
- **Subtask 3.2**: อัปเดต Sidebar ใน `website/astro.config.mjs`
  - เพิ่มลิงก์ `Role-Based Guides` ภายใต้หมวด `Start`
  - *Files*: `website/astro.config.mjs`
  - *Test Decision*: `Manual/Command Only`
  - *Verification*: ตรวจสอบ Sidebar Config ใน Astro

### Phase 4: การทดสอบ Build และความสมบูรณ์ของระบบ
- **Subtask 4.1**: ทดสอบ Local Build ของ Docs Website (`npm run docs:build`)
  - *Test Decision*: `Manual/Command Only`
  - *Verification*: Output ถูกสร้างใน `website/dist/` โดยไม่มีข้อผิดพลาด
- **Subtask 4.2**: รันชุดตรวจสอบความสมบูรณ์ของ Framework (`npm run check:static` และ `npm test`)
  - *Test Decision*: `Required`
  - *Verification*: ชุดทดสอบและสัญญาผ่าน 100%

---

## 3. แผนการตรวจสอบและเกณฑ์การผ่าน (Verification Strategy)

| Layer | Command / Action | Expected Outcome |
| :--- | :--- | :--- |
| **Docs Build** | `npm run docs:build` | Static HTML คอมไพล์สำเร็จ 100% ไม่มี broken link |
| **Static Framework** | `npm run check:static` | ผ่านการตรวจสอบสัญญา Skill naming และ manifests |
| **Installer Unit Tests** | `npm test` | Unit tests ของ package installer ผ่าน 100% |

---

## 4. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
40-implement RUN-010-improve-website-documentation-content
```
