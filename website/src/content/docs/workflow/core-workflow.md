---
title: Core Workflow Timeline
description: ลำดับขั้นตอนการทำงานแบบ Dual-Track Delivery Model ใน Nexus-DevFlow 2.0
---

import { Card, CardGrid } from '@astrojs/starlight/components';

**Nexus-DevFlow 2.0** นำเสนอกระบวนการส่งมอบงานทางวิศวกรรมแบบ **Dual-Track Delivery Model** ที่ยืดหยุ่นและรัดกุม โดยแบ่งออกเป็น 2 ลู่ทางหลัก:
1. **🏎️ Fast-Track (Blueprint Mode — 4 Steps)**: เน้นความรวดเร็ว ใช้ Single Living Spec (`spec.md`) แผ่นเดียวจบ เหมาะกับ 85% ของงานประจำวัน
2. **🏗️ Deep-Track (Architect Mode — 8 Steps)**: เน้นความรัดกุมรอบคอบ แยกเอกสารตามแต่ละ Stage (`00-70`) เหมาะกับงานสถาปัตยกรรมขนาดใหญ่

---

## 🏎️ Track 1: Fast-Track (Blueprint Mode — 4 ขั้นตอน)

<div class="pipeline-diagram">
  <div class="pipeline-title">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B43BA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    Fast-Track Blueprint Flow (4 Steps)
  </div>
  <div class="pipeline-flow">
    <div class="pipeline-node"><span class="stage-num">01</span><span class="stage-name">/feature or /fix</span></div>
    <div class="pipeline-node"><span class="stage-num">02</span><span class="stage-name">/implement</span></div>
    <div class="pipeline-node"><span class="stage-num">03</span><span class="stage-name">/check</span></div>
    <div class="pipeline-node"><span class="stage-num">04</span><span class="stage-name">/complete</span></div>
  </div>
</div>

* **หัวใจสำคัญ:** ใช้เอกสาร **Single Living Spec (`spec.md`)** ที่ตั้งอยู่ใน `devflow/runs/{RUN_ID}-{slug}/spec.md` ซึ่งจะถูกอัปเดตต่อเนื่องในทุกขั้นตอน ตั้งแต่ตอนเปิดงาน ลงมือโค้ด ตรวจรับรอง ไปจนถึงสรุป Release
* **ขั้นตอน:**
  1. **`/feature <title>` (หรือ `/fix <bug>`)**: รวบรวม Discovery, Scope, Acceptance Criteria, และ Plan Checklists เข้าเป็น `spec.md` พร้อมจัดสรร RUN ID
  2. **`/implement`**: พัฒนาโค้ดตาม Task Checklist ทีละส่วนด้วยวินัย TDD และบันทึก Log ลง `spec.md`
  3. **`/check`**: Senior QA ตรวจรับรอง Multi-lane verification (Typecheck, Lint, Tests, Proof) บันทึกหลักฐานลง `spec.md`
  4. **`/complete`**: Final Safety Pass, สรุป Release Digest ลง `spec.md`, ทำ Git Merge และปิดรอบอย่างปลอดภัย

---

## 🏗️ Track 2: Deep-Track (Architect Mode — 8 ขั้นตอน)

<div class="pipeline-diagram">
  <div class="pipeline-title">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    Deep-Track Architect Mainline (00 -> 70)
  </div>
  <div class="pipeline-flow">
    <div class="pipeline-node"><span class="stage-num">00</span><span class="stage-name">discover</span></div>
    <div class="pipeline-node"><span class="stage-num">10</span><span class="stage-name">define</span></div>
    <div class="pipeline-node"><span class="stage-num">20</span><span class="stage-name">spec</span></div>
    <div class="pipeline-node"><span class="stage-num">30</span><span class="stage-name">plan</span></div>
    <div class="pipeline-node"><span class="stage-num">40</span><span class="stage-name">execute</span></div>
    <div class="pipeline-node"><span class="stage-num">50</span><span class="stage-name">verify</span></div>
    <div class="pipeline-node"><span class="stage-num">60</span><span class="stage-name">report</span></div>
    <div class="pipeline-node"><span class="stage-num">70</span><span class="stage-name">release</span></div>
  </div>
</div>

:::tip[กฎเหล็ก Mainline Disciplines]
1. **Linear Progression**: เดินหน้าตามลำดับตัวเลขเท่านั้น ห้ามกระโดดข้ามขั้นตอน
2. **Markdown-First Contracts**: ทุกขั้นตอนต้องบันทึกสถานะลงไฟล์ Markdown ใน `devflow/` เสมอ
3. **Strict Review Gates**: หยุดรอการยืนยันจากมนุษย์ก่อนข้ามสู่ขั้นตอนถัดไปที่มีผลกระทบต่อโค้ด
:::

---

## เจาะลึก Deep-Track ทั้ง 8 ขั้นตอน (Stage Deep-Dive)

### 🔵 Stage 00: Discover (สำรวจและประเมินความเป็นไปได้)

ขั้นตอนแรกสุดสำหรับการรับเรื่อง สำรวจความต้องการ และวิเคราะห์ทางเลือกเชิงลึก โดยยังไม่มีการจอง Running ID หรือผูกมัดทรัพยากรการพัฒนาใดๆ ทั้งสิ้น

- 🎯 **วัตถุประสงค์ (Purpose & Intent)**:
  - **คัดกรองก่อนเริ่มสร้าง (Pre-delivery Gate)**: ป้องกันไม่ให้ทีมหรือ AI กระโดดไปเขียนโค้ดโดยที่ยังไม่เข้าใจปัญหา หรือยังไม่มีหลักฐานทางเทคนิครองรับ
  - **การแยก Namespace (ID Isolation)**: สร้าง `Discovery ID` (เช่น `DISC-YYYYMMDD-NNN-{slug}`) แยกจาก `Running ID` (`RUN-xxx`) เพื่อไม่ให้เปลือง Running ID หากไอเดียถูก Reject หรือ Defer
- 📥 **ข้อมูลนำเข้าและบริบท (Inputs & Context)**:
  - คำขอของผู้ใช้ (User Prompt / Feature Request / Bug Symptom) หรือไอเดียจาก `devflow/ideas.md`
  - บริบทของระบบปัจจุบันจาก `devflow/context/project-overview.md` และ `devflow/context/coding-standards.md`
- ⚙️ **เส้นทางสืบค้นและกระบวนการทำงาน (Supporting Route Selection)**:
  - 💡 **`Brainstorm`**: ใช้เมื่อมีหลายแนวทางที่เป็นไปได้ (Trade-off Analysis) ต้องการเปรียบเทียบข้อดี-ข้อเสีย
  - 📋 **`PRD`**: ใช้เมื่อต้องการตีกรอบคุณค่าทางธุรกิจ (Business Value), กำหนดขอบเขต MVP และตัวชี้วัดความสำเร็จ
  - 🔬 **`Research`**: ใช้เมื่อขาดข้อเท็จจริง ค้นหาข้อมูลเชิงลึกจาก Codebase เดิม หรือศึกษา Library/API ภายนอก
  - 🐞 **`Debug`**: ใช้เมื่อคำขอเริ่มจากอาการบั๊ก พัง หรือ Regression เพื่อสืบสวนหา Root Cause Analysis (RCA) ก่อน
  - ⚡ **`Direct Decision`**: ใช้เมื่อความต้องการและหลักฐานทางเทคนิคมีความชัดเจนครบถ้วนอยู่แล้ว
- 📄 **ผลลัพธ์ที่สร้างขึ้น (Deliverable Artifacts)**:
  - บันทึกลงใน: `devflow/discoveries/DISC-YYYYMMDD-NNN-{slug}/00-discover.md` (ใช้ภาษาไทย `th` เป็นค่าเริ่มต้น)
- 🚪 **เกณฑ์การตัดสินใจและการผ่านด่าน (Decision & Review Gate)**:
  - 🟢 **`Proceed`**: มีคุณค่าและหลักฐานชัดเจน พร้อมจัดสรรเป็นชิ้นงานส่งมอบ
  - 🟡 **`Defer`**: ไอเดียมีประโยชน์แต่ยังไม่ถึงเวลา หรือรอความพร้อมของระบบ
  - 🔴 **`Reject`**: ไอเดียไม่ตรงเป้าหมาย หรือไม่คุ้มค่าทางสถาปัตยกรรม (ยุติงานทันทีโดยไม่สร้าง Run)

---

### 🟣 Stage 10: Define (กำหนดขอบเขตและจัดสรร Running ID)

เปลี่ยนผลการสำรวจที่ได้รับอนุมัติให้กลายเป็นชิ้นงานส่งมอบ (Delivery Runs) ที่มีขอบเขตกระชับและชัดเจน

- 🎯 **วัตถุประสงค์ (Purpose & Intent)**:
  จัดสรร Running ID ประจำรอบการพัฒนา (เช่น `RUN-010-...`) และแบ่งแยก In-Scope ออกจาก Out-of-Scope อย่างเด็ดขาด
- 📥 **ข้อมูลนำเข้าและบริบท (Inputs & Context)**:
  เอกสาร `00-discover.md` ที่ได้รับการอนุมัติ และประวัติ Run ที่มีอยู่เดิมใน `devflow/runs/`
- 📄 **ผลลัพธ์ที่สร้างขึ้น (Deliverable Artifacts)**:
  - `devflow/runs/{RUN_ID}-{slug}/10-define.md`
  - อัปเดตลิงก์ในเอกสารต้นทาง `00-discover.md`

---

### 🟡 Stage 20: Spec (ร่างสัญญาข้อกำหนดและเกณฑ์การยอมรับ)

แปลงนิยามขอบเขตงานให้เป็นข้อกำหนดทางเทคนิค (Technical Specification) และสัญญาความสมบูรณ์ที่ทดสอบได้จริง

- 🎯 **วัตถุประสงค์ (Purpose & Intent)**:
  สร้างสัญญาการส่งมอบ (Delivery Contract) ที่ชัดเจนเพื่อให้นักพัฒนาและ AI ทราบเงื่อนไข "Done-Whens" โดยไม่ต้องคาดเดาเจตนา
- 📄 **ผลลัพธ์ที่สร้างขึ้น (Deliverable Artifacts)**:
  - `devflow/runs/{RUN_ID}-{slug}/20-spec.md`

---

### 🟠 Stage 30: Plan (วางแผนแตก Tasks และตัดสินใจเรื่อง Test)

แปลงข้อกำหนดจาก Spec ให้เป็นขั้นตอนย่อยที่สามารถลงมือทำและตรวจสอบผลได้ทีละขั้น

- 🎯 **วัตถุประสงค์ (Purpose & Intent)**:
  วางลำดับการแก้ไฟล์ กำหนด Dependency ของงาน และบังคับใช้ระเบียบวินัยการทดสอบ (Test Decisions)
- 📄 **ผลลัพธ์ที่สร้างขึ้น (Deliverable Artifacts)**:
  - `devflow/runs/{RUN_ID}-{slug}/30-plan.md`
  - `devflow/runs/{RUN_ID}-{slug}/checklists/implementation-checklist.md`
  - `devflow/runs/{RUN_ID}-{slug}/checklists/verification-checklist.md`

---

### 🟢 Stage 40: Execute (ลงมือพัฒนาโค้ดและเขียน Unit Test)

ขั้นตอนการแก้ไขโค้ดจริงตามแผนงานที่ได้รับอนุมัติ โดยเน้นความประณีตและการทำตามแนวทาง TDD

- 🎯 **วัตถุประสงค์ (Purpose & Intent)**:
  เขียนโค้ดตามแผนงานทีละ Subtask พร้อมเขียน Unit Test กำกับ เพื่อให้โค้ดทำงานได้ถูกต้องตาม Spec
- ⚙️ **กระบวนการทำงาน (Execution Loop)**:
  - เลือกทำทีละ Subtask (ห้ามแก้ไขไฟล์ทั้งหมดพร้อมกันเป็นก้อนใหญ่)
  - **TDD Red-Green-Refactor**: หากเป็น Subtask ที่เปลี่ยน Behavior ต้องเขียนหรือปรับ Test ให้ครอบคลุมก่อนเสมอ
  - รันการทดสอบและเก็บบันทึกผลลัพธ์ (Evidence) ลงใน Execute Artifact
  - อัปเดต Checklists เมื่อแต่ละงานย่อยเสร็จสิ้น
- 📄 **ผลลัพธ์ที่สร้างขึ้น (Deliverable Artifacts)**:
  - `devflow/runs/{RUN_ID}-{slug}/40-execute.md`
  - โค้ดโปรเจกต์และไฟล์ Unit Tests ที่ถูกแก้ไข/สร้างใหม่
  - อัปเดตสถานะใน `checklists/implementation-checklist.md`

---

### 🔴 Stage 50: Verify (ตรวจสอบคุณภาพระดับ Senior QA)

การตรวจสอบคุณภาพอย่างเข้มงวดหลายมิติ (Multi-Lane Verification) เพื่อพิสูจน์ความถูกต้องก่อนส่งมอบ

- 🎯 **วัตถุประสงค์ (Purpose & Intent)**:
  ทำหน้าที่เป็น Senior QA ตรวจสอบว่าผลงานตรงตาม Spec ครบถ้วน ไม่เกิด Regression และไม่มีช่องโหว่ความปลอดภัย
- ⚙️ **กระบวนการทำงาน (Execution Loop)**:
  - รัน Multi-Lane Verification: Unit Tests, Static Analysis / Linter, Typecheck, Build, และ Security Audits
  - ตรวจสอบ Acceptance Criteria ทุกข้อจาก `20-spec.md` พร้อมแนบหลักฐานการทดสอบจริง
  - หากพบจุดบกพร่อง ให้บันทึกเข้า **Findings Ledger (`findings.md`)** โดยแยก Severity (P0, P1, P2, P3)
  - หากพบปัญหา P0/P1 จะสั่ง **Return to Execute** ทันที และไม่อนุญาตให้ผ่าน
- 📄 **ผลลัพธ์ที่สร้างขึ้น (Deliverable Artifacts)**:
  - `devflow/runs/{RUN_ID}-{slug}/50-verify.md`
  - อัปเดตสถานะใน `devflow/context/findings.md`

---

### 🟤 Stage 60: Report (จัดทำรายงานสรุปผลการส่งมอบ)

สรุปผลการทำงานทั้งหมดในรอบการส่งมอบให้อยู่ในรูปแบบ Markdown Report มาตรฐาน

- 🎯 **วัตถุประสงค์ (Purpose & Intent)**:
  สร้างเอกสารสรุปผลงานระดับบริหารและคู่มือการตรวจรับงานจริงด้วยมือ (Manual Try Guide)
- 📄 **ผลลัพธ์ที่สร้างขึ้น (Deliverable Artifacts)**:
  - `devflow/runs/{RUN_ID}-{slug}/60-report.md` (Markdown Summary)
  - *(หากต้องการ HTML Dashboard สวยงาม สามารถสั่งคำสั่งแยก: `/report:html`)*

---

### 🔘 Stage 70: Release (ปล่อยงาน ผูก Git Commit และบันทึกประวัติ)

ขั้นตอนสุดท้ายในการส่งมอบโค้ดขึ้นระบบ จัดการ Git Branch/Commit และบันทึกประวัติศาสตร์การพัฒนา

- 🎯 **วัตถุประสงค์ (Purpose & Intent)**:
  ปิดรอบการพัฒนาอย่างสมบูรณ์แบบ ทำการผูกมัด Git Commit, จัดการ Changelog, และบันทึกประวัติเข้าสู่ Project History
- 📄 **ผลลัพธ์ที่สร้างขึ้น (Deliverable Artifacts)**:
  - `devflow/runs/{RUN_ID}-{slug}/70-release.md`
  - อัปเดต `devflow/history/HISTORY.md`
  - Git Commit / Tag / Pull Request
