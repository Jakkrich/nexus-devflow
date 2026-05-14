# 📋 มาตรฐานและเทมเพลตสำหรับ PRPs Framework

โฟลเดอร์นี้ทำหน้าที่เป็น **Source of Truth** สำหรับไฟล์ JSON และ Markdown ทั้งหมดที่ใช้ใน PRPs-Framework เพื่อให้มั่นใจว่าการสื่อสารกับ **PRPs Dashboard** มีความต่อเนื่องและเป็นมาตรฐานเดียวกันสำหรับ AI Agents ทุกตัว

> 📖 **ข้อมูลอ้างอิงมาตรฐาน**: สำหรับรายละเอียดของ Attributes ทั้งหมดและค่าที่อนุญาต โปรดดูที่ [SCHEMA.md](./SCHEMA.md)

> 💡 **หมายเหตุเกี่ยวกับ Framework**: เทมเพลตเหล่านี้คือ "Core DNA" ของระบบ โดยจะเก็บไว้ในโฟลเดอร์โครงการ (เช่น `.cursor/resources/schemas/`) แต่ข้อมูลที่ใช้งานจริงจะถูกจัดการภายในโฟลเดอร์โปรเจกต์ภายใต้ `.workspaces/`

---

## 🔄 ตารางความสัมพันธ์ของสถานะ (State Mapping Table)

| Dashboard Column | `status` | `planStatus` | `xstateState` |
| :--- | :--- | :--- | :--- |
| **Backlog** | `backlog` | `pending` | `backlog` |
| **Planning** | `in_progress` | `planning` | `planning` |
| **In Progress** | `in_progress` | `approved` | `coding` |
| **AI Review** | `ai_review` | `review` | `qa_review` |
| **Human Review** | `human_review` | `review` | `human_review` |
| **Done** | `done` | `done` | `done` |

---

## 📋 รายการไฟล์และวัตถุประสงค์ (File Manifest & Purpose)

| ชื่อไฟล์ | วัตถุประสงค์หลัก | สร้าง/อัปเดตเมื่อ (Skills) |
| :--- | :--- | :--- |
| `spec.md` | ข้อกำหนดความต้องการ (Human-readable) | `spec-driven-development` |
| `requirements.json` | รายละเอียดความต้องการเชิงลึก (System-readable) | `spec-driven-development` |
| `task_metadata.json` | Badges, หมวดหมู่ และการตั้งค่า AI | `spec-driven-development` |
| `implementation_plan.json` | สถานะ Kanban, แผนงาน และงานย่อย (Hub) | `planning-and-task-breakdown`, `incremental-implementation` |
| `context.json` | ข้อมูลบริบทและไฟล์ที่เกี่ยวข้อง (RAG) | `planning-and-task-breakdown` |
| `task_logs.json` | Timeline การทำงานแบบ Real-time | ทุก Skills (เมื่อเริ่ม/จบขั้นตอนสำคัญ) |
| `qa_report.md` | สรุปผลการทดสอบและการตรวจสอบ | `code-review-and-quality`, `shipping-and-launch` |

---

## 🛡️ กฎเหล็กสำหรับ AI (Critical Rules for AI)

1. **ตรวจสอบเทมเพลตเสมอ**: ต้องตรวจสอบไฟล์ `*.template.json` ในโฟลเดอร์นี้ทุกครั้งก่อนสร้างไฟล์ใหม่
2. **ห้ามลบ Attributes**: เก็บ Keys ทั้งหมดไว้เสมอ แม้ว่าจะไม่มีข้อมูลก็ตาม
3. **ID ต้องเป็น String**: ตัวเลขงานย่อย เช่น `"1.1"` ต้องกำหนดเป็น String
4. **มาตรฐาน ISO Date**: Timestamps ทั้งหมดต้องใช้รูปแบบ ISO 8601 (UTC)
5. **Phase ต้องเป็น Integer**: หมายเลขลำดับเฟสต้องเป็นตัวเลขจำนวนเต็ม
6. **บันทึก Timeline อย่างต่อเนื่อง**: อัปเดต `task_logs.json` ทุกครั้งหลังจบการใช้เครื่องมือ (Tool) หรือขั้นตอนสำคัญ
7. **ใช้ Node CLI เป็นทางหลัก**: ใช้ `npx agent-flow` สำหรับ init/update/log/event/validate/repair แทนการเขียน JSON โดยตรง
8. **ผ่าน JSON Schema Gate**: ทุก phase ต้องจบด้วย `npx agent-flow validate {ID}` และถ้า fail ให้ใช้ `npx agent-flow repair {ID}` ก่อนเดินต่อ

---

## 🏷️ ค่าที่อนุญาต (Allowed Values)

- **Category**: `feat`, `bug_fix`, `refactoring`, `documentation`, `security`, `performance`, `ui_ux`, `infrastructure`, `testing`
- **Complexity**: `trivial`, `small`, `medium`, `large`, `complex`
- **Priority**: `low`, `medium`, `high`, `urgent`
- **Impact**: `low`, `medium`, `high`, `critical`


