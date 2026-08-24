# 📐 [RUN-018-update-documentation-and-guides] อัปเดตคู่มือ เอกสาร และ Website Documentation ให้เป็นปัจจุบันและครอบคลุม Dual-Track Model ล่าสุด (Living Spec)

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Branch**: `feature/update-documentation-and-guides-RUN-018`  
> **Created Date**: 2026-08-20  
> **Owner**: DevFlow Core Framework Team  

---

## 1. Specification & Scope

- **Problem Statement**:
  - หลังจากการปรับปรุงสถาปัตยกรรมล่าสุด (RUN-015 Dual-Track, RUN-016 Idea Inbox, RUN-017 แยก `/feature`, `/fix` และเปลี่ยนสเตจ 40 เป็น `40-execute`)
  - เอกสารบางส่วน เช่น คู่มือเว็บไซต์ (`website/src/content/docs/`), คู่มือการใช้งานภาษาไทย (`README.th.md`), `README.md`, และ `docs/` ยังมีเนื้อหาบางหน้าที่อธิบายสเตจแบบเดิม หรือยังไม่ได้อธิบายการใช้งาน Fast-Track (`/feature`, `/fix`) อย่างละเอียด
  - ต้องการอัปเดตคู่มือทั้งหมดให้สะท้อนสถานะปัจจุบัน มีคำอธิบายและตัวอย่างที่ชัดเจน เข้าใจง่าย และสมบูรณ์ 100%

- **In-Scope**:
  1. **Documentation Website (`website/src/content/docs/`)**:
     - อัปเดตหน้าหลักและหมวดหมู่ต่างๆ (`index.mdx`, `start/getting-started.md`, `commands/mainline-stages.md`, `workflow/core-workflow.md`, `reference/file-reference.md`)
     - เพิ่มหัวข้ออธิบาย **Dual-Track Delivery**: Fast-Track (4 Steps: `/feature`, `/fix`, `/implement`, `/check`, `/complete`) และ Deep-Track (8 Steps: `00-discover` ถึง `70-release`)
     - อธิบายการใช้งาน Idea Inbox (`/idea`) และ Standalone HTML Dashboard (`/report:html`)
  2. **README.md และ README.th.md**:
     - ทบทวนและปรับปรุงเนื้อหาให้ตรงกับคำสั่ง Canonical ล่าสุด ไม่มีคำตกค้างหรือสับสน
     - เพิ่มตัวอย่างการใช้งานทั้ง Fast-Track และ Deep-Track อย่างชัดเจน
  3. **Docs Directory & Context Files**:
     - ปรับปรุง `devflow/context/project-overview.md` ให้บันทึกความสามารถ Dual-Track, 80 skills และ recent milestones
  4. **Verification**:
     - รัน `npm --prefix website run build` ตรวจสอบ Static Site Generation (18 pages generated)
     - รัน `npm run check` All Green 100%

- **Out-of-Scope**:
  - การแก้ไขโค้ดหรือสคริปต์การทำงานของ Core Engine (เน้นเอกสารและเนื้อหาคู่มือ)

- **Acceptance Criteria**:
  - [x] **AC-1**: เว็บไซต์เอกสาร (`website/`) อัปเดตโครงสร้าง Dual-Track, Fast-Track (`/feature`, `/fix`), `40-execute`, และ `/idea` ครบถ้วน พร้อมผ่านคำสั่ง `npm --prefix website run build`
  - [x] **AC-2**: `README.md` และ `README.th.md` อธิบาย Dual-Track Flow ครบถ้วน ถูกต้อง ชัดเจน
  - [x] **AC-3**: เอกสารและ Context Files (`project-overview.md`, `file-reference.md`) ปรับปรุงครบทุกจุด
  - [x] **AC-4**: ผ่านการตรวจสอบ Master Gate `npm run check` All Green 100%

---

## 2. Plan & Test Strategy

- **Files to Modify / Create**:
  - `website/src/content/docs/index.mdx`: [MODIFY] ปรับ Hero, Diagram & Feature Highlights
  - `website/src/content/docs/start/getting-started.md`: [MODIFY] เพิ่มคำแนะนำ Dual-Track
  - `website/src/content/docs/workflow/core-workflow.md`: [MODIFY] ปรับปรุงไดอะแกรมและคำอธิบาย 2 Tracks
  - `website/src/content/docs/commands/mainline-stages.md`: [MODIFY] อัปเดตตารางและคำอธิบายทุกคำสั่ง
  - `website/src/content/docs/reference/file-reference.md`: [MODIFY] อัปเดตแผนผังไฟล์
  - `README.md` & `README.th.md`: [MODIFY] ปรับปรุงเนื้อหาภาพรวม
  - `devflow/context/project-overview.md`: [MODIFY] ซิงค์ภาพรวมโครงการ

- **Test Decision**: `Required (Documentation Build & Framework Integrity)`
  - *Rationale*: คู่มือและเว็บไซต์เอกสารต้อง Build ผ่านโดยไม่มี Broken Links หรือ Markdown Syntax Errors
  - *Planned Cases*:
    - Build Astro Starlight website (`npm --prefix website run build`)
    - รัน Framework Static Checks & Multi-lane Validation (`npm run check`)

- **Impact & Rollback Strategy**:
  - *Impact*: ผู้ใช้งานและทีมงานได้คู่มือที่ถูกต้อง ทันสมัย และตรงกับระบบปัจจุบัน
  - *Rollback*: Git revert commit ของ RUN-018

---

## 3. Implementation Checklist

### Phase 1: Website Documentation Content Updates
- [x] Task 1.1: อัปเดต `website/src/content/docs/index.mdx` และ `getting-started.md`
- [x] Task 1.2: อัปเดต `website/src/content/docs/workflow/core-workflow.md` (Dual-Track breakdown)
- [x] Task 1.3: อัปเดต `website/src/content/docs/commands/mainline-stages.md` (Fast-Track & Deep-Track)
- [x] Task 1.4: อัปเดต `website/src/content/docs/reference/file-reference.md`

### Phase 2: Root & Internal Documentation Updates
- [x] Task 2.1: อัปเดต `README.md` และ `README.th.md`
- [x] Task 2.2: อัปเดต `devflow/context/project-overview.md`

### Phase 3: Build & Full Multi-lane Verification
- [x] Task 3.1: รัน `npm --prefix website run build` ตรวจสอบ Static Site Build (18 pages generated)
- [x] Task 3.2: รัน `npm run check` All Green 100%

---

## 4. Implementation Record

- **[Phase 1]**:
  - อัปเดต `website/src/content/docs/index.mdx`: เพิ่มผังไดอะแกรม Dual-Track (Fast-Track 4 Steps & Deep-Track 8 Steps) และปรับปรุง Feature Cards
  - อัปเดต `website/src/content/docs/start/getting-started.md`: อธิบายการเลือกใช้งาน Dual-Track และโครงสร้าง Folder ล่าสุด
  - อัปเดต `website/src/content/docs/workflow/core-workflow.md`: เพิ่มรายละเอียด Fast-Track Blueprint Flow และอัปเดตสเตจ 40 เป็น `40-execute`
  - อัปเดต `website/src/content/docs/commands/mainline-stages.md`: เพิ่มตารางคำสั่ง Fast-Track (`/feature`, `/fix`, `/implement`, `/check`, `/complete`), สเตจ Deep-Track (`40-execute`), และ Companion Tools (`/idea`, `/report:html`)
  - อัปเดต `website/src/content/docs/reference/file-reference.md`: เพิ่ม `devflow/ideas.md` และ `spec.md`
- **[Phase 2]**:
  - อัปเดต `README.md` และ `README.th.md`: อธิบายภาพรวม Dual-Track Model และ Companion Commands ล่าสุด
  - อัปเดต `devflow/context/project-overview.md`: บันทึก Architecture Dual-Track, 80 skills, และ Recent Milestones
- **[Phase 3]**:
  - `npm --prefix website run build`: Passed (คอมไพล์สำเร็จ 18 หน้า พร้อมสร้าง Pagefind search index).
  - `npm run check`: **All Nexus-DevFlow checks PASSED successfully!**

---

## 5. Verification Evidence

- **Lane 1: Documentation Build & Static Generation**:
  - `npm --prefix website run build`: **Passed** (Astro Starlight สร้าง HTML Static Pages ครบ 18 หน้า, Sitemaps และ Pagefind Index พร้อมเผยแพร่บน GitHub Pages).
- **Lane 2: Typecheck & Static Safety**:
  - `npm run typecheck` (`tsc --noEmit`): **Passed** (0 errors).
  - `npm run check:static`: **Passed** (80 skills validated, Numbered Mainline passed).
- **Lane 3: Routing Accuracy, Unit Tests & Package Smoke Test**:
  - `npm run test:routing`: **Passed** (100.00% Rank 1 Match Accuracy บน 312 test cases).
  - `npm test`: **Passed** (3/3 unit tests passed).
  - `npm run test:package`: **Passed** (Cleanly overlaid 305 template files).
  - `npm run check`: **Passed** (✅ All Nexus-DevFlow checks PASSED successfully!).
- **Acceptance Criteria Verification**:
  - [x] **AC-1**: เว็บไซต์เอกสาร (`website/`) อัปเดตโครงสร้าง Dual-Track และ Build สำเร็จ 100%
  - [x] **AC-2**: `README.md` และ `README.th.md` อธิบาย Dual-Track Flow ถูกต้อง ครบถ้วน
  - [x] **AC-3**: เอกสารและ Context Files (`project-overview.md`, `file-reference.md`) ปรับปรุงตรงกัน
  - [x] **AC-4**: ผ่านการตรวจสอบ Master Gate `npm run check` All Green 100%

---

## 6. Release & Handoff

- **Release Digest**:
  - อัปเดต Documentation Website (`website/src/content/docs/`), `README.md`, `README.th.md`, และ `devflow/context/project-overview.md` ให้สะท้อนสถาปัตยกรรม Dual-Track Model ล่าสุด
  - จัดทำผังไดอะแกรมและตารางคำสั่ง Fast-Track (4 ขั้นตอน: `/feature`, `/fix` ➔ `/implement` ➔ `/check` ➔ `/complete`) และ Deep-Track (8 สเตจ: `00-discover` ถึง `70-release`)
  - อธิบายคู่มือการใช้งาน Idea Capture Inbox (`/idea`) และ Standalone Interactive HTML Dashboard (`/report:html`)
  - คอมไพล์ Static Pages สำเร็จ 18 หน้า และผ่าน Master Verification Gate 100%
- **Git Branch**: `feature/update-documentation-and-guides-RUN-018`
- **Merge Status**: Merged into `main` (Head)
- **Artifact Contract**: Fast-Track Single Living Spec (`spec.md`) completed.
- **Standalone HTML Report Tip**: หากต้องการเปิดดูรายงานสรุปในรูปแบบ Web Dashboard สามารถสั่งคำสั่ง `/report:html` (หรือ `npm run report:html -- RUN-018`) ได้ตามต้องการ
