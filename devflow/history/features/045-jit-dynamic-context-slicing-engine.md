# 📐 [045-jit-dynamic-context-slicing-engine] Just-In-Time (JIT) Dynamic Context Slicing Engine

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Source**: `devflow/build-plan.md: Feature 4` & `DISC-20260823-002: Defense 3`  
> **Branch**: `feature/045-jit-dynamic-context-slicing-engine`  
> **Completed Date**: 2026-08-23  

---

## 1. Specification & Scope

- **Problem Statement**:
  ปัจจุบันเมื่อ AI Coding Agents ทำงานในแต่ละขั้นตอนของ DevFlow เช่น `/implement`, `/check`, `/00-explore`, `/feature` ตัวโมเดลมักจะต้องโหลดและอ่านไฟล์เอกสารบริบทขนาดยาวทั้งฉบับ (`project-overview.md`, `coding-standards.md`, `findings.md`, `ideas.md`, `build-plan.md`) ซึ่งกินพื้นที่บริบท (Context Window) มหาศาลถึง 15k–40k tokens ต่อครั้ง ส่งผลให้เกิด Token Bloat, สิ้นเปลืองค่าใช้จ่าย API และทำให้ความสนใจของโมเดลต่อเนื้องานหลักลดลง (Attention Degradation) ระบบต้องการ **JIT Dynamic Context Slicing Engine** เพื่อจัดสรร ตัดตอน และบีบอัดเฉพาะบริบทที่จำเป็นสำหรับแต่ละสเตจ พร้อมควบคุม Token Budget ช่วยลดการใช้ Token ลง 60–70%

- **In-Scope**:
  1. **JIT Context Slicing Engine (`packages/create-nexus-devflow/lib/context-slicer.ts`)**:
     - พัฒนา `estimateTokenCount`: คำนวณประมาณการจำนวน Token อย่างรวดเร็วและแม่นยำ
     - พัฒนา `pruneMarkdownSections`: ตัดตอนและกรองหัวข้อ Markdown โดยเลือกเฉพาะ Section ที่จำเป็นตาม Whitelist Headings
     - พัฒนา `sliceContextForStage`: ฟังก์ชันสร้าง Stage-Aware Slices:
       - **`implement` slice**: ตัดตอนเฉพาะ Active Task ปัจจุบัน + Relevant Rules ใน Coding Standards + Active Findings Blockers + In-Scope Spec (ประหยัด Token ได้ ~68%)
       - **`check` slice**: ตัดตอนเฉพาะ Acceptance Criteria + Verification Matrix + Active Blockers
       - **`explore` slice**: ตัดตอนเฉพาะ System Architecture Summary + Roadmap Milestones + Pending Ideas
       - **`feature` slice**: ตัดตอนเฉพาะ Next Feature Queue ใน Build Plan + Architectural Directives
     - รองรับตัวเลือก `maxTokens` (Token Budget Enforcer) เพื่อป้องกันไม่ให้บริบทล้นขีดจำกัด
  2. **CLI Subcommand Integration (`packages/create-nexus-devflow/bin/create-nexus-devflow.ts`)**:
     - เพิ่มคำสั่ง `nexus-devflow slice --stage <stage> [--max-tokens <num>] [--json]`
  3. **MCP Tool Integration (`packages/create-nexus-devflow/lib/mcp.ts`)**:
     - เพิ่ม Tool `devflow_get_sliced_context` ใน DevFlow MCP Server เพื่อให้ AI Agent เรียกรับบริบทแบบ JIT โดยตรง
  4. **Automated Unit & Multi-Lane Tests (`packages/create-nexus-devflow/test/context-slicer.test.ts`)**:
     - เขียนชุดทดสอบครอบคลุม Token Estimator, Slicing Logic ทุก Stage, Section Pruning, Token Budgeting และ Error Fallback

- **Out-of-Scope**:
  - ไม่รวม Semantic Vector Database ในเฟสนี้ (เน้น Deterministic AST & Heading-based Slicing ที่เร็วกว่าและไม่ต้องพึ่งพา External API Keys)

- **Acceptance Criteria (เกณฑ์การยอมรับ)**:
  - [x] **AC-01**: `estimateTokenCount` คำนวณจำนวน Token ของข้อความได้อย่างแม่นยำ
  - [x] **AC-02**: `sliceContextForStage` สำหรับ stage `implement` คืนค่าเฉพาะ Active Task, Relevant Standards, และ Active Findings โดยลดขนาด Token ลงมากกว่า 50% (ประหยัดได้ ~68%)
  - [x] **AC-03**: `sliceContextForStage` สำหรับ stage `check` คืนค่าเฉพาะ Acceptance Criteria และ Verification Matrix
  - [x] **AC-04**: `nexus-devflow slice --stage implement` รันผ่าน CLI และคืนค่า Sliced Markdown ได้อย่างถูกต้อง
  - [x] **AC-05**: MCP Tool `devflow_get_sliced_context` คืนค่า Sliced Context สำหรับ Agent ได้อย่างสมบูรณ์
  - [x] **AC-06**: ชุดทดสอบทั้งหมด 100% ผ่าน (`npm test` และ `npm run check` สำเร็จ 0 ข้อผิดพลาด)

---

## 2. Plan & Test Strategy

- **Files to Modify/Create**:
  - `packages/create-nexus-devflow/lib/context-slicer.ts` (ใหม่: Core JIT Slicing Engine, Token Estimator & Section Pruner)
  - `packages/create-nexus-devflow/lib/mcp.ts` (แก้ไข: เพิ่ม `devflow_get_sliced_context` Tool)
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` (แก้ไข: เพิ่ม `slice` Subcommand)
  - `packages/create-nexus-devflow/test/context-slicer.test.ts` (ใหม่: Automated Tests สำหรับ Slicing Engine)

- **Test Decision**:
  - Node.js Native Test Runner (`npm test` ภายใต้ `packages/create-nexus-devflow/`)
  - Token Reduction Benchmark Test (เปรียบเทียบขนาด Token ก่อนและหลัง Slicing)
  - Full Framework Integrity Check (`npm run check`)

---

## 3. Implementation Checklist (แผนงานทีละขั้นตอน)

- [x] **Task 1: Core Token Estimator & Markdown Section Pruner (`lib/context-slicer.ts`)**
  - พัฒนาฟังก์ชัน `estimateTokenCount` และ `pruneMarkdownSections` ให้แยกย่อย Markdown Heading และกรองเฉพาะส่วนที่ต้องการ
  - *Done when*: สามารถกรองและตัดตอนเนื้อหา Markdown ตามหัวข้อและควบคุมขีดจำกัดความยาวได้อย่างแม่นยำ

- [x] **Task 2: Stage-Aware Slicers Implementation (`lib/context-slicer.ts`)**
  - พัฒนา Slicing Logic สำหรับแต่ละสเตจ: `implement`, `check`, `explore`, `feature`, `status`
  - *Done when*: แต่ละ Stage Slice คืนค่าเฉพาะเนื้อหาที่ตรงเป้าหมายและประหยัด Token ได้มากกว่า 50%

- [x] **Task 3: MCP Tool Integration (`lib/mcp.ts`)**
  - เพิ่ม Tool `devflow_get_sliced_context` พร้อม Input Schema (`stage`, `maxTokens`) เข้าสู่ MCP Server
  - *Done when*: AI Agent สามารถเรียกใช้ `devflow_get_sliced_context` ผ่าน MCP Stdio Protocol ได้

- [x] **Task 4: CLI Subcommand Integration (`bin/create-nexus-devflow.ts`)**
  - เพิ่มคำสั่ง `nexus-devflow slice` เข้าสู่ CLI Argument Parser และ Help Catalog
  - *Done when*: รัน `nexus-devflow slice --stage implement` ผ่าน Terminal ได้อย่างถูกต้อง

- [x] **Task 5: Automated Tests & Multi-Lane Verification (`test/context-slicer.test.ts`)**
  - เขียน Unit Tests ครอบคลุม Token Estimation, Slicing แต่ละ Stage, MCP Tool execution และ Token Reduction Verification
  - *Done when*: `npm test` และ `npm run check` รันผ่าน 100% (Zero Errors)

---

## 4. Verification Evidence & Quality Gates (บันทึกจากการรัน `/check`)

- **Multi-Lane Verification Matrix**:
  - [x] Lane 1: Typecheck (`npm run typecheck` - 0 errors)
  - [x] Lane 2: Unit Tests (`npm test` - 76/76 test suites passed)
  - [x] Lane 3: Framework Smoke Test (`npm run check` - Clean tarball packaging & overlay smoke test passed)
  - [x] Lane 4: Token Reduction Proof (วัดผลจริงผ่าน CLI `nexus-devflow slice` ประหยัด Token ได้ ~68%)
- **Findings Ledger**: ตรวจสอบ `devflow/context/findings.md` พบ 0 Active Blockers (สะอาด 100%)
