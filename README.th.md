<p align="center">
  <img src="docs/logo-nexus-devflow.png" alt="Nexus-DevFlow 2.5.0" width="120">
</p>

<h1 align="center">Nexus-DevFlow 2.5.0</h1>

<p align="center"><strong>สถาปัตยกรรม 3 เสาหลัก และ Single Living Spec Model สำหรับการพัฒนาซอฟต์แวร์ระดับโปรดักชันร่วมกับ AI Coding Agents</strong></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@jakkrichm/create-nexus-devflow"><img src="https://img.shields.io/npm/v/@jakkrichm/create-nexus-devflow?style=flat-square&color=155eef" alt="npm version"></a>
  <a href="https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml"><img src="https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml/badge.svg" alt="Validate DevFlow"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/Jakkrich/nexus-devflow?style=flat-square&color=155eef" alt="MIT license"></a>
</p>

<p align="center"><strong>ไทย</strong> | <a href="README.md">English</a></p>

<p align="center">
  <a href="https://github.com/Jakkrich/nexus-devflow">Repository</a> |
  <a href="https://www.npmjs.com/package/@jakkrichm/create-nexus-devflow">npm</a> |
  <a href="https://github.com/Jakkrich/nexus-devflow/releases">Releases</a> |
  <a href="CHANGELOG.md">Changelog</a>
</p>

**Nexus-DevFlow 2.5.0** คือสถาปัตยกรรมเวิร์กโฟลว์ระดับ Enterprise สำหรับการพัฒนาซอฟต์แวร์ร่วมกับ AI Assistant โดยใช้ **The 3-Pillars Workspace Architecture** และ **Single Living Spec Model** แทนที่จะเขียนโค้ดแบบไร้ทิศทาง (Vibe Coding) DevFlow จะนำทาง AI ผ่านวงจรการพัฒนาที่มีสัญญาทางวิศวกรรมชัดเจน บันทึกสถานะเป็นไฟล์ Markdown มีจุดตรวจคุณภาพอัตโนมัติ (Automated Quality Gates) และแสดงผลผ่าน Web Dashboard แบบ Real-Time

ติดตั้งลงใน Git repository ใดๆ ได้ในไม่กี่วินาที:

```bash
npx -y @jakkrichm/create-nexus-devflow@latest -y
```

> [!NOTE]
> Nexus-DevFlow ถูกออกแบบเป็น Workflow Overlay Layer ที่ครอบอยู่บน codebase ของแอปพลิเคชันคุณ เพื่อนำทักษะมัลติเอเจนต์ (`.agents/skills` & `.claude/skills`), อาร์ติแฟกต์ 3 เสาหลัก (`devflow/`), และจุดตรวจ Senior QA ไปยัง AI IDE ที่คุณชื่นชอบ (**Google Antigravity**, **Claude Code**, **OpenAI Codex**, **Cursor**, **GitHub Copilot**, **Gemini CLI**, **Aider**, **OpenCode** และอื่นๆ)

---

## 🏛️ 1. สถาปัตยกรรม 3 เสาหลัก (The 3-Pillars Workspace Architecture)

DevFlow จัดระเบียบบริบททั้งหมดของโปรเจกต์ออกเป็น 3 เสาหลักอย่างสะอาด ชัดเจน และประหยัด Token:

```text
devflow/
│
├── 🔮 ideas.md                 # [1. อนาคต / Future] กล่องบันทึกไอเดียพร้อม AI Scoring (Idea Inbox)
│
├── ⚡ context/                  # [2. ปัจจุบัน / Present] ข้อมูลแกนกลางของระบบ & งานที่กำลังทำ
│   ├── project-overview.md     # Source of Truth สถาปัตยกรรมและ Tech Stack
│   ├── coding-standards.md     # มาตรฐานโค้ด, กฎ Strict TDD และ Test Gates
│   ├── ai-interaction.md       # กฎการทำงานร่วมกับ AI และการตอบภาษาไทย
│   ├── findings.md             # สมุดบันทึก Findings และจุดตรวจคุณภาพ (P0-P3)
│   ├── current-stage.md        # ตัวชี้สถานะของรอบงานปัจจุบัน
│   └── current-feature.md      # The Single Living Spec (สเปกมีชีวิตของงานปัจจุบัน / stub เมื่อว่าง)
│
├── 🏛️ decisions/                # คลังบันทึกการตัดสินใจสถาปัตยกรรม (ADRs: ADR-xxx-slug.md)
│
├── 📦 history/                  # [3. อดีต / Past] คลังประวัติการส่งมอบแยกตามหมวดหมู่ถาวร
│   ├── features/               # ประวัติฟีเจอร์, สถาปัตยกรรม, เครื่องมือ (xxx-slug.md)
│   ├── fixes/                  # ประวัติการแก้บั๊ก, Hotfix, Security patch (xxx-slug.md)
│   ├── rollbacks/              # ประวัติการย้อนคืนฟีเจอร์อย่างปลอดภัย (YYYY-MM-DD-xxx-slug.md)
│   └── HISTORY.md              # สมุดบันทึกประวัติการส่งมอบหลัก (Master Ledger)
│
└── 🔍 discoveries/              # บันทึกการสำรวจก่อนเริ่มงาน (DISC-YYYYMMDD-NNN-slug.md)
```

---

## ⚡ 2. วงจร 4 ขั้นตอนของ Single Living Spec Model

งานพัฒนาทั้งหมด (ตั้งแต่การแก้ UI เล็กๆ ไปจนถึงสถาปัตยกรรมขนาดใหญ่) ขับเคลื่อนผ่านวงจร 4 ขั้นตอนของ Single Living Spec:

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

| ขั้นตอน | คำสั่ง | หน้าที่และรายละเอียด | ไฟล์ผลลัพธ์ (Artifact) |
| :--- | :--- | :--- | :--- |
| **1. กำหนดสเปก (Spec)** | `/feature` หรือ `/fix` | รวมขั้นตอน Discover, Define, Size, Task Breakdown และกำหนด Acceptance Criteria โดยออก Running ID (`xxx-slug`) และสร้าง Living Spec | `devflow/context/current-feature.md` |
| **2. ลงมือสร้าง (Build)** | `/implement` | ดำเนินการตาม Checklist ทีละข้ออย่างเคร่งครัดตามหลัก **Strict TDD (Red-Green-Refactor)** พร้อมบันทึกหลักฐานความเปลี่ยนแปลง | `current-feature.md` (เพิ่มหลักฐาน) |
| **3. ตรวจสอบ (Verify)** | `/check` | สวมบทบาท Senior QA ตรวจสอบหลายมิติ (Typecheck, Lint, Test suites, ตรวจการทำงานจริง) และบันทึกหลักฐานผลการทดสอบ | `current-feature.md` (บันทึกผล QA) |
| **4. ส่งมอบ (Deliver)** | `/complete` | ตรวจความปลอดภัยรอบสุดท้าย, บันทึก Release Digest, ย้าย Living Spec ไปเก็บใน `devflow/history/`, รีเซ็ตสถานะ, และผ่านจุดตรวจ Git Gate | `devflow/history/` & `HISTORY.md` |

### 📄 โครงสร้าง 6 ส่วนมาตรฐานของ Single Living Spec:
1. **🎯 1. Define & Boundaries**: คำอธิบายปัญหา, แนวทางแก้ไข, ขอบเขตของงาน และสิ่งที่ห้ามพังเด็ดขาด
2. **📐 2. Technical Spec & Contracts**: Data contract, API schema, และ Acceptance Criteria ที่ทดสอบได้ (AC-1..AC-N)
3. **📋 3. Execution Plan & TDD Checklist**: ลำดับงานย่อยที่ระบุขั้นตอน `[TDD-Red]`, `[TDD-Green]`, และ `[TDD-Refactor]` ชัดเจน
4. **⚡ 4. Implementation Log & Evidence**: บันทึกการลงมือเขียนโค้ดและหลักฐานผลลัพธ์การทำงานจริง
5. **🧪 5. Multi-Lane Verification Matrix**: ตารางผลการทดสอบเชิงประจักษ์, Benchmark, และการยืนยันบนระบบจริง
6. **📦 6. Release Digest & Retrospective**: บทสรุปการส่งมอบ, การตัดสินใจสถาปัตยกรรมสำคัญ, และบทเรียนที่ได้รับ

---

## 🔮 3. ชุดเครื่องมือ Pre-Flight Discovery & Architectural Alignment

ก่อนที่จะเริ่มลงมือเขียนโค้ดสำหรับงานที่มีความซับซ้อน ใช้ Companion Skills ในการคิด วิเคราะห์ และวางโครงสร้างล่วงหน้า:

```text
/idea (บันทึกไอเดีย) ──▶ /grill (เจาะลึก ADR) ──▶ /discovery (สำรวจระบบ) ──▶ /feature (เริ่มส่งมอบ)
```

- **`/idea`**: บันทึกไอเดียลงใน `devflow/ideas.md` พร้อมระบบ AI ประเมิน Feasibility, Effort, และ Business Value อัตโนมัติ
- **`/grill`** (หรือ **`/align`**): Socratic Alignment & Domain Modeling — ตั้งคำถามเจาะลึกเพื่อทดสอบสมมติฐาน, สกัดศัพท์เฉพาะทางลง `devflow/context/glossary.md`, และสร้าง Architecture Decision Records (`devflow/decisions/ADR-xxx.md`)
- **`/brainstorm`**: การระดมสมองแบบ Divergent และ Convergent เพื่อสร้าง 2–3 ทางเลือกพร้อมตารางเปรียบเทียบข้อดีข้อเสีย (Trade-offs)
- **`/discovery`**: การสำรวจเชิงลึกเพื่อวาง Roadmap หรือศึกษาความเป็นไปได้ก่อนเปิดงาน (`devflow/discoveries/DISC-xxx.md`)

---

## 🌐 4. Enterprise Web Dashboard & Real-Time Studio

เปิดใช้งาน Web Dashboard แบบ Interactive ในเครื่องของคุณ โหลดข้อมูลเร็วระดับเสี้ยววินาทีด้วยเทคโนโลยี SSR และ Single-Flight Cache:

```bash
npm run dashboard
# หรือเรียกผ่าน CLI โดยตรง:
npx @jakkrichm/create-nexus-devflow dashboard
```

```text
+----------------------------------------------------------------------------------------------------+
|  nexus-devflow                                                                                     |
|  D:\Projects\devtools\nexus-devflow                                                                |
|                                                                                                    |
|  [v2.5.0]  [HEALTH OK]  [✔ GATE PASSED]  [✔ IN SYNC]  [TRACK FAST]                                 |
+----------------------------------------------------------------------------------------------------+
|  [🔮 Pre-Flight Discovery]   [⚡ Living Spec · 4 steps]   [🤖 Multi-Agent Swarm]   [🗺️ Code Graph]   |
+----------------------------------------------------------------------------------------------------+
|  [ Card: Current Work ]        |  [ Card: Git & Branch ]                                           |
+--------------------------------+-------------------------------------------------------------------+
|  [ Card: Findings Ledger ]     |  [ Card: Completion & Gate ]                                      |
+----------------------------------------------------------------------------------------------------+
```

### ฟีเจอร์เด่นบน Dashboard:
- ⚡ **0ms First Paint**: Server-Side Hydration (`window.__INITIAL_SNAPSHOT__`) แสดงผลทันทีโดยไม่ต้องรอ API Response
- ⚡ **Single-Flight Git Caching**: ระบบ Coalescing รวมการอ่าน Git หลายๆ ตัวพร้อมกันในรอบเดียว ทำให้เปิดติดเร็วใน **< 120 ms**
- 🤖 **Multi-Agent Swarm Visualizer**: แดชบอร์ดมอนิเตอร์การจัดทัพ AI 4 บทบาท:
  - 👑 **Lead Architect**: ผู้วางขอบเขตสถาปัตยกรรมและ Data Contracts
  - 👨‍💻 **Core Coder**: ผู้เขียนโค้ดที่สะอาดและ Type-Safe ตามมาตรฐาน
  - 🕵️ **QA Verifier**: ผู้ทดสอบอิสระ (Red-Team) ที่เขียน Test ดัก Edge Cases
  - 🛡️ **Security Auditor**: ผู้สแกนหาช่องโหว่ความปลอดภัยและ Secret Leaks
- 🗺️ **Semantic Code Graph RAG**: วิเคราะห์ Dependency Graph และคำนวณผลกระทบการแก้ไขโค้ด (Blast Radius)
- 📋 **Live Kanban Studio**: แผงควบคุม Living Spec และความคืบหน้าของงานแบบ Real-time

---

## 🛠️ 5. ชุดคำสั่งจัดการผ่าน CLI (CLI Commands)

Nexus-DevFlow มีชุดคำสั่ง CLI ครบวงจรสำหรับจัดการ Workspace:

```bash
# เปิด Web Dashboard
npx @jakkrichm/create-nexus-devflow dashboard [--port 4318]

# ตรวจสอบ Quality Gatekeeper และติดตั้ง Git Pre-commit Hooks
npx @jakkrichm/create-nexus-devflow check-gate [--strict]
npx @jakkrichm/create-nexus-devflow hook install pre-commit

# Model Context Protocol (MCP) Server Hub (12 Tools มาตรฐาน)
npx @jakkrichm/create-nexus-devflow mcp

# Just-In-Time (JIT) Dynamic Context Slicing (ตัดเฉพาะ Context ที่จำเป็น)
npx @jakkrichm/create-nexus-devflow slice --stage implement

# ตรวจจับและกู้คืนความคลาดเคลื่อนของไฟล์ใน Git (Git Drift Reconciler)
npx @jakkrichm/create-nexus-devflow drift
npx @jakkrichm/create-nexus-devflow reconcile

# ดูแผนผัง Multi-Agent Swarm และ Code Graph
npx @jakkrichm/create-nexus-devflow swarm
npx @jakkrichm/create-nexus-devflow graph --file src/index.ts

# สร้างรายงานสรุปผลงานแบบ Standalone HTML Dashboard
npm run report:html -- 054-optimize-dashboard-snapshot-latency

# ตรวจสอบและอัปเดตเวอร์ชัน DevFlow พร้อมระบบ Backup ปลอดภัย
npx @jakkrichm/create-nexus-devflow update [--check]
```

---

## 🧪 6. มาตรฐานวิศวกรรมและคุณภาพ (Engineering Standards)

Nexus-DevFlow บังคับใช้วินัยทางวิศวกรรมซอฟต์แวร์ระดับสากล:

1. **Strict TDD Discipline**: ทุก Task ต้องผ่านรอบ `[TDD-Red]` (เขียน Test ที่ล้มเหลวก่อน), `[TDD-Green]` (เขียนโค้ดขั้นต่ำให้ผ่าน), และ `[TDD-Refactor]` (ปรับปรุงโค้ดให้สะอาด)
2. **Two-Stage Review Pattern**:
   - **ด่านที่ 1 (Spec Gate)**: AI จะหยุดรอการรีวิว Spec, ขอบเขต และ Edge Cases จากมนุษย์ก่อนลงมือเขียนโค้ด
   - **ด่านที่ 2 (Delivery Gate)**: มนุษย์ต้องยืนยันการเลือกรูปแบบ Delivery (Squash-Merge หรือ Push PR) ก่อนปิดงานเสมอ
3. **Automated CI Quality Gate**: มีการกำหนดคำสั่ง `Verify` ใน `AGENTS.md` และเชื่อมต่อกับ `.github/workflows/verify.yml` อัตโนมัติ

---

## 🎯 7. AI IDE และเครื่องมือที่รองรับ

Nexus-DevFlow ผสานรวมกับ AI Coding Assistants ชั้นนำทุกค่าย:

| AI Assistant / IDE | ตำแหน่ง Adapter | วิธีการเรียกใช้งาน |
| :--- | :--- | :--- |
| **Google Antigravity** | `.agents/skills/<skill>/` | Slash command (เช่น `/feature`, `/implement`) |
| **Claude Code** | `.claude/skills/<skill>/` | Slash command (เช่น `/feature`, `/implement`) |
| **OpenAI Codex CLI** | `.agents/skills/<skill>/` | Dollar invocation (เช่น `$feature`, `$implement`) |
| **Cursor / GitHub Copilot** | `AGENTS.md` + `.agents/` | พิมพ์เรียกชื่อคำสั่ง Canonical ตามปกติ |
| **OpenCode / Windsurf** | Shared Adapter Trees | เรียกใช้ Skill ได้ทันที |

---

## 📄 สัญญาอนุญาต (License)

MIT © [Jakkrich](https://github.com/Jakkrich)
