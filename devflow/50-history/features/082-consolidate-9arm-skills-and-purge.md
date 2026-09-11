# Living Spec: 082-consolidate-9arm-skills-and-purge

> **Title**: Consolidate 9arm Skills into DevFlow Core & Purge Extension  
> **Status**: Completed  
> **Phase**: Phase 32 / Feature 082 (`DISC-20260908-001`)  
> **Track**: Fast-Track Single Living Spec  
> **Testing Seam**: `npm run check:static`, `npm test`, `npm run check`, `.agents/skills/{audit,debug,status,complete}/SKILL.md`, `.nexus/nexus-devflow.json`  

---

## 1. Context & User Story

จากผลการทำ Discovery (`DISC-20260908-001`) และความต้องการของผู้ใช้:
1. **Scrutiny Lens Integration (`/audit`)**: นำหลักการ Outsider Review จาก `scrutinize` เข้าสู่ `/audit` โดยเพิ่มกฎ "Step 0: Challenge Intent & Simpler Alternatives" (ถามก่อนว่ามีวิธีที่เรียบง่ายกว่าไหม) และกำหนดให้ Trace Full Call Path ผ่านโค้ดจริงรอบข้างรอยต่อ diff
2. **Canonical Post-Mortem Integration (`/debug` & `/complete`)**: นำโครงสร้าง The 8 Canonical Post-Mortem Blocks บันทึกเป็นมาตรฐานการแก้บั๊กใน `devflow/history/fixes/README.md` และเพิ่ม `Phase 7: Post-Mortem & Fix Handoff` ใน `/debug` ให้พร้อมร่าง post-mortem ทันทีหลังแก้บั๊กผ่าน
3. **Leadership Summary Integration (`/status` & `/complete`)**: นำแนวคิดจาก `management-talk` ในการแปล technical digest ให้เป็นภาษาผู้บริหาร (คง JIRA/PR keys และ business impact แต่ตัด function/file/internal code) ลงใน `/status --exec` และ Release Digest ใน `/complete`
4. **Purge Extension Skills & Clean Manifest**: ถอนการติดตั้งและลบโฟลเดอร์ `post-mortem`, `scrutinize`, `management-talk` ทั้งหมดออกจากทั้ง `.agents/skills/` และ `.claude/skills/` พร้อมนำ entries ทั้งหมดออกจาก `thirdPartySkills` ใน `.nexus/nexus-devflow.json` (รวมถึง `matt-pocock` ที่ purge ไปแล้ว)

---

## 2. Invariants & Acceptance Criteria (Done-When)

- [x] **AC-1: Scrutiny Lens ใน `/audit`**: ทั้ง `.agents/skills/audit/SKILL.md` และ `.claude/skills/audit/SKILL.md` มี Scrutiny Lens (Challenge Intent & Simpler Alternatives, Call-path tracing) และ `independent-review.md` มีการตรวจ full call graph
- [x] **AC-2: Canonical Post-Mortem ใน `/debug` & `/complete`**: `/debug` มี Phase 7 เสนอ draft post-mortem 8 บล็อก และ `/complete` มี guideline บันทึก fix archive ตามมาตรฐาน canonical post-mortem
- [x] **AC-3: Leadership Summary ใน `/status` & `/complete`**: มี guideline แปลง technical digest เป็น stakeholder/executive communication
- [x] **AC-4: Complete Purge & Manifest Cleanup**: ไม่มีโฟลเดอร์ `post-mortem`, `scrutinize`, `management-talk` ใน `.agents/skills/` และ `.claude/skills/` และนำ entries ทั้งหมดของ 9arm-skills (`debug-mantra`, `post-mortem`, `scrutinize`, `management-talk` รวมถึง `matt-pocock` ที่ purge แล้ว) ออกจาก `thirdPartySkills` ใน `.nexus/nexus-devflow.json`
- [x] **AC-5: Framework Integrity Verification**: `npm run check:static`, `npm test`, และ `npm run check` ผ่าน 100%

---

## 3. Tracer-Bullet Tickets & Implementation Tasks

- [x] **Task 1: Integrate Scrutiny Lens into `/audit` & Independent Review**
  - [x] 1.1 เพิ่มหัวข้อ `### Scrutiny Lens: Outsider Review & Simpler Alternatives` ใน `.agents/skills/audit/SKILL.md` และ `.claude/skills/audit/SKILL.md`
  - [x] 1.2 เพิ่มข้อกำหนด Call-Path Tracing และ Verify Claims ใน `audit/reference/independent-review.md` ทั้งสอง adapters
- [x] **Task 2: Integrate Post-Mortem Record into `/debug`, `/complete` & Fixes Archive**
  - [x] 2.1 เพิ่ม `Phase 7: Post-Mortem & Fix Handoff` ใน `.agents/skills/debug/SKILL.md` และ `.claude/skills/debug/SKILL.md`
  - [x] 2.2 อัปเดต `devflow/history/fixes/README.md` และ `/complete` skill ให้บันทึก fix history ตามโครงสร้าง 8 บล็อก
- [x] **Task 3: Integrate Leadership Summary into `/status` & `/complete`**
  - [x] 3.1 เพิ่มหัวข้อ Executive / Stakeholder Summary guideline ใน `/status` และ `/complete`
- [x] **Task 4: Purge 9arm Extension Skills & Cleanup thirdPartySkills in Manifest**
  - [x] 4.1 ลบโฟลเดอร์ `post-mortem`, `scrutinize`, `management-talk` ทั้งใน `.agents/skills/` และ `.claude/skills/`
  - [x] 4.2 นำ entries ของ `debug-mantra`, `post-mortem`, `scrutinize`, `management-talk` (และ `matt-pocock`) ออกจาก array `thirdPartySkills` ใน `.nexus/nexus-devflow.json` อย่างสมบูรณ์
- [x] **Task 5: Multi-Lane Verification & Static Contract Check**
  - [x] 5.1 รัน `npm run check:static` ยืนยันผ่าน 100% (35 skills: 32 core + 3 local extensions)
  - [x] 5.2 รัน `npm test` ยืนยันผ่าน 100% (183 unit tests + tooling + overview + run-state + sandbox)
  - [x] 5.3 รัน `npm run check` ยืนยัน typecheck และ package smoke test ผ่าน 100%

---

## ⚡ 4. Implementation Log & Evidence

- **Scrutiny Lens**: ผสานการตรวจทานเชิงรุก (Intent challenge & Call-path trace) ลงใน `.agents/skills/audit/SKILL.md`, `.claude/skills/audit/SKILL.md`, และ `audit/reference/independent-review.md`
- **Post-Mortem**: ผสาน Phase 7 ลงใน `.agents/skills/debug/SKILL.md`, `.claude/skills/debug/SKILL.md`, อัปเดต `devflow/history/fixes/README.md` และ `complete/SKILL.md` ทั้งสอง adapters
- **Leadership Digest**: เพิ่ม Executive Mode ลงใน `.agents/skills/status/SKILL.md`, `.claude/skills/status/SKILL.md`, และ `complete/SKILL.md`
- **Purge & Manifest Cleanup**:
  - ลบโฟลเดอร์ `.agents/skills/{post-mortem, scrutinize, management-talk}` และ `.claude/skills/{post-mortem, scrutinize, management-talk}`
  - ลบ entries ของ `debug-mantra`, `post-mortem`, `scrutinize`, `management-talk`, `matt-pocock` ออกจาก `thirdPartySkills` ใน `.nexus/nexus-devflow.json`
- **Verification Evidence**:
  - `npm run check:static`: Passed 100% (35 skills: 32 core + 3 local extensions)
  - `npm test`: Passed 100% (183 passed across 8 suites, 0 failed)
  - `npm run check`: Passed 100% (Typecheck clean + Smoke test overlay 120 files)
