# Phase 10: Define Contract

- **Running ID**: `023-prune-unused-skills-and-consolidate`
- **Title**: ยกระดับและลดรูปโครงสร้าง Skills ของ Nexus-DevFlow ให้ Lean & Clean: ผนวกรวม Best Practices จาก Skill ย่อยเข้าสู่ Core Workflows และลบ Skill ส่วนเกิน (<50% และ <25%) ออกทั้งหมด
- **Source Discovery**: [DISC-20260821-018-prune-unused-skills-and-bloat](../../discoveries/DISC-20260821-018-prune-unused-skills-and-bloat/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-21
- **Owner**: DevFlow Core Engineering Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จากการสำรวจใน Phase 00 (Discovery) พบว่าระบบ Nexus-DevFlow มีการสะสม Skill มากถึง **81 Skills** ซึ่งมากกว่า AI Blueprint (21 Skills) เกือบ 4 เท่า ทำให้เกิดปัญหา:
1. **Token Bloat**: รายชื่อและ Description ของทั้ง 81 Skills ถูกโหลดเข้า System Prompt เปลือง Context และเพิ่ม Latency โดยไม่จำเป็น
2. **Router Fragmentation**: AI เกิดความสับสนในการเลือกคำสั่ง เนื่องจากมี Skill ครอบทับซ้อน (Aliases) เช่น `spec`, `spec-driven-development`, `goal`, `help`, `app-builder`
3. **Cheat Sheet Overload**: มีคู่มือภาษาและเฟรมเวิร์กทั่วไป (เช่น `bash-linux`, `powershell-windows`, `python-patterns`, `nodejs-best-practices`, `tailwind-patterns`, `seo-fundamentals`) ซึ่ง AI ยุคปัจจุบันมีความรู้อยู่แล้ว หรือสามารถใช้ Tool ภายนอก/Linter ตรวจสอบได้ดีกว่า

### เป้าหมายหลัก (Objectives):
- ทำการ **ดูดซับ (Consolidate)** เทคนิคและ Best Practices สำคัญจาก Skill กลุ่ม `< 50%` เข้าสู่ Core Workflows และ `devflow/context/coding-standards.md`
- **ลบ Skill ส่วนเกิน (~53-56 Skills)** ที่มีโอกาสใช้งานต่ำ (< 50% และ < 25%) ออกจากทั้ง `.agents/skills/` และ `.claude/skills/`
- ปรับโครงสร้างให้คงเหลือ **~25-28 Skills** ที่คมชัด แม่นยำ และมีประสิทธิภาพเทียบเท่าหรือเหนือกว่า AI Blueprint

---

## 2. ขอบเขตงานที่ต้องดำเนินการ (In-Scope)

### ส่วนที่ 1: การดูดซับ Best Practices เข้าสู่ Core Workflows (Consolidation)
1. **ผสาน Git, Versioning & Release Best Practices**:
   - ดึงมาตรฐาน Conventional Commits (`feat`, `fix`, `refactor`, etc.) และ Imperative mood จาก `commit`
   - ดึงกฎ SemVer Calculation และ Keep a Changelog Template จาก `changelog`
   - ดึง Pull Request Summary Structure และ Evidence Links จาก `pr`
   - ดึง Squash Merge และ Branch Cleanup Workflow จาก `merge`
   - ดึง Pre-flight & Smoke Checklist จาก `deploy`
   - ➔ **รวมเข้าใน**: `complete/SKILL.md`, `70-release/SKILL.md` และ `devflow/context/coding-standards.md`
2. **ผสาน Discovery & Ideation Lens**:
   - ดึง Trade-off Comparison Matrix จาก `brainstorm`
   - ดึง Empirical Codebase/Web Research Method จาก `research`
   - ดึง User Story Mapping & Scope Boundaries จาก `prd`
   - ➔ **รวมเข้าเป็น Sub-routes ภายใน**: `00-discover/SKILL.md`
3. **ผสาน Senior QA, Scrutinize & Security Review**:
   - ดึง 9arm Scrutinize Review (Boundary checks, Null/Undefined edge cases) จาก `review`
   - ดึง Security Checklist (OWASP Top 10, Secrets in code, Input sanitization) จาก `security-review`
   - ดึง Multi-lane Static Analysis Verification จาก `lint-and-validate`
   - ดึง Refactoring Rules (Early returns, Deep modules) จาก `simplify`
   - ➔ **รวมเข้าเป็น QA Matrix ใน**: `check/SKILL.md` และ `50-verify/SKILL.md`
4. **ผสาน Engineering Design Standards**:
   - ดึงกฎความปลอดภัย Database Migration (`database-design`), API Stability (`api-and-interface-design`), TypeScript Strict Typing (`type-design`), และ Deep Modules (`codebase-design`)
   - ➔ **บันทึกไว้ใน**: `devflow/context/coding-standards.md`

### ส่วนที่ 2: การลบโฟลเดอร์ Skill ส่วนเกิน (Pruning / Deletion)
1. ลบโฟลเดอร์ Skill กลุ่ม `< 25%` และกลุ่มที่ถูก Consolidate แล้ว ออกจาก `.agents/skills/` และ `.claude/skills/` รวมประมาณ 53-56 โฟลเดอร์:
   - *Language & Theory Dumps*: `bash-linux`, `powershell-windows`, `python-patterns`, `nodejs-best-practices`, `tailwind-patterns`, `nextjs-react-expert`, `frontend-ui-engineering`, `seo-fundamentals`, `mobile-design`, `server-management`, `domain-modeling`, `i18n-localization`, `ui-ux-pro-max`, `architecture`
   - *Aliases & Redundant Wrappers*: `spec`, `spec-driven-development`, `goal`, `help`, `app-builder`, `agent`, `behavioral-modes`, `parallel-agents`, `context-engineering`, `skill-development`
   - *Micro-Commands & Absorbed Skills*: `commit`, `pr`, `merge`, `changelog`, `deploy`, `package-json-generator`, `preview`, `followup`, `insight`, `issue-triage`, `competitor-analysis`, `documentation-and-adrs`, `mcp-builder`, `handoff`, `roadmap-strategy`, `review`, `security-review`, `lint-and-validate`, `simplify`, `database-design`, `api-and-interface-design`, `codebase-design`, `type-design`, `brainstorm`, `research`, `prd`
2. ย้ายหรือปรับปรุง Maintainer Skills (`sync-upstream`, `package-release`) ให้ชัดเจน

### ส่วนที่ 3: อัปเดต Manifest, เอกสาร และระบบตรวจสอบ (Manifest & Alignment)
1. อัปเดต `agent-bundle.manifest.json` ให้ตรงกับรายการ Skill ที่เหลืออยู่
2. อัปเดต `AGENTS.md` และ `CLAUDE.md` ให้มีรายชื่อ Skill ที่กระชับและเป็นทางการ
3. อัปเดต `packages/create-nexus-devflow` template files ให้สร้างเฉพาะชุด Skill ใหม่ที่ผ่านการ Clean แล้ว
4. ซิงก์โฟลเดอร์ `.agents/skills/` ➔ `.claude/skills/` ให้ตรงกัน 100% ด้วย `npm run sync:adapters`
5. รัน Verification Matrix (`npm run check`, `npm test`) เพื่อรับรองว่าระบบและ Unit Tests ผ่าน 100%

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่ตัดทอน Core Fast-Track Workflow (`feature`, `fix`, `implement`, `check`, `complete`)
- ไม่ตัดทอน Core Deep-Track Workflow (`00-discover` ถึง `70-release`)
- ไม่ตัดฟีเจอร์เด่นของ DevFlow (เช่น `devflow/ideas.md` AI Scoring, `report-html` Dashboard, `doctor`, `overview`, `try`, `rollback`, `ci`, `test`, `autopilot`, `prototype`)

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`023`** | `prune-unused-skills-and-consolidate` | ผนวกรวม Best Practices เข้า Core Workflows, ปรับลด Skill จาก 81 เหลือ ~25-28 Skills, อัปเดต Manifests/Adapters, และผ่านชุดทดสอบ 100% |

---

## 5. เกณฑ์ความสำเร็จและการตรวจรับ (Acceptance Criteria)

- [ ] **AC-1**: Core Skills (`00-discover`, `check`, `50-verify`, `complete`, `70-release`) ได้รับการผสาน Checklist ที่สำคัญ (Conventional Commits, Keep a Changelog, Scrutinize Review, Security Check, Research/Brainstorm Routes) ครบถ้วน
- [ ] **AC-2**: `devflow/context/coding-standards.md` มีมาตรฐานการออกแบบ API, Database, TypeScript Strict Typing ครบถ้วน
- [ ] **AC-3**: โฟลเดอร์ `.agents/skills/` และ `.claude/skills/` มีจำนวน Skill เหลืออยู่ประมาณ 25-28 Skills ที่สะอาดและไม่มี Broken Links
- [ ] **AC-4**: `agent-bundle.manifest.json`, `AGENTS.md` และ `packages/create-nexus-devflow` ได้รับการอัปเดตให้สอดคล้องกัน 100%
- [ ] **AC-5**: รัน `npm run check` และ `npm test` ผ่านสมบูรณ์ (0 error, tests pass 100%)

---

## 6. คำสั่งถัดไปที่อนุญาต (Next Allowed Command)

- สเตจถัดไป: `20-spec 023-prune-unused-skills-and-consolidate` (หรือ `/20-spec 023`)
