# คู่มือการย้ายโครงสร้างโฟลเดอร์สู่ Decade-Numbered Stages (Migration Guide)

> **DevFlow Version**: 2.16.5+  
> **Topic**: การจัดระเบียบโฟลเดอร์ `devflow/` ตามลำดับขั้นตอนด้วย Decade-Numbered Stages และการอัปเกรดจากโครงสร้างเดิม

---

## 🌟 1. สถาปัตยกรรมโฟลเดอร์ Decade-Numbered Stages

เพื่อแก้ปัญหาโฟลเดอร์ใน `devflow/` กระจัดกระจายและไม่มีตัวเลขจัดเรียงสายตาใน IDE ทาง DevFlow ได้แนะนำโครงสร้าง **Decade-Numbered Stages Structure** (`00-`, `10-`, `20-`, ...) ที่ช่วยให้ทั้งผู้ใช้งานและ AI Agent ไล่ลำดับขั้นตอนการพัฒนาได้อย่างเป็นธรรมชาติ:

```text
devflow/
├── config.json                     # Root configuration
├── .state/                         # Runtime state (run.json - Git ignored)
├── .vendor/                        # External vendor skills (bughunter, ponytail, ฯลฯ)
│
├── 00-context/                     # [Foundation & Source of Truth]
│   ├── project-overview.md         # Living overview (สถาปัตยกรรม & tech stack ล่าสุด)
│   ├── coding-standards.md         # กฎระเบียบและมาตรฐานการเขียนโค้ด
│   ├── ai-interaction.md           # ข้อกำหนดการทำงานร่วมกับ AI Agent
│   └── glossary.md                 # พจนานุกรมศัพท์เฉพาะของระบบ
│
├── 10-ideation/                    # [Input & Reference Ingestion]
│   ├── ideas.md                    # บันทึกไอเดียใหม่ (Idea Inbox)
│   ├── inbox/                      # ไฟล์ดิบจากภายนอก (PDF, Excel, Word, ภาพ)
│   └── reference/                  # เอกสารที่แปลงเป็น Markdown สะอาดพร้อมใช้งาน
│
├── 20-discovery/                   # [Analysis, Exploration & Architecture]
│   ├── analysis/                   # ผลการวิเคราะห์ System Analyst (/analyze)
│   ├── discoveries/                # Pre-flight Spikes & Research (/discovery)
│   ├── decisions/                  # บันทึกการตัดสินใจ ADRs (/grill)
│   ├── research/                   # เอกสารวิจัยเชิงลึกและ Benchmark
│   ├── 21-prototype/               # (Optional: Static UI mockups / prototype)
│   └── 22-diagrams/                # (Optional: System & Architecture Diagrams)
│
├── 30-planning/                    # [Roadmap & Master Plans]
│   ├── project-plan.md             # Master Roadmap & Milestones
│   └── build-plan.md               # Master Delivery Checklist
│
├── 40-tasks/                       # [Active Living Spec Workspaces]
│   └── {xxx-slug}/                 # Active task workspace (สร้างตอนทำฟีเจอร์/แก้บั๊ก)
│       ├── spec.md                 # Task-Isolated Living Spec
│       ├── stage.md                # ตัวชี้สถานะ Stage
│       ├── findings.md             # บันทึกบั๊ก/Audit ประจำงาน
│       └── tickets/                # Tracer-bullet tickets ย่อย
│
├── 50-history/                     # [Shipped & Delivered Archives]
│   ├── HISTORY.md                  # Release Ledger สรุปภาพรวมประวัติ
│   ├── features/                   # ฟีเจอร์ที่ส่งมอบแล้ว
│   ├── fixes/                      # บั๊กที่แก้แล้ว
│   └── rollbacks/                  # ฟีเจอร์ที่ถูก rollback
│
└── 60-docs/                        # [Documentation & System Playbooks]
    └── playbooks/                  # Interactive HTML Playbooks (5W1H)
```

---

## ⚡ 2. จุดเด่นของการใช้เลขทศวรรษ (Decade Convention: `00-`, `10-`, `20-`)

1. **ลำดับสายตาใน Editor สวยงาม**: เรียงตามลำดับความก้าวหน้าของโครงการ
2. **ขยาย Sub-stages ในอนาคตได้ง่าย (Future-Proof)**: สามารถสร้างโฟลเดอร์แทรก เช่น `21-prototype`, `22-diagrams` ได้โดยไม่ต้องแก้เลขนำหน้าของโฟลเดอร์อื่น
3. **ตัดโฟลเดอร์ Legacy ออก 100%**: ลบโฟลเดอร์ `devflow/runs/` ที่ไม่ได้ใช้งานตั้งแต่ v1.x ออกอย่างปลอดภัย

---

## 🚀 3. วิธีการ Migrate อัตโนมัติ

### 1) รันอัตโนมัติผ่านคำสั่ง `update` (แนะนำที่สุด):
เมื่อโปรเจกต์ Client สั่งอัปเดตเวอร์ชัน DevFlow ด้วยคำสั่ง:
```bash
npx nexus-devflow update
```
ระบบจะตรวจจับโครงสร้างโฟลเดอร์อัตโนมัติ:
* **หากยังเป็นโครงสร้างเดิม (Legacy)**: ระบบจะรันกระบวนการ `migrate-structure` ให้อัตโนมัติทันที พร้อมย้ายไฟล์เข้า `00-`, `10-`, `20-`, `30-`, `40-`, `50-`, `60-` และลบ `devflow/runs/`
* **หากเป็นโครงสร้าง Decade-Numbered อยู่แล้ว**: ระบบจะไม่ทำอะไรกับโฟลเดอร์ (No-op) และดำเนินการอัปเดตโค้ดต่อไปอย่างปลอดภัย

### 2) สั่ง Migrate ด้วยตัวเองโดยตรง:
หากต้องการย้ายโครงสร้างทันทีโดยไม่อัปเดตส่วนอื่น สามารถสั่งได้ผ่านคำสั่ง:
```bash
npx nexus-devflow migrate-structure
```


---

## 🛡️ 4. การรองรับ Client เวอร์ชันเก่า (Zero-Breaking Compatibility)

ระบบ DevFlow มีกลไก **Dynamic Workspace Path Resolver** (`resolveWorkspacePaths`) ที่จะ:
1. ตรวจสอบว่าโปรเจกต์ใช้โครงสร้าง Decade-Numbered หรือไม่ (มี `devflow/00-context` หรือไม่)
2. หากไม่พบ จะ **Fallback กลับไปหา Path เดิม (`devflow/context/`, `devflow/history/`) อัตโนมัติ 100%**
3. โปรเจกต์เก่าที่ยังไม่ได้ Migrate จึงยังคงรันคำสั่งสถานะ, ตรวจสอบคุณภาพ, และบิวด์ได้ตามปกติโดยไม่มีข้อผิดพลาด
