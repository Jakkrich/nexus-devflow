# Business & Technical Requirement Specification (REQ-20260903-001)

> **Requirement ID**: `REQ-20260903-001-sync-upstream-ai-blueprint`  
> **Source**: Upstream AI Blueprint v1.5.2 (`5b46859`)  
> **Status**: `Parsed & Normalized`  
> **Target Release**: Nexus-DevFlow v2.12.1 / Feature `071`  

---

## 1. Executive Summary (ภาพรวมผู้บริหาร)

การอัปเดตเพื่อซิงก์ความสามารถและมาตรฐานความปลอดภัย Git จาก Upstream AI Blueprint v1.5.2 เข้าสู่ Nexus-DevFlow:
1. **การจัดการ Unborn Repository ใน `/onboard`**: รองรับกรณีที่โปรเจกต์เพิ่งรัน `git init` แต่ยังไม่มี First Commit (Unborn `HEAD`) โดย `/onboard` จะตรวจจับอัตโนมัติ เสนอสร้าง Reviewed Scaffold Initial Commit และตั้ง Default Branch (`main`) ให้พร้อมใช้งานทันทีโดยไม่ให้ผู้ใช้ต้องออกจาก IDE ไปพิมพ์คำสั่ง Git เอง
2. **Setup-Branch Baseline Finalization ใน `/overview`**: รองรับกรณีการ Onboard และวางแผนบน Dedicated Setup Branch (เช่น `feature/devflow-plans`) โดยเมื่ออนุมัติ Baseline Commit จะทำการ commit, fast-forward merge กลับเข้าสู่ `main`, สลับ branch และลบ setup branch ให้เรียบร้อยแบบ Local-Only
3. **Dedicated E2E Automated Scenario (`unborn-onboarding.ts`)**: ชุดทดสอบ Agentic E2E ตรวจสอบพฤติกรรมของ AI Agent ตั้งแต่ Unborn Repo -> Onboarding -> Baseline Fast-Forward

---

## 2. Target Persona & User Stories

| Persona | Problem Statement | Desired Outcome |
| :--- | :--- | :--- |
| **New Project Developer** | Scaffold โปรเจกต์ใหม่และรัน `git init` แต่ยังไม่ได้ commit พอรัน `/onboard` AI มัก error หรือสับสนเรื่อง branch | `/onboard` ตรวจจับสถานะ unborn repository และช่วยสร้าง scaffold commit แรกให้อัตโนมัติหลังกดอนุมัติ |
| **Branch-Isolated Developer** | ต้องการวางแผน DevFlow บน setup branch ชั่วคราวก่อนเริ่มฟีเจอร์แรก | `/overview` อนุมัติ Baseline แล้วรวมกลับเข้า `main` แบบ Fast-Forward และลบ branch ชั่วคราวให้อัตโนมัติ |
| **DevFlow Maintainer** | ต้องการให้ Nexus-DevFlow มี Feature & Safety Parity 100% กับ Upstream AI Blueprint | มีชุดทดสอบ E2E scenario และ static contracts รองรับ |

---

## 3. Functional Requirements (FR)

### FR-1: Unborn Git Pre-flight & Scaffold Initial Commit (`/onboard`)
- **FR-1.1**: เมื่อเริ่มทำงาน `/onboard` (Step 0) ต้องตรวจสอบ `git rev-parse --is-inside-work-tree` และ `git rev-parse --verify HEAD`
- **FR-1.2**: หากไม่มี `HEAD` (Unborn repository):
  - กรอง Candidate Files เฉพาะไฟล์โครงสร้างของ Application (ยกเว้น workflow files เช่น `AGENTS.md`, `CLAUDE.md`, `.agents/`, `.claude/`, `devflow/`)
  - ค้นหา default branch (จาก `main`, `master`, หรือ Git default)
  - ถามยืนยัน 1 ครั้ง: `Create the initial scaffold commit and continue Onboard? (Recommended)`
  - เมื่อได้รับอนุมัติ สร้าง commit `chore: scaffold application` บน default branch และสลับกลับมา setup branch (ถ้ามี) เพื่อ onboard ต่อทันที

### FR-2: Branch-Aware Baseline Finalization (`/overview`)
- **FR-2.1**: ใน `/overview` อนุญาตให้ทำงานบน Default Branch หรือ Dedicated Setup Branch ที่แตกมาจาก Tip ของ Default Branch
- **FR-2.2**: หากรันบน Unborn Repo ให้แจ้งให้ไปรัน `/onboard` ก่อน (ไม่สร้าง root commit ใน overview)
- **FR-2.3**: ปรับ Prompt ข้อความยืนยันเป็น: `Finalize the DevFlow baseline locally? (Recommended)`
- **FR-2.4**: รวม metadata installer `devflow/.state/manifest.json` เข้า Baseline Commit โดยยกเว้น transient state `run.json`
- **FR-2.5**: หากรันบน Setup Branch เมื่ออนุมัติแล้ว จะทำการ:
  1. Commit `chore: establish DevFlow project baseline` บน setup branch
  2. สลับกลับไป default branch (`git checkout main`)
  3. รัน `git merge --ff-only <setup-branch>`
  4. ลบ setup branch ในเครื่อง (`git branch -d <setup-branch>`)
  5. อยู่บนสถานะ clean working tree พร้อมเริ่ม `/feature`

### FR-3: E2E Test Suite Extension (`unborn-onboarding.ts`)
- **FR-3.1**: เพิ่มไฟล์ Scenario `scripts/e2e/scenarios/unborn-onboarding.ts`
- **FR-3.2**: ทดสอบ Full Flow ใน Sandbox: `git init` -> setup branch -> overlay DevFlow -> `/onboard` -> `/overview` -> fast-forward `main`

---

## 4. Non-Functional Requirements (NFR)

1. **Security & Local-Only Guarantee**:
   - ห้ามรัน `git push` ในทุกกรณีของการทำ Baseline Finalization
   - ห้ามรวม Application Source Code ปะปนเข้ากับ Baseline Commit
   - ป้องกัน Secret / Token หลุดเข้า Root Commit โดยตรวจสอบ `.gitignore`
2. **Token & Prompt Efficiency**:
   - การปรับแต่งคำอธิบายและข้อความใน `SKILL.md` ทั้ง `.agents/` และ `.claude/` ต้องคงความกระชับ ไม่เกินงบประมาณตัวอักษร
3. **Adapter Parity**:
   - ทั้ง 5 Adapters (Google Antigravity, Claude Code, OpenAI Codex, GitHub Copilot, OpenCode) ต้องได้รับพฤติกรรมที่เท่าเทียมกัน
