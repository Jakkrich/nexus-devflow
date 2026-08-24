# Phase 10: Define Contract

- **Running ID**: `RUN-009-devflow-documentation-website-on-github-pages`
- **Title**: พัฒนาระบบ Documentation Website สำหรับ Nexus-DevFlow 2.0 สไตล์ AI-Blueprint และตั้งค่า Deploy อัตโนมัติบน GitHub Pages
- **Source Discovery**: [DISC-20260818-005-devflow-documentation-site-on-github-pages](../../discoveries/DISC-20260818-005-devflow-documentation-site-on-github-pages/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Architecture & DX Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จัดทำเว็บไซต์ Documentation ทางการสำหรับ **Nexus-DevFlow 2.0** เพื่อเป็นศูนย์กลางคู่มือการใช้งาน ตัวอย่างคำสั่ง และแนวทางปฏิบัติเชิงวิศวกรรมสำหรับ AI Agents และ Developer โดย:
1. **In-Repo Architecture**: พัฒนาโครงสร้างเว็บคู่มือภายในโปรเจกต์ `nexus-devflow` (เช่น โฟลเดอร์ `website/` หรือ `docs/`) โดยไม่แยก Repository เพื่อรักษา Single Source of Truth และป้องกันปัญหา Document Drift
2. **Modern Docs UX (สไตล์ ai-blueprint.dev)**: เลียนแบบโครงสร้างและฟีเจอร์ระดับพรีเมียมของ `ai-blueprint.dev` (สร้างด้วย Astro / Starlight) ที่มี Responsive Docs Shell, Left Sidebar Nav, Table of Contents, Search Dialog (⌘K), Dark/Light Theme, Code Copying, และ Interactive Callouts
3. **100% Content Adaptation**: แปลงเนื้อหาจาก AI-Blueprint ให้สอดคล้องกับโมเดลและขั้นตอนของ Nexus-DevFlow 2.0 (`00-discover` ถึง `70-release` พร้อม Companion Commands ทั้งหมด)
4. **Zero-Cost GitHub Pages Deployment**: ตั้งค่า GitHub Actions Workflow เพื่อบิลด์และดีพลอยขึ้น `https://<username>.github.io/<repo>/` แบบอัตโนมัติ 100% ฟรี และไม่กระทบต่อขนาดของ Published npm package

---

## 2. ขอบเขตงาน (In-Scope)

### Phase 1: การวางโครงสร้าง Docs Engine (Astro Starlight / Docs Framework)
- สร้างโฟลเดอร์ `website/` (หรือ `docs-site/`) พร้อมโครงสร้าง Astro Starlight ที่มีประสิทธิภาพสูงและโหลดเร็ว
- ตั้งค่า Config (Navigation, Sidebar, Search, Color Palette, Brand Logo/Favicon) ให้มีสไตล์หรูหรา ทันสมัย พรีเมียม
- ตั้งค่า `package.json` root scripts เช่น `npm run docs:dev`, `npm run docs:build`, `npm run docs:preview`

### Phase 2: การจัดทำเนื้อหาคู่มือฉบับสมบูรณ์ (Content Migration & Authoring)
- **Start**:
  - `Getting Started`: แนะนำ DevFlow, การติดตั้งด้วย `npx @jakkrichm/create-nexus-devflow`, และการรันคำสั่งแรก
  - `Existing Codebase Adoption`: คู่มือการนำ `/adopt` ไปใช้งานกับโปรเจกต์ Brownfield ที่มีโค้ดอยู่แล้ว
  - `Project Baseline & Context`: การจัดการ `project-overview.md` และการตั้งค่า context สำหรับ AI
  - `Updating DevFlow`: คู่มือการอัปเกรดและตรวจสอบเวอร์ชัน
- **Workflow & Mainline**:
  - `Core Workflow`: แผนผังวงรอบการทำงาน Linear 8 ขั้นตอน (`00-discover` -> `10-define` -> `20-spec` -> `30-plan` -> `40-implement` -> `50-verify` -> `60-report` -> `70-release`)
  - `Review Gates & Discipline`: กฎเหล็กและการหยุดรอการอนุมัติ
- **Commands & Skills Catalog**:
  - รายละเอียดทุก Mainline Stage (00-70) พร้อมตัวอย่าง Command Arguments และ Generated Artifacts
  - รายละเอียด Companion Commands: `devflow`, `doctor`, `try`, `rollback`, `ci`, `brief`, `autopilot`, `debug`, `prd`, `security-review`, ฯลฯ
- **Quality & Verification**:
  - `Senior QA Verification`: การพิสูจน์ด้วยหลักฐานเชิงประจักษ์ใน `/50-verify`
  - `Findings Ledger`: การทำงานของ State Machine ใน `findings.md`
  - `Interactive HTML Reports`: การสร้างและเปิดดู Standalone HTML Report (`60-report.html`)
  - `Manual Review With Try`: คู่มือทดสอบด้วยมือสำหรับ Stakeholder (`/try`)
- **Reference**:
  - `Multi-AI Adapters`: การทำงานร่วมกันระหว่าง Antigravity, Claude Code, และ OpenAI Codex
  - `File Structure & Artifacts Ledger`: โครงสร้างไฟล์ทั้งหมดของ DevFlow

### Phase 3: การตั้งค่าระบบ Deploy อัตโนมัติ (GitHub Pages CI/CD)
- สร้าง `.github/workflows/deploy-docs.yml` เพื่อ Build และ Deploy ขึ้น GitHub Pages เมื่อมีการ Push เข้า Branch `main`
- ตรวจสอบให้แน่ใจว่า `.npmignore` และ `package.json` files ของ `@jakkrichm/create-nexus-devflow` ไม่รวมโฟลเดอร์ Docs เข้าไปใน npm package

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่แตะต้องโค้ดหลักของ Core Engine และ CLI Installer ใน `packages/create-nexus-devflow/`
- ไม่สร้าง Git Repository ภายนอกแยกต่างหาก
- ไม่ใช้บริการ Hosting แบบมีค่าใช้จ่าย (คงรูปแบบ Static HTML Deploy บน GitHub Pages 100% ฟรี)

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-009`** | `devflow-documentation-website-on-github-pages` | สร้าง Documentation Website สไตล์ ai-blueprint.dev ภายใน Repo ด้วย Astro Starlight พร้อมเนื้อหา DevFlow 2.0 ครบทุกหมวดหมู่ และระบบ Deploy GitHub Pages อัตโนมัติ |

---

## 5. เกณฑ์การยอมรับ (Acceptance Criteria)

1. เว็บไซต์ Docs สามารถรันแบบ Local Dev Server และ Build เป็น Static HTML (`dist/`) ได้สำเร็จ 100% โดยไม่มีข้อผิดพลาด
2. มี UI/UX ที่สวยงาม พรีเมียม รองรับ Responsive, Dark/Light Mode, Search Dialog (⌘K), Sidebar Navigation, และ Table of Contents
3. เนื้อหาคู่มือครอบคลุมทุกหมวดหมู่ (Start, Workflow, Commands 00-70 + Companions, Quality, Reference) ครบถ้วนตามมาตรฐาน DevFlow 2.0
4. มีไฟล์ GitHub Actions Workflow `.github/workflows/deploy-docs.yml` ที่พร้อม Deploy ขึ้น GitHub Pages ทันที
5. ไม่ส่งผลกระทบต่อ `npm run check`, `npm test` และขนาดของ npm package `@jakkrichm/create-nexus-devflow`

---

## 6. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
20-spec RUN-009-devflow-documentation-website-on-github-pages
```
