# Discovery: Search & Restore sync-upstream and release-git-operations (packet-release) Skills

- **Discovery ID**: `DISC-20260821-001`
- **Date**: 2026-08-21
- **Status**: Completed
- **Decision**: `Reject` (ผู้ใช้งานตัดสินใจไม่กู้คืนทั้ง `sync-upstream` และ `release-git-operations`)

---

## 1. Context & Problem Statement

ผู้ใช้งานต้องการค้นหาประวัติ Commit และฟื้นฟู (Restore) 2 Skill/Script สำคัญสำหรับใช้พัฒนา Nexus-DevFlow:
1. `sync-upstream`: สำหรับตรวจสอบและนำเข้าฟีเจอร์ใหม่จาก upstream `ai-blueprint`
2. `packet-release` / `release-git-operations`: สำหรับจัดทำ Release package, Git operations และการสกัด Release Digest

---

## 2. Empirical Git Search Findings

### A. Skill `sync-upstream`

- **Commit ที่ลบ Skill ออก**: [`dc39547`](file:///d:/devtools/nexus-devflow) (`feat(skills): prune unused skills down to 28 core and consolidate capabilities`)
  - ไฟล์เดิมที่ถูกลบ: `.agents/skills/sync-upstream/SKILL.md` และ `.claude/skills/sync-upstream/SKILL.md`
- **Commit ที่ย้าย/ปรับแต่ง Script**: [`efd8205`](file:///d:/devtools/nexus-devflow) (`fix(ci): relocate inspect-upstream.ts to scripts/ and update workflow contract`)
  - ตำแหน่งไฟล์ Script ในปัจจุบัน: [`scripts/inspect-upstream.ts`](file:///d:/devtools/nexus-devflow/scripts/inspect-upstream.ts) (ไฟล์นี้ยังมีอยู่ใน codebase ปัจจุบัน)

#### วิธีการกู้คืน `sync-upstream`:
```bash
git checkout dc39547^ -- .agents/skills/sync-upstream .claude/skills/sync-upstream
```

---

### B. Skill `packet-release` (`release-git-operations`)

- **Commit ที่ลบ Skill ออก**: [`77c9098`](file:///d:/devtools/nexus-devflow) (`feat: release v2.0.15 with dual-track architecture, separate feature/fix skills, 40-execute rename...`)
- **Commit ล่าสุดที่มี Skill สมบูรณ์**: [`bae39ea`](file:///d:/devtools/nexus-devflow) (`feat: release v2.0.9 with companion skills...`)
  - ไฟล์เดิมที่ถูกลบ: `.agents/skills/release-git-operations/SKILL.md` และ `.claude/skills/release-git-operations/SKILL.md`
- **สถานะใน DevFlow 2.0 ปัจจุบัน**:
  - DevFlow 2.0 ได้รวมความสามารถ Release Package และ Git Operations เข้าไปอยู่ใน [`70-release`](file:///d:/devtools/nexus-devflow/.agents/skills/70-release/SKILL.md) และ [`complete`](file:///d:/devtools/nexus-devflow/.agents/skills/complete/SKILL.md)

#### วิธีการกู้คืน `release-git-operations`:
```bash
git checkout bae39ea -- .agents/skills/release-git-operations .claude/skills/release-git-operations
```

---

## 3. Options Tradeoff Analysis

| Option | Pros | Cons | Recommendation |
| :--- | :--- | :--- | :--- |
| **Option A: Restore เฉพาะ `sync-upstream`** | ได้ Script & Workflow การดึง upstream กลับมาโดยตรง มี `scripts/inspect-upstream.ts` รองรับอยู่แล้ว | ต้องปรับแต่ง SKILL.md ให้รองรับโครงสร้าง 28-core skills ปัจจุบัน | **แนะนำอย่างยิ่ง** |
| **Option B: Restore ทั้ง `sync-upstream` และ `release-git-operations`** | ได้ครบทั้ง 2 Skills ตามที่ขอใน Commit เก่า | `release-git-operations` อาจจะซ้ำซ้อนกับ `70-release` และ `/complete` ใน DevFlow 2.0 | ขึ้นอยู่กับว่าต้องการแยก standalone skill หรือไม่ |

---

## 4. Decision & Next Steps

- **Decision**: `Proceed`
- **Next Step**: หากต้องการสร้างเป็น Delivery Run สามารถใช้ `/10-define DISC-20260821-001` หรือสามารถสั่งกู้คืนไฟล์ได้ทันทีด้วย Git Checkout commands ด้านบน
