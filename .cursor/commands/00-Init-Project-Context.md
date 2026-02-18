# Setup PRPs – สร้าง/อัปเดต INITIAL.md (คำสั่งแรกหลัง Download ZIP และ Extract ไปวางในโปรเจกต์)

คำสั่งนี้ใช้เป็น **ครั้งแรก** หลัง download zip ไฟล์และ extract Framework ไปวางไว้ในโปรเจกต์ เพื่อสร้างหรืออัปเดต `INITIAL.md` ให้เป็นดัชนีโครงการ (Project Context Index) ที่สะท้อนสภาพปัจจุบันของโปรเจกต์  
**สามารถรันซ้ำได้** เพื่อ refresh `INITIAL.md` ให้เป็นปัจจุบัน (เช่น หลังเพิ่ม PRP/ไฟล์ใหม่ หรือเปลี่ยนโครงสร้างโปรเจกต์)

## วัตถุประสงค์

- สร้าง `INITIAL.md` ครั้งแรก (ถ้ายังไม่มี) จากเทมเพลต `PRPs-Framework/templates/initial_base.md`
- สแกนโปรเจกต์เพื่อระบุว่าเป็นโปรเจกต์อะไร มีไฟล์/โฟลเดอร์สำคัญอยู่ที่ไหน
- จัดทำ index (ภาพรวม + ลิงก์ไป PRPs / references / docs) ใน `INITIAL.md`
- รันซ้ำได้เพื่อ **อัปเดต** `INITIAL.md` ให้ตรงกับสภาพปัจจุบัน (PRPs, issues, references, โครงสร้าง)

## ระดับรายละเอียดสำหรับการ Build ระบบใหม่ (Rebuild)

**เป้าหมาย:** `INITIAL.md` ต้องมีรายละเอียดระดับที่ **พอใช้ร่วมกับ PRPs** เป็น spec หลักสำหรับการ **build ระบบใหม่** ได้ — คือเมื่อใช้ `INITIAL.md` + ไฟล์ใน `PRPs-Framework/issues/*/prp.md` (และ references ตามที่อ้างอิง) เป็น context ให้ AI (เช่น ผ่าน `/02-Plan-Implementation` / `/03-Implement-Code` หรือ workflow อื่น) จะได้ระบบที่มี **ความต้องการเดิมครบ**  
- **โค้ดไม่จำเป็นต้องเหมือนเดิมทุกครั้ง** ที่ generate — การ implement อาจต่างกันได้ แต่ **ความต้องการ (requirements) ต้องครบ** เพื่อให้ระบบที่ build ใหม่ยังตอบโจทย์เดิม
- ดังนั้นใน `INITIAL.md` ต้องมีอย่างน้อย:
  - **Project Overview** — โปรเจกต์คืออะไร ใช้ stack อะไร ทำอะไร (ระดับที่พอให้ AI รู้ขอบเขต)
  - **System Requirements Summary (for Rebuild)** — สรุปความต้องการ/ขอบเขตระบบจาก PRPs (ฟีเจอร์หลัก, ข้อจำกัดสำคัญ, integration points) เพื่อให้พอ "เล่าให้ AI ฟังแล้ว build ใหม่ได้"
  - **File & Directory Index** — ไฟล์/โฟลเดอร์สำคัญอยู่ที่ไหน (entry points, แหล่งความจริงของ models/routes/config)
  - **Features / Bugs / Issues / Changes** — ลิงก์ไป PRP แต่ละตัว (PRP เป็นรายละเอียดเต็มของความต้องการนั้น)
  - **Examples, Documentation, Other Considerations** — อ้างอิงที่จำเป็นสำหรับการ implement ตามความต้องการ

## Arguments

ไม่บังคับ (ไม่มีอาร์กิวเมนต์)  
ถ้ามีอาร์กิวเมนต์ เช่น `--force` หรือ `--refresh` ให้ถือว่าเป็นการรันเพื่ออัปเดตเท่านั้น

## Process

### 1. ตรวจสอบ/สร้างโครงสร้างโฟลเดอร์ PRP

- มีโฟลเดอร์ `PRPs-Framework/` หรือไม่ ถ้าไม่มี → สร้าง
- มี `PRPs-Framework/issues/` หรือไม่ ถ้าไม่มี → สร้าง
- มี `PRPs-Framework/references/` หรือไม่ ถ้าไม่มี → สร้าง
- มี `PRPs-Framework/templates/` หรือไม่ ถ้าไม่มี → สร้าง และถ้ามีเทมเพลตจาก Framework (เช่น `initial_base.md`, `prp_base.md`, `tasks_base.md`) อยู่แล้ว ไม่ต้องเขียนทับ

### 2. สแกนโปรเจกต์ (Project Scan)

ทำการสแกนรากโปรเจกต์ (และระดับบนสุดเท่าที่สมเหตุสมผล) เพื่อรวบรวมข้อมูลต่อไปนี้:

**2.1 ระบุประเภทโปรเจกต์ (Platform / Stack)**

- ตรวจสอบไฟล์ที่มีอยู่แล้ว เช่น:
  - `pyproject.toml`, `requirements.txt`, `main.py`, `app/` ที่มี FastAPI → **FastAPI**
  - `__manifest__.py`, `models/`, `views/` ในโฟลเดอร์ที่ชื่อเหมือนโมดูล Odoo → **Odoo**
  - `composer.json`, `application/`, `system/` (CodeIgniter), `web/` (Yii) → **PHP (CodeIgniter / Yii)**
  - `package.json`, `next.config.*`, `nuxt.config.*` → **Node/Next/Nuxt** (ถ้า Framework รองรับ)
- ถ้าระบุไม่ได้ ให้ระบุเป็น **Generic** และบรรยายจากไฟล์ config / โครงสร้างที่เห็น

**2.2 รายการไฟล์/โฟลเดอร์สำคัญ (File & Directory Index)**

สร้างรายการสั้น ๆ ว่า “ไฟล์สำคัญอยู่ที่ไหน” เพื่อให้คนและ AI ใช้เป็น index ใน `INITIAL.md` ตัวอย่าง:

- Config / entry: `requirements.txt`, `main.py`, `app/main.py`, `composer.json`, `__manifest__.py`, `config/`, `.env.example`
- Source หลัก: `src/`, `app/`, `application/`, `models/`, `views/`, `controllers/`
- Tests: `tests/`, `test/`, `*_test.py`, `phpunit.xml`
- Docs: `README.md`, `docs/`, `AGENT_FLOW.md`
- PRP-specific: `PRPs-Framework/issues/*/prp.md`, `PRPs-Framework/issues/*/spec.md`, `PRPs-Framework/references/`, `PRPs-Framework/templates/`

ไม่ต้องลึกถึงทุกไฟล์ย่อย แค่ระดับที่ใช้อธิบาย “โปรเจกต์นี้มีอะไรอยู่ที่ไหน”

**2.3 สรุปความต้องการ/ขอบเขตระบบสำหรับ Rebuild (System Requirements Summary)**

เพื่อให้ `INITIAL.md` พอใช้ build ระบบใหม่ได้ ต้องมีส่วน **System Requirements Summary (for Rebuild)** ที่รวบรวมจาก:
- **จาก PRPs ใน `PRPs-Framework/issues/*/prp.md`:** อ่านหัวข้อ **Goal / Why / What** (หรือเทียบเท่า) ของแต่ละ PRP แล้วสรุปเป็น bullet สั้น ๆ ว่า "ระบบนี้ต้องมีอะไรบ้าง" (ฟีเจอร์หลัก, bug ที่ต้องแก้, change หลัก) — ไม่ต้อง copy ทั้ง PRP แค่ระดับที่พอให้คนหรือ AI อ่านแล้วเข้าใจขอบเขตความต้องการ
- **จากโครงสร้างและ config ที่สแกนได้:** ระบุขอบเขตเทคนิคที่สำคัญ เช่น entry point หลัก, ใช้ DB/API อะไร, มี integration กับระบบภายนอกหรือไม่ (ถ้าสรุปได้จากไฟล์ config / โครงสร้าง)
- **ระดับความละเอียด:** พอให้เมื่อมีแค่ `INITIAL.md` + ไฟล์ PRP ที่ลิงก์ไว้ แล้ว AI สามารถ `/02-Plan-Implementation` / `/03-Implement-Code` (หรือเทียบเท่า) เพื่อ **สร้างระบบใหม่ที่ตอบความต้องการเดิมครบ** ได้ — โค้ดอาจไม่เหมือนเดิมทุกครั้ง แต่ requirements ต้องครบ

ถ้ายังไม่มีไฟล์ PRP เลย ให้ใส่ placeholder ว่า "ยังไม่มี PRP — เติมหลังมี FEAT/BUG/CHG PRP" และอธิบายขอบเขตจาก Project Overview + File Index เท่าที่สแกนได้

### 3. อ่านเทมเพลต INITIAL

- อ่าน `PRPs-Framework/templates/initial_base.md`  
- ถ้าไม่มี (โปรเจกต์ไม่มีเทมเพลตนี้) ให้ใช้โครงสร้างมาตรฐานตามนี้:

```markdown
## Project Context Index

ใช้ไฟล์นี้เป็น "หน้ารวมภาพรวมโปรเจกต์" และดัชนีลิงก์ไปหา PRPs, references, และ documentation อื่น ๆ  
ข้อควรระวัง: ก่อนเปลี่ยนโครงสร้างใหญ่ ๆ ควรเก็บ snapshot ไว้ด้วย Git commit

### Project Overview
- [จะเติมจากผลสแกน]

### System Requirements Summary (for Rebuild)
- [สรุปความต้องการ/ขอบเขตระบบจาก PRPs + โครงสร้าง — ระดับที่พอให้ใช้ build ระบบใหม่ได้; สร้าง/อัปเดตได้จากคำสั่ง `/00-Init-Project-Context`]

### File & Directory Index
- [จะเติมจากผลสแกน]

### Features
- [จาก PRPs หรือ placeholder]

### Bugs / Issues
- [จาก PRPs หรือ placeholder]

### Changes / Refactors
- [จาก PRPs หรือ placeholder]

### Examples
- [จาก PRPs-Framework/references/ หรื placeholder]

### Documentation
- [ลิงก์หรือ path เอกสารสำคัญ]

### Other Considerations (Global Gotchas)
- [ข้อควรระวัง/กฎที่ใช้ทั้งโปรเจกต์]
```

### 4. สร้างหรืออัปเดตเนื้อหา INITIAL.md

**4.1 ถ้าไม่มี `INITIAL.md`**

- สร้างใหม่จากเทมเพลตด้านบน (หรือจาก `initial_base.md` ถ้ามี)
- เติม:
  - **Project Overview**: ประเภทโปรเจกต์ (FastAPI / Odoo / PHP / Generic) และประโยคสั้น ๆ โปรเจกต์นี้ทำอะไร (ระดับที่พอให้ AI รู้ขอบเขตเวลา rebuild)
  - **System Requirements Summary (for Rebuild)**: สรุปจากขั้นตอน 2.3 — รายการความต้องการหลักจาก PRPs (Goal/Why/What สรุป) + ขอบเขตเทคนิคที่สแกนได้ เพื่อให้พอใช้ build ระบบใหม่ได้
  - **File & Directory Index**: รายการจากขั้นตอน 2.2
  - **Features / Bugs / Issues / Changes / Refactors**: สแกน `PRPs-Framework/issues/*/prp.md` (ดูชื่อโฟลเดอร์และหัวข้อแรกของแต่ละไฟล์) แล้วใส่รายการในรูปแบบ `- [ชื่อหรือ ID] - PRP: \`PRPs-Framework/issues/{folder-name}/prp.md\``
  - **Examples**: สแกน `PRPs-Framework/references/` แล้วใส่ path ที่เกี่ยวข้อง (ไฟล์หรือโฟลเดอร์)
  - **Documentation**: ถ้ามี README, docs/, ลิงก์ภายนอก ที่สำคัญ ให้ใส่ในส่วนนี้
  - **Other Considerations**: ปล่อย placeholder หรือ bullet ว่างให้ผู้ใช้เติมภายหลัง

**4.2 ถ้ามี `INITIAL.md` อยู่แล้ว (การรันซ้ำเพื่ออัปเดต)**

- อ่าน `INITIAL.md` ปัจจุบัน
- **Project Overview**: อัปเดตจากผลสแกนล่าสุด (ประเภทโปรเจกต์, คำอธิบายสั้น ๆ)
- **System Requirements Summary (for Rebuild)**: อัปเดตจากขั้นตอน 2.3 — สรุปความต้องการจาก PRPs ปัจจุบันอีกครั้ง (Goal/Why/What ของแต่ละ PRP) + ขอบเขตเทคนิค; เก็บ bullet ที่ผู้ใช้เพิ่มเอง ถ้ามี
- **File & Directory Index**: อัปเดตจากผลสแกนล่าสุด
- **Features**: สแกน `PRPs-Framework/issues/` หาโฟลเดอร์ที่มี `prp.md` ที่เป็น FEAT แล้วเรียงรายการให้ตรงกับไฟล์ที่มีอยู่ (ลบที่ไม่มีไฟล์แล้ว เพิ่มที่ใหม่)
- **Bugs / Issues**: เหมือนกัน สำหรับ BUG / ISSUE
- **Changes / Refactors**: เหมือนกัน สำหรับ CHG
- **Examples**: สแกน `PRPs-Framework/references/` อีกครั้ง แล้วอัปเดตรายการ
- **Documentation** และ **Other Considerations**: ถ้ามีเนื้อหาที่ผู้ใช้เขียนไว้แล้ว เก็บไว้; ถ้าต้องการเสนอจากสแกน (เช่น มี `docs/` ใหม่) ให้เพิ่มโดยไม่ลบของเดิม

### 5. เขียนไฟล์ INITIAL.md

- เขียนที่รากโปรเจกต์: `INITIAL.md`
- ถ้าเป็นการสร้างใหม่: เขียนทั้งไฟล์
- ถ้าเป็นการอัปเดต: เขียนทับ `INITIAL.md` ด้วยเนื้อหาที่ merge แล้ว

## Output

- ไฟล์ `INITIAL.md` ที่รากโปรเจกต์
- เนื้อหาประกอบด้วย:
  - Project Overview (ประเภทโปรเจกต์ + คำอธิบายสั้น — ระดับที่พอ rebuild ได้)
  - **System Requirements Summary (for Rebuild)** — สรุปความต้องการ/ขอบเขตระบบจาก PRPs + โครงสร้าง พอให้ใช้ build ระบบใหม่ได้
  - File & Directory Index (ไฟล์/โฟลเดอร์สำคัญอยู่ที่ไหน)
  - Index ของ PRPs (Features, Bugs/Issues, Changes) จากไฟล์ใน `PRPs-Framework/issues/*/prp.md`
  - Examples จาก `PRPs-Framework/references/`
  - Documentation และ Other Considerations (จากสแกนหรือ placeholder)
- คำแนะนำสั้น ๆ ว่า: สามารถรันคำสั่งนี้ซ้ำเมื่อใดก็ได้เพื่อให้ `INITIAL.md` เป็นปัจจุบัน

## หมายเหตุ

- คำสั่งนี้ออกแบบให้ **รันซ้ำได้ (idempotent)** เพื่อใช้เป็นเครื่องมือ “refresh index” ไม่ต้องรันแค่ครั้งเดียวหลัง extract
- **ระดับ Rebuild:** เป้าหมายคือให้ `INITIAL.md` + ไฟล์ใน `PRPs-Framework/issues/*/prp.md` เป็น spec ที่ครบพอสำหรับการ **build ระบบใหม่** (regenerate) — เช่น ใช้ `/02-Plan-Implementation` / `/03-Implement-Code` ด้วย context จาก INITIAL.md + PRPs จะได้ระบบที่มีความต้องการเดิมครบ; โค้ดที่ได้อาจไม่เหมือนเดิมทุกครั้ง แต่ requirements ต้องครบ
- การสแกน PRPs ใช้จาก **ชื่อโฟลเดอร์** และ **หัวข้อแรก** ในไฟล์ PRP เพื่อระบุประเภท (BUG/FEAT/CHG) และชื่อ; สำหรับ **System Requirements Summary** ต้องอ่านส่วน Goal / Why / What (หรือเทียบเท่า) ของแต่ละ PRP เพื่อสรุปความต้องการ
- ถ้าโปรเจกต์ไม่มีโฟลเดอร์ `PRPs-Framework/templates/` หรือไม่มี `initial_base.md` ให้ใช้โครงสร้างที่กำหนดใน Process ขั้นที่ 3
