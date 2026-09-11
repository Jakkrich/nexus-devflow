# 🧭 Discovery Document: [DISC-20260822-003] Dedicated Code, Security & Performance Audit Skill (`/audit`)

> **Discovery ID**: `DISC-20260822-003`  
> **Source**: Intake from `[IDEA-008]` in `devflow/ideas.md`  
> **Date**: 2026-08-22  
> **Status**: `Proceed (Approved for Delivery)`  
> **Target Track**: Fast-Track (Blueprint Mode - `/feature`) or Deep-Track (`10-define`)  

---

## 1. Problem Statement & Motivation
ในการพัฒนาซอฟต์แวร์ด้วย AI Coding Agents จำเป็นต้องมีกลไกตรวจสอบคุณภาพโค้ดและความปลอดภัยเชิงลึก (Dedicated Code & Security Audit) ก่อนทำการ Merge โค้ดเข้าสู่ Main Branch หรือส่งมอบขึ้นระบบ Production 

ปัจจุบันใน DevFlow มีระบบบันทึก `devflow/context/findings.md` และ Quality Gatekeeper (`nexus-devflow check-gate`) แล้ว แต่ยังขาด Skill คำสั่งเฉพาะทาง (`/audit` หรือ `$audit`) ที่ช่วยให้ AI Agent ทำการสแกนและจัดทำรายงานตรวจสอบโค้ดอย่างเป็นระบบตามเลนส์เฉพาะทาง (Quality, Security, Performance, Tests) พร้อมบันทึกข้อบกพร่องด้วย Durable ID ลงใน Findings Ledger

---

## 2. Exploration Lenses & Technical Analysis

### A. Scoping & Audit Modes Lens
คำสั่ง `/audit` ควรรองรับการตรวจสอบ 3 รูปแบบ:
1. **Branch / Active Run Audit (Default)**: ตรวจสอบเฉพาะไฟล์ที่มีการเปลี่ยนแปลงใน Git Diff หรือ Active Living Spec เพื่อความรวดเร็วและประหยัด Token
2. **Targeted Path Audit**: ตรวจสอบเฉพาะโฟลเดอร์หรือไฟล์ที่ระบุ (เช่น `/audit src/auth/`)
3. **Full Project Audit**: สแกนตรวจสอบทั้ง Codebase สำหรับการทำ Security / Quality Audit ประจำรอบ

### B. Specialized Audit Lenses
- **Quality Lens**: ตรวจจับ Code Smells, Duplication, Dead Code, Inconsistent Naming, Cyclomatic Complexity
- **Security Lens**: ตรวจจับ Hardcoded Secrets/API Keys, SQL/Command Injection, XSS, Insecure Dependencies, Missing Auth Guards
- **Performance Lens**: ตรวจจับ N+1 Query Patterns, Blocking Async Calls, Memory Leaks, Large Bundle Imports
- **Tests Lens**: ตรวจจับ Missing Test Cases, Flaky Assertions, Happy-path only coverage

### C. Findings Ledger Integration (`devflow/context/findings.md`)
เมื่อตรวจพบข้อผิดพลาด:
- สร้าง Durable ID อัตโนมัติ (เช่น `SEC-001`, `QUAL-001`, `PERF-001` หรือ `FIND-xxx`)
- กำหนด Severity: `P0` (Critical Blocker), `P1` (High Blocker), `P2` (Medium), `P3` (Low / Polish)
- กำหนดสถานะเริ่มต้น: `open`
- บันทึกบรรทัดมาตรฐานลงใน `devflow/context/findings.md` ซึ่งจะถูกนำไปบล็อกใน `nexus-devflow check-gate` และ `/complete` โดยอัตโนมัติ

---

## 3. Trade-off Comparison Table

| Approach | ข้อดี (Pros) | ข้อจำกัด (Cons) | ข้อสรุป / คำแนะนำ |
| :--- | :--- | :--- | :--- |
| **Option A: Dedicated Multi-Lens Audit Skill + Findings Ledger (แนะนำ)** | - ทำงานร่วมกับ AI IDE ทุกค่าย (Antigravity, Claude, Codex, Copilot)<br>- บันทึกผลลงใน `findings.md` เป็น Durable Ledger<br>- บล็อก Quality Gatekeeper อัตโนมัติสำหรับ P0/P1 | - ต้องเขียน Guidelines และ Rules ที่ชัดเจนใน SKILL.md | **เลือกแนวทางนี้ (Recommended)** |
| **Option B: CLI Hardcoded Linter Scripts Only** | - ตรวจสอบไวด้วยโปรแกรมภายนอก | - ไม่สามารถวิเคราะห์เชิงตรรกะ สถาปัตยกรรม หรือ Business Logic ที่ซับซ้อนได้เท่ากับ LLM | ไม่เพียงพอสำหรับ Agentic Review |
| **Option C: Ad-hoc Code Review Prompting** | - ไม่ต้องสร้าง Skill ใหม่ | - ขาดมาตรฐาน ไม่มี Durable ID และไม่เชื่อมต่อกับ Quality Gatekeeper | ไม่ปลอดภัยสำหรับ Production |

---

## 4. Decision & Next Step

### Final Decision: `Proceed` ✅
แนวคิดนี้มีความคุ้มค่าสูงมาก ยกระดับระบบ Governance และ Code Quality ของ DevFlow ให้มีมาตรฐานเทียบเท่าระดับ Enterprise และเชื่อมโยงเข้ากับระบบ `findings.md` และ `check-gate` ที่มีอยู่แล้วได้อย่างสมบูรณ์แบบ

### Recommended Next Action:
- สามารถเริ่มพัฒนาได้ทันทีด้วย Fast-Track:
  ```bash
  /feature IDEA-008
  ```
  หรือกำหนดการจัดส่งแบบ Deep-Track:
  ```bash
  10-define DISC-20260822-003-code-and-security-audit
  ```
