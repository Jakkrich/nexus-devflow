# 📐 [043-devflow-mcp-server-hub] DevFlow Model Context Protocol (MCP) Server Hub & Type-Safe Schema Engine

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Source**: `[IDEA-004]` & `devflow/build-plan.md: Feature 2`  
> **Branch**: `feature/043-devflow-mcp-server-hub`  
> **Completed Date**: 2026-08-23  

---

## 1. Specification & Scope

- **Problem Statement**:
  ปัจจุบัน AI Coding Agents (Google Antigravity, Claude Code, Cursor, OpenAI Codex) สื่อสารกับ DevFlow ผ่านการอ่าน/แก้ไขข้อความในไฟล์ Markdown และการรัน CLI Commands ผ่าน Shell Terminal ซึ่งมีความเสี่ยงต่อความผิดพลาดเมื่อ AI พิมพ์ Regex ไม่ตรง, จัด Indentation ผิด หรือเรียกคำสั่ง CLI ด้วย Argument ที่คลาดเคลื่อน เพื่อยกระดับความเสถียรและความปลอดภัย ระบบต้องการ **Native Model Context Protocol (MCP) Server** ผ่าน Stdio JSON-RPC 2.0 Interface ทำให้ AI Agent สามารถเรียกใช้ Typed Tools ควบคุม DevFlow ได้โดยตรงและแม่นยำ 100%

- **In-Scope**:
  1. **MCP JSON-RPC 2.0 Protocol Engine (`packages/create-nexus-devflow/lib/mcp.ts`)**:
     - พัฒนา Lightweight Zero-Dependency MCP Protocol Server บน Node.js Stdio Interface
     - รองรับ Protocol Handshake (`initialize`, `notifications/initialized`, `ping`)
     - รองรับการประกาศเครื่องมือ `tools/list` และการเรียกใช้งาน `tools/call`
     - รองรับการอ่าน Resources `resources/list` และ `resources/read` สำหรับ Living Context
  2. **Core DevFlow MCP Tools Suite**:
     - `devflow_get_status`: ดึงข้อมูลสถานะโครงการ, Active Work, Next Action, และ Blockers
     - `devflow_add_idea`: เพิ่ม Idea ใหม่เข้าสู่ Centralized Inbox พร้อม AI Feasibility & Value
     - `devflow_record_finding`: บันทึกข้อบกพร่อง Finding (P0-P3) ลง `findings.md`
     - `devflow_resolve_finding`: อัปเดตสถานะ Finding (`fixed`, `closed`, `accepted`, `invalid`)
     - `devflow_evaluate_gate`: รัน Quality Gatekeeper ตรวจสอบความพร้อมในการส่งมอบ
     - `devflow_get_context`: ดึงเนื้อหา Context ตามชื่อไฟล์ (`current-stage.md`, `coding-standards.md`, `project-overview.md`)
  3. **CLI Subcommand `nexus-devflow mcp` (`packages/create-nexus-devflow/bin/create-nexus-devflow.ts`)**:
     - เพิ่ม Subcommand `mcp` สำหรับรัน Server: `nexus-devflow mcp [target-dir]`
  4. **MCP Configuration Helper & Documentation**:
     - เพิ่มคำแนะนำและตัวอย่าง Config สำหรับเชื่อมต่อเข้ากับ Google Antigravity, Claude Desktop, VS Code และ Cursor
  5. **Automated Unit & Protocol Tests (`packages/create-nexus-devflow/test/mcp.test.ts`)**:
     - เขียนชุดทดสอบจำลอง JSON-RPC Streams ทดสอบ Handshake, Tool Listing, Parameter Validation และ Tool Executions ครบทุกฟังก์ชัน

- **Out-of-Scope**:
  - ไม่รวม HTTP/SSE Transport ในเฟสนี้ (เน้น Stdio Transport ซึ่งเป็นมาตรฐานหลักของ Local Agent IDEs)

- **Acceptance Criteria (เกณฑ์การยอมรับ)**:
  - [x] **AC-01**: `nexus-devflow mcp` เริ่มการทำงานเป็น JSON-RPC Stdio Server และตอบสนอง `initialize` สำเร็จ
  - [x] **AC-02**: `tools/list` คืนค่าชุดเครื่องมือ DevFlow Tools ครบทั้ง 6 เครื่องมือพร้อม Input JSON Schemas ถูกต้อง
  - [x] **AC-03**: `tools/call` รัน `devflow_get_status` และคืนค่าสถานะโครงการที่ถูกต้องตรงกับ `readProjectStatus`
  - [x] **AC-04**: `tools/call` รัน `devflow_add_idea` และ `devflow_record_finding` บันทึกข้อมูลลงดิสก์ได้สมบูรณ์
  - [x] **AC-05**: `tools/call` รัน `devflow_evaluate_gate` และคืนค่าผลการประเมิน Gate Report แบบ Structured Text
  - [x] **AC-06**: ชุดทดสอบทั้งหมด 100% ผ่าน (`npm test` และ `npm run check` สำเร็จ 0 ข้อผิดพลาด)

---

## 2. Plan & Test Strategy

- **Files to Modify/Create**:
  - `packages/create-nexus-devflow/lib/mcp.ts` (ใหม่: Core MCP Protocol Server & Tools Dispatcher)
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` (แก้ไข: เพิ่ม `mcp` Subcommand)
  - `packages/create-nexus-devflow/lib/command-catalog.ts` (แก้ไข: เพิ่ม `mcp` ใน Catalog)
  - `packages/create-nexus-devflow/test/mcp.test.ts` (ใหม่: Automated Tests สำหรับ MCP Server)

- **Test Decision**:
  - Node.js Native Test Runner (`npm test` ภายใต้ `packages/create-nexus-devflow/`)
  - Protocol Simulation Test (ส่ง JSON-RPC Message ผ่าน Duplex / Transform Streams)
  - Full Framework Integrity Check (`npm run check`)

---

## 3. Implementation Checklist (แผนงานทีละขั้นตอน)

- [x] **Task 1: Core MCP JSON-RPC Protocol Server (`lib/mcp.ts`)**
  - พัฒนากลไกรับ-ส่ง JSON-RPC 2.0 ผ่าน Stdio / Streams รองรับ Message Framing (`\n` delimiters), Handshake (`initialize`), และ Error Handling
  - *Done when*: Server สามารถตอบสนอง `initialize` และ `ping` ได้อย่างถูกต้องตามมาตรฐาน MCP

- [x] **Task 2: Tool Registry & Schema Definitions (`lib/mcp.ts`)**
  - กำหนด Tool Schemas สำหรับ `devflow_get_status`, `devflow_add_idea`, `devflow_record_finding`, `devflow_resolve_finding`, `devflow_evaluate_gate`, `devflow_get_context`
  - *Done when*: `tools/list` คืนค่า Tool Definitions พร้อม Parameter Schemas ครบทั้ง 6 เครื่องมือ

- [x] **Task 3: Tool Execution Dispatchers (`lib/mcp.ts`)**
  - ผสานการทำงานของแต่ละ Tool เข้ากับ Domain Libraries (`status.ts`, `ideas.ts`, `findings.ts`, `gatekeeper.ts`)
  - *Done when*: `tools/call` สามารถประมวลผลคำสั่งและคืนค่า Tool Content กลับมาได้อย่างถูกต้อง

- [x] **Task 4: CLI Subcommand Integration (`bin/create-nexus-devflow.ts`)**
  - เชื่อมต่อคำสั่ง `nexus-devflow mcp [target-dir]` เข้ากับ CLI Parser และ Help Catalog
  - *Done when*: รัน `nexus-devflow mcp` แล้วเข้าสู่โหมด Stdio Server

- [x] **Task 5: Automated Protocol Tests & Multi-Lane Verification (`test/mcp.test.ts`)**
  - เขียน Unit Tests จำลองการสื่อสาร JSON-RPC ตรวจสอบทุก Tool Calls และ Error Cases
  - *Done when*: `npm test` และ `npm run check` รันผ่าน 100% (Zero Errors)

---

## 4. Verification Evidence & Quality Gates (บันทึกจากการรัน `/check`)

- **Multi-Lane Verification Matrix**:
  - [x] Lane 1: Typecheck (`npm run typecheck` - 0 type errors)
  - [x] Lane 2: Unit Tests (`npm test` - 68/68 test suites passed)
  - [x] Lane 3: Framework Smoke Test (`npm run check` - Clean tarball packaging & overlay smoke test passed)
  - [x] Lane 4: JSON-RPC Simulation (ทดสอบเรียก `initialize`, `tools/list`, `tools/call` ผ่าน Stdio Process จำลอง)
- **Findings Ledger**: ตรวจสอบ `devflow/context/findings.md` พบ 0 Active Blockers (สะอาด 100%)
