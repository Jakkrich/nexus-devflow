---
name: code-modernization
description: "[devflow] Guided legacy codebase modernization (Assessment, Business Rules mining, Uplift, Rewrite & Byte-for-byte Proof). Use for /code-modernization, /modernize, legacy code upgrades, or architectural rebuilds."
argument-hint: "[<system-name> | <legacy-path>] [--source <path>] [--track <uplift|transform|reimagine>] [--lang <th|en>]"
---

# 🚀 code-modernization - Guided Legacy Modernization Orchestrator

$ARGUMENTS

**Aliases:** `/code-modernization`, `/modernize`

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

`code-modernization` is the flagship modernization orchestrator in Nexus-DevFlow, bringing the complete power of Anthropic's **Official Code Modernization Plugin** directly into your project with **Zero Cognitive Load**.

The user does **NOT** need to memorize 13 sub-commands or track complex manual steps. This skill serves as an **Autonomous State Machine & Interactive Guide**: it inspects the current state, handles the next logical phase, and asks questions only at required human decision gates.

---

## 🇹🇭 มาตรฐานภาษา: บังคับใช้ภาษาไทย (Thai First) เป็นค่าเริ่มต้น

> [!IMPORTANT]
> **กฎเหล็กของ Nexus-DevFlow**: เอกสารผลลัพธ์ (Artifacts) ทุกฉบับและการสนทนากับผู้ใช้ **ต้องเป็นภาษาไทย (`th`) โดยค่าเริ่มต้นเสมอ**

### 1. กฎการสร้าง Artifacts ใน `analysis/<system>/` เป็นภาษาไทย:
ไฟล์ Markdown ทั้งหมดที่ถูกสร้างขึ้นใน `analysis/<system>/` จะต้องเขียนเนื้อหา คำอธิบาย และข้อสรุปเป็น **ภาษาไทย** ทั้งหมด:
- **`INTENT.md`**: เป้าหมายหลัก, ขอบเขตและข้อจำกัด, เหตุผลทางธุรกิจ, และเงื่อนไขที่ไม่เปลี่ยนแปลง (Invariants)
- **`PREFLIGHT.md`**: การตรวจสภาพแวดล้อมก่อนเริ่ม, สรุปผลการตอบ 5 คำถามมนุษย์, และความพร้อมของชุดคำสั่งทดสอบเดิม
- **`ASSESSMENT.md`**: การประเมินโค้ดเบสเดิม, รายการหนี้ทางเทคนิค (Technical Debt), ความซับซ้อน, และความเสี่ยงในการย้ายระบบ
- **`MAP.md`**: แผนผังสถาปัตยกรรม, ขอบเขตโมดูล, จุดเชื่อมต่อ API, และกระแสข้อมูล (Dataflows)
- **`RULES.md` / `BUSINESS_RULES.md`**: กฎทางธุรกิจและ Scenario (อธิบายเป็นภาษาไทย โดยคงคีย์เวิร์ด `Given / When / Then` เป็นภาษาอังกฤษได้)
- **`BRIEF.md` / `MODERNIZATION_BRIEF.md`**: แผนงาน Modernization แบบแบ่งระยะ (Phased Plan), ลำดับการย้าย และแผนการส่งมอบ
- **`PROOF.md`**: ผลการพิสูจน์ความถูกต้องและความเทียบเคียง (Equivalence Proof)
- **`DELTA_CATALOG.md`**: แคตตาล็อกความแตกต่างของพฤติกรรมเดิม vs พฤติกรรมใหม่
- **`SECURITY_FINDINGS.md`**: รายการข้อตรวจพบความปลอดภัยและคำแนะนำแก้ไข (ในคอลัมน์ Severity ให้ใช้ `Critical`, `High`, `Medium`, `Low` เพื่อความเข้ากันได้กับตัวนับสถิติของ `build_report.py`)
- **`HARDENING.md`**: แผนและผลการปิดช่องโหว่ความปลอดภัย

### 2. ศัพท์เทคนิคและส่วนที่คงภาษาอังกฤษไว้:
- ชื่อฟังก์ชัน, ชื่อคลาส, ชื่อตาราง/คอลัมน์ฐานข้อมูล, File Path, SQL Query, CVE ID, รหัสกฎ (เช่น `RULE-001`), ชื่อแทร็ก (`Uplift`, `Transform`, `Reimagine`) และคำตัดสิน (`PROVEN`, `PARTLY PROVEN`, `NOT PROVEN`) ให้คงเป็นภาษาอังกฤษเพื่อความแม่นยำทางเทคนิค

### 3. การอัปเกรดและแปลไฟล์เดิมอัตโนมัติ (Auto-Translation for Existing Artifacts):
- หากตรวจพบว่าใน `analysis/<system>/` มีไฟล์เดิมที่เป็นภาษาอังกฤษอยู่แล้ว (เช่น ผู้ใช้เคยรันมาก่อน):
  - Agent จะแจ้งผู้ใช้และทำการแปล/ปรับปรุงเนื้อหาของไฟล์เดิมให้เป็นภาษาไทยตามมาตรฐานนี้ทันที
  - จากนั้นรัน `python devflow/.vendor/code-modernization/scripts/build_report.py analysis/<system>` ซ้ำ เพื่อให้ไฟล์แดชบอร์ด **`REPORT.html`** แสดงผลเป็นภาษาไทยอย่างสมบูรณ์

---

## ⚠️ Pre-Flight Check (Vendor Knowledge Base Availability)

Before executing any modernization task:
1. **Check if `devflow/.vendor/code-modernization/` exists in this project**.
2. **If MISSING / NOT INSTALLED**:
   - Inform the user in Thai (per project rules):
     *"คลังความรู้และเครื่องมือ `code-modernization` ยังไม่ได้ติดตั้งในโปรเจกต์นี้"*
   - Provide the exact installation command:
     ```bash
     npx nexus-devflow skill add code-modernization
     ```
   - Offer to run the installation on their behalf and wait for completion.
3. **If PRESENT**:
   - Proceed to the State Machine & Guided Execution below.

---

## 🧭 The Guided 8-Phase Lifecycle & Python Engine

```text
Step 0: INTENT  ──▶ Step 1: PREFLIGHT ──▶ Step 2: ASSESS ──▶ Step 3: MAP
       │                                                         │
       ▼                                                         ▼
Step 8: HARDEN  ◀── Step 7: VERIFY   ◀── Step 6: BUILD  ◀── Step 4 & 5: RULES & BRIEF
  (Security)         (Proof Engine)     (Uplift/Transform)      (Approval Gates)
```

| Phase | What Happens | Output Artifact (ภาษาไทย) | AI Specialist Agent / Python Script |
| :--- | :--- | :--- | :--- |
| **0. Intent** | Gathers goals, constraints, and registers source | `analysis/<sys>/INTENT.md` | Front-door wizard |
| **1. Preflight** | 5 Human questions, sanity build check | `analysis/<sys>/PREFLIGHT.md` | `commands/modernize-preflight.md` |
| **2. Assess** | Tech inventory, complexity, debt, security | `analysis/<sys>/ASSESSMENT.md` | `agents/legacy-analyst.md` |
| **3. Map** | Dependencies, dataflows, entry points | `analysis/<sys>/MAP.html` / `.md` | `commands/modernize-map.md` |
| **4. Extract Rules** | Business rules mined as Given/When/Then | `analysis/<sys>/RULES.md` | `agents/business-rules-extractor.md` + `render_rules.py` |
| **4b. Review** | Human validates / corrects suspicious rules | Updated `RULES.md` | **Human Gate 1** |
| **5. Brief** | Phased modernization plan approved by human | `analysis/<sys>/BRIEF.md` | `agents/architecture-critic.md` (**Human Gate 2**) |
| **6. Build** | Track A (Uplift), Track B (Transform), or Track C (Reimagine) | `modernized/` code | `agents/uplift-migrator.md` or `scaffolder.md` |
| **7. Verify** | Clean tests, byte-for-byte comparison & canaries | `analysis/<sys>/PROOF.md` | `scripts/proof_pack.py` + `compare.py` (**Human Gate 3**) |
| **8. Harden** | Legacy CVE scan & reviewed security patch | `analysis/<sys>/HARDENING.md` | `agents/security-auditor.md` |

Every phase automatically refreshes **`analysis/<sys>/REPORT.html`** using:
```bash
python devflow/.vendor/code-modernization/scripts/build_report.py analysis/<system-name>
```

---

## 🤖 Adaptive State Machine Execution Protocol

Whenever `/code-modernization` or `/modernize` is invoked:

### Step 1: Detect System & Active State
1. Parse arguments: `<system-name>` or `--source <path>`.
2. Inspect `analysis/` and `legacy/`:
   - If no systems exist: Initiate **Phase 0: Intent Wizard**.
   - If one system exists: Automatically resume that system.
   - If multiple systems exist and none specified: Ask the user which system to work on using `ask_question`.

### Step 2: Evaluate Pipeline Progress & Language Check
1. **Language Migration Check**:
   - Inspect existing markdown files in `analysis/<system>/`.
   - If any core artifact is written primarily in English, offer to translate and standardize it to Thai automatically.
2. **Phase Routing**:
   - **No `INTENT.md`**: Run **Phase 0: Intent Wizard** (สร้าง `INTENT.md` เป็นภาษาไทย).
   - **Has `INTENT.md` but no `PREFLIGHT.md`**: Run **Phase 1: Preflight Environment Check** (สร้าง `PREFLIGHT.md` เป็นภาษาไทย).
   - **Has `PREFLIGHT.md` but no `ASSESSMENT.md`**: Run **Phase 2: Codebase Assessment** (สร้าง `ASSESSMENT.md` เป็นภาษาไทย).
   - **Has `ASSESSMENT.md` but no `MAP.md`**: Run **Phase 3: Architecture & Dataflow Map** (สร้าง `MAP.md` เป็นภาษาไทย).
   - **Has `MAP.md` but no `RULES.md`**: Run **Phase 4: Business Rules Mining** (สร้าง `RULES.md` เป็นภาษาไทย).
   - **Has `RULES.md` but no `BRIEF.md`**: Present **Human Gate 1 (Rule Validation)** and generate **Phase 5: Brief** (สร้าง `BRIEF.md` เป็นภาษาไทย).
   - **Has `BRIEF.md` but no Modernized code**: Check if Brief is approved (**Human Gate 2**). If approved, execute **Phase 6: Build** (Uplift/Transform/Reimagine).
   - **Has Modernized code but no `PROOF.md`**: Run **Phase 7: Independent Proof Engine** (`scripts/proof_pack.py`).
   - **Has `PROOF.md`**: Present **Proof Verdict (PROVEN / NOT PROVEN)** and offer **Phase 8: Security Hardening** or DevFlow Delivery Completion (`/complete`).

---

## 👥 The 6 Human Decision Gates (ด่านหน้าถามแทนด้วยภาษาไทย)

When reaching a decision point, use the `ask_question` tool in Antigravity IDE (or interactive modal):

1. **Preflight Intent (กำหนดเป้าหมายการปรับปรุง)**:
   - Question: *เป้าหมายหลักในการปรับปรุงโค้ดเบสระบบนี้คืออะไรครับ?*
     - Option 1: `(Recommended) ทำความเข้าใจระบบก่อน: สร้างแผนผังและสกัดกฎทางธุรกิจทั้งหมด`
     - Option 2: `อัปเกรดเวอร์ชันใหม่ในเทคโนโลยีเดิม (Uplift เช่น PHP 5 -> 8 หรือ Java 8 -> 17)`
     - Option 3: `เขียนใหม่ด้วยเทคโนโลยีที่ทันสมัยทีละโมดูล (Transform เช่น จาก Monolith สู่ Next.js/FastAPI)`
     - Option 4: `ออกแบบและสร้างใหม่ทั้งหมดบนสถาปัตยกรรมสมัยใหม่ (Reimagine)`
   - Question: *เงื่อนไขสำคัญใดที่ต้องรักษาไว้ตลอดการปรับปรุง?*
     - Option 1: `(Recommended) ระบบเดิมต้องทำงานได้ต่อเนื่องตลอดระยะเวลาการย้ายระบบ`
     - Option 2: `พฤติกรรมของระบบใหม่ต้องตรงกับระบบเดิมแบบ Byte-for-byte ทุกประการ`
     - Option 3: `เน้นความสะอาดของสถาปัตยกรรมใหม่ มากกว่าการลอกเลียนแบบจุดแปลกประหลาดเดิม`
2. **Review Extracted Rules (ตรวจสอบความถูกต้องของกฎธุรกิจ)**:
   - Present suspicious rules discovered in `RULES.md` with file/line citations and ask:
     *"กฎธุรกิจนี้ถูกต้องตาม Business Logic ที่ต้องการ หรือเป็น Bug เดิมของระบบเก่าที่ต้องแก้ไขครับ?"*
3. **Approve Modernization Brief (อนุมัติแผนงาน Modernization)**:
   - แสดงแผนงานแบ่งระยะ (Milestone Plan) จาก `BRIEF.md` เพื่อขออนุมัติจากผู้ใช้ก่อนเริ่มลงมือเขียนโค้ด
4. **Select Implementation Track (ยืนยันสแตกและเครื่องมือเป้าหมาย)**:
   - ยืนยัน Target Language, Framework, Compiler Version และ Database Driver
5. **Accept Behavioral Differences (พิจารณาความแตกต่างของพฤติกรรม)**:
   - หาก `compare.py` ตรวจพบความแตกต่างระดับไบต์ (เช่น Masked Timestamp, Floating-point precision) สอบถามผู้ใช้ว่ายอมรับเป็นความแตกต่างที่ตั้งใจ หรือต้องการให้แก้ไข
6. **Sign-off & Security Patch (ตรวจรับมอบและปิดช่องโหว่ความปลอดภัย)**:
   - ตรวจสอบสรุปหน้า `REPORT.html` ขั้นสุดท้าย และเลือกติดตั้ง Patch ปิดช่องโหว่ความปลอดภัยเดิม

---

## 🐍 Python Automation Engine Reference

Execute scripts from `devflow/.vendor/code-modernization/scripts/` using Python 3:

```bash
# 1. Compile single-page interactive report
python devflow/.vendor/code-modernization/scripts/build_report.py analysis/<system>

# 2. Run byte-for-byte differential comparison
python devflow/.vendor/code-modernization/scripts/compare.py --old <legacy_out> --new <modern_out>

# 3. Calculate formal proof verdict (PROVEN / PARTLY PROVEN / NOT PROVEN)
python devflow/.vendor/code-modernization/scripts/proof_pack.py --analysis analysis/<system>

# 4. Render business rules cards
python devflow/.vendor/code-modernization/scripts/render_rules.py analysis/<system>/RULES.md
```

---

## 🔗 Integration with Nexus-DevFlow Core Lifecycle

- **Pre-Flight / Discovery**: Maps seamlessly to DevFlow `/discovery`. Architectural decisions record to `devflow/decisions/ADR-xxx.md`.
- **Approved Brief**: Translates directly into DevFlow's Master Build Plan (`devflow/build-plan.md`) and Task-Isolated Living Spec (`devflow/context/{xxx-slug}/spec.md`).
- **Implementation**: Follows DevFlow's strict TDD Red-Green-Refactor discipline.
- **Verification**: Proof metrics from `proof_pack.py` embed into DevFlow's `/check` matrix and `findings.md`.
- **Archive**: Once `PROVEN`, wraps up with `/complete` and archives to `devflow/history/features/`.
