# Project Plan

> **Document Type**: Project Plan (User-Owned)
> **Purpose**: แหล่งความจริงหลัก (Single Source of Truth) สำหรับวิสัยทัศน์ผลิตภัณฑ์ สถาปัตยกรรมระบบ ขอบเขตการทำงาน และข้อกำหนดทางเทคนิค
> **Workflow**: เมื่อแผนนี้หรือ `build-plan.md` เปลี่ยน ให้รัน `/overview` เพื่อประมวลผลเป็น `project-overview.md`
> **Planning Baseline**: 2026-11-26 — อัปเดตให้ตรงกับสถานะการส่งมอบ DevFlow v3.0.0 และการตัดคิวงานที่ซ้ำซ้อนออก

---

## Product Vision & Target Users

Nexus-DevFlow ช่วย solo developer, ทีมขนาดเล็ก และ maintainer ที่ใช้ AI coding assistants หลายตัวให้ส่งต่องานกันได้ผ่าน workflow แบบ spec-driven ซึ่งเก็บแผน สถานะ หลักฐานตรวจสอบ และประวัติไว้ใน Git repository เดียวกัน แทนการพึ่งพาบริบทในแชตหรือ prompt เฉพาะเครื่อง

---

## 1. Problem Statement - What problem are we solving?

- **Core Problem**: การพัฒนาซอฟต์แวร์ร่วมกับ AI coding agents มักกระจัดกระจายอยู่ในแชตและ prompt เฉพาะเครื่อง ทำให้ขอบเขตงาน เป้าหมาย การตัดสินใจ ผลทดสอบ และประวัติการส่งมอบไม่ต่อเนื่องเมื่อเปลี่ยน agent หรือ IDE
- **Main Purpose**: ทำให้ทีมติดตั้ง workflow แบบ spec-driven ลงใน Git repository ใดก็ได้ แล้วพางานผ่านการวางแผน การสร้าง spec การลงมือทำ การตรวจสอบ และการเก็บประวัติด้วยสัญญา Markdown ที่อ่านได้ทั้งคนและ AI
- **Product Promise**: ผู้ใช้ควรเริ่มหรือรับช่วงงานต่อได้จากสถานะจริงของ repository โดยไม่ต้องจำคำสั่งจำนวนมาก และไม่ต้องเชื่อคำกล่าวอ้างที่ไม่มีหลักฐานจาก test หรือ quality gate

---

## 2. Users - Who is this for?

- **Primary Audience**:
  - Solo developer หรือทีมขนาดเล็กที่ใช้ AI coding assistant หลายตัว
  - Maintainer ที่ต้องการ workflow, review gate และประวัติงานที่ตรวจสอบย้อนหลังได้
- **Secondary Audience**:
  - Solution architect / business analyst ที่รับ requirement แล้วส่งต่อเป็นงานพัฒนา
  - ทีมองค์กรที่ต้องการนำ template และ policy ไปปรับใช้ภายในภายหลัง
- **User Roles**:
  - `Project User`: ติดตั้งหรืออัปเดต DevFlow, เรียกใช้ skills และอ่านสถานะงาน
  - `Contributor`: พัฒนา CLI, workflow contracts, adapters, tests และเอกสารของ Nexus-DevFlow
  - `Maintainer`: ดูแล release, compatibility, package publishing และ migration policy
- **Access Model**: เป็นเครื่องมือ local-first ภายใน Git repository ไม่มีระบบบัญชีผู้ใช้หรือ role-based access control ในผลิตภัณฑ์หลัก

---

## 3. Product Capabilities

### Current Core

- **Overlay Installer & Updater**: ติดตั้งหรืออัปเดต DevFlow ใน repository เดิม โดยรักษาไฟล์ของผู้ใช้และรองรับหลาย agent adapters
- **15 Core Skills**: ครอบคลุม setup, discovery, 4-stage delivery loop, quality review, debugging และ automation โดยลดคำสั่งซ้ำซ้อน
- **Task-Isolated Living Spec**: แยกแต่ละ feature/fix เป็น workspace ที่มี `spec.md`, `stage.md`, `findings.md` และหลักฐานตรวจสอบของตัวเอง
- **Three-Pillars Workspace**: แยก Future, Present และ Past เพื่อให้แผน งานที่กำลังทำ และประวัติไม่ปะปนกัน
- **Quality Gates & Evidence**: ใช้ typecheck, static contracts, routing evals, package smoke tests, review receipts และ findings ledger ก่อนปิดงาน
- **Status CLI & MCP Surfaces**: สรุปสถานะ workflow, drift, gates และ next action จากข้อมูลใน repository ผ่าน CLI และ MCP

### Near-Term Outcomes

1. รักษามาตรฐานคุณภาพของ DevFlow `3.0.0` (`npm run check`, `npm run check:release`, routing evals และ update-resilience proof) ให้พร้อมสำหรับการส่งมอบและ publish
2. คงความเข้ากันได้ของ installer/update บน Windows, macOS และ Linux ผ่าน CI matrix (`Node 20/22/24`) โดยไม่เขียนทับไฟล์ของผู้ใช้
3. คงความแม่นยำของ bilingual routing (`th`/`en`) และป้องกันคำสั่ง legacy รั่วกลับเข้าเอกสารหรือ skills
4. บังคับใช้ overview integrity gate เพื่อป้องกันแผนแบบ placeholder หรือ `project-overview.md` ที่ล้าสมัย
5. คงพื้นผิว CLI และ MCP JSON แบบเบา (Lite-first) ให้แต่ละ IDE/AI agent เรียกใช้งานได้โดยตรงโดยไม่ต้องดูแล UI หรือ sidecar แยก

### Explicit Non-Goals for This Horizon

- ระบบสมาชิก, billing, cloud sync หรือ hosted SaaS
- การเขียนหรือดูแล web dashboard / webview application UI ใน core package (ให้เครื่องมือภายนอกหรือ AI chat ใช้ CLI/MCP JSON แทน)
- การเพิ่ม core skill ใหม่โดยไม่มีหลักฐานว่าความสามารถเดิมรองรับไม่ได้
- การผูก workflow หลักกับ AI vendor หรือ IDE รายเดียว

---

## 4. Data & State Model

- **Planning State**: `project-plan.md`, `build-plan.md`, `ideas.md` และ `ROADMAP.md`
- **Active Delivery State**: task workspace ภายใต้ `devflow/context/{run}/` พร้อม spec, stage, findings และ review receipt
- **Historical State**: archive ภายใต้ `devflow/history/` และสรุปใน `HISTORY.md`
- **Configuration State**: `devflow/config.json`, `.nexus/nexus-devflow.json` และ agent bundle manifest
- **Generated State**: `project-overview.md` และ static documentation ซึ่งต้องสร้างซ้ำได้จาก source files
- **Persistence**: ใช้ Markdown และ JSON ใน Git; ไม่มี database ใน core product

---

## 5. Technology Stack & Constraints

- **Language / Runtime**: TypeScript, ESM, Node.js `>=18.17`
- **Distribution**: npm CLI / overlay installer พร้อม static documentation
- **Adapters**: `.agents/skills` และ `.claude/skills` โดยมี validator ตรวจความสอดคล้อง
- **Storage**: local filesystem + Git; Markdown-first contracts และ JSON configuration
- **Verification**: Node test runner, TypeScript compiler, routing evals, package smoke test และ Playwright เฉพาะ browser-facing changes
- **Compatibility Constraints**:
  - Public CLI, config schema และ stage artifact contracts เปลี่ยนแบบ breaking ไม่ได้หากไม่ขึ้น major version
  - ต้องทำงานข้าม Windows, macOS และ Linux โดยไม่ hardcode path หรือ tool เฉพาะเครื่อง
  - Generated artifacts ต้องสร้างซ้ำได้และไม่เป็น source of truth แทน user-owned plans
  - เพิ่ม dependency หรือ abstraction ใหม่เมื่อมี requirement ปัจจุบันรองรับเท่านั้น

---

## 6. Success Measures

- Required checks (`check`, `check:static`, `test`, `test:package`) ผ่านก่อนส่งมอบ
- Routing benchmark ที่ประกาศรองรับผ่าน 100% และไม่มี false activation ในชุด eval
- Fresh install และ update path ผ่าน smoke/CI matrix บน OS และ Node.js รุ่นที่ระบุ
- ไม่มี retired command, broken internal link หรือ adapter drift ในแพ็กเกจที่เผยแพร่
- Overview ปฏิเสธหรือแจ้งเตือน planning placeholders อย่างชัดเจน แทนการสร้าง source of truth ที่ไม่ครบ
- Core skill count และ prompt budget ไม่เพิ่มขึ้นโดยไม่มี decision record และหลักฐานความจำเป็น

---

## 7. Planning Assumptions & Open Decisions

- **Assumption**: คิวงานหลักสำหรับ `v3.0.0` ส่งมอบครบแล้ว; Core package คงความเบาแบบ CLI/MCP-first โดยไม่มี Web Dashboard, Studio UI หรือ IDE sidecar ในแพ็กเกจหลัก
- **Assumption**: รองรับ Node.js `>=18.17` และใช้ GitHub Actions CI matrix (`ubuntu`, `windows`, `macos` บน Node `20/22/24`) เป็นหลักฐานข้ามแพลตฟอร์ม
- **Governance**: การ merge เข้า `main`, การติด Git tag และการ `npm publish` ต้องได้รับอนุมัติจาก maintainer แยกต่างหากเสมอ
- **Future Gate**: งานใหม่หลัง `3.0.0` จะเข้าคิวใน `build-plan.md` เมื่อมีหลักฐานปัญหาจากการใช้งานจริงเท่านั้น (Proportional Engineering / YAGNI)
