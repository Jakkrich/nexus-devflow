---
title: File & Directory Reference
description: สารานุกรมโครงสร้างไฟล์และโฟลเดอร์ทั้งหมดในสถาปัตยกรรม Nexus-DevFlow
---

เอกสารนี้รวบรวมแผนผังและคำอธิบายโครงสร้างไฟล์ โฟลเดอร์ และ Artifacts ทั้งหมดของ **Nexus-DevFlow** เพื่อให้ทีมพัฒนาและ AI Coding Agents มีความเข้าใจตรงกันในบทบาทของแต่ละไฟล์

---

## 1. แผนผังโครงสร้างโฟลเดอร์มาตรฐาน (Standard Directory Tree)

```text
โปรเจกต์ของคุณ/
├── 📄 AGENTS.md                  ← Cross-Tool Entrypoint สากลสำหรับ AI ทุกตัว
├── 📄 CLAUDE.md                  ← Claude Code Configuration (import @AGENTS.md)
│
├── 📁 .agents/                   ← Adapters สำหรับ Antigravity, Codex & Generic Agents
│   ├── 📁 skills/                ← 80+ Skills ในรูปแบบ SKILL.md พร้อม YAML Frontmatter
│   └── 📁 rules/                 ← กฎเกณฑ์เฉพาะสำหรับ Antigravity
│
├── 📁 .claude/                   ← Adapters สำหรับ Claude Code
│   └── 📁 skills/                ← Claude-compatible Skill Definitions
│
└── 📁 devflow/                   ← หัวใจหลักของ Nexus-DevFlow
    ├── 📄 ideas.md               ← สมุดบันทึกไอเดียด่วนพร้อม AI Feasibility & Value Analysis
    │
    ├── 📁 context/               ← Single Source of Truth และระเบียบควบคุมคุณภาพ
    │   ├── 📄 project-overview.md← ภาพรวมระบบ, สถาปัตยกรรม, Tech Stack, Shipped Features
    │   ├── 📄 coding-standards.md← กฎวิศวกรรม, รูปแบบโค้ด, Unit Test AAA, Security Policies
    │   ├── 📄 ai-interaction.md  ← มารยาทการสื่อสาร, ค่าเริ่มต้นภาษา, ขอบเขตอำนาจตัดสินใจ
    │   ├── 📄 current-stage.md   ← ตัวติดตามสถานะ Active Run และ Discovery แบบ Realtime
    │   └── 📋 findings.md        ← สมุดบัญชีควบคุมคุณภาพและความปลอดภัย (Findings Ledger)
    │
    ├── 📁 discoveries/           ← พื้นที่สำรวจไอเดียก่อนผูกมัดทรัพยากร (Stage 00)
    │   └── 📁 DISC-YYYYMMDD-NNN-{slug}/
    │       └── 📄 00-discover.md ← ผลการสำรวจ, การวิเคราะห์ความเสี่ยง, และการตัดสินใจ
    │
    ├── 📁 runs/                  ← Delivery Runs ในการพัฒนาจริง
    │   └── 📁 RUN-NNN-{slug}/
    │       ├── 📄 spec.md        ← [Fast-Track] Single Living Spec แผ่นเดียวจบ
    │       │   ── หรือ ──
    │       ├── 📄 10-define.md   ← [Deep-Track] นิยามขอบเขตงานและ Allocation Contract
    │       ├── 📄 20-spec.md     ← [Deep-Track] Technical Specification & Acceptance Criteria
    │       ├── 📄 30-plan.md     ← [Deep-Track] Implementation Plan & Test Decisions
    │       ├── 📄 40-execute.md  ← [Deep-Track] บันทึกการเขียนโค้ดและ Execution Evidence
    │       ├── 📄 50-verify.md   ← [Deep-Track] ผลการตรวจรับงานระดับ Senior QA 4 เลน
    │       ├── 📄 50-verify-impact.md ← (ทางเลือก) รายงานผลกระทบวงกว้าง
    │       ├── 📄 60-report.md   ← [Deep-Track] รายงานสรุปส่งมอบแบบ Markdown
    │       ├── 📄 70-release.md  ← [Deep-Track] สรุปการปิดรอบและ Release Notes
    │       └── 📁 checklists/    ← แฟ้มติดตามงานแบบ Checklist
    │           ├── 📋 implementation-checklist.md
    │           └── 📋 verification-checklist.md
    │
    └── 📁 history/               ← คลังประวัติการส่งมอบงานระยะยาว
        ├── 📄 HISTORY.md         ← บันทึกประวัติการ Release และ Checkpoint Commits
        ├── 📁 features/          ← สำเนา Spec ฟีเจอร์ที่ส่งมอบแล้ว (ใช้สำหรับ Rollback)
        └── 📁 fixes/             ← สำเนาบันทึกการแก้บั๊ก
```

---

## 2. สารานุกรมไฟล์และหน้าที่การใช้งาน (File Encyclopedia)

<div class="info-stack">
  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📄 <code>AGENTS.md</code></div>
      <div><span class="badge blue">Root Governance</span> <span class="badge green">Persistent</span></div>
    </div>
    <p class="info-card-desc">Entrypoint หลักของ AI ทุกค่าย กำหนดกฎ สิทธิ์การเข้าถึง และคำสั่ง Verify กลางของโปรเจกต์</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">💡 <code>devflow/ideas.md</code></div>
      <div><span class="badge purple">Idea Inbox</span> <span class="badge green">Persistent</span></div>
    </div>
    <p class="info-card-desc">คลังรวมไอเดียที่บันทึกผ่าน <code>/idea</code> พร้อมคะแนนประเมิน Feasibility และ Seed Points กันลืม</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📄 <code>devflow/context/project-overview.md</code></div>
      <div><span class="badge purple">Context</span> <span class="badge green">Persistent</span></div>
    </div>
    <p class="info-card-desc">Single Source of Truth บันทึกสถาปัตยกรรม, Tech Stack, Domain Models และ Shipped Features</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📄 <code>devflow/context/coding-standards.md</code></div>
      <div><span class="badge purple">Context</span> <span class="badge green">Persistent</span></div>
    </div>
    <p class="info-card-desc">กฎวิศวกรรมซอฟต์แวร์ สไตล์โค้ด การเขียน Unit Test AAA และนโยบายความปลอดภัย</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📄 <code>devflow/context/ai-interaction.md</code></div>
      <div><span class="badge purple">Context</span> <span class="badge green">Persistent</span></div>
    </div>
    <p class="info-card-desc">มารยาทการสื่อสาร ขอบเขตอำนาจตัดสินใจ ภาษาเริ่มต้น และข้อห้ามเด็ดขาดของ AI</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📄 <code>devflow/context/current-stage.md</code></div>
      <div><span class="badge blue">Active State</span> <span class="badge amber">Realtime Mutable</span></div>
    </div>
    <p class="info-card-desc">บันทึกสถานะ Active Stage และ Running ID ปัจจุบัน เพื่อให้ AI ทุกตัวทราบตำแหน่งงานทันที</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📋 <code>devflow/context/findings.md</code></div>
      <div><span class="badge red">Quality & Security</span> <span class="badge green">Persistent Ledger</span></div>
    </div>
    <p class="info-card-desc">สมุดบัญชีควบคุมบั๊กและช่องโหว่ความปลอดภัย (P0-P3) พร้อม State Machine ควบคุม Review Gate</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📁 <code>devflow/runs/RUN-NNN/</code></div>
      <div><span class="badge green">Delivery Run</span> <span class="badge gray">Working</span></div>
    </div>
    <p class="info-card-desc">รวมเอกสารส่งมอบ: Fast-Track (<code>spec.md</code>) หรือ Deep-Track (<code>10-define.md</code> ถึง <code>70-release.md</code>)</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">📁 <code>devflow/history/</code></div>
      <div><span class="badge gray">History & Rollback</span> <span class="badge green">Append-Only</span></div>
    </div>
    <p class="info-card-desc">บันทึกประวัติการส่งมอบงานระยะยาว (<code>HISTORY.md</code>) และ Checkpoint Commits สำหรับการ Rollback ที่ปลอดภัย</p>
  </div>
</div>

---

## 3. กฎเกณฑ์การจัดเก็บ Git (Git Hygiene & Version Control)

ไฟล์และโฟลเดอร์ทั้งหมดใน `devflow/` ถูกออกแบบมาให้ **Commit ขึ้น Git Repository ได้อย่างปลอดภัย 100%**:

:::tip[ทำไมต้อง Commit โฟลเดอร์ devflow/ ขึ้น Git?]
1. **Team Knowledge Sharing**: เมื่อเพื่อนร่วมทีมหรือ AI ในเครื่องอื่น Pull โค้ดไป จะได้รับ Context และประวัติงานเดียวกันทันที
2. **Auditability & Traceability**: สามารถย้อนดูประวัติการตัดสินใจในอดีตได้ว่าฟีเจอร์นี้สร้างขึ้นด้วย Spec และการทดสอบแบบใด
3. **Safe Rollback**: สเตจ `/rollback` ต้องอาศัยข้อมูลจาก `devflow/history/` และ `devflow/runs/` เพื่อย้อนโค้ดได้อย่างแม่นยำ
:::
