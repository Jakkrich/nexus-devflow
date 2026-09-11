# Discovery Document: [DISC-20260822-009] Unified Dual-Track Root Switch & Context Auto-Sync Engine

> **Discovery ID**: `DISC-20260822-009`  
> **Source**: `[IDEA-025]` in `devflow/ideas.md` & `/discovery` session  
> **Date**: 2026-08-22  
> **Status**: `Proceed (Ready for Definition / Delivery)`  
> **Approval Status**: `Approved`  
> **Selected Route**: Direct Architecture & Core Engine Refinement  
> **Target Track**: Fast-Track (`/feature`) or Deep-Track (`10-define`)  

---

## 1. Problem Statement

ปัจจุบันระบบ Nexus-DevFlow มีปัญหาความขัดแย้งของสถานะงาน (Split-Brain Context Disconnect) ระหว่าง **Fast-Track** (`devflow/context/current-feature.md`) และ **Deep-Track** (`devflow/context/current-stage.md` + `devflow/context/current-run/`):

1. **ลำดับการอ่านของ `readCurrentWork`**: ใน `packages/create-nexus-devflow/lib/current-work.ts` ระบบวิ่งไปอ่าน `current-feature.md` ก่อนเสมอ หากไฟล์มี Checklist ค้างอยู่ `status.ts` จะตีความว่าเป็นงาน Fast-Track และสรุป Next Action เป็น `/check` แม้ว่าโปรเจกต์จะกำลังทำงานอยู่ในโหมด Deep-Track (`60-report` หรือ `70-deliver`)
2. **`selectNextAction` ไม่รู้จัก Deep-Track**: ฟังก์ชัน `selectNextAction` ใน `packages/create-nexus-devflow/lib/status.ts` ถูกออกแบบให้รู้จักแค่ 4 คำสั่งของ Fast-Track (`/feature`, `/implement`, `/check`, `/fix`) ทำให้ Terminal CLI (`nexus-devflow status`) และ Dashboard Next Action แสดงผลไม่สอดคล้องกับขั้นตอนจริงของ Deep-Track
3. **แท็บ Dual-Track บน Dashboard**: แท็บสลับ Track บนหน้าจอ Dashboard มีการจำค่าใน `localStorage` และไม่ Auto-Focus ตาม Active Track ที่กำลังรันอยู่จริงจาก Living Context

---

## 2. Target Architecture & Core Principles

```text
┌────────────────────────────────────────────────────────────────────────┐
│             devflow/context/current-stage.md (Root Switch)             │
│  - Track: fast | deep | idle                                           │
│  - Active Running ID: xxx-slug                                         │
│  - Current Stage: <stage-name>                                         │
│  - Next Action: /<next-command>                                        │
│  - Living Spec: devflow/context/current-feature.md OR 20-spec.md       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
            Track: fast                     Track: deep
     ┌─────────────────────────────┐ ┌─────────────────────────────┐
     │ current-feature.md          │ │ current-run/                │
     │ (/feature ➔ /implement     │ │ (00-explore ➔ 10-define    │
     │  ➔ /check ➔ /complete)      │ │  ... ➔ 70-deliver)          │
     └─────────────────────────────┘ └─────────────────────────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
                    Unified Core Status Engine (status.ts)
                    - Dual-Track Aware selectNextAction
                    - Auto-Detect & Auto-Sync Fallback
                    - 100% Parity across CLI, AI, and Dashboard
```

---

## 3. Confirmed Requirements & Functional Scope

| ID | Module / Area | Requirement Description |
| :--- | :--- | :--- |
| **FR-01** | `current-stage.md` | ใช้ `devflow/context/current-stage.md` เป็น Root Switch ระบุ `Track: fast \| deep \| idle` ให้ชัดเจนในทุกรอบการทำงาน |
| **FR-02** | `current-work.ts` | ปรับ `readCurrentWork` ให้อ่าน `current-stage.md` ก่อน เพื่อเลือกอ่าน Track ที่ถูกต้อง (`current-feature.md` หรือ `current-run/`) |
| **FR-03** | Auto-Detect & Auto-Sync | หาก `current-stage.md` เป็น `idle` แต่พบสเปกค้างอยู่ใน `current-feature.md` หรือ `current-run/20-spec.md` ให้ระบบ Auto-Detect และสลับ Track ให้โดยไม่เกิด Crash |
| **FR-04** | `status.ts` | อัปเกรด `selectNextAction` ให้รองรับทั้ง Fast-Track (`/implement`, `/check`, `/complete`) และ Deep-Track (`/10-define`...`/70-deliver`) |
| **FR-05** | Stage Lifecycle Update | Fast-Track skills (`feature`, `fix`, `implement`, `check`, `complete`) และ Deep-Track skills (`00-explore`...`70-deliver`) ต้องอัปเดต `current-stage.md` สม่ำเสมอ |
| **FR-06** | Dashboard Visualizer | แดชบอร์ด Auto-Focus แท็บตาม `workflow.track` จาก Context พร้อมแสดงป้ายไฟกระพริบ `● ACTIVE` ที่แท็บที่กำลังทำงานอยู่ (Option 1) |
| **FR-07** | Unit & Contract Tests | เพิ่มและปรับปรุง Automated Tests สำหรับ `readCurrentWork`, `selectNextAction`, `workflow-state` และ Dashboard Snapshot |

---

## 4. Proposed Next Action

งาน Discovery ได้รับการอนุมัติครบถ้วนและพร้อมนำไปขึ้นสเปกพัฒนาในรอบถัดไป:

* **Fast-Track Delivery (แนะนำสำหรับรอบ ID 041)**:
  ```text
  /feature 041-unified-track-root-switch
  ```
* **Deep-Track Delivery**:
  ```text
  /10-define DISC-20260822-009
  ```
