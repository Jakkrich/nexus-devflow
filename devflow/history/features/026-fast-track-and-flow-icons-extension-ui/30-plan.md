---
id: "026-fast-track-and-flow-icons-extension-ui"
title: "Plan: DevFlow IDE Extension - Fast-Track & Flow Icons UI Support"
doc_type: "plan"
stage: "30-plan"
created: "2026-08-21"
updated: "2026-08-21"
owner: "Jakkrich & Antigravity"
status: "approved"
artifact_language: "th"
source_spec: "devflow/context/current-run/20-spec.md"
complexity: "standard"
category: "Feature"
---

# Plan: DevFlow IDE Extension - Fast-Track & Flow Icons UI Support

## 1. Executive Summary

แผนการดำเนินการพัฒนาสำหรับ Delivery Run `026-fast-track-and-flow-icons-extension-ui` เพื่อติดตั้งสเปก Fast-Track และระบบ Icons ประจำ Flow/Stage เข้าสู่ตัวระบบ DevFlow surface map, status summarizer scripts และเอกสารอ้างอิงของเครื่องมือ

---

## 2. Planning Loop Evidence & Strategy

- **Intent**: แปลงข้อกำหนดสเปกใน `20-spec.md` ให้เป็นขั้นตอนพัฒนา (Subtasks) ที่มีลำดับชัดเจน ปลอดภัย และทดสอบได้ 100%
- **Context**: ศึกษาโครงสร้างเอกสาร `docs/workflow-surface-map.md` และสคริปต์ `scripts/summarize-run-status.mjs`
- **Observation**: พบว่าสคริปต์ `scripts/summarize-run-status.mjs` และเอกสาร surface map ต้องปรับปรุงให้รองรับทั้ง Fast-Track และ Deep-Track พร้อมตาราง Icons
- **Stop Condition**: งานถูกแบ่งออกเป็น 3 Phase ที่มีไฟล์ เป้าหมาย คำสั่งทดสอบ และ Test Decision ชัดเจนครบถ้วน

---

## 3. Ordered Implementation Phases

### Phase 1: Surface Map & Command Taxonomy Update (FR-1, FR-2, FR-3)
- **Subtask 1.1**: อัปเดต `docs/workflow-surface-map.md` เพื่อจัดหมวดหมู่ Fast-Track, Deep-Track, Utilities และตาราง Icons
  - **Target Files**: `docs/workflow-surface-map.md`
  - **Test Decision**: `Required`
  - **Test Plan**: รัน `npm run check:static` และ `npm run validate:docs` เพื่อตรวจสัญญาสเปกเอกสาร
  - **Expected Result**: เอกสาร Surface Map สมบูรณ์ ครอบคลุม Fast-Track และ Icons

### Phase 2: Status Summarizer & Icons Logic Update (FR-4, FR-5)
- **Subtask 2.1**: ปรับปรุงสคริปต์ `scripts/summarize-run-status.mjs` ให้รองรับการสรุปสถานะ Fast-Track และเพิ่ม Icons mapping ในการแสดงผล
  - **Target Files**: `scripts/summarize-run-status.mjs`
  - **Test Decision**: `Required`
  - **Test Plan**: รัน `npm run validate:run-status:test`
  - **Expected Result**: สคริปต์ส่งคืนสถานะทั้ง Fast-Track และ Deep-Track พร้อม Icons ถูกต้อง

### Phase 3: Comprehensive Verification & Quality Gate Pass (AC-1, AC-2, AC-3)
- **Subtask 3.1**: รันการทดสอบภาพรวมทั้งระบบ (Typecheck, Framework Validation, Static Checks)
  - **Target Files**: `-`
  - **Test Decision**: `Required`
  - **Test Plan**: รัน `npm run check` และ `npm run check:static`
  - **Expected Result**: การทดสอบผ่านทั้งหมดโดยไม่มี Error

---

## 4. Test Decision Summary

| Subtask ID | Description | Test Decision | Rationale | Verification Command |
| :--- | :--- | :---: | :--- | :--- |
| **1.1** | Update `docs/workflow-surface-map.md` | `Required` | ตรวจสอบความถูกต้องของโครงสร้างเอกสาร | `npm run check:static` |
| **2.1** | Update `scripts/summarize-run-status.mjs` | `Required` | ตรวจสอบการทำงานของสคริปต์ประมวลผลสถานะ | `npm run validate:run-status:test` |
| **3.1** | Comprehensive Verification Pass | `Required` | ตรวจสอบคุณภาพและความถูกต้องรวมของระบบ | `npm run check` |

---

## 5. Approval Status

- **Status:** Approved
- **Next Allowed Command:** `/40-execute`
