---
title: Multi-AI Adapters & Universal Invocation
description: สถาปัตยกรรม Adapters ที่เชื่อมต่อ Google Antigravity, Claude Code, OpenAI Codex, และ Cursor เข้ากับ DevFlow
---

ในทีมวิศวกรรมซอฟต์แวร์ยุคใหม่ สมาชิกแต่ละคนอาจเลือกใช้ AI Coding Assistant ที่แตกต่างกันตามความถนัด เช่น บางคนใช้ **Google Antigravity IDE**, บางคนใช้ **Claude Code CLI**, และบางคนใช้ **OpenAI Codex** หรือ **Cursor**

**Nexus-DevFlow** ออกแบบสถาปัตยกรรม **Multi-AI Adapters** ขึ้นมาเพื่อให้ AI ทุกค่ายสามารถทำงานบนโปรเจกต์เดียวกัน ปฏิบัติตามวินัยเดียวกัน และแชร์ Context ร่วมกันได้ 100% โดยไม่มีข้อขัดแย้ง

---

## 1. กฎการเรียกใช้คำสั่งสากล (Universal Invocation Syntax)

ทุกสเตจและ Companion Skill ใน DevFlow มี **Canonical Name (ชื่อมาตรฐานสากล)** เพียงหนึ่งเดียว การเรียกใช้งานขึ้นอยู่กับเครื่องมือ AI ที่คุณเปิดใช้งาน:

<div class="info-stack">
  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">🔹 Slash Prefix (<code>/</code>)</div>
      <span class="badge blue">Google Antigravity, Claude Code, Gemini CLI</span>
    </div>
    <p><strong>ตัวอย่างคำสั่ง:</strong> <code>/00-discover</code>, <code>/devflow</code>, <code>/doctor</code></p>
    <p class="info-card-desc"><strong>วิธีการทำงานเบื้องหลัง:</strong> เรียกผ่าน Native Slash Command หรือ Skill Engine ของเครื่องมือนั้นโดยตรง</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">🟢 Dollar Prefix (<code>$</code>)</div>
      <span class="badge green">OpenAI Codex CLI</span>
    </div>
    <p><strong>ตัวอย่างคำสั่ง:</strong> <code>$00-discover</code>, <code>$devflow</code>, <code>$doctor</code></p>
    <p class="info-card-desc"><strong>วิธีการทำงานเบื้องหลัง:</strong> โหลดคำสั่งเข้าสู่ Context ของ OpenAI Codex Shell ผ่าน <code>$skill</code> pattern</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <div class="info-card-title">⚪ Plain Canonical Text</div>
      <span class="badge gray">Aider, Cursor Composer, Windsurf, Custom Shell</span>
    </div>
    <p><strong>ตัวอย่างคำสั่ง:</strong> <code>00-discover</code>, <code>devflow</code>, <code>doctor</code></p>
    <p class="info-card-desc"><strong>วิธีการทำงานเบื้องหลัง:</strong> AI อ่านคำสั่งผ่านการค้นหาและเปิดอ่านไฟล์ <code>SKILL.md</code> ที่เกี่ยวข้องโดยอัตโนมัติ</p>
  </div>
</div>

---

## 2. โครงสร้างโฟลเดอร์ Adapters ใน Codebase

```text
โปรเจกต์ของคุณ/
├── 📄 AGENTS.md                  ← Cross-Tool Entrypoint สากลสำหรับ AI ทุกตัว
├── 📄 CLAUDE.md                  ← Claude Code Configuration (import @AGENTS.md)
│
├── 📁 .agents/                   ← Adapters สำหรับ Antigravity, Codex & Generic Agents
│   ├── 📁 skills/                ← 70+ Skills ในรูปแบบ SKILL.md พร้อม YAML Frontmatter
│   └── 📁 rules/                 ← กฎเกณฑ์เฉพาะสำหรับ Antigravity
│
└── 📁 .claude/                   ← Adapters สำหรับ Claude Code
    └── 📁 skills/                ← Claude-compatible Skill Definitions
```

### ทำไมต้องมีทั้ง `.agents/` และ `.claude/`?
- **Google Antigravity & OpenAI Codex**: อ่านชุดคำสั่งและ Metadata จาก `.agents/skills/<skill>/SKILL.md`
- **Claude Code**: รองรับโครงสร้าง Native Skill ผ่าน `.claude/skills/<skill>/SKILL.md` และอ่านการตั้งค่าจาก `CLAUDE.md`
- **ความสอดคล้อง (Synchronization)**: เมื่อคุณอัปเกรดหรือแก้ไข Skill ใน DevFlow ตัว Framework จะรักษาความสอดคล้องของเนื้อหาระหว่างทั้ง 2 โฟลเดอร์ให้ตรงกันเสมอ

---

## 3. กลไก Single Source of Truth (`AGENTS.md`)

เพื่อป้องกันไม่ให้เกิดความสับสนหรือข้อมูลไม่ตรงกัน **`AGENTS.md`** ที่ Root ของโปรเจกต์คือ **ศูนย์กลางคำสั่งเดียวของระบบ (Single Point of Governance)**:

```markdown
# AGENTS.md

Instructions for AI coding agents working in this project.
This is the cross-tool entry point: Codex, Google Antigravity, Cursor, 
GitHub Copilot, Gemini CLI, Aider, Zed, Windsurf, and others read AGENTS.md.

## Read these for full context
- `devflow/context/project-overview.md` - the project's source of truth
- `devflow/context/coding-standards.md` - engineering conventions & rules
- `devflow/context/ai-interaction.md` - how to interact with the user
- `devflow/context/current-stage.md` - active discovery or running delivery state
- `devflow/context/findings.md` - quality, security, and verification ledger
```

และใน `CLAUDE.md` จะมีคำสั่ง `@AGENTS.md` เพื่อนำเข้าข้อมูลทั้งหมดเข้ามาโดยตรง ทำให้ไม่ต้องเขียนคู่มือซ้ำซ้อนสองที่

---

## 4. การสร้าง Custom Skill ส่วนตัวของโปรเจกต์

คุณสามารถเพิ่ม Custom Skill เฉพาะสำหรับทีมของคุณได้ง่ายๆ:

1. สร้างโฟลเดอร์ใหม่ เช่น `.agents/skills/deploy-staging/`
2. สร้างไฟล์ `SKILL.md` พร้อม YAML Frontmatter:

```markdown
---
name: deploy-staging
description: "Deploy current verified run to internal staging cluster"
---

# Deploy Staging Workflow

1. ตรวจสอบว่าสเตจ 50-verify ผ่าน 100%
2. รันคำสั่ง npm run build:staging
3. แจ้งเตือนในห้อง Slack Staging Deployment
```

3. รันคำสั่ง `/doctor` เพื่อตรวจสอบว่า Skill ใหม่ถูกตรวจจับเรียบร้อยแล้ว
4. คุณสามารถเรียกใช้งานคำสั่ง `/deploy-staging` ได้ทันที!
