# Fix: Remove In-IDE Interactive Choice and Predictive Follow-Up Feature

**Type:** Fix  
**Target ID:** `113-fix-remove-interactive-choice`  
**Status:** Completed & Archived  
**Completed Date:** 2026-10-30  
**Discovery Ref:** [`DISC-20261030-001-remove-interactive-choice-predictive-followup`](file:///d:/devtools/nexus-devflow/devflow/discoveries/DISC-20261030-001-remove-interactive-choice-predictive-followup/discovery.md)  

---

## 📌 The Problem (ปัญหาที่พบ)

ใน commit `08cbe9a` ได้มีการนำเข้าฟีเจอร์ Feature 112 ("In-IDE Interactive Choice & Predictive Follow-Up Gate") ซึ่งบังคับให้ AI Agent ใน Google Antigravity IDE ต้องเรียกใช้เครื่องมือ `ask_question` เสมอเมื่อใดก็ตามที่มีการนำเสนอทางเลือก 2+ ตัวเลือก หรือคำถามติดตาม

1. **Intrusive Modal & Disrupted Developer Flow**: การบังคับเรียก `ask_question` ทำให้เกิดหน้าต่าง Pop-up Modal เด้งทับหน้าจอสนทนา บดบังคำอธิบายและขัดจังหวะการอ่านบริบทของนักพัฒนา
2. **Loss of Natural Conversational Agility**: กฎข้อ 7 ใน `AGENTS.md` และ `.agents/rules/interactive-selection.md` มีข้อห้ามเข้มงวดไม่ให้ Agent พิมพ์รายการตัวเลือกหรือข้อคิดเห็นลงในช่องแชตปกติ ทำให้การสนทนาแข็งทื่อและไม่คล่องตัว
3. **Over-engineering & Token Bloat**: การโหลดไฟล์กฎ `interactive-selection.md` และคู่มืออ้างอิงตลอดทุก Session สร้างภาระ Token โดยไม่จำเป็น

---

## 🎯 The Fix (แนวทางแก้ไข)

1. **ลบไฟล์เฉพาะทางของ Feature 112**:
   - ลบ [`.agents/rules/interactive-selection.md`](file:///d:/devtools/nexus-devflow/.agents/rules/interactive-selection.md)
   - ลบ [`devflow/reference/interactive-picker.md`](file:///d:/devtools/nexus-devflow/devflow/reference/interactive-picker.md)
2. **ปลดล็อกข้อบังคับในเอกสารหลัก**:
   - ลบ Directive ข้อที่ 7 (**Interactive Choice & Predictive Follow-Up Gate (Summary First)**) ออกจาก [`AGENTS.md`](file:///d:/devtools/nexus-devflow/AGENTS.md)
   - ลบหัวข้อย่อย Interactive Choice ออกจาก Section 2 ของ [`devflow/context/ai-interaction.md`](file:///d:/devtools/nexus-devflow/devflow/context/ai-interaction.md)
3. **บันทึกสถานะการเลิกใช้และถอดถอน (Deprecation & Removal)**:
   - ปรับปรุงรายการ 112 ใน [`devflow/build-plan.md`](file:///d:/devtools/nexus-devflow/devflow/build-plan.md) ให้บันทึกว่าถูกถอดออกตามคำสั่งผู้ใช้
   - บันทึกการเปลี่ยนแปลงใน [`CHANGELOG.md`](file:///d:/devtools/nexus-devflow/CHANGELOG.md)
4. **สิ่งที่ต้องไม่กระทบ (Guardrails)**:
   - สิทธิ์และความสามารถในการใช้ native tool `ask_question` ใน Antigravity IDE ยังคงมีอยู่สำหรับกรณีเจาะจงที่ Agent หรือผู้ใช้ต้องการถามแบบ multiple-choice จริงๆ
   - การทำงานของสกิลเฉพาะทาง เช่น `code-modernization` ที่มี decision gates เฉพาะ ไม่ได้รับผลกระทบ
   - Framework static validation (`npm run check:static`) และ Test Suites (`npm test`) ต้องผ่าน 100%

---

## 🔨 Build Steps (ขั้นตอนการพัฒนา)

- [x] **Step 1: ลบไฟล์กฎและคู่มือเฉพาะของ Interactive Choice**
  - ลบ `.agents/rules/interactive-selection.md`
  - ลบ `devflow/reference/interactive-picker.md`
  - *Evidence*: ไฟล์ทั้งสองถูกลบผ่าน git rm เรียบร้อย

- [x] **Step 2: อัปเดตกฎและเอกสารสถาปัตยกรรม (AGENTS.md, ai-interaction.md, build-plan.md, CHANGELOG.md)**
  - นำ Directive ข้อ 7 ออกจาก `AGENTS.md`
  - นำ bullet Interactive Choice ออกจาก `devflow/context/ai-interaction.md`
  - อัปเดตรายการที่ 112 ใน `devflow/build-plan.md`
  - อัปเดต `CHANGELOG.md`
  - *Evidence*: เอกสารหลักถูกปลดล็อกข้อบังคับและบันทึกการถอดถอนเรียบร้อย

- [x] **Step 3: ตรวจสอบความถูกต้องและรัน Verification Gates**
  - รัน `npm run check:static` (Pass 100%)
  - รัน `npm test` (Pass 100%, 0 failures across all suites)
  - *Evidence*: ชุดตรวจสอบและทดสอบผ่านทั้งหมดโดยไม่มี regression

---

## 🧾 Empirical Evidence & Verification Record

### 1. Static Contract Verification (`npm run check:static`)
```text
OK: Found agent-bundle.manifest.json
OK: Found package.json
OK: Found AGENTS.md
OK: Found CLAUDE.md
OK: Found .agents/skills
OK: Found .claude/skills
OK: Found .nexus/nexus-devflow.json
OK: Found devflow/context/project-overview.md
OK: Found devflow/context/coding-standards.md
OK: Found devflow/context/ai-interaction.md
OK: Found devflow/reference/running-id-contract.md
OK: ROADMAP.md markdown validation passed
OK: Skill naming passed for 39 skills in .agents/skills
OK: .agents/skills contains all 33 Core Skills
OK: .claude/skills contains all 33 Core Skills
OK: Core Skill documentation count is synchronized (33)
OK: [.agents] All skills within token byte budget ceilings (127 markdown instruction files)
OK: [.claude] All skills within token byte budget ceilings (127 markdown instruction files)
OK: .nexus/nexus-devflow.json version is synchronized ("2.19.3")
OK: Lifecycle contracts validated for 8 skills across both adapters
Nexus-DevFlow framework static validation completed successfully!
```

### 2. Full Test Suite (`npm test`)
```text
> nexus-devflow@2.19.3 test
> npm --prefix packages/create-nexus-devflow test && npm run test:overview && npm run test:sandbox && npm run test:run-state && npm run test:tooling
...
✔ ActiveContextEngine: resolves clean idle workspace
✔ DeliveryLifecycleEngine Seam & Snapshot
✔ McpServerEngine Seam & Dispatch
✔ ProjectStatusEngine Seam & Snapshot
✔ run-state helper tests (5 pass, 0 fail)
✔ ToolingEngine Seam (49 pass, 0 fail)
All test suites passed cleanly with 0 failures!
```

### 3. Residual Scan (`git grep -i "interactive-selection"`)
Only changelog references remain in `CHANGELOG.md`. Zero active rules or directives remain.

