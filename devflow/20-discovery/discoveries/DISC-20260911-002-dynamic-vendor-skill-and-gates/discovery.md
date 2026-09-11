# Discovery Document: [DISC-20260911-002] Project-Local AI-Orchestrated Vendor Skill Ingestion (`/skill-add`)

> **Discovery ID**: `DISC-20260911-002`  
> **Topic**: ออกแบบสถาปัตยกรรม `/skill-add` แบบ Local-Only: AI โคลน Vendor Repo สู่ `devflow/.vendor/<slug>/`, AI สังเคราะห์ Custom Wrapper Skill ใน `.agents/skills/<slug>/`, พร้อมระบบคุ้มครองไฟล์ไม่ให้ DevFlow Update ลบทิ้ง  
> **Date**: 2026-09-11  
> **Status**: `Proceed (Refined Design Approved)`  
> **Target Scope**: Agent Skill `/skill-add`, Local Vendor Storage (`devflow/.vendor/`), Adapter Isolation (`.agents/`, `.claude/`), Manifest Protection (`.nexus/nexus-devflow.json`), Update Immunity (`update.ts`)

---

## 1. บทสรุปแนวคิด & Core Philosophy (TL;DR)

### 🎯 จุดประสงค์หลักของการ Re-design:
1. **Local-Only Boundary (เฉพาะโปรเจกต์ของผู้ใช้)**:
   - ไม่มีการติดตั้งหรือแตะต้อง Global Config ใดๆ นอกขอบเขต Workspace ของโปรเจกต์
   - Source code ต้นทางของ 3rd-party ทั้งหมดถูกจัดเก็บใน **`devflow/.vendor/<slug>/`**
2. **AI-Driven Custom Skill Generation (ขับเคลื่อนด้วย AI ผ่าน `/skill-add` เท่านั้น)**:
   - **ทำไมต้องใช้ `/skill-add` ผ่าน AI เท่านั้น?**: เพราะ CLI / NPM command แบบเดิมทำได้แค่โคลนไฟล์หรือก๊อปปี้แบบใบ้ (dumb copy) ไม่สามารถ "อ่านทำความเข้าใจ" โครงสร้าง repository, API, ตัวอย่างการใช้งาน, หรือคัดกรอง guideline ออกมาสังเคราะห์เป็น **Tailored Custom Wrapper Skill (`SKILL.md`)** ได้
   - มีเพียง AI Agent เท่านั้นที่สามารถอ่านโค้ดใน `devflow/.vendor/<slug>/` แล้วเขียน `SKILL.md` ที่ฉลาด รู้วิธีรันสคริปต์ รู้วิธีดึง Reference และรู้ว่าต้องทำงานร่วมกับโปรเจกต์ของผู้ใช้อย่างไร
3. **DevFlow Update Protection (คุ้มครองไม่ให้ถูกลบเมื่ออัปเดต)**:
   - เมื่อรัน `npx nexus-devflow update` หรืออัปเกรดแพ็กเกจ ระบบจะต้องแยกแยะได้ว่า Skill นี้คือ **Custom Local Skill** ไม่ใช่ Core Framework Skill และต้อง **ห้ามลบ (Never Purge / Untouchable)** เด็ดขาด

---

## 2. ขั้นตอนการทำงานแบบ End-to-End Lifecycle ของ `/skill-add`

```text
[User Prompt ในแชท]
/skill-add https://github.com/virgiliojr94/book-to-skill
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Local Vendor Cloning                                           │
│ Agent รัน Git Clone ลงเฉพาะในโปรเจกต์: devflow/.vendor/book-to-skill/     │
└───────────────────────┬────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 2: AI Codebase Inspection & Synthesis                             │
│ Agent สำรวจ README, CLI scripts, templates, benchmarks ใน .vendor/       │
│ และสังเคราะห์ Custom Prompt & Rules ให้เข้ากับบริบทของโปรเจกต์               │
└───────────────────────┬────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Generate Custom Wrapper Skill                                  │
│ สร้าง .agents/skills/book-to-skill/SKILL.md                            │
│ ซิงก์ไปยัง .claude/skills/book-to-skill/SKILL.md (ถ้ามี adapter ใช้งาน)   │
└───────────────────────┬────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Register Manifest & Update Immunity                            │
│ บันทึกลง .nexus/nexus-devflow.json กำกับ origin: "custom-vendor"        │
│ และระบุเป็น Protected Skill เพื่อไม่ให้ DevFlow Update ลบทิ้ง               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. รายละเอียดสถาปัตยกรรมเชิงลึก (Detailed Architecture)

### 3.1 Vendor Storage Isolation (`devflow/.vendor/<slug>/`)
- **โฟลเดอร์ปลายทาง**: `devflow/.vendor/<slug>/`
- **สถานะ Git**: ถูก ignore ผ่าน `.gitignore` ของ DevFlow อยู่แล้ว (`devflow/.vendor/`) ทำให้ไม่ทำให้ Repository ของโปรเจกต์บวมด้วยไฟล์ vendor ภายนอก
- **รองรับการอัปเดตต้นทาง**: เนื่องจากเป็น Git Clone แยกอิสระ ภายหลังสามารถสั่งดึง upstream ใหม่ได้เสมอ

### 3.2 AI-Synthesized Custom Skill Wrapper (`.agents/skills/<slug>/SKILL.md`)
เมื่อ AI รัน `/skill-add <url>` AI จะทำการ:
1. วิเคราะห์ `README.md`, `package.json`, `requirements.txt`, CLI flags หรือโฟลเดอร์ตัวอย่างใน `.vendor/<slug>/`
2. สร้างไฟล์ `SKILL.md` ที่มีโครงสร้างมาตรฐานของ DevFlow:
   - **Frontmatter**: `name`, `description`, `origin: "custom-vendor"`, `referencePath: "devflow/.vendor/<slug>"`
   - **Trigger Rules**: บอก Agent ว่าควรเรียกใช้ทักษะนี้เมื่อใด (เช่น เมื่อเจอไฟล์ PDF/หนังสือ หรือเมื่อรันใน Stage ไหน)
   - **Execution Blueprint**: ระบุคำสั่งเรียกใช้งานสคริปต์ใน `devflow/.vendor/<slug>/` แบบ Relative Path
   - **Prompt Guardrails**: กำหนดข้อห้ามและแนวทางความปลอดภัยเพื่อไม่ให้ส่งผลเสียต่อโค้ดหลัก

### 3.3 กลไกการคุ้มครองไฟล์จากการอัปเดต (Update Immunity / Protection)
ใน Nexus-DevFlow ตัวจัดการอัปเดต (`update.ts`):
- จัดการเฉพาะไฟล์ที่อยู่ใน `MANAGED_ROOTS` ซึ่งถูกบันทึกไว้ใน `managedFiles` ของ Template Core
- สำหรับไฟล์ Custom Skill:
  1. มีการบันทึกใน `.nexus/nexus-devflow.json`:
     ```json
     {
       "customVendorSkills": [
         {
           "name": "book-to-skill",
           "source": "https://github.com/virgiliojr94/book-to-skill",
           "vendorPath": "devflow/.vendor/book-to-skill",
           "skillPath": ".agents/skills/book-to-skill",
           "installedAt": "2026-09-11T11:50:00Z",
           "protected": true
         }
       ]
     }
     ```
  2. เมื่อคำสั่ง `npx nexus-devflow update` ทำงาน:
     - `update.ts` จะคำนวณ `orphanedFiles` เฉพาะไฟล์ที่เป็นของ core framework เดิมที่ไม่มีใน template ใหม่
     - ไฟล์ใน `.agents/skills/<slug>/` ที่ระบุเป็น Custom Skill หรือไม่อยู่ใน Core Manifest จะถูก **ข้ามการลบ (Exempt from Cleanup)** เสมอ 100%

### 3.4 การอัปเดต Vendor Code ในอนาคต
แม้ว่าการติดตั้งตั้งต้นจะต้องผ่าน `/skill-add` เพื่อให้ AI สร้าง Custom Skill แต่เมื่อต้องการอัปเดต Code ใน vendor ให้เป็นเวอร์ชันล่าสุด:
- ผู้ใช้สามารถรัน:
  ```bash
  npx nexus-devflow skill update all
  ```
  หรือ
  ```bash
  npx nexus-devflow skill update book-to-skill
  ```
- **พฤติกรรม**:
  - ดึง Git upstream ล่าสุดเข้ามาที่ `devflow/.vendor/<slug>/`
  - **คงรักษา Custom Wrapper `SKILL.md`** ที่ AI เขียนปรับแต่งไว้ตามเดิม ไม่เขียนทับ

---

## 4. แผนงานการสร้างคำสั่ง `/skill-add` (Implementation Plan)

### ส่วนประกอบที่ต้องสร้าง:
1. **สร้างไฟล์ Skill Definition**:
   - `.agents/skills/skill-add/SKILL.md`
   - `.claude/skills/skill-add/SKILL.md`
2. **เนื้อหาของ `/skill-add` Skill**:
   - กำหนดคำสั่งการทำงานเป็น 4 สเต็ป:
     - **Phase 1 (Fetch)**: สั่งรัน git clone repo ลง `devflow/.vendor/<slug>`
     - **Phase 2 (Inspect)**: ใช้เครื่องมืออ่านไฟล์สำรวจ `README.md`, โครงสร้างโค้ด, dependencies
     - **Phase 3 (Synthesize)**: สร้าง Custom Wrapper `SKILL.md` ที่ปรับแต่งเข้ากับโปรเจกต์
     - **Phase 4 (Protect & Register)**: บันทึก metadata ลง `.nexus/nexus-devflow.json` และ `devflow/config.json`
3. **การทดสอบความปลอดภัย & ความเข้ากันได้**:
   - ทดสอบจำลองการโคลนและสร้าง skill
   - ทดสอบรัน dry-run update เพื่อพิสูจน์ว่าไฟล์ custom skill ไม่ถูกแตะต้อง

---

## 5. มติผลการสำรวจ (Decision & Approval)

- **มติ**: **`Proceed with AI-Orchestrated Local Architecture`**
- สถาปัตยกรรมนี้ตรงกับหัวใจของ Agentic Development ที่สุด เพราะใช้จุดแข็งของ AI ในการวิเคราะห์และสังเคราะห์ความรู้ภายนอกให้กลายเป็น Custom Agent Skill ประจำโปรเจกต์ได้อย่างแท้จริง
