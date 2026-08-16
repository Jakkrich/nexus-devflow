# Nexus-DevFlow 2.0 (ภาษาไทย)

> **Agentic Workflow Layer สำหรับการพัฒนาซอฟต์แวร์ระดับ Production ร่วมกับ AI อย่างมีระเบียบ**

[English](README.md) | **ไทย**

[Repository](https://github.com/Jakkrich/nexus-devflow) | [npm](https://www.npmjs.com/package/@jakkrichm/create-nexus-devflow) | [Releases](https://github.com/Jakkrich/nexus-devflow/releases) | [Changelog](CHANGELOG.md)

---

## สรุปการใช้งานด่วน (Quick Start)

ติดตั้งหรือทาบ (Overlay) **Nexus-DevFlow** ลงในโปรเจกต์ Git ใดๆ ได้ง่ายๆ ผ่าน `npx`:

```bash
# ทาบลงในโปรเจกต์ปัจจุบัน
npx @jakkrichm/create-nexus-devflow

# ทาบลงในโฟลเดอร์ระบุ
npx @jakkrichm/create-nexus-devflow ./my-app

# ระบุ AI Tool Adapter ที่ต้องการ (codex, antigravity, claude, หรือ both)
npx @jakkrichm/create-nexus-devflow --adapter both
```

---

## Nexus-DevFlow คืออะไร?

**Nexus-DevFlow** คือ Workflow Layer แบบกำหนดสเตจ (Stage-Based Workflow) ออกแบบมาสำหรับ AI Coding Assistants (Google Antigravity, OpenAI Codex, Claude Code, Cursor, Gemini CLI, Aider, และ Zed)

ช่วยให้การพัฒนาโค้ดร่วมกับ AI มีระเบียบ ตรวจสอบได้ทุกขั้นตอน ผ่านวงจรชีวิต 8 สเตจหลัก:

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release
```

### สเตจหลักในกระบวนการทำงาน (Mainline Lifecycle):
1. **`/00-Discover`**: สำรวจคำขอ รวบรวมข้อมูลสนับสนุน และตัดสินใจเริ่มต้นงานภายใต้ Discovery ID (`devflow/discoveries/...`)
2. **`/10-Define`**: กำหนดขอบเขตการส่งมอบและออก Running ID (`devflow/runs/{RUNNING_ID}/10-define.md`)
3. **`/20-Spec`**: จัดทำสเปกข้อตกลงและเกณฑ์ยอมรับในรูปแบบ Markdown-first (`20-spec.md`)
4. **`/30-Plan`**: แปลงสเปกเป็นรายการงานย่อยที่ลงมือทำได้ (`30-plan.md`)
5. **`/40-Implement`**: ลงมือเขียนโค้ดตามแผนงานพร้อมบันทึกหลักฐาน (`40-implement.md`)
6. **`/50-Verify`**: ตรวจสอบคุณภาพและความถูกต้องโดย Senior QA (`50-verify.md`)
7. **`/60-Report`**: จัดทำรายงานสรุปผลการรันทั้งในรูปแบบ Markdown และ HTML (`60-report.md`, `60-report.html`)
8. **`/70-Release`**: แพ็กเกจผลงานที่ผ่านการยืนยันเพื่อรวมโค้ด (PR) หรือ Deploy ขึ้นใช้งานจริง (`70-release.md`)

---

## คำสั่งสนับสนุน (Public Companion Commands)

คำสั่งสนับสนุนเสริมสำหรับการระบุบริบทโดยไม่กระทบกับลำดับสเตจหลัก:

- `Goal`: จัดการเป้าหมายระดับสูงก่อนเข้า Discover
- `Brainstorm`: ตกผลึกไอเดียใหม่ๆ
- `Research`: ค้นคว้าข้อมูลเชิงลึกในโปรเจกต์หรือจากเว็บ
- `Debug`: สืบหาต้นตอข้อผิดพลาด (Root Cause Investigation)
- `PRD`: จัดทำกรอบผลิตภัณฑ์ก่อนการส่งมอบ
- `Issue-Triage`: คัดกรองรายการบั๊กหรือข้อผิดพลาดเข้าสู่ระบบ
- `Security-Review`: ตรวจสอบความปลอดภัยระดับความเสี่ยงสูง
- `Wiki`: จัดการคลังความรู้ภายใต้ `devflow/wiki/`
- `Check-For-Updates`: ตรวจสอบและอัปเดตเวอร์ชัน DevFlow
- `Help`: คู่มือช่วยเหลือและนำทางไปสเตจที่ถูกต้อง

---

## เครื่องมือรองรับ (Tool-Specific Adapters)

- **`AGENTS.md`**: จุดเริ่มต้นหลักสำหรับ Codex, Google Antigravity, Cursor, Gemini CLI, Aider, และ Zed
- **`CLAUDE.md`**: นำเข้า `@AGENTS.md` สำหรับ Claude Code
- **`.agents/skills/`**: โฟลเดอร์เก็บขั้นตอนงานและทักษะสำหรับ Codex & Google Antigravity
- **`.claude/skills/`**: โฟลเดอร์เก็บขั้นตอนงานที่ซิงค์สำหรับ Claude Code

---

## ใบอนุญาต (License)

MIT License — Copyright (c) 2026 Nexus-DevFlow Contributors / Jakkrich
