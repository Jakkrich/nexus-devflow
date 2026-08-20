---
title: Senior QA Verification (50-verify)
description: กระบวนการตรวจสอบคุณภาพขั้นสูง การพิสูจน์ด้วยหลักฐานเชิงประจักษ์ และ Multi-Lane QA ในสเตจ 50-verify
---

ในการพัฒนาซอฟต์แวร์แบบดั้งเดิม AI มักจะเคลมว่าโค้ดทำงานถูกต้องแล้วเพียงเพราะ "ไม่มี Syntax Error ในสายตาของมัน" ซึ่งนำไปสู่การส่งมอบฟีเจอร์ที่พังใน Runtime หรือทำลายการทำงานของระบบเดิม

**Nexus-DevFlow** กำหนดให้ในสเตจ **`50-verify`** ตัว AI ต้องสลับบทบาท (Persona) จาก Developer ผู้เขียนโค้ด มาเป็น **"Senior QA Engineer ผู้เข้มงวดและไม่ประนีประนอมต่อความผิดพลาด"**

---

## 1. กฎเหล็กว่าด้วยหลักฐานเชิงประจักษ์ (Empirical Evidence)

:::caution[กฎเหล็กข้อบังคับของ 50-verify]
**ห้าม AI สรุปผลว่างาน "ผ่าน (Pass)" โดยปราศจากหลักฐานเชิงประจักษ์ (Empirical Evidence)** ที่บันทึกจากการรันจริงในระบบเป็นอันขาด คำกล่าวอ้างลอยๆ เช่น "ฉันได้ตรวจสอบโค้ดแล้วและทำงานถูกต้อง" ถือเป็นการละเมิดวินัยของ DevFlow
:::

### สิ่งที่นับเป็น Empirical Evidence ที่ยอมรับได้:
- 💻 **Terminal Output จริง**: ข้อความผลการรันจาก Test Runner (เช่น `PASS src/auth/oauth.test.ts (14 tests passed, 0 failed)`)
- 🌐 **HTTP Response & Status Code**: ข้อมูล Body และ Status 200/201 ที่ได้จากการส่ง Request จริงไปยัง API
- 🔍 **Static Analysis & Lint Output**: ผลลัพธ์ `0 errors, 0 warnings` จาก Typechecker (`tsc`) หรือ Linter (`eslint`)
- 🖥️ **DOM State / UI Screenshot Log**: ผลการรัน Headless Browser / Playwright หรือสถานะ Element บนหน้าจอ

---

## 2. การตรวจสอบรอบด้าน 4 มิติ (Multi-Lane Verification)

กระบวนการตรวจรับงานใน `50-verify` จะถูกแบ่งออกเป็น 4 เลนวิศวกรรมหลัก:

<div class="info-stack">
  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">🔹 Lane 1: Functional & Acceptance Verification</div>
      <span class="badge blue">Criteria Matching</span>
    </div>
    <p class="info-card-desc">ตรวจสอบทุกข้อกำหนดใน <code>20-spec.md</code> ทั้งกรณีทำงานปกติ (Happy Path) และขอบเขตข้อผิดพลาด (Edge Cases)</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">🔹 Lane 2: Regression Check & Test Integrity</div>
      <span class="badge green">System Protection</span>
    </div>
    <p class="info-card-desc">รัน Full Test Suites ทั้งระบบ เพื่อป้องกันไม่ให้โค้ดใหม่ทำลายความสามารถเดิมของแอปพลิเคชัน</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">🔹 Lane 3: Security & Standards Audit</div>
      <span class="badge red">OWASP & Policy</span>
    </div>
    <p class="info-card-desc">ตรวจจับช่องโหว่ความปลอดภัย, ห้าม Hardcode Secrets, และบังคับใช้มาตรฐานตาม <code>coding-standards.md</code></p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">🔹 Lane 4: Performance & Code Hygiene</div>
      <span class="badge amber">Cleanliness</span>
    </div>
    <p class="info-card-desc">กำจัด Dead Code, ลบ Console Logs, ป้องกัน N+1 Queries และ Async Waterfalls</p>
  </div>
</div>

### 🔹 Lane 1: Functional Correctness (ความถูกต้องตามสัญญา)
- ตรวจสอบ Acceptance Criteria ทุกข้อที่ระบุไว้ใน `20-spec.md` ทีละข้อ
- ทดสอบทั้ง **Happy Path** (กรณีทำงานปกติ) และ **Edge Cases / Error Cases** (เช่น ค่าว่าง, ข้อมูลผิดประเภท, การ Timeout)

### 🔹 Lane 2: Regression Integrity (ความปลอดภัยของระบบเดิม)
- รันชุดเทสต์ทั้งหมดของโปรเจกต์ (Full Test Suite) ไม่ใช่แค่เทสต์ของไฟล์ที่แก้ใหม่
- มั่นใจว่าฟังก์ชันเดิมที่เคยทำงานได้ ยังคงทำงานได้ 100%

### 🔹 Lane 3: Security & Standards Audit (ความปลอดภัยและมาตรฐาน)
- ตรวจสอบว่าไม่มีการ Hardcode Secrets, API Keys หรือ Password ลงใน Source Code
- ตรวจสอบ SQL Injection, XSS, และการ Bypass สิทธิ์เข้าถึง
- ตรวจสอบการปฏิบัติตาม [`coding-standards.md`](../../start/project-context/)

### 🔹 Lane 4: Performance & Code Hygiene (สุขอนามัยของโค้ด)
- กำจัด `console.log`, `debugger`, หรือโค้ดทดสอบชั่วคราวที่หลงเหลือ
- ตรวจสอบ N+1 Query Problem, Memory Leaks หรือ Async Waterfalls

---

## 3. การวิเคราะห์ผลกระทบวงกว้าง (`50-verify-impact.md`)

สำหรับงานที่มีความซับซ้อนสูงหรือแก้ไขแกนหลักของระบบ (Core Shared Modules, Database Schemas, Auth Layers) สเตจ 50 จะสร้างเอกสารวิเคราะห์ผลกระทบเพิ่มเติม:

- **Changed Seams**: อินเทอร์เฟซหรือฟังก์ชันส่วนกลางที่มีการเปลี่ยนแปลง Signature
- **Downstream Consumers**: โมดูลอื่นที่เรียกใช้โค้ดส่วนนี้ และความจำเป็นในการ Re-verify
- **Rollback Feasibility**: ความยากง่ายในการ Rollback หากเกิดปัญหาบน Production

---

## 4. ผลการตัดสินใจ (QA Decision Matrix)

เมื่อตรวจสอบครบทั้ง 4 เลน AI จะสรุปผลการตัดสินใจ:

<div class="comparison-grid">
  <div class="comparison-card accent">
    <h4>
      <span>✅ ผลการตัดสินใจ: <code>Pass</code></span>
      <span class="badge green">อนุมัติผ่านงาน</span>
    </h4>
    <p><strong>เงื่อนไขความสำเร็จ:</strong></p>
    <ul>
      <li>ทุก Acceptance Criteria ผ่านครบถ้วน 100%</li>
      <li>Full Regression Test Suite ผ่านทั้งหมด</li>
      <li>ไม่มี Finding ระดับ <code>P0</code> หรือ <code>P1</code> ค้างอยู่ใน <code>findings.md</code></li>
    </ul>
    <p style="margin-top: 1rem; margin-bottom: 0;"><strong>ขั้นตอนถัดไป:</strong> ส่งต่อเข้าสู่สเตจ <code>/60-report &#123;running-id&#125;</code></p>
  </div>

  <div class="comparison-card">
    <h4>
      <span>❌ ผลการตัดสินใจ: <code>Return to Implement</code></span>
      <span class="badge red">ส่งกลับไปแก้ไข</span>
    </h4>
    <p><strong>เงื่อนไขที่ต้องแก้ไข:</strong></p>
    <ul>
      <li>พบ Regression Test พัง หรือโค้ดเดิมทำงานผิดพลาด</li>
      <li>ไม่ผ่าน Acceptance Criteria บางข้อตามที่ระบุใน Spec</li>
      <li>พบข้อบกพร่องใหม่ระดับ <code>P0</code> หรือ <code>P1</code></li>
    </ul>
    <p style="margin-top: 1rem; margin-bottom: 0;"><strong>ขั้นตอนถัดไป:</strong> ส่งกลับไปแก้ไขใน <code>/40-execute &#123;running-id&#125;</code> พร้อมแนบ Log หลักฐาน</p>
  </div>
</div>

---

## ตัวอย่าง Artifacts ที่สร้างในสเตจ 50

- `devflow/runs/{ID}-{slug}/50-verify.md` (รายงานผลการตรวจรับงานฉบับละเอียด)
- `devflow/runs/{ID}-{slug}/50-verify-impact.md` (รายงานวิเคราะห์ผลกระทบ - ถ้ามี)
- อัปเดต `devflow/context/findings.md` (หากพบข้อบกพร่องใหม่)
