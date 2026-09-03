# Socratic Clarification Checklist (REQ-20260903-001)

> **Requirement ID**: `REQ-20260903-001-sync-upstream-ai-blueprint`  
> **Audience**: System Analyst, Tech Lead, Framework Maintainer  
> **Status**: `Ready for Review`  

---

## 🔍 Socratic Review & Alignment Questions

### 1. Root Scaffold Commit Convention
- [x] **Question**: รูปแบบ Commit Message สำหรับ Scaffold แรกใน Unborn Repo ควรใช้รูปแบบใด?
  - **Proposed Decision**: `chore: scaffold application` (มาตรฐานเดียวกับ Upstream AI Blueprint และ Conventional Commits)
  - **Safety Check**: ต้องไม่รวมโฟลเดอร์ `devflow/`, `AGENTS.md`, `CLAUDE.md`, `.agents/`, `.claude/` เข้าไปใน Root Commit นี้เด็ดขาด

### 2. Setup-Branch Fast-Forward Merge Rule
- [x] **Question**: ใน `/overview` หากผู้ใช้วางแผนบน dedicated branch (เช่น `feature/devflow-plans`) การรวมกลับเข้า `main` ต้องทำอย่างไร?
  - **Proposed Decision**: บังคับใช้ `git merge --ff-only` เท่านั้นเพื่อรักษา Linear Git History หากมีการแตก branch ออกไปแบบ non-fast-forward จะต้องหยุดและรายงาน mismatch ทันที
  - **Safety Check**: ยืนยันการลบ local setup branch หลัง merge สำเร็จ เพื่อไม่ให้มี branch ขยะค้าง

### 3. Local-Only & Remote Push Guard
- [x] **Question**: การทำ Finalize Baseline มีโอกาสหลุดรัน `git push` หรือไม่?
  - **Proposed Decision**: ล็อกกฎชัดเจนใน `SKILL.md` ว่าทุกคำสั่งใน Onboard และ Overview ทำงานในระดับ Local Git เท่านั้น (No Push)

---

## 📋 Actionable Checklist for Implementation

- [ ] ปรับปรุง `.agents/skills/onboard/SKILL.md` และ `.claude/skills/onboard/SKILL.md` เพื่อตรวจจับ Unborn `HEAD` และเสนอ Scaffold Root Commit
- [ ] ปรับปรุง `.agents/skills/overview/SKILL.md` และ `.claude/skills/overview/SKILL.md` สำหรับ Setup-Branch Baseline Finalization (`git merge --ff-only`)
- [ ] อัปเดต `devflow/context/ai-interaction.md` ให้ระบุสิทธิการทำ Baseline Finalization บน Setup Branch
- [ ] พอร์ต E2E Scenario `scripts/e2e/scenarios/unborn-onboarding.ts` ให้เข้ากับโครงสร้างและชื่อคำสั่งของ Nexus-DevFlow
- [ ] เพิ่ม static verification contract ใน `scripts/validate-framework.ts`
- [ ] รันการตรวจสอบความถูกต้องของระบบครบทุก Lane (`npm run check:static`, `npm test`, `npm run check`)
