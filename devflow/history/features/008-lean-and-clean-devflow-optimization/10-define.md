# Phase 10: Define Contract

- **Running ID**: `RUN-008-lean-and-clean-devflow-optimization`
- **Title**: ปรับปรุงโครงสร้าง Nexus-DevFlow ให้ Lean & Clean ยุบรวม Skills บริหารจัดการ History และเพิ่มความปลอดภัยในการ Rollback
- **Source Discovery**: [DISC-20260818-004-analyze-blueprint-skills-for-devflow](../../discoveries/DISC-20260818-004-analyze-blueprint-skills-for-devflow/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Architecture Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จากการประเมินโครงสร้างและการใช้งานระยะยาวของ `nexus-devflow` เพื่อให้เป็น Framework ที่พร้อมสำหรับการใช้งานระดับ Production & Enterprise ที่สมบูรณ์แบบ ทั้งในด้านความเร็ว ความสะอาด ความคุ้มค่าของ AI Context Window และความปลอดภัยสูงสุด

เป้าหมายหลักของ **RUN-008** คือ:
1. **กำจัดส่วนเกินที่ไม่จำเป็น (Bloat Removal)**:
   - นำเครื่องมือ **Graphify** ออกทั้งหมด (ลบ script และคำสั่งใน `package.json`)
   - นำโฟลเดอร์ **Wiki** และ Skill `wiki` ออก เพื่อลดความซ้ำซ้อนกับ `devflow/context/`
2. **ยุบรวม Skills ที่ซ้ำซ้อน (Skill Consolidation & Deduplication)**:
   - ผสานรวมคำสั่งและทักษะที่กระจัดกระจาย (จาก 104 รายการ เหลือชุดหลัก ~25-30 รายการ) โดย **รักษาเนื้อหา วินัย และความสามารถเดิมไว้ครบถ้วน 100%**
3. **ระบบจัดการประวัติระยะยาว (Structured Long-Term History & Archiving)**:
   - ออกแบบระบบแยก `Active Runs` ออกจาก `Archived Runs`
   - สร้างไฟล์สรุปประวัติรวม `devflow/history/HISTORY.md` พร้อมสคริปต์ Archive อัตโนมัติ
4. **กลไก Rollback ที่ปลอดภัยและสมบูรณ์ (Safe & Atomic Rollback)**:
   - ผูก Git Commit Hash / Tag เข้ากับ Stage Artifacts ของ `70-release`
   - พัฒนากลยุทธ์การตรวจสอบ Dependency Impact ก่อน Rollback พร้อมแผน Re-verification
5. **จัดระเบียบโฟลเดอร์ Scripts และ Tests**:
   - ย้ายไฟล์ `scripts/test-*.mjs` ไปอยู่ในโฟลเดอร์ `tests/` หรือหมวดหมู่เฉพาะ เพื่อให้ `scripts/` สะอาดตา
6. **เพิ่มแนวทาง Fast-Track / Quick-Fix**:
   - กำหนดเกณฑ์สำหรับงาน Hotfix หรืองานขนาดเล็ก เพื่อลด Overhead ของ 8 Stages
7. **รักษา Adapter Parity 100%**:
   - ซิงค์การเปลี่ยนแปลงทั้งหมดระหว่าง `.agents/` และ `.claude/` ให้ตรงกันสมบูรณ์

---

## 2. ขอบเขตงาน (In-Scope)

### Phase 1: การกำจัดส่วนเกิน (Clean-up & Bloat Removal)
- ลบ `scripts/graphify.mjs` และ package scripts ที่เกี่ยวกับ Graphify
- ลบโฟลเดอร์ `devflow/wiki/` (หากมี) และลบ/ยุบรวม Skill `wiki`
- ตรวจสอบและอัปเดตเอกสารที่อ้างอิงถึง Graphify และ Wiki

### Phase 2: การยุบรวม Skills (Skill Consolidation)
- **Testing**: รวม `test-driven-development` + `test-execution-and-coverage` เข้ากับ `test`
- **Review**: รวม `code-review-and-quality` + `pr-review-analysis` + `pr-review` + `9arm-skills` เข้ากับ `review`
- **Debug**: รวม `debugging-and-error-recovery` + `diagnosing-bugs` เข้ากับ `debug`
- **Simplify**: รวม `code-simplification` เข้ากับ `simplify`
- **Security**: รวม `security-and-hardening` + `vulnerability-scanner` เข้ากับ `security-review`
- **Deploy**: รวม `deployment-procedures` + `shipping-and-launch` เข้ากับ `deploy`
- **Preview**: รวม `preview-local-check` เข้ากับ `preview`
- **Insight**: รวม `insight-capture` เข้ากับ `insight`
- **Ideation & Spec**: รวม `idea-refine` เข้ากับ `brainstorm` / `prd`

### Phase 3: การปรับปรุงประวัติ (History) และระบบ Rollback
- สร้างโครงสร้าง `devflow/history/` และไฟล์แม่แบบ `HISTORY.md`
- อัปเดต `70-release/SKILL.md` ให้บันทึก Release Record ลงใน History Ledger
- อัปเดต `rollback/SKILL.md` ให้ตรวจสอบ Git Checkpoint, Dependency Tree, และสร้าง Rollback Verification Plan

### Phase 4: จัดระเบียบ Scripts & Tests
- จัดหมวดหมู่ไฟล์ `test-*.mjs` ใน `scripts/` ให้เป็นระเบียบ
- ปรับปรุง `package.json` scripts ให้สอดคล้องกัน

### Phase 5: การตรวจสอบและยืนยันคุณภาพ (Verification & Sync)
- รัน `npm run sync:adapters` เพื่อกระจายการเปลี่ยนแปลงไปยัง `.claude/skills/`
- รันชุดตรวจสอบความถูกต้อง (`npm run check`, `npm run check:static`, `npm test`, `npm run test:package`)

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่ตัดทอนความรู้ หลักการ หรือ Checklist ที่สำคัญของแต่ละ Skill ออก (ใช้วิธีผสานรวมเนื้อหา)
- ไม่เปลี่ยนลำดับ Linear Mainline Stages `00` ถึง `70`
- ไม่กระทบต่อ Runs เก่า (`RUN-001` ถึง `RUN-007`) ที่ปิดงานไปแล้ว

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-008`** | `lean-and-clean-devflow-optimization` | ปรับปรุง DevFlow ให้ Lean & Clean: ลบ Graphify/Wiki, ยุบรวม Skills ซ้ำซ้อน, จัดระเบียบ History & Rollback, และจัดระเบียบ Scripts |

---

## 5. เกณฑ์การยอมรับ (Acceptance Criteria)

1. ไม่มีไฟล์หรือคำสั่ง Graphify และ Wiki หลงเหลืออยู่ในระบบ
2. จำนวน Skills ลดลงอย่างมีนัยสำคัญ (~25-30 รายการ) โดยทักษะและความสามารถเดิมถูกรวบรวมไว้อย่างครบถ้วน 100%
3. มีระบบ `devflow/history/HISTORY.md` และกลไก Safe Rollback ที่ผูกกับ Git commit ชัดเจน
4. โฟลเดอร์ `scripts/` สะอาดและเป็นระเบียบ
5. `.agents/` และ `.claude/` ซิงค์ตรงกัน 100%
6. ผ่านการทดสอบ (`npm run check`, `npm run check:static`, `npm test`, `npm run test:package`) ทั้งหมด 100%

---

## 6. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
20-spec RUN-008-lean-and-clean-devflow-optimization
```
