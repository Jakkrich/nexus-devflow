---
id: "026-fast-track-and-flow-icons-extension-ui"
title: "Define: DevFlow IDE Extension - Fast-Track & Flow Icons UI Support"
doc_type: "definition"
stage: "10-define"
created: "2026-08-21"
updated: "2026-08-21"
owner: "Jakkrich & Antigravity"
status: "approved"
artifact_language: "th"
discovery_id: "DISC-20260819-001-devflow-ide-extension"
category: "Feature"
---

# Define: DevFlow IDE Extension - Fast-Track & Flow Icons UI Support

## 1. Executive Summary

กำหนดขอบเขตและเป้าหมายการพัฒนาของ Delivery Run `026-fast-track-and-flow-icons-extension-ui` เพื่อปรับปรุงระบบ DevFlow IDE Extension / QuickPick Menu และ Status Bar ให้รองรับทั้ง **🏎️ Fast-Track (Blueprint Mode - 4 ขั้นตอน)** และ **🏗️ Deep-Track (Architect Mode - 8 ขั้นตอน)** พร้อมทั้งแสดง **Icons ประจำแต่ละ Stage/Flow** อย่างสมบูรณ์

---

## 2. Problem Statement

- **ปัญหาเดิม:** QuickPick Menu (`Select a DevFlow stage to view or execute`) มีแสดงเฉพาะ **Deep-Track** (`00-discover` ถึง `70-release`) ทำให้ผู้ใช้งาน Fast-Track (`/feature`, `/fix`, `/implement`, `/check`, `/complete`) ไม่มีเมนูลัดสำหรับสลับคำสั่งใน IDE
- **ความต้องการ:** เพิ่มหมวดหมู่ Fast-Track ลงใน QuickPick Menu พร้อมจัดกลุ่มหมวดหมู่ (Separators) และเพิ่ม Icons แสดงสถานะประจำ Flow ให้ชัดเจน สวยงาม อ่านง่าย

---

## 3. Delivery Scope

### In-Scope:
1. **Fast-Track Integration:** เพิ่มคำสั่ง Fast-Track (`/feature`, `/fix`, `/implement`, `/check`, `/complete`) เข้าสู่ QuickPick Menu
2. **Icons Design & Mapping:** กำหนดและใส่ Icons ประจำ Stage สำหรับทั้ง Fast-Track (`⚡`, `🐛`, `🔨`, `🧪`, `📦`), Deep-Track (`🔍`, `📌`, `📝`, `📋`, `⚙️`, `🔬`, `📊`, `🚀`) และ Utilities (`🧭`, `🩺`, `💡`)
3. **Menu Categorization:** จัดกลุ่ม QuickPick Items เป็นหมวดหมู่ชัดเจนด้วย Separators
4. **Status Bar Display:** ปรับแต่งการแสดงผล Status Bar Item ให้มี Icon และชื่อ Track/Stage ปัจจุบันอย่างชัดเจน
5. **Documentation & Validation:** อัปเดตเอกสาร `workflow-surface-map.md` และทดสอบความถูกต้องของตารางคำสั่ง

### Out-of-Scope:
- การสร้าง Webview Kanban Board (เลื่อนไปทำใน Slice/Run ถัดไป)

---

## 4. Acceptance Criteria (Given-When-Then)

- **Scenario 1: เรียกเปิด QuickPick Menu ใน IDE**
  - **Given** ผู้ใช้งานกดเปิดเมนู DevFlow Stage ใน IDE
  - **When** เมนู QuickPick แสดงขึ้นมา
  - **Then** จะเห็นหมวดหมู่ `🏎️ Fast-Track (Blueprint Mode)` และ `🏗️ Deep-Track (Architect Mode)` แยกกันอย่างชัดเจน
  - **And** ทุกคำสั่งมี Icon กำกับประจำ Stage

- **Scenario 2: เลือกคำสั่ง Fast-Track จาก QuickPick**
  - **Given** ผู้ใช้งานเลือกคำสั่ง `/feature` หรือ `/implement` จาก Fast-Track
  - **When** กดเลือกรายการ
  - **Then** ระบบจะส่งคำสั่งไปยัง Agent หรือเปลี่ยน Active Context ของ Fast-Track ได้ถูกต้อง

---

## 5. Approval Status

- **Status:** Approved
- **Next Allowed Command:** `/20-spec`
