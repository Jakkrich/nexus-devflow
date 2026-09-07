# Feature 075: DevFlow `/implement` รองรับ Input จาก `to-tickets` (Tracer-Bullet Tickets Bridge)

> **Template Type**: Task-Isolated Living Spec Archive  
> **Source Location**: `.scratch/implement-to-tickets-bridge/spec.md`  
> **Archive Location**: `devflow/history/features/075-implement-to-tickets-bridge.md`  

- **Feature ID**: `075-implement-to-tickets-bridge`
- **Category**: `features`
- **Status**: `Completed`
- **Track**: `Unified Fast-Track`
- **Author**: Matt Pocock Flow Orchestrator & DevFlow

---

## 🎯 1. Problem Statement & Solution

### Problem Statement
ในกระบวนการทำงานร่วมกันระหว่าง **Nexus-DevFlow** และ **Matt Pocock The Main Flow** (`/grill-with-docs` ➔ `/to-spec` ➔ `/to-tickets`):
- ทักษะ `/to-tickets` จะทำการย่อย Spec ออกมาเป็น **Tracer-Bullet Tickets** ที่มีคุณสมบัติเป็น Vertical Slice ข้ามทุก Layer (Schema, API, UI, Test) และมีการระบุลำดับการพึ่งพาที่ชัดเจน (`**Blocked by:**`)
- เมื่อนักพัฒนาต้องการส่งต่องานจาก `/to-tickets` เข้าสู่ขั้นตอนการ Coding จริงใน `/implement` ของ DevFlow กลับยังไม่มี Interface หรือกลไกในการรับ Ticket เหล่านี้เข้าไปเป็น Input โดยตรง
- ทำให้นักพัฒนาต้องคัดลอก Acceptance Criteria มาใส่ใน `spec.md` ซ้ำซ้อน หรือขาดความสามารถในการรันงานตาม Ticket Frontier (งานที่ปลดบล็อกแล้ว) พร้อมกับการคุม Context Window ขนาด 150k tokens (Smart Zone) ตามแนวทางของ Matt Pocock

### Solution
ปรับปรุง Skill Specification และ Command Contract ของ `/implement` (ทั้ง `.agents/skills/implement/SKILL.md` และ `.claude/skills/implement/SKILL.md`) รวมถึง Skill `matt-pocock` (`SKILL.md`) ให้รองรับโหมด **Ticket-Driven Implementation**:
1. **รองรับ Input เพิ่มเติม**: Argument ชี้เป้า Ticket ได้โดยตรง (`--ticket <NN | path>`) หรือ Auto-Detect จาก hierarchy
2. **ระบบวิเคราะห์ลำดับการพึ่งพา (Frontier Dependency Resolution)**: ตรวจสอบฟิลด์ `**Blocked by:**` ของ Tickets ทั้งหมด เพื่อเลือกงานที่ปลดบล็อกแล้ว (Unblocked Frontier) มาทำก่อนโดยอัตโนมัติ พร้อม Blocker Guardrail
3. **Strict TDD Loop**: นำ What to build และ Acceptance Criteria ของแต่ละ Ticket มารัน Red ➔ Green ➔ Refactor
4. **การซิงค์สถานะสองทาง (Bidirectional State Synchronization)**: ติ๊ก `- [x]` ใน Ticket และอัปเดต `Status: done` ควบคู่กับการสะท้อนผลกลับสู่ `spec.md`
5. **Backward Compatibility 100%**: หาก Task ไม่มี Ticket จะรันตาม Checklist ใน `spec.md` ตามปกติ

---

## 📋 2. Tickets & Acceptance Criteria

### Ticket 01: Ticket Input & Discovery Contract in Implement Skill Adapters
- `Status: done`
- [x] ปรับปรุง Frontmatter `argument-hint` ของ `.agents/skills/implement/SKILL.md` ให้เป็น `argument-hint: "[{run-id, number, or name}] [--ticket <NN | path>]"`
- [x] กำหนดส่วน "Ticket-Driven Target & Discovery Resolution" ใน `.agents/skills/implement/SKILL.md` ให้รองรับการค้นหาตามลำดับความสำคัญ (1: `tickets/`, 2: `issues/`, 3: `.scratch/.../issues/`, 4: Section `## 🎫 Tracer-Bullet Tickets` ใน `spec.md`)
- [x] ซิงค์การเปลี่ยนแปลงทั้งหมดไปยัง `.claude/skills/implement/SKILL.md` ให้ตรงกัน 100%
- [x] รองรับการทำงานแบบ Backward Compatibility: หาก Task ไม่มี Ticket จะรันตาม Checklist ใน `spec.md` ตามปกติ

### Ticket 02: Frontier Dependency Resolution & Ticket TDD Loop
- `Status: done`
- [x] เพิ่มคำสั่งและอัลกอริทึม Frontier Resolution ใน `.agents/skills/implement/SKILL.md` เพื่อประเมิน `**Blocked by:**` ของชุด Ticket
- [x] กำหนดเงื่อนไข Guardrail: หากผู้ใช้เจาะจง Ticket ที่มี Blocker ค้างอยู่ ให้แจ้งเตือนและเสนอทางเลือกให้สลับไปทำ Blocker ก่อน
- [x] กำหนดกระบวนการเชื่อมต่อเงื่อนไขใน Ticket เข้ากับลูป Strict TDD (เขียน Test ก่อนสำหรับ Acceptance Criteria แต่ละข้อ จากนั้นเขียน Minimal Code และ Refactor)
- [x] ระบุให้รันคำสั่ง Verify gate ของโปรเจกต์ (`npm run check` หรือ stack verify command) เพื่อยืนยันว่า Ticket สำเร็จจริง
- [x] ซิงค์การเปลี่ยนแปลงทั้งหมดไปยัง `.claude/skills/implement/SKILL.md` ให้ตรงกัน 100%

### Ticket 03: Bidirectional State Sync, Matt Pocock Dispatcher & Interaction Guidelines
- `Status: done`
- [x] กำหนดกระบวนการ Bidirectional State Sync ใน `.agents/skills/implement/SKILL.md` และ `.claude/skills/implement/SKILL.md` เพื่อติ๊ก `- [x]` ใน Ticket และบันทึกผลลงใน `spec.md`
- [x] ปรับปรุง `.agents/skills/matt-pocock/SKILL.md` ใน Flow 02, Flow 05 และ CLI Dispatcher ให้เชื่อมต่อคำสั่ง `/matt-pocock run-ticket <NN>` กับ `/implement --ticket <NN>`
- [x] ซิงค์การเปลี่ยนแปลงทั้งหมดไปยัง `.claude/skills/matt-pocock/SKILL.md` ให้ตรงกัน 100%
- [x] อัปเดต `devflow/context/ai-interaction.md` ในส่วน Strict TDD และ Third-Party Skill Orchestration ให้ระบุถึง Ticket-Driven Implementation Bridge
- [x] รันการตรวจสอบความถูกต้องของ Markdown และรัน pytest/check เพื่อยืนยันว่าไม่มี regression

---

## 🧪 3. Verification Evidence

- `npm run check:static` ➔ **PASSED** (Static framework & Skill contracts validated)
- `npm run typecheck` ➔ **PASSED** (0 TypeScript errors)
- `npm test` ➔ **PASSED** (218/218 unit & integration tests across 16 suites)
- `npm run check` ➔ **PASSED** (Typecheck, framework validation, route evals, installer tests, smoke test)
- `npm run sync:adapters` ➔ **PASSED** (40 skills synced between `.agents` and `.claude`)
