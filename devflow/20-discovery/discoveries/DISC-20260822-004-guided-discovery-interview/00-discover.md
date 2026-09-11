# 🧭 Discovery Document: [DISC-20260822-004] Guided Discovery Interview Skill (`/discovery`)

> **Discovery ID**: `DISC-20260822-004`  
> **Source**: Intake from `[IDEA-009]` in `devflow/ideas.md`  
> **Date**: 2026-08-22  
> **Status**: `Proceed (Approved for Delivery)`  
> **Target Track**: Fast-Track (Blueprint Mode - `/feature`) or Deep-Track (`10-define`)  

---

## 1. Problem Statement & Motivation
หลังจากที่ DevFlow ได้เปิดตัวการรองรับ **User-Owned Planning Documents** (`devflow/project-plan.md` และ `devflow/build-plan.md`) ในรอบส่งมอบ `033` ผู้ใช้งานที่เริ่มต้นสร้างโปรเจกต์ใหม่จากศูนย์ หรือมีไอเดียตั้งต้นแบบคร่าวๆ มักต้องการผู้ช่วยในการคิดและตกผลึกความต้องการ (Ideation & Discovery) 

ปัจจุบัน DevFlow มีกระบวนการ `/00-discover` สำหรับสำรวจงานระดับฟีเจอร์/ไอเดีย แต่ยังขาด **Guided Project Discovery Skill (`/discovery`)** ซึ่งเป็นบทสนทนาสัมภาษณ์แบบหลายรอบ (Multi-turn Interactive Interview) เพื่อช่วยวางแผนโครงสร้างสถาปัตยกรรมระดับโปรเจกต์ (Vision, Tech Stack, Milestones, Phased Roadmap) และร่างออกมาเป็น `project-plan.md` และ `build-plan.md` ก่อนจะส่งต่อไปยัง `/overview`

---

## 2. Exploration Lenses & Technical Analysis

### A. Conversational & Multi-Turn Interview Protocol
- **Adaptive Questioning**: ถามทีละ 1-2 คำถามที่กระชับและตรงจุด โดยปรับเปลี่ยนตามคำตอบของผู้ใช้ ไม่ถามรวดเดียวเป็นแบบสอบถามยาวๆ
- **Core Interview Pillars (4 เสาหลักของการสำรวจ)**:
  1. **Product Vision & Persona**: ใครคือผู้ใช้ ปัญหาที่แท้จริงคืออะไร และความสำเร็จของโปรเจกต์วัดจากอะไร
  2. **Technical Architecture & Stack**: เฟรมเวิร์ก, ภาษา, ฐานข้อมูล, API Contracts, Third-party integrations
  3. **Constraints & Non-Goals**: สิ่งที่ไม่ทำในระยะแรก (Out-of-Scope), ข้อจำกัดด้านเวลาหรือทรัพยากร
  4. **Phased Roadmap & Sizing**: การแบ่งฟีเจอร์ออกเป็นลำดับขั้นตอน (Phases) พร้อมประเมินขนาดงาน (`XS`, `S`, `M`, `L`, `XL`) และ Dependencies
- **Drafting & Confirmation Gate**: สรุปประเด็นทั้งหมดให้ผู้ใช้ตรวจสอบและอนุมัติก่อนเขียนลงไฟล์ `project-plan.md` และ `build-plan.md`
- **Handoff to Overview**: หลังสร้างแผนงานเสร็จสมบูรณ์ แนะนำให้ผู้ใช้รัน `/overview` เพื่อกลั่นกรองแผนงานลงสู่ `devflow/context/project-overview.md`

### B. Skill Adapter Scope
- `.agents/skills/discovery/SKILL.md` (สำหรับ Antigravity, Codex, Copilot, Cursor)
- `.claude/skills/discovery/SKILL.md` (สำหรับ Claude Code)
- การทำงานร่วมกับคำสั่งเดิม:
  - `/discovery` ไม่ได้มาแทนที่ `/00-discover` (โดย `/00-discover` ใช้สำหรับการสำรวจฟีเจอร์เดี่ยวใน Deep-Track ส่วน `/discovery` ใช้สำหรับการวางแผนภาพรวมระดับ Project/Product Planning)

---

## 3. Trade-off Comparison Table

| Approach | ข้อดี (Pros) | ข้อจำกัด (Cons) | ข้อสรุป / คำแนะนำ |
| :--- | :--- | :--- | :--- |
| **Option A: Adaptive Multi-Turn Interview Skill (`/discovery`) (แนะนำ)** | - ให้คำแนะนำที่ยืดหยุ่นตามบริบทผู้ใช้<br>- สร้าง output เข้ากับ `project-plan.md` และ `build-plan.md` อัตโนมัติ<br>- เชื่อมต่อกับ `/overview` ไร้รอยต่อ | - ต้องการ Prompt Design ที่ดีเพื่อไม่ให้ Agent ถามกว้างจนเกินไป | **เลือกแนวทางนี้ (Recommended)** |
| **Option B: Static Template Questionnaire File Only** | - สร้างง่าย | - ผู้ใช้ต้องพิมพ์กรอกเองทั้งหมด ขาดปฏิสัมพันธ์และความช่วยเหลือจาก AI | ขาดความเป็น Agentic Workflow |
| **Option C: Single-shot Plan Generator** | - ทำงานเสร็จในข้อความเดียว | - มีแนวโน้มที่จะสมมุติข้อมูลขึ้นมาเอง (Hallucination) โดยไม่ตรงกับความต้องการจริงของผู้ใช้ | ไม่แนะนำสำหรับการวางแผนระยะยาว |

---

## 4. Decision & Next Step

### Final Decision: `Proceed` ✅
ทักษะ `/discovery` จะช่วยเติมเต็มวงจรก่อนเริ่มพัฒนา (Pre-build & Ideation Phase) ให้สมบูรณ์แบบ ทำให้ผู้ใช้สามารถเปลี่ยนไอเดียจากศูนย์ให้กลายเป็นแผนงานที่มีโครงสร้างชัดเจน พร้อมส่งต่อให้ AI Blueprint Engine ทำงานต่อได้อย่างมีประสิทธิภาพ

### Recommended Next Action:
- สามารถเริ่มพัฒนาได้ทันทีด้วย Fast-Track:
  ```bash
  /feature IDEA-009
  ```
  หรือกำหนดการจัดส่งแบบ Deep-Track:
  ```bash
  10-define DISC-20260822-004-guided-discovery-interview
  ```
