# Phase 30: Implementation Plan

- **Running ID**: `RUN-009-devflow-documentation-website-on-github-pages`
- **Title**: แผนการพัฒนาระบบ Documentation Website สำหรับ Nexus-DevFlow 2.0 สไตล์ AI-Blueprint และตั้งค่า Deploy อัตโนมัติบน GitHub Pages
- **Source Spec**: [20-spec.md](20-spec.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Architecture & DX Team

---

## 1. การประเมินความซับซ้อนและยุทธศาสตร์ (Complexity Assessment & Strategy)

- **ระดับความซับซ้อน (Complexity)**: `Standard - High` (สร้าง Static Site Generator ในโฟลเดอร์ `website/`, ออกแบบ UI Theme สไตล์ ai-blueprint.dev, เขียนเนื้อหาครอบคลุมทุกกระบวนการของ DevFlow 2.0, และตั้งค่า GitHub Actions CI/CD)
- **ยุทธศาสตร์ (Strategy)**:
  1. **Phase 1: สร้าง Docs Engine (`website/`)**: วางโครงสร้าง Astro Starlight ที่มีประสิทธิภาพสูง พร้อม Custom Theme, Palette สีทันสมัย, Navigation Sidebar, Search Modal (⌘K), Table of Contents, และผูกคำสั่งเข้ากับ root `package.json`
  2. **Phase 2: จัดทำเนื้อหาคู่มือฉบับสมบูรณ์ (Content Authoring)**: แบ่งการเขียนเนื้อหาออกเป็น 5 หมวดหมู่หลัก (Start, Workflow, Commands, Quality, Reference) ให้ตรงตามระเบียบวินัยและคำสั่งของ DevFlow 2.0
  3. **Phase 3: สร้าง GitHub Actions CI/CD**: จัดทำ `.github/workflows/deploy-docs.yml` เพื่อให้ Build และ Deploy ขึ้น GitHub Pages อัตโนมัติเมื่อ Push เข้า `main`
  4. **Phase 4: การทดสอบ Local และยืนยันความสมบูรณ์**: ทดสอบ Local Dev (`npm run docs:dev`), ทดสอบ Production Build (`npm run docs:build`), และรันชุดทดสอบความถูกต้องของ Framework ทั้งหมด 100%

---

## 2. ลำดับเฟสและรายการงานย่อย (Ordered Phases & Subtasks)

### Phase 1: การวางโครงสร้าง Docs Engine (`website/`)
- **Subtask 1.1**: สร้างโฟลเดอร์ `website/` พร้อมไฟล์ `package.json`, `astro.config.mjs`, `tsconfig.json` สำหรับ Astro Starlight
  - *Files*: `website/package.json`, `website/astro.config.mjs`, `website/tsconfig.json`
  - *Test Decision*: `Manual/Command Only`
  - *Verification*: ตรวจสอบโครงสร้างไฟล์และการตั้งค่า config ถูกต้อง
- **Subtask 1.2**: ออกแบบและตั้งค่า Custom Theme CSS ให้มีสไตล์หรูหราทันสมัยเทียบเคียง `ai-blueprint.dev` (Dark Palette, Code Highlighting, Callouts, Typography)
  - *Files*: `website/src/assets/custom.css`, `website/src/assets/logo.svg`
  - *Test Decision*: `Manual/Command Only`
  - *Verification*: ตรวจสอบ CSS Variables และ Typography
- **Subtask 1.3**: เพิ่ม Scripts ควบคุมใน root `package.json` (`docs:dev`, `docs:build`, `docs:preview`)
  - *Files*: `package.json`
  - *Test Decision*: `Manual/Command Only`
  - *Verification*: รัน `npm run docs:dev` และ `npm run docs:build` ได้อย่างถูกต้อง

### Phase 2: การจัดทำเนื้อหาคู่มือหลัก (Content Authoring)
- **Subtask 2.1**: จัดทำเนื้อหาหมวด **Start (เริ่มต้นใช้งาน)**
  - *Files*:
    - `website/src/content/docs/index.md` (Landing / Overview)
    - `website/src/content/docs/start/getting-started.md`
    - `website/src/content/docs/start/existing-codebase.md`
    - `website/src/content/docs/start/project-context.md`
    - `website/src/content/docs/start/updating-devflow.md`
  - *Test Decision*: `Not Required` (Content/Documentation)
  - *Verification*: ตรวจสอบเนื้อหา ลิงก์ และคำสั่งถูกต้อง
- **Subtask 2.2**: จัดทำเนื้อหาหมวด **Workflow (กระบวนการทำงานหลัก)**
  - *Files*:
    - `website/src/content/docs/workflow/core-workflow.md`
    - `website/src/content/docs/workflow/review-gates.md`
  - *Test Decision*: `Not Required` (Content/Documentation)
  - *Verification*: ตรวจสอบแผนภาพและคำอธิบาย 8 Stages
- **Subtask 2.3**: จัดทำเนื้อหาหมวด **Commands & Stages Catalog**
  - *Files*:
    - `website/src/content/docs/commands/mainline-stages.md`
    - `website/src/content/docs/commands/companion-commands.md`
  - *Test Decision*: `Not Required` (Content/Documentation)
  - *Verification*: ตรวจสอบรายละเอียดของทุก Mainline & Companion Command
- **Subtask 2.4**: จัดทำเนื้อหาหมวด **Quality & Verification**
  - *Files*:
    - `website/src/content/docs/quality/senior-qa-verification.md`
    - `website/src/content/docs/quality/findings-ledger.md`
    - `website/src/content/docs/quality/manual-review.md`
    - `website/src/content/docs/quality/interactive-reports.md`
  - *Test Decision*: `Not Required` (Content/Documentation)
  - *Verification*: ตรวจสอบกระบวนการ QA และการทำงานของ findings ledger
- **Subtask 2.5**: จัดทำเนื้อหาหมวด **Reference & Adapters**
  - *Files*:
    - `website/src/content/docs/reference/tool-adapters.md`
    - `website/src/content/docs/reference/file-reference.md`
  - *Test Decision*: `Not Required` (Content/Documentation)
  - *Verification*: ตรวจสอบการใช้งาน adapter ของ Antigravity, Claude Code, และ Codex

### Phase 3: ระบบ GitHub Actions Deploy บน GitHub Pages (CI/CD)
- **Subtask 3.1**: สร้าง GitHub Actions Workflow `.github/workflows/deploy-docs.yml`
  - *Files*: `.github/workflows/deploy-docs.yml`
  - *Test Decision*: `Manual/Command Only`
  - *Verification*: ตรวจสอบความถูกต้องของ YAML Syntax และสิทธิ์ GitHub Pages
- **Subtask 3.2**: ตรวจสอบความสะอาดของ npm package (Package Hygiene)
  - *Files*: `packages/create-nexus-devflow/package.json`
  - *Test Decision*: `Required`
  - *Verification*: รัน `npm run test:package` เพื่อให้แน่ใจว่าโฟลเดอร์ docs ไม่ปนเปื้อนใน template

### Phase 4: การทดสอบใน Local และยืนยันความสมบูรณ์
- **Subtask 4.1**: ทดสอบ Local Dev Server (`npm run docs:dev`)
- **Subtask 4.2**: ทดสอบ Production Static Build (`npm run docs:build`) และ Preview
- **Subtask 4.3**: รันชุดตรวจสอบความถูกต้องของระบบทั้งหมด (`npm run check:static`, `npm run check`, `npm test`, `npm run test:package`)

---

## 3. แผนการตรวจสอบและเกณฑ์การผ่าน (Verification Strategy)

| Layer | Command / Action | Expected Outcome |
| :--- | :--- | :--- |
| **Docs Local Build** | `npm run docs:build` | คอมไพล์ Static HTML ไปยัง `website/dist/` สำเร็จ 100% โดยไม่มีข้อผิดพลาด |
| **Docs Local Dev** | `npm run docs:dev` | Local Server รันได้ปกติ เปิดดูได้ที่ `http://localhost:4321` |
| **Static Framework** | `npm run check:static` | ผ่านการตรวจสอบ Skill naming, contract และ manifest |
| **Workspace Integrity**| `npm run check` | ไฟล์และโฟลเดอร์หลักของ DevFlow ครบถ้วน |
| **Installer Unit Tests**| `npm test` | ผ่านการทดสอบ installer package |
| **Package Smoke Test** | `npm run test:package` | จำลองการ pack และติดตั้งสำเร็จใน sandbox |

---

## 4. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
40-implement RUN-009-devflow-documentation-website-on-github-pages
```
