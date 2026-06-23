# Workspace Artifacts

Nexus-DevFlow 2.0 ใช้ `.workspaces/` เป็นพื้นที่เก็บ artifact หลักของงาน โดยยึดแนวทาง `markdown-first`

Operational source of truth for command surfaces lives in [AGENTS.md](/D:/Projects/nexus-devflow/AGENTS.md:1) and [workflow-surface-map.md](/D:/Projects/nexus-devflow/docs/workflow-surface-map.md:1). This document explains artifact layout, not command ownership policy.

## Canonical Layout

```text
.workspaces/
|-- active-agent.json
|-- project_index.json
|-- lessons.md
|-- debug/
|-- issues/
|-- prds/
|-- reports/
|-- research/
|-- roadmap/
|   |-- roadmap-discovery.md
|   `-- {other roadmap notes}.md
|-- wiki/
|   |-- framework/
|   `-- project/
`-- specs/
```

## Folder Responsibilities

| Path | Stores | Related workflows or commands | Keep? |
| :--- | :--- | :--- | :--- |
| `.workspaces/specs/` | Per-running-ID stage artifacts such as `00-discover.md`, `10-define.md`, `20-spec.md`, `30-plan.md`, `40-implement.md`, `50-verify.md`, `60-release.md`, `70-report.md`, `70-report.html`, and optional `checklists/` tracking files | `/00-Discover`, `/10-Define`, `/20-Spec`, `/30-Plan`, `/40-Implement`, `/50-Verify`, `/60-Release`, `/70-Report`, `Brainstorm`, `Research`, `Debug`, `Preview` | Yes. This is the core DevFlow 2.0 task store. |
| `.workspaces/roadmap/` | Product discovery notes and supporting roadmap context in markdown form | `Roadmap` work outside the mainline | Yes. This is the roadmap support area. |
| `.workspaces/research/` | Reusable research notes, source-backed findings, brainstorm outputs | `Research`, `Brainstorm`, Discover, Define, Spec | Yes. It is the durable research library. |
| `.workspaces/issues/` | Issue analysis, triage notes, duplicate/spam decisions, source issue summaries | issue triage and debugging support | Yes. It links external issues to implementation work. |
| `.workspaces/prds/` | Product Requirements Documents created before mainline execution | `PRD` and product-definition work | Yes. It bridges product thinking to executable work. |
| `.workspaces/debug/` | Root cause analysis reports and debugging notes | `Debug`, verify follow-up work | Yes. It keeps RCA separate from implementation artifacts. |
| `.workspaces/reports/` | Cross-cutting reports that are not tied to one stage file | verification, review, specialist summaries | Yes. It captures reusable reports outside a single run. |
| `.workspaces/wiki/` | Compiled framework and project knowledge pages with source-backed links | `Wiki`, `Report`, `Help` | Optional. Create it only when wiki capture is actually needed. |

## Top-Level Files

| File | Purpose | Related workflows or commands |
| :--- | :--- | :--- |
| `.workspaces/active-agent.json` | Records the active `.agent` bundle and npm command surface | activation/bootstrap tasks |
| `.workspaces/project_index.json` | Project-wide structure, services, conventions, and commands | indexing, research, planning support during migration |
| `.workspaces/lessons.md` | Durable project lessons, gotchas, patterns, and human preferences | `Debug`, `Wiki`, `Report`, release/review follow-up |

## Task Workspace Files

แต่ละงานหลักอยู่ใต้ `.workspaces/specs/{ID}-{slug}/` และใช้ไฟล์ stage แบบ flat filename ในโฟลเดอร์เดียว

### Markdown And HTML Policy

- Markdown stage files are the source of truth across the mainline
- HTML files are derived artifacts created only when a stage policy requires or enables them
- In the current framework round, `70-report.html` is the only required HTML stage artifact
- Future stage HTML outputs should be rendered through the shared renderer path instead of re-implementing markdown-to-html logic per stage

### Mainline Stage Files

| File | Purpose |
| :--- | :--- |
| `00-discover.md` | สำรวจโจทย์ บริบท และคำถามต้นทาง |
| `10-define.md` | ล็อกเป้าหมาย ขอบเขต และ decision หลัก |
| `20-spec.md` | กำหนดสัญญาส่งมอบและ acceptance criteria |
| `30-plan.md` | แตกงาน ลำดับงาน ความเสี่ยง และแนวทาง verify |
| `40-implement.md` | บันทึกการลงมือทำ สิ่งที่เปลี่ยน และ deviation |
| `50-verify.md` | หลักฐานการตรวจ finding และผลสรุปคุณภาพ |
| `60-release.md` | สถานะพร้อมปล่อย impact และข้อควรระวัง |
| `70-report.md` | สรุปรันทั้งหมดแบบอ่านง่าย |
| `70-report.html` | สรุปรันทั้งหมดในรูปแบบสื่อสารมาตรฐานสำหรับคนอ่านทั่วไป |

### HTML Rendering Commands

Use the existing report wrapper when rendering the final report:

```powershell
npm.cmd run report:html -- <workspace-path-or-running-id>
```

Use the shared renderer CLI when you want the stage-aware renderer surface directly:

```powershell
npm.cmd run render:html -- --stage 70-report <workspace-path-or-running-id>
```

### Checklist Layer

Use a dedicated checklist folder when people need a live view of task execution:

```text
.workspaces/specs/{ID}-{slug}/checklists/
  master-checklist.md
  implementation-checklist.md
  verification-checklist.md
```

Preferred live checklist format:

```markdown
- [ ] Pending item
- [x] Completed item
- [/] In-progress item
- [!] Blocked item
- [-] Skipped item
```

Supported marker mapping:

| Marker | Status |
| :--- | :--- |
| `[ ]` | `pending` |
| `[x]` | `done` |
| `[/]` or `[~]` | `in_progress` |
| `[!]` | `blocked` |
| `[-]` | `skipped` |

Principles:

1. Checklist files are tied to one running ID.
2. Checklist files make work visible during the run, not only after it finishes.
3. Checklist items should include `status`, `owner`, `updated`, and `evidence`.
4. Checklist files support the stage files. They do not replace `30-plan.md`, `40-implement.md`, or `50-verify.md`.
5. Markdown tables with a `Status` column remain supported for backward compatibility, but checklist UI lines are the preferred human-facing format.

Recommended use:

- Create initial checklist files during `/30-Plan`
- Update implementation status during `/40-Implement`
- Update validation status and release gates during `/50-Verify`
- Carry any final gate items into `/60-Release`
- Summarize completion, blockers, and evidence snapshots during `/70-Report`

### Retired Legacy Files

ไฟล์ตระกูล JSON ของ task หรือ roadmap และ `qa_report.md` ไม่ใช่ส่วนหนึ่งของ DevFlow 2.0 workflow surface แล้ว

หากพบไฟล์เหล่านี้ใน workspace เก่า:

1. ใช้เพื่ออ่านข้อมูลย้อนหลังหรือ migration เท่านั้น
2. อย่าใช้เป็น source of truth ของงานใหม่
3. ย้าย context ที่จำเป็นกลับเข้า stage `.md` ที่สอดคล้องกับลำดับงานปัจจุบัน

## Workflow Relationships

```text
Mainline:
  /00-Discover       -> .workspaces/specs/{ID}-*/00-discover.md
  /10-Define         -> .workspaces/specs/{ID}-*/10-define.md
  /20-Spec           -> .workspaces/specs/{ID}-*/20-spec.md
  /30-Plan           -> .workspaces/specs/{ID}-*/30-plan.md
  /40-Implement      -> .workspaces/specs/{ID}-*/40-implement.md
  /50-Verify         -> .workspaces/specs/{ID}-*/50-verify.md
  /60-Release        -> .workspaces/specs/{ID}-*/60-release.md
  /70-Report         -> .workspaces/specs/{ID}-*/70-report.md and 70-report.html
  Checklist layer    -> .workspaces/specs/{ID}-*/checklists/*.md

Companion commands:
  Brainstorm         -> usually .workspaces/research/ or appended notes in discover/define
  Research           -> .workspaces/research/
  Debug              -> .workspaces/debug/
  Roadmap            -> .workspaces/roadmap/roadmap-discovery.md and ROADMAP.md
  Preview            -> temporary proof or notes in implement/verify
  Wiki               -> .workspaces/wiki/framework/ or .workspaces/wiki/project/ when the wiki surface is explicitly used
  Help               -> workflow recommendation or routing note
```

## Markdown Metadata Contract

Markdown artifact ใน `.workspaces`, `docs`, และ template ควรอิง contract ร่วมใน [markdown-metadata-contract.md](/D:/Projects/nexus-devflow/docs/markdown-metadata-contract.md)

หลักสำคัญ:

1. ใช้ YAML frontmatter สำหรับ metadata ระดับเอกสาร
2. ใช้ heading/tag pattern เมื่อเอกสารนั้นเหมาะกับการ query
3. คงหัวข้อหลักตาม template ของ stage หรือ workflow นั้น
4. อนุญาตให้เพิ่มหัวข้อท้ายเอกสารได้เมื่อจำเป็น

## Wiki Layer

DevFlow Wiki เป็น compiled knowledge ไม่ใช่ source of truth หลัก

Source of truth หลักยังคงอยู่ใน:

- code
- stage artifacts
- research notes
- review and debug evidence
- release/report outputs

## Deletion Policy

หลีกเลี่ยงการสร้างโฟลเดอร์งานล่วงหน้าโดยไม่ใช้งานจริง และสามารถลบโฟลเดอร์ว่างที่ยังไม่ถูกอ้างใช้ออกได้

Safe cleanup targets:

- generated test workspaces เช่น `.agent/.test-workspace-node`
- obsolete temporary files ที่ไม่ถูกอ้างอิงแล้ว
- migration leftovers ที่ทีมยืนยันแล้วว่าไม่ใช้

Not safe to delete by default:

- `.workspaces/specs`
- `.workspaces/wiki` once wiki capture has started
- `.workspaces/lessons.md`

## Regeneration

```powershell
npm.cmd run activate
npm.cmd run index
```

## Legacy Migration

Use the migration helper when a project still has legacy run folders such as `.workspaces/001-some-task/00-discover/discover.md`:

```powershell
npm.cmd run migrate:artifacts -- D:\Projects\some-project
npm.cmd run migrate:artifacts -- D:\Projects\some-project --write
```

The command runs as a dry-run by default and moves legacy task artifacts into `.workspaces/specs/{ID}-{slug}/` with flat stage filenames only when `--write` is provided.

## Validation

```powershell
npm.cmd run roadmap:validate
npm.cmd run validate
npm.cmd run validate:all
```

Framework validation จะช่วยตรวจโครงสร้างหลัก workflow naming report naming และ roadmap markdown contracts
