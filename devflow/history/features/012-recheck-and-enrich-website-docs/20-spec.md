# Phase 20: Delivery Specification

- **Running ID**: `RUN-012-recheck-and-enrich-website-docs`
- **Title**: ข้อกำหนดการ Recheck ตรวจสอบ ปรับลำดับเนื้อหา และเสริมคำอธิบายเชิงลึก (Deep Enrichment) ทั้ง 12 หน้าเอกสารบนเว็บไซต์ Documentation
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Documentation & DX Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้เป็นสัญญาข้อกำหนดทางเทคนิค (Delivery Contract) สำหรับรอบการพัฒนา **`RUN-012`** เพื่อ Recheck ตรวจสอบเนื้อหาทั้งหมด, จัดเรียงลำดับหัวข้อใหม่ให้เป็นขั้นตอนที่ชัดเจน และขยายความเนื้อหาอย่างลึกซึ้ง (Deep Enrichment) บนหน้าเว็บ Documentation ทั้ง 12 หน้าที่ระบุ:

1. `start/getting-started.md` (Getting Started)
2. `start/existing-codebase.md` (Existing Codebase /adopt)
3. `start/project-context.md` (Project Context)
4. `start/updating-devflow.md` (Updating DevFlow)
5. `workflow/review-gates.md` (Review Gates & Discipline)
6. `commands/mainline-stages.md` (Mainline Stages 00-70)
7. `quality/senior-qa-verification.md` (Senior QA Verification)
8. `quality/findings-ledger.md` (The Findings Ledger)
9. `quality/manual-review.md` (Manual Review with /try)
10. `quality/interactive-reports.md` (Interactive HTML Reports)
11. `reference/tool-adapters.md` (Multi-AI Adapters)
12. `reference/file-reference.md` (File & Directory Reference)

---

## 2. ข้อกำหนดหลักรายกลุ่ม (Core Functional Requirements)

### REQ-1: หมวดเริ่มต้นและรากฐาน (Start & Foundation - 4 หน้า)
- **R1.1 `start/getting-started.md`**:
  - อธิบายหลักคิด **Overlay Model** (ไม่ใช่ App Starter แต่วางทับเพื่อควบคุมวินัย AI)
  - แนะนำขั้นตอนการติดตั้งผ่าน `npx @jakkrichm/create-nexus-devflow` แบบ Step-by-Step พร้อม Tool Detection
  - อธิบายกระบวนการ Onboard แรกด้วย `/onboard` (หรือ `$onboard`) และ Onboarding Checklist
  - แสดงผังกระบวนการ 8 สเตจ (`00-discover` ถึง `70-release`) พร้อมตัวอย่างคำสั่งเริ่มต้นวงรอบแรก
- **R1.2 `start/existing-codebase.md`**:
  - เปรียบเทียบชัดเจนระหว่าง `/onboard` (โปรเจกต์ใหม่) กับ `/adopt` (โปรเจกต์เดิม Brownfield)
  - อธิบาย 5 ขั้นตอนของ `/adopt`: Repo Survey, Stack Detection, Script & CI Verification, Baseline Findings Record, และ Context Initialization
  - การจัดการกับเทสต์หรือบิลด์ที่พังอยู่ก่อนหน้าโดยไม่ให้กระทบกระบวนการพัฒนาใหม่
- **R1.3 `start/project-context.md`**:
  - อธิบายเจาะลึก 4 ไฟล์หลักใน `devflow/context/`:
    1. `project-overview.md`: Single Source of Truth ของโปรเจกต์
    2. `coding-standards.md`: ข้อกำหนดทางวิศวกรรม สไตล์โค้ด และกฎเหล็กความปลอดภัย
    3. `ai-interaction.md`: กฎและมารยาทในการโต้ตอบและการทำงานร่วมกันระหว่าง AI กับมนุษย์
    4. `current-stage.md`: ตัวติดตามสถานะ Active Run แบบ Realtime
  - แนะนำเทคนิคการป้องกัน **Context Drift** และการอัปเดตไฟล์ Context เมื่อระบบเติบโต
- **R1.4 `start/updating-devflow.md`**:
  - วิธีการตรวจสอบอัปเดตด้วยคำสั่ง `/check-for-updates`
  - แนวทางการอัปเกรดแบบปลอดภัยโดยไม่เขียนทับ Custom Skills หรือ Project Context ที่ผู้ใช้ปรับแต่งไว้
  - การทำ Version Compatibility Check และ Migration Checklist

### REQ-2: หมวดกระบวนการและสเตจหลัก (Workflow & Mainline Stages - 2 หน้า)
- **R2.1 `workflow/review-gates.md`**:
  - อธิบายปรัชญา **Review Gates & Discipline** ว่าทำไม AI ถึงต้องมีด่านตรวจ (ป้องกัน Hallucination, Scope Creep, และ Silent Regressions)
  - เจาะลึก 4 ด่านตรวจหลัก:
    1. **Discovery Gate**: อนุญาตให้สร้าง Running ID เฉพาะเมื่อผลการตัดสินใจเป็น `Proceed` และได้รับอนุมัติ
    2. **Spec & Plan Review Gate**: ตรวจสอบ Acceptance Criteria และ Test Decisions (TDD) ก่อนเริ่มเขียนโค้ด
    3. **QA & Findings Gate**: บังคับใช้ Empirical Evidence และห้ามผ่านหากมี `P0` หรือ `P1` สถานะ `open`
    4. **Release Gate**: บังคับให้มนุษย์อนุมัติก่อนทำ Git Merge, PR หรือ Production Deployment
  - ตารางสรุป "สิ่งที่ AI ทำได้อัตโนมัติ" vs "สิ่งที่ต้องหยุดรอมนุษย์อนุมัติ" (Human-in-the-loop)
- **R2.2 `commands/mainline-stages.md`**:
  - อธิบายวงจรสเตจหลัก 8 ขั้นตอน (`00-discover` ถึง `70-release`) เชิงลึกแบบ Section / Card
  - แต่ละสเตจต้องมีข้อมูลครบ 5 องค์ประกอบ:
    1. **🎯 วัตถุประสงค์ (Purpose & Intent)**
    2. **📥 ข้อมูลนำเข้า (Inputs & Context)**
    3. **⚙️ วงจรการทำงานและบทบาท (Execution Loop & Human/AI Tasks)**
    4. **📄 ผลลัพธ์ที่ส่งมอบ (Deliverable Artifacts)**
    5. **🚪 เกณฑ์การผ่านด่าน (Review Gate Criteria)**

### REQ-3: หมวดคุณภาพและการตรวจสอบ (Quality, Verification & Reports - 4 หน้า)
- **R3.1 `quality/senior-qa-verification.md`**:
  - สวมบทบาท **Senior QA Engineer** ในสเตจ `50-verify`
  - กฎเหล็ก **Empirical Evidence**: ต้องมีหลักฐานจริง เช่น Test Runner Output, Terminal logs, Status Code
  - เจาะลึก **4-Lane Verification**: Functional Correctness, Regression Suites, Standards & Security, Performance & Cleanliness
  - การบันทึก `50-verify-impact.md` สำหรับการวิเคราะห์ผลกระทบวงกว้าง
- **R3.2 `quality/findings-ledger.md`**:
  - โครงสร้างและหลักการของ `devflow/context/findings.md`
  - กฎระดับความรุนแรง:
    - 🔴 **P0 (Blocker)**: ระบบพัง, Crash, ข้อมูลสูญหาย (Block Delivery ทันที)
    - 🟠 **P1 (Critical)**: ฟังก์ชันหลักไม่ทำงาน, Security Vulnerability (Block Delivery)
    - 🟡 **P2 (Major)**: ฟังก์ชันย่อยมีปัญหา, Performance ตก (แนะนำให้แก้ในรอบถัดไป)
    - 🟢 **P3 (Minor)**: Typo, ปรับปรุงคำ, Code Style เล็กน้อย
  - วงจรชีวิต Finding (`open` -> `fixed` -> `closed`) และกระบวนการ Re-verify ก่อน Close
- **R3.3 `quality/manual-review.md`**:
  - ทำไมต้องมีคู่มือการทดสอบด้วยมนุษย์ (`/try`)
  - โครงสร้าง 3 สเต็ปของ Try Guide:
    1. **Where to go**: URL / Path / หน้าจอที่ต้องเปิด
    2. **What to click / input**: ขั้นตอนการกดปุ่มหรือกรอกข้อมูล
    3. **What to expect**: ผลลัพธ์ที่คาดหวังทั้งกรณี Success และ Edge Case
  - ตัวอย่าง Try Guide สำหรับ Web Application, REST API และ CLI Tool
- **R3.4 `quality/interactive-reports.md`**:
  - เจาะลึกรายงานส่งมอบงานแบบ Standalone Single-File HTML (`60-report.html`)
  - ฟีเจอร์ของ Interactive Report: Executive Summary, Visual Metrics Cards, Task Checklist Diff, Multi-Lane QA Evidence, Findings Summary, และ Copy-Paste Review Packets
  - ประโยชน์สำหรับ Product Manager, QA Lead และ Engineering Manager

### REQ-4: หมวดอ้างอิงและเครื่องมือ (Reference & Tool Adapters - 2 หน้า)
- **R4.1 `reference/tool-adapters.md`**:
  - สถาปัตยกรรม Multi-AI Adapters: `.agents/` (Antigravity, Codex) และ `.claude/` (Claude Code)
  - Universal Invocation Syntax: Canonical Name, Slash Prefix (`/`), Dollar Prefix (`$`)
  - การใช้งานร่วมกับ AI Tools อื่นๆ เช่น Cursor, GitHub Copilot, Windsurf ผ่าน `AGENTS.md`
  - การเขียน Custom Skills และ Rules
- **R4.2 `reference/file-reference.md`**:
  - สารานุกรมโครงสร้างไฟล์และโฟลเดอร์ทั้งหมดใน DevFlow อย่างละเอียด
  - ตารางจำแนก: File Path, Category, หน้าที่การใช้งาน, ใครเป็นผู้แก้ไข (AI vs Human), และ Persistent vs Ephemeral Lifecycle

---

## 3. เกณฑ์การยอมรับและการตรวจสอบ (Acceptance Criteria)

- **AC-1**: หน้าเอกสารทั้ง 12 หน้าได้รับการ Recheck และเขียนใหม่อย่างสมบูรณ์ มีเนื้อหาลึกซึ้ง ครบถ้วนตามข้อกำหนด R1.1 - R4.2
- **AC-2**: ทุกหน้าใช้การจัดรูปแบบที่สวยงาม: แบ่ง Section ชัดเจน, มี Code Blocks พร้อม Syntax Highlighting, มี Alerts (`:::note`, `:::tip`, `:::caution`), และมีตารางเปรียบเทียบที่เข้าใจง่าย
- **AC-3**: มีการเชื่อมโยงลิงก์ภายใน (Cross-links) ระหว่างหน้าเอกสารที่เกี่ยวข้องกันอย่างถูกต้อง
- **AC-4**: ไวยากรณ์ภาษาไทยมีความเป็นมืออาชีพ ชัดเจน ถูกต้องตามหลักการสื่อสารทางเทคนิค และทับศัพท์มาตรฐานสากล
- **AC-5**: คำสั่ง build เว็บไซต์ (`npm run docs:build` หรือ `npx astro build`) ทำงานสำเร็จ 100% โดยไม่มี Error หรือ Warning ที่ส่งผลเสีย

---

## 4. ข้อจำกัดทางเทคนิค (Hard Constraints)

- **C-1**: ต้องรักษา Path URL และชื่อไฟล์ markdown เดิมทั้ง 12 ไฟล์ เพื่อป้องกัน Broken Links ในระบบนำทาง
- **C-2**: โครงสร้างไฟล์ทั้งหมดต้องเข้ากันได้กับ Starlight Astro Parser (รองรับ Frontmatter YAML, Markdown, และ Custom Callouts)
- **C-3**: เอกสารทุกหน้าต้องอิงกับสถาปัตยกรรม DevFlow 2.0 ล่าสุด (Linear Mainline 8 สเตจ, Findings Ledger P0-P3, Universal Invocation)

---

## 5. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope)

- ไม่แก้ไขโค้ด Logic ภายใน Package `packages/create-nexus-devflow/`
- ไม่สร้าง URL ใหม่อื่นๆ นอกเหนือจาก 12 URLs ที่ระบุ

---

## 6. คำสั่งถัดไป (Next Workflow Recommendation)

เข้าสู่ขั้นตอนวางแผนงานอย่างเป็นรูปธรรม:

```text
/30-plan RUN-012-recheck-and-enrich-website-docs
```
