# Living Spec: 080-dashboard-workflow-visualizer

> **Title**: Modernize Web Dashboard with Dynamic Archify Visualizer, Recommended Skills & De-cluttering  
> **Status**: Completed  
> **Phase**: Phase 30 / Feature 080 (`DISC-20260907-003`)  
> **Track**: Fast-Track Single Living Spec  
> **Testing Seam**: `StudioViewRenderer.renderMacroLifecycleSvg()`, `StudioViewRenderer.renderTicketsDagSvg()`, `dashboard-snapshot.ts` (`packages/create-nexus-devflow/lib/studio-view-renderer.ts`), `e2e/dashboard-visualizer.spec.ts`

---

## 1. Context & User Story

จากผลการทำ Discovery (`DISC-20260907-003`) และความต้องการของผู้ใช้:
1. **Dynamic Architecture & Workflow Visualizer**: หน้า Dashboard มีไดอะแกรมที่โต้ตอบได้แบบ `archify` มอนิเตอร์สถานะแบบ Real-time:
   - **Macro View**: The Living Spec Lifecycle Pulse Map แสดงการเคลื่อนที่ของงานพร้อมแสงวิ่ง (Trace Motion) บนขั้นตอนที่ Active อยู่ พร้อมเครื่องหมาย `✔ Done` สำหรับขั้นตอนที่เสร็จสิ้น
   - **Micro View**: Tracer-Bullet Tickets Dependency Graph แสดงตั๋วงานของ Feature ปัจจุบัน พร้อมความสัมพันธ์ `Blocked by` และสถานะ `Done`, `In Progress`, `Blocked`
   - **Code Graph View**: Semantic dependency graph & instant Blast Radius analyzer บูรณาการเป็นแท็บที่ 3 ในคอนโทรลเลอร์
2. **Recommended Skills & Vendor Ecosystem**: Dashboard แสดงรายการ Skills และ Vendors ที่แนะนำ (`matt-pocock`, `bughunter`, `archify`, `diagram-design`, `9arm-skills`) พร้อมตรวจสอบการติดตั้งจริง หากติดตั้งแล้วขึ้นติ๊กถูก **✔ Installed** และหากยังไม่ได้ติดตั้งมีปุ่มคลิกคัดลอกคำสั่งติดตั้ง
3. **De-cluttering (ลดความรก)**: ตัดแท็บ Swarm Roster ที่ซ้ำซ้อนออก, นำพาเนลเก่า Unified Living Spec Model (DevFlow 2.5.0) ออก, และยุบรายการ Doctor Health Check ให้แสดงผลสรุปแบบกะทัดรัด (Compact Healthy Badge)

---

## 2. Invariants & Acceptance Criteria (Done-When)

- [x] **AC-1: Dynamic Workflow Visualizer (Macro, Micro & Code Graph)**
  - เรนเดอร์ Interactive SVG Diagram ผ่าน `StudioViewRenderer` โดยไม่ต้องพึ่งพา external JS runtime
  - Macro View แสดง Lifecycle State Machine (`/feature` ➔ `/implement` ➔ `/check` ➔ `/complete`) พร้อม CSS Trace Motion และเรืองแสงใน Active Stage
  - Micro View แสดง Tickets Dependency DAG เมื่อมี active task workspace
  - Code Graph View ค้นหาและวิเคราะห์ Blast Radius ได้ในจุดเดียว
- [x] **AC-2: Recommended Skills & Vendors Hub with Real-time Checkmarks**
  - ตรวจสอบไฟล์จริงใน `.agents/skills/<skill>` และ `devflow/.vendor/<vendor>`
  - แสดงป้ายกำกับ `✔ Installed` สีเขียวมินต์สำหรับรายการที่ติดตั้งแล้ว
  - แสดงปุ่ม `Copy Command` (`npx @jakkrichm/create-nexus-devflow install <name>`) สำหรับรายการที่ยังไม่ได้ติดตั้ง
- [x] **AC-3: Dashboard Streamlining & De-cluttering**
  - ลบ Swarm Tab ออกจาก DOM
  - ลบส่วนเก่า Unified Living Spec Model (DevFlow 2.5.0) ออกจาก DOM
  - ยุบ Doctor List ให้เหลือ Compact Healthy Badge เมื่อไม่มี Error
- [x] **AC-4: Backward Compatibility & Zero Latency Overhead**
  - `renderWebDashboard()` และ `renderDashboardPage()` ยังคงทำงานได้สมบูรณ์แบบ
  - Snapshot Latency คงอยู่ที่ < 50ms
  - ทุก Unit Tests, Static Checks และ Playwright E2E Browser Tests ผ่าน 100%

---

## 3. Tracer-Bullet Tickets & Implementation Tasks

- [x] **Ticket 01: Snapshot Data Enrichment (`dashboard-snapshot.ts`)**
  - เพิ่มการดึงข้อมูล `recommendedSkills` (สถานะการติดตั้ง, คำสั่งติดตั้ง, ประเภท) และ `activeTickets` (อ่านจาก `devflow/context/{active-slug}/tickets/`) ส่งไปกับ `DashboardSnapshot`.
- [x] **Ticket 02: Dynamic Archify SVG Visualizer Component (`studio-view-renderer.ts`)**
  - สร้าง SVG Generator สำหรับ Lifecycle Pulse Map (Macro) และ Tickets DAG (Micro) พร้อม CSS Trace Motion และเรืองแสงใน Active Stage.
- [x] **Ticket 03: Recommended Skills Cards & UI De-cluttering (`studio-view-renderer.ts`)**
  - เพิ่มการ์ด Skills Hub พร้อมระบบติ๊กถูก `✔ Installed` / Copy Command.
  - ตัด Swarm Roster Tab และส่วนเก่า DevFlow 2.5.0 ออก และยุบ Doctor Health Check ให้กระชับ.
- [x] **Ticket 04: Verification & Automated Tests**
  - เพิ่ม Unit Tests ใน `test/studio-view-renderer.test.ts` และ `test/dashboard-snapshot.test.ts` ยืนยันการเรนเดอร์ Visualizer และ Recommended Skills.
  - เพิ่ม Playwright E2E Browser Tests ใน `e2e/dashboard-visualizer.spec.ts`.

---

## ⚡ 4. Implementation Log & Evidence

- **Snapshot Data Enrichment**:
  - เพิ่ม `readRecommendedSkills()` และ `readActiveTickets()` ใน `packages/create-nexus-devflow/lib/dashboard-snapshot.ts`.
  - เพิ่มการอ่าน markdown bold syntax ใน `branch-context.ts` เพื่อให้ stage name ถูกต้องแม่นยำ.
- **Dynamic Archify SVG Visualizer**:
  - เพิ่ม methods `renderMacroLifecycleSvg(activeStage)` และ `renderTicketsDagSvg(tickets)` ใน `StudioViewRenderer`.
  - เพิ่ม component panel `#workflow-visualizer-panel` พร้อมปุ่ม toggle Macro / Micro / Code Graph views และ CSS trace motion keyframes.
- **Recommended Skills Hub & De-cluttering**:
  - เพิ่ม component panel `#recommended-skills-panel` พร้อม cards แสดงสถานะ `✔ Installed` หรือ Copy Install Command.
  - ลบแท็บ `#tab-swarm` และพาเนลเก่า `#dual-track` (Unified Living Spec Model 2.5.0) ออกจาก DOM ทั้งหมด.
  - ยุบ Doctor list ให้เป็น compact summary card เมื่อผ่าน 100% พร้อมปุ่ม toggle ขยายดูรายละเอียด.
- **Verification Evidence**:
  - `npm run typecheck`: 0 errors.
  - `npm test`: 229 passing tests across all test suites (0 failures).
  - `npm run test:browser`: Playwright E2E passed (1 passed in 4.3s).
  - `npm run check:static`: Framework static contracts validated 100%.

---

## 5. Findings Ledger

- **Total Open Findings**: 0
- **Blockers**: 0
- **Status**: Clean
