---
title: Manual Review with /try
description: การสร้างคู่มือการตรวจรับงานทีละสเต็ป (Where to go, What to click, What to expect) สำหรับมนุษย์และ Stakeholders
---

แม้ว่าชุดเทสต์อัตโนมัติ (Automated Tests) จะผ่าน 100% แต่ประสบการณ์การใช้งานจริง (UX), ความลื่นไหลของหน้าจอ, และความถูกต้องของกระบวนการทำงานในมุมมองของมนุษย์ยังคงต้องอาศัยการตรวจรับด้วยคน (Human Acceptance Testing)

คำสั่ง **`/try`** ใน **Nexus-DevFlow** ถูกสร้างขึ้นเพื่อแปลงฟีเจอร์หรือการแก้ไขบั๊กที่ซับซ้อน ให้กลายเป็น **"คู่มือการทดสอบจริงสำหรับมนุษย์ (Step-by-Step Manual QA Walkthrough)"** ที่ชัดเจน ไม่ต้องอ่านโค้ด และใครๆ ในทีมก็ทดสอบตามได้ทันที

---

## 1. รูปแบบไวยากรณ์ Universal Invocation

<div class="command-grid">
  <div class="cmd-card">
    <div class="cmd-header">
      <span class="badge blue">Google Antigravity / Claude Code</span>
      <span class="badge gray">Slash Command</span>
    </div>
    <div class="cmd-code">/try</div>
    <p>สร้างคู่มือการทดสอบสำหรับ Run ปัจจุบัน หรือระบุ Running ID ที่ต้องการ</p>
  </div>

  <div class="cmd-card">
    <div class="cmd-header">
      <span class="badge green">OpenAI Codex CLI</span>
      <span class="badge gray">Dollar Prefix</span>
    </div>
    <div class="cmd-code">$try</div>
    <p>เรียกใช้ Try Skill เพื่อสกัดขั้นตอนการทดสอบจาก Spec และ Implement Record</p>
  </div>
</div>

```bash
# ตัวอย่างการเรียกใช้งาน
/try RUN-012-user-notifications
```

---

## 2. โครงสร้าง 3 เสาหลักของ Try Guide (The 3-Step Structure)

คู่มือที่สร้างขึ้นจาก `/try` จะประกอบด้วย 3 มิติที่ชัดเจนเสมอ:

<div class="step-flow">
  <div class="step-flow-item">
    <div class="step-flow-num">📍</div>
    <div class="step-flow-content">
      <div class="step-flow-title">1. Where to go (ต้องไปที่ไหน)</div>
      <p class="step-flow-desc">ระบุ URL, เส้นทางหน้าจอ, หรือ API Endpoint ที่ต้องเปิดใช้งานอย่างแม่นยำ</p>
    </div>
  </div>

  <div class="step-flow-item">
    <div class="step-flow-num">🖱️</div>
    <div class="step-flow-content">
      <div class="step-flow-title">2. What to do (ต้องทำอะไร)</div>
      <p class="step-flow-desc">ลำดับขั้นตอนการกระทำของมนุษย์ เช่น การกรอกข้อมูล, การกดปุ่ม, หรือการสลับแท็บ</p>
    </div>
  </div>

  <div class="step-flow-item">
    <div class="step-flow-num">👀</div>
    <div class="step-flow-content">
      <div class="step-flow-title">3. What to expect (คาดหวังว่าจะเห็นอะไร)</div>
      <p class="step-flow-desc">พฤติกรรมที่ระบบต้องตอบสนอง ข้อความแจ้งเตือน และผลลัพธ์ทั้งกรณี Success และ Edge Case</p>
    </div>
  </div>
</div>

1. **Where to go (ต้องไปที่ไหน)**: ระบุ URL, แท็บเมนู, หรือเส้นทางหน้าจอที่ต้องเปิดอย่างชัดเจน (เช่น `http://localhost:3000/dashboard/billing`)
2. **What to do / What to click (ต้องทำอะไร)**: ลำดับขั้นตอนการกระทำของมนุษย์ เช่น การพิมพ์ข้อความใน Input Field, การกดปุ่ม, หรือการสลับ Toggle
3. **What to expect (คาดหวังว่าจะเห็นอะไร)**: พฤติกรรมที่ระบบต้องตอบสนอง เช่น ข้อความ Toast แจ้งเตือน, ข้อมูลในตารางที่เปลี่ยนแปลง, หรือสถานะปุ่มที่เปลี่ยนสี

---

## 3. ตัวอย่าง Try Guides ในรูปแบบต่างๆ

### 🌐 ตัวอย่างที่ 1: Frontend Web Application
```markdown
### Scenario 1: ทดสอบการเปลี่ยนรหัสผ่านสำเร็จ (Happy Path)
1. **Where to go**: เปิดเบราว์เซอร์ไปที่ `http://localhost:3000/settings/security`
2. **What to do**:
   - กรอกรหัสผ่านปัจจุบัน: `OldPass123!`
   - กรอกรหัสผ่านใหม่: `NewSecurePass456#`
   - กรอกยืนยันรหัสผ่านใหม่: `NewSecurePass456#`
   - คลิกปุ่ม **"บันทึกการเปลี่ยนแปลง"**
3. **What to expect**:
   - หน้าจอแสดง Toast สีเขียวข้อความ: `เปลี่ยนรหัสผ่านเรียบร้อยแล้ว`
   - ฟอร์มเคลียร์ค่าว่าง และมีอีเมลแจ้งเตือนส่งไปยังกล่องข้อความผู้ใช้
```

### 🔌 ตัวอย่างที่ 2: REST API Backend
```markdown
### Scenario 2: ทดสอบการสร้าง Order ผ่าน cURL
1. **Where to go**: เปิด Terminal หรือ Postman
2. **What to do**: รันคำสั่ง cURL ต่อไปนี้:
   ```bash
   curl -X POST http://localhost:8080/api/v1/orders \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer mock-token-123" \
     -d '{"items": [{"productId": "P-01", "quantity": 2}]}'
   ```
3. **What to expect**:
   - ได้รับ HTTP Status Code `201 Created`
   - Response Body มีโครงสร้าง JSON: `{"success": true, "orderId": "ORD-..."}`
```

### ⚠️ ตัวอย่างที่ 3: Edge Case / Validation Error
```markdown
### Scenario 3: ทดสอบกรณีรหัสผ่านไม่ตรงกัน (Negative Test)
1. **Where to go**: `http://localhost:3000/settings/security`
2. **What to do**: กรอกรหัสผ่านใหม่กับช่องยืนยันให้ไม่ตรงกัน แล้วกด "บันทึก"
3. **What to expect**:
   - ปุ่มบันทึกถูก Disable หรือแสดงข้อความสีแดงใต้ช่องยืนยัน: `รหัสผ่านไม่ตรงกัน`
   - ระบบไม่ส่ง Network Request ไปยัง Backend
```

---

## 4. การเชื่อมต่อกับ Interactive Reports (`60-report.html`)

เมื่อจบสเตจ `50-verify` และเข้าสู่สเตจ `60-report` ตัว **Try Guide** ทั้งหมดจะถูกรวบรวมและฝังลงใน **`60-report.html`** โดยอัตโนมัติ

ทำให้ Product Manager, QA Tester หรือ Client สามารถเปิดไฟล์รายงาน HTML แล้วคลิกทดสอบตามแต่ละขั้นตอนได้อย่างสะดวกสบาย พร้อมทำเครื่องหมาย Checkbox ตรวจรับงานได้ทันที!
