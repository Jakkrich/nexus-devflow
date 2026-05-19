# 📋 มาตรฐานและเทมเพลตสำหรับ PRPs Framework

โฟลเดอร์นี้ทำหน้าที่เป็น **Source of Truth** สำหรับไฟล์ JSON และ Markdown ทั้งหมดที่ใช้ใน Nexus-DevFlow เพื่อให้มั่นใจว่าการสื่อสารกับ **PRPs Dashboard** มีความต่อเนื่องและเป็นมาตรฐานเดียวกันสำหรับ AI Agents ทุกตัว

> 📖 **ข้อมูลอ้างอิงมาตรฐาน**: สำหรับรายละเอียดของ Attributes ทั้งหมดและค่าที่อนุญาต โปรดดูที่ [SCHEMA.md](./SCHEMA.md)

> 💡 **หมายเหตุเกี่ยวกับ Framework**: เทมเพลตเหล่านี้คือ "Core DNA" ของระบบ โดยจะเก็บไว้ในโฟลเดอร์โครงการ (เช่น `.agent/resources/schemas/`) แต่ข้อมูลที่ใช้งานจริงจะถูกจัดการภายในโฟลเดอร์โปรเจกต์ภายใต้ `.workspaces/`

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

### Markdown Template Manifest

ทุก workflow ที่สร้างไฟล์ Markdown ต้องอ่าน template ที่เกี่ยวข้องในโฟลเดอร์นี้ก่อนสร้างหรืออัปเดตไฟล์ และต้องคงหัวข้อหลักตาม template ไว้เสมอ

| Output file | Template | Workflow หลัก |
| :--- | :--- | :--- |
| `INITIAL.md` | `initial.template.md` | `/00-Init` |
| `ROADMAP.md` | `roadmap.template.md` | `/17-Roadmap` |
| `CHANGELOG.md` entry | `changelog_entry.template.md` | `/53-Changelog` |
| `.workspaces/specs/{ID}-*/spec.md` | `spec.template.md` | `/30-Task` |
| `.workspaces/specs/{ID}-*/plan.md` | `plan.template.md` | `/31-Plan` |
| `.workspaces/specs/{ID}-*/qa_report.md` | `qa_report.template.md` | `/33-Verify`, `/34-Human` |
| `.workspaces/specs/{ID}-*/pr_review.md` | `pr_review.template.md` | `/55-PR-Review` |
| `.workspaces/research/{date}-{slug}.md` | `research.template.md` | `/11-Research` |
| `.workspaces/prds/{slug}.prd.md` | `prd.template.md` | `/12-PRD` |
| `.workspaces/research/{date}-{slug}-spec-research.md` | `spec_research.template.md` | `/15-Spec-Research` |
| `.workspaces/debug/rca-{slug}.md` | `rca.template.md` | `/20-Debug` |
| `.workspaces/research/brainstorm-{topic}.md` | `brainstorm.template.md` | `/10-Brainstorm` |
| `.workspaces/research/{date}-{slug}-competitor-analysis.md` | `competitor_analysis.template.md` | `/16-Competitor` |
| `.workspaces/reports/ui-ux-{topic}.md` | `ui_ux.template.md` | `/13-UI-UX` |
| `.workspaces/reports/spec_orchestration-{slug}.md` | `spec_orchestration.template.md` | `/18-Spec-Orchestrate` |
| `.workspaces/reports/qa_orchestrate_{ID}.md` | `qa_orchestration.template.md` | `/39-QA-Orchestrate` |
| `.workspaces/reports/test_report_{target}.md` | `test_report.template.md` | `/40-Test` |
| `.workspaces/reports/refactoring_{slug}.md` | `refactoring.template.md` | `/41-Simplify` |
| `.workspaces/reports/deploy_report_{timestamp}.md` | `deploy_report.template.md` | `/52-Deploy` |
| `.workspaces/reports/pr_followup_{ID}.md` | `pr_followup.template.md` | `/56-PR-Followup` |
| `.workspaces/issues/triage_{issue_number}.md` | `triage.template.md` | `/57-Issue-Triage` |
| `.workspaces/reports/{AGENT_NAME}_{TIMESTAMP}.md` | `agent_report.template.md` | `/90-Agent` |
| `.workspaces/lessons.md` | `lessons.template.md` | `/20-Debug`, `/34-Human`, `/54-Insight` |

---

## 🛡️ กฎเหล็กสำหรับ AI (Critical Rules for AI)

1. **ตรวจสอบเทมเพลตเสมอ**: ต้องตรวจสอบไฟล์ `*.template.json` หรือ `*.template.md` ในโฟลเดอร์นี้ทุกครั้งก่อนสร้างไฟล์ใหม่
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


