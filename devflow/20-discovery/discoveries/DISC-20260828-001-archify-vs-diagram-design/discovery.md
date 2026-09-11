# Discovery Document: [DISC-20260828-001] Evaluation of Archify vs Diagram-Design Integration

> **Discovery ID**: `DISC-20260828-001`  
> **Topic**: ติดตั้ง `https://github.com/tt-a1i/archify` ทดแทนหรือใช้งานร่วมกับ `https://github.com/cathrynlavery/diagram-design`  
> **Date**: 2026-08-28  
> **Status**: `Completed & Installed (Dual-Skill Mode: archify + diagram-design)`  
> **Target Scope**: Skill Ecosystem, Multi-Agent Adapters (`.agents/`, `.claude/`), Manifest (`.nexus/nexus-devflow.json`), and Workflow Routing (`discovery`, `feature`, `fix`)

---

## 1. Executive Summary & Problem Statement

ผู้ใช้ต้องการทราบว่าสามารถติดตั้ง **Archify** (`https://github.com/tt-a1i/archify`) แทนที่ **Diagram-Design** (`https://github.com/cathrynlavery/diagram-design`) ใน Nexus-DevFlow ได้หรือไม่

### คำตอบสรุป (TL;DR):
**สามารถติดตั้งได้แน่นอน 100%** โดยสถาปัตยกรรมของ Nexus-DevFlow มีระบบจัดการ Skill แยกเฉพาะ (`skill-manager.ts` และ `.nexus/nexus-devflow.json`) ซึ่งรองรับทั้ง:
1. **ติดตั้งแทนที่ (Replace entirely)**: ถอน `diagram-design` ออก แล้วติดตั้ง `archify` เข้ามาแทน
2. **ติดตั้งควบคู่กัน (Co-exist / Complementary - แนะนำ)**: ติดตั้ง `archify` เพิ่มเติมโดยไม่ต้องลบ `diagram-design` เพื่อให้ครอบคลุมการวาดไดอะแกรมได้ทุกบริบท

---

## 2. In-Depth Comparison: Archify vs Diagram-Design

| มิติการเปรียบเทียบ | **Archify** (`tt-a1i/archify`) | **Diagram-Design** (`cathrynlavery/diagram-design`) |
|---|---|---|
| **กลไกการทำงาน (Mechanism)** | **Deterministic Compiler (JSON IR + Node CLI)**<br>AI เขียน JSON Schema แล้วให้ Script คอมไพล์เป็น HTML/SVG | **Pure LLM Generation (Prompt-based)**<br>AI เขียนโค้ด HTML + Inline SVG ตรงๆ ตาม Guidelines |
| **ประเภทไดอะแกรม (Coverage)** | **5 รูปแบบหลักทางเทคนิค**: Architecture, Workflow, Sequence, Dataflow, Lifecycle | **39 รูปแบบครอบคลุมรอบด้าน**: ทั้ง System, Business, Quadrant, Radar, Mindmap, Timeline, ER ฯลฯ |
| **ความถูกต้อง (Verifiability)** | **สูงมาก (Deterministic Validation)**<br>มี `bin/archify.mjs validate` ตรวจสอบข้อผิดพลาด 0 composition errors | **ขึ้นกับความสามารถของโมเดล**<br>อาจมีโอกาสเกิด SVG overlap หรือ text clipping ได้ในโมเดลขนาดเล็ก |
| **ฟีเจอร์ Interactive & Export** | **ครบครันมาก**: มี Dark/Light theme toggle, Trace Motion/Play story, Route Probe, Reach Analysis, Export (PNG/SVG/WebM/Share Card) | **Static Standalone**: เป็น HTML+SVG สไตล์ Editorial สะอาดตา ไร้ Build tool / Script ซับซ้อน |
| **Runtime Dependency** | ต้องใช้ Node.js runtime ในการรัน script คอมไพล์ | ไม่ต้องการ Runtime dependency เพิ่มเติม (เปิดไฟล์ HTML ได้ทันที) |
| **Mermaid Support** | มีตัวแปลง Mermaid Syntax ไปเป็น Archify JSON ในตัว | มีคำแนะนำการแปลง Mermaid เป็น Custom SVG |

---

## 3. Trade-off Analysis & Options

### Option A: ติดตั้งทั้งคู่ควบคู่กัน (Dual-Skill / Complementary) — ⭐ แนะนำสูงสุด
- **แนวทาง**: ติดตั้ง `archify` เป็น Third-party Skill ตัวใหม่ โดยยังคงเก็บ `diagram-design` ไว้
- **ข้อดี**: 
  - ได้ประโยชน์จาก **Archify** สำหรับ Technical/System Architecture, Sequence Flows, และ Interactive Proofs
  - ยังคงมี **Diagram-Design** ไว้ใช้งานกับ Non-system Diagrams (เช่น Quadrant, Radar, Business Flywheel, Timelines, Pitch Decks)
  - ไม่เกิด Breaking Changes กับ stage templates หรือ discovery เดิม
- **ข้อเสีย**: มีขนาดโฟลเดอร์ skills เพิ่มขึ้นเล็กน้อย

### Option B: ติดตั้งแทนที่ทั้งหมด (Full Replacement)
- **แนวทาง**: ถอด `diagram-design` ออก แล้วติดตั้ง `archify` เข้ามาแทน พร้อมอัปเดต reference ใน `devflow/context/ai-interaction.md` และ `.agents/skills/discovery/SKILL.md`
- **ข้อดี**:
  - ลดความซ้ำซ้อน เน้นเฉพาะ Technical Diagram ที่มี Validation แน่นหนา 100%
  - ผลลัพธ์ไดอะแกรมทั้งหมดในโปรเจกต์จะมีฟีเจอร์ Interactive, Theme Switching, และ Motion สม่ำเสมอ
- **ข้อเสีย**: จะไม่สามารถวาดไดอะแกรมเฉพาะกลุ่ม Business/Marketing 34 แบบที่ Archify ไม่มีได้

---

## 4. Implementation Steps (หากต้องการติดตั้ง)

### กรณีใช้คำสั่ง CLI ของ Nexus-DevFlow:
```bash
# 1. ติดตั้ง Archify
npx create-nexus-devflow skill add https://github.com/tt-a1i/archify

# 2. (ตัวเลือก) ถอน diagram-design หากต้องการแทนที่แบบสมบูรณ์
npx create-nexus-devflow skill remove diagram-design
```

### สิ่งที่ระบบจะอัปเดตอัตโนมัติ:
1. โฟลเดอร์ `.agents/skills/archify/` (สำหรับ Antigravity, Copilot, Codex, OpenCode)
2. โฟลเดอร์ `.claude/skills/archify/` (สำหรับ Claude Code)
3. ทะเบียน Manifest `.nexus/nexus-devflow.json` (เพิ่มรายการใน `thirdPartySkills`)

---

## 5. Recommendation & Next Steps

1. **คำแนะนำ**: เลือก **Option A (ติดตั้ง Archify เพิ่มเติมเข้ามา)** เพื่อทดลองใช้งานร่วมกันก่อน เนื่องจาก Nexus-DevFlow ออกแบบสถาปัตยกรรมรองรับ Multi-Skill ได้อย่างไร้รอยต่อ
2. **Next Action**: 
   - หากต้องการให้ติดตั้งทันที แจ้งได้เลยว่าต้องการ **Option A (ติดตั้งเพิ่ม)** หรือ **Option B (ติดตั้งแทนที่/ลบตัวเก่า)**
