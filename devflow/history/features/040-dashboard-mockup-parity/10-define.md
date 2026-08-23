# 10 Define: [040-dashboard-mockup-parity] Dashboard Mockup Parity

> **Running ID**: `040-dashboard-mockup-parity`  
> **Discovery ID**: `DISC-20260822-008`  
> **Category**: Feature  
> **Track**: Deep-Track (Architect Mode)  
> **Stage Status**: `10-define Completed`  
> **Approval Status**: `Approved`  
> **Date**: 2026-08-22  
> **Next Stage**: `20-spec 040-dashboard-mockup-parity`

---

## 1. Delivery Outcome

ปรับปรุง local Nexus-DevFlow dashboard เดิมให้มี information architecture, visual hierarchy และ interaction coverage เทียบเท่า `devflow/reference/mockup.html` โดยทุกสถานะที่เปลี่ยนตามเวลาอ่านจาก source of truth จริง ไม่ใช้ค่าตัวอย่างหรือข้อความที่อ้างว่า update/sync สำเร็จโดยไม่มีหลักฐาน

ผลลัพธ์ต้องรักษา public contract ของ `status --json schemaVersion: 1` และแยกข้อมูลเฉพาะ dashboard ออกเป็น read model ที่มี caching ตามความถี่การเปลี่ยนแปลงของแต่ละ source

## 2. Users and Value

| User | Need | Value |
| :--- | :--- | :--- |
| Developer using Nexus-DevFlow | เห็นสถานะ Fast/Deep run และ next action ในหน้าเดียว | ลดการเปิดหลายไฟล์และลดการเลือกคำสั่งผิด |
| Maintainer | เห็น version, health, adapters, discoveries, ideas และ history จากข้อมูลจริง | ตรวจ drift และ update readiness ได้เร็วขึ้น |
| AI-assisted team | ใช้ Quick Commands พร้อมคำอธิบาย canonical | เข้าใจ command intent โดยไม่ต้องเปิด README ทุกครั้ง |

## 3. In Scope

- เพิ่ม dashboard-specific `DashboardSnapshot` โดย compose readers เดิมแทนการขยาย `ProjectStatus v1` ตาม UI
- เพิ่ม workflow state reader สำหรับ `track`, `currentStage`, pipeline node states, active discovery และ last completed run
- เพิ่ม discovery reader สำหรับ active/recent discovery metadata
- เพิ่ม npm package version checker แบบ timeout, TTL cache และ offline-safe state
- เพิ่ม command catalog จาก manifest lifecycle/companion commands และ skill frontmatter descriptions
- reuse `readProjectStatus()`, `readHistory()` และ `runDoctor({ fix: false })`
- เพิ่ม normalized idea feasibility level หากเปิดใช้ High/Medium filters
- ขยาย history metadata เฉพาะ field ที่ dashboard ต้องแสดงจริง
- เพิ่ม `/api/dashboard` หรือ endpoint equivalent โดยคง `/api/status` และ `/api/history` เดิม
- port Dual-Track pipeline, summary stats, Doctor, Discoveries, Quick Commands, Adapter Health และ card layout จาก mockup เข้า dashboard เดิม
- ย้าย Next Action ให้อยู่ใต้ Dual-Track Delivery Model
- รองรับ mouse hover และ keyboard focus descriptions สำหรับ Quick Commands
- รักษา live refresh, disconnected state, copy actions, reduced motion และ responsive layout
- เพิ่ม unit/integration tests สำหรับ readers, snapshot schema, caching/offline behavior และ dashboard endpoint/HTML contract

## 4. Out of Scope

- ไม่เปลี่ยน workflow semantics ของ Fast-Track หรือ Deep-Track
- ไม่เปลี่ยน `ProjectStatus schemaVersion: 1` หรือทำลาย consumers ของ `status --json`
- ไม่ให้ browser เรียก execute DevFlow commands; Quick Commands ทำได้เฉพาะ copy
- ไม่เขียนหรือแก้ Markdown จาก dashboard
- ไม่ parse `README.md` หรือ `mockup.html` เป็น runtime source
- ไม่แสดง fake CI state, fake update state หรือ fake adapter sync timestamp
- ไม่เพิ่ม per-adapter managed-file hash protocol ใน manifest เว้นแต่ `20-spec` ยืนยันว่าคำว่า `synced` เป็น acceptance requirement
- ไม่ redesign CLI human output นอกส่วนที่จำเป็นต่อ dashboard API

## 5. Source-of-Truth Contract

| Domain | Canonical source | Reader / boundary |
| :--- | :--- | :--- |
| Project/current work/findings/git/ideas/next action | Existing DevFlow context and Git | `readProjectStatus()` |
| Workflow track/stage/last completion | `current-stage.md`, `current-run/`, history fallback | New workflow state reader |
| Delivery archives | `devflow/history/` | `readHistory()` |
| Setup health | Project files and adapters | `runDoctor({ fix: false })` |
| Discoveries | `devflow/discoveries/*/00-explore.md` | New discovery reader |
| Installed package/configured lifecycle | `.nexus/nexus-devflow.json` | Existing manifest reader + dashboard catalog |
| Latest published package | npm registry | New version checker with bounded network behavior |
| Command descriptions | Skill frontmatter with catalog fallback | New command catalog reader |
| Visual direction | `devflow/reference/mockup.html` | Design reference only, never runtime data |

## 6. Required Dashboard Read Model

```text
DashboardSnapshot
|- schemaVersion
|- generatedAt
|- status
|- workflow
|- history
|- doctor
|- discoveries
|- update
|- commands
`- adapters
```

Required semantics:

| Field group | Required behavior |
| :--- | :--- |
| `status` | Preserve existing `ProjectStatus` values without changing its public schema |
| `workflow` | Explicitly return `fast`, `deep`, or `idle`; never infer solely from a UI label |
| `update` | Return `current`, `available`, `unknown`, or `offline`; update failure must not break dashboard health |
| `doctor` | Read-only checks only; dashboard must never invoke `--fix` |
| `commands` | Return canonical name, copy value, description, family และ track compatibility |
| `adapters` | Distinguish configured/detected/healthy; use `synced` only when verification proof exists |

## 7. Functional Boundaries

### Data Foundation Gate

- Pure parsers must remain separate from HTTP and HTML rendering
- External version lookup must accept injectable fetch/time dependencies for deterministic tests
- Filesystem readers must handle missing/invalid paths safely and reject unsafe symlink traversal according to existing project patterns
- Slow-changing data must be cached independently from the 2-second live status refresh

### UI Parity Gate

- Render Fast-Track 4-step and Deep-Track 8-stage pipelines from structured data
- Place Next Action immediately below the Dual-Track section
- Render summary stats from actual snapshot values
- Add cards for doctor, discoveries, command catalog and adapter health
- Preserve existing ideas/history/current work/git/findings/completion/warnings behavior
- Provide tooltip content on mouse hover and keyboard focus
- Maintain usable desktop and mobile spacing and honor `prefers-reduced-motion`

## 8. Acceptance Boundaries for 20-Spec

`20-spec` must turn these boundaries into measurable acceptance criteria:

1. No runtime-changing value displayed by the dashboard is hardcoded in HTML.
2. Existing `/api/status`, `/api/history` and `status --json` behavior remains backward compatible.
3. Dashboard can start and render when npm registry is unavailable.
4. Fast active, Deep active, idle and malformed workflow fixtures map to deterministic pipeline states.
5. Doctor runs read-only and is not executed every 2 seconds.
6. Quick Command names come from the canonical lifecycle/catalog and descriptions are accessible by hover and focus.
7. Adapter labels never claim `synced` without explicit proof.
8. Automated tests cover new parser contracts, snapshot endpoint and key HTML sections.

## 9. Dependencies

- Existing `readProjectStatus()` contract in `lib/status.ts`
- Existing `readHistory()` contract in `lib/history.ts`
- Existing `runDoctor()` contract in `lib/doctor.ts`
- Existing manifest reader in `lib/update.ts`
- Stable formats for `current-stage.md`, discovery frontmatter-like metadata and skill YAML frontmatter
- npm registry availability is optional, not required for core dashboard operation

## 10. Risks and Controls

| Risk | Control |
| :--- | :--- |
| Public JSON contract regression | Add separate dashboard schema and keep status schema unchanged |
| Excessive filesystem/network work from polling | Source-specific TTL cache and bounded timeout |
| Deep-Track stage mapped incorrectly | Explicit parser normalization and fixture tests for all stages |
| Dashboard displays unsupported sync claims | Use configured/detected/healthy vocabulary |
| Skill description parsing fails | Safe fallback description and warning state |
| Large renderer becomes difficult to maintain | Keep domain readers/composer separate from HTML/client rendering |

## 11. Delivery Sizing

- **Size**: `L`
- **Why**: touches filesystem parsing, API composition, caching, external lookup, frontend rendering, responsive/accessibility behavior and multiple test suites
- **Recommended review gates**:
  - Gate A: data readers + snapshot schema/API
  - Gate B: mockup UI parity + integration tests

## 12. Definition Decision

### Approved Delivery Boundary: `Proceed to 20-spec`

Running ID `040-dashboard-mockup-parity` is allocated exclusively to this delivery. No implementation work is authorized in `10-define`; the next stage must formalize exact schemas, acceptance criteria, error states and test cases.

```text
/20-spec 040-dashboard-mockup-parity
```

## 13. Schema Fallback Note

The skill-declared template `.agent/resources/schemas/define.template.md` was not present in the repository at definition time. This artifact therefore follows the established Markdown-first Deep-Track contract and records all required identity, scope, source, boundary, dependency, risk, sizing, approval and handoff fields explicitly.
