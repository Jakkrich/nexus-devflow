# PRP Framework & Context Engineering (คู่มือการใช้งาน)

Framework นี้ออกแบบมาเพื่อช่วยทั้ง **SA/BA** และ **DEV** ให้ทำงานร่วมกับ AI (เช่น Cursor/Claude Code) ได้อย่างเป็นระบบ ตั้งแต่การเก็บ requirement ไปจนถึงการ implement และกลับมาแก้ไขในอนาคต โดยมีการเก็บประวัติผ่าน PRPs และ INITIAL history

**หลัง download zip ไฟล์และ extract ไปวางไว้ในโปรเจกต์:** รันคำสั่ง **`/00-Init-Project-Context`** เป็นครั้งแรก เพื่อสร้างหรืออัปเดต `INITIAL.md` (ดัชนีโครงการ + ภาพรวมไฟล์/โฟลเดอร์) — รันซ้ำได้เมื่อต้องการให้ index เป็นปัจจุบัน

---

## โครงสร้างโปรเจกต์หลัก

```text
INITIAL.md                 # Index รวมภาพรวม + ลิงก์ไป PRPs-Framework/PRPs / references / docs

PRPs-Framework/
  ├── templates/
  │   ├── prp_base.md      # เทมเพลต PRP กลาง (ใช้ทั้ง BUG / FEATURE / CHANGE)
  │   ├── initial_base.md  # เทมเพลต INITIAL.md
  │   └── tasks_base.md    # เทมเพลต TASKS.md
  ├── issues/              # [Standard] จัดเก็บงานแยกตามโฟลเดอร์
  │   └── {REF}_{slug}/
  │       ├── spec.md      # ไฟล์ ISSUE spec (input)
  │       ├── prp.md       # ไฟล์ PRP ที่ generate แล้ว (output ของ /02)
  │       └── qa_result.md # ผลการทำ QA/Validation (output ของ /04)
  └── references/          # โค้ดตัวอย่าง/แพทเทิร์นที่ AI จะอ้างอิงแบบ dynamic
```

---

## กติกาการตั้งชื่อ (External Ref ID: บังคับ)

เพื่อให้ trace งานกลับไปหา Jira/GitHub/Redmine/CRM ได้ตรงกันทั้ง repo:

- **External Ref ID ต้องเป็นชื่อโฟลเดอร์หลักของงาน**
- **ถ้ามี ref:** ใช้มาตรฐานเดียวทั้ง repo ตามรูปแบบนี้
  - **Issue Directory**: `PRPs-Framework/issues/{REF}_{slug}/`
  - **ISSUE Spec**: `PRPs-Framework/issues/{REF}_{slug}/spec.md`
  - **PRP file**: `PRPs-Framework/issues/{REF}_{slug}/prp.md`
  - **Branch name**: `{ref}/{type}-{slug}` หรือสั้นกว่า `{ref}-{type}-{slug}`
  - ตัวอย่าง:
    - `PRPs-Framework/issues/EXAMPLE-001_login-fix/spec.md`
    - `PRPs-Framework/issues/EXAMPLE-001_login-fix/prp.md`
    - `example-001/bug-login-fix`
- **ถ้า “ไม่มี ref”**
  - **AI ต้องถามก่อนเสมอ** (ก่อนสร้างไฟล์ / ก่อนแตก branch) ว่าจะใช้เลขอะไรเป็น External Ref ID
  - ถ้า DEV ยืนยันว่า “ไม่มีจริง ๆ” ค่อยใช้ fallback ที่ทีมกำหนด (เช่น `NOREF` หรือ `LOCAL-001`) แต่ต้องได้ **คำตอบชัดเจนจาก DEV ก่อน**

## บทบาทของแต่ละไฟล์

- `INITIAL.md`  
  - ทำหน้าที่เป็น **สารบัญโครงการ (Project Context Index)**  
  - แบ่งเป็นส่วน: Features, Bugs/Issues, Changes, Examples, Documentation, Other Considerations  
  - แต่ละรายการควรลิงก์ไปยังไฟล์ PRP ที่เกี่ยวข้อง เช่น `PRPs-Framework/issues/123_social-login/prp.md`


- `PRPs-Framework/templates/prp_base.md`  
  - เทมเพลตมาตรฐานของ PRP ที่ AI ใช้สร้าง PRP ใหม่
  - มีส่วนสำคัญ เช่น:
    - Change History (สร้าง/อัปเดตเมื่อไหร่, Type, Related PRPs)
    - All Needed Context (docs, references, gotchas)
    - Implementation Blueprint (data models, tasks, pseudocode)
    - Validation Loop (lint/test/integration)
    - Maintenance Notes (สำหรับคนที่มาแก้ในอนาคต)

- `PRPs-Framework/issues/{REF}_{slug}/spec.md`  
  - เป็นไฟล์ ISSUE spec ที่จัดเก็บแยกตามโฟลเดอร์ของแต่ละงาน (แนะนำ)
  - ใช้เป็น input ให้คำสั่ง `/02-Plan-Implementation` เพื่อสร้างแผนในโฟลเดอร์เดียวกัน

- `PRPs-Framework/issues/{REF}_{slug}/prp.md` (แนะนำ) หรือ `PRPs-Framework/PRPs/*_prp.md` (แบบเดิม)
  - คือ PRP ฉบับเต็มที่ AI สร้างจากสเปค
  - ใช้ร่วมกับคำสั่ง `/03-Implement-Code` เพื่อให้ AI ลงมือเขียนโค้ด/ทดสอบตามแผน

- `PRPs-Framework/references/`  
  - เก็บโค้ดตัวอย่าง, แพทเทิร์น, docs ที่อยากให้ AI ดูและทำตาม
  - `generate-prp` จะสแกนโฟลเดอร์นี้แบบ dynamic แล้วอ้างอิง path จริงใน PRP

- `PRPs-Framework/_tools/`
  - โฟลเดอร์สำหรับ **scripts/ไฟล์ช่วยงานแบบ ad-hoc** (เช่น hotfix checker, one-off data check, repro script) และ **ไฟล์คู่มือ `.md`** ที่มาพร้อมกัน
  - หลักการ: โฟลเดอร์นี้ **ควรลบทิ้งได้** โดยไม่กระทบโปรเจกต์ (ไม่เป็น dependency หลักของระบบ)
  - โค้ดใน `_tools/`:
    - **อ่านค่า config จากโปรเจกต์ได้** (เช่นจากไฟล์ config/.env ที่มีอยู่)
    - **ห้าม hardcode ค่า secret** (token/password/keys) ลงในสคริปต์
  - ถ้ามีการสร้างไฟล์ที่เป็น “references เพิ่มเติมของโปรเจกต์” ให้เก็บไว้ใน `PRPs-Framework/references/` และตั้งชื่อขึ้นต้นด้วย `REF_`

---

## Agent-based Development Flow

Framework นี้รองรับ **Agent-based Development Flow** ที่ช่วยให้คุณทำงานร่วมกับ AI ได้อย่างเป็นระบบ ตั้งแต่การกำหนด tasks ไปจนถึงการ implement และ validation

### Flow Overview (Workflow หลัก - ISSUE → Subtasks)

```
ISSUE (GitHub/Jira/Stakeholder)
    ↓
/01-Draft-New-Task BUG 456 Login fails
    ↓
PRPs-Framework/issues/456_login-fails/spec.md
    ↓
/02-Plan-Implementation PRPs-Framework/issues/456_login-fails/spec.md
    ↓
PRPs-Framework/issues/456_login-fails/prp.md (พร้อม Plan/Subtasks)
    ↓
/03-Implement-Code PRPs-Framework/issues/456_login-fails/prp.md --auto-qa
    ↓
[ทำงานทีละ subtask, อัปเดต progress `[OK]`]
    ↓
[รัน validation อัตโนมัติ | ผลเก็บที่ qa_result.md]
    ↓
✅ Complete
```

### Commands หลัก (Workflow หลัก - ISSUE → Subtasks)

| Command | ใช้เมื่อ | Syntax | ผลลัพธ์ |
|---------|---------|--------|---------|
| `/00-Init-Project-Context` | **ครั้งแรกหลัง extract** — สร้าง/อัปเดต INITIAL.md (สแกนโปรเจกต์ + โฟลเดอร์ issues) | `/00-Init-Project-Context` | ไฟล์ `INITIAL.md` |
| `/01-Draft-New-Task` | สร้าง ISSUE Folder & Spec | `/01-Draft-New-Task BUG CRM-1023 Login fails` | `PRPs-Framework/issues/1023_login-fails/spec.md` |
| `/02-Plan-Implementation` | สร้าง PRP ในโฟลเดอร์งาน | `/02-Plan-Implementation PRPs-Framework/issues/1023_login-fails/spec.md` | `PRPs-Framework/issues/1023_login-fails/prp.md` |
| `/03-Implement-Code --auto-qa` | ทำงานตามแผน + QA อัตโนมัติ | `/03-Implement-Code PRPs-Framework/issues/1023_login-fails/prp.md --auto-qa` | โค้ดเสร็จ + `[OK]` + ผล QA |

### Commands แบบ Manual (สำหรับงานซับซ้อน)

| Command | ใช้เมื่อ | Syntax | ผลลัพธ์ |
|---------|---------|--------|---------|
| `/03-Implement-Code` | ทำงานตาม Plan/Subtasks (ไม่ auto-qa) | `/03-Implement-Code PRPs-Framework/issues/1023_login-fails/prp.md` | โค้ดเสร็จ และ `[OK]` |
| `/04-Verify-Quality` | รัน QA แยกและเก็บผล | `/04-Verify-Quality PRPs-Framework/issues/1023_login-fails/prp.md` | `qa_result.md` ในโฟลเดอร์งาน |

### Commands ขั้นสูง & Utility (Advanced)

| Command | ใช้เมื่อ | Syntax |
|---------|---------|--------|
| `/05-Strategic-Analysis` | วิเคราะห์คู่แข่ง และวางแผน Roadmap ระยะยาว | `/05-Strategic-Analysis competitor\|roadmap-features` |
| `/06-Ideation-Session` | Brainstorm เพื่อปรับปรุงคุณภาพ, Security, UI/UX หรือ Performance | `/06-Ideation-Session quality\|security\|ui` |
| `/07-Advanced-Spec-Tools` | เครื่องมือช่วยเกลา Spec เช่น Spec Critic หรือ Requirement Gatherer | `/07-Advanced-Spec-Tools critic\|gatherer` |
| `/08-Project-Management` | ประเมินความซับซ้อน (Complexity) และวางแผนขั้นตอนถัดไป | `/08-Project-Management complexity\|followup` |
| `/09-Utility-Tools` | เครื่องมือเบ็ดเตล็ด (Insight extractor, QA Fixer, Base Validation) | `/09-Utility-Tools insight\|qa-fixer` |

### ตัวอย่างการใช้งาน (Workflow หลัก - ISSUE → Subtasks)

**Phase 1: ISSUE → ISSUE Spec → PRP**
```bash
# 1. สร้าง ISSUE Spec จาก ISSUE (GitHub/Jira/Stakeholder)
/01-Draft-New-Task BUG CRM-1023 Login fails after password reset
# → สร้าง PRPs-Framework/issues/ISSUE_EXAMPLE-001.md

# 2. เติมรายละเอียดใน ISSUE Spec (Context, Problem, Steps, Impact)

# 3. สร้าง PRP พร้อม Plan/Subtasks
/02-Plan-Implementation PRPs-Framework/issues/ISSUE_EXAMPLE-001.md
# → สร้าง PRPs-Framework/PRPs/PRPs_BUG-EXAMPLE-001_prp.md พร้อม Plan/Subtasks (T1, T2, T3...)
```

### ตัวอย่างการใช้งาน (Manual Mode - สำหรับงานซับซ้อน)

**สำหรับ Workflow หลัก (ISSUE → Subtasks):**
```bash
# 1. สร้าง ISSUE Spec (รวมถึงสร้าง Folder งาน)
/01-Draft-New-Task BUG 456 Login fails
# → สร้าง PRPs-Framework/issues/456_login-fails/spec.md

# 2. เติมรายละเอียด และให้ AI สร้าง PRP
/02-Plan-Implementation PRPs-Framework/issues/456_login-fails/spec.md
# → สร้าง PRPs-Framework/issues/456_login-fails/prp.md

# 3. Build & QA
/03-Implement-Code PRPs-Framework/issues/456_login-fails/prp.md --auto-qa
```

### คู่มือการใช้งานแบบละเอียด

ดูคู่มือการใช้งานแบบละเอียดได้ที่ [AGENT_FLOW.md](AGENT_FLOW.md)

---

## คำสั่งสำคัญ (Cursor Commands)

### สถานะของการจัดการงาน (Status Symbols)
ในระหว่างการทำงาน AI และผู้ใช้จะใช้สัญลักษณ์เหล่านี้เพื่อบอกสถานะของแต่ละ Task:
- `[OK]` - **Complete**: งานเสร็จสมบูรณ์
- `[..]` - **In Progress**: กำลังดำเนินการ
- `[--]` - **Initialized**: เริ่มต้นสร้าง (ยังไม่ได้เริ่มทำ)
- `[  ]` - **Pending**: รอกำลังดำเนินการ

---

### 0. `/00-Init-Project-Context` – คำสั่งแรกหลัง Extract (สร้าง/อัปเดต INITIAL.md)

ใช้เมื่อ download zip ไฟล์และ extract Framework ไปวางไว้ในโปรเจกต์แล้ว ต้องการให้มีดัชนีโครงการ (`INITIAL.md`) ที่สะท้อนสภาพปัจจุบัน

- **ครั้งแรก:** สร้าง `INITIAL.md` จากเทมเพลต `PRPs-Framework/templates/initial_base.md` แล้วสแกนโปรเจกต์เพื่อเติม:
  - **Project Overview** — ว่าโปรเจกต์เป็นประเภทอะไร (FastAPI / Odoo / PHP / Generic) และคำอธิบายสั้น ๆ
  - **File & Directory Index** — ไฟล์/โฟลเดอร์สำคัญอยู่ที่ไหน (config, source, tests, docs, PRPs)
  - **Features / Bugs / Issues / Changes** — จากไฟล์ PRP ใน `PRPs-Framework/issues/*/prp.md` (ถ้ามี)
  - **Examples** — จาก `PRPs-Framework/references/`
  - **Documentation** / **Other Considerations** — placeholder หรือจากสแกน
- **รันซ้ำ:** อัปเดต `INITIAL.md` ให้ตรงกับสภาพปัจจุบัน (สแกนโปรเจกต์ + PRPs + references อีกครั้ง)

ไม่ต้องส่งอาร์กิวเมนต์ — รันได้เลย  
รายละเอียดเต็มอยู่ใน `.cursor/commands/00-Init-Project-Context.md`

---

### 1. การจัดการ INITIAL.md

**หมายเหตุ:** Commands `/snapshot-init` และ `/generate-init` ถูกยกเลิกและลบไฟล์ออกแล้ว

**สำหรับการเก็บ snapshot:**
- แนะนำให้ใช้ Git เพื่อเก็บประวัติ (commit ก่อนแก้ไข INITIAL.md)

**สำหรับการอัปเดต INITIAL.md:**
- แก้ไข INITIAL.md ด้วยมือ (แนะนำ)
- หรือขอให้ AI ช่วยแก้ไขโดยตรง (ไม่ต้องใช้ command)

---

### 1. `/01-Draft-New-Task ...` – สร้าง ISSUE Spec (input ของ generate-prp)

ใช้ตอนมีงานใหม่ (BUG / FEATURE / CHANGE) แล้วอยากได้โครงสเปคให้กรอก

ตัวอย่าง:

```text
/01-Draft-New-Task BUG CRM-1023 Login fails after password reset
/01-Draft-New-Task FEAT CRM-1044 Add social login
/01-Draft-New-Task CHG AUTH-002 Improve token refresh flow
```

ผลลัพธ์:
- สร้างไฟล์ใน `PRPs-Framework/issues/` เช่น:
  - `PRPs-Framework/issues/456_login-fails/spec.md`
- ด้านในเป็นเทมเพตกลาง เช่น:

```markdown
# ISSUE_CRM-1023: Login fails after password reset

## Type (optional)
BUG | FEATURE | CHANGE | REFACTOR | OTHER

## Context
- [Background, related systems, related PRPs]

## Problem / Goal
- [For BUG: describe the problem]
- [For FEATURE: describe the goal]

## Details
- [Any relevant notes from users, stakeholders, or logs]

## Steps to Reproduce (for BUG) / High-level Requirements (for FEATURE)
- [Step or requirement 1]
- [Step or requirement 2]

## Impact / Priority
- Impact: [Low/Medium/High/Critical]
- Priority: [P1/P2/P3...]

## Related PRPs (if known)
- [PRPs-Framework/PRPs/PRPs_FEAT-xxx_*.md]
- [PRPs-Framework/PRPs/PRPs_BUG-yyy_*.md]
```

> จากนั้น SA/BA/DEV เติมรายละเอียดให้ครบก่อนส่งให้ AI สร้าง PRP

---

### 2. `/02-Plan-Implementation PRPs-Framework/issues/ISSUE_xxx_*.md` – สร้าง PRP เต็ม

เมื่อ spec ใต้ `PRPs-Framework/issues/` พร้อมแล้ว ใช้คำสั่งนี้ให้ AI สร้าง PRP เต็มจาก template `prp_base.md` และ research codebase/docs/references ให้เรียบร้อย

ตัวอย่าง:

```text
/02-Plan-Implementation PRPs-Framework/issues/ISSUE_EXAMPLE-001-after-password-reset.md
```

สิ่งที่เกิดขึ้น (ตาม `.cursor/commands/02-Plan-Implementation.md`):

1. อ่านไฟล์สเปคใน `PRPs-Framework/issues/...`
2. ทำ Research:
   - หา pattern/ตัวอย่างใน codebase
   - อ่าน docs (จากลิงก์ที่ให้ + web search)
   - สแกน `PRPs-Framework/references/` เพื่อดึงโค้ดตัวอย่างที่เกี่ยวข้อง
3. Detect **ประเภทงาน** (Type Detection):
   - ดู `Type:` ในไฟล์ก่อน (BUG/FEATURE/CHANGE/REFACTOR/OTHER)
   - ถ้าไม่มี → เดาจาก keyword ใน title/content เช่น:
     - bug/error/issue/fails → BUG
     - add/implement/new/feature → FEAT
     - refactor/improve/optimize → CHG
     - อย่างอื่น → ISSUE
4. สร้างชื่อไฟล์ PRP ปลายทางที่ `PRPs-Framework/PRPs/`:
   - ตัวอย่าง input: `PRPs-Framework/issues/ISSUE_EXAMPLE-001-after-password-reset.md`
   - Output (ถ้าเป็น BUG):
     - `PRPs-Framework/PRPs/PRPs_BUG-EXAMPLE-001-after-password-reset_prp.md`
5. เขียน PRP ตามโครง `prp_base.md`:
   - Fill `Goal`, `Why`, `What`, `All Needed Context`, `Implementation Blueprint`, `Validation Loop`, `Change History`, `Related PRPs`, `Maintenance Notes` ฯลฯ

> สรุป: `/01-Draft-New-Task` = เขียน “โจทย์”, `/02-Plan-Implementation` = ให้ AI สร้าง “ข้อสอบเฉลยละเอียด + แผนลงมือทำ”

---

### 4. การอัปเดต INITIAL.md

**เมื่อไหรควรอัปเดต INITIAL.md:**

#### อัปเดตอัตโนมัติ (AI จะทำให้อัตโนมัติ)
- ✅ **เมื่อรัน `/02-Plan-Implementation`** → AI จะเพิ่มรายการ PRP ใหม่ใน INITIAL.md อัตโนมัติ

#### อัปเดตด้วยมือ (แนะนำให้ทำเพิ่มเติม)
- 📝 **เพิ่ม Examples** → เมื่อมีโค้ดตัวอย่างใหม่ใน `PRPs-Framework/references/` ที่สำคัญ
- 📝 **เพิ่ม Documentation** → เมื่อมีเอกสารหรือลิงก์ที่สำคัญสำหรับโปรเจกต์
- 📝 **เพิ่ม Other Considerations** → เมื่อมี global gotchas หรือข้อควรระวังที่สำคัญ
- 📝 **อัปเดตชื่อ/รายละเอียด PRP** → เมื่อต้องการปรับชื่อหรือคำอธิบายให้ชัดเจนขึ้น
- 📝 **จัดระเบียบรายการ** → เมื่อต้องการเรียงลำดับตามความสำคัญหรือตามตัวอักษร

**รูปแบบการเพิ่มรายการ PRP:**

```markdown
### Bugs / Issues
- BUG-456: Login fails after password reset - PRP: `PRPs-Framework/PRPs/PRPs_BUG-456_login-fails-after-password-reset_prp.md`

### Features
- FEAT-123: Add social login - PRP: `PRPs-Framework/PRPs/PRPs_FEAT-123_add-social-login_prp.md`

### Changes / Refactors
- CHG-200: Refactor authentication flow - PRP: `PRPs-Framework/PRPs/PRPs_CHG-200_refactor-auth-flow_prp.md`
```

**วิธีอัปเดต:**
- แก้ไข INITIAL.md ด้วยมือ (แนะนำ)
- หรือขอให้ AI ช่วยแก้ไขโดยตรง (ไม่ต้องใช้ command)

> **แนวคิด:** INITIAL.md = Index สั้น ๆ ที่ชี้ไปหา PRPs, references, และ documentation ที่สำคัญ ใช้เป็น "หน้าหลัก" สำหรับดูภาพรวมโปรเจกต์

---

### 3. `/03-Implement-Code PRPs-Framework/PRPs/PRPs_TYPE-xxx_..._prp.md` – ลงมือ implement ตาม PRP

เมื่อ PRP พร้อมและ DEV จะเริ่มทำงาน ให้ใช้คำสั่ง:

```text
/03-Implement-Code PRPs-Framework/PRPs/PRPs_BUG-EXAMPLE-001-after-password-reset_prp.md
```

ใน `.cursor/commands/03-Implement-Code.md` มี flow ดังนี้:

#### 0. Git Branch & Checkpoints (ถ้าใช้ Git)

1. ตรวจว่าโฟลเดอร์เป็น Git repo หรือไม่
   - ถ้าไม่ใช่หรือ Git ใช้งานไม่ได้ → ข้าม step นี้ไป ใช้ current branch
2. ถ้าเป็น Git repo:
   - สร้างชื่อ branch จากชื่อไฟล์ PRP เช่น:
     - PRP: `BUG-EXAMPLE-001-after-password-reset_prp.md`
     - Ref: `crm-1023`
     - Type+Slug: `bug-login-fails-after-password-reset`
     - Branch (แนะนำ): `crm-1023/bug-login-fails-after-password-reset`
     - Branch (สั้น): `crm-1023-bug-login-fails-after-password-reset`
   - ถ้า branch ยังไม่มี → สร้างและ checkout
   - ถ้ามีอยู่แล้ว → checkout ไป branch นั้น
3. ระหว่างทำงาน:
   - หลังจบ task สำคัญหรือหลัง validation ผ่าน:
     - เช็กว่ามี diff หรือไม่
     - ถ้ามี:
       - `git add -A`
       - `git commit -m "PRP BUG-456: checkpoint - <คำอธิบายสั้น ๆ>"`

#### 1. Load PRP

- อ่าน PRP, ทำความเข้าใจ Goal/Why/What/Context/Blueprint/Validation

#### 2. ULTRATHINK & Task Planning

- ตัดสินใจว่าจะ:
  - แตกงานตาม `list of tasks` ใน PRP (ใช้ TodoWrite)  
  - หรือ implement เป็นก้อนเดียว (simple PRP)

#### 3. Execute the plan

- ทำงานตาม tasks หรือ implement ตาม PRP

#### 4. Validate

- รันคำสั่ง lint/test/integration ตาม Validation Loop ใน PRP
- แก้จนผ่านทั้งหมด

#### 5. Complete

- เช็ก Final validation Checklist ใน PRP ให้ครบทุกข้อ
- สรุปว่า feature/bug นี้พร้อมใช้งานแล้ว

#### 6. Reference

- PRP เก็บไว้เป็นเอกสารอ้างอิงในอนาคต (เชื่อมกับ Change History / Related PRPs)

---

## Flow การทำงานแบบเต็ม (ตั้งแต่มี issue ใหม่จนจบ)

### วิธีที่ 1: Workflow หลัก - ISSUE → Subtasks (แนะนำ)

**SA / BA / PO – เริ่มโจทย์ใหม่**

1. มี ISSUE จาก GitHub/Jira/Stakeholder:
   - ตัวอย่าง: "BUG 456: Login fails after password reset"
   - หรือ Feature request: "FEAT 123: Add social login"

2. สร้าง ISSUE Spec:
   ```text
   /01-Draft-New-Task BUG 456 Login fails after password reset
   ```
   - จะได้ไฟล์ `PRPs-Framework/issues/ISSUE_456_login-fails-after-password-reset.md`

3. เติมรายละเอียดใน ISSUE Spec:
   - Context, Problem/Goal, Steps to Reproduce หรือ Requirements
   - Impact, Priority, Related PRPs

**DEV / AI – สร้าง PRP และลงมือทำ**

4. สร้าง PRP พร้อม Plan/Subtasks:
   ```text
   /02-Plan-Implementation PRPs-Framework/issues/ISSUE_456_login-fails-after-password-reset.md
   ```
   - จะได้ไฟล์ PRP ใหม่ใน `PRPs-Framework/PRPs/PRPs_BUG-456_login-fails-after-password-reset_prp.md`
   - PRP จะมี section "Plan / Subtasks" ที่ละเอียด (T1, T2, T3...)

5. อัปเดต `INITIAL.md` ให้มีลิงก์ไป PRP นี้ (แก้ไขด้วยมือ หรือขอให้ AI ช่วย)

6. เริ่ม implement ตาม Plan/Subtasks + รัน QA อัตโนมัติ:
   ```text
   /03-Implement-Code PRPs-Framework/PRPs/PRPs_BUG-456_login-fails-after-password-reset_prp.md --auto-qa
   ```
   - AI จะทำงานทีละ subtask (T1, T2, T3...) ตาม Plan/Subtasks
   - ถ้ามี Git → สร้าง branch `bug-456-login-fails-after-password-reset-prp` และ commit checkpoint เป็นระยะ
   - Subtasks จะถูกติ๊ก `[OK]` หลังเสร็จ
   - หลัง subtasks ทั้งหมดเสร็จ → AI รัน validation อัตโนมัติ
   - AI สรุปผล: Build + QA

7. ถ้า QA fail → แก้ไข:
   ```text
   /03-Implement-Code PRPs-Framework/PRPs/PRPs_BUG-456_login-fails-after-password-reset_prp.md
   /03-Implement-Code PRPs-Framework/PRPs/PRPs_BUG-456_login-fails-after-password-reset_prp.md --auto-qa
   ```

8. ปิดงาน:
   - อัปเดต `INITIAL.md` / PRP (Change History) ถ้ามีการเปลี่ยนแปลงเพิ่มเติม
   - ปิด ISSUE ใน GitHub/Jira

---

## Commands Reference

### Commands หลัก (Workflow หลัก - ISSUE → Subtasks)

- **`/01-Draft-New-Task`** - สร้าง ISSUE Spec จาก ISSUE (GitHub/Jira/Stakeholder)
- **`/02-Plan-Implementation`** - สร้าง PRP พร้อม Plan/Subtasks จาก ISSUE spec (สร้าง Plan/Subtasks อัตโนมัติ - T1, T2, T3...)
- **`/03-Implement-Code --auto-qa`** - ทำงานตาม Plan/Subtasks + รัน validation อัตโนมัติ

### Commands แบบ Manual (สำหรับงานซับซ้อน)

- **`/03-Implement-Code`** - ทำงานตาม Plan/Subtasks ใน PRP ทีละ subtask (ไม่ auto-qa)
- **`/04-Verify-Quality`** - รัน validation ตาม Validation Loop และสรุปผล (แยก)

### Commands เดิม (ยังใช้ได้)

- **`/create-issue`** - สร้าง ISSUE spec แบบ manual

### Commands ที่ Deprecated (ถูกลบออกแล้ว)

- **`/plan-prp`** ⚠️ - ถูกลบแล้ว ใช้ `/02-Plan-Implementation` แทน (สร้าง Plan/Subtasks อัตโนมัติ)
- **`/build-prp`** ⚠️ - ถูกลบแล้ว ใช้ `/03-Implement-Code` แทน (รองรับ Plan/Subtasks + --auto-qa)
- **`/generate-init`** ⚠️ - ถูกลบแล้ว แก้ไข INITIAL.md ด้วยมือ หรือขอให้ AI ช่วยโดยตรง
- **`/snapshot-init`** ⚠️ - ถูกลบแล้ว ใช้ Git commit หรือคัดลอกด้วยมือแทน

## สรุปแนวคิดสำคัญ

### Workflow หลัก (ISSUE → Subtasks)
- **ISSUE** = ปัญหา/feature request จาก GitHub/Jira/Stakeholder
- **ISSUE Folder** (`PRPs-Framework/issues/{REF}_{slug}/`) = โฟลเดอร์งานแยกเฉพาะ
- **ISSUE Spec** (`spec.md`) = โจทย์/ข้อกำหนดที่ละเอียด
- **PRP** (`prp.md`) = แผนการทำพร้อม Plan/Subtasks (T1, T2, T3...)
- **Subtasks** = งานย่อยที่ต้องทำตามลำดับ (T1, T2, T3...)
- **`01-Draft-New-Task`** = สร้าง ISSUE Folder & Spec
- **`02-Plan-Implementation`** = สร้าง PRP ในโฟลเดอร์เดียวกัน
- **`03-Implement-Code --auto-qa`** = ทำงานตามแผนทีละ subtask + อัปเดต progress `[OK]` + รัน validation อัตโนมัติ

### อื่น ๆ
- **`INITIAL.md`** = Index ของโปรเจกต์ ใช้ดูภาพรวม/ลิงก์กลับไปหา PRPs (แก้ไขด้วยมือ หรือขอให้ AI ช่วย)
- **Manual Mode** = แยก Build และ QA (ใช้เมื่อต้องการตรวจสอบ ISSUE spec ก่อนสร้าง PRP)

## Workflow Comparison

**Workflow หลัก - ISSUE → Subtasks (แนะนำ):**
- 3 commands: `/01-Draft-New-Task` → `/02-Plan-Implementation` → `/03-Implement-Code --auto-qa`
- เหมาะสำหรับ: ISSUE จาก GitHub/Jira/Stakeholder

**Manual Mode (สำหรับงานซับซ้อน):**
- 4-5 commands: `/01-Draft-New-Task` → [เติมรายละเอียด] → `/02-Plan-Implementation` → `/03-Implement-Code` → `/04-Verify-Quality`
- เหมาะสำหรับ: งานที่ต้องการตรวจสอบ ISSUE spec ก่อนสร้าง PRP

ถ้าอยากปรับ flow ให้เหมาะกับ process ภายในทีม (เช่น mapping กับ Jira/Redmine/Task Board) สามารถเพิ่มเติม section ใหม่ใน README นี้และผูก ISSUE ID → PRP → Branch naming ได้ไม่ยากครับ


## Refer

- https://github.com/coleam00/context-engineering-intro
