---
title: The Findings Ledger
description: การทำงานของระบบสมุดบันทึกคุณภาพ findings.md, กฎความรุนแรง P0-P3, และ State Machine ที่ควบคุมการส่งมอบ
---

ในการพัฒนาด้วย AI แบบทั่วไป ข้อบกพร่องที่ถูกตรวจพบใน Chat มักจะสูญหายเมื่อเริ่ม Session ใหม่ หรือถูกลืมเมื่อผู้ใช้เปลี่ยนหัวข้อการสนทนา

**Nexus-DevFlow** ออกแบบ **The Findings Ledger (`devflow/context/findings.md`)** ขึ้นมาเพื่อเป็น **สมุดบัญชีควบคุมคุณภาพและความปลอดภัยถาวรของโปรเจกต์** ทำหน้าที่เก็บรวบรวมบั๊ก ช่องโหว่ความปลอดภัย และ Technical Debt อย่างมีโครงสร้าง พร้อมระบบ Gate Blocking ที่เข้มงวด

---

## 1. โครงสร้างข้อมูลของ Finding (Durable Structure)

แต่ละรายการใน `findings.md` จะมีรหัสประจำตัวถาวรและข้อมูลแวดล้อมที่ครบถ้วน:

```markdown
### `FND-003`: SQL Injection Vulnerability in User Search Endpoint
- **Severity**: `P0`
- **Status**: `open`
- **Location**: `src/api/users/search.ts:L42`
- **Discovered In**: `RUN-008-user-search` (Stage 50-verify)
- **Description**: พบการใช้ string concatenation แทน parameterized query ในฟังก์ชัน `searchUsers`
- **Remediation**: เปลี่ยนไปใช้ Prisma parameterized query หรือ Query Builder
```

---

## 2. ระดับความรุนแรงและผลกระทบ (Severity Classification)

DevFlow แบ่งระดับความรุนแรงของ Finding ออกเป็น 4 ระดับ (P0 ถึง P3):

<div class="severity-card p0">
  <div class="severity-card-header">
    <div class="severity-card-title">🔴 P0 (Blocker) - วิกฤตสูงสุด</div>
    <span class="badge red">🚨 บล็อกการส่งมอบทันที</span>
  </div>
  <p><strong>ความหมาย & ผลกระทบ:</strong> ระบบ Crash, Data Loss, ข้อมูลสูญหาย, หรือช่องโหว่ความปลอดภัยร้ายแรง</p>
  <p style="margin: 0 !important;"><strong>ตัวอย่างปัญหา:</strong> Remote Code Execution, รหัสผ่านรั่ว, Bypass Authentication, Data Corruption</p>
</div>

<div class="severity-card p1">
  <div class="severity-card-header">
    <div class="severity-card-title">🟠 P1 (Critical) - รุนแรงสูง</div>
    <span class="badge red">🚨 บล็อกการส่งมอบ</span>
  </div>
  <p><strong>ความหมาย & ผลกระทบ:</strong> ฟังก์ชันหลักของธุรกิจไม่ทำงาน หรือไม่ผ่าน Acceptance Criteria ใน Spec</p>
  <p style="margin: 0 !important;"><strong>ตัวอย่างปัญหา:</strong> ระบบตัดเงินล้มเหลว, Token Auth ไม่ Validate, ปุ่ม Save ใช้งานไม่ได้</p>
</div>

<div class="severity-card p2">
  <div class="severity-card-header">
    <div class="severity-card-title">🟡 P2 (Major) - ปานกลาง</div>
    <span class="badge amber">⚠️ บันทึกแผนซ่อมใน Run ถัดไป</span>
  </div>
  <p><strong>ความหมาย & ผลกระทบ:</strong> ฟังก์ชันรองมีปัญหา, การแสดงผล UI เพี้ยน, หรือมี Code Smell สำคัญ</p>
  <p style="margin: 0 !important;"><strong>ตัวอย่างปัญหา:</strong> Responsive layout หลุดในหน้าจอเฉพาะ, Missing Error Boundary, N+1 Query เล็กน้อย</p>
</div>

<div class="severity-card p3">
  <div class="severity-card-header">
    <div class="severity-card-title">🟢 P3 (Minor) - เล็กน้อย</div>
    <span class="badge green">ℹ️ ไม่บล็อกการส่งมอบ</span>
  </div>
  <p><strong>ความหมาย & ผลกระทบ:</strong> คำสะกดผิด (Typo), ปรับปรุง Style หรือคำแนะนำในการ Refactor โค้ด</p>
  <p style="margin: 0 !important;"><strong>ตัวอย่างปัญหา:</strong> สะกดชื่อตัวแปรไม่สวยงาม, การจัด Formatting ไม่ตรง Style Guide, ความเห็น Code Comment</p>
</div>

---

## 3. วงจรชีวิตและ State Machine ของ Finding

<div class="info-stack">
  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">1. สถานะ <code>open</code> ➔ <code>fixed</code></div>
      <span class="badge blue">Developer Implementation</span>
    </div>
    <p class="info-card-desc">เมื่อค้นพบปัญหาใน <code>50-verify</code> หรือ Audit สถานะเริ่มต้นคือ <code>open</code> เมื่อ Developer แก้ไขโค้ดเสร็จจะเปลี่ยนเป็น <code>fixed</code></p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">2. สถานะ <code>fixed</code> ➔ <code>closed</code></div>
      <span class="badge green">Senior QA Clearance</span>
    </div>
    <p class="info-card-desc">สถานะ <code>fixed</code> ยังคงบล็อก Release Gate จนกว่า Senior QA จะ Re-verify ซ้ำและเปลี่ยนเป็น <code>closed</code> พร้อม Empirical Evidence</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">3. ทางเลือกอื่น: <code>accepted</code> หรือ <code>invalid</code></div>
      <span class="badge amber">Tech Lead Authority</span>
    </div>
    <p class="info-card-desc"><code>accepted</code> ใช้ยอมรับความเสี่ยงเฉพาะระดับ P2/P3 เท่านั้น หรือ <code>invalid</code> เมื่อพิสูจน์แล้วว่าเป็น False Positive</p>
  </div>
</div>

### กฎเหล็กของ State Machine:
1. **เมื่อแก้ไขโค้ดเสร็จ**: Developer เปลี่ยนสถานะจาก `open` เป็น **`fixed`**
2. **`fixed` ยังไม่เท่ากับเสร็จสมบูรณ์**: Finding ที่อยู่ในสถานะ `fixed` **ยังคงบล็อก Release Gate อยู่** จนกว่าจะผ่านการ Re-verify จาก Senior QA ใน `50-verify` และเปลี่ยนเป็น **`closed`** พร้อมบันทึก Empirical Evidence
3. **`accepted` (Risk Acceptance)**: เฉพาะประเด็นระดับ `P2` หรือ `P3` เท่านั้นที่ Tech Lead สามารถเปลี่ยนเป็น `accepted` ได้ (ห้ามใช้กับ P0/P1)

---

## 4. กลไกการบล็อก Review Gate (Gate Blocker Rule)

:::caution[กฎการส่งมอบงานในสเตจ 60 และ 70]
เมื่อ AI สั่งรัน `/60-report` หรือ `/70-release` ตัว Framework จะทำการ Scan ไฟล์ `devflow/context/findings.md` โดยอัตโนมัติ:
- หากพบ Finding ที่มี `Severity: P0` หรือ `P1` และสถานะเป็น `open` หรือ `fixed`
- **ระบบจะปฏิเสธการสร้างรายงานขั้นสุดท้ายและการ Merge โค้ดทันที**
:::

### วิธีการปลดบล็อก Gate เมื่อพบ P0 หรือ P1:
1. **แก้ใน Run ปัจจุบัน**: ส่งงานกลับไปที่ `/40-execute` เพื่อเขียนโค้ดและเทสต์แก้ไข จากนั้นรัน `/50-verify` เพื่อตรวจสอบและเปลี่ยนสถานะเป็น `closed`
2. **แยกเป็น Fix Run ด่วน**: หากปัญหามีขนาดใหญ่เกินขอบเขต ให้ทำเครื่องหมายใน Spec และเปิด Run ใหม่สำหรับแก้ไขปัญหานั้นโดยเฉพาะ

---

## 5. การดูรายงานสรุป Findings ด้วยคำสั่ง Companion

คุณสามารถสั่งให้ AI สรุปสถานะของ Findings ทั้งหมดในโปรเจกต์ได้ตลอดเวลา:

```bash
# ตรวจสอบรายการ Findings ที่ค้างอยู่
/doctor

# หรือรันการตรวจสอบความปลอดภัยรอบด้าน
/security-review
```
