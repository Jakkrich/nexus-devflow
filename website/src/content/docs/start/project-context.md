---
title: Project Context & Baseline
description: ทำความเข้าใจโฟลเดอร์ devflow/context/ และการกำหนด Single Source of Truth ให้กับ AI ทุกตัว
---

ความท้าทายที่ใหญ่ที่สุดของการพัฒนาซอฟต์แวร์ด้วย AI คือ **"Context Drift"** หรือการที่ AI ลืมบริบท, เข้าใจสถาปัตยกรรมคลาดเคลื่อน, หรือละเมิดรูปแบบการเขียนโค้ดของทีม

**Nexus-DevFlow** แก้ปัญหานี้ด้วยการสร้าง **Context Layer (`devflow/context/`)** ที่ทำหน้าที่เป็น **Single Source of Truth** ถาวร ซึ่ง AI ทุกตัว (ไม่ว่าจะเป็น Antigravity, Claude Code, OpenAI Codex หรือ Cursor) จะต้องอ่านและปฏิบัติตามทุกครั้งที่เริ่ม Session ใหม่

---

## สถาปัตยกรรม Context Files ใน DevFlow

```text
devflow/context/
├── 📄 project-overview.md   ← ภาพรวมระบบ, สถาปัตยกรรม, Tech Stack, Shipped Features
├── 📄 coding-standards.md   ← กฎวิศวกรรม, รูปแบบโค้ด, Unit Test AAA, Security Policies
├── 📄 ai-interaction.md     ← มารยาทการสื่อสาร, ค่าเริ่มต้นภาษา, ขอบเขตอำนาจตัดสินใจ
├── 📄 current-stage.md      ← ตัวติดตามสถานะ Active Run และ Discovery แบบ Realtime
└── 📋 findings.md           ← สมุดบัญชีควบคุมคุณภาพและความปลอดภัย (Findings Ledger)
```

---

## เจาะลึกหน้าที่ของแต่ละไฟล์ Context

### 1. `project-overview.md` (Single Source of Truth)
ไฟล์นี้คือแผนที่นำทางหลักของโปรเจกต์ AI จะอ่านไฟล์นี้เพื่อให้เข้าใจว่าโปรเจกต์นี้คืออะไรและมีอะไรอยู่แล้วบ้าง:

- **Core Mission & Problem**: วัตถุประสงค์ของแอปพลิเคชันและกลุ่มผู้ใช้งาน
- **Tech Stack & Libraries**: เวอร์ชันของภาษา, เฟรมเวิร์ก, ORM, ฐานข้อมูล และเครื่องมือภายนอก
- **Architecture & Directory Map**: โครงสร้างโฟลเดอร์และ Seam Boundaries ของระบบ
- **Domain Models & Entities**: โมเดลข้อมูลหลัก (เช่น User, Order, Product, Workspace)
- **Shipped Features**: สารบัญฟังก์ชันที่เปิดใช้งานแล้ว เพื่อป้องกัน AI สร้างโค้ดซ้ำซ้อน

:::tip[ควรอัปเดต project-overview.md เมื่อไหร่?]
ทุกครั้งที่มีการปล่อยฟังก์ชันใหม่ผ่านสเตจ `70-release` หรือเมื่อมีการเปลี่ยนแปลงสถาปัตยกรรมครั้งสำคัญ AI จะอัปเดต Shipped Features ในไฟล์นี้โดยอัตโนมัติ
:::

---

### 2. `coding-standards.md` (กฎเกณฑ์วิศวกรรมซอฟต์แวร์)
ไฟล์นี้เป็นคู่มือควบคุมคุณภาพโค้ดที่เข้มงวด ป้องกันไม่ให้ AI สร้าง Technical Debt:

- **Naming & Formatting**: กฎการตั้งชื่อไฟล์, ตัวแปร (camelCase), ค่าคงที่ (UPPER_SNAKE_CASE), คลาส (PascalCase)
- **Modularity & Seams**: ห้ามสร้างฟังก์ชันยาวเกินกำหนด, การแยก Concern ระหว่าง Controller/Service/Repository
- **Error Handling**: การใช้ Custom Error Classes, ห้าม Swallow Error เงียบๆ, การคืน HTTP Status Code ที่มีความหมาย
- **Mandatory Unit Testing (AAA Pattern)**: บังคับให้เขียนเทสต์ตามโครงสร้าง **Arrange-Act-Assert** เสมอสำหรับทุก Behavior Change
- **Security & Secrets**: ห้าม Hardcode Secret/API Key, บังคับใช้ Parameterized Queries ป้องกัน SQL Injection, และการ Sanitize User Input

---

### 3. `ai-interaction.md` (ขอบเขตการทำงานของ AI)
ไฟล์นี้กำหนดแนวทางการสื่อสารและความปลอดภัยระหว่าง AI กับมนุษย์:

- **Default Language**: ค่าเริ่มต้นภาษาในการสร้าง Stage Artifacts และการสนทนา (เช่น ภาษาไทย `th`) โดยคงศัพท์เทคนิคเป็นภาษาอังกฤษ
- **Human-in-the-loop Boundaries**: สิ่งที่ AI **ต้องหยุดรอการอนุมัติ** (เช่น การรันคิวรีลบข้อมูล, การทำ Git Push/Merge, การแก้ Spec นอกขอบเขต)
- **Prohibited Actions**: ห้ามรันคำสั่งทำลายล้าง เช่น `rm -rf /`, `git push --force`, หรือการเข้าถึงไฟล์นอก Workspace โดยไม่ได้รับอนุญาต

---

### 4. `current-stage.md` (Active State Tracker)
ไฟล์นี้ทำหน้าที่เป็นตัวบอกตำแหน่ง (GPS) ของโปรเจกต์ เพื่อไม่ให้ผู้ใช้และ AI หลงทาง:

```markdown
# Current DevFlow State
- **Active Stage**: `40-execute`
- **Active Running ID**: `RUN-012-recheck-and-enrich-website-docs`
- **Source Discovery**: `DISC-20260818-012-recheck-and-enrich-website-docs`
- **Target Branch**: `main`
- **Step Progress**: Task 3/5 in progress
```

เมื่อคุณเปิด AI Session ใหม่ แล้วพิมพ์ `/devflow` ตัว AI จะอ่านไฟล์นี้ทันทีและสรุปให้คุณฟังว่างานค้างอยู่ที่ขั้นตอนไหนและคำสั่งถัดไปคืออะไร

---

### 5. `findings.md` (The Findings Ledger)
สมุดบัญชีควบคุมคุณภาพระดับ Senior QA สำหรับบันทึกข้อบกพร่อง ช่องโหว่ความปลอดภัย และ Technical Debt ที่ตรวจพบในระหว่างการ Verify หรือ Code Review:
- ทุก Finding มี ID ถาวร เช่น `FND-001`
- ระดับความรุนแรง `P0` ถึง `P3`
- สถานะวงจรชีวิต `open`, `fixed`, `closed`

*(อ่านรายละเอียดเจาะลึกได้ที่หน้า [The Findings Ledger](../../quality/findings-ledger/))*

---

## วิธีการเชื่อมโยง Context สู่ AI ทุกค่าย

Nexus-DevFlow ใช้ไฟล์ **`AGENTS.md`** (และ `CLAUDE.md` ที่ import เข้ามา) ที่ Root ของโปรเจกต์เป็นทางเข้าหลัก (Cross-Tool Entrypoint)

```markdown
<!-- ตัวอย่างการเชื่อมโยงใน AGENTS.md -->
## Read these for full context
- `devflow/context/project-overview.md` - the project's source of truth
- `devflow/context/coding-standards.md` - engineering conventions & rules
- `devflow/context/ai-interaction.md` - how to interact with the user
- `devflow/context/current-stage.md` - active discovery or running delivery state
- `devflow/context/findings.md` - quality, security, and verification ledger
```

ทำให้ไม่ว่าคุณจะใช้ AI ตัวไหนในทีม ทุกตัวจะอ่านบริบทชุดเดียวกัน 100%

---

## 3 กฎเหล็กในการรักษา Context ให้สดใหม่อยู่เสมอ

1. 🔄 **รัน `/doctor` เป็นประจำ**: ตรวจสอบสุขภาพของไฟล์ Context ว่ามีการตกหล่นหรือล้าสมัยหรือไม่
2. 🛡️ **อย่าปล่อยให้ `project-overview.md` หายใจช้ากว่าโค้ด**: เมื่อเพิ่ม Core Module ใหม่ ให้อัปเดตไฟล์นี้ทันที
3. 📝 **บันทึกกฎใหม่ใน `coding-standards.md`**: เมื่อพบข้อผิดพลาดที่ AI ทำซ้ำ ให้เพิ่มกฎข้อห้ามลงในไฟล์นี้ทันที AI ทุกตัวในอนาคตจะไม่ทำผิดซ้ำเดิมอีก
