# 📐 [022-update-documentation-and-guides-for-v2-0-20] อัปเดตเอกสารคู่มือและ Reference ให้ครอบคลุม DevFlow v2.0.20 (Living Spec)

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `feature/022-update-documentation-and-guides-for-v2-0-20`  
> **Created Date**: 2026-08-21  
> **Release Date**: 2026-08-21  
> **Owner**: DevFlow Core Engineering Team  

---

## 1. Specification & Scope

- **Problem Statement**:
  - เอกสาร `README.md` และ `README.th.md` เดิมยังคงมีการอ้างอิงโฟลเดอร์ `devflow/runs/` และยังขาดการอธิบายโครงสร้าง **The 3-Pillars Architecture** (`ideas.md`, `context/`, `history/`), Dual-Track Delivery, การใช้งาน Living Spec ใน `current-feature.md`, และคู่มือการอัปเกรด (Migration Guide) สำหรับผู้ใช้เดิม
- **In-Scope**:
  - อัปเดต `README.md` (ภาษาอังกฤษ) ให้สะท้อนสถาปัตยกรรม 3-Pillars และ Dual-Track 2.0.20
  - อัปเดต `README.th.md` (ภาษาไทย) ให้ครบถ้วน ชัดเจน พร้อมไดอะแกรมและตัวอย่างคำสั่ง
  - เพิ่มหัวข้อ Migration Guide & Clean Reinstall สำหรับโปรเจกต์ที่ใช้ DevFlow เวอร์ชันเก่า
  - อัปเดต CLI Cheat Sheet (`install`, `status`, `update`, `uninstall --keep-history`, `eject`)
- **Out-of-Scope**:
  - การแก้ไข Core Logic ของ CLI Binary (เสร็จสมบูรณ์แล้วในรอบ 021)
- **Acceptance Criteria**:
  - [x] **AC-1**: `README.md` อธิบาย The 3-Pillars Model (`ideas.md`, `context/`, `history/`) และ Dual-Track ชัดเจน ไม่มีคำว่า `devflow/runs/`
  - [x] **AC-2**: `README.th.md` มีเนื้อหาภาษาไทยสมบูรณ์ ครอบคลุมคำสั่งทั้ง Fast-Track, Deep-Track, CLI subcommands และ Standalone HTML Reporting
  - [x] **AC-3**: มีหัวข้อ Migration Guide จาก DevFlow 1.x / Runs สู่ 2.0.20 อย่างละเอียด
  - [x] **AC-4**: ผ่านการตรวจสอบ Master Verification Gate (`npm run check`) 100%

---

## 2. Plan & Test Strategy

- **Files to Modify / Create**:
  - `README.md`: ปรับปรุงโครงสร้างโฟลเดอร์, ผัง Dual-Track, และตัวอย่างคำสั่ง
  - `README.th.md`: อัปเดตฉบับภาษาไทยให้ตรงกับ README.md พร้อมคำอธิบายเชิงลึก
- **Test Decision**: `Manual/Command Only`
  - *Rationale*: เป็นงานเอกสาร Markdown ไม่กระทบ Runtime Logic ของ TypeScript code
  - *Planned Checks*: รัน `npm run check` เพื่อให้แน่ใจว่า Static Contract และ Routing Evals ผ่าน 100%
- **Impact & Rollback Strategy**:
  - *Impact*: ไม่มีผลกระทบเชิงลบต่อโค้ดโปรเจกต์
  - *Rollback*: สามารถสั่ง `/rollback` หรือ Git checkout ย้อนกลับได้ทันที

---

## 3. Implementation Checklist

- [x] Task 1: ปรับปรุง `README.md` (English Edition)
  - [x] 1.1 อัปเดตไดอะแกรม The 3-Pillars Workspace Layout
  - [x] 1.2 อธิบาย Dual-Track Model (Fast-Track vs Deep-Track)
  - [x] 1.3 เพิ่มตาราง CLI Subcommands (`install`, `status`, `update`, `uninstall`, `eject`)
  - [x] 1.4 เพิ่มหัวข้อ Migration Guide
- [x] Task 2: ปรับปรุง `README.th.md` (Thai Edition)
  - [x] 2.1 อัปเดตไดอะแกรมและคำอธิบาย 3 เสาหลักภาษาไทย
  - [x] 2.2 อธิบายขั้นตอนการทำงาน Fast-Track (4 ขั้นตอน) และ Deep-Track (8 ขั้นตอน)
  - [x] 2.3 เพิ่มตัวอย่างคำสั่งและการอัปเกรด Clean Reinstall
- [x] Task 3: ตรวจสอบความถูกต้องและรัน Verification Gate
  - [x] 3.1 รัน `npm run check` และยืนยันความสมบูรณ์

---

## 4. Implementation Record

- **2026-08-21**: ดำเนินการอัปเดตไฟล์ `README.md` และ `README.th.md` ครบถ้วน
  - อัปเดตไดอะแกรมโครงสร้าง 3 เสาหลัก (`ideas.md`, `context/`, `history/`)
  - อธิบายการทำงานแบบ Dual-Track (Fast-Track 4 ขั้นตอน และ Deep-Track 8 ขั้นตอน)
  - เพิ่มส่วน CLI Quick Start & Commands ครบทุก Flag (`--keep-history`, `-y`, `--json`)
  - เพิ่ม Migration Guide อย่างละเอียดทั้งแบบ Clean Reinstall และ In-Place Update
  - รัน `npm run check` ผ่านการตรวจสอบ 100%

---

## 5. Verification Evidence

- **Typecheck & Linter**: Passed (`tsc --noEmit` 0 errors)
- **Automated Test Suites**: All tests passed (21/21 passed in `packages/create-nexus-devflow`)
- **Static & Routing Evals**: 312/312 routing evaluations passed (100% Rank 1 accuracy)
- **Package Overlay Smoke Test**: 306 files created successfully, 0 conflicts
- **Acceptance Criteria Verification**:
  - [x] **AC-1**: `README.md` อธิบาย The 3-Pillars Model (`ideas.md`, `context/`, `history/`) และ Dual-Track ชัดเจน ไม่มีคำว่า `devflow/runs/`
  - [x] **AC-2**: `README.th.md` มีเนื้อหาภาษาไทยสมบูรณ์ ครอบคลุมคำสั่งทั้ง Fast-Track, Deep-Track, CLI subcommands และ Standalone HTML Reporting
  - [x] **AC-3**: มีหัวข้อ Migration Guide จาก DevFlow 1.x / Runs สู่ 2.0.20 อย่างละเอียด
  - [x] **AC-4**: ผ่านการตรวจสอบ Master Verification Gate (`npm run check`) 100%
- **Manual Try Guide**:
  - *Where to go*: ตรวจสอบไฟล์ `README.md` และ `README.th.md`
  - *Action*: ตรวจสอบส่วน "The 3-Pillars Workspace Architecture" และ "Migration Guide"
  - *Expected Result*: มีคำอธิบายโครงสร้าง 3 เสาหลักชัดเจน และมีแนวทางอัปเกรด Clean Reinstall สำหรับผู้ใช้เก่า

---

## 6. Release & Handoff

- **Release Digest**: อัปเดตคู่มือ `README.md` และ `README.th.md` สู่มาตรฐาน The 3-Pillars Model, Dual-Track Delivery และ Migration Guide สำหรับ DevFlow v2.0.20
- **Category**: `features`
- **Git Branch**: `feature/022-update-documentation-and-guides-for-v2-0-20`
- **Merge Status**: Merged into `main`
- **Archive Date**: 2026-08-21
