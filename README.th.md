<p align="center">
  <img src="docs/logo-nexus-devflow.png" alt="Nexus-DevFlow 2.0" width="120">
</p>

<h1 align="center">Nexus-DevFlow 2.0</h1>

<p align="center"><strong>เวิร์กโฟลว์ระดับขั้นแบบ Spec-Driven สำหรับการพัฒนาซอฟต์แวร์ระดับโปรดักชันร่วมกับ AI โดยที่คุณควบคุมได้ทุกขั้นตอน</strong></p>

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

**Nexus-DevFlow 2.0** มอบสถาปัตยกรรมเวิร์กโฟลว์ 8 ขั้นตอน (`/00-Discover` ถึง `/70-Release`) สำหรับสร้างซอฟต์แวร์ร่วมกับ AI Assistant แทนที่จะทำ "Vibe Coding" แบบไม่มีโครงสร้าง DevFlow จะนำทาง AI ผ่านวงจรการพัฒนาที่มีโครงสร้างชัดเจน บันทึกสถานะเป็นไฟล์ Markdown และตรวจสอบย้อนกลับได้เสมอ

ติดตั้งลงใน Git repository ใดๆ ที่ scaffold ไว้แล้วได้ทันที:

```bash
npx @jakkrichm/create-nexus-devflow
```

> [!NOTE]
> Nexus-DevFlow 2.0 ถูกออกแบบเป็น Overlay Layer ที่ครอบอยู่บน codebase ของแอปพลิเคชันคุณ เพื่อนำทักษะมัลติเอเจนต์ (`.agents/skills` & `.claude/skills`), อาร์ติแฟกต์ประจำขั้น (`devflow/`), และจุดตรวจ Senior QA ไปยัง AI IDE ที่คุณชื่นชอบ (Google Antigravity, OpenAI Codex, Claude Code, Cursor, Gemini CLI และอื่นๆ)

## นี่คืออะไร

"Vibe Coding" ที่ไร้โครงสร้างมักนำไปสู่โค้ดที่ซับซ้อนเกินควบคุม, บั๊กซ่อนแฝง, และปัญหา Context หลุดเมื่อสนทนายาวขึ้น

DevFlow สร้างระบบควบคุมและกระบวนการวิศวกรรมซอฟต์แวร์ที่เข้มงวดสำหรับการพัฒนาด้วย AI:

1. **สายหลัก 8 ขั้นตอนที่ชัดเจน.** ลำดับขั้นตั้งแต่การค้นหาความต้องการ (`/00-Discover`), กำหนดขอบเขต (`/10-Define`), เขียนสเปก (`/20-Spec`), วางแผน (`/30-Plan`), ลงมือพัฒนา (`/40-Implement`), ตรวจสอบคุณภาพ (`/50-Verify`), สรุปรายงาน (`/60-Report`), จนถึงการส่งมอบ (`/70-Release`)
2. **สถานะเก็บเป็น Markdown (Markdown-First).** ทุกขั้นตอนสร้างไฟล์ Markdown ถาวรใต้ `devflow/discoveries/` และ `devflow/runs/{RUNNING_ID}/` งานของคุณจึงไม่สูญหายแม้ context ถูกล้าง
3. **ตัวเชื่อมต่อ Dual Adapters.** รองรับทักษะ native สำหรับ OpenAI Codex & Google Antigravity (`.agents/skills/`) และ Claude Code (`.claude/skills/`)
4. **จุดตรวจ Senior QA และรายงาน.** ขั้นตอน `/50-Verify` จะทำการตรวจสอบคุณภาพด้วย automated tests และ specialist review ก่อนสร้างรายงานสรุปทั้งแบบ HTML และ Markdown (`/60-Report`)

## ภาพรวมแบบย่อ

| หลักการ | ความหมาย |
| --- | --- |
| **สายหลักเป็นขั้นเป็นตอน** | การลำดับงานเป็นเส้นตรง (`/00-Discover` ➔ `/70-Release`) ประกันคุณภาพระดับวิศวกรรมซอฟต์แวร์ |
| **สถานะเก็บใน Markdown** | สเปก แผน บันทึกการพัฒนา และคำตัดสิน QA อยู่ในไฟล์ Markdown ที่อ่านง่ายใต้ `devflow/` |
| **ตัวเชื่อมต่อ Dual Adapters** | ใช้ `.agents/skills` ร่วมกันสำหรับ Codex & Antigravity และ `.claude/skills` สำหรับ Claude Code |
| **คำสั่งผู้ช่วย (Companions)** | ผู้ช่วยเฉพาะทาง (`Brainstorm`, `PRD`, `Debug`, `Research`, `Security-Review`, `Issue-Triage`) สนับสนุนสายหลักโดยไม่ทำให้ลำดับขั้นตอนเสียไป |
| **การตรวจสอบอัตโนมัติ** | การรัน test, การตรวจความสมบูรณ์ของเฟรมเวิร์ก และ static contract ป้องกันปัญหางานถอยหลัง (Regression) |

## สารบัญ

- [นี่คืออะไร](#นี่คืออะไร)
- [ภาพรวมแบบย่อ](#ภาพรวมแบบย่อ)
- [เริ่มต้นอย่างรวดเร็ว](#เริ่มต้นอย่างรวดเร็ว)
- [วงจรสายหลัก (Mainline Timeline Workflow)](#วงจรสายหลัก-mainline-timeline-workflow)
- [คำสั่งผู้ช่วยเฉพาะทาง (Companion Commands)](#คำสั่งผู้ช่วยเฉพาะทาง-companion-commands)
- [การรองรับตัวเชื่อมต่อ AI (Tool Adapters)](#การรองรับตัวเชื่อมต่อ-ai-tool-adapters)
- [โครงสร้างอาร์ติแฟกต์ในพื้นที่ทำงาน](#โครงสร้างอาร์ติแฟกต์ในพื้นที่ทำงาน)
- [การอัปเดต DevFlow](#การอัปเดต-devflow)
- [เอกสารและคู่มืออ้างอิง](#เอกสารและคู่มืออ้างอิง)
- [ใบอนุญาต](#ใบอนุญาต)

## เริ่มต้นอย่างรวดเร็ว

### 1. ติดตั้ง Overlay ลงในโปรเจกต์ของคุณ

Scaffold แอปพลิเคชันของคุณก่อน (เช่น Next.js, Vite, FastAPI ฯลฯ) จากนั้นเปิด terminal ในโฟลเดอร์ Git repository แล้วรันคำสั่ง:

```bash
npx @jakkrichm/create-nexus-devflow
```

คุณสามารถระบุโฟลเดอร์เป้าหมายหรือเลือกตัวเชื่อมต่อ AI เฉพาะได้:

```bash
# ระบุไดเรกทอรีเป้าหมาย
npx @jakkrichm/create-nexus-devflow ./my-app

# ระบุตัวเชื่อมต่อ AI (codex, antigravity, claude, หรือ both)
npx @jakkrichm/create-nexus-devflow --adapter both
```

### 2. สั่งเปิดใช้งาน DevFlow ใน AI Assistant

เปิดโปรเจกต์ของคุณใน AI Assistant ของคุณ (Google Antigravity, OpenAI Codex, Claude Code ฯลฯ) แล้วรันคำสั่งเปิดตัวหลัก:

```text
/devflow
```

> **คำแนะนำ:** `/devflow` คือคำสั่งเปิดตัวหลักของระบบ ทำหน้าที่สำรวจสถานะของพื้นที่ทำงาน ตรวจสอบความสมบูรณ์ของเฟรมเวิร์ก และนำทางคุณไปยังคำสั่งถัดไปที่เหมาะสมที่สุดทันที (`/00-Discover`, `/10-Define`, `/40-Implement`, `/50-Verify` ฯลฯ)

หรือเริ่มต้นขั้นตอนค้นหาความต้องการโดยตรงด้วยคำสั่ง:

```text
/00-Discover
```

## วงจรสายหลัก (Mainline Timeline Workflow)

```text
/00-Discover ➔ /10-Define ➔ /20-Spec ➔ /30-Plan ➔ /40-Implement ➔ /50-Verify ➔ /60-Report ➔ /70-Release
```

| ขั้นตอน | คำสั่ง | วัตถุประสงค์ & อาร์ติแฟกต์ |
| --- | --- | --- |
| **00** | `/00-Discover` | สำรวจความต้องการ คัดกรองและตัดสินใจว่าควรส่งมอบงานหรือไม่ (`devflow/discoveries/`) |
| **10** | `/10-Define` | ล็อกขอบเขตการส่งมอบและกำหนด Running ID (`devflow/runs/{RUNNING_ID}/10-define.md`) |
| **20** | `/20-Spec` | เขียนสเปกและเกณฑ์การรับมอบงานอย่างเป็นทางการ (`20-spec.md`) |
| **30** | `/30-Plan` | แปลงสเปกเป็นขั้นตอนงานที่ลงมือทำได้พร้อมรายการเช็กลิสต์ (`30-plan.md`) |
| **40** | `/40-Implement` | ลงมือพัฒนาตามแผนทีละขั้นตอนพร้อมบันทึกหลักฐาน (`40-implement.md`) |
| **50** | `/50-Verify` | ตรวจสอบคุณภาพโดย Senior QA รันการทดสอบและตัดสินผลลัพธ์ (`50-verify.md`) |
| **60** | `/60-Report` | สรุปรายงานมาตรฐานทั้งไฟล์ Markdown และ HTML แบบอ่านง่าย (`60-report.md`, `60-report.html`) |
| **70** | `/70-Release` | แพ็กเกจงานที่ผ่านการตรวจสอบแล้วสำหรับ Merge, PR หรือส่งมอบ Deploy (`70-release.md`) |

## คำสั่งผู้ช่วยเฉพาะทาง (Companion Commands)

คำสั่งผู้ช่วยให้การสนับสนุนเฉพาะทางแก่สายหลัก โดยไม่ทำให้ลำดับขั้นตอนเสียไป:

| คำสั่งผู้ช่วย | วัตถุประสงค์ |
| --- | --- |
| `Brainstorm` | ระดมความคิดและสำรวจแนวคิดโดยยังไม่เปิด Running ID |
| `PRD` | จัดทำเอกสารข้อกำหนดผลิตภัณฑ์ (PRD) ก่อนลงมือกำหนดการส่งมอบ |
| `Research` | วิจัยค้นคว้า codebase หรือค้นหาข้อมูลเว็บเพื่อสนับสนุนขั้น Discover และ Spec |
| `Debug` | วินิจฉัยหาสาเหตุของบั๊กก่อนหรือระหว่างการพัฒนา |
| `Security-Review` | ตรวจสอบความปลอดภัยระดับเข้มงวดสำหรับโค้ด, diff หรือสถาปัตยกรรม |
| `Issue-Triage` | รับเรื่อง คัดกรอง และตรวจสอบปัญหาบั๊กที่ได้รับแจ้ง |
| `Wiki` | จัดการคลังความรู้โปรเจกต์ใต้ `devflow/wiki/` |
| `Help` | แนะนำขั้นตอน นำทางคำสั่ง และผังกระบวนการ |

## การรองรับตัวเชื่อมต่อ AI (Tool Adapters)

| เครื่องมือ | พาธตัวเชื่อมต่อ | วิธีเรียกใช้งาน |
| --- | --- | --- |
| **Google Antigravity** | `.agents/skills/<skill>/SKILL.md` | Slash commands (เช่น `/00-Discover`, `/20-Spec`, `/40-Implement`) |
| **OpenAI Codex** | `.agents/skills/<skill>/SKILL.md` | `$00-discover`, `$20-spec` หรือภาษาธรรมชาติ |
| **Claude Code** | `.claude/skills/<skill>/SKILL.md` | Slash commands (เช่น `/00-Discover`, `/10-Define`, `/50-Verify`) |
| **Cursor / Gemini / Aider** | `AGENTS.md` / `CLAUDE.md` | คำสั่งภาษาธรรมชาติโดยอ้างอิงแนวทางใน `AGENTS.md` |

## โครงสร้างอาร์ติแฟกต์ในพื้นที่ทำงาน

DevFlow 2.0 จัดเก็บอาร์ติแฟกต์ที่เป็นระเบียบอ่านง่ายใต้ `devflow/`:

```text
devflow/
├── context/
│   ├── project-overview.md     # แหล่งข้อมูลหลักบริบทโปรเจกต์
│   ├── coding-standards.md     # มาตรฐานและข้อตกลงการเขียนโค้ด
│   ├── ai-interaction.md       # ค่ากำหนดการทำงานของ AI
│   └── findings.md             # ทะเบียนบันทึกข้อค้นพบการตรวจสอบคุณภาพ
├── discoveries/                # อาร์ติแฟกต์ช่วงค้นหาความต้องการ (00-discover.md)
├── runs/                       # อาร์ติแฟกต์การส่งมอบแยกตาม Running ID
│   └── {RUNNING_ID}-{slug}/
│       ├── 10-define.md
│       ├── 20-spec.md
│       ├── 30-plan.md
│       ├── 40-implement.md
│       ├── 50-verify.md
│       ├── 60-report.md
│       ├── 60-report.html
│       └── 70-release.md
├── research/                   # คลังข้อมูลการวิจัยค้นคว้า
├── prds/                       # เอกสาร PRD ข้อกำหนดผลิตภัณฑ์
├── debug/                      # รายงานการวินิจฉัยสาเหตุของปัญหา
└── reports/                    # รายงานสรุปภาพรวมมาตรฐาน
```

## การอัปเดต DevFlow

อัปเดตโครงสร้าง DevFlow ในโปรเจกต์ของคุณให้เป็นปัจจุบันเสมอ:

```bash
# ตรวจสอบการเปลี่ยนแปลงก่อนอัปเดตจริง
npx @jakkrichm/create-nexus-devflow update --dry-run

# ดำเนินการอัปเดต
npx @jakkrichm/create-nexus-devflow update
```

ตัวอัปเดตจะจัดการเฉพาะไฟล์เฟรมเวิร์กของ DevFlow ภายใต้ `.agents/skills/`, `.claude/skills/`, และ `devflow/reference/` โดยจะเก็บรักษาโค้ด บริบท และประวัติการทำงานของโปรเจกต์คุณไว้อย่างปลอดภัย

## เอกสารและคู่มืออ้างอิง

- [คู่มือเริ่มต้นอย่างรวดเร็ว (Quick Start)](docs/quickstart.md)
- [คู่มือการใช้งานและวงจรชีวิต (Usage Guide)](docs/USAGE.md)
- [ข้อกำหนดอาร์ติแฟกต์ในพื้นที่ทำงาน (Workspace Artifacts)](docs/workspace-artifacts.md)
- [แผนผังหน้างานคำสั่ง (Workflow Surface Map)](docs/workflow-surface-map.md)
- [สเปกเวิร์กโฟลว์การตรวจทานด้วยคน (Manual Review Spec)](docs/manual-review-workflow-spec.md)
- [กฎเกณฑ์การบริหารจัดการ (Governance Rules)](docs/governance-rules.md)

## ใบอนุญาต

โปรเจกต์นี้อยู่ภายใต้ใบอนุญาต [MIT License](LICENSE)
