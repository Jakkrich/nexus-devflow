# 🧭 [DISC-20260826-003] การสำรวจและประเมินการซิงก์ Upstream AI Blueprint (v0.13.0 – v0.14.0)

> **Discovery ID**: `DISC-20260826-003`  
> **Topic**: Upstream AI Blueprint Synchronization & Feature Alignment (v0.13.0 – v0.14.0)  
> **Date**: 2026-08-26  
> **Status**: `Proceed` *(พร้อมเข้าสู่ขั้นตอนนิยามฟีเจอร์และการปรับใช้ใน Nexus-DevFlow)*  
> **Source**: Upstream Repository (`aiblueprinthq/ai-blueprint` Tags: `v0.13.0`, `v0.14.0`) & Nexus-DevFlow (`v2.6.2`)  
> **Target Scope**: Framework Core, `devflow/config.json`, Continuous Workflow (`/continuous`), Multi-Adapter Selection, Installer & CLI Updates  

---

## 1. Context & Problem Statement

Nexus-DevFlow ได้รับการพัฒนาโดยอ้างอิงและต่อยอดเป็น Super-set เหนือ **AI Blueprint** โดยการซิงก์ครั้งล่าสุดอยู่ที่เวอร์ชัน **v0.12.1** (Commit `a387763` ในฟีเจอร์ `030-sync-upstream-v0121`)

จากการตรวจสอบการเปลี่ยนแปลงล่าสุดใน Upstream Repository (`aiblueprinthq/ai-blueprint`) พบว่ามี 2 เวอร์ชันสำคัญที่ปล่อยออกมา ได้แก่:

1. **AI Blueprint v0.13.0 (2026-08-23)**:
   - **OpenCode Support & Multi-Adapter Checkbox Installer**: เพิ่มการรองรับ OpenCode และเปลี่ยน Interactive Installer เป็น Checkbox-based selection (`@inquirer/checkbox`) เพื่อเลือกหลาย AI Tools พร้อมกันได้ โดย OpenCode สามารถ Reuse `.agents/` หรือ `.claude/` ได้โดยไม่ต้องสร้างโฟลเดอร์ซ้ำซ้อน
   - **Blueprint Visibility Choice ใน `/adopt`**: เพิ่มตัวเลือกให้ผู้ใช้ระบุว่าต้องการ Commit workflow files ลง Git หรือซ่อนเป็น Local-only ผ่าน `.gitignore`
2. **AI Blueprint v0.14.0 (2026-08-25)**:
   - **Deterministic Project Configuration (`blueprint/config.json`)**: เพิ่มระบบตั้งค่า Workflow แบบ Machine-readable สำหรับควบคุม Review Cadence, Checkpoint Commits, Git Branch Prefixes, Verification Strictness, Regular/Continuous Quality Gates (`audit`, `check`, `tryGuide`), และ Continuous Limits
   - **Continuous Mode Workflow (`/continuous` หรือ `$continuous`)**: เพิ่ม Skill การทำงานแบบ Multi-feature Loop อัตโนมัติในเครื่อง Local รันฟีเจอร์ใน `build-plan.md` ต่อเนื่องทีละฟีเจอร์ ผ่าน Branch แยก ➔ Step Checkpoints ➔ Quality Gates ➔ Squash-merge ลง Main Local โดยไม่ Push หรือ Deploy
   - **System-wide Configuration Awareness**: ปรับปรุง Skill ต่างๆ (`doctor`, `status`, `feature`, `fix`, `implement`, `check`, `audit`, `complete`, `autopilot`) และ Dashboard ให้ตระหนักรู้และอ่านค่าจาก `config.json`

เป้าหมายของ Discovery นี้คือ **วิเคราะห์ผลกระทบ, วางแผน Port & Adapt ฟีเจอร์เหล่านี้เข้าสู่ Nexus-DevFlow 2.6.2** โดยยังคงรักษาเอกลักษณ์ของ **The 3-Pillars Model & Single Living Spec** และมาตรฐานภาษาไทยไว้อย่างสมบูรณ์

---

## 2. Supporting Routes & Built-in Lenses

### 🔬 Lens 1: Research & Empirical Proof Lens (ผลการสำรวจและเปรียบเทียบโค้ด)

จากการสำรวจความแตกต่างระหว่าง Upstream `ai-blueprint` (`d:\devtools\ai-blueprint`) และ `nexus-devflow` (`d:\devtools\nexus-devflow`):

#### ก. การเปลี่ยนแปลงในฝั่ง Package Library (`packages/create-ai-blueprint/lib/`)
- **ไฟล์ใหม่ `project-config.ts` (11.8 KB)**:
  - นิยาม `ProjectConfig` Interface (`workflow`, `git`, `verification`, `qualityGates`, `continuous`)
  - โหลดและ Validate `blueprint/config.json` พร้อม Fallback สู่ค่า Defaults อย่างปลอดภัย
  - ตรวจสอบความถูกต้องของ Schema Version 1
- **การปรับปรุง `status.ts`, `dashboard.ts`, `doctor.ts`, `update.ts`**:
  - เพิ่มการอ่านสถานะ Config (`StatusConfiguration`: path, state: `"defaults" | "invalid" | "project"`, values)
  - เพิ่ม Warning code `invalid_config` เมื่อไฟล์ Config ผิด Schema ซึ่งจะบล็อก mutating skills แต่ยอมให้ read-only status รายงานผลได้
  - ใน Installer (`bin/create-ai-blueprint.ts`) ใช้ Checkbox Prompt สำหรับเลือก Adapters: `codex`, `claude`, `copilot`, `opencode`

#### ข. การเปลี่ยนแปลงในฝั่ง Workflow Skills (`.agents/skills/` และ `.claude/skills/`)
- **Skill ใหม่ `continuous/SKILL.md` (13.6 KB)**:
  - รองรับการทำงานแบบ Serial Multi-Feature Loop
  - ทำงานหลัง Review Safety Preflight ➔ สร้าง Branch ➔ รัน Implement ทีละสเต็ป ➔ รัน Gate (`check` ➔ `audit` ➔ `try`) ➔ ซ่อมแซม Finding P0/P1 อัตโนมัติ (ไม่เกิน `maxRepairAttempts`) ➔ Archive และ Local Squash-Merge ➔ วนลูปฟีเจอร์ถัดไป
  - มี Boundary ที่ปลอดภัย: ไม่ Push, ไม่ Deploy, ไม่ลบ Data, ไม่ Accept Finding แทนมนุษย์
- **การปรับปรุง Skill เดิม**:
  - `adopt/SKILL.md`: เพิ่มขั้นตอน Step 5 "Ask about Blueprint/DevFlow visibility"
  - `doctor/SKILL.md`: ตรวจสอบ `config.json` (Valid JSON, Schema Version 1, Supported Keys) และ Adapter Trees
  - `AGENTS.md`: เพิ่มคำอธิบาย Project Configuration และ Continuous Mode

---

### 📐 Lens 2: PRD & Scoping Lens (การกำหนดขอบเขตงานสำหรับ Nexus-DevFlow)

#### สิ่งที่อยู่ในขอบเขต (In-Scope for Nexus-DevFlow):
1. **`devflow/config.json` Support**:
   - เพิ่มการรองรับ Configuration ภายใต้พาธ `devflow/config.json` (ตามโครงสร้างโฟลเดอร์ของ DevFlow)
   - สร้างโมดูล `packages/create-nexus-devflow/lib/project-config.ts`
   - กำหนด Default Configurations ที่สอดคล้องกับ DevFlow (เช่น Branch prefixes, Step review, Quality gates)
2. **Nexus-DevFlow `/continuous` Skill**:
   - สร้าง Skill `continuous` ในทั้ง `.agents/skills/continuous/SKILL.md` และ `.claude/skills/continuous/SKILL.md`
   - ปรับ Adapt ให้สอดคล้องกับ Single Living Spec Model (`devflow/context/current-feature.md`) และ 3-Pillars Archive (`devflow/history/features/`)
   - รองรับคำสั่ง Canonical และ Prefix Invocations (`/continuous`, `$continuous`, `continuous`)
3. **Multi-Adapter Checkbox Selection & OpenCode Compatibility**:
   - ปรับปรุง CLI Installer `packages/create-nexus-devflow` ให้ใช้ Multi-select Checkbox (รองรับ `antigravity`, `claude`, `codex`, `copilot`, `opencode`)
   - จัดการความเข้ากันได้ของ Shared Adapter Trees
4. **Skill Updates & Visibility Choice in `/adopt`**:
   - อัปเดต `adopt/SKILL.md` ให้มี DevFlow Visibility Selection (Commit vs Local-only `.gitignore`)
   - อัปเดต `doctor/SKILL.md`, `status.ts`, และ `dashboard.ts` ให้แสดงผล Configuration Status และเตือนกรณี Invalid Config
5. **Language & Documentation Alignment**:
   - แปลและจัดทำเอกสารและคำอธิบายเป็นภาษาไทยตามมาตรฐานข้อกำหนด DevFlow

#### สิ่งที่อยู่นอกขอบเขต (Out-of-Scope):
- การเปลี่ยนโครงสร้างหลักของ 3-Pillars Architecture หรือการยุบ Single Living Spec
- การแตะต้องส่วนขยายที่ไม่เกี่ยวข้อง เช่น DevFlow MCP Server หรือ External Studio Webview

---

### ⚖️ Lens 3: Brainstorming Lens & Trade-off Comparison Table

| ทางเลือก (Options) | ข้อดี (Pros) | ข้อเสีย / ความเสี่ยง (Cons) | คำแนะนำ (Recommendation) |
| :--- | :--- | :--- | :--- |
| **Option A: Tailored Adaptation (ปรับแต่งให้เข้ากับ DevFlow 3-Pillars อย่างลงตัว)** *(แนะนำ)* | • ได้ฟังก์ชันล่าสุดจาก Upstream ทั้งหมด (Config, Continuous, OpenCode)<br>• สอดคล้องกับพาธ `devflow/`<br>• คง Living Spec และภาษาไทย 100% | ต้องปรับ path และ prompt ให้เข้ากับสถาปัตยกรรมของ DevFlow | **แนะนำอย่างยิ่ง (Recommended)** |
| **Option B: Direct Raw Copy (คัดลอกโค้ด Upstream มาตรงๆ)** | รวดเร็วในการคัดลอก | เกิดความขัดแย้งของพาธ (`blueprint/` vs `devflow/`), ขัดกับ Living Spec Model และผิดระเบียบภาษาไทย | **ไม่แนะนำ (Rejected)** |
| **Option C: Defer (ชะลอการซิงก์)** | ไม่ต้องเขียนโค้ดเพิ่มในรอบนี้ | ขาดฟีเจอร์สำคัญอย่าง `config.json` และ `/continuous` ซึ่งเป็นแกนหลักใหม่ของ Upstream | **ไม่แนะนำ (Rejected)** |

---

### 🐛 Lens 4: Issue & Conflict Triage Lens (การวิเคราะห์ความขัดแย้งและจุดที่ต้องระวัง)

1. **Path Namespace Discrepancy**:
   - Upstream ใช้ `blueprint/config.json`, `blueprint/context/`, `blueprint/history/`
   - DevFlow ต้องใช้ `devflow/config.json`, `devflow/context/`, `devflow/history/`
   - *แนวทางแก้ปัญหา*: ใน `project-config.ts` ให้ใช้ `devflow/config.json` เป็นค่ามาตรฐานหลัก และรองรับ fallback หากมีการตั้งค่าในสภาพแวดล้อมเฉพาะ
2. **Adapter Discovery Consistency**:
   - DevFlow รองรับ Google Antigravity เพิ่มเติมจาก Upstream (Codex, Claude, Copilot, OpenCode)
   - *แนวทางแก้ปัญหา*: ใน Installer Checkbox ให้มีตัวเลือก `Google Antigravity` ร่วมกับเครื่องมืออื่นๆ ครบทั้ง 5 ตระกูล
3. **Spec Lifecycle Alignment for `/continuous`**:
   - Upstream Continuous mode อิงกับการอัปเดต Checklist และ History archive
   - ใน DevFlow มี Single Living Spec (`current-feature.md`) ที่มี 6 หมวดโครงสร้าง
   - *แนวทางแก้ปัญหา*: ให้ `/continuous` ของ DevFlow อิงการสร้างและ archive `current-feature.md` ตามรอบปกติของ 4-Stage Lifecycle (`feature` ➔ `implement` ➔ `check` ➔ `complete`)

---

### 🏛️ Lens 5: Socratic Alignment & Architecture Decisions (ADR)

#### Architecture Decision: การนำ `devflow/config.json` และ `/continuous` เข้าสู่ Nexus-DevFlow
- **สถานะ**: `Accepted`
- **การตัดสินใจ**:
  1. สร้างไฟล์เริ่มต้น `devflow/config.json` พร้อมค่า Default ที่ปลอดภัย (Review: every, Checkpoints: enabled, Branch prefix: `feature/`, Gates: manual)
  2. เพิ่มความสามารถในการตรวจสอบความถูกต้องของ `config.json` ใน `scripts/validate-framework.ts`, `doctor`, และ `status`
  3. บรรจุ `/continuous` เป็นหนึ่งใน Companion / Autonomous Workflow Skills ของ Nexus-DevFlow
  4. อัปเดต Manifest และ Synchronization Script (`scripts/sync-adapters.js`, `agent-bundle.manifest.json`) เพื่อดูแลความสอดคล้องระหว่าง `.agents/` และ `.claude/`

---

## 3. Decision & Approval Gate

- **Decision**: `Proceed`
- **Rationale**: การเปลี่ยนแปลงใน Upstream v0.13.0 และ v0.14.0 เป็นการยกระดับความยืดหยุ่นและการทำงานแบบอัตโนมัติ (Deterministic Config + Continuous Loop) ซึ่งส่งเสริมขีดความสามารถของ Nexus-DevFlow อย่างมีนัยสำคัญ และสามารถนำมาปรับใช้ได้อย่างกลมกลืนโดยไม่กระทบต่อ Invariants เดิม

---

## 4. Next Workflow Recommendation

หลังจาก Discovery นี้ได้รับการรับรอง สามารถเริ่มวงจรส่งมอบผ่าน 4-Stage Lifecycle ได้ทันที:

### แผนการแตกฟีเจอร์สำหรับส่งมอบ (Proposed Delivery Plan):

1. **Feature `031-sync-upstream-v0130-v0140-config-and-continuous`**:
   - **Task 1**: พอร์ต `project-config.ts` ลง `packages/create-nexus-devflow/lib/` และสร้าง `devflow/config.json`
   - **Task 2**: เพิ่ม Skill `continuous` ใน `.agents/skills/continuous/` และ `.claude/skills/continuous/`
   - **Task 3**: อัปเดต `adopt/SKILL.md` (Visibility Choice), `doctor/SKILL.md`, และ `AGENTS.md`
   - **Task 4**: ปรับปรุง CLI Installer รองรับ Multi-adapter Checkbox (Antigravity, Claude, Codex, Copilot, OpenCode)
   - **Task 5**: อัปเดต `status.ts`, `dashboard.ts`, `update.ts`, และชุดทดสอบ ยืนยันผลลัพธ์ผ่าน 100%

- **คำสั่งถัดไปที่แนะนำ**:
  ```text
  /feature 031-sync-upstream-v0130-v0140-config-and-continuous
  ```
