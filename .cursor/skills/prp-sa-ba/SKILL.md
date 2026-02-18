---
name: prp-sa-ba
description: Assist SA/BA in this PRP-based, multi-platform project with creating ISSUE specs, analyzing requirements, reviewing PRPs, and maintaining INITIAL.md. Use whenever the user is acting as SA/BA, talking about requirements, issues, PRPs, or project overview.
---

# PRP SA/BA Workflow

## Scope

ใช้ skill นี้เมื่อผู้ใช้มีบทบาทเป็น **SA/BA/PO** และกำลัง:
- เขียนหรือปรับ requirement / ISSUE
- ขอให้ช่วยสร้างหรือทวน **ISSUE Spec / PRP**
- ขอภาพรวม/สารบัญของโปรเจค หรือถามถึง INITIAL.md

เสมอให้ยึดโครงจาก:
- `README.md`
- `AGENT_FLOW.md`
- Template ใน `PRPs-Framework/templates/`

---

## 1. สร้าง / ปรับ ISSUE Spec (create-issue-spec)

เมื่อต้องแปลง requirement ให้เป็น ISSUE Spec:

1. ถ้ามีคำสั่ง `/create-issue ...` อยู่แล้ว  
   - ช่วยอธิบายโครงไฟล์ `PRPs-Framework/issues/ISSUE_xxx_*.md` และบอกผู้ใช้ว่าควรเติมอะไรในแต่ละหัวข้อ
2. ถ้ายังไม่มีไฟล์ ISSUE:
   - แนะนำให้สร้างไฟล์ใน `PRPs-Framework/issues/` ตาม pattern ชื่อใน README
   - เสนอ **template ย่อ** ที่สอดคล้องกับ `prp_base.md` โดยเน้น:
     - `Context`
     - `Problem / Goal`
     - `Details`
     - `Steps to Reproduce / High-level Requirements`
     - `Impact / Priority`
3. ตรวจ requirement ว่า:
   - มีเป้าหมายชัดเจน (Goal) หรือยังเป็นแค่คำบ่น/ความต้องการกว้าง ๆ
   - มีผู้ใช้เป้าหมาย (ผู้ใช้คนไหนได้รับผล) หรือไม่
   - มีข้อจำกัดสำคัญ (constraints) หรือ dependency ระบบอื่นหรือไม่
4. เสนอคำถามสั้น ๆ เพิ่มเติมไม่เกิน 3–5 ข้อ เพื่อให้ ISSUE Spec สมบูรณ์ โดยโฟกัสที่:
   - ขอบเขตงาน (in scope / out of scope)
   - ข้อมูล / log / ตัวอย่างที่ต้องมี
   - ความเสี่ยงหลัก

ตอบเป็น **markdown สั้น ๆ และเป็น bullet ชัดเจน** เพื่อให้ผู้ใช้คัดลอกไปเติมในไฟล์ได้ง่าย

---

## 2. วิเคราะห์ Requirement (analyze-requirement)

เมื่อ requirement ดูใหญ่หรือคลุมเครือ:

1. แยกออกเป็น **ประเด็นหลัก** (1–3 ข้อ) และ **ประเด็นย่อย** ใต้แต่ละข้อ
2. เสนอการแบ่งงานเป็น **candidate subtasks** (T1, T2, T3...) ในรูปแบบ:
   - T1: วิเคราะห์/เก็บข้อมูลเพิ่ม (ถ้าจำเป็น)
   - T2: ออกแบบ/ปรับ flow หรือ data model
   - T3: Implementation (ปล่อยให้ DEV/AI ลงรายละเอียด)
   - T4: QA / UAT / deployment notes (ถ้าเกี่ยวข้อง)
3. ระบุคร่าว ๆ:
   - Dependencies ระหว่าง subtasks (เช่น T2 ขึ้นกับ T1)
   - ความเสี่ยง/จุดที่ควรโฟกัสเป็นพิเศษ
4. ช่วย mapping ให้เข้ากับ **PRP Flow**:
   - ISSUE → ISSUE Spec → PRP → Plan/Subtasks

ให้คำตอบในรูปแบบที่สามารถนำไปใส่ section **Plan / Subtasks** ของ PRP ได้ทันที

---

## 3. ทวน / ปรับ PRP (review-prp)

เมื่อผู้ใช้เปิดหรือพูดถึงไฟล์ `PRPs-Framework/PRPs/*_prp.md`:

1. ตรวจหัวข้อสำคัญใน PRP:
   - `Goal` ชัดพอหรือยัง? สะท้อน business value หรือยังเป็นแค่ task เชิงเทคนิค
   - `Why` อธิบาย impact / pain point ชัดหรือไม่
   - `What` ครอบคลุม behavior ฝั่ง user และข้อกำหนดเชิงเทคนิคหลัก ๆ หรือไม่
   - `All Needed Context` มีอ้างอิง docs / references / gotchas ที่จำเป็นหรือยัง
   - `Plan / Subtasks` มีลำดับงานที่ทำได้จริง และมี dependency ชัดเจนหรือไม่
   - `Validation Loop` ระบุ lint/test/integration ที่จับของจริงได้หรือยัง
2. ให้ feedback แบบสั้น แบ่งเป็น:
   - จุดที่ **ครบและดีแล้ว**
   - จุดที่ **ควรเพิ่ม/แก้** (ไม่เกิน 5 bullet)
3. ถ้าผู้ใช้ต้องการให้ช่วยแก้ PRP:
   - เสนอ “ฉบับแก้ไข” ของ section ที่สำคัญ (Goal/Why/What/Plan/Validation)
   - ระวังไม่เปลี่ยนความหมาย business ที่ผู้ใช้ระบุไว้เดิม

เน้นเขียนให้ **อ่านง่ายสำหรับคน** ไม่ใช่แค่สำหรับ AI agent ตัวอื่น

---

## 4. ดูแล INITIAL.md (update-initial-md)

เมื่อมี PRP ใหม่หรือมีการเปลี่ยนแปลงสำคัญในโปรเจค:

1. ช่วยเสนอ snippet ที่ควรเพิ่มใน `INITIAL.md` เช่น:
   - ใต้หัวข้อ Bugs / Issues, Features, Changes / Refactors
   - รูปแบบ:
     - `- BUG-456: Login fails after reset - PRP: PRPs-Framework/PRPs/PRPs_BUG-456_login-fails-after-reset_prp.md`
2. เสนอว่าจะจัดกลุ่มตามอะไร:
   - ประเภท (BUG/FEAT/CHG)
   - โมดูล/ระบบย่อย
   - ความสำคัญ (P1–P3)
3. ถ้าผู้ใช้บอกว่า INITIAL.md เริ่มอ่านยาก:
   - เสนอการจัดโครงใหม่อย่างระมัดระวัง (เช่น แยก subsection หรือเรียงใหม่)
   - ย้ำว่าให้ใช้ Git commit เป็น checkpoint เสมอก่อน rearrange ครั้งใหญ่

---

## 5. การสื่อสารกับ DEV/AI ตัวอื่น

เมื่อ SA/BA ถามในเชิง “ควรให้ DEV/AI ทำอะไรต่อ”:

1. สรุป requirement / ISSUE / PRP ให้สั้นที่สุด แต่ยังครบ context
2. แนะนำ **คำสั่ง** ที่เหมาะสมใน flow นี้ เช่น:
   - `/generate-prp PRPs-Framework/issues/ISSUE_xxx_*.md`
   - `/execute-prp PRPs-Framework/PRPs/PRPs_TYPE-xxx_prp.md --auto-qa`
3. ถ้า requirement พร้อมให้ลงมือ implement แล้ว:
   - บอกชัดว่า “สเปคตอนนี้พร้อมส่งต่อให้ DEV/AI แล้ว”  
   - ชี้ไฟล์ที่จะใช้เป็น input (ISSUE Spec / PRP)

ให้คำตอบที่ **actionable** เสมอ (มี step ถัดไปที่ทำได้ทันที)

