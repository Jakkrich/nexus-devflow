# Discovery Document: [DISC-20260822-008] Dashboard Mockup Data Coverage

> **Discovery ID**: `DISC-20260822-008`  
> **Source**: Direct request to compare `devflow/reference/mockup.html` with the existing dashboard  
> **Date**: 2026-08-22  
> **Status**: `Proceed (Ready for Definition)`  
> **Approval Status**: `Approved`  
> **Selected Route**: Research + PRD Scoping  
> **Target Track**: Deep-Track (`10-define`)  

---

## 1. Problem Statement

Dashboard ปัจจุบันใน `packages/create-nexus-devflow/lib/dashboard.ts` แสดงข้อมูลหลักจาก `ProjectStatus` ได้แล้ว แต่ยังไม่สามารถสร้างหน้าตาและพฤติกรรมให้เทียบเท่า `devflow/reference/mockup.html` โดยใช้ข้อมูลจริงทั้งหมดได้ เพราะ mockup มีข้อมูลระดับ workflow, health, update, discovery, command catalog และ adapter sync ที่ `ProjectStatus schemaVersion: 1` ยังไม่ผลิต

เป้าหมายของงานถัดไปคือยกระดับ dashboard เดิมให้ใช้ visual hierarchy ตาม mockup โดยไม่ hardcode ค่าสถานะที่เปลี่ยนตามเวลา และไม่ทำลาย contract ของคำสั่ง `status --json`

## 2. Evidence จากระบบปัจจุบัน

| Source | ข้อมูลที่มีจริง |
| :--- | :--- |
| `lib/status.ts` | project, installed version, configured adapters, current work, findings, ideas, git, completion, next action, warnings |
| `lib/history.ts` | archive total และ item fields: type, title, buildPlanItem, status, file |
| `lib/doctor.ts` | health checks รายข้อ พร้อม pass/warn/fail และ summary counts |
| `lib/current-work.ts` | active/idle/malformed, feature/fix/rollback/stage, checklist progress และ next step |
| `.nexus/nexus-devflow.json` | package, installed version, artifact language, configured adapters, Fast/Deep lifecycle command names และ companion commands |
| `devflow/context/current-stage.md` | active discovery, active run, current stage, last completed run และ updated date แต่ยังไม่มี parser สำหรับ dashboard |
| `devflow/ideas.md` | pending/archived ideas; parser ส่ง title, raw input, feasibility, value, date และ status |
| Dashboard API ปัจจุบัน | `/api/status` และ `/api/history`; polling ทุก 2 วินาที |

ข้อเท็จจริงสำคัญ:

- Dashboard เดิมมี 9 cards: Nexus-DevFlow, Current Work, Git, Findings, Completion, Attention, Ideas, History และ Next Action
- Dashboard เดิมยังไม่มี Dual-Track pipeline, summary stats, Doctor, Discoveries, Quick Commands และ Adapter Sync cards
- `ProjectStatus` มี installed version แต่ไม่มี npm latest version หรือ update availability
- `currentWork.type === "stage"` บอก Deep-Track ได้เพียงบางกรณี และไม่ระบุ current stage หรือสถานะของ pipeline node แต่ละตัว
- Manifest ระบุ adapters ที่ตั้งค่าไว้ แต่ไม่มีหลักฐาน `synced at` หรือ hash comparison จึงยังแสดงคำว่า “synced 2m ago” แบบข้อมูลจริงไม่ได้
- Update monitor ใน `scripts/` ตรวจ upstream Git commits ไม่ใช่ npm registry version จึงใช้แทน package update status ไม่ได้

## 3. Full Coverage Matrix

คำจำกัดความ:

- `พร้อมใช้`: API ปัจจุบันส่งข้อมูลแล้ว
- `คำนวณได้`: UI หรือ dashboard read model คำนวณจากข้อมูลปัจจุบันได้อย่างปลอดภัย
- `ยังขาด`: ต้องเพิ่ม parser, service หรือ field ใหม่
- `Static contract`: ไม่ใช่สถานะ runtime ควรมาจาก manifest/catalog แทนการ hardcode ใน HTML

| Mockup section | Field / behavior | Coverage | Source ปัจจุบัน | สิ่งที่ต้องเพิ่ม / ตำแหน่ง |
| :--- | :--- | :--- | :--- | :--- |
| Header | Project name/path | พร้อมใช้ | `ProjectStatus.project` | Bind ใน `dashboard.ts` ได้ทันที |
| Header | Installed version | พร้อมใช้ | `ProjectStatus.devflow.version` | Bind ใน `dashboard.ts` ได้ทันที |
| Header | Latest npm version / up-to-date | ยังขาด | ไม่มี | เพิ่ม `lib/version-check.ts`; expose ผ่าน dashboard read model พร้อม timeout และ TTL cache |
| Header | Health OK/warning | พร้อมใช้ | `ProjectStatus.health` | Bind และใช้ doctor summary ขยายรายละเอียด |
| Header | License/package/repository | ยังขาดใน status | มีใน manifest/package บางส่วน | อ่านผ่าน dashboard metadata composer; ไม่จำเป็นต้องเปลี่ยน `ProjectStatus` |
| Header | Active track | ยังขาด | `currentWork.type` เดาได้ไม่ครบ | เพิ่ม `lib/workflow-state.ts` อ่าน `current-stage.md` และ `current-run/` |
| Header | Revision/generated time | คำนวณได้ | เวลาฝั่ง server | เพิ่ม `generatedAt` ใน dashboard snapshot |
| Dual-Track | Fast/Deep canonical nodes | Static contract | manifest lifecycle | เพิ่ม `lib/command-catalog.ts` หรือ workflow catalog ที่ normalize `feature/fix` เป็น node เดียว |
| Dual-Track | Active track | ยังขาด | ไม่มี explicit field | `workflow.track: fast | deep | idle` จาก `workflow-state.ts` |
| Dual-Track | Current stage | ยังขาด | `current-stage.md` มีข้อความแต่ API ไม่อ่าน | `workflow.currentStage` จาก `workflow-state.ts` |
| Dual-Track | done/active/pending node states | ยังขาด | ไม่มี | สร้าง `workflow.pipeline[]` ใน dashboard snapshot จาก current stage และ lifecycle catalog |
| Dual-Track | Active run note/path | บางส่วน | `currentWork.runId/title/type` | เพิ่ม `track`, `artifactPath` และ stage ให้ workflow read model |
| Next Action | command/reason | พร้อมใช้ | `ProjectStatus.nextAction` | ย้ายตำแหน่ง DOM ใต้ pipeline ตาม mockup |
| Stats | Released runs | พร้อมใช้ | `HistorySummary.total` | รวม `/api/history` เข้าสู่ snapshot หรือ bind endpoint เดิม |
| Stats | Active findings | คำนวณได้ | `findings.active.length` | คำนวณใน snapshot/UI |
| Stats | Pending ideas | พร้อมใช้ | `ideas.totalPending` | Bind ได้ทันที |
| Stats | Configured adapters count | คำนวณได้ | manifest/status adapters | แสดงเป็น “configured” จนกว่าจะมี sync proof |
| Stats | Synced adapters count | ยังขาด | ไม่มี per-adapter verification | เพิ่ม adapter verification service หากต้องใช้คำว่า synced จริง |
| Stats | Current state | พร้อมใช้ | `currentWork.state` | Bind ได้ทันที |
| Nexus card | Architecture label | Static contract | README/manifest | เก็บใน dashboard metadata/catalog ไม่ hardcode หลายจุด |
| Current Work | title/status/run/progress | พร้อมใช้ | `ProjectStatus.currentWork` | Bind ได้ทันที |
| Current Work | Last completed run/date | ยังขาดใน API | `current-stage.md` และ history artifact | เพิ่มใน `workflow-state.ts`; fallback จาก history item ล่าสุด |
| Git | branch/clean/changed/upstream | พร้อมใช้ | `ProjectStatus.git` | Bind ได้ทันที |
| Git | ahead/behind/last commit | พร้อมใช้แต่ UI ไม่แสดง | `ProjectStatus.git` | เพิ่ม DOM binding ใน `dashboard.ts` |
| Findings | total/status/blockers/items | พร้อมใช้ | `ProjectStatus.findings` | Bind ได้ทันที |
| Findings | P0/P1/P2/P3 counts | คำนวณได้สำหรับ active findings | `findings.active[].severity` | aggregate ใน snapshot/UI; เพิ่ม API field only หาก consumers อื่นต้องใช้ |
| Completion | state/blockers | พร้อมใช้ | `ProjectStatus.completion` | Bind ได้ทันที; idle ต้องใช้ข้อความที่ไม่ทำให้เข้าใจว่าเป็น defect |
| Warnings | count/messages | พร้อมใช้ | `ProjectStatus.warnings` | Bind ได้ทันที |
| Doctor | checks และ pass/warn/fail counts | มี domain data แต่ไม่มี API/UI | `runDoctor()` | reuse `lib/doctor.ts`; เพิ่มใน dashboard snapshot พร้อม cache |
| Discoveries | active ID/current status | ยังขาดใน API | `current-stage.md` | เพิ่ม `lib/discoveries.ts` และเชื่อมกับ `workflow-state.ts` |
| Discoveries | recent list/title/decision/date | ยังขาด | discovery folders | `lib/discoveries.ts` parse `devflow/discoveries/*/00-explore.md` |
| Quick Commands | command names | Static contract | manifest lifecycle/companionCommands | สร้าง catalog จาก manifest ไม่ hardcodeเฉพาะ mockup |
| Quick Commands | hover description | ยังขาดเป็น structured data | skill frontmatter มี description | `lib/command-catalog.ts` อ่าน `.agents/skills/<name>/SKILL.md` frontmatter พร้อม fallback catalog |
| Quick Commands | click to copy | UI พร้อมทำได้ | Browser Clipboard API | port behavior เข้า `dashboard.ts`; ไม่ต้องเพิ่ม API |
| Adapter Sync | configured adapter names | พร้อมใช้ | manifest/status | Bind ได้ทันที |
| Adapter Sync | adapter path | Static contract | adapter mapping ใน `project-metadata.ts` | expose safe label/path ผ่าน dashboard snapshot |
| Adapter Sync | detected/healthy status | บางส่วน | `runDoctor()` ตรวจ adapter roots | map doctor check เป็น aggregate health; shared `.agents` path ต้องอธิบายว่าเป็น shared adapter family |
| Adapter Sync | synced timestamp | ยังขาด | manifest มีเพียง `installedAt` | ถ้าจำเป็นต้องมีจริง เพิ่ม `updatedAt` และ per-adapter verification timestamp ใน manifest schema รุ่นถัดไป |
| Ideas | pending/archived totals and item detail | พร้อมใช้ | `IdeasSummary` | Bind ได้ทันที |
| Ideas | High/Medium filter | บางส่วน | feasibility เป็น free-form string | เพิ่ม `feasibilityLevel: high | medium | low | unknown` ใน `lib/ideas.ts` เพื่อไม่ parse string ใน browser |
| History | total/type/title/status/file | พร้อมใช้ | `HistorySummary` | Bind ได้ทันที |
| History | Run ID/date/track/category | บางส่วน | buildPlanItem และ markdown metadata | ขยาย `HistoryItem` parser หาก UI ต้องแสดง metadata เหล่านี้ |
| Live state | connected/disconnected | พร้อมใช้ | fetch success/failure | behavior เดิมใช้ต่อได้ |
| Auto refresh | dynamic polling | พร้อมใช้ | 2-second polling | แยก cache cadence สำหรับ doctor/version/discoveries เพื่อลด I/O และ network |

## 4. Architecture Options

| Option | Pros | Cons | Recommendation |
| :--- | :--- | :--- | :--- |
| A. Port UI อย่างเดียวและ hardcode ส่วนที่ไม่มี | เร็ว, แตะไฟล์น้อย | ข้อมูล drift ทันที, update/sync/stage อาจไม่จริง | ไม่แนะนำ |
| B. เพิ่มทุก field เข้า `ProjectStatus` | endpoint เดียว, client ง่าย | ทำให้ public `status --json` contract โตตาม UI, เสี่ยง breaking change, doctor/update ช้าเมื่อ poll ทุก 2 วินาที | ไม่แนะนำ |
| C. เพิ่ม `DashboardSnapshot` read model แยก | รักษา `ProjectStatus v1`, reuse domain readers, cache ข้อมูลช้าได้, รองรับ mockup ครบ | เพิ่ม composer/modules/tests หลายไฟล์ | แนะนำ |

### Recommended Shape

เพิ่ม `lib/dashboard-snapshot.ts` เป็น composition boundary:

```text
DashboardSnapshot
├── generatedAt
├── status              <- readProjectStatus()
├── workflow            <- readWorkflowState()
├── history             <- readHistory()
├── doctor              <- runDoctor({ fix: false }) [cached]
├── discoveries         <- readDiscoveries() [cached]
├── update              <- checkPackageVersion() [long TTL / offline-safe]
├── commands            <- readCommandCatalog() [cached]
└── adapters            <- configured + health labels (no fake sync timestamp)
```

Dashboard server ควรเพิ่ม `/api/dashboard` โดยคง `/api/status` และ `/api/history` ไว้เพื่อ backward compatibility ส่วน client สามารถ poll snapshot เดียวทุก 2 วินาทีได้ หาก composer cache doctor/version/catalog ภายในตาม cadence ที่เหมาะสม

Recommended cache policy:

| Data | Refresh cadence |
| :--- | :--- |
| current work, git, findings, warnings, next action | 2 seconds |
| history, ideas, discoveries, doctor | 10-30 seconds |
| command catalog, manifest metadata | Until file mtime changes หรือ process restart |
| npm latest version | 10-15 minutes พร้อม 2-3 second timeout และ offline fallback |

## 5. Files ที่ควรเพิ่มหรือแก้เมื่อเริ่ม Delivery

| File | Change |
| :--- | :--- |
| `packages/create-nexus-devflow/lib/dashboard-snapshot.ts` | New aggregate read model, cache policy และ schema |
| `packages/create-nexus-devflow/lib/workflow-state.ts` | New parser สำหรับ track, stage, active discovery และ last completed run |
| `packages/create-nexus-devflow/lib/discoveries.ts` | New safe discovery directory/parser |
| `packages/create-nexus-devflow/lib/version-check.ts` | New npm registry checker แบบ timeout/cache/offline-safe |
| `packages/create-nexus-devflow/lib/command-catalog.ts` | New canonical command list + descriptions จาก manifest/skill frontmatter |
| `packages/create-nexus-devflow/lib/ideas.ts` | Add normalized feasibility level หากเปิดใช้ filters |
| `packages/create-nexus-devflow/lib/history.ts` | Add run/date/track metadata เฉพาะที่ UI ต้องใช้ |
| `packages/create-nexus-devflow/lib/dashboard.ts` | Add snapshot endpoint และ port layout/interactions จาก mockup |
| `packages/create-nexus-devflow/test/dashboard.test.ts` | Test HTML sections, endpoint contract, cache/offline behavior |
| `packages/create-nexus-devflow/test/workflow-state.test.ts` | New Fast/Deep/idle/malformed fixtures |
| `packages/create-nexus-devflow/test/discoveries.test.ts` | New discovery parsing and unsafe-path cases |
| `packages/create-nexus-devflow/test/version-check.test.ts` | New update/current/offline/timeout cases โดย inject fetch |
| `packages/create-nexus-devflow/test/command-catalog.test.ts` | New manifest/frontmatter/fallback cases |

ไฟล์ที่ไม่ควรใช้เป็น runtime source โดยตรง:

- `README.md`: เป็นเอกสาร ไม่ควรถูก parse ทุกครั้งเพื่อสร้าง dashboard
- `devflow/reference/mockup.html`: เป็น visual reference ไม่ใช่ source of truth
- ค่า “synced 2m ago”: ห้ามแสดงจนกว่าจะมี timestamp และ verification semantics จริง

## 6. Scope Recommendation

### In Scope

- Port visual hierarchy, card spacing, responsive layout และ interactions จาก mockup
- เพิ่ม Dual-Track pipeline และวาง Next Action ใต้ pipeline
- แสดงข้อมูลจริงทุก card ด้วย dashboard snapshot
- เพิ่ม hover/focus descriptions และ copy action สำหรับ commands
- รองรับ offline update-check state เช่น `unknown/offline` โดยไม่ลด health ทั้งระบบ
- รักษา `/api/status` และ `status --json` schema เดิม
- เพิ่ม unit/integration tests สำหรับ parser, snapshot และ dashboard endpoint

### Out of Scope

- เปลี่ยน Fast/Deep workflow semantics
- ทำ command execution จาก browser; Quick Commands ให้ copy เท่านั้น
- เขียนแก้ Markdown จาก dashboard
- แสดง fake CI, sync timestamp หรือ latest version เมื่อ source ตรวจไม่ได้
- เปลี่ยน manifest schema เพื่อเก็บ per-adapter hashes ในรอบเดียวกัน เว้นแต่ยืนยันว่าต้องการคำว่า “synced” แบบเข้มงวด

## 7. Risks and Controls

| Risk | Control |
| :--- | :--- |
| npm registry ช้าหรือ offline | timeout, TTL cache, state `unknown`, ไม่ block dashboard |
| 2-second polling ทำ I/O หนัก | cache slow-changing readers แยก cadence |
| `status --json` consumers แตก | ไม่แก้ `ProjectStatus schemaVersion: 1`; ใช้ dashboard-specific schema |
| Deep-Track stage เดาผิด | parse `current-stage.md` และ file presence ด้วย explicit normalization/tests |
| command descriptions drift | manifest เป็นรายการ canonical และ skill frontmatter เป็น description source |
| adapter “synced” ทำให้เข้าใจผิด | ใช้ configured/detected/healthy จนมี hash/timestamp proof |
| HTML template ใหญ่และดูแลยาก | แยก data composition ออกจาก renderer; ใช้ pure client render helpers ที่ test ได้ |

## 8. Decision

### Final Decision: `Proceed`

Mockup สามารถนำไปปรับ dashboard เดิมได้ แต่ต้องสร้าง dashboard-specific read model ก่อน เพื่อปิดช่องว่างข้อมูลโดยไม่ hardcode และไม่ขยาย public status contract ตามความต้องการของ UI

เหตุผลที่เลือก Deep-Track:

- แตะมากกว่า 6 ไฟล์
- ครอบคลุม filesystem parsers, API schema, caching, frontend rendering และ tests
- มี external npm registry behavior และ offline edge cases
- ต้องรักษา backward compatibility ของ `status --json`

### Handoff

คำสั่งถัดไปเมื่ออนุมัติเริ่ม delivery:

```text
/10-define DISC-20260822-008
```

แนะนำแบ่ง delivery เป็นสอง review gates:

1. Data foundation: workflow/discovery/version/catalog readers + dashboard snapshot API
2. UI parity: port mockup layout, tooltips, pipeline, cards, responsive behavior และ integration tests
