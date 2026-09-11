# Discovery: Consolidate Document Conversion Skills into `convert-any-to-md`

- **Discovery ID**: `DISC-20260821-003-convert-any-to-md`
- **Date**: 2026-08-21
- **Status**: `Proceed` (Approved for Definition & Execution)
- **Requested By**: User via `/00-discover`
- **Target Skill Name**: `convert-any-to-md`

---

## 1. Executive Summary & Problem Statement

ปัจจุบันใน `.agent-backup` มี Skill ในการแปลงไฟล์เอกสารเป็น Markdown แยกกันเป็น 4 Skill ย่อย ได้แก่:
1. `convert-excel-to-md` (แปลง `.xlsx`)
2. `convert-pdf-to-md` (แปลง `.pdf`)
3. `convert-word-to-md` (แปลง `.docx`)
4. `convert-plaintext-to-md` (แปลง `.txt` และไฟล์ข้อความทั่วไป)

### ปัญหาของการแยก 4 Skills:
- **High Friction**: เมื่อผู้ใช้งานหรือ AI ต้องประมวลผลโฟลเดอร์ที่มีไฟล์หลายชนิด (Mixed File Types) เช่น ในโฟลเดอร์มีทั้ง PDF, Word, Excel และ Plaintext ระบบบังคับให้ Agent ต้องเลือกและเรียกใช้งาน Skill ย่อยขนานกันถึง 3-4 ตัวพร้อมกัน
- **Duplication & Maintenance Overhead**: โครงสร้างสคริปต์ Python ในการจัดการ Output Path, Batch Processing, Command-line Parsing, และ Error Handling ซ้ำซ้อนกันใน 3 สคริปต์หลัก (`convert_excel_to_md.py`, `convert_pdf_to_md.py`, `convert_word_to_md.py`)
- **Cognitive Load**: ผู้ใช้และ AI Agent ต้องจำชื่อ Skill แยกตามนามสกุลไฟล์ แทนที่จะใช้คำสั่งเดียวจบ

### ข้อเสนอแนะ:
รวมทั้ง 4 Skills เข้าด้วยกันเป็น Skill เดียวใน DevFlow ชื่อ **`convert-any-to-md`** โดยสร้างเป็น Unified Converter Engine ที่สามารถตรวจจับชนิดไฟล์ (Auto-detect File Extension / Content-Type) และประมวลผลแปลงเป็น Markdown ได้ในคำสั่งเดียว

---

## 2. Supporting Route Lenses & Findings

### 🧠 Lens 1: Brainstorming & Options Analysis

| Option | Architecture Design | Pros | Cons | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **Option A: Unified Skill + Single Modular Python Script** *(Recommended)* | สร้าง Skill `convert-any-to-md` ใหม่ โดยมีสคริปต์ศูนย์กลาง `scripts/convert_any_to_md.py` ซึ่งแยก modular handlers (`excel_handler`, `pdf_handler`, `word_handler`, `text_handler`) | • ใช้สคริปต์เดียวจบ ทำงานกับไฟล์และโฟลเดอร์ผสมได้ทันที<br>• ลดการซ้ำซ้อนของโค้ด (CLI args, path resolution, batch logging)<br>• Maintenance ง่ายที่สุด | • ต้อง Refactor รวมสคริปต์ Python ทั้ง 3 ตัวเข้าด้วยกัน | **(Recommended)** |
| **Option B: Unified Skill + Router Script Calling Legacy Scripts** | สร้าง Skill `convert-any-to-md` แต่คงสคริปต์ย่อยไว้ 3-4 ตัว แล้วสร้างสคริปต์ `convert_any_to_md.py` เป็น wrapper คอย dispatch ไปยังสคริปต์เดิม | • ทำงานเสร็จเร็วขึ้นเล็กน้อย ไม่ต้อง refactor สคริปต์เดิม | • สคริปต์กระจายตัวหลายไฟล์<br>• ไม่แก้ปัญหาโค้ดซ้ำซ้อนในสคริปต์ย่อย | Alternative |
| **Option C: Keep Separate Skills** | คง Skill แยก 4 ตัวเหมือนเดิม | • ไม่ต้องปรับปรุงโค้ด | • Agent ต้องเรียกใช้หลาย Skill ซ้ำซ้อน<br>• ไม่สะดวกเมื่อเจอโฟลเดอร์ไฟล์ผสม | Reject |

---

### 🔬 Lens 2: Technical Research & Dependency Mapping

จากการสำรวจไฟล์ใน `.agent-backup`:

1. **Format Engine Dependencies**:
   - `.xlsx` -> `markitdown` + `openpyxl` / `zipfile` (ดึงรูป embedded raster ใน Sheet)
   - `.pdf` -> `markitdown` + `PyMuPDF` (`fitz`) (ดึงรูปจากแต่ละหน้า PDF)
   - `.docx` -> `markitdown` + `zipfile` (ดึงรูปจาก `word/media/`)
   - `.txt` / `.csv` / `.log` / `.json` / plaintext -> Pure Python / Prompt formatting guidelines

2. **Unified Requirements File (`requirements.txt`)**:
   ```text
   markitdown
   pymupdf
   openpyxl
   ```

3. **Unified Directory Structure for Skill**:
   ```text
   .agents/skills/convert-any-to-md/
   ├── SKILL.md
   ├── references/
   │   └── setup.md
   └── scripts/
       ├── convert_any_to_md.py
       └── requirements.txt
   ```

4. **Batch & Multi-file Auto Detection Logic**:
   - หาก Input เป็นไฟล์เดี่ยว: Auto-detect จากนามสกุล (`.xlsx`, `.pdf`, `.docx`, `.txt`, `.log`, `.csv` ฯลฯ) แล้วเรียก Handler ที่เหมาะสม
   - หาก Input เป็น directory: วนลูปสแกนไฟล์ทั้งหมด สนับสนุน `--recursive` แล้วแปลงทุกไฟล์ที่รองรับ โดยวางไฟล์ `.md` และโฟลเดอร์ `img/` ไว้ตามโครงสร้างที่ถูกต้อง

---

## 3. Scope Definition

### In-Scope:
- สร้าง Skill ใหม่ใน `.agents/skills/convert-any-to-md/SKILL.md` และ `.claude/skills/convert-any-to-md/SKILL.md` (ถ้ามี)
- รวมสคริปต์ conversion ใน `scripts/convert_any_to_md.py` ที่รองรับ `.xlsx`, `.pdf`, `.docx`, และ plaintext/generic text files
- รองรับ Single File Mode และ Batch Folder Mode (รวมถึง `--recursive`)
- รองรับการสกัด Embedded Images สำหรับ Excel, PDF และ Word
- อัปเดตเอกสารคำแนะนำการติดตั้งใน `references/setup.md`

### Out-of-Scope:
- การทำ OCR สำหรับ PDF หรือรูปภาพสแกน (คงพฤติกรรมเดิมตาม MarkItDown)
- การแปลงไฟล์แบบ legacy เช่น `.xls` หรือ `.doc` (แจ้งเตือนผู้ใช้ให้ Save As เป็น `.xlsx` / `.docx` ตามเดิม)

---

## 4. Decision & Approval Gate

- **Decision**: `Proceed`
- **Rationale**: การรวมทั้ง 4 Skills เข้าด้วยกันเป็น `convert-any-to-md` มีความเป็นไปได้สูง (High Feasibility), ช่วยลดความสับสนของ AI Agent และผู้ใช้งานในการเลือก Skill, รองรับการแปลงโฟลเดอร์ที่มีไฟล์ผสมชนิดได้ในคำสั่งเดียว และทำให้สถาปัตยกรรมของ DevFlow กระชับ สะอาด และบำรุงรักษาง่ายขึ้น

---

## 5. Next Workflow Recommendation

- **Next Command**: `/10-define DISC-20260821-003-convert-any-to-md` หรือเข้าสู่ขั้นตอนการสร้าง spec และการพัฒนาต่อไป
