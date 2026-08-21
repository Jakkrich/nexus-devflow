<p align="center">
  <img src="docs/logo-nexus-devflow.png" alt="Nexus-DevFlow 2.0" width="120">
</p>

<h1 align="center">Nexus-DevFlow 2.0</h1>

<p align="center"><strong>สถาปัตยกรรม 3 เสาหลัก และเวิร์กโฟลว์ Dual-Track แบบ Spec-Driven สำหรับการพัฒนาซอฟต์แวร์ระดับโปรดักชันร่วมกับ AI</strong></p>

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

**Nexus-DevFlow 2.0** มอบสถาปัตยกรรมเวิร์กโฟลว์ 3 เสาหลัก (**The 3-Pillars Model**) พร้อมการส่งมอบแบบ **Dual-Track Delivery** (Fast-Track 4 ขั้นตอน และ Deep-Track 8 ขั้นตอน) สำหรับสร้างซอฟต์แวร์ร่วมกับ AI Assistant แทนที่จะทำ "Vibe Coding" แบบไร้ทิศทาง DevFlow จะนำทาง AI ผ่านวงจรการพัฒนาที่มีสัญญาทางวิศวกรรมชัดเจน บันทึกสถานะเป็นไฟล์ Markdown และตรวจสอบย้อนกลับได้เสมอ

ติดตั้งลงใน Git repository ใดๆ ที่ scaffold ไว้แล้วได้ทันที:

```bash
npx -y @jakkrichm/create-nexus-devflow@latest -y
```

> [!NOTE]
> Nexus-DevFlow 2.0 ถูกออกแบบเป็น Overlay Layer ที่ครอบอยู่บน codebase ของแอปพลิเคชันคุณ เพื่อนำทักษะมัลติเอเจนต์ (`.agents/skills` & `.claude/skills`), อาร์ติแฟกต์ 3 เสาหลัก (`devflow/`), และจุดตรวจ Senior QA ไปยัง AI IDE ที่คุณชื่นชอบ (Google Antigravity, OpenAI Codex, Claude Code, Cursor, Gemini CLI และอื่นๆ)

---

## 🏛️ สถาปัตยกรรม 3 เสาหลัก (The 3-Pillars Architecture)

DevFlow 2.0 จัดระเบียบบริบททั้งหมดของโปรเจกต์ออกเป็น 3 เสาหลักอย่างสะอาด ชัดเจน และประหยัด Token:

```text
devflow/
│
├── 🔮 ideas.md                 # [1. อนาคต / Future] กล่องบันทึกไอเดียพร้อม AI Scoring (Idea Inbox)
│
├── ⚡ context/                  # [2. ปัจจุบัน / Present] ข้อมูลแกนกลางของระบบ & งานที่กำลังทำ
│   ├── project-overview.md     # Source of Truth สถาปัตยกรรมและ Tech Stack
│   ├── coding-standards.md     # มาตรฐานโค้ด, กฎ TDD และ Test Gates
│   ├── ai-interaction.md       # กฎการทำงานร่วมกับ AI และการตอบภาษาไทย
│   ├── findings.md             # สมุดบันทึก Findings และจุดตรวจคุณภาพ (P0-P3)
│   ├── current-stage.md        # ตัวชี้สถานะของรอบงานปัจจุบัน
│   ├── current-feature.md      # Fast-Track Single Living Spec (สเปกมีชีวิตที่กำลังรัน)
│   └── current-run/            # Deep-Track โฟลเดอร์รันชั่วคราว (ลบออกเมื่อ Release)
│
├── 📦 history/                  # [3. อดีต / Past] คลังประวัติการส่งมอบแยกตามหมวดหมู่ถาวร
│   ├── features/               # ประวัติฟีเจอร์, สถาปัตยกรรม, เครื่องมือ (xxx-slug.md หรือโฟลเดอร์)
│   ├── fixes/                  # ประวัติการแก้บั๊ก, Hotfix, Security patch (xxx-slug.md)
│   ├── rollbacks/              # ประวัติการย้อนคืนฟีเจอร์อย่างปลอดภัย (YYYY-MM-DD-xxx-slug.md)
│   └── HISTORY.md              # ตารางสรุป Master Release History Ledger
│
└── 🔍 discoveries/              # บันทึกผลการสำรวจล่วงหน้าก่อนเริ่มส่งมอบ (00-discover.md)
```

---

## 🏎️ วงจรการส่งมอบแบบ Dual-Track (Dual-Track Delivery)

Nexus-DevFlow 2.0 รองรับ 2 เส้นทางการส่งมอบตามขนาดและความซับซ้อนของงาน:

### 🏎️ Track 1: Fast-Track (Blueprint Mode — 4 ขั้นตอน)
> **แนะนำสำหรับ 85% ของงานประจำวัน** (ฟีเจอร์ทั่วไป, การแก้บั๊ก, ปรับปรุง UI, Refactoring) ขับเคลื่อนด้วย **Single Living Spec (`devflow/context/current-feature.md`)**:

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

1. **`feature` / `fix` (`/feature`, `/fix`)**: รวมขั้นตอน Discover, Define, Spec, Plan ไว้ในขั้นเดียว ตรวจสอบ Single Active Run Guardrail, กำหนดเลข Running ID (`xxx-slug`), และเขียนสเปกลงใน `devflow/context/current-feature.md` (รองรับการดึงไอเดียด้วย `/feature IDEA-xxx`)
2. **`implement` (`/implement`)**: ทยอยเขียนโค้ดตาม Checklist ด้วยวินัย TDD (Red-Green-Refactor) และบันทึกผลลงใน `current-feature.md`
3. **`check` (`/check`)**: ตรวจสอบคุณภาพระดับ Senior QA (Typecheck, Lint, Test suites, ตรวจสอบด้วยมือ) และบันทึกหลักฐานเชิงประจักษ์ลงใน `current-feature.md`
4. **`complete` (`/complete`)**: ตรวจความปลอดภัยรอบสุดท้าย, สรุป Release Digest, ย้ายเข้าคลังประวัติ `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`, รีเซ็ต Stub ว่าง, รวม Git Branch และปิดรอบงาน

---

### 🏗️ Track 2: Deep-Track (Architect Mode — 8 ขั้นตอน)
> **แนะนำสำหรับงานสถาปัตยกรรมขนาดใหญ่, การย้าย Database, Security Audit, และการทำงานร่วมกันของ Multi-Agents**:

```text
00-discover ➔ 10-define ➔ 20-spec ➔ 30-plan ➔ 40-execute ➔ 50-verify ➔ 60-report ➔ 70-release
```

| สเตจ | คำสั่งมาตรฐาน | หน้าที่และผลลัพธ์หลัก |
| :--- | :--- | :--- |
| **00** | `00-discover` | สำรวจความต้องการ, ตอบข้อซักถาม, และตัดสินใจว่าจะเริ่มทำหรือไม่ (`devflow/discoveries/`) |
| **10** | `10-define` | กำหนดขอบเขตการส่งมอบและกำหนด Running ID (`devflow/context/current-run/10-define.md`) |
| **20** | `20-spec` | เขียนสเปกอย่างเป็นทางการและกำหนดเกณฑ์การตรวจรับ Acceptance Criteria (`20-spec.md`) |
| **30** | `30-plan` | แตกสเปกเป็นงานย่อยและสร้าง Checklist สำหรับการพัฒนา (`30-plan.md`) |
| **40** | `40-execute` | ทยอยพัฒนาตามแผนพร้อมบันทึกหลักฐานการทดสอบ Unit Tests (`40-execute.md`) |
| **50** | `50-verify` | ตรวจสอบคุณภาพอย่างละเอียดโดย Senior QA และตัดสินผล Pass/Fail (`50-verify.md`) |
| **60** | `60-report` | สรุปรายงานผลการส่งมอบในรูปแบบ Markdown (`60-report.md`) |
| **70** | `70-release` | แพ็กเกจการส่งมอบ, ย้าย `current-run/` ➔ `devflow/history/{category}/{xxx-slug}/`, รวม Git และปิดรอบ |

---

## 🛠️ คู่มือคำสั่ง CLI และการใช้งาน Terminal

CLI แพ็กเกจ `@jakkrichm/create-nexus-devflow` (Zero Dependency) ช่วยให้คุณบริหารจัดการ DevFlow ได้โดยตรงจาก Terminal:

```bash
# 1. ติดตั้ง DevFlow ลงในโปรเจกต์ปัจจุบัน
npx -y @jakkrichm/create-nexus-devflow@latest -y

# 2. ตรวจสอบสถานะโปรเจกต์, ความคืบหน้างาน, Findings, และคำสั่งแนะนำถัดไป
npx @jakkrichm/create-nexus-devflow status

# แสดงผลเป็น JSON สำหรับระบบ CI/CD
npx @jakkrichm/create-nexus-devflow status --json

# 3. อัปเดต DevFlow ในโปรเจกต์เป็นเวอร์ชันล่าสุดอย่างปลอดภัย
npx @jakkrichm/create-nexus-devflow update

# 4. ถอนการติดตั้ง DevFlow โดยยังคงเก็บประวัติงานเดิมไว้ใน history/
npx @jakkrichm/create-nexus-devflow uninstall --keep-history -y

# หรือถอนการติดตั้งไฟล์ DevFlow ออกทั้งหมดแบบ 100% สะอาด (Eject)
npx @jakkrichm/create-nexus-devflow eject -y
```

---

## 🔄 คู่มือการอัปเกรด (Migration Guide จากเวอร์ชันเก่า / โฟลเดอร์ Runs)

หากโปรเจกต์เดิมของคุณใช้ DevFlow เวอร์ชันเก่า (ที่มีโฟลเดอร์ `devflow/runs/RUN-xxx`) คุณสามารถอัปเกรดเป็น **DevFlow 2.0 (The 3-Pillars Model)** ได้ง่ายๆ:

### วิธีที่ 1: Clean Reinstall (แนะนำที่สุด - สะอาด 100%)
```bash
# 1. ถอนการติดตั้งไฟล์ระบบเดิมออก โดยเก็บประวัติงานไว้
npx @jakkrichm/create-nexus-devflow@latest uninstall --keep-history -y

# 2. ติดตั้ง DevFlow 2.0 เวอร์ชันล่าสุด
npx @jakkrichm/create-nexus-devflow@latest -y

# 3. ให้ AI สแกนโค้ดจริงในโปรเจกต์เพื่อสร้าง Source of Truth
/adopt
```

### วิธีที่ 2: In-Place Update (อัปเดตทับ)
```bash
# 1. รันคำสั่งอัปเดต
npx @jakkrichm/create-nexus-devflow@latest update

# 2. ย้ายโฟลเดอร์งานเก่าจาก devflow/runs/RUN-xxx ไปไว้ที่ devflow/history/features/xxx-slug
# 3. ลบโฟลเดอร์ devflow/runs/ ที่ว่างเปล่าออก
# 4. ให้ AI ซิงก์บริบทใหม่
/overview
```

---

## 🌐 คำสั่งผู้ช่วยเฉพาะทาง (Companion Commands)

| คำสั่งมาตรฐาน | หน้าที่ |
| :--- | :--- |
| `devflow` | นำทางกระบวนการ, ตรวจสอบสถานะโปรเจกต์, และแนะนำคำสั่งถัดไป |
| `doctor` | ตรวจสอบสุขภาพของระบบ, สคริปต์, อะแดปเตอร์ และความสมบูรณ์ของเวิร์กโฟลว์ |
| `overview` | สกัดแผนงานเป็น `project-overview.md` เพื่อเป็น Single Source of Truth |
| `idea` | จดบันทึกไอเดียเร็วๆ พร้อม AI ช่วยวิเคราะห์คะแนนความคุ้มค่าลง `devflow/ideas.md` |
| `debug` | ค้นหาสาเหตุของบั๊กอย่างเป็นระบบก่อนลงมือแก้ไขโค้ด |
| `onboard` | สำรวจเทคโนโลยีและตั้งค่าเริ่มต้นสำหรับโปรเจกต์ใหม่ |
| `adopt` | สำรวจโค้ดเดิมและดึง DevFlow เข้าไปทำงานร่วมกับโปรเจกต์เดิมที่มีอยู่แล้ว |
| `try` | คู่มือการทดสอบด้วยมือทีละขั้นตอนสำหรับมนุษย์ (ต้องไปที่ไหน, คลิกอะไร, คาดหวังผลลัพธ์แบบใด) |
| `rollback` | วางแผนย้อนคืนฟีเจอร์อย่างปลอดภัยพร้อมวิเคราะห์ความเสี่ยงของ Dependency |
| `ci` | ตั้งค่าและสร้าง GitHub Actions Workflow สำหรับตรวจสอบคุณภาพอัตโนมัติ |
| `test` | ตรวจสอบชุดทดสอบและตั้งค่า Test Runner |
| `brief` | ดูสรุปขอบเขตและขนาดของฟีเจอร์ก่อนเริ่มเขียนสเปก |
| `autopilot` | โหมดทำงานอัตโนมัติแบบกำหนดขอบเขต (Spec -> Implement -> Check) |
| `prototype` | สร้าง Mockup HTML/CSS จำลองหน้าตา UI ก่อนลงมือเขียนโค้ดจริง |
| `report-html` | สร้าง Dashboard สรุปผลแบบ HTML Interactive (`/report:html`) |

---

## 🔌 การรองรับตัวเชื่อมต่อ AI (Tool Adapters)

| AI Assistant / IDE | ตำแหน่ง Adapter | รูปแบบการเรียกใช้งานที่รองรับ |
| :--- | :--- | :--- |
| **Google Antigravity** | `.agents/skills/<skill>/SKILL.md` | เรียกด้วยชื่อ (`feature`, `devflow`), ใช้ Slash (`/feature`), หรือภาษาธรรมชาติ |
| **OpenAI Codex** | `.agents/skills/<skill>/SKILL.md` | เรียกด้วยชื่อ (`feature`), ใช้ Dollar sign (`$feature`), หรือภาษาธรรมชาติ |
| **Claude Code** | `.claude/skills/<skill>/SKILL.md` | เรียกด้วยชื่อ (`feature`), ใช้ Slash (`/feature`), หรือภาษาธรรมชาติ |
| **Cursor / Gemini / Aider** | `AGENTS.md` / `CLAUDE.md` | เรียกตามชื่อคำสั่งหรือภาษาธรรมชาติที่อ้างอิง `AGENTS.md` |

---

## 📜 ใบอนุญาต (License)

โปรเจกต์นี้เผยแพร่ภายใต้สัญญาอนุญาต [MIT License](LICENSE)
