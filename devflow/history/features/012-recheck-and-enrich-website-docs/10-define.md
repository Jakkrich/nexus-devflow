# Phase 10: Define Contract

- **Running ID**: `RUN-012-recheck-and-enrich-website-docs`
- **Title**: ตรวจสอบ Recheck, ปรับโครงสร้างลำดับเนื้อหา และเสริมคำอธิบายเชิงลึก (Deep Enrichment) บนหน้าเว็บ Documentation ทั้ง 12 หน้า
- **Source Discovery**: [DISC-20260818-012-recheck-and-enrich-website-docs](../../discoveries/DISC-20260818-012-recheck-and-enrich-website-docs/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Documentation & DX Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จากการสำรวจใน `DISC-20260818-012-recheck-and-enrich-website-docs` พบว่าหน้าเอกสารบนเว็บไซต์ (`website/src/content/docs/`) ในหลายหมวดหมู่ยังมีเนื้อหาสั้นเกินไป (15-30 บรรทัด) และขาดตัวอย่างเชิงปฏิบัติการ วงจรชีวิตของ Artifacts ตลอดจนคำอธิบายเรื่องวินัยและ Review Gates ที่ชัดเจน

เป้าหมายของ Run นี้คือการ **Recheck ตรวจสอบเนื้อหาทั้งหมด, จัดเรียงลำดับหัวข้อใหม่อย่างเป็นลำดับขั้นตอน (Logical Flow), และอธิบายรายละเอียดเชิงลึก (Deep Enrichment)** ใน 12 หน้าเอกสารสำคัญของเว็บไซต์ ให้เป็นคู่มือที่สมบูรณ์ สวยงาม และใช้งานได้จริง

---

## 2. ขอบเขตงานที่ต้องดำเนินการ (In-Scope)

ครอบคลุมการปรับปรุง 12 หน้าเอกสาร โดยแบ่งเป็น 4 กลุ่มหลัก:

### กลุ่มที่ 1: Start & Foundation (4 หน้า)
1. [`website/src/content/docs/start/getting-started.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/start/getting-started.md)
   - อธิบายสถาปัตยกรรม Overlay Model, ขั้นตอนการติดตั้งด้วย `npx @jakkrichm/create-nexus-devflow`
   - แนะนำการรันคำสั่ง `/onboard` (หรือ `$onboard`) และ Onboarding Checklist
   - แสดงผังวงรอบ 8 ขั้นตอน (`00-discover` ถึง `70-release`) พร้อมตัวอย่างคำสั่งเริ่มต้น
2. [`website/src/content/docs/start/existing-codebase.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/start/existing-codebase.md)
   - เปรียบเทียบความแตกต่างระหว่าง `/onboard` (สำหรับโปรเจกต์ใหม่) กับ `/adopt` (สำหรับโปรเจกต์เดิม Brownfield)
   - ขั้นตอนการทำงานของ `/adopt`: การสำรวจ Stack, Lint, Test, Build, ตรวจจับ CI/GitHub Actions เดิม
   - การบันทึก Baseline Findings และการสร้าง Initial Context Files อย่างปลอดภัย
3. [`website/src/content/docs/start/project-context.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/start/project-context.md)
   - เจาะลึก 4 ไฟล์ Context หลักใน `devflow/context/`:
     - `project-overview.md` (Single Source of Truth)
     - `coding-standards.md` (กฎวิศวกรรมซอฟต์แวร์และรูปแบบโค้ด)
     - `ai-interaction.md` (แนวทางการสื่อสารและการทำงานร่วมกับ AI)
     - `current-stage.md` (บันทึกสถานะ Active Delivery Run)
   - หลักการบำรุงรักษา Context ให้สดใหม่และป้องกัน Context Drift
4. [`website/src/content/docs/start/updating-devflow.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/start/updating-devflow.md)
   - วิธีการอัปเดตเวอร์ชัน DevFlow และการรัน `/check-for-updates`
   - การปกป้อง Custom Skills และ Context Files ไม่ให้ถูกเขียนทับ
   - การตรวจเช็คความเข้ากันได้หลังการอัปเกรด

### กลุ่มที่ 2: Workflow & Mainline Stages (2 หน้า)
5. [`website/src/content/docs/workflow/review-gates.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/workflow/review-gates.md)
   - เจาะลึก 4 ด่านตรวจสำคัญ (Review Gates):
     - **Discovery Gate**: ผ่านเฉพาะเมื่อเป็น `Proceed` และได้รับอนุมัติ
     - **Spec & Plan Gate**: ต้องมี Acceptance Criteria และ Test Decisions ชัดเจนก่อนเขียนโค้ด
     - **QA & Findings Gate**: ต้องมี Empirical Evidence และไม่มี P0/P1 ค้าง
     - **Release Gate**: ต้องได้รับการยืนยันจากมนุษย์ก่อน Merge หรือ Push
   - หลักการ Human-in-the-loop และข้อห้ามเด็ดขาดของ AI
6. [`website/src/content/docs/commands/mainline-stages.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/commands/mainline-stages.md)
   - ขยายความรายละเอียดของทั้ง 8 Mainline Stages (`00-discover` ถึง `70-release`)
   - แต่ละสเตจระบุ: Purpose, Input/Context, AI & Human Tasks, Output Artifacts, และ Review Gate Criteria

### กลุ่มที่ 3: Quality, Verification & Reports (4 หน้า)
7. [`website/src/content/docs/quality/senior-qa-verification.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/quality/senior-qa-verification.md)
   - บทบาท Senior QA Engineer ในสเตจ `50-verify`
   - กฎเหล็ก Empirical Evidence (ผลลัพธ์จริงจากการรันเทสต์, Terminal logs, API status)
   - 4 เลนตรวจสอบ (Functional Correctness, Regression, Standards & Security, Performance)
   - การสร้าง `50-verify-impact.md` สำหรับการวิเคราะห์ผลกระทบข้างเคียง
8. [`website/src/content/docs/quality/findings-ledger.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/quality/findings-ledger.md)
   - โครงสร้างและหลักการทำงานของ `devflow/context/findings.md`
   - ระดับความรุนแรง P0 (Blocker), P1 (Critical), P2 (Major), P3 (Minor)
   - วงจรชีวิต Finding (`open` -> `fixed` -> `closed`) และกฎเกณฑ์การปลดบล็อก Gate
9. [`website/src/content/docs/quality/manual-review.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/quality/manual-review.md)
   - วัตถุประสงค์ของคำสั่ง `/try` สำหรับการทดสอบด้วยมนุษย์
   - โครงสร้าง Try Guide 3 มิติ: Where to go, What to click, What to expect
   - ตัวอย่างการเขียน Try Guide สำหรับ Web UI, API, และ CLI Tools
10. [`website/src/content/docs/quality/interactive-reports.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/quality/interactive-reports.md)
    - สถาปัตยกรรม Standalone Single-File HTML Report (`60-report.html`)
    - ฟังก์ชัน Interactive: ตัวกรองสถานะ Task, แท็บเปรียบเทียบ Code Diff, แสดง Evidence Logs, และสรุป Findings Ledger
    - ประโยชน์สำหรับ Product Manager และ Stakeholders ในการตรวจรับงาน

### กลุ่มที่ 4: Reference & Tool Adapters (2 หน้า)
11. [`website/src/content/docs/reference/tool-adapters.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/reference/tool-adapters.md)
    - สถาปัตยกรรม Multi-AI Adapters: `.agents/` (Antigravity, Codex) และ `.claude/` (Claude Code)
    - กฎการแปลงไวยากรณ์ Universal Invocation: Canonical Name, Slash (`/`), และ Dollar (`$`)
    - การปรับแต่ง Custom Rules และ Sidecars ในสภาพแวดล้อมต่างๆ
12. [`website/src/content/docs/reference/file-reference.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/reference/file-reference.md)
    - สารานุกรมโครงสร้างโฟลเดอร์และไฟล์ทั้งหมดของ DevFlow
    - ตารางระบุ Path, หน้าที่, การแก้ไข (AI-managed vs Human-edited), และวงจรชีวิตของไฟล์

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่แก้ไขโค้ด Logic ภายใน Package `packages/create-nexus-devflow/`
- ไม่สร้าง URL หรือ Route ใหม่ในเว็บไซต์ (คงไว้ตาม 12 URLs เดิมที่ผู้ใช้ระบุ)
- ไม่ลบข้อมูลเดิมที่มีประโยชน์ แต่จะจัดเรียงและขยายความให้สมบูรณ์ยิ่งขึ้น

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-012`** | `recheck-and-enrich-website-docs` | Recheck, จัดลำดับใหม่ และอธิบายเนื้อหาเชิงลึกครบทั้ง 12 หน้าเอกสารบนเว็บไซต์ Documentation พร้อมทดสอบ Build |

---

## 5. เกณฑ์ความสำเร็จและการตรวจรับ (Acceptance Criteria)

1. ทั้ง 12 หน้าเอกสารได้รับการปรับปรุง มีเนื้อหาครบถ้วน สมบูรณ์ และมีตัวอย่างประกอบชัดเจน
2. ไม่ใช้คำอธิบายแบบผิวเผิน ทุกหน้ามีโครงสร้างหัวข้อแบบ Step-by-Step, Code Blocks, Alerts และ Flow ที่อ่านง่าย
3. เอกสารเชื่อมโยง (Cross-link) ไปยังหน้าที่เกี่ยวข้องอย่างถูกต้อง
4. เว็บไซต์สามารถ Build ผ่านได้ 100% ปราศจาก Broken Link หรือ Syntax Errors

---

## 6. คำสั่งถัดไป (Next Workflow Recommendation)

เข้าสู่ขั้นตอนเขียน Technical Specification:

```text
/20-spec RUN-012-recheck-and-enrich-website-docs
```
