# 📐 [047-ide-native-extension-webview-studio] IDE Native Extension & Interactive Webview Studio

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Source**: `devflow/build-plan.md: Feature 6` & `DISC-20260823-002: Defense 6`  
> **Branch**: `feature/047-ide-native-extension-webview-studio`  
> **Completed Date**: 2026-08-23  

---

## 1. Specification & Scope

- **Problem Statement**:
  ปัจจุบันนักพัฒนาที่ทำงานบน IDE (VS Code, Cursor, Windsurf, Google Antigravity) ต้องสลับหน้าจอไปมาระหว่าง Code Editor กับ Terminal หรือ Browser Dashboard เพื่อดูสถานะการทำงาน 3-Pillars, ดู Task Checklist ปัจจุบัน, ตรวจสอบ Findings & Gatekeeper หรือสั่งรันคำสั่ง DevFlow เพื่อมอบประสบการณ์ Developer Experience (DX) ระดับ Premium ไร้รอยต่อ ระบบต้องการ **IDE Native Extension Bundle & Interactive Webview Studio** ที่รวม Dashboard, Live Kanban Pipeline, Gatekeeper Badge และ Quick Action Panel เข้าสู่ IDE Panel ในตัวแบบ Self-Contained Zero-Dependency

- **In-Scope**:
  1. **Self-Contained Webview Studio Component (`packages/create-nexus-devflow/lib/webview-studio.ts`)**:
     - พัฒนา `renderStudioHtml(snapshot: DashboardSnapshot)`: สร้าง Single-file HTML/CSS/JS Studio UI ที่รันได้ทั้งใน VS Code Webview Panel, Antigravity Custom Panel และ Browser
     - Live 3-Pillars Kanban & Pipeline View (Future: Ideas Inbox, Present: Active Spec & Tasks Checklist, Past: History Archives)
     - Interactive Command Action Buttons: ปุ่มลัดคัดลอกหรือรันคำสั่ง DevFlow (`/feature`, `/implement`, `/check`, `/complete`, `check-gate`, `slice`, `drift`, `reconcile`)
     - Real-Time Gatekeeper Badge: แสดงสถานะ Passed/Blocked และ Open Findings Ledger
     - Theme Adaptive: สลับสีตาม IDE Theme (VS Code / Antigravity Dark/Light Mode) ด้วย CSS Variable Binding
  2. **IDE Extension Manifest & Packaging Generator (`packages/create-nexus-devflow/lib/ide-extension.ts`)**:
     - พัฒนา `generateIdeExtensionManifest`: สร้างไฟล์โครงสร้าง Extension (`package.json` with contributed views, commands, and viewContainers) สำหรับติดตั้งใน IDE
  3. **MCP Tool Integration (`packages/create-nexus-devflow/lib/mcp.ts`)**:
     - เพิ่ม Tool `devflow_get_studio_html` ใน DevFlow MCP Server เพื่อให้ AI Agent ส่ง HTML ไปแสดงผลใน IDE Webview Panel ได้ทันที
  4. **CLI Subcommand Integration (`packages/create-nexus-devflow/bin/create-nexus-devflow.ts`)**:
     - เพิ่มคำสั่ง `nexus-devflow studio [--port <num>] [--no-open] [--export <path>]`
  5. **Automated Unit & Multi-Lane Tests (`packages/create-nexus-devflow/test/ide-extension.test.ts`)**:
     - เขียนชุดทดสอบครอบคลุม Webview Rendering, Data Binding, Command Generator, MCP Tool และ HTML Content Validity

- **Out-of-Scope**:
  - ไม่รวมการ Publish ขึ้น VS Code Marketplace โดยตรงในเฟสนี้ (เน้นการสร้าง Extension Manifest และ Webview Studio Engine ที่เปิดใช้งานได้ทันที)

- **Acceptance Criteria (เกณฑ์การยอมรับ)**:
  - [x] **AC-01**: `renderStudioHtml` สร้าง HTML/CSS/JS Studio ที่สมบูรณ์แบบ Self-contained ไร้ External CDN พึ่งพา
  - [x] **AC-02**: Webview Studio แสดงผลครบถ้วนทั้ง 3 เสาหลัก (Ideas, Active Spec Tasks, History Archives) และ Gatekeeper Status
  - [x] **AC-03**: `generateIdeExtensionManifest` สร้าง Extension Metadata สำหรับ VS Code / Antigravity ได้อย่างถูกต้อง
  - [x] **AC-04**: `nexus-devflow studio` รันผ่าน CLI และสามารถส่งออกไฟล์ HTML หรือเปิดเซิร์ฟเวอร์ Local ได้
  - [x] **AC-05**: MCP Tool `devflow_get_studio_html` ส่งมอบ HTML Studio Content ให้ AI Agent ได้อย่างสมบูรณ์
  - [x] **AC-06**: ชุดทดสอบทั้งหมด 100% ผ่าน (`npm test` และ `npm run check` สำเร็จ 0 ข้อผิดพลาด)

---

## 2. Plan & Test Strategy

- **Files to Modify/Create**:
  - `packages/create-nexus-devflow/lib/webview-studio.ts` (ใหม่: Webview Studio HTML/CSS/JS Generator & Theme Adapter)
  - `packages/create-nexus-devflow/lib/ide-extension.ts` (ใหม่: IDE Extension Manifest Generator & Scaffold)
  - `packages/create-nexus-devflow/lib/mcp.ts` (แก้ไข: เพิ่ม `devflow_get_studio_html` Tool)
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` (แก้ไข: เพิ่ม `studio` Subcommand)
  - `packages/create-nexus-devflow/test/ide-extension.test.ts` (ใหม่: Automated Tests สำหรับ Webview Studio)

- **Test Decision**:
  - Node.js Native Test Runner (`npm test` ภายใต้ `packages/create-nexus-devflow/`)
  - HTML Validity & Data Binding Tests
  - Full Framework Integrity Check (`npm run check`)

---

## 3. Implementation Checklist (แผนงานทีละขั้นตอน)

- [x] **Task 1: Core Webview Studio HTML Generator (`lib/webview-studio.ts`)**
  - พัฒนาฟังก์ชัน `renderStudioHtml` พร้อม CSS Design System (Glassmorphism, Dark/Light IDE Theme)
  - *Done when*: ได้ Single-File HTML Studio ที่สวยงาม ลื่นไหล และทำงานแบบ Self-contained 100%

- [x] **Task 2: IDE Extension Manifest Generator (`lib/ide-extension.ts`)**
  - พัฒนาฟังก์ชัน `generateIdeExtensionManifest` สำหรับโครงสร้าง VS Code / Antigravity Extension
  - *Done when*: สามารถสร้าง Extension Manifest พร้อม Views และ Commands คมชัด

- [x] **Task 3: MCP Tool Integration (`lib/mcp.ts`)**
  - เพิ่ม Tool `devflow_get_studio_html` เข้าสู่ MCP Server Tool Registry
  - *Done when*: AI Agent สามารถขอรับ HTML Studio เพื่อแสดงผลใน Webview Panel ได้

- [x] **Task 4: CLI Subcommand Integration (`bin/create-nexus-devflow.ts`)**
  - เพิ่มคำสั่ง `nexus-devflow studio` เข้าสู่ CLI Argument Parser
  - *Done when*: รัน `nexus-devflow studio` เพื่อเปิดหน้าต่าง Webview หรือ Export HTML ได้

- [x] **Task 5: Automated Tests & Multi-Lane Verification (`test/ide-extension.test.ts`)**
  - เขียน Unit Tests ครอบคลุม Webview Rendering, Theme Compatibility และ MCP Tool execution
  - *Done when*: `npm test` และ `npm run check` รันผ่าน 100% (Zero Errors)

---

## 4. Verification Evidence & Quality Gates (บันทึกจากการรัน `/check`)

- **Multi-Lane Verification Matrix**:
  - [x] Lane 1: Typecheck (`npm run typecheck` - 0 errors)
  - [x] Lane 2: Unit Tests (`npm test` - 83/83 test suites passed)
  - [x] Lane 3: Framework Smoke Test (`npm run check` - Clean tarball packaging & overlay smoke test passed)
  - [x] Lane 4: Self-Contained Webview Proof (ทดสอบ `renderStudioHtml` สร้าง Single-File UI พร้อม Theme Adaptive สมบูรณ์)
- **Findings Ledger**: ตรวจสอบ `devflow/context/findings.md` พบ 0 Active Blockers (สะอาด 100%)
