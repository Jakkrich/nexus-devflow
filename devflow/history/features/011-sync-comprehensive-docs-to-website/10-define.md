# Phase 10: Define Contract

- **Running ID**: `RUN-011-sync-comprehensive-docs-to-website`
- **Title**: ปรับปรุงและสังเคราะห์เนื้อหาบนเว็บไซต์คู่มือ Nexus-DevFlow จากคลังเอกสารทางการในโฟลเดอร์ `docs/` (Usage Guide, Real Cases, Artifact Contracts, HTML Diagrams)
- **Source Discovery**: [DISC-20260818-011-improve-website-docs-from-docs-folder](../../discoveries/DISC-20260818-011-improve-website-docs-from-docs-folder/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Documentation & DX Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

ต่อยอดและยกระดับเนื้อหาบนเว็บไซต์ Documentation (`website/src/content/docs/`) ของ **Nexus-DevFlow 2.0** โดยนำข้อมูลที่เป็นปัจจุบัน ครบถ้วน และเป็นทางการจากคลังเอกสารหลักในโฟลเดอร์ `docs/` มาสังเคราะห์และเผยแพร่อย่างเป็นระบบ:
1. **สังเคราะห์เนื้อหาจากคลังเอกสารทางการ (`docs/`)**:
   - นำข้อมูลจาก `USAGE.md`, `workspace-artifacts.md`, `example-runs.md`, `markdown-metadata-contract.md`, `manual-review-workflow-spec.md`, `workflow-surface-map.md`, `team-presets.md`, และ `governance-rules.md` มาเป็นแกนหลัก
2. **ขยายความ 8-Stage Workflow เชิงลึกแบบ Non-Table พร้อม Interactive HTML Diagrams**:
   - แสดง Purpose, Inputs/Context, Execution Loop, Deliverable Artifacts, และ Review Gate Criteria พร้อมภาพผังกระบวนการ
3. **จัดทำสารบัญและคำอธิบาย Companion Commands ครบถ้วน 70+ ตัว**:
   - แบ่ง 8 หมวดหมู่วิศวกรรม พร้อมไวยากรณ์ Universal Invocation (`/`, `$`, Plain) และตัวอย่าง Use Case จริง
4. **จัดทำ Role-Based Usage Guides สำหรับทุกบทบาท**:
   - แยกตามเส้นทางการทำงานของ Junior Developer, Mid/Senior Engineer, Tech Lead/Architect, และ Product/Engineering Manager

---

## 2. ขอบเขตงาน (In-Scope)

### Slice 1: ปรับปรุงหน้า Workflow หลักและ Mainline Stages
- แก้ไข [`website/src/content/docs/workflow/core-workflow.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/workflow/core-workflow.md) และ [`website/src/content/docs/commands/mainline-stages.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/commands/mainline-stages.md)
- ใส่คำอธิบายกระบวนการ 8 ขั้นตอน (`00-discover` ถึง `70-release`) เชิงลึกแบบ Non-Table พร้อมกล่องผังกระบวนการแบบ Interactive HTML และตัวอย่าง Artifact

### Slice 2: ปรับปรุงและจัดหมวดหมู่ Companion Commands (70+ Skills)
- แก้ไข [`website/src/content/docs/commands/companion-commands.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/commands/companion-commands.md)
- จัดหมวดหมู่ 70+ Skills ตาม 8 กลุ่ม: Core Navigation, Autonomous & Discovery, Investigation & QA, Architecture & Design, Frontend & UI, Backend & Systems, Git & Lifecycle, และ AI Collaboration

### Slice 3: จัดทำหน้า Role-Based Usage Guide
- สร้างหน้าใหม่ [`website/src/content/docs/start/roles-guide.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/start/roles-guide.md)
- ปรับแต่ง [`website/astro.config.mjs`](file:///d:/Projects/devtools/nexus-devflow/website/astro.config.mjs) ให้มีเมนู Role-Based Guides ใน Sidebar

### Slice 4: ตรวจสอบความถูกต้องและการ Build ของเว็บไซต์
- ทดสอบ Build ด้วย `npm run docs:build` (หรือ `astro build`) ในโฟลเดอร์ `website` ให้ผ่าน 100%

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่แก้ไข Core Package ใน `packages/create-nexus-devflow/`
- ไม่สร้างรายการ Skill หรือคำสั่งที่ไม่มีอยู่จริงใน `.agents/skills/`
- ไม่นำข้อมูลส่วนที่เป็นระบบเดิมหรือ Legacy กลับมาใส่ในเอกสาร

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-011`** | `sync-comprehensive-docs-to-website` | ปรับปรุงและสังเคราะห์เนื้อหาบนเว็บไซต์คู่มือ Docs จากโฟลเดอร์ `docs/` ครบทุกส่วนพร้อม Build ตรวจสอบ |

---

## 5. เกณฑ์การยอมรับ (Acceptance Criteria)

1. หน้า `core-workflow.md` และ `mainline-stages.md` มีคำอธิบาย 8 Stages เชิงลึกแบบ Non-Table และมี Interactive HTML Diagrams
2. หน้า `companion-commands.md` แสดงรายการคำสั่งครบทุกโฟลเดอร์ที่มีใน `.agents/skills/` (ทั้ง 8 หมวดหมู่)
3. มีหน้า `start/roles-guide.md` แสดงบน Sidebar ครอบคลุมทั้ง 4 กลุ่มบทบาท
4. เว็บไซต์สามารถ Build ผ่านได้ 100% โดยไม่มีข้อผิดพลาด

---

## 6. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
/20-spec RUN-011-sync-comprehensive-docs-to-website
```
