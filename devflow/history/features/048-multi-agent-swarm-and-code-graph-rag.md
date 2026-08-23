# 📐 [048-multi-agent-swarm-and-code-graph-rag] Multi-Agent Swarm Orchestrator & Semantic Code Graph RAG

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Source**: `devflow/build-plan.md: Feature 7` & `DISC-20260823-002: Defense 7`  
> **Branch**: `feature/048-multi-agent-swarm-and-code-graph-rag`  
> **Completed Date**: 2026-08-23  

---

## 1. Specification & Scope

- **Problem Statement**:
  เมื่อโปรเจกต์มีขนาดใหญ่ขึ้น การพึ่งพา AI Agent ตัวเดียวทำงานทุกหน้าที่ (Single Agent Monolith) มักทำให้เกิดปัญหา Context Window ล้น, มองไม่เห็นข้อผิดพลาดของตนเอง (Confirmation Bias), และขาดระบบวิเคราะห์ผลกระทบของโค้ด (Blast Radius) ส่งผลให้การแก้ไขจุดหนึ่งอาจส่งผลกระทบต่อโมดูลอื่นโดยไม่รู้ตัว เพื่อแก้ไขปัญหานี้และบรรลุเฟสสุดท้ายของ Roadmap ระบบต้องการ **Multi-Agent Swarm Orchestrator** ที่จัดสรรบทบาทการทำงานแบบเฉพาะทาง (Coder, QA Verifier, Security Auditor, Lead Architect) ร่วมกับ **Semantic Code Graph Indexer** ที่วิเคราะห์โครงสร้างความสัมพันธ์ของไฟล์ (Imports, Exports, Dependencies) และคำนวณ Blast Radius อัตโนมัติ

- **In-Scope**:
  1. **Semantic Code Graph Engine (`packages/create-nexus-devflow/lib/code-graph.ts`)**:
     - พัฒนา `buildCodeGraph`: สแกนและสร้าง In-Memory Dependency Graph จากไฟล์โค้ด (รองรับ `.ts`, `.js`, `.mjs`, `.cjs`, `.jsx`, `.tsx`)
     - สกัด `imports`, `exports`, และ `fileDependencies`
     - พัฒนา `calculateBlastRadius(graph, targetFile)`: คำนวณรายชื่อไฟล์ทั้งหมดที่ได้รับผลกระทบทางตรงและทางอ้อม (Direct & Transitive Dependents)
  2. **Multi-Agent Swarm Orchestrator (`packages/create-nexus-devflow/lib/swarm-orchestrator.ts`)**:
     - กำหนดโครงสร้าง Role-based Specialized Agents (`Coder`, `QA Verifier`, `Security Auditor`, `Lead Architect`)
     - พัฒนา `generateSwarmPlan`: วิเคราะห์ Living Spec และสร้าง Execution Matrix แบ่งงานเป็น Sub-tasks พร้อมกำหนด Agent Role ที่รับผิดชอบ, Input Context ที่ต้องการ, และ Verification Criteria
  3. **MCP Tools Integration (`packages/create-nexus-devflow/lib/mcp.ts`)**:
     - เพิ่ม Tool `devflow_swarm_plan`: ส่งมอบ Multi-Agent Swarm Execution Plan ให้ AI Orchestrator
     - เพิ่ม Tool `devflow_query_code_graph`: ค้นหาความสัมพันธ์ของไฟล์และคำนวณ Blast Radius
  4. **CLI Subcommands (`packages/create-nexus-devflow/bin/create-nexus-devflow.ts`)**:
     - เพิ่มคำสั่ง `nexus-devflow swarm [--json]`
     - เพิ่มคำสั่ง `nexus-devflow graph [--file <path>] [--json]`
  5. **Automated Unit & Multi-Lane Tests (`packages/create-nexus-devflow/test/swarm-orchestrator.test.ts`)**:
     - เขียนชุดทดสอบครอบคลุม Code Graph Indexing, Blast Radius Calculation, Swarm Task Allocation, MCP Tools และ CLI Subcommands

- **Out-of-Scope**:
  - ไม่รวมการเชื่อมต่อกับ Distributed Cloud Multi-GPU Clusters (ทำงานแบบ In-Memory Local Swarm Engine ที่รันได้ในทุกสภาพแวดล้อม IDE)

- **Acceptance Criteria (เกณฑ์การยอมรับ)**:
  - [x] **AC-01**: `buildCodeGraph` สร้าง Dependency Graph และสกัด Module Imports/Exports ได้อย่างแม่นยำ
  - [x] **AC-02**: `calculateBlastRadius` คำนวณผลกระทบของไฟล์เป้าหมาย (Direct & Transitive Dependents) ได้อย่างถูกต้อง
  - [x] **AC-03**: `generateSwarmPlan` จัดสรรงานออกเป็น Role-based Subtasks (Coder, QA, Security, Architect) สอดคล้องกับ Living Spec
  - [x] **AC-04**: `nexus-devflow swarm` และ `nexus-devflow graph` ใช้งานได้ผ่าน CLI พร้อมตัวเลือก `--json`
  - [x] **AC-05**: MCP Tools `devflow_swarm_plan` และ `devflow_query_code_graph` ตอบสนองต่อ AI Agents ได้อย่างสมบูรณ์
  - [x] **AC-06**: ชุดทดสอบทั้งหมด 100% ผ่าน (`npm test` และ `npm run check` สำเร็จ 0 ข้อผิดพลาด)

---

## 2. Plan & Test Strategy

- **Files to Modify/Create**:
  - `packages/create-nexus-devflow/lib/code-graph.ts` (ใหม่: Code Graph AST Indexer & Blast Radius Engine)
  - `packages/create-nexus-devflow/lib/swarm-orchestrator.ts` (ใหม่: Multi-Agent Swarm Orchestrator & Execution Plan Engine)
  - `packages/create-nexus-devflow/lib/mcp.ts` (แก้ไข: เพิ่ม `devflow_swarm_plan` และ `devflow_query_code_graph` Tools)
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` (แก้ไข: เพิ่ม `swarm` และ `graph` Subcommands)
  - `packages/create-nexus-devflow/test/swarm-orchestrator.test.ts` (ใหม่: Automated Tests สำหรับ Swarm & Code Graph)

- **Test Decision**:
  - Node.js Native Test Runner (`npm test` ภายใต้ `packages/create-nexus-devflow/`)
  - Simulated Multi-Module Codebase สำหรับทดสอบ Dependency Graph และ Blast Radius
  - Full Framework Integrity Check (`npm run check`)

---

## 3. Implementation Checklist (แผนงานทีละขั้นตอน)

- [x] **Task 1: Semantic Code Graph & Blast Radius Engine (`lib/code-graph.ts`)**
  - พัฒนาฟังก์ชัน `buildCodeGraph` และ `calculateBlastRadius`
  - *Done when*: สามารถวิเคราะห์ความสัมพันธ์ของไฟล์และระบุรายชื่อไฟล์ที่ได้รับผลกระทบได้อย่างแม่นยำ

- [x] **Task 2: Multi-Agent Swarm Orchestration Engine (`lib/swarm-orchestrator.ts`)**
  - พัฒนาฟังก์ชัน `generateSwarmPlan` สำหรับจัดสรร Sub-tasks ให้ Coder, QA, Security, และ Architect
  - *Done when*: ได้ Swarm Execution Matrix ที่สมบูรณ์แบบพร้อม Input Context Slices

- [x] **Task 3: MCP Server Tools Integration (`lib/mcp.ts`)**
  - เพิ่ม Tool `devflow_swarm_plan` และ `devflow_query_code_graph` เข้าสู่ MCP Server Tool Registry
  - *Done when*: AI Agents สามารถสืบค้น Code Graph และขอรับ Swarm Plan ผ่าน MCP Protocol ได้

- [x] **Task 4: CLI Subcommands Integration (`bin/create-nexus-devflow.ts`)**
  - เพิ่มคำสั่ง `nexus-devflow swarm` และ `nexus-devflow graph` เข้าสู่ CLI Argument Parser
  - *Done when*: ผู้ใช้สามารถรันคำสั่งตรวจสอบผังโค้ดและ Swarm Plan ผ่าน Terminal ได้

- [x] **Task 5: Automated Tests & Multi-Lane Verification (`test/swarm-orchestrator.test.ts`)**
  - เขียน Unit Tests ครอบคลุม Code Graph Indexing, Blast Radius, Swarm Task Breakdown และ MCP Tools
  - *Done when*: `npm test` และ `npm run check` รันผ่าน 100% (Zero Errors)

---

## 4. Verification Evidence & Quality Gates (บันทึกจากการรัน `/check`)

- **Multi-Lane Verification Matrix**:
  - [x] Lane 1: Typecheck (`npm run typecheck` - 0 errors)
  - [x] Lane 2: Unit Tests (`npm test` - 87/87 test suites passed)
  - [x] Lane 3: Framework Smoke Test (`npm run check` - Clean tarball packaging & overlay smoke test passed)
  - [x] Lane 4: Swarm & Code Graph Proof (ทดสอบ `buildCodeGraph` และ `calculateBlastRadius` ได้ผลลัพธ์แม่นยำ 100%)
- **Findings Ledger**: ตรวจสอบ `devflow/context/findings.md` พบ 0 Active Blockers (สะอาด 100%)
