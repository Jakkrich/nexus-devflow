# 30 Plan: [040-dashboard-mockup-parity] Dashboard Mockup Parity

> **Complexity**: `complex / L`  
> **Approval Status**: `Approved via explicit Autopilot invocation`  
> **Status**: `Ready for 40-execute`

## 1. Planning Loop Evidence

- **Intent**: ส่งมอบ data foundation และ UI parity โดยรักษา status compatibility
- **Context**: ตรวจ `status.ts`, `current-work.ts`, `history.ts`, `doctor.ts`, manifest, dashboard server/client และ mockup
- **Observation**: readers หลักมีแล้ว แต่ workflow/update/discovery/catalog และ aggregate endpoint ยังขาด
- **Adjustment**: แยก `DashboardSnapshot` ออกจาก `ProjectStatus`; cache slow readers; ใช้ truthful adapter vocabulary
- **Stop Condition**: ทุก phase มี files, tests, verification และ BrowserOS scenarios ชัดเจน
- **Handoff**: execute ตามลำดับ Unit A -> B -> C

## 2. Unit A: Data Readers

| Subtask | Files | Test Decision | Verification |
| :--- | :--- | :--- | :--- |
| A1 Workflow state/pipeline | new `lib/workflow-state.ts`, new test | Required: idle/Fast/Deep/malformed | package test filter/full test |
| A2 Discovery summary | new `lib/discoveries.ts`, new test | Required: valid/missing/malformed/safe paths | package tests |
| A3 Version status | new `lib/version-check.ts`, new test | Required: current/update/offline/timeout/cache | package tests |
| A4 Command catalog | new `lib/command-catalog.ts`, new test | Required: manifest/frontmatter/fallback | package tests |

## 3. Unit B: Snapshot and HTTP API

| Subtask | Files | Test Decision | Verification |
| :--- | :--- | :--- | :--- |
| B1 Compose snapshot and TTL caches | new `lib/dashboard-snapshot.ts`, new test | Required: composition/fallback/cache | package tests |
| B2 Serve `/api/dashboard` | `lib/dashboard.ts`, `test/dashboard.test.ts` | Required: endpoint schema and legacy routes | package tests |

## 4. Unit C: Mockup UI Parity

| Subtask | Files | Test Decision | Verification |
| :--- | :--- | :--- | :--- |
| C1 Blueprint page renderer | new `lib/dashboard-page.ts`, `lib/dashboard.ts` | Required: required sections/order/CSP/fonts | dashboard tests |
| C2 Runtime binding/interactions | `lib/dashboard-page.ts` | Required: HTML contract + BrowserOS V-03..V-07 | package tests + MCP |
| C3 Responsive/accessibility polish | `lib/dashboard-page.ts` | Required: HTML a11y contract + BrowserOS V-01,V-02,V-08..V-12 | package tests + MCP |

## 5. Verification Commands

```text
npm run typecheck
npm test
npm run check
```

BrowserOS Neo verification uses MCP `run` for viewport, DOM order, computed style, interaction, overflow, accessibility snapshot and console checks. Screenshots are captured for desktop and mobile evidence.

## 6. Risks

| Risk | Mitigation |
| :--- | :--- |
| Registry unavailable | injected fetch + timeout + offline state |
| Polling overhead | per-source TTL caches |
| HTML template growth | isolate page renderer from readers/server |
| Shared `.agents` adapter roots | report configured/healthy, not per-tool sync time |
| External font unavailable | local Google Sans preference + Noto Sans Thai fallback |

## 7. Planned Files

- Create: `workflow-state.ts`, `discoveries.ts`, `version-check.ts`, `command-catalog.ts`, `dashboard-snapshot.ts`, `dashboard-page.ts`
- Create: five focused unit test files
- Modify: `dashboard.ts`, `dashboard.test.ts`
- Update: Deep-Track artifacts and checklists

## 8. Handoff

Plan approved. Start `40-execute 040-dashboard-mockup-parity` at Unit A.

