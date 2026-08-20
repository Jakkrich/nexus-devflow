---
title: Existing Codebase Adoption (/adopt)
description: นำ Nexus-DevFlow ไปปรับใช้กับโปรเจกต์เดิมที่มีโค้ดอยู่แล้ว (Brownfield Codebase) อย่างปลอดภัย
---

หากคุณมีโปรเจกต์ที่เปิดให้บริการแล้ว มีประวัติ Git ยาวนาน หรือมีโค้ดเขียนอยู่ก่อนแล้วนับพันบรรทัด (**Brownfield Codebase**) คุณสามารถนำ **Nexus-DevFlow** เข้าไปวางซ้อนทับเพื่อควบคุมวินัย AI ในการพัฒนาฟีเจอร์ใหม่และแก้บั๊กได้อย่างราบรื่น ผ่านคำสั่ง `/adopt`

:::note[ความแตกต่างระหว่าง /onboard กับ /adopt]
- **`/onboard`**: เหมาะสำหรับ **โปรเจกต์ใหม่ (Greenfield)** หรือโปรเจกต์ที่เพิ่ง Scaffold โครงสร้างขึ้นมา ยังไม่มีฟังก์ชันการทำงานจริงมากนัก
- **`/adopt`**: เหมาะสำหรับ **โปรเจกต์เดิมที่มีอยู่แล้ว (Brownfield)** มีฟีเจอร์ที่เปิดใช้งานแล้ว (Shipped Features), มีโค้ดเดิม, มีชุดเทสต์ หรืออาจมี Legacy Technical Debt ที่ต้องทำความเข้าใจก่อนเริ่มงานใหม่
:::

---

## เปรียบเทียบการใช้งาน Onboard vs Adopt

<div class="comparison-grid">
  <div class="comparison-card">
    <h4>
      <span>🚀 <code>/onboard</code></span>
      <span class="badge blue">สำหรับโปรเจกต์ใหม่ (Greenfield)</span>
    </h4>
    <ul>
      <li><strong>สถานะ Codebase</strong>: โค้ดยังว่างเปล่า หรือเพิ่งสร้างโครงตั้งต้น</li>
      <li><strong>การสำรวจฟังก์ชัน</strong>: กำหนดภาพรวมและวางแผนการสร้างฟีเจอร์ใหม่</li>
      <li><strong>การทดสอบระบบเดิม</strong>: ตรวจสอบ Script เบื้องต้นจาก Template</li>
      <li><strong>การจัดการหนี้ทางเทคนิค</strong>: ยังไม่มี Technical Debt สะสม</li>
      <li><strong>ผลลัพธ์ Context</strong>: สร้าง Template Context เริ่มต้นของโปรเจกต์</li>
    </ul>
  </div>

  <div class="comparison-card accent">
    <h4>
      <span>🔄 <code>/adopt</code></span>
      <span class="badge green">สำหรับโปรเจกต์เดิม (Brownfield)</span>
    </h4>
    <ul>
      <li><strong>สถานะ Codebase</strong>: มีฟีเจอร์ทำงานจริง มีโมดูลหลากหลายและประวัติยาวนาน</li>
      <li><strong>การสำรวจฟังก์ชัน</strong>: สำรวจฟังก์ชันที่ปล่อยไปแล้ว (<strong>Shipped Features</strong>) ป้องกัน AI สร้างโค้ดซ้ำซ้อน</li>
      <li><strong>การทดสอบระบบเดิม</strong>: รัน Typecheck, Linter และ Unit Tests เดิม เพื่อหา <strong>Baseline Quality</strong></li>
      <li><strong>การจัดการหนี้ทางเทคนิค</strong>: บันทึก Known Issues และช่องโหว่เดิมลงใน <code>findings.md</code> เป็น Baseline</li>
      <li><strong>ผลลัพธ์ Context</strong>: สกัดสถาปัตยกรรมจริง กฎเกณฑ์ที่ทีมใช้อยู่ และโครงสร้าง Seams</li>
    </ul>
  </div>
</div>

---

## ขั้นตอนการติดตั้งบนโปรเจกต์เดิม (Step-by-Step)

### ขั้นตอนที่ 1: ติดตั้ง DevFlow Overlay
เปิด Terminal ที่ Root Directory ของโปรเจกต์เดิม แล้วรัน:

```bash
npx @jakkrichm/create-nexus-devflow
```

ตัวติดตั้งจะคัดลอกโฟลเดอร์ `.agents/`, `.claude/` และ `devflow/` เข้าสู่โปรเจกต์ โดยจะไม่แตะต้องหรือลบไฟล์โค้ดเดิมของคุณเลยแม้แต่ไฟล์เดียว

### ขั้นตอนที่ 2: รันคำสั่ง Adopt
เปิด AI Coding Assistant ของคุณ แล้วสั่งคำสั่ง:

<div class="command-grid">
  <div class="cmd-card">
    <div class="cmd-header">
      <span class="badge blue">Google Antigravity / Claude Code</span>
      <span class="badge gray">Slash Command</span>
    </div>
    <div class="cmd-code">/adopt</div>
    <p>รันกระบวนการสำรวจ Codebase เชิงลึกและสังเคราะห์ Context อัตโนมัติ</p>
  </div>

  <div class="cmd-card">
    <div class="cmd-header">
      <span class="badge green">OpenAI Codex CLI</span>
      <span class="badge gray">Dollar Prefix</span>
    </div>
    <div class="cmd-code">$adopt</div>
    <p>ส่งคำสั่งให้ Codex สำรวจและบันทึก Shipped Features</p>
  </div>
</div>

---

## 5 ขั้นตอนหลักที่ `/adopt` ดำเนินการโดยอัตโนมัติ

<div class="step-flow">
  <div class="step-flow-item">
    <div class="step-flow-num">1</div>
    <div class="step-flow-content">
      <div class="step-flow-title">Codebase & Stack Survey</div>
      <p class="step-flow-desc">สำรวจภาษา, Frameworks, Package Dependencies, และไฟล์ Configuration ทั้งหมด</p>
    </div>
  </div>

  <div class="step-flow-item">
    <div class="step-flow-num">2</div>
    <div class="step-flow-content">
      <div class="step-flow-title">Shipped Features Discovery</div>
      <p class="step-flow-desc">สรุปสารบัญฟังก์ชันที่เปิดใช้งานแล้ว บันทึกลงใน project-overview.md เพื่อไม่ให้ AI สร้างซ้ำ</p>
    </div>
  </div>

  <div class="step-flow-item">
    <div class="step-flow-num">3</div>
    <div class="step-flow-content">
      <div class="step-flow-title">Verification Baseline Check</div>
      <p class="step-flow-desc">รัน Typecheck, Linter และ Unit Tests เดิม เพื่อกำหนด Baseline Quality ของระบบ</p>
    </div>
  </div>

  <div class="step-flow-item">
    <div class="step-flow-num">4</div>
    <div class="step-flow-content">
      <div class="step-flow-title">Baseline Findings Record</div>
      <p class="step-flow-desc">ลงบันทึก Known Issues และหนี้ทางเทคนิคเดิมลงใน findings.md โดยไม่บล็อกงานใหม่</p>
    </div>
  </div>

  <div class="step-flow-item">
    <div class="step-flow-num">5</div>
    <div class="step-flow-content">
      <div class="step-flow-title">Context Initialization</div>
      <p class="step-flow-desc">สร้างไฟล์ project-overview.md และ coding-standards.md ที่สะท้อนตัวตนของระบบจริง</p>
    </div>
  </div>
</div>

### 1. การสำรวจ Codebase เชิงลึก (Codebase & Stack Survey)
AI จะอ่านไฟล์ตั้งค่าหลัก เช่น `package.json`, `tsconfig.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `.eslintrc`, `Dockerfile` เพื่อวิเคราะห์ Stack ทั้งหมดโดยไม่ต้องให้คุณพิมพ์อธิบายใหม่

### 2. บันทึกฟังก์ชันที่เปิดใช้งานแล้ว (Shipped Features Catalog)
AI จะสำรวจ Source Code เพื่อสรุปรายการฟังก์ชันที่มีอยู่จริง บันทึกลงในส่วน `Shipped Features` ใน [`project-overview.md`](../project-context/) ประโยชน์คือ:
- ป้องกันไม่ให้ AI ในอนาคตเขียนฟังก์ชันยูทิลิตี้หรือ API Endpoints ซ้ำกับที่มีอยู่แล้ว
- ช่วยให้ AI เข้าใจ Boundary และการเชื่อมต่อระหว่าง Service เดิม

### 3. ตรวจสอบสถานะการทำงานจริง (Verification Baseline)
AI จะทดสอบรันคำสั่ง Typecheck, Lint และ Unit Test เดิม:
- หากรันผ่านทั้งหมด: บันทึกคำสั่ง Verify ประจำโปรเจกต์
- หากมีเทสต์หรือลินท์เดิมที่พังอยู่ก่อนหน้า: AI จะแยกแยะว่าเป็น **Pre-existing Issue** โดยไม่ถือว่าเกิดจากงานใหม่

### 4. บันทึก Baseline ลง Findings Ledger (`findings.md`)
หากพบช่องโหว่ความปลอดภัย หนี้ทางเทคนิค หรือปัญหาที่พบค้างอยู่ในระบบเดิม AI จะบันทึกเป็น `P2` หรือ `P3` ใน `devflow/context/findings.md` เพื่อให้ทีมทราบสถานะแต่ไม่บล็อกการพัฒนาฟีเจอร์ใหม่

### 5. สร้าง Context Files ที่สะท้อนตัวตนของระบบจริง
- `devflow/context/project-overview.md`: บันทึกภาพรวม สถาปัตยกรรม และฟังก์ชันหลัก
- `devflow/context/coding-standards.md`: ดึงรูปแบบโค้ดจริงที่โปรเจกต์ใช้ (Naming conventions, Directory patterns, Error handling)

---

## คำแนะนำเมื่อเจอปัญหาในระบบเดิม (Brownfield Best Practices)

:::tip[1. หากชุดเทสต์เดิมใช้เวลานานเกินไป]
ในการทำงานประจำวันของ AI คุณสามารถกำหนดคำสั่ง **Fast Verify** ใน `AGENTS.md` เช่น ให้รันเฉพาะ Unit Tests หรือ Typecheck ในระหว่าง Implement และรัน Full E2E Test Suite ในขั้นตอน `50-verify`
:::

:::caution[2. การจัดการ Pre-existing Lint Errors]
หากโปรเจกต์เดิมมี Lint Warning จำนวนมาก ให้เน้นย้ำใน `coding-standards.md` ว่า **"Rule of Boy Scout"**: โค้ดส่วนที่แก้ไขใหม่ต้องสะอาดและผ่าน Lint 100% แต่ไม่ต้องรีแฟกเตอร์ทั้งโปรเจกต์ใน Run เดียวเพื่อลดความเสี่ยง Regression
:::

---

## ขั้นตอนถัดไปหลังการ Adopt เสร็จสิ้น

1. 🔍 **ตรวจทาน Context Files**: เปิดดู [`devflow/context/project-overview.md`](../project-context/) และปรับแต่งข้อความหากต้องการเพิ่มบริบทเฉพาะตัว
2. ⚡ **เริ่มงานแรกผ่าน Discovery**:
   ```bash
   /00-discover ปรับปรุงประสิทธิภาพหน้า Dashboard หรือเพิ่มฟีเจอร์ใหม่
   ```
3. 🛡️ **ตรวจสอบความพร้อมของระบบ**: รันคำสั่ง `/doctor` เพื่อให้ AI ตรวจสอบความสมบูรณ์ของการตั้งค่าทั้งหมด
