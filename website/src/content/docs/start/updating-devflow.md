---
title: Updating DevFlow
description: วิธีการตรวจสอบเวอร์ชัน อัปเกรด Skills และรักษาความปลอดภัยของ Context เมื่อมี DevFlow เวอร์ชันใหม่
---

**Nexus-DevFlow** ได้รับการพัฒนาอย่างต่อเนื่อง ทั้งในด้านการเพิ่ม Companion Skills ใหม่ๆ, การปรับปรุง Template Artifacts, และการเพิ่มความสามารถของ AI Adapters

เมื่อมีเวอร์ชันใหม่ออกมา คุณสามารถอัปเกรดโปรเจกต์ของคุณได้อย่างปลอดภัย โดยที่ **Context, ประวัติงานเดิม (Runs), และการตั้งค่าเฉพาะตัวจะไม่สูญหาย**

---

## 1. วิธีตรวจสอบเวอร์ชันล่าสุด (Check for Updates)

คุณสามารถสั่งให้ AI ตรวจสอบสถานะของ DevFlow ภายในโปรเจกต์ได้ผ่าน 2 คำสั่งหลัก:

<div class="command-grid">
  <div class="cmd-card">
    <div class="cmd-header">
      <span class="badge blue">Update Check</span>
      <span class="badge gray">Version Inspector</span>
    </div>
    <div class="cmd-code">/check-for-updates</div>
    <p>ตรวจสอบเวอร์ชันปัจจุบันของ DevFlow เทียบกับเวอร์ชันล่าสุดบน npm registry พร้อมสรุป Changelog</p>
  </div>

  <div class="cmd-card">
    <div class="cmd-header">
      <span class="badge green">Health Check</span>
      <span class="badge gray">System Diagnostics</span>
    </div>
    <div class="cmd-code">/doctor</div>
    <p>รันการตรวจเช็คสุขภาพโดยรวม (Health Check) ของโฟลเดอร์ Context, Adapters, Ignore Rules และเตือนเมื่อพบ Workflow Drift</p>
  </div>
</div>

```bash
# ตรวจสอบความสมบูรณ์และการตั้งค่าของโปรเจกต์
/doctor
```

---

## 2. ขั้นตอนการอัปเกรดเวอร์ชัน (Safe Upgrade Process)

เมื่อต้องการอัปเกรด DevFlow ให้รันคำสั่งติดตั้งเวอร์ชันล่าสุดผ่าน npx ที่ Root Directory ของโปรเจกต์:

```bash
npx @jakkrichm/create-nexus-devflow@latest
```

---

## 3. หลักการรักษาความปลอดภัยของข้อมูล (Safe Update Guarantees)

ระบบอัปเกรดของ DevFlow ถูกออกแบบมาให้ปลอดภัยต่อโปรเจกต์ที่มีอยู่แล้ว (Non-Destructive Upgrade Model):

<div class="info-stack">
  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📁 <code>devflow/context/</code></div>
      <span class="badge green">🛡️ รักษาไว้ 100%</span>
    </div>
    <p class="info-card-desc">ป้องกันไม่ให้ <code>project-overview.md</code> หรือ <code>coding-standards.md</code> ที่คุณปรับแต่งไว้สูญหาย</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📁 <code>devflow/discoveries/</code> & <code>devflow/runs/</code></div>
      <span class="badge green">🛡️ คงเดิมทั้งหมด</span>
    </div>
    <p class="info-card-desc">ประวัติการสำรวจไอเดียและเอกสาร Spec, Plan, Implement, Verify ของทุก Run จะไม่ถูกแตะต้อง</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📋 <code>devflow/context/findings.md</code> & <code>devflow/history/</code></div>
      <span class="badge green">🛡️ รักษาไว้ 100%</span>
    </div>
    <p class="info-card-desc">บัญชีข้อบกพร่อง สถานะ P0-P3 และประวัติการส่งมอบสำหรับ Rollback จะไม่ถูกรีเซ็ตหรือลบทิ้ง</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📁 <code>.agents/skills/</code> & <code>.claude/skills/</code></div>
      <span class="badge blue">🔄 อัปเกรดเฉพาะ Core Skills</span>
    </div>
    <p class="info-card-desc">อัปเดตคำสั่งและ Schema Template มาตรฐานให้ทันสมัย ส่วน Custom Skills ที่ผู้ใช้สร้างขึ้นเองจะคงอยู่เสมอ</p>
  </div>
</div>

:::caution[กรณีที่คุณมีการแก้ไข Core Skill Files โดยตรง]
หากคุณมีการแก้ไขไฟล์ `SKILL.md` มาตรฐานของระบบ แนะนำให้สำรองข้อมูล (Backup) หรือแยกสร้างเป็น Custom Skill ใหม่ (เช่น `my-custom-implement`) ก่อนทำการอัปเกรด เพื่อป้องกันไม่ให้ถูกอัปเดตทับด้วย Core Skill มาตรฐาน
:::

---

## 4. รายการตรวจสอบหลังการอัปเกรด (Post-Upgrade Checklist)

หลังจากรันการอัปเกรดเรียบร้อยแล้ว ให้ทำตามขั้นตอนตรวจสอบต่อไปนี้:

```text
Post-Upgrade Verification:
1. [ ] รันคำสั่ง /doctor เพื่อตรวจเช็คความเข้ากันได้ของ Adapters
2. [ ] รันคำสั่ง /devflow เพื่อตรวจสอบสถานะ Active Stage ปัจจุบัน
3. [ ] ทดสอบรันคำสั่ง Verify ประจำโปรเจกต์ (เช่น npm run check หรือ npm test)
4. [ ] ตรวจสอบ Git Status ว่ามีการเปลี่ยนแปลงเฉพาะในส่วน Skills และ Framework
```

หากผลการรัน `/doctor` รายงานว่า **"All checks passed"** แสดงว่าโปรเจกต์ของคุณพร้อมทำงานกับ DevFlow เวอร์ชันใหม่อย่างสมบูรณ์แบบ!
