# Discovery: DISC-20260907-003-update-dashboard-features

> **Title**: Modernize Web Dashboard with v2.14.0+ Architectural & Workflow Features  
> **Type**: Feature Exploration (Pre-Flight)  
> **Status**: **Proceed** (Recommended for `/feature`)  
> **Created**: 2026-09-07  
> **Author**: AI Agent & User Pair  

---

## 1. Context & Problem Statement

Nexus-DevFlow ได้วิวัฒนาการสู่สถาปัตยกรรมระดับองค์กรรุ่น **v2.14.0** ซึ่งประกอบด้วยขีดความสามารถใหม่ที่ทรงพลังมากมาย เช่น:
1. **Tracer-Bullet Tickets Bridge (`075`)**: การแตก Living Spec เป็นงานย่อย End-to-End (`tickets/*.md`) สำหรับ Matt Pocock Flow
2. **Skill Registry Engine (`076`)**: การบริหารจัดการวงจรชีวิตของ Core 32 Skills, Third-Party Skills (`archify`, `diagram-design`, `bughunter`, `matt-pocock`), และ Git Repository Adapters
3. **MCP Server Protocol Hub (`077`)**: การรองรับ In-Process MCP Engine, 12 เครื่องมือ และ Resource Endpoints (`devflow://overview`, `devflow://current-stage`, etc.)
4. **Project Status Engine (`078`)**: การประเมินสถานะโครงการแบบละเอียดและวิเคราะห์ Git porcelain drift
5. **Studio View Renderer Componentization (`079`)**: การจัดระเบียบสถาปัตยกรรม Presentation โดยขจัด circular dependency ระหว่าง `dashboard-page.ts` และ `studio-view-renderer.ts`

### 🚩 ปัญหาของหน้า Dashboard ปัจจุบัน:
- **UI ยังไม่แสดงผล Tickets**: ในหน้าเว็บยังคงมองเห็นเพียง Checklist แบบเดิม ไม่สะท้อนสถานะ Tickets และ Tracer-Bullet dependencies
- **ขาดการแสดงผล Skill Inventory**: ผู้ใช้ไม่สามารถดูรายการ Skills ที่ติดตั้งในระบบ (`Core` vs `Third-Party` vs `Local Extensions`) ผ่าน Dashboard ได้
- **ขาดการแสดงผล MCP Server & Resources**: ผู้ใช้มองเห็นแค่ตัวเลขเครื่องมือ แต่ไม่เห็นรายละเอียดคำสั่ง, Arguments และ MCP Resources ที่เปิดให้บริการ
- **3-Pillars View ยังไม่ครบถ้วน**: การแบ่งโซน Future (Ideas/Plan), Present (Active Workspace), Past (History Ledger) ยังไม่เด่นชัดเท่าใน Webview Studio

---

## 2. Brainstorming & Architecture Options

| มิติการเปรียบเทียบ | Option A: Quick Patch ใน HTML String | Option B: Extended Snapshot + Modular StudioViewRenderer (แนะนำ) | Option C: Rewrite เป็น React/Vite SPA |
| :--- | :--- | :--- | :--- |
| **สถาปัตยกรรม** | แก้ไข template string เดิมแบบ Ad-hoc | ขยาย `DashboardSnapshot` ให้ส่ง Rich Data + เพิ่ม Partial Components ใน `StudioViewRenderer` | สร้างแอพพลิเคชัน Frontend แยกต่างหาก |
| **ความลึกของโมดูล (Module Depth)** | ตื้น (Shallow) และเปราะบาง | ลึก (Deep Module) สอดคล้องกับ ADR-0010 | ซับซ้อนเกินความจำเป็น (Overkill) |
| **ความเข้ากันได้ & ประสิทธิภาพ** | โหลดเร็ว แต่จัดการยาก | รวดเร็ว โหลดผ่าน Single-file HTML/SSR Hydration โดยไม่ต้องมี Build step ตอนรัน | ต้องมี bundler, node_modules เพิ่มเติม |
| **ผลกระทบต่อ Binary Size** | ต่ำ | ต่ำมาก (รักษาขนาดแพ็กเกจ CLI ไม่ให้บวม) | สูงมาก |
| **ข้อสรุป** | ❌ ไม่ยั่งยืน | ✅ **แนะนำ (Recommended)** | ❌ ซับซ้อนเกินไป |

---

## 3. Scope of Modernization (In-Scope vs. Out-of-Scope)

### ✅ In-Scope:
1. **Snapshot Enrichment (`dashboard-snapshot.ts`)**:
   - เพิ่ม `skills`: แสดงรายการ Core Skills (32), Third-Party Skills ที่ติดตั้ง และสถานะความพร้อม
   - เพิ่ม `activeTickets`: ดึงรายการ Tracer-Bullet Tickets จาก `devflow/context/{xxx-slug}/tickets/` (ถ้ามี)
   - เพิ่ม `mcpResources`: แสดง URIs ของ DevFlow Protocol Resources (`devflow://overview`, `devflow://current-stage`, etc.)
2. **Dashboard UI Components (`studio-view-renderer.ts`)**:
   - **Dual-Track & Tickets Visualizer**: แสดงความคืบหน้าระดับ Ticket พร้อมป้ายกำกับสถานะ (`Blocked`, `Ready`, `In Progress`, `Done`)
   - **Skills Registry Hub Tab/Card**: แสดงการ์ดของ Skills แต่ละประเภท พร้อมปุ่ม Quick Install/Inspect
   - **MCP Server Capabilities Panel**: แสดงคำสั่ง MCP Tool Definitions และ Resource Providers
   - **3-Pillars Architecture Tab Switcher**: แบ่งมุมมองระหว่าง **⚡ Present (Active Task)**, **🔮 Future (Ideas & Plan)**, และ **📦 Past (History Archive)** ให้ชัดเจน สวยงาม
   - **Modern Aesthetic**: รองรับ Vibrant Dark Mode, Glassmorphism, Responsive Grid และ Micro-animations

### ❌ Out-of-Scope:
- การรันคำสั่งแก้ไขโค้ดจากหน้าเว็บโดยไม่มี confirmation (รักษาความปลอดภัยตามหลัก Read-Only & Local Web Server)

---

## 4. UI/UX Wireframe & Layout Design

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│  Nexus-DevFlow Enterprise Studio  [v2.14.0]  ● Connected (Live 2s)               │
│  Project: nexus-devflow  |  Branch: main  |  Quality Gate: PASS                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│  [Quick Actions]:  /feature  /implement  /check  /complete  /matt-pocock  /audit │
├──────────────────────────────────────────────────────────────────────────────────┤
│  [ Tabs ]:  ⚡ Active Work & Tickets  |  🔮 3-Pillars  |  🧩 Skills & MCP  |  🛡️ Gates│
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  [Tab 1: ⚡ Active Work & Tickets]                                               │
│  ┌─────────────────────────────────┐  ┌───────────────────────────────────────┐  │
│  │ Active Living Spec: 079-studio  │  │ Tracer-Bullet Tickets Progress        │  │
│  │ • Stage: Check (PASS)           │  │ • [✔] 01: Decompose DASHBOARD_HTML    │  │
│  │ • Next Action: /complete        │  │ • [✔] 02: Dashboard Page Facade      │  │
│  │ • Empirical Proof: Verified     │  │ • [✔] 03: Presentation Seam Tests     │  │
│  └─────────────────────────────────┘  └───────────────────────────────────────┘  │
│                                                                                  │
│  [Tab 3: 🧩 Skills Registry & MCP Protocol Hub]                                  │
│  ┌─────────────────────────────────┐  ┌───────────────────────────────────────┐  │
│  │ Installed Skills (32 Core + 4 Ext)│  │ Model Context Protocol Hub (MCP)     │  │
│  │ • Core: analyze, discovery, ... │  │ • Tools: 12 Active In-Process Tools   │  │
│  │ • Third-Party: archify, 9arm... │  │ • Resources: devflow://overview, ...  │  │
│  └─────────────────────────────────┘  └───────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Technical Feasibility & Risks

1. **Hydration Integrity**:
   - `renderSnapshot(data)` ใน client-side javascript ต้องรองรับทั้งกรณีที่มี tickets และไม่มี tickets อย่างปลอดภัย
   - ต้องคง `window.__INITIAL_SNAPSHOT__` SSR hydration ไว้เพื่อไม่ให้หน้าจอกะพริบตอนโหลดครั้งแรก
2. **Performance (Snapshot Latency)**:
   - ข้อมูล Skills Catalog และ MCP Tools definitions เป็น in-memory static/cached data จึงแทบไม่มี overhead (< 5ms)
   - ข้อมูล Tickets อ่านเฉพาะจาก active workspace (`devflow/context/{active-slug}/tickets/`) จึงเร็วมาก

---

## 6. Decision & Next Step

* **Decision**: **`Proceed`** (คุณค่าสูงมาก ทำให้ผู้ใช้และทีมเห็นภาพรวมทั้งสถาปัตยกรรมและ workflow สมบูรณ์แบบ)
* **Next Command**: ดำเนินการสร้าง Living Spec ด้วย:
  ```text
  /feature Modernize Web Dashboard with Tickets, Skill Registry, and MCP Hub
  ```
