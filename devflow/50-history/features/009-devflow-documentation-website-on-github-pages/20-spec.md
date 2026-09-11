# Phase 20: Delivery Specification

- **Running ID**: `RUN-009-devflow-documentation-website-on-github-pages`
- **Title**: ข้อกำหนดการพัฒนาระบบ Documentation Website สำหรับ Nexus-DevFlow 2.0 สไตล์ AI-Blueprint และตั้งค่า Deploy อัตโนมัติบน GitHub Pages
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Architecture & DX Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้กำหนดสัญญาการส่งมอบ (Delivery Contract) สำหรับการสร้างและเผยแพร่เว็บไซต์คู่มืออย่างเป็นทางการของ **Nexus-DevFlow 2.0** เพื่อให้ผู้ใช้และ AI Agents มีแหล่งอ้างอิงที่ชัดเจน สวยงาม พรีเมียม ใช้งานง่าย และเผยแพร่บน **GitHub Pages (`github.io`) 100% ฟรี** โดยครอบคลุม 5 ส่วนหลัก:

1. **สถาปัตยกรรม Documentation Engine ในโฟลเดอร์ `website/`**
2. **การแปลงโครงสร้างและเนื้อหาทั้งหมดจาก AI-Blueprint สู่ Nexus-DevFlow 2.0**
3. **การออกแบบ UI/UX สไตล์ ai-blueprint.dev (Astro Starlight / Custom Theme)**
4. **คำสั่งควบคุมและการผสานรวมใน root `package.json`**
5. **ระบบ CI/CD GitHub Actions สำหรับการ Deploy อัตโนมัติบน GitHub Pages**

---

## 2. ข้อกำหนดฟังก์ชันหลัก (Core Functional Requirements)

### REQ-1: สถาปัตยกรรม Docs Engine (`website/`)
- **R1.1**: ติดตั้งและกำหนดค่า **Astro Starlight** (หรือ Astro Framework ที่เทียบเท่า) ในโฟลเดอร์ `website/`
- **R1.2**: รองรับการคอมไพล์เป็น Static HTML/CSS/JS บริสุทธิ์ (Pure Static Site) พร้อมทำงานได้ทันทีบน Static Hosting ทั่วไป
- **R1.3**: แยก dependencies ของ docs ไว้ใน `website/package.json` หรือผสานเข้ากับ monorepo workspace อย่างปลอดภัย

### REQ-2: การออกแบบ UI/UX และธีม (Look & Feel สไตล์ ai-blueprint.dev)
- **R2.1 (Docs Shell)**: มีโครงสร้าง Layout 3 คอลัมน์ (Left Sidebar Navigation, Center Content Area, Right Table of Contents)
- **R2.2 (Header & Brand)**: แถบ Header พร้อม Brand Logo ("Nexus DevFlow"), Docs Badge, ปุ่มค้นหา ⌘K Search, ลิงก์ GitHub Repo, และปุ่มสลับ Dark/Light Theme
- **R2.3 (Search Dialog)**: ระบบค้นหาด่วนแบบ In-browser Modal (⌘K) ที่ค้นหาหน้า หัวข้อ และคำสั่งได้อย่างรวดเร็ว
- **R2.4 (Code Blocks & Callouts)**: การแสดงผลกล่องโค้ดพร้อม Syntax Highlighting โทน Dark, ปุ่มคัดลอกโค้ด (Copy Button), และกล่องเตือนพิเศษ (Note, Tip, Important, Warning, Caution)
- **R2.5 (Responsive Design)**: รองรับการแสดงผลสมบูรณ์แบบทั้งบน Desktop, Tablet และ Mobile พร้อม Mobile Drawer Menu

### REQ-3: โครงสร้างเนื้อหาและการแปลงบทความ (Content Structure & Taxonomy)
แปลงและจัดหมวดหมู่เอกสารให้ตรงกับมาตรฐาน Nexus-DevFlow 2.0 ครบทุกมิติ:

- **หมวดที่ 1: Start (เริ่มต้นใช้งาน)**:
  - `getting-started.md`: ภาพรวม DevFlow, การติดตั้งด้วย `npx @jakkrichm/create-nexus-devflow`, ขั้นตอน Scaffold & Overlay, และการ Onboard โปรเจกต์
  - `existing-codebase.md`: คู่มือการนำ `/adopt` ไปใช้กับ Brownfield Codebase ที่มีโค้ดอยู่แล้ว
  - `project-context.md`: การทำงานของ `devflow/context/` (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`)
  - `updating-devflow.md`: คู่มือการอัปเกรดเวอร์ชันและตรวจสอบความเข้ากันได้ (`/check-for-updates`)
- **หมวดที่ 2: Workflow (กระบวนการทำงานหลัก)**:
  - `core-workflow.md`: แผนผังวงรอบการทำงาน Linear 8 ขั้นตอน (`00-discover` -> `10-define` -> `20-spec` -> `30-plan` -> `40-implement` -> `50-verify` -> `60-report` -> `70-release`)
  - `review-gates.md`: กฎเหล็ก Review Gates และการควบคุมขอบเขตงานอย่างเคร่งครัด
- **หมวดที่ 3: Commands & Stages Catalog (สารบัญคำสั่งและขั้นตอน)**:
  - `mainline-stages.md`: รายละเอียดและตัวอย่างการใช้งาน Stage 00 ถึง 70
  - `companion-commands.md`: คำสั่งเสริมครบชุด (`devflow`, `doctor`, `try`, `rollback`, `ci`, `brief`, `autopilot`, `debug`, `goal`, `brainstorm`, `prd`, `security-review`)
- **หมวดที่ 4: Quality & Verification (การตรวจสอบคุณภาพ)**:
  - `senior-qa-verification.md`: การพิสูจน์ด้วยหลักฐานเชิงประจักษ์ใน `/50-verify`
  - `findings-ledger.md`: กลไก State Machine ของ `findings.md` (`open` -> `fixed` -> `closed`)
  - `manual-review.md`: การสร้างคู่มือทดสอบทีละคลิกด้วย `/try`
  - `interactive-reports.md`: การสร้างและเปิดดู Standalone HTML Report (`60-report.html`)
- **หมวดที่ 5: Reference & Adapters (เอกสารอ้างอิง)**:
  - `tool-adapters.md`: การทำงานร่วมกันระหว่าง Antigravity, Claude Code, และ OpenAI Codex
  - `file-reference.md`: โครงสร้างไฟล์ทั้งหมดของระบบ DevFlow

### REQ-4: คำสั่งควบคุมใน Root `package.json`
- **R4.1**: เพิ่มคำสั่ง `npm run docs:dev` สำหรับรัน Local Development Server (เช่น `http://localhost:4321`)
- **R4.2**: เพิ่มคำสั่ง `npm run docs:build` สำหรับบิลด์ไฟล์ Static HTML ไปยังโฟลเดอร์ `website/dist/`
- **R4.3**: เพิ่มคำสั่ง `npm run docs:preview` สำหรับพรีวิว Static Output ในเครื่องก่อน Deploy

### REQ-5: ระบบ Deploy อัตโนมัติบน GitHub Pages (CI/CD)
- **R5.1**: สร้างไฟล์ `.github/workflows/deploy-docs.yml` ที่มีสิทธิ์ `contents: read`, `pages: write`, `id-token: write`
- **R5.2**: ทำงานอัตโนมัติเมื่อมีการ Push โค้ดเข้า Branch `main` หรือรันผ่าน `workflow_dispatch`
- **R5.3**: บิลด์ static site จาก `website/` และ deploy ขึ้น GitHub Pages โดยอัตโนมัติ

### REQ-6: การแยกส่วนและรักษาขนาดของ npm package (Package Hygiene)
- **R6.1**: ตรวจสอบว่า `packages/create-nexus-devflow/package.json` ยังคงระบุเฉพาะ `files` ที่จำเป็น (`bin/`, `lib/`, `template/`, `README.md`, `LICENSE`) ไม่ดึง `website/` ไปใน npm publish
- **R6.2**: ผ่านการทดสอบทั้งหมดของระบบ: `npm run check:static`, `npm run check`, `npm test`, `npm run test:package`

---

## 3. เกณฑ์การยอมรับ (Acceptance Criteria)

| ID | Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **AC-1** | Docs Engine & Local Build | โฟลเดอร์ `website/` พร้อมใช้งาน สามารถรัน `npm run docs:dev` และ `npm run docs:build` บิลด์ Static Output ได้สมบูรณ์ 100% โดยไม่มีข้อผิดพลาด |
| **AC-2** | UI/UX & Design Parity | มีโครงสร้างหน้าเว็บ สไตล์ ธีมสี Table of Contents, Search Dialog (⌘K), Sidebar Nav, Code blocks, Callouts ที่หรูหราตรงตามสไตล์ต้นฉบับ |
| **AC-3** | Complete Content Mapping | มีไฟล์ Markdown ครบทั้ง 5 หมวดหมู่หลัก (Start, Workflow, Commands, Quality, Reference) และแปล/ปรับแต่งให้ตรงกับ DevFlow 2.0 ครบถ้วน |
| **AC-4** | Root Scripts Integration | มีคำสั่ง `npm run docs:dev`, `npm run docs:build`, `npm run docs:preview` ใน root `package.json` และทำงานได้อย่างถูกต้อง |
| **AC-5** | GitHub Pages CI/CD | มีไฟล์ `.github/workflows/deploy-docs.yml` ที่ถูกต้องตามมาตรฐาน GitHub Pages Deployment |
| **AC-6** | Zero Package Bloat & Verification | `npm run check:static`, `npm run check`, `npm test`, และ `npm run test:package` ผ่าน 100% และไม่มีผลกระทบต่อ npm package |

---

## 4. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
30-plan RUN-009-devflow-documentation-website-on-github-pages
```
