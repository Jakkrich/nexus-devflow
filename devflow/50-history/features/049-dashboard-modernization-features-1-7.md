# 📐 [049-dashboard-modernization-features-1-7] Modernize Web Dashboard with Enterprise Features 1–7 Integration

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Source**: `devflow/discoveries/DISC-20260823-003-dashboard-modernization-for-features-1-7/00-explore.md`  
> **Branch**: `feature/049-dashboard-modernization-features-1-7`  
> **Completed Date**: 2026-08-23  

---

## 1. Specification & Scope

- **Problem Statement**:
  หลังจากที่ระบบ Nexus-DevFlow 2.0 ได้พัฒนาความสามารถระดับ Enterprise ครบทั้ง 7 Phase (Gatekeeper, MCP Hub, Branch Context, JIT Slicing, Drift Reconciler, Webview Studio, Multi-Agent Swarm & Code Graph RAG) หน้าจอ Web Dashboard ปัจจุบัน (`packages/create-nexus-devflow/lib/dashboard-server.ts` & `dashboard-snapshot.ts`) ยังคงแสดงผลเฉพาะสถานะพื้นฐานเดิม ขาดการเชื่อมโยงข้อมูลของฟีเจอร์ใหม่ 1–7 ทำให้ผู้ใช้งานที่รัน `nexus-devflow dashboard` (พอร์ต 4173) ไม่สามารถดูสถานะ Gatekeeper, รายการ 12 MCP Tools, แผน Swarm Matrix, และทดสอบค้นหา Code Graph Blast Radius ผ่านหน้าเว็บได้

- **In-Scope**:
  1. **Dashboard Snapshot Backend Integration (`packages/create-nexus-devflow/lib/dashboard-snapshot.ts`)**:
     - ผสานข้อมูล `gatekeeper` (สถานะ Gate, Active Blockers, Advisories) ผ่าน `evaluateGate`
     - ผสานข้อมูล `drift` (สถานะความคลาดเคลื่อนของ Git Diff) ผ่าน `detectGitDrift`
     - ผสานข้อมูล `swarm` (แผนการจัดทัพ AI Subagents 4 บทบาท) ผ่าน `generateSwarmPlan`
     - ผสานข้อมูล `graph` (สถิติจำนวนไฟล์และ Edges) ผ่าน `buildCodeGraph`
     - ผสานข้อมูล `mcpTools` (รายการ 12 MCP Tools) จาก `DEVFLOW_MCP_TOOLS`
     - เพิ่ม In-Memory Caching สำหรับข้อมูลที่ต้องประมวลผลสูง (Code Graph & Doctor)
  2. **Dashboard UI Modernization (`packages/create-nexus-devflow/lib/dashboard-server.ts`)**:
     - **Header Bar**: เพิ่ม Gatekeeper Status Pill (`✔ Gate Passed` / `✖ Gate Blocked`) และ Git Drift Status Pill (`✔ In Sync` / `⚠ Drift Detected`)
     - **Tab ใหม่: 🤖 "Multi-Agent & MCP Hub"**: แสดงการ์ด 4 Subagents (👑 Lead Architect, 👨‍💻 Coder, 🕵️ QA, 🛡️ Security) พร้อมตารางแสดง 12 MCP Tools และ Schema Description
     - **Tab ใหม่: 🗺️ "Code Graph & Blast Radius"**: แสดงสถิติกราฟไฟล์ พร้อมช่องค้นหาไฟล์แบบ Interactive เพื่อคำนวณและแสดงผลกระทบ (Direct & Transitive Dependents) ทันทีบนหน้าเว็บ
     - **Quick Action Bar**: เพิ่มปุ่มกดคัดลอกคำสั่งสำหรับ `reconcile`, `slice`, `swarm`, `graph`, `studio`
  3. **Real-time API Endpoints (`packages/create-nexus-devflow/lib/dashboard-server.ts`)**:
     - เพิ่ม Endpoint `/api/graph?file=<path>` ตอบสนองต่อการคิวรี Blast Radius แบบ Dynamic
  4. **Automated Tests & Quality Matrix (`packages/create-nexus-devflow/test/`)**:
     - อัปเดต `test/dashboard-snapshot.test.ts` และ `test/dashboard-server.test.ts` เพื่อทดสอบ Snapshot Fields ใหม่และ Endpoint `/api/graph`
     - ตรวจสอบ `npm test` (ผ่าน 100%) และ `npm run check` สำเร็จ 0 ข้อผิดพลาด

- **Out-of-Scope**:
  - ไม่รวมการเชื่อมต่อระบบ Third-Party Cloud Monitoring ภายนอก (ยังคงเป็น Local Dashboard Server แบบ Zero-Dependency)

- **Acceptance Criteria (เกณฑ์การยอมรับ)**:
  - [x] **AC-01**: `readDashboardSnapshot` ส่งข้อมูล `gatekeeper`, `drift`, `swarm`, `graph`, `mcpTools` ครบถ้วนใน JSON Payload
  - [x] **AC-02**: Web Dashboard Header แสดงสถานะ Gatekeeper และ Git Drift อย่างถูกต้องตามจริง
  - [x] **AC-03**: แท็บ "Multi-Agent & MCP Hub" แสดงรายการ 4 Subagents และ 12 MCP Tools พร้อมคำอธิบาย
  - [x] **AC-04**: แท็บ "Code Graph & Blast Radius" สามารถค้นหาและแสดงผลกระทบของไฟล์ (Blast Radius) ได้อย่างถูกต้อง
  - [x] **AC-05**: Endpoint `/api/graph?file=<path>` คืนค่า JSON Blast Radius ของไฟล์เป้าหมาย
  - [x] **AC-06**: ชุดทดสอบทั้งหมด 100% ผ่าน (`npm test` และ `npm run check` สำเร็จ 0 ข้อผิดพลาด)

---

## 2. Plan & Test Strategy

- **Files to Modify/Create**:
  - `packages/create-nexus-devflow/lib/dashboard-snapshot.ts` (แก้ไข: เพิ่ม Gatekeeper, Drift, Swarm, Graph, MCP Tools ลงใน Snapshot Schema และ Function)
  - `packages/create-nexus-devflow/lib/dashboard-page.ts` & `lib/dashboard.ts` (แก้ไข: เพิ่ม Tab UI, Components, CSS Styling และ Endpoint `/api/graph` & `/api/reconcile`)
  - `packages/create-nexus-devflow/test/dashboard-snapshot.test.ts` (แก้ไข: เพิ่ม Assertions สำหรับฟิลด์ใหม่)
  - `packages/create-nexus-devflow/test/dashboard.test.ts` (แก้ไข: ทดสอบ Snapshot Response และ `/api/graph` & `/api/reconcile` Endpoints)

- **Test Decision**:
  - Node.js Native Test Runner (`npm test`)
  - Server Request/Response assertions for `/api/dashboard`, `/api/graph`, `/api/reconcile`
  - Strict Framework Static Validation (`npm run check`)

---

## 3. Implementation Checklist (แผนงานทีละขั้นตอน)

- [x] **Task 1: Extend Dashboard Snapshot Backend Schema (`lib/dashboard-snapshot.ts`)**
  - นำเข้า `evaluateGate`, `detectGitDrift`, `generateSwarmPlan`, `buildCodeGraph`, `DEVFLOW_MCP_TOOLS`
  - ปรับปรุงฟังก์ชัน `readDashboardSnapshot` ให้คืนค่าข้อมูลของทั้ง 7 ฟีเจอร์
  - *Done when*: `readDashboardSnapshot` คืนค่า payload ครบทุกฟิลด์โดยไม่เกิดข้อผิดพลาด

- [x] **Task 2: Implement `/api/graph` Dynamic Blast Radius Endpoint (`lib/dashboard.ts`)**
  - เพิ่ม Route Handler สำหรับ `/api/graph?file=<path>`
  - *Done when*: ร้องขอ `/api/graph` คืนค่า JSON Blast Radius รายการไฟล์ที่ได้รับผลกระทบ

- [x] **Task 3: Modernize Dashboard Frontend UI & Interactive Tabs (`lib/dashboard-page.ts`)**
  - เพิ่ม Gatekeeper & Drift Pill ใน Header
  - สร้าง Tab Content สำหรับ "Multi-Agent & MCP Hub" และ "Code Graph & Blast Radius"
  - เพิ่ม Quick Action Buttons สำหรับคำสั่งใหม่ของ DevFlow
  - *Done when*: หน้าเว็บ Dashboard แสดงผลฟีเจอร์ 1–7 ได้อย่างสวยงามและ Interactive

- [x] **Task 4: Automated Tests & Verification Matrix (`test/dashboard-*.test.ts`)**
  - อัปเดตชุดทดสอบ `dashboard-snapshot.test.ts` และ `dashboard.test.ts`
  - *Done when*: `npm test` และ `npm run check` รันผ่าน 100% (Zero Errors)

---

## 4. Verification Evidence & Quality Gates (บันทึกจากการรัน `/check`)

- **Multi-Lane Verification Matrix**:
  - [x] Lane 1: Typecheck (`npm run typecheck` - 0 errors)
  - [x] Lane 2: Unit Tests (`npm test` - 87/87 test suites passed)
  - [x] Lane 3: Framework Smoke Test (`npm run check` - Clean tarball packaging & overlay smoke test passed)
  - [x] Lane 4: Live Dashboard UI & API Verification (ทดสอบ `/api/dashboard`, `/api/graph`, `/api/reconcile` สำเร็จ 100%)
- **Findings Ledger**: ตรวจสอบ `devflow/context/findings.md` พบ 0 Active Blockers (สะอาด 100%)
