---
id: "026-fast-track-and-flow-icons-extension-ui"
title: "Spec: DevFlow IDE Extension - Fast-Track & Flow Icons UI Support"
doc_type: "specification"
stage: "20-spec"
created: "2026-08-21"
updated: "2026-08-21"
owner: "Jakkrich & Antigravity"
status: "approved"
artifact_language: "th"
source_definition: "devflow/context/current-run/10-define.md"
category: "Feature"
---

# Spec: DevFlow IDE Extension - Fast-Track & Flow Icons UI Support

## 1. Executive Summary

เอกสารข้อกำหนดคุณสมบัติ (Specification) สำหรับ Delivery Run `026-fast-track-and-flow-icons-extension-ui` เพื่อปรับแต่งและยกระดับอินเทอร์เฟซของ DevFlow IDE Extension ในจุด QuickPick Stage Menu และ Status Bar Item ให้รองรับทั้ง **🏎️ Fast-Track (Blueprint Mode - 4 ขั้นตอน)** และ **🏗️ Deep-Track (Architect Mode - 8 ขั้นตอน)** พร้อมทั้งกำหนดระบบ Icons มาตรฐานประจำแต่ละ Stage/Flow

---

## 2. Functional Requirements

### FR-1: Fast-Track QuickPick Integration
- เมนู QuickPick ต้องแสดงคำสั่งในหมวดหมู่ **Fast-Track (Blueprint Mode)** ได้แก่:
  - `⚡ /feature` (Spec & Plan unified)
  - `🐛 /fix` (Ad-hoc bug repairs)
  - `🔨 /implement` (TDD Task Execution)
  - `🧪 /check` (Senior QA Verification Matrix)
  - `📦 /complete` (Safety Pass & Archive)

### FR-2: Deep-Track QuickPick Integration
- เมนู QuickPick ต้องแสดงคำสั่งในหมวดหมู่ **Deep-Track (Architect Mode)** ได้แก่:
  - `🔍 00 - Discover` (`/00-discover`)
  - `📌 10 - Define` (`/10-define`)
  - `📝 20 - Spec` (`/20-spec`)
  - `📋 30 - Plan` (`/30-plan`)
  - `⚙️ 40 - Execute` (`/40-execute`)
  - `🔬 50 - Verify` (`/50-verify`)
  - `📊 60 - Report` (`/60-report`)
  - `🚀 70 - Release` (`/70-release`)

### FR-3: Companion Tools & Utilities Menu
- เมนู QuickPick ต้องแสดงคำสั่งในหมวดหมู่ **DevFlow Utilities**:
  - `🧭 /devflow` (Interactive guide & state inspector)
  - `🩺 /doctor` (Health check & setup diagnostics)
  - `💡 /idea` (Capture idea inbox)

### FR-4: Stage Icons & Mapping Contract
- ทุกคำสั่งใน QuickPick และ Status Bar ต้องใช้ Icon มาตรฐานดังนี้:
  - Fast-Track: `⚡`, `🐛`, `🔨`, `🧪`, `📦`
  - Deep-Track: `🔍`, `📌`, `📝`, `📋`, `⚙️`, `🔬`, `📊`, `🚀`
  - Utilities: `🧭`, `🩺`, `💡`

### FR-5: Status Bar Indicator & Dynamic Context Sync
- Status Bar Item ต้องซิงก์สถานะกับ `devflow/context/current-stage.md` หรือ `devflow/context/current-feature.md`:
  - เมื่ออยู่ Fast-Track Mode: แสดง `🏎️ DevFlow: [{ID}] /{command}`
  - เมื่ออยู่ Deep-Track Mode: แสดง `🏗️ DevFlow: [{ID}] {stage}`
  - เมื่อเป็น Idle: แสดง `⚡ DevFlow: [Idle] Select Flow`

---

## 3. Acceptance Criteria (Given-When-Then)

### AC-1: Menu Categorization & Visual Separation
- **Given** ผู้ใช้งานเรียกเปิดเมนู DevFlow Stage ใน IDE
- **When** เมนู QuickPick ปรากฏขึ้นมา
- **Then** รายการคำสั่งจะถูกจัดหมวดหมู่โดยมี QuickPick Separators ได้แก่:
  - `🏎️ Fast-Track (Blueprint Mode - 4 Steps)`
  - `🏗️ Deep-Track (Architect Mode - 8 Steps)`
  - `🧰 DevFlow Tools & Utilities`
- **And** ทุกรายการมี Icon ประจำคำสั่งกำกับด้านหน้าอย่างถูกต้อง

### AC-2: Command Execution Handoff
- **Given** ผู้ใช้งานคลิกเลือกรายการคำสั่ง Fast-Track หรือ Deep-Track จาก QuickPick
- **When** กดเลือกรายการ
- **Then** ระบบจะส่ง Slash Command หรือ Dollar Skill คำสั่งนั้นไปรันใน Agent Session ได้ทันที

### AC-3: Status Bar Icon & Dynamic Text Sync
- **Given** ไฟล์สถานะ `devflow/context/current-stage.md` เปลี่ยนแปลงสถานะ
- **When** Status Bar Item อัปเดตการแสดงผล
- **Then** จะแสดงผล Icon ประจำ Track (`🏎️` หรือ `🏗️`) พร้อมชื่อ Stage/Command ล่าสุดได้อย่างถูกต้อง

---

## 4. Hard Constraints

1. **Markdown-First Contract**: ห้ามดัดแปลงโครงสร้างสคีมาใน `devflow/context/current-stage.md` และ `devflow/context/current-feature.md`
2. **Backward Compatibility**: การเพิ่ม Fast-Track ใน QuickPick ต้องไม่กระทบต่อคำสั่ง Deep-Track เดิมที่มีอยู่

---

## 5. Explicit Out-of-Scope Items

- Webview Interactive Kanban Board (จัดเข้าเป็นขอบเขตของ Delivery Run ถัดไป)
- การสลับภาษา UI ในตัว IDE Extension (กำหนดให้ใช้ภาษามาตรฐาน Eng/Thai ตามสเปกปัจจุบัน)

---

## 6. Approval Status

- **Status:** Approved
- **Next Allowed Command:** `/30-plan`
