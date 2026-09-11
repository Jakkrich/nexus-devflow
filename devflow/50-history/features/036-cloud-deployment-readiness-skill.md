# 📐 [036-cloud-deployment-readiness-skill] Cloud Deployment Readiness & Config Generator Skill (`/release`) (Archived Spec)

> **Status**: Completed & Archived  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `feature/036-cloud-deployment-readiness-skill`  
> **Completed Date**: 2026-08-22  
> **Git Commit**: `7b94829`  
> **Owner**: AI & Maintainer (Intake from IDEA-010 & DISC-20260822-005)  

---

## 1. Specification & Scope
- **Problem Statement**: เมื่อนักพัฒนาทำงานร่วมกับ AI Coding Agent จนปิดรอบฟีเจอร์ด้วย `/complete` เรียบร้อยแล้ว การนำแอปพลิเคชันขึ้นสู่ Cloud Production (เช่น Render หรือ Vercel) มักต้องอาศัยการตั้งค่า Build script, Start script, Environment variables, และไฟล์คอนฟิกเฉพาะ (`render.yaml`, `vercel.json`) ซึ่งผู้ใช้อาจไม่ทราบการตั้งค่าที่เหมาะสม DevFlow จึงต้องการทักษะ **`/release`** ที่ทำหน้าที่เป็น Dedicated Deployment Readiness & Local Config Generator พร้อมมาตรการความปลอดภัยขั้นสูง (Strict Safety & Human-in-the-loop Gate)
- **In-Scope**:
  - **สร้างทักษะ `/release` ใน AI Tool Adapters**:
    - `.agents/skills/release/SKILL.md` (สำหรับ Antigravity, Codex, Copilot, Cursor)
    - `.claude/skills/release/SKILL.md` (สำหรับ Claude Code)
    - รองรับการเตรียมความพร้อมสำหรับ **Render** (`render.yaml`) และ **Vercel** (`vercel.json`)
    - รองรับ Sub-commands/Scopes:
      - `release` (ตรวจและแนะนำ Provider ตามความเหมาะสม)
      - `release render` (เน้น Render)
      - `release vercel` (เน้น Vercel)
      - `release check` (ตรวจความพร้อมแบบ Read-only)
      - `release config` (สร้าง/อัปเดตเฉพาะไฟล์คอนฟิก)
    - มีระเบียบวิธี 5 ขั้นตอน (5-Step Protocol): Read & Inspect, Choose Provider Shape, Verify Local Readiness, Prepare Local Config, Report Deployment Readiness Packet
    - มี Strict Safety Policy: หยุดรอการยืนยันจากมนุษย์ก่อนยิง API Deploy หรือสร้าง Resource ภายนอก และห้ามเปิดเผย/บันทึก Secret values
  - **ปรับเปลี่ยน Mainline Stage 70 เป็น `70-deliver`**:
    - เพื่อป้องกันความสับสนและแยกความแตกต่างระหว่างการส่งมอบงานเข้าประวัติ (`70-deliver`) และการเตรียม Deploy ขึ้น Cloud (`/release`)
    - อัปเดต `.agents/skills/70-deliver/` และ `.claude/skills/70-deliver/`
    - อัปเดต `scripts/validate-framework.ts`, `.nexus/nexus-devflow.json`, และเอกสารที่เกี่ยวข้อง
  - **อัปเดต Manifest และการตรวจสอบความถูกต้อง**:
    - เพิ่ม `"release"`, `"discovery"`, `"audit"` ลงใน `companionCommands` ของ `.nexus/nexus-devflow.json`
    - ตรวจสอบความถูกต้องด้วย `npm run check:static`, `npm test` และ `npm run test:package`
- **Out-of-Scope**:
  - การสั่ง Deploy ขึ้น Cloud Provider อัตโนมัติโดยไม่ผ่านการอนุมัติ (ผิดหลัก Human-in-the-loop)
  - การบันทึก Secret หรือ API Token ลงใน Git Repository
- **Acceptance Criteria**:
  - [x] AC-1: มีไฟล์สคิล `/release` ที่สมบูรณ์ทั้งใน `.agents/skills/release/SKILL.md` และ `.claude/skills/release/SKILL.md`
  - [x] AC-2: สคิลมีคำแนะนำตรวจจับ Render (`render.yaml`) และ Vercel (`vercel.json`), ตรวจสอบความพร้อม และสร้างรายงาน Deployment Packet พร้อม Safety Gate
  - [x] AC-3: รีเนมสเตจ 70 เป็น `70-deliver` อย่างสมบูรณ์ทั้ง `.agents/`, `.claude/`, `validate-framework.ts`, และ `nexus-devflow.json`
  - [x] AC-4: ผ่านการตรวจสอบ Framework Integrity (`npm run check:static`), Unit Tests 42/42 tests และ Package Smoke Test 100%

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `.agents/skills/release/SKILL.md`: สคิล `/release` สำหรับ Codex/Antigravity/Copilot
  - `.claude/skills/release/SKILL.md`: สคิล `/release` สำหรับ Claude Code
  - `.agents/skills/70-deliver/SKILL.md`: รีเนมจาก `70-release` เป็น `70-deliver`
  - `.claude/skills/70-deliver/SKILL.md`: รีเนมจาก `70-release` เป็น `70-deliver`
  - `.nexus/nexus-devflow.json`: อัปเดต mainlineStages (`70-deliver`) และ companionCommands (`release`)
  - `scripts/validate-framework.ts`: อัปเดต `numberedMainline` ให้รองรับ `70-deliver`
- **Test Decision**: `Required (Static & Packaging Tests)`
  - *Rationale*: สคิล `/release` และการรีเนมสเตจ 70 เป็นการเปลี่ยนแปลงระดับ Core Workflow สถาปัตยกรรม ต้องผ่านการทดสอบ Static Verification และ Template Packaging Smoke Test
- **Impact & Rollback Strategy**:
  - *Impact*: เพิ่มทักษะการเตรียมความพร้อม Cloud Deployment และทำให้ชื่อสเตจ 70 ชัดเจนขึ้น
  - *Rollback*: `git checkout main` หรือสลับกลับด้วย `/rollback`

## 3. Implementation Checklist
- [x] Task 1: สร้าง `.agents/skills/release/SKILL.md` และ `.claude/skills/release/SKILL.md`
- [x] Task 2: รีเนมและปรับแต่งสเตจ 70 เป็น `70-deliver` ใน `.agents/skills/70-deliver/` และ `.claude/skills/70-deliver/`
- [x] Task 3: อัปเดต `scripts/validate-framework.ts` และ `.nexus/nexus-devflow.json`
- [x] Task 4: อัปเดต `devflow/ideas.md` ย้าย `[IDEA-010]` เข้าคลัง Archive
- [x] Task 5: ทดสอบความถูกต้องด้วย `npm run check:static`, `npm test` และ `npm run test:package`

## 4. Implementation Record
- **สร้างไฟล์ Cloud Deployment Readiness Skill**:
  - [`.agents/skills/release/SKILL.md`](file:///d:/devtools/nexus-devflow/.agents/skills/release/SKILL.md): สคิลตรวจเช็กความพร้อมและสร้างไฟล์คอนฟิก Render/Vercel สำหรับ Codex/Antigravity/Copilot
  - [`.claude/skills/release/SKILL.md`](file:///d:/devtools/nexus-devflow/.claude/skills/release/SKILL.md): สคิล Deployment Readiness สำหรับ Claude Code
- **โครงสร้างโปรโตคอล 5 ขั้นตอน (5-Step Protocol)**:
  1. Read & Inspect the Project (Stack, Commands, Env variables by name only)
  2. Choose Provider Shape (Render Web/Static/Worker vs Vercel Framework/Serverless)
  3. Verify Local Readiness (Local build, tests, health checks)
  4. Prepare Local Config Files (`render.yaml`, `vercel.json`, `.env.example`)
  5. Report Deployment Readiness Packet (Summary, Smoke tests, Blockers, Next action)
- **รีเนม Mainline Stage 70 เป็น `70-deliver`**:
  - สร้าง `.agents/skills/70-deliver/SKILL.md` และ `.claude/skills/70-deliver/SKILL.md`
  - ลบโฟลเดอร์ legacy `70-release` ออกอย่างหมดจด
  - อัปเดต `AGENTS.md`, `validate-framework.ts`, และ `nexus-devflow.json`

## 5. Verification Evidence

### 🧪 Multi-Lane Verification Matrix

| Lane | การทดสอบ (Verification Lane) | คำสั่ง (Command) | ผลลัพธ์ (Result) | หลักฐาน (Evidence Summary) |
| :--- | :--- | :--- | :--- | :--- |
| **Lane 1** | **Static Contracts & Framework Integrity** | `npm run check:static` | **PASS (0 errors)** | ผ่าน 33 skills validation, manifests และ paths ทั้งหมดสมบูรณ์ |
| **Lane 2** | **Unit Test Suite** | `npm test` (packages/create-nexus-devflow) | **PASS (42/42 tests)** | ผ่านการทดสอบ 100% ครอบคลุมทุก engine และ CLI subcommands |
| **Lane 3** | **Package Smoke & Distribution Test** | `npm run test:package` | **PASS (Clean build & pack)** | Pack tarball สำเร็จ (`144 files`), ติดตั้ง overlay และทดสอบความถูกต้องสำเร็จ |
| **Lane 4** | **Quality Gatekeeper Check** | `nexus-devflow check-gate` | **PASS (Exit code 0)** | ผ่านเงื่อนไข Quality Gatekeeper พร้อมสำหรับการ Commit และ Merge |

## 6. Release & Handoff
- **Summary of Changes**:
  - เพิ่มทักษะ `/release` สำหรับเตรียมความพร้อมและสร้างไฟล์คอนฟิก Cloud Deployment (`render.yaml`, `vercel.json`)
  - รีเนม Deep-Track สเตจ 70 เป็น `70-deliver` อย่างเป็นทางการ
  - อัปเดตสคิล `autopilot` ให้รองรับทั้ง Fast-Track และ Deep-Track อย่างสมบูรณ์
- **Next Actions**:
  - ผู้ใช้สามารถเรียก `/release` ได้ทันทีเพื่อตรวจเช็กความพร้อมในการนำแอปขึ้น Render หรือ Vercel
