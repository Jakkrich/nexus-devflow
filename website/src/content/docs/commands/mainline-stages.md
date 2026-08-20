---
title: Mainline Stages & Fast-Track Commands
description: คู่มือการใช้งานและคำสั่งของ Fast-Track (4 Steps) และ Deep-Track (8 Stages) ใน Nexus-DevFlow 2.0
---

import { Card, CardGrid } from '@astrojs/starlight/components';

Nexus-DevFlow 2.0 รองรับ **Dual-Track Delivery Model** เพื่อให้ทีมเลือกความเร็วและความรัดกุมที่เหมาะสมกับลักษณะงาน:

---

## 🏎️ Fast-Track Commands (Blueprint Mode — 4 Steps)

Fast-Track เป็นลู่ทางความเร็วสูงสำหรับ **85% ของงานประจำวัน** ขับเคลื่อนด้วย **Single Living Spec (`spec.md`)** แผ่นเดียวจบ:

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

| คำสั่ง (Canonical Name) | Invocation (`/` or `$`) | หน้าที่และการทำงาน |
| :--- | :--- | :--- |
| **`feature`** | `/feature <title>`<br>`/feature IDEA-xxx`<br>`$feature` | **เปิดงานพัฒนาฟีเจอร์ใหม่**<br>รวบ Discovery + Spec + Plan checkist เข้าเป็น `spec.md` พร้อมจัดสรร RUN ID |
| **`fix`** | `/fix <bug description>`<br>`/fix IDEA-xxx`<br>`$fix` | **เปิดงานแก้ไขบั๊ก / Hotfix**<br>วิเคราะห์ Root Cause และสร้าง `spec.md` สำหรับบั๊กฟิกซ์โดยเฉพาะ |
| **`implement`** | `/implement`<br>`/implement {RUN_ID}`<br>`$implement` | **ลงมือพัฒนาโค้ดตาม Checklist**<br>ทำทีละ Subtask ด้วยวินัย TDD และบันทึก Log ความคืบหน้าลงใน `spec.md` |
| **`check`** | `/check`<br>`/check {RUN_ID}`<br>`$check` | **Senior QA & Multi-Lane Verification**<br>รัน Typecheck, Linter, Test Suites และ Manual Proof พร้อมบันทึกหลักฐานลง `spec.md` |
| **`complete`** | `/complete`<br>`/complete {RUN_ID}`<br>`$complete` | **Final Safety Pass & Release Digest**<br>สรุป Release Digest ลง `spec.md`, ทำ Git Merge และปิด Run อย่างปลอดภัย |

---

## 🏗️ Deep-Track Stages (Architect Mode — 8 Stages)

Deep-Track เป็นลู่ทางสำหรับ **งานสถาปัตยกรรมใหญ่ งานเสี่ยงสูง หรืองาน Database Migration** แยกเอกสาร Stage (`00-70`) ชัดเจน:

```text
00-discover ──▶ 10-define ──▶ 20-spec ──▶ 30-plan ──▶ 40-execute ──▶ 50-verify ──▶ 60-report ──▶ 70-release
```

---

### 1. `00-discover`
สำรวจคำขอใหม่ วิเคราะห์ความคุ้มค่าและความเป็นไปได้ทางเทคนิค คัดเลือกเส้นทางการสืบค้น (Supporting Route) และตัดสินใจว่าจะเริ่มจัดสรรรอบการพัฒนาหรือไม่ **โดยยังไม่มีการจัดสรร Running ID**

- **รูปแบบคำสั่ง (Universal Invocation)**:
  ```bash
  /00-discover {หัวข้อหรือคำอธิบายคำขอ}
  /00-discover {discovery-id}
  $00-discover {หัวข้อหรือคำอธิบายคำขอ}
  ```
- **ผลลัพธ์ (Deliverable Artifact)**: `devflow/discoveries/DISC-YYYYMMDD-NNN-{slug}/00-discover.md`

---

### 2. `10-define`
แปลงการสำรวจที่ได้รับการอนุมัติให้กลายเป็นชิ้นงานส่งมอบ (Delivery Slices) ที่มีขอบเขตกระชับ ชัดเจน ตีกรอบ In-Scope และ Out-of-Scope และ**เป็นจุดเริ่มต้นแรกในการจัดสรร Running ID (`RUN-xxx`)**

- **รูปแบบคำสั่ง (Universal Invocation)**:
  ```bash
  /10-define {discovery-id}
  /10-define {running-id}
  $10-define {discovery-id}
  ```
- **ผลลัพธ์ (Deliverable Artifact)**: `devflow/runs/{RUN_ID}-{slug}/10-define.md`

---

### 3. `20-spec`
ร่างสัญญาข้อกำหนดทางเทคนิค (Technical Specification) และ Acceptance Criteria ที่ตรวจสอบได้จริง เป็นเกณฑ์ชี้ขาดว่างานเสร็จสมบูรณ์เมื่อใด (Done-Whens)

- **รูปแบบคำสั่ง (Universal Invocation)**:
  ```bash
  /20-spec {running-id}
  $20-spec {running-id}
  ```
- **ผลลัพธ์ (Deliverable Artifact)**: `devflow/runs/{RUN_ID}-{slug}/20-spec.md`

---

### 4. `30-plan`
แปลงข้อกำหนดจาก Spec ให้เป็นขั้นตอนย่อยที่สามารถลงมือทำและตรวจสอบผลได้ทีละขั้น (Ordered Phases & Subtasks) พร้อมกำหนดการตัดสินใจด้านการทดสอบ (Test Decisions)

- **รูปแบบคำสั่ง (Universal Invocation)**:
  ```bash
  /30-plan {running-id}
  $30-plan {running-id}
  ```
- **ผลลัพธ์ (Deliverable Artifacts)**: `devflow/runs/{RUN_ID}-{slug}/30-plan.md` และ Checklists

---

### 5. `40-execute`
ลงมือแก้ไขโค้ดจริงตามแผนงานทีละ Subtask พร้อมเขียน Unit Test กำกับอย่างเคร่งครัดตามแนวทาง Test-Driven Development (Red-Green-Refactor)

- **รูปแบบคำสั่ง (Universal Invocation)**:
  ```bash
  /40-execute {running-id}
  $40-execute {running-id}
  ```
- **ผลลัพธ์ (Deliverable Artifacts)**: `devflow/runs/{RUN_ID}-{slug}/40-execute.md`

---

### 6. `50-verify`
การตรวจสอบคุณภาพเชิงลึกระดับ Senior QA ผ่านการทดสอบหลายมิติ (Multi-Lane Verification) ทั้งด้านฟังก์ชัน ความปลอดภัย ประสิทธิภาพ และการจัดการสมุดบัญชีข้อบกพร่อง (Findings Ledger)

- **รูปแบบคำสั่ง (Universal Invocation)**:
  ```bash
  /50-verify {running-id}
  $50-verify {running-id}
  ```
- **ผลลัพธ์ (Deliverable Artifacts)**: `devflow/runs/{RUN_ID}-{slug}/50-verify.md` และอัปเดต `devflow/context/findings.md`

---

### 7. `60-report`
จัดทำรายงานสรุปผลการพัฒนาฉบับสมบูรณ์ในรูปแบบ Markdown Summary Report

- **รูปแบบคำสั่ง (Universal Invocation)**:
  ```bash
  /60-report {running-id}
  $60-report {running-id}
  ```
- **ผลลัพธ์ (Deliverable Artifacts)**: `devflow/runs/{RUN_ID}-{slug}/60-report.md`

---

### 8. `70-release`
ปิดรอบการส่งมอบงาน บรรจุแพ็กเกจ จัดการ Git Commit & Merge PR, อัปเดต Changelog และบันทึกประวัติการส่งมอบลงใน `HISTORY.md`

- **รูปแบบคำสั่ง (Universal Invocation)**:
  ```bash
  /70-release {running-id}
  $70-release {running-id}
  ```
- **ผลลัพธ์ (Deliverable Artifacts)**: `devflow/runs/{RUN_ID}-{slug}/70-release.md` และอัปเดต `devflow/history/HISTORY.md`

---

## 💡 Companion & Router Commands

| คำสั่ง | รูปแบบการเรียกใช้ | หน้าที่และการทำงาน |
| :--- | :--- | :--- |
| **`devflow`** | `/devflow` หรือ `$devflow` | **Flagship Interactive Router & State Inspector**<br>ตรวจสอบสถานะ Workspace และแนะนำคำสั่งถัดไปอัตโนมัติ |
| **`idea`** | `/idea "<ข้อความไอเดีย>"` | **Idea Quick Capture & AI Enrichment**<br>จดไอเดียด่วนพร้อม AI ช่วยวิเคราะห์ Feasibility และบันทึกลง `devflow/ideas.md` |
| **`report-html`** | `/report:html`<br>`/report:html {RUN_ID}` | **Standalone Interactive HTML Dashboard**<br>สร้าง Dashboard สวยงามเปิดบนเบราว์เซอร์ได้ทันที |
| **`onboard`** | `/onboard` | ตั้งค่าและวิเคราะห์ Stack ครั้งแรกบนโปรเจกต์ใหม่ |
| **`adopt`** | `/adopt` | ติดตั้ง DevFlow เข้ากับระบบเดิมที่มีโค้ดอยู่แล้ว (Brownfield) |
| **`doctor`** | `/doctor` | ตรวจสุขภาพและเช็คความสมบูรณ์ของ Adapters และ Framework |
| **`rollback`** | `/rollback` | วางแผนย้อนคืนฟีเจอร์อย่างปลอดภัยพร้อมวิเคราะห์ความเสี่ยง Git Commit |
