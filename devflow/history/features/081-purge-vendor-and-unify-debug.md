# Living Spec: 081-purge-vendor-and-unify-debug

> **Title**: Purge Matt Pocock Vendor, Unify Debug Skill & Support Headless Ticket Ingestion  
> **Status**: Completed  
> **Phase**: Phase 31 / Feature 081  
> **Track**: Fast-Track Single Living Spec  
> **Testing Seam**: `npm run check:static`, `npm test`, `debug/SKILL.md` (both adapters), `AGENTS.md`

---

## 1. Context & User Story

ความต้องการของผู้ใช้:
1. **Clean Vendor**: ลบ `devflow/.vendor/matt-pocock/` ออกจากระบบ เพื่อไม่ให้มีภาระไฟล์ vendor ตกค้างและลดขนาดโปรเจกต์
2. **Clean Skill Lists**:
   - ลบ `matt-pocock` skill wrapper ออกจาก `.agents/skills/matt-pocock/` และ `.claude/skills/matt-pocock/`
   - ลบ `.scratch/` และ `docs/agents/` ที่เป็น artifact ตกค้างจากการ setup เก่า
   - รวมสาระสำคัญของ `debug-mantra` (Mantra 4 ข้อ: Reproducibility, Know fail path, Falsify hypothesis, Every run is a breadcrumb) เข้าเป็นหัวใจของ `/debug` (Phase 0: Mindset & Discipline) ในทั้ง `.agents/skills/debug/SKILL.md` และ `.claude/skills/debug/SKILL.md` แล้วลบโฟลเดอร์ `debug-mantra` ออก
3. **Docs / AGENTS.md**: อัปเดตเอกสารว่า Nexus-DevFlow รองรับการ Import/Ingest external spec & tracer-bullet tickets จากโฟลเดอร์ `devflow/context/{slug}/issues/` หรือ `tickets/` ได้ทันที

---

## 2. Invariants & Acceptance Criteria (Done-When)

- [x] **AC-1: Clean Vendor & Artifact Purge**
  - `devflow/.vendor/matt-pocock/` ถูกลบออกอย่างสมบูรณ์
  - `.scratch/` และ `docs/agents/` ถูกลบออกอย่างสมบูรณ์
- [x] **AC-2: Skill Consolidation & Unified Debug**
  - `.agents/skills/matt-pocock/` และ `.claude/skills/matt-pocock/` ถูกลบออก
  - `.agents/skills/debug-mantra/` และ `.claude/skills/debug-mantra/` ถูกลบออก
  - `.agents/skills/debug/SKILL.md` และ `.claude/skills/debug/SKILL.md` ได้รับการอัปเกรดให้มี Phase 0: Debug Mantra 4 ข้อชัดเจน
- [x] **AC-3: Documentation & External Ingestion Contract**
  - `AGENTS.md` ลบการอ้างอิง `.scratch/` และ `docs/agents/` ออก
  - `AGENTS.md` เพิ่มข้อกำหนด Headless Spec & Tickets Ingestion
  - `KNOWN_SKILL_ALIASES` ใน `skill-registry-engine.ts` และการทดสอบอัปเดตสอดคล้อง
- [x] **AC-4: Verification & Static Contract Integrity**
  - `npm run check:static` ผ่าน 100%
  - `npm test` ผ่าน 100% (183 unit tests + tooling + overview + run-state + sandbox)

---

## 3. Tracer-Bullet Tickets & Implementation Tasks

- [x] **Ticket 01: Clean Vendor & Obsolete Artifacts**
  - ลบ `devflow/.vendor/matt-pocock/`, `.scratch/`, และ `docs/agents/`
- [x] **Ticket 02: Unify Debug Skill & Remove Wrappers**
  - อัปเดต `debug/SKILL.md` ใน `.agents` และ `.claude`
  - ลบ `matt-pocock` และ `debug-mantra` ออกจากทั้งสอง adapters
- [x] **Ticket 03: Registry & Dashboard Alignment**
  - อัปเดต `skill-registry-engine.ts` และ `skill-manager.test.ts`
- [x] **Ticket 04: Documentation & Ingestion Contract**
  - อัปเดต `AGENTS.md` บันทึก Headless Spec & Tracer-Bullet Tickets Ingestion Contract
- [x] **Ticket 05: Verification & Tests**
  - ยืนยัน `npm run check:static` และ `npm test` ผ่าน 100%

---

## ⚡ 4. Implementation Log & Evidence

- **Vendor Purge**: ลบโฟลเดอร์ `devflow/.vendor/matt-pocock/` (ขนาดใหญ่ 37+ ไฟล์/โฟลเดอร์) ออกจากระบบ
- **Artifact Purge**: ลบ `.scratch/` และ `docs/agents/` (`domain.md`, `issue-tracker.md`, `triage-labels.md`)
- **Skill Unification**:
  - ยุบรวมแก่นวินัยของ `debug-mantra` เข้าเป็น **Phase 0: The 4 Debug Mantras (Mindset & Discipline)** ภายใน `.agents/skills/debug/SKILL.md` และ `.claude/skills/debug/SKILL.md`
  - ลบสคิลที่ไม่จำเป็นออก: `.agents/skills/matt-pocock/`, `.claude/skills/matt-pocock/`, `.agents/skills/debug-mantra/`, `.claude/skills/debug-mantra/`
  - ลบ `evals/routing/debug-mantra.json`
- **Headless Ingestion Documentation**:
  - เพิ่มหัวข้อ `## 📥 Headless Spec & Tracer-Bullet Tickets Ingestion` ลงใน `AGENTS.md`
  - อธิบายการหยอด `spec.md` + `issues/<NN>-<slug>.md` หรือ `tickets/<NN>-<slug>.md` พร้อมการคำนวณ `Blocked by:` เพื่อรัน `/implement`, `/check`, `/complete` ต่อได้ทันที
- **Verification**:
  - `npm run check:static`: Passed 100% (38 skills: 32 core + 6 local extensions)
  - `npm test`: Passed 100% (183 tests passed, 0 failures across 8 suites)
