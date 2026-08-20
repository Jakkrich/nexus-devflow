---
title: Getting Started
description: ติดตั้ง Nexus-DevFlow เข้าสู่โปรเจกต์ของคุณและเริ่มวงรอบการพัฒนาแบบ Dual-Track Agentic Workflow
---

**Nexus-DevFlow** คือ Agentic Workflow Layer ระดับองค์กรที่วางซ้อน (Overlay) ลงบนแอปพลิเคชันของคุณ เพื่อควบคุมพฤติกรรมและกระบวนการทำงานของ AI Coding Agents ให้มีวินัย ส่งมอบงานทีละขั้นตอนอย่างเป็นระเบียบ และมีระบบตรวจสอบคุณภาพที่เข้มงวด

:::note[หัวใจสำคัญของ Overlay Model]
Nexus-DevFlow **ไม่ใช่โครงสร้าง Framework ตัวแอปพลิเคชันเริ่มต้น (App Starter)** แต่เป็น **Agentic Workflow Engine** ดังนั้น คุณสามารถเลือกภาษาและเฟรมเวิร์กที่ต้องการ (เช่น Next.js, FastAPI, NestJS, Go, Rust, Flutter) แล้ว Scaffold ตัวแอปของคุณตามปกติ จากนั้นจึงติดตั้ง DevFlow วางทับลงไป
:::

---

## สิ่งที่ Nexus-DevFlow เพิ่มเข้ามาในโปรเจกต์

เมื่อติดตั้ง DevFlow ลงใน Codebase ของคุณ โครงสร้างโฟลเดอร์และไฟล์ควบคุมจะถูกเพิ่มเข้ามาเพื่อสร้างระบบการทำงานร่วมกันระหว่างมนุษย์และ AI:

<div class="info-stack">
  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📁 Context (<code>devflow/context/</code>)</div>
      <span class="badge blue">AI + มนุษย์ร่วมตรวจ</span>
    </div>
    <p class="info-card-desc">กำหนด <strong>Single Source of Truth</strong>, มาตรฐานโค้ด, กฎการสื่อสาร และสถานะ Stage ปัจจุบัน เพื่อให้ AI ทุกตัวเข้าใจบริบทตรงกันเสมอ</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">💡 Ideas Inbox (<code>devflow/ideas.md</code>)</div>
      <span class="badge purple">AI + ไอเดียด่วน</span>
    </div>
    <p class="info-card-desc">สมุดบันทึกไอเดียด่วนพร้อม AI ช่วยวิเคราะห์ Feasibility และ Key Points สามารถเคลมไปทำต่อด้วย <code>/feature IDEA-xxx</code> หรือ <code>/fix IDEA-xxx</code> ได้ทันที</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📁 Delivery Runs (<code>devflow/runs/</code>)</div>
      <span class="badge green">AI ดำเนินการ</span>
    </div>
    <p class="info-card-desc">จัดสรรงานออกเป็น Bounded Scopes พร้อมเอกสาร Living Spec (<code>spec.md</code>) สำหรับ Fast-Track หรือแยกสเตจ (<code>00-70</code>) สำหรับ Deep-Track</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📋 Findings Ledger (<code>findings.md</code>)</div>
      <span class="badge red">AI QA + Tech Lead</span>
    </div>
    <p class="info-card-desc">บัญชีควบคุมคุณภาพและความปลอดภัยอย่างเคร่งครัด แบ่งระดับความรุนแรง <code>P0</code> ถึง <code>P3</code> เพื่อเป็น Review Gate ก่อนส่งมอบงาน</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📁 History (<code>devflow/history/</code>)</div>
      <span class="badge gray">AI จัดเก็บอัตโนมัติ</span>
    </div>
    <p class="info-card-desc">บันทึกประวัติการส่งมอบงานย้อนหลังและ Checkpoint Commits เพื่อให้สามารถทำ <code>/rollback</code> ได้อย่างปลอดภัย</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📁 Multi-AI Adapters (<code>.agents/</code>, <code>.claude/</code>)</div>
      <span class="badge amber">ระบบจัดการ</span>
    </div>
    <p class="info-card-desc">แปลงชุดคำสั่งและทักษะ (Skills) ให้เข้ากับ AI แต่ละค่าย (Antigravity, Claude Code, OpenAI Codex, Cursor)</p>
  </div>
</div>

---

## ขั้นตอนการติดตั้งและเริ่มใช้งาน (Installation & Setup)

### ขั้นตอนที่ 1: เตรียมโปรเจกต์แอปพลิเคชัน
สร้างหรือเปิดโปรเจกต์ที่คุณต้องการพัฒนา:

```bash
# ตัวอย่าง: Scaffold Next.js หรือ Vite โปรเจกต์
npx create-next-app@latest my-awesome-app
cd my-awesome-app
```

### ขั้นตอนที่ 2: ติดตั้ง Nexus-DevFlow Overlay
รันคำสั่งติดตั้ง DevFlow ภายใน Root Directory ของโปรเจกต์:

```bash
npx @jakkrichm/create-nexus-devflow
```

ตัวติดตั้งแบบ Interactive CLI จะให้คุณเลือกเครื่องมือ AI ที่คุณใช้งาน:
- **Google Antigravity / OpenAI Codex**: ติดตั้งชุดคำสั่งในโฟลเดอร์ `.agents/skills/`
- **Claude Code**: ติดตั้งชุดคำสั่งในโฟลเดอร์ `.claude/skills/`
- **Both / Universal**: ติดตั้งครบทุก Adapters เพื่อรองรับการทำงานร่วมกันหลายเครื่องมือ

```text
? Which AI coding tools do you plan to use?
  ❯ Google Antigravity & OpenAI Codex (.agents/)
    Claude Code (.claude/)
    All Adapters (Recommended for multi-agent teams)
```

---

## ขั้นตอนการ Onboard สู่โปรเจกต์ครั้งแรก (First Onboarding)

เมื่อติดตั้งเสร็จแล้ว ให้เปิด AI Coding Assistant ของคุณ แล้วสั่งคำสั่ง Onboard:

<div class="command-grid">
  <div class="cmd-card">
    <div class="cmd-header">
      <span class="badge blue">Google Antigravity / Claude Code</span>
      <span class="badge gray">Slash Command</span>
    </div>
    <div class="cmd-code">/onboard</div>
    <p>รันคำสั่ง Slash Command เพื่อให้ AI สำรวจโปรเจกต์และสร้าง Context Files อัตโนมัติ</p>
  </div>

  <div class="cmd-card">
    <div class="cmd-header">
      <span class="badge green">OpenAI Codex CLI</span>
      <span class="badge gray">Dollar Prefix</span>
    </div>
    <div class="cmd-code">$onboard</div>
    <p>รันคำสั่ง Dollar Prefix เพื่อโหลด Onboard Skill เข้าสู่ Context ของ Codex</p>
  </div>
</div>

### สิ่งที่เกิดขึ้นระหว่างการ Onboard:
1. 🔍 **Tech Stack Auto-Detection**: AI ตรวจสอบภาษา, Framework, Package Manager, Test Runner และ Linter ของโปรเจกต์
2. 📝 **Context Initialization**: สร้างไฟล์ `devflow/context/project-overview.md` และ `devflow/context/coding-standards.md` ที่ตรงกับ Codebase จริง
3. 🛡️ **Verify Command Alignment**: ตรวจจับคำสั่งทดสอบระบบ (เช่น `npm test`, `npm run lint`, `npm run build`) เพื่อใช้เป็น Verification Command ประจำโปรเจกต์

---

## การเลือกโหมดการทำงาน: Dual-Track Delivery Model

Nexus-DevFlow 2.0 รองรับการส่งมอบงาน 2 รูปแบบ เพื่อตอบโจทย์ทั้งงานเร็วและงานระบบใหญ่:

### 🏎️ Track 1: Fast-Track (Blueprint Mode — 4 ขั้นตอน)
> **เหมาะสำหรับ 85% ของงานประจำวัน** เช่น พัฒนาฟีเจอร์ทั่วไป, แก้บั๊ก, ปรับปรุง UI, งานเร็วที่ต้องการความคล่องตัวสูง
> ใช้เอกสารฉบับเดียวจบคือ **Single Living Spec (`spec.md`)**

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. **`/feature <title>`** (หรือ **`/fix <bug>`**): จัดสรร Running ID (`RUN-xxx`) และสร้าง `spec.md` (Living Spec) แผ่นเดียวจบ
2. **`/implement`**: พัฒนาโค้ดตาม Checklist ทีละขั้นตอนด้วยวินัย TDD และบันทึก Log ลงใน `spec.md`
3. **`/check`**: Senior QA Review + Multi-lane verification (Typecheck, Lint, Tests, Proof) บันทึกหลักฐานลง `spec.md`
4. **`/complete`**: Final Safety Pass, สรุป Release Digest ลง `spec.md`, ทำ Git Merge และปิดรอบอย่างปลอดภัย

---

### 🏗️ Track 2: Deep-Track (Architect Mode — 8 ขั้นตอน)
> **เหมาะสำหรับงานสถาปัตยกรรมใหญ่** เช่น Database Migration, ระบบที่แตะหลาย Microservices, หรืองานที่ต้องประสานงานหลายฝ่าย
> แยก Artifacts ตามแต่ละ Stage อย่างชัดเจน (`00-discover.md` ถึง `70-release.md`)

```text
00-discover ──▶ 10-define ──▶ 20-spec ──▶ 30-plan ──▶ 40-execute ──▶ 50-verify ──▶ 60-report ──▶ 70-release
```

1. `00-discover`: สำรวจความต้องการ/ความเป็นไปได้ก่อน commit (ยังไม่สร้าง RUN ID)
2. `10-define`: แปลง Discovery ให้เป็นกรอบงาน delivery กำหนด RUN ID
3. `20-spec`: ร่าง Formal Specification และ Acceptance Criteria
4. `30-plan`: แตก Spec เป็น Task Breakdown เชิงเทคนิค + Test Decisions
5. `40-execute`: พัฒนาทีละ Task พร้อม Unit Tests และ Review Gates
6. `50-verify`: ตรวจสอบคุณภาพเชิงลึก Multi-lane verification บันทึกหลักฐาน
7. `60-report`: สรุปผลการส่งมอบงานเป็น Markdown Delivery Report
8. `70-release`: แพ็กเกจ Release, Release Notes, Git Merge, PR หรือ Deployment

---

## ขั้นตอนถัดไปที่แนะนำ (Next Steps)

- 💡 **[Idea Capture Inbox (/idea)](../../commands/mainline-stages/#idea-capture-inbox)**: วิธีบันทึกไอเดียด่วนและดึงมาทำต่อ
- 📁 **[Project Context](../project-context/)**: เจาะลึกการตั้งค่า Context Files เพื่อผลลัพธ์ที่แม่นยำสูงสุด
- 🛡️ **[Review Gates & Discipline](../../workflow/review-gates/)**: เข้าใจกลไกด่านตรวจความปลอดภัยที่ AI ห้ามผ่านโดยไม่ได้รับอนุญาต
- ⚡ **[Mainline Stages & Commands](../../commands/mainline-stages/)**: คู่มือเจาะลึกรายละเอียดของทุกคำสั่ง
