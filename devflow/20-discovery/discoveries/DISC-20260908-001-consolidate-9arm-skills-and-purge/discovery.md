# Discovery: DISC-20260908-001-consolidate-9arm-skills-and-purge

> **Title**: แผนการรวม (Consolidate) ทักษะจาก 9arm-skills เข้าสู่ DevFlow Core และยกเลิก 9arm-skills  
> **Date**: 2026-09-08  
> **Status**: Open / Ready for Review  
> **Target Decision**: Proceed  
> **Routes & Lenses Explored**: Brainstorming Lens, Codebase Impact Scan, Architecture Alignment Lens  

---

## 1. Executive Summary & Problem Statement

ปัจจุบันในโปรเจกต์ Nexus-DevFlow มีการติดตั้ง Extension Skills จากภายนอก (`https://github.com/thananon/9arm-skills`) ทั้งหมด 4 ทักษะ:
1. `debug-mantra` (ได้ถูกยุบรวมเข้าสู่ `/debug` เรียบร้อยแล้วใน Feature 081 แต่ยังมี metadata ตกค้าง)
2. `post-mortem` (การบันทึก engineering record เชิงลึกหลังแก้บั๊กเสร็จ)
3. `scrutinize` (การรีวิวโค้ด/แปลนจากมุมมองคนนอก ท้าทาย intent และไล่ call path จริง)
4. `management-talk` (การแปล technical summary ให้เป็นภาษา executive/management ตามช่องทางต่างๆ)

**เป้าหมาย:** ศึกษาแนวทางการดึงคุณค่า (Core Values) ของทั้ง 3 ทักษะที่เหลือเข้ามาผสานรวมกับ Core Workflow ของ Nexus-DevFlow ให้เป็นเนื้อเดียวกันอย่างไร้รอยต่อ เพื่อให้สามารถถอดถอนและยกเลิกการพึ่งพา `9arm-skills` ออกจากระบบได้อย่างสมบูรณ์เช่นเดียวกับที่ทำสำเร็จใน Vendor Purge ก่อนหน้า

---

## 2. การวิเคราะห์รายทักษะและการ Mapping สู่ DevFlow Core

| 9arm Skill | แก่นสาระสำคัญ (Core Value) | ปัญหาหากเก็บเป็น Extension แยก | จุดที่ควรผสานรวมใน DevFlow (Consolidation Seam) |
| :--- | :--- | :--- | :--- |
| **`debug-mantra`** | Mantra 4 ข้อสำหรับงาน Debug (Reproducibility, Tracing, Falsification, Breadcrumbs) | ซ้ำซ้อนกับ `/debug` | **เสร็จสิ้นแล้วใน #081** — อยู่ใน Phase 0 ของ `/debug` (เหลือเพียงลบ entry ใน `.nexus/nexus-devflow.json`) |
| **`post-mortem`** | บันทึกประวัติบั๊กแบบ Canonical (Symptom, Root cause mechanism, Why it slipped through, Validation, Action items) | เป็นขั้นตอนที่มักถูกลืมหากเป็นคำสั่งแยกต่างหาก | **รวมเข้ากับ `/complete` (Track: Fix) & `/debug` (Phase 4 Handoff)**:<br>• ในวงจร `/fix` ➔ `/implement` ➔ `/check` ➔ `/complete`<br>• เมื่อปิดงาน fix ใน `/complete` ให้ใช้หัวข้อ Post-Mortem 8 บล็อก เป็นมาตรฐานในการ archive สู่ `devflow/history/fixes/{xxx-slug}.md`<br>• ใน `/debug` ให้มี handoff เสนอเขียน draft post-mortem ได้ทันที |
| **`scrutinize`** | การตรวจทานจากมุมมองบุคคลภายนอก (Outsider Stance), ท้าทายว่ามีวิธีที่เรียบง่ายกว่านี้ไหม (Simpler alternative), และไล่ Call Graph จริงไม่ใช่แค่ดู diff | ทับซ้อนกับ `/audit` และ Independent Review | **รวมเข้ากับ `/audit` (Core Skill)**:<br>• เพิ่ม **"Scrutiny Lens"** ลงใน `.agents/skills/audit/SKILL.md` และ `.claude/skills/audit/SKILL.md`<br>• เพิ่มกฎบังคับ: *"Challenge Intent & Simpler Alternatives"* ก่อนเริ่มตรวจโค้ด<br>• นำหลักการ Trace full call graph บรรจุลงใน contract ของ Independent Review (`independent-review.md`) |
| **`management-talk`** | แปลงข้อความเชิงเทคนิคให้เป็นภาษาระดับผู้บริหาร แบ่งตาม Channel (JIRA, Slack, Standup, Email, Meeting) | เป็น prompt แยกที่อยู่นอก workflow หลัก | **รวมเข้ากับ `/status` และ `/complete`**:<br>• เพิ่ม flag ใน `/status`: `/status --exec` หรือ `/status leadership` สำหรับสรุปความคืบหน้ารายสัปดาห์/สปรินต์ให้ผู้บริหาร<br>• ใน `/complete` เพิ่มส่วน **Executive Summary / Stakeholder Digest** ที่แปลง Release Digest เป็นข้อความสั้นพร้อมส่งลง Slack/JIRA |

---

## 3. Trade-off Analysis (เปรียบเทียบทางเลือก)

### ทางเลือกที่ 1: ผสานรวมเข้า Core ทั้งหมด และ Purge 9arm-skills ทิ้ง (Recommended)
- **ข้อดี**:
  - ลดจำนวน skill ที่ต้องดูแล (Skill count footprint) จาก 38 เหลือ 35 (32 Core + 3 Extensions: `archify`, `diagram-design`, `publish-devflow`)
  - Workflow ลื่นไหลเป็นเนื้อเดียว ไม่ต้องสลับ context หรือจำคำสั่งแปลกแยก
  - โค้ดและคำสั่งทั้งหมดอยู่ใน governance และ static contract ของ Nexus-DevFlow
- **ข้อเสีย**:
  - ต้องอัปเดตเอกสารและคำสั่ง `/audit`, `/debug`, `/fix`, `/complete`, `/status` ให้รองรับความสามารถใหม่

### ทางเลือกที่ 2: แปลงเป็น Built-in Core Skills (เพิ่ม Core Skills จาก 32 เป็น 35)
- **ข้อดี**: ยังคงคำสั่งเดิมไว้ได้ครบถ้วน เช่น `/scrutinize`, `/post-mortem`
- **ข้อเสีย**: ฝืน Core Skill Inventory (ต้องแก้ตัวเลข 32 ทั่วทั้ง framework และคู่มือทั้งหมด) และเพิ่มภาระ context window ให้กับ AI IDE ทุกตัวโดยไม่จำเป็น

### ทางเลือกที่ 3: คงไว้เป็น Third-party Extension ต่อไป
- **ข้อดี**: ไม่ต้องแก้โค้ด
- **ข้อเสีย**: ยังมี external dependency ค้างอยู่ในระบบ และไม่ได้ใช้ประโยชน์อย่างเต็มที่ในลูปการพัฒนาจริง

---

## 4. แผนงานการดำเนินการ (Implementation Roadmap)

หากผู้ใช้เห็นชอบ (Proceed) สามารถจัดทำเป็น Feature ต่อไปตามขั้นตอนดังนี้:

1. **Ticket 1: Unify Scrutinize into `/audit`**:
   - เพิ่ม Outsider Perspective, Intent Challenge, และ Call-path tracing เข้าใน `/audit` และ `audit/reference/independent-review.md`
2. **Ticket 2: Integrate Post-Mortem into `/debug`, `/fix`, and `/complete`**:
   - เพิ่ม post-mortem template ลงใน `devflow/history/fixes/`
   - เพิ่ม Phase 4 ใน `/debug` ให้สามารถ generate post-mortem report ได้
3. **Ticket 3: Integrate Leadership Digest into `/status` and `/complete`**:
   - เพิ่มความสามารถในการสร้าง Executive Summary สำหรับ Slack / JIRA ใน Release Digest
4. **Ticket 4: Purge 9arm Skills & Clean Metadata**:
   - ลบโฟลเดอร์:
     - `.agents/skills/post-mortem/`
     - `.agents/skills/scrutinize/`
     - `.agents/skills/management-talk/`
     - `.claude/skills/post-mortem/`
     - `.claude/skills/scrutinize/`
     - `.claude/skills/management-talk/`
   - ลบ entries ของ `9arm-skills` ออกจาก `.nexus/nexus-devflow.json` (รวมถึง `debug-mantra` ที่ตกค้าง)
5. **Ticket 5: Verification & Contract Check**:
   - รัน `npm run check:static` และ `npm test` ให้ผ่าน 100%

---

## 5. Decision & Next Steps

- **Recommendation**: **Proceed** (เห็นควรให้รวมทั้ง 3 ทักษะเข้าสู่ Core Workflow และถอนการติดตั้ง `9arm-skills`)
- **Next Command**: เมื่อต้องการเริ่มดำเนินการ สามารถรันคำสั่ง:
  ```text
  /feature DISC-20260908-001-consolidate-9arm-skills-and-purge
  ```
