# 🔍 [DISC-20260823-003] Dashboard Modernization for Enterprise Features 1–7

> **Discovery ID**: `DISC-20260823-003-dashboard-modernization-for-features-1-7`  
> **Topic**: Modernizing Web Dashboard to visualize and control Enterprise Features 1–7  
> **Status**: Completed (Approved for Delivery)  
> **Date**: 2026-08-23  

---

## 1. Problem Statement & Context

หลังจากที่ระบบ **Nexus-DevFlow 2.0** ได้พัฒนาและปิดรอบส่งมอบความสามารถระดับ Enterprise ครบทั้ง 7 Phase ในเวอร์ชัน `v2.1.0`:
1. 🛡️ **Quality Gatekeeper & Pre-commit Hooks** (`042`)
2. ⚡ **DevFlow MCP Server Hub & 12 Typed Tools** (`043`)
3. 🌿 **Branch-Scoped Context Isolation & Dynamic Router** (`044`)
4. ✂️ **JIT Dynamic Context Slicing Engine** (`045`)
5. 🔄 **Git Diff Drift Reconciler & Self-Healing** (`046`)
6. 🖥️ **IDE Native Extension & Webview Studio** (`047`)
7. 🤖 **Multi-Agent Swarm Orchestrator & Semantic Code Graph RAG** (`048`)

หน้าจอ **Web Dashboard ปัจจุบัน** (`packages/create-nexus-devflow/lib/dashboard-server.ts` & `dashboard-snapshot.ts`) ยังคงแสดงผลเฉพาะสถานะพื้นฐานเดิม (Status, Dual-Track Stage Tabs, History, Doctor, Discoveries) โดย **ยังไม่ได้ดึงข้อมูลของทั้ง 7 ฟีเจอร์ใหม่มาแสดงผลแบบ Interactive Real-time** 

ผู้ใช้และทีมงานต้องการให้ Dashboard สามารถ:
- แสดงผลสถานะ **Quality Gatekeeper** (Pass/Blocked) และ **Git Drift Status**
- แสดงรายการ **12 MCP Tools** และสถานะการเชื่อมต่อของ AI Agent
- แสดงผัง **Multi-Agent Swarm Matrix** (ภารกิจของ Coder, QA, Security, Architect)
- แสดงและค้นหา **Semantic Code Graph & Blast Radius** แบบ Interactive
- มีปุ่มคำสั่งลัดสำหรับ **JIT Slicing** และ **Self-Healing Sync (`reconcile --fix`)**

---

## 2. Exploration & Architecture Options

### Option 1: Full Enterprise Suite Integration in Web Dashboard (Recommended) 🌟
- **แนวทาง**:
  - ขยาย `DashboardSnapshot` (`packages/create-nexus-devflow/lib/dashboard-snapshot.ts`) ให้รวมข้อมูล:
    - `gatekeeper`: ผลการประเมิน Gatekeeper, Blockers count, Warnings count
    - `drift`: ผลการตรวจ Git Drift (Undocumented, Phantom, Matched)
    - `swarm`: แผน Swarm Matrix ปัจจุบันและ Roster ของ Subagents
    - `codeGraph`: สถิติจำนวนไฟล์และ Dependency Edges
    - `mcpTools`: รายการ 12 MCP Tools พร้อมคำอธิบาย
  - อัปเกรด UI ใน `dashboard-server.ts` เพิ่ม Interactive Tabs / Sub-Panels:
    - 🛡️ **Gate & Drift Inspector**: แสดง Badge สถานะ Gatekeeper และปุ่มคลิก Auto-Reconcile
    - 🤖 **Swarm & MCP Hub**: แสดงบทบาท AI Subagents และรายการ Tools ที่ AI พร้อมเรียกใช้
    - 🗺️ **Code Graph Explorer**: ตารางค้นหาความสัมพันธ์ของไฟล์และจำลอง Blast Radius
  - **ข้อดี**: เป็นหน้าจอ Command Center เดียวที่ครบวงจร, Zero-Dependency, ตอบสนองเร็วผ่าน SSE Live Update
  - **ข้อเสีย**: Snapshot Payload เพิ่มขึ้นเล็กน้อย (จัดการได้ด้วย In-Memory Cache TTL 15 วินาที)

---

### Option 2: Separate Standalone Micro-Dashboards
- **แนวทาง**: แยกหน้าเว็บเฉพาะทางเป็นหลาย Port (เช่น Port 4173 สำหรับ Gatekeeper, Port 4174 สำหรับ Code Graph)
- **ข้อเสีย**: ประสบการณ์ผู้ใช้ (UX) แย่ ต้องสลับหลาย Browser Tabs และเปลือง Resource

---

### Option 3: Replace Dashboard with Static Webview Studio HTML
- **แนวทาง**: ยกเลิก Web Server แล้วให้เปิดเฉพาะไฟล์ `studio.html`
- **ข้อเสีย**: ขาดความสามารถ Live Polling / Server-Sent Events (SSE) และไม่สามารถรัน Real-time API Backend ได้

---

## 3. Comparative Evaluation Matrix

| เกณฑ์การประเมิน | Option 1: Full Integration (แนะนำ) | Option 2: Micro-Dashboards | Option 3: Static Webview Only |
| :--- | :---: | :---: | :---: |
| **ความครบถ้วนของข้อมูล 7 ฟีเจอร์** | ⭐⭐⭐⭐⭐ (ครบ 100%) | ⭐⭐⭐ (กระจัดกระจาย) | ⭐⭐⭐ (ไม่มี Live Backend) |
| **User Experience (UX / All-in-One)** | ⭐⭐⭐⭐⭐ (หน้าจอเดียว) | ⭐⭐ (สับสนหลาย URL) | ⭐⭐⭐ (ขาด Real-time Sync) |
| **ประสิทธิภาพและการใช้ Resource** | ⭐⭐⭐⭐ (In-Memory Cache) | ⭐⭐ (รันหลาย Server) | ⭐⭐⭐⭐⭐ (Static) |
| **การเชื่อมต่อกับ Dual-Track Workflow** | ⭐⭐⭐⭐⭐ (Real-time SSE) | ⭐⭐⭐ | ⭐⭐ |

---

## 4. Delivery Scope & Implementation Blueprint

เมื่อเข้าสู่การพัฒนา (Delivery Phase):
1. **`lib/dashboard-snapshot.ts`**:
   - นำเข้า `evaluateGate`, `detectGitDrift`, `generateSwarmPlan`, `buildCodeGraph`, และ `DEVFLOW_MCP_TOOLS`
   - เพิ่มฟิลด์ `gatekeeper`, `drift`, `swarm`, `graph`, `mcp` ลงใน `DashboardSnapshot`
2. **`lib/dashboard-server.ts`**:
   - เพิ่ม UI Components:
     - Gatekeeper & Drift Pill Indicator บน Top Header
     - Tab **"🤖 Multi-Agent & MCP Hub"** (แสดง 4 Subagents + 12 MCP Tools)
     - Tab **"🗺️ Code Graph & Blast Radius"** (ค้นหาไฟล์และแสดง Dependent Nodes)
     - ปุ่ม Interactive Quick Action สำหรับ `reconcile` และ `slice`
3. **API Endpoint**:
   - เพิ่ม `/api/graph?file=<path>` สำหรับคิวรี Blast Radius แบบ Interactive จากหน้าเว็บ Dashboard
4. **Unit Tests**:
   - อัปเดต `test/dashboard-snapshot.test.ts` และ `test/dashboard-server.test.ts` ครอบคลุมฟิลด์ใหม่ทั้งหมด

---

## 5. Discovery Verdict & Next Action

> 🎯 **Verdict**: **APPROVED FOR DELIVERY (Fast-Track Feature)**  
> **Recommended Running ID**: `049-dashboard-modernization-features-1-7`  
> **Target Delivery Track**: Fast-Track (Blueprint Mode — 4 Steps)

### คำสั่งถัดไปสำหรับเริ่มพัฒนา:
```bash
/feature 049-dashboard-modernization-features-1-7
```
