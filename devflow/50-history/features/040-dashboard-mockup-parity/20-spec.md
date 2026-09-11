# 20 Spec: [040-dashboard-mockup-parity] Dashboard Mockup Parity

> **Running ID**: `040-dashboard-mockup-parity`  
> **Source Discovery**: `DISC-20260822-008`  
> **Approval Status**: `Approved via explicit Autopilot invocation`  
> **Artifact Language**: `th`  
> **Status**: `Implementation Ready`

## 1. Objective

ยกระดับ dashboard ที่ให้บริการจาก `packages/create-nexus-devflow/lib/dashboard.ts` ให้ใช้ธีม blueprint ของ `devflow/reference/mockup.html`, แสดงข้อมูลจริงจาก DevFlow sources และตรวจสอบพฤติกรรมหน้าจอผ่าน BrowserOS Neo MCP

## 2. Functional Requirements

| ID | Requirement |
| :--- | :--- |
| FR-01 | เพิ่ม dashboard-specific snapshot โดยไม่เปลี่ยน `ProjectStatus schemaVersion: 1` |
| FR-02 | Snapshot ต้องรวม status, workflow, history, doctor, discoveries, update, commands และ adapter health |
| FR-03 | Workflow ต้องส่ง `fast`, `deep`, `idle` และ pipeline nodes ที่มี `done`, `active`, `pending` อย่าง deterministic |
| FR-04 | Latest package check ต้องมี timeout/cache และ fallback เป็น `unknown` หรือ `offline` โดย dashboard ยังใช้งานต่อได้ |
| FR-05 | Quick Commands ต้องมาจาก manifest lifecycle/companion commands และใช้ skill description สำหรับ tooltip |
| FR-06 | Dashboard ต้องใช้ blueprint theme, card spacing และลำดับ section ตาม mockup โดย Next Action อยู่ใต้ Dual-Track |
| FR-07 | Typography ต้องใช้ `Google Sans Thai`, `Google Sans` เป็น preferred local families และ `Noto Sans Thai` เป็น web fallback |
| FR-08 | Quick Commands ต้อง copy ได้และ tooltip แสดงได้ทั้ง mouse hover และ keyboard focus |
| FR-09 | Ideas, history, findings, git, current work, warnings และ next action ต้องใช้ข้อมูล runtime จริง |
| FR-10 | Doctor ต้องเป็น read-only และข้อมูล slow-changing ต้องไม่คำนวณใหม่ทุก 2 วินาที |
| FR-11 | Adapter state ต้องใช้คำว่า configured/detected/healthy และห้ามอ้าง synced timestamp ที่พิสูจน์ไม่ได้ |
| FR-12 | Dashboard ต้อง responsive, ไม่มี horizontal page overflow และรองรับ `prefers-reduced-motion` |

## 3. Dashboard Snapshot Contract

```ts
interface DashboardSnapshot {
  schemaVersion: 1;
  generatedAt: string;
  status: ProjectStatus;
  workflow: WorkflowState;
  history: HistorySummary;
  doctor: DoctorSummary;
  discoveries: DiscoverySummary;
  update: PackageVersionStatus;
  commands: CommandCatalogItem[];
  adapters: AdapterDashboardItem[];
}
```

Snapshot endpoint: `GET /api/dashboard`. Existing `GET /api/status` and `GET /api/history` remain unchanged.

## 4. Error and Cache Contract

| Source | Failure behavior | Cache target |
| :--- | :--- | :--- |
| Status | Endpoint returns actionable 500 JSON | no slow cache |
| History/discoveries/doctor | Return safe empty/warning summary where possible | 15 seconds |
| Command catalog/manifest | Fallback command labels/descriptions | process lifetime or 60 seconds |
| npm registry | `state: unknown/offline`, retain installed version | 10 minutes; timeout <= 3 seconds |

## 5. UI Contract

ลำดับหลัก:

```text
Header -> Live state -> Dual-Track -> Next Action -> Stats -> Core cards
-> Doctor/Discoveries -> Quick Commands -> Adapter Health -> Ideas -> History
```

Theme tokens ต้องรักษาทิศทาง blueprint: navy grid background, cyan technical lines, mint healthy state, amber active state, red warning/blocker และ violet track metadata

## 6. Acceptance Criteria

| ID | Acceptance Criterion | Evidence |
| :--- | :--- | :--- |
| AC-01 | `/api/dashboard` ส่ง snapshot ครบและ `/api/status` เดิมยังผ่าน | integration tests |
| AC-02 | idle/Fast/Deep/malformed fixtures map pipeline ถูกต้อง | workflow unit tests |
| AC-03 | registry current/update/offline/timeout ไม่ทำให้ dashboard ล่ม | version unit tests |
| AC-04 | discovery parser อ่าน ID/title/decision/date และ handle missing folder | discovery unit tests |
| AC-05 | command catalog อ่าน manifest และ tooltip descriptions มี fallback | catalog unit tests |
| AC-06 | HTML มี Dual-Track, Next Action ถัดจาก pipeline, stats และ cards ตาม scope | dashboard HTML contract tests |
| AC-07 | computed Thai font stack มี Google Sans preferred และ Noto Sans Thai fallback | BrowserOS computed-style proof |
| AC-08 | desktop 1440x900, tablet 900x900 และ mobile 390x844 ไม่มี page overflow | BrowserOS viewport proofs |
| AC-09 | Fast/Deep tabs, tooltip hover/focus และ copy feedback ทำงาน | BrowserOS interaction proofs |
| AC-10 | หน้าไม่มี console errors หรือ failed same-origin API requests | BrowserOS console/network proof |
| AC-11 | `npm run typecheck`, `npm test`, `npm run check` ผ่าน | command evidence |
| AC-12 | ไม่มี P0/P1 open/fixed findings | findings ledger + targeted audit |

## 7. Visual Test Cases

| Test | Viewport / Action | Expected |
| :--- | :--- | :--- |
| V-01 | 1440x900 load | Blueprint theme, header and cards aligned, no overlap |
| V-02 | Inspect computed body font | preferred Google Sans families and Thai-safe Noto fallback present |
| V-03 | Click Fast/Deep tabs | only selected pipeline visible and active tab state changes |
| V-04 | DOM order check | Next Action immediately follows Dual-Track section |
| V-05 | Hover Quick Command | explanatory tooltip becomes visible |
| V-06 | Focus Quick Command by keyboard | tooltip visible and focus indicator present |
| V-07 | Click Quick Command | copied feedback appears without navigation |
| V-08 | 900x900 | cards collapse appropriately without clipping |
| V-09 | 390x844 | single-column cards, tooltip stays within viewport, no page overflow |
| V-10 | Read live idle data | current state, next action, ideas/history match API snapshot |
| V-11 | Check accessibility tree | tabs/buttons have names and live regions are discoverable |
| V-12 | Read console after interactions | zero uncaught errors |

## 8. Constraints

- Node.js >=18.17, ESM, strict TypeScript, no `any`
- New behavior requires automated tests
- BrowserOS Neo endpoint is `http://127.0.0.1:9010/mcp`
- CSP must explicitly allow Google Fonts origins while retaining restrictive defaults
- No command execution, mutation, merge, push, deploy or `70-deliver`

## 9. Out of Scope

- Editing DevFlow Markdown from browser
- CI provider integration
- Per-adapter hash/timestamp sync protocol
- Changing workflow semantics or public status JSON schema
- Auto-generated HTML delivery report

## 10. Handoff

Specification is approved and sufficiently testable for `30-plan`.

