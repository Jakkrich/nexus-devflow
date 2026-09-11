# 🧭 Discovery Document: [DISC-20260822-005] Cloud Deployment Readiness & Config Generator Skill (`/release`)

> **Discovery ID**: `DISC-20260822-005`  
> **Source**: Intake from `[IDEA-010]` in `devflow/ideas.md`  
> **Date**: 2026-08-22  
> **Status**: `Proceed (Approved for Delivery)`  
> **Target Track**: Fast-Track (Blueprint Mode - `/feature`) or Deep-Track (`10-define`)  

---

## 1. Problem Statement & Motivation
หลังจากที่ทีมพัฒนาฟีเจอร์หรือแอปพลิเคชันจนผ่านการทดสอบภายในเครื่อง (Local Verification) และปิดรอบด้วย `/complete` เรียบร้อยแล้ว ขั้นตอนถัดไปที่สำคัญคือการเตรียมความพร้อมสำหรับการ Deploy ขึ้นสู่ Cloud Production (เช่น Render หรือ Vercel)

ปัจจุบัน DevFlow มีกระบวนการส่งมอบงานระดับโค้ด (`/complete` ใน Fast-Track และ `70-deliver` สำหรับ Deep-Track History Packaging) แต่ยังขาด **Dedicated Deployment Readiness & Config Generator Skill (`/release`)** ซึ่งทำหน้าที่:
1. วิเคราะห์ Stack, Architecture, Runtime, Environment Variables, และ Build/Start Commands ของโปรเจกต์
2. แนะนำ Cloud Provider และรูปแบบ Service ที่เหมาะสม (เช่น Render Web Service/Static/Worker vs. Vercel Framework/Serverless)
3. เจนเนอเรตและอัปเดตไฟล์คอนฟิกสำหรับการ Deploy ในเครื่องเฉพาะที่จำเป็น (`render.yaml`, `vercel.json`, `.env.example`)
4. ดำเนินการตรวจสอบความพร้อมในเครื่องแบบ Non-destructive (Build, Tests, Output Verification, Health Check Path)
5. สรุปเป็น **Deployment Readiness Packet** พร้อมวางแนวทางการทำ Smoke Test และหยุดรอการยืนยันจากมนุษย์ก่อนดำเนินการใดๆ ที่ส่งผลกระทบต่อรีโมตหรือระบบภายนอก (Strict Safety Gate)

---

## 2. Exploration Lenses & Technical Analysis

### A. Core Workflow & Responsibilities
```text
/complete (Feature finished) ──▶ [/release] (Readiness inspection, Local config & checks) ──▶ Deploy (Human explicit approval)
```

- **Scope & Inputs**:
  - `release` (ไม่มี argument): ตรวจสอบโปรเจกต์และแนะนำ Render หรือ Vercel ตามความเหมาะสม
  - `release render`: ตรวจสอบและสร้างคอนฟิกสำหรับ Render (`render.yaml`)
  - `release vercel`: ตรวจสอบและสร้างคอนฟิกสำหรับ Vercel (`vercel.json`)
  - `release check`: ตรวจสอบความพร้อมและสร้างรายงาน Deployment Readiness Report (Read-only)
  - `release config`: มุ่งเน้นการสร้าง/อัปเดตไฟล์คอนฟิกเฉพาะที่จำเป็น

- **5-Step Deployment Readiness Protocol**:
  1. **Read & Inspect**: อ่าน `AGENTS.md`, `project-overview.md`, `package.json`, `.env.example`, framework configs, output directories, commands, และ env vars (ระบุเฉพาะชื่อตัวแปร ห้ามพิมพ์หรือบันทึก Secret values โดยเด็ดขาด)
  2. **Choose Provider Shape**:
     - *Render*: Static Site, Web Service, Background Worker, Cron Job, Database
     - *Vercel*: Framework Auto-detect, Static Output, Serverless/Edge Functions, Monorepo
  3. **Verify Local Readiness**: รันคำสั่ง Local build, test, และ smoke test endpoints ที่ปลอดภัย
  4. **Prepare Local Config**: สร้าง/ปรับแต่ง `render.yaml`, `vercel.json`, และซิงก์ `.env.example`
  5. **Report Release Packet**: รายงานสรุป Target, Shape, Config changes, Checks run, Env needed, Smoke test path, Blockers, และ Next action

### B. Strict Safety & Guardrails Policy
- `/release` เป็นขั้นตอนเตรียมความพร้อมและสร้างคอนฟิกในเครื่อง **ไม่ใช่คำสั่ง Deploy อัตโนมัติ**
- **ห้าม** ยิง API ขึ้น Cloud, สร้าง Remote Service, ตั้งค่า Remote Environment Variables, Push, หรือ Publish ใดๆ จนกว่าผู้ใช้จะพิมพ์ยืนยันอย่างชัดเจนในแชตปัจจุบัน
- **ห้าม** พิมพ์หรือบันทึก Secret / API Key / Password ลงในไฟล์หรือหน้าจอแชตเด็ดขาด

### C. Skill Adapter Locations & Integrations
- `.agents/skills/release/SKILL.md` (สำหรับ Antigravity, Codex, Copilot, Cursor)
- `.claude/skills/release/SKILL.md` (สำหรับ Claude Code)
- อัปเดต `companionCommands` ใน `.nexus/nexus-devflow.json`
- ตรวจสอบความเข้ากันได้กับ `scripts/validate-framework.ts`

---

## 3. Trade-off Comparison Table

| Approach | ข้อดี (Pros) | ข้อจำกัด (Cons) | ข้อสรุป / คำแนะนำ |
| :--- | :--- | :--- | :--- |
| **Option A: Dedicated Multi-Provider Deployment Skill (`/release`) (แนะนำ)** | - รองรับทั้ง Render และ Vercel ครอบคลุม Web, API, Worker<br>- สร้างคอนฟิกมาตรฐานแบบ Lean (`render.yaml`, `vercel.json`)<br>- มี Safety Gate รัดกุม ป้องกันอุบัติเหตุด้าน Security | - ต้องทดสอบตรวจจับ Framework หลายประเภท | **เลือกแนวทางนี้ (Recommended)** |
| **Option B: One-click Auto Deploy Command** | - รวดเร็ว | - มีความเสี่ยงสูงมากเรื่อง Secret Leaks และการสร้าง Resource ผิดพลาดบน Cloud โดยที่ผู้ใช้ไม่ได้ตรวจสอบก่อน | ไม่ปลอดภัย ขัดกับหลักการ Human-in-the-loop |
| **Option C: Static Markdown Checklist Template Only** | - สร้างง่าย | - ผู้ใช้ต้องไปค้นหาวิธีเขียนคอนฟิกเอง ขาดความช่วยเหลืออัตโนมัติในการวิเคราะห์ Stack | ขาดความเป็น Agentic Automation |

---

## 4. Decision & Next Step

### Final Decision: `Proceed` ✅
การเพิ่มทักษะ `/release` ช่วยเติมเต็มกระบวนการ Post-Delivery Lifecycle ให้สมบูรณ์แบบ ทำให้ผู้ใช้และ AI Agent สามารถเตรียมโปรเจกต์ให้พร้อมสำหรับการ Deploy ขึ้น Cloud Production ได้อย่างมั่นใจ ปลอดภัย และถูกต้องตามมาตรฐาน

### Recommended Next Action:
- สามารถเริ่มพัฒนาได้ทันทีด้วย Fast-Track:
  ```bash
  /feature IDEA-010
  ```
  หรือกำหนดการจัดส่งแบบ Deep-Track:
  ```bash
  10-define DISC-20260822-005-cloud-deployment-readiness
  ```
