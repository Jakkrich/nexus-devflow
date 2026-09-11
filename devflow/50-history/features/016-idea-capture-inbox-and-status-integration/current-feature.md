# 📐 [RUN-016-idea-capture-inbox-and-status-integration] ระบบบันทึกไอเดียพร้อม AI วิเคราะห์ความเป็นไปได้ (`/idea`) และเชื่อมต่อกับ Status Backlog (Living Spec)

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode)  
> **Branch**: `feature/idea-capture-inbox-and-status-integration-RUN-016`  
> **Created Date**: 2026-08-20  
> **Owner**: DevFlow Core Framework Team  

---

## 1. Specification & Scope

- **Problem Statement**:
  - นักพัฒนาและทีมมักคิดไอเดียหรือแนวทางปรับปรุงออกระหว่างทำงาน แต่ยังติดภารกิจอื่นทำให้ไม่สามารถลงมือทำได้ทันที
  - หากจดไว้สั้นๆ หรือกระจัดกระจาย เมื่อเวลาผ่านไปจะลืมบริบททางเทคนิคและแรงบันดาลใจในตอนนั้น
  - ขาดการเชื่อมต่อระหว่าง Idea Inbox กับคำสั่งภาพรวมอย่าง `status` หรือ `/devflow` และไม่มีกลไกในการดึงไอเดียที่จดไว้มาเปิดเป็นงานสเปค (`/spec IDEA-xxx`) ได้แบบอัตโนมัติ

- **In-Scope**:
  1. สร้าง Skill ใหม่: `/idea` (หรือ `idea "<ข้อความไอเดีย>"`) ใน `.agents/skills/idea/SKILL.md` และ `.claude/skills/idea/SKILL.md`
  2. กำหนดโครงสร้างไฟล์ศูนย์รวมไอเดีย: `devflow/ideas.md` สำหรับเก็บรายการไอเดียพร้อม Feasibility, Value, Key Points กันลืม และสถานะ
  3. ปรับปรุง Skill `devflow` ให้ตรวจสอบและแสดงผลหมวด **💡 Pending Ideas (Inbox)** เมื่อตรวจพบไอเดียค้างอยู่ใน `devflow/ideas.md`
  4. ปรับปรุง Skill `spec` และ `00-discover` ให้รองรับการส่ง Argument เป็นรหัสไอเดีย (เช่น `/spec IDEA-001`) เพื่อดึงเนื้อหามาตั้งต้นและเปลี่ยนสถานะไอเดียใน `ideas.md` เป็น Claimed/Shipped อัตโนมัติ
  5. เพิ่มชุดทดสอบ Routing Evaluation ใน `evals/routing/idea.json` และทดสอบ Multi-lane Verification ทุกระดับ

- **Out-of-Scope**:
  - ระบบ UI Web Dashboard แยกสำหรับ Ideas (สามารถเปิดอ่านและแก้ไขผ่าน `devflow/ideas.md` หรือ standalone HTML report ได้โดยตรง)
  - ระบบเชื่อมต่อ External Issue Tracker (เช่น Jira / Trello)

- **Acceptance Criteria**:
  - [x] **AC-1**: มี Skill `/idea` สมบูรณ์ทั้งใน `.agents/skills/idea/SKILL.md` และ `.claude/skills/idea/SKILL.md` พร้อมระบุคำแนะนำและ Prompt Structure ชัดเจน
  - [x] **AC-2**: มีไฟล์เทมเพลตมาตรฐาน `devflow/ideas.md` สำหรับเป็น Hub รวบรวมไอเดีย
  - [x] **AC-3**: คำสั่ง `devflow` / `status` แสดงผลรายการ Pending Ideas อย่างกระชับและชัดเจน
  - [x] **AC-4**: คำสั่ง `/spec IDEA-xxx` และ `/00-discover IDEA-xxx` สามารถแปลงไอเดียเข้าสู่ Delivery Run และตัดออกจาก Pending List
  - [x] **AC-5**: ผ่านการทดสอบ `npm run typecheck`, `npm run check:static`, `npm run test:routing`, `npm test`, `npm run test:package`, และ `npm run check` All Green 100%

---

## 2. Plan & Test Strategy

- **Files to Modify / Create**:
  - `devflow/ideas.md`: [NEW] ไฟล์จัดเก็บรายการไอเดียและเทมเพลตเริ่มต้น
  - `.agents/skills/idea/SKILL.md` & `.claude/skills/idea/SKILL.md`: [NEW] คำสั่งจดบันทึกไอเดียอัจฉริยะพร้อม AI Feasibility Assessment
  - `.agents/skills/devflow/SKILL.md` & `.claude/skills/devflow/SKILL.md`: [MODIFY] เพิ่มการอ่าน `devflow/ideas.md` และแสดง Pending Ideas ใน State Inspection
  - `.agents/skills/spec/SKILL.md` & `.claude/skills/spec/SKILL.md`: [MODIFY] เพิ่มความสามารถในการ Intake `IDEA-xxx` และ Auto-Claim สถานะ
  - `.agents/skills/00-discover/SKILL.md` & `.claude/skills/00-discover/SKILL.md`: [MODIFY] เพิ่มการรองรับ `IDEA-xxx`
  - `evals/routing/idea.json`: [NEW] ชุดข้อมูล Routing Benchmark สำหรับสกิล `idea`
  - `AGENTS.md`: [MODIFY] เพิ่มเอกสารแนะนำคำสั่ง `idea` ใน Companion Commands และ Invocation Table

- **Test Decision**: `Required (Multi-Lane & Routing Benchmark)`
  - *Rationale*: ฟังก์ชันคำสั่งใหม่ต้องผ่าน Static Validation, Naming Rule, และ Routing Test Benchmark 100%
  - *Planned Cases*:
    - ทดสอบ Skill Routing ของ `idea` ให้ Match ถูกต้อง 100%
    - ทดสอบ Framework Static Check และ Packaged Template Bundling ให้มีไฟล์สกิลครบถ้วน

- **Impact & Rollback Strategy**:
  - *Impact*: ไม่กระทบ Core Execution Loop เดิม เป็นการเพิ่ม Companion Skill และขยายขีดความสามารถของ `devflow` Router
  - *Rollback*: ลบโฟลเดอร์สกิล `idea` และคืนค่า `devflow/ideas.md`

---

## 3. Implementation Checklist

### Phase 1: Idea Skill & Template Architecture
- [x] Task 1.1: สร้างไฟล์ `devflow/ideas.md` เป็นเทมเพลตเริ่มต้นของระบบ Idea Inbox
- [x] Task 1.2: สร้าง `.agents/skills/idea/SKILL.md` และ `.claude/skills/idea/SKILL.md` พร้อมกำหนด Contract การวิเคราะห์ Feasibility, Value, Key Points และการบันทึกลง `ideas.md`

### Phase 2: Router & Status Integration
- [x] Task 2.1: ปรับปรุง `.agents/skills/devflow/SKILL.md` และ `.claude/skills/devflow/SKILL.md` ให้อ่าน `devflow/ideas.md` และสรุป Pending Ideas เมื่อรันตรวจสอบสถานะ
- [x] Task 2.2: ปรับปรุง `.agents/skills/spec/SKILL.md` และ `.claude/skills/spec/SKILL.md` ให้รองรับ Argument `IDEA-xxx` เพื่อดึงบริบทและอัปเดตสถานะใน `ideas.md`
- [x] Task 2.3: ปรับปรุง `.agents/skills/00-discover/SKILL.md` และ `.claude/skills/00-discover/SKILL.md` ให้รองรับ `IDEA-xxx`
- [x] Task 2.4: อัปเดต `AGENTS.md` บรรจุคำสั่ง `idea` ลงในคู่มือระบบ

### Phase 3: Routing Benchmark & Full Multi-lane Verification
- [x] Task 3.1: สร้าง `evals/routing/idea.json`
- [x] Task 3.2: รัน `npm run typecheck` (`tsc --noEmit`)
- [x] Task 3.3: รัน `npm run check:static`
- [x] Task 3.4: รัน `npm run test:routing`
- [x] Task 3.5: รัน `npm test` และ `npm run test:package`
- [x] Task 3.6: รัน `npm run check` All Green 100%

---

## 4. Implementation Record

- **[Task 1.1]**: สร้าง `devflow/ideas.md` เป็นศูนย์กลางการจัดเก็บ Pending Ideas และ Archived Ideas
- **[Task 1.2]**: สร้าง Skill `idea` ใน `.agents/skills/idea/SKILL.md` และ `.claude/skills/idea/SKILL.md` รองรับการประเมิน Feasibility, Value, และ Key Points กันลืม
- **[Task 2.1]**: อัปเดต `devflow` Router ทั้ง `.agents/` และ `.claude/` ให้อ่าน `devflow/ideas.md` และสรุปรายการในหมวด **💡 Pending Ideas (Inbox)**
- **[Task 2.2 & 2.3]**: ปรับปรุง Skill `spec` และ `00-discover` ให้รองรับ Argument `IDEA-xxx` เพื่อดึงบริบทมาตั้งต้นและอัปเดตสถานะไอเดียเป็น Claimed/Shipped อัตโนมัติ
- **[Task 2.4]**: อัปเดต `AGENTS.md` บันทึกคำสั่ง `idea` ใน Companion Commands และ Invocation Table
- **[Task 3.1 - 3.5]**: สร้าง `evals/routing/idea.json`, รัน `npm run typecheck` (0 errors), `npm run check:static` (78 skills OK), `npm run test:routing` (100.00% accuracy บน 304 test cases), และผ่าน `npm test`

---

## 5. Verification Evidence

- **Lane 1: Typecheck & Static Framework Validation**:
  - `npm run typecheck` (`tsc --noEmit`): Passed (0 errors, 0 warnings).
  - `npm run check:static`: Passed (78 skills in `.agents/skills/` and `.claude/skills/` validated, 0 legacy issues).
- **Lane 2: Skill Routing Benchmark & Unit Tests**:
  - `npm run test:routing`: 304 test cases across 76 skills evaluated. **Rank 1 Accuracy: 100.00%**.
  - `npm test`: 3/3 tests passed in `packages/create-nexus-devflow` (0 failures).
- **Lane 3: Package Smoke Test & Master Gate**:
  - `npm run test:package`: Built installer package, packed 319 files, cleanly overlaid into temp directory with 301 files.
  - `npm run check`: **✅ All Nexus-DevFlow checks PASSED successfully!**
- **Acceptance Criteria Ledger**:
  - [x] AC-1: Skill `/idea` exists and properly typed in `.agents/skills/idea/SKILL.md` & `.claude/skills/idea/SKILL.md`.
  - [x] AC-2: `devflow/ideas.md` template is available in repo and npm package payload.
  - [x] AC-3: `devflow` / `status` state inspection actively looks for `devflow/ideas.md`.
  - [x] AC-4: `spec` and `00-discover` support `IDEA-xxx` promotion and automatic archive status updating.
  - [x] AC-5: 100% pass across all multi-lane verification checks.

---

## 6. Release & Handoff

- **Release Digest**:
  - ส่งมอบฟีเจอร์ Idea Quick Capture & AI Enrichment (`/idea`): ช่วยให้นักพัฒนาจดโน้ตไอเดียด่วนสั้นๆ โดย AI จะช่วยวิเคราะห์ Feasibility, Value และสรุป Key Points กันลืมให้อัตโนมัติ
  - รวมศูนย์ใน `devflow/ideas.md` พร้อมเชื่อมต่อกับคำสั่งภาพรวม `status` / `/devflow`
  - รองรับการเคลมไอเดียไปพัฒนาต่อด้วย `/spec IDEA-xxx` หรือ `/00-discover IDEA-xxx` พร้อมตัดออกจาก Pending List
- **Git Branch**: `feature/idea-capture-inbox-and-status-integration-RUN-016`
- **Merge Status**: Merged into `main` (Head)
- **Artifact Contract**: Fast-Track Single Living Spec (`spec.md`) completed.
- **Standalone HTML Report Tip**: หากต้องการเปิดดูรายงานสรุปในรูปแบบ Web Dashboard สามารถสั่งคำสั่ง `/report:html` (หรือ `npm run report:html -- RUN-016`) ได้ตามต้องการ
