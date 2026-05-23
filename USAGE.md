# Nexus-DevFlow Usage Guide

คู่มือนี้อธิบายวิธีใช้ workflow ทั้งหมดของ Nexus-DevFlow แบบผู้ใช้ควบคุมทีละขั้นใน IDE โดยปรับปรุงจาก `.agent/workflows/README.md` และเพิ่ม workflow addon จาก external prompt families

แนวคิดหลัก:

- ใช้ workflow เป็นคำสั่งนำทาง ไม่ใช่ระบบ auto-run ทั้งหมด
- เริ่มจาก discovery แล้วค่อยสร้าง task, plan, code, verify
- JSON artifacts ควรแก้ด้วย PRP CLI เช่น `artifact:*`, `plan:*`, `validate`, `repair`
- ถ้าใช้ PowerShell บน Windows แล้ว `npm` ติด execution policy ให้ใช้ `npm.cmd`

## Quick Command Surface

```powershell
npm.cmd run activate
npm.cmd run validate
npm.cmd run agent:status
npm.cmd run agent -- --help
npm.cmd run goal -- goal "Create a small test task" max-turns 15 dry-run
```

Task JSON commands:

```powershell
npm.cmd run agent -- init 007 "Feature Name" feature-name "Short description"
npm.cmd run agent -- artifact:get 007 requirements
npm.cmd run agent -- artifact:set 007 requirements priority high
npm.cmd run agent -- artifact:append 007 requirements acceptance_criteria "User can complete the target flow"
npm.cmd run agent -- plan:add-phase 007 "Backend implementation" --type implementation
npm.cmd run agent -- plan:add-subtask 007 phase-1 "Create API endpoint" --service backend
npm.cmd run agent -- plan:set-subtask-status 007 subtask-1.1 completed
npm.cmd run agent -- plan:validate 007
npm.cmd run agent -- validate 007
```

## Workflow Groups

| Group | Workflows | Use When |
| :--- | :--- | :--- |
| Goal Automation | `/05-Goal` | Route a high-level goal into DevFlow, PRD, Brainstorm, or Debug flow with Boss-Worker session logging. |
| Setup & Status | `/00-Init`, `/01-App-Builder`, `/02-Status` | เริ่ม project, scaffold app, ตรวจสถานะ framework |
| Discovery & Product Thinking | `/10-Brainstorm`, `/11-Research`, `/12-PRD`, `/13-UI-UX`, `/14-Orchestrate` | คิด feature, วิจัย codebase, ทำ PRD, วาง UX, ประสานงานซับซ้อน |
| Prompt Addon Discovery | `/15-Spec-Research`, `/16-Competitor`, `/17-Roadmap`, `/18-Spec-Orchestrate` | ใช้ prompt family เพิ่มเติม เช่น spec research, competitor, roadmap, spec orchestration |
| Debugging | `/20-Debug` | วิเคราะห์ root cause ก่อนวางแผนแก้ |
| Core PRP Execution | `/30-Task`, `/31-Plan`, `/32-Code`, `/33-Verify`, `/34-Human`, `/35-Followup` | สร้าง task, วางแผน, เขียนโค้ด, ตรวจ, approve, ต่อเติมงานเดิม |
| Quality & Optimization | `/39-QA-Orchestrate`, `/40-Test`, `/41-Simplify`, `/42-Preview` | QA ซับซ้อน, test, refactor, preview |
| Ship & Release | `/50-Commit`, `/51-PR`, `/52-Deploy`, `/53-Changelog`, `/54-Insight`, `/58-Merge` | commit, PR, deploy, changelog, เก็บบทเรียนหลังงานเสร็จ, ผสานสาขา |
| GitHub Review & Triage | `/55-PR-Review`, `/56-PR-Followup`, `/57-Issue-Triage` | review PR, แก้ PR comments, triage GitHub issues |
| Knowledge & Specialist Tools | `/59-Wiki`, `/60-Graphify`, `/90-Agent`, `/99-Help` | compile wiki knowledge, graph knowledge, เรียก specialist, ขอคำแนะนำแบบ read-only |

## Borderline Addons And Thin Aliases

คำสั่งที่มาจาก prompt family บางตัวดูเหมือนควรเป็น slash command แต่ใน Nexus-DevFlow ยังควรเป็น skill หรือ alias บาง ๆ ก่อน เพื่อไม่ให้ workflow แตกย่อยเกินจำเป็น:

| Intent / Source | ให้เริ่มที่ | เป็นอะไรในระบบ |
| :--- | :--- | :--- |
| `validation_fixer` | `/33-Verify` แล้วกลับ `/32-Code` ถ้าต้องแก้ implementation | thin alias ไปที่ `json-artifact-handling` + `lint-and-validate` |
| `ideation_documentation` | `/10-Brainstorm`, `/11-Research`, `/54-Insight`, หรือ `/53-Changelog` | skill-backed analysis ด้วย `documentation-and-adrs` + `documentation-maintainer` |
| `ideation_performance` | `/33-Verify`, `/39-QA-Orchestrate`, หรือ `/41-Simplify` | skill-backed review ด้วย `performance-optimization` + `performance-engineer` |
| `ideation_security` | `/33-Verify`, `/39-QA-Orchestrate`, หรือ `/20-Debug` เมื่อเป็น incident | skill-backed review ด้วย `security-and-hardening` + `security-auditor` |
| `mcp_tools/*` validation | `/33-Verify` หรือ `/40-Test` | tool-specific validation guidance ตามเครื่องมือที่ IDE มีจริง |
| autonomous orchestration aliases | `/14-Orchestrate`, `/18-Spec-Orchestrate`, `/39-QA-Orchestrate`, หรือ `/90-Agent` | alias บาง ๆ ไม่ auto-run ข้าม phase gate |

## 9arm-Skills Discipline Layer

Nexus-DevFlow adapts [`thananon/9arm-skills`](https://github.com/thananon/9arm-skills) for Antigravity IDE as a credited discipline layer. Users keep using the same workflow commands; the flow applies the relevant skill internally and preserves the usual report output.

| Workflow | Applied skill | Output remains |
| :--- | :--- | :--- |
| `/20-Debug` | `9arm-skills/debug-mantra` | `.workspaces/debug/rca-{slug}.md` |
| `/54-Insight` | `9arm-skills/post-mortem` | task logs, `.workspaces/lessons.md`, or insight summary |
| `/55-PR-Review` | `9arm-skills/scrutinize` | task `pr_review.md` or PR review report |
| `/90-Agent code-reviewer` | `9arm-skills/scrutinize` | `.workspaces/reports/{AGENT_NAME}_{TIMESTAMP}.md` when substantial |
| `/51-PR`, `/53-Changelog`, `/99-Help` | `9arm-skills/management-talk` | PR body, changelog entry, or read-only help summary |

Credit is preserved as `9arm-skills` / `thananon/9arm-skills` in relevant reports.

## Workflow Index

| Workflow | Purpose | Example |
| :--- | :--- | :--- |
| `/05-Goal` | Route high-level goal with max-turns, task decomposition, metrics, and session log | `/05-Goal "add password reset and tests"` |
| `/00-Init` | เตรียม project context และ sync workspace | `/00-Init` |
| `/01-App-Builder` | เริ่มสร้างแอปใหม่จากศูนย์ | `/01-App-Builder "Next.js CRM dashboard"` |
| `/02-Status` | ดูสถานะ project, task, agent bundle | `/02-Status` |
| `/10-Brainstorm` | คิดทางเลือกพร้อม tradeoff (บันทึกลง `.workspaces/research/`) | `/10-Brainstorm "membership system for restaurants"` |
| `/11-Research` | วิจัย codebase, architecture, pattern | `/11-Research "how auth currently works"` |
| `/12-PRD` | สร้าง PRD จาก idea | `/12-PRD "customer loyalty feature"` |
| `/13-UI-UX` | ออกแบบ UI/UX direction (บันทึกลง `.workspaces/reports/`) | `/13-UI-UX "mobile checkout flow"` |
| `/14-Orchestrate` | วางแผนงานซับซ้อนที่ต้องใช้หลายมุมมอง | `/14-Orchestrate "multi-service billing migration"` |
| `/15-Spec-Research` | ตรวจ API, SDK, library, integration ก่อนทำ spec | `/15-Spec-Research "Stripe subscription webhook"` |
| `/16-Competitor` | วิเคราะห์คู่แข่ง, pain point, market gap (บันทึกลง `.workspaces/research/`) | `/16-Competitor "AI project planning tools"` |
| `/17-Roadmap` | สร้าง/ปรับ roadmap artifacts | `/17-Roadmap "refresh roadmap from current project state"` |
| `/18-Spec-Orchestrate` | ประสาน PRD, research, competitor (บันทึกลง `.workspaces/reports/`) | `/18-Spec-Orchestrate "new onboarding module"` |
| `/20-Debug` | วิเคราะห์ root cause ของปัญหา | `/20-Debug "login redirects forever"` |
| `/30-Task` | สร้าง task workspace และ artifacts | `/30-Task "Add password reset"` |
| `/31-Plan` | สร้าง implementation plan | `/31-Plan 007` |
| `/32-Code` | ลงมือทำทีละ subtask | `/32-Code 007` |
| `/33-Verify` | ตรวจคุณภาพและ QA gate | `/33-Verify 007` |
| `/34-Human` | approve, reject, feedback โดยมนุษย์ | `/34-Human Approve 007` |
| `/35-Followup` | เพิ่มงานต่อยอดใน task เดิมโดยไม่ลบ plan เดิม | `/35-Followup 007 "add CSV export"` |
| `/39-QA-Orchestrate` | ประสาน QA ซับซ้อนหลายมิติ (บันทึกลง `.workspaces/reports/`) | `/39-QA-Orchestrate 007` |
| `/40-Test` | สร้าง/รัน test (บันทึกลง `.workspaces/reports/`) | `/40-Test 007` |
| `/41-Simplify` | refactor ลดความซับซ้อน (บันทึกลง `.workspaces/reports/`) | `/41-Simplify "src/auth"` |
| `/42-Preview` | เปิด/ตรวจ preview server | `/42-Preview start` |
| `/50-Commit` | stage และเขียน commit | `/50-Commit "task 007 only"` |
| `/51-PR` | สร้าง pull request | `/51-PR main` |
| `/52-Deploy` | deploy พร้อม preflight check (บันทึกลง `.workspaces/reports/`) | `/52-Deploy staging` |
| `/53-Changelog` | อัปเดต changelog | `/53-Changelog` |
| `/54-Insight` | สกัดบทเรียน, pattern, gotcha | `/54-Insight 007` |
| `/55-PR-Review` | review PR หรือ local diff | `/55-PR-Review "PR #123"` |
| `/56-PR-Followup` | แปลง PR comments เป็น fixes (บันทึกลง `.workspaces/reports/`) | `/56-PR-Followup "PR #123 comments"` |
| `/57-Issue-Triage` | triage GitHub issue, duplicate, spam (บันทึกลง `.workspaces/issues/`) | `/57-Issue-Triage "issue #456"` |
| `/58-Merge` | ผสาน feature branch และทำความสะอาด | `/58-Merge` |
| `/59-Wiki` | compile framework/project knowledge wiki | `/59-Wiki project ingest .workspaces/specs/007-feature` |
| `/60-Graphify` | สร้าง knowledge graph จาก folder | `/60-Graphify .agent/workflows` |
| `/90-Agent` | เรียก specialist agent | `/90-Agent code-reviewer .workspaces/specs/007` |
| `/99-Help` | ถามทาง, ขอคำแนะนำ, read-only guide | `/99-Help "ควรไป workflow ไหนต่อ"` |

## Basic SOP Paths

### 1. Start Or Refresh Project

ใช้เมื่อเริ่มใช้ framework ใน repo นี้หรือหลังเปลี่ยนโครงสร้าง project

```text
/00-Init
/02-Status
```

### 2. Goal-First Autonomous Flow

ใช้เมื่อมีคำสั่งระดับ goal แล้วอยากให้ระบบช่วยเลือก flow ที่เหมาะสมก่อนเริ่มทำงานจริง เช่น feature, PRD, brainstorm, หรือ debug

```text
/05-Goal "add password reset with email token and regression tests"
```

CLI สำหรับ Antigravity/Nexus-DevFlow:

```powershell
npm.cmd run goal -- goal "add password reset with email token and regression tests" max-turns 20 dry-run
```

ผลลัพธ์หลัก:

- เลือก flow เช่น `DevFlow Task Execution`, `PRD / Spec Flow`, `Brainstorm Flow`, หรือ `RCA / Debug Flow`
- แตกงานเป็น worker tasks พร้อม `parallel_group`
- บันทึก log ที่ `.workspaces/specs/goal-sessions/session-{goal_id}.json`
- อัปเดต `.workspaces/specs/goal_latest_session.json` และ `.workspaces/specs/goal_execution_log.json`
- แนะนำ command ถัดไป เช่น `/30-Task`, `/31-Plan`, `/32-Code`, `/33-Verify`

ตัวอย่างเมื่อ goal ถูก route ไป DevFlow:

```text
/05-Goal "add password reset with email token and regression tests"
/30-Task "Add password reset with email token and regression tests"
/31-Plan 007
/32-Code 007
/33-Verify 007
/34-Human Approve 007
```

ตัวอย่างเมื่อ goal เป็น bug/debug:

```text
/05-Goal "debug login redirect loop after session expires"
/20-Debug "debug login redirect loop after session expires"
/30-Task "Fix login redirect loop after session expires"
/31-Plan 008
/32-Code 008
/33-Verify 008
```

### 3. Small Feature Flow

เหมาะกับ feature ชัดเจน ขอบเขตไม่ใหญ่

```text
/30-Task "Add password reset"
/31-Plan 007
/32-Code 007
/33-Verify 007
/34-Human Approve 007
/53-Changelog
/50-Commit "task 007"
```

### 4. Full Feature Flow

เหมาะกับ feature ที่ยังต้องคิด product และ acceptance criteria

```text
/10-Brainstorm "self-service billing portal"
/12-PRD "self-service billing portal"
/30-Task "Build self-service billing portal"
/31-Plan 007
/32-Code 007
/33-Verify 007
/34-Human Approve 007
/54-Insight 007
/53-Changelog
/50-Commit "billing portal"
/51-PR main
```

### 5. Bug Fix Flow

เริ่มจาก root cause ก่อนสร้าง task

```text
/20-Debug "checkout fails after payment success"
/30-Task "Fix checkout success handling"
/31-Plan 008
/32-Code 008
/33-Verify 008
/34-Human Approve 008
/54-Insight 008
/50-Commit "fix checkout success handling"
```

### 6. Refactor Flow

ใช้เมื่อ behavior ต้องเหมือนเดิม แต่ code ต้องอ่านง่ายขึ้น

```text
/10-Research "current auth module boundaries"
/41-Simplify "src/auth"
/33-Verify
/34-Human Approve 009
/54-Insight 009
/50-Commit "simplify auth module"
```

### 7. Test Improvement Flow

ใช้เมื่ออยากเพิ่ม test coverage หรือปิด regression risk

```text
/11-Research "existing test patterns for auth"
/40-Test "src/auth"
/33-Verify
/50-Commit "add auth tests"
```

## Advanced SOP Paths

### 8. Integration-Heavy Feature Flow

ใช้เมื่อมี external API, SDK, database, OAuth, payment, webhook

```text
/15-Spec-Research "Stripe subscription webhook and customer portal"
/12-PRD "subscription billing"
/30-Task "Implement subscription billing"
/31-Plan 010
/32-Code 010
/39-QA-Orchestrate 010
/33-Verify 010
/34-Human Approve 010
/54-Insight 010
```

### 9. Product Strategy And Roadmap Flow

ใช้เมื่ออยากรู้ว่าจะทำอะไรต่อ ไม่ใช่แค่ implement task เดียว

```text
/10-Brainstorm "next quarter product bets"
/16-Competitor "AI coding workflow tools"
/17-Roadmap "refresh roadmap from competitor findings and current project state"
/12-PRD "top priority roadmap item"
/30-Task "Implement top priority roadmap item"
```

### 10. Broad Spec Orchestration Flow

ใช้เมื่อ idea ใหญ่เกินกว่าจะเริ่มที่ `/30-Task` ทันที

```text
/18-Spec-Orchestrate "multi-tenant analytics module"
/15-Spec-Research "analytics storage and query options"
/16-Competitor "analytics tools for small SaaS"
/12-PRD "multi-tenant analytics module"
/30-Task "Implement analytics MVP"
/31-Plan 011
```

### 11. Follow-Up Feature Flow

ใช้เมื่อ task เดิมเสร็จแล้ว แต่อยากต่อยอดโดยรักษา context เดิม

```text
/35-Followup 007 "add CSV export to the report screen"
/31-Plan 007
/32-Code 007
/33-Verify 007
/34-Human Approve 007
/54-Insight 007
```

สำคัญ: follow-up ต้อง extend plan เดิม ไม่ replace subtasks ที่ completed แล้ว

### 12. Complex QA Flow

ใช้เมื่อ QA ต้องแยกหลาย lane เช่น correctness, security, performance, UX, regression

```text
/39-QA-Orchestrate 012
/90-Agent code-reviewer .workspaces/specs/012
/90-Agent test-engineer .workspaces/specs/012
/33-Verify 012
/32-Code 012
/33-Verify 012
/34-Human Approve 012
```

### 13. PR Review And Fix Flow

ใช้เมื่อต้องทำ PR, รับ comment, แล้วแปลงเป็น fix task

```text
/50-Commit "task 012"
/51-PR main
/55-PR-Review "PR for task 012"
/56-PR-Followup "address PR review comments for task 012"
/32-Code 012
/33-Verify 012
```

### 14. GitHub Issue To PRP Task Flow

ใช้เมื่อเริ่มจาก GitHub issue ก่อน ยังไม่รู้ว่าเป็น bug, feature, duplicate หรือ noise

```text
/57-Issue-Triage "issue #456"
/20-Debug "root cause for issue #456"
/30-Task "Fix issue #456"
/31-Plan 456
/32-Code 456
/33-Verify 456
/50-Commit "fix issue 456"
/51-PR main
```

ถ้าเป็น feature request:

```text
/57-Issue-Triage "issue #789"
/12-PRD "feature request from issue #789"
/30-Task "Implement issue #789"
```

### 15. Release Flow

ใช้หลังงานผ่าน QA และ human approval

```text
/33-Verify 013
/34-Human Approve 013
/54-Insight 013
/53-Changelog
/50-Commit "release task 013"
/51-PR main
/52-Deploy staging
```

### 16. Knowledge And Insight Flow

ใช้เมื่อต้องการให้ระบบจำ pattern หรือบทเรียนสำหรับงานถัดไป

```text
/54-Insight 014
/53-Changelog
/99-Help "สรุปบทเรียนจาก task 014 และแนะนำ workflow ถัดไป"
```

### 17. New App Flow

ใช้เมื่อเริ่มแอปใหม่จากศูนย์

```text
/01-App-Builder "Next.js admin dashboard with auth"
/00-Init
/10-Brainstorm "dashboard modules"
/12-PRD "admin dashboard MVP"
/30-Task "Build admin dashboard MVP"
/31-Plan 015
/32-Code 015
/42-Preview start
/33-Verify 015
```

## Single Workflow Examples

### `/00-Init`

```text
/00-Init
```

ใช้เพื่อ sync project context และเตรียม `.workspaces`

### `/01-App-Builder`

```text
/01-App-Builder "Vite React app for internal task tracking"
```

ใช้เมื่อยังไม่มี app structure หรืออยาก scaffold project ใหม่

### `/02-Status`

```text
/02-Status
```

ใช้ดูสถานะ task และ agent bundle

### `/05-Goal`

```text
/05-Goal "implement API key rotation with audit log"
```

ใช้เป็น entry point แบบ goal-first สำหรับ Antigravity IDE เมื่อยังไม่แน่ใจว่าควรเริ่มที่ `/30-Task`, `/12-PRD`, `/10-Brainstorm`, หรือ `/20-Debug`

CLI equivalent:

```powershell
npm.cmd run goal -- goal "implement API key rotation with audit log" max-turns 20 parallel dry-run
```

Output artifacts:

- `.workspaces/specs/goal-sessions/session-{goal_id}.json`
- `.workspaces/specs/goal_latest_session.json`
- `.workspaces/specs/goal_execution_log.json`

ใช้ option หลัก:

- `goal "..."` ระบุ goal description
- `max-turns 30` กำหนด turn budget
- `parallel` เปิด parallel worker grouping ในแผน session
- `dry-run` สร้าง routing/session plan โดยไม่ถือว่าเริ่ม execute จริง
- `json` แสดง session JSON เต็มใน terminal

### `/10-Brainstorm`

```text
/10-Brainstorm "improve onboarding conversion"
```

ให้ AI เสนอหลายทางเลือกพร้อม tradeoff ก่อนตัดสินใจ

**กฎเกณฑ์และ Gotchas (Rules & Gotchas):**
- **ตรวจสอบแม่แบบ:** ต้องเช็กรูปแบบหัวข้อที่ระบุใน `.agent/resources/schemas/brainstorm.template.md` ก่อนวิเคราะห์
- **การบันทึกไฟล์รายงาน:** บังคับสร้างผลงานวิเคราะห์จริงลงที่ `.workspaces/research/brainstorm-{topic}.md`

### `/11-Research`

```text
/11-Research "where user permissions are checked"
```

ใช้วิจัย codebase และ pattern เดิม

### `/12-PRD`

```text
/12-PRD "team invitation feature"
```

แปลง idea เป็น product requirements

### `/13-UI-UX`

```text
/13-UI-UX "settings page for billing and team management"
```

ใช้วาง UX, layout, design direction

**กฎเกณฑ์และ Gotchas (Rules & Gotchas):**
- **ตรวจสอบแม่แบบ:** ต้องเช็กรูปแบบหัวข้อที่ระบุใน `.agent/resources/schemas/ui_ux.template.md` ก่อนออกแบบ
- **การบันทึกไฟล์รายงาน:** บังคับสร้างรายงานและโทเค็นความสวยงามลงที่ `.workspaces/reports/ui-ux-{topic}.md`

### `/14-Orchestrate`

```text
/14-Orchestrate "migrate auth, billing, and permissions together"
```

ใช้เมื่องานต้องประสานหลายมุมมอง

### `/15-Spec-Research`

```text
/15-Spec-Research "OpenAI Responses API streaming and tool calling"
```

ใช้ตรวจ external integration ก่อนเขียน plan

### `/16-Competitor`

```text
/16-Competitor "developer workflow automation tools"
```

ใช้วิเคราะห์คู่แข่งและ market gap

**กฎเกณฑ์และ Gotchas (Rules & Gotchas):**
- **ตรวจสอบแม่แบบ:** ต้องเช็กรูปแบบหัวข้อที่ระบุใน `.agent/resources/schemas/competitor_analysis.template.md` ก่อนค้นคว้า
- **การบันทึกไฟล์รายงาน:** บังคับสร้างรายงานเปรียบเทียบตลาดลงที่ `.workspaces/research/{date}-{slug}-competitor-analysis.md`

### `/17-Roadmap`

```text
/17-Roadmap "prioritize next 3 roadmap phases"
```

ใช้ปรับ `.workspaces/roadmap` และ `ROADMAP.md`

### `/18-Spec-Orchestrate`

```text
/18-Spec-Orchestrate "build a full customer support module"
```

ใช้จัดลำดับ PRD, research, competitor, task creation สำหรับ idea ใหญ่

**กฎเกณฑ์และ Gotchas (Rules & Gotchas):**
- **ตรวจสอบแม่แบบ:** ต้องเช็กรูปแบบหัวข้อที่ระบุใน `.agent/resources/schemas/spec_orchestration.template.md` ก่อนประกอบสเปก
- **การบันทึกไฟล์รายงาน:** บังคับสร้างรายงานวิพากษ์สเปกลงที่ `.workspaces/reports/spec_orchestration-{slug}.md`

### `/20-Debug`

```text
/20-Debug "API returns 200 but frontend shows empty data"
```

ใช้หา root cause

This workflow applies `9arm-skills/debug-mantra`: reproduce first, trace the actual fail path, falsify hypotheses, and cross-reference breadcrumbs before proposing a fix. The RCA report format remains the Nexus template under `.workspaces/debug/`.

### `/30-Task`

```text
/30-Task "Add email verification"
```

สร้าง task workspace และ JSON artifacts

### `/31-Plan`

```text
/31-Plan 016
```

สร้าง implementation plan จาก task artifacts

### `/32-Code`

```text
/32-Code 016
```

ทำงานทีละ subtask และ update status ผ่าน script

### `/33-Verify`

```text
/33-Verify 016
```

ตรวจคุณภาพ, validation, QA report

### `/34-Human`

```text
/34-Human Feedback 016 "Please add empty-state handling"
```

ใช้ approve, reject, review, feedback

### `/35-Followup`

```text
/35-Followup 016 "Add admin audit log after email verification"
```

เพิ่ม phase/subtask ต่อจาก plan เดิม

### `/39-QA-Orchestrate`

```text
/39-QA-Orchestrate 016
```

แตก QA เป็นหลาย lane และ route ไป specialist ที่เหมาะสม

**กฎเกณฑ์และ Gotchas (Rules & Gotchas):**
- **ตรวจสอบแม่แบบ:** ต้องเช็กรูปแบบหัวข้อที่ระบุใน `.agent/resources/schemas/qa_orchestration.template.md` ก่อนแตกเลนทดสอบ
- **การบันทึกไฟล์รายงาน:** บังคับสร้างแผนผังตรวจสอบลงที่ `.workspaces/reports/qa_orchestrate_{ID}.md`

### `/40-Test`

```text
/40-Test "src/features/invitations"
```

สร้างหรือรัน test

**กฎเกณฑ์และ Gotchas (Rules & Gotchas):**
- **ตรวจสอบแม่แบบ:** ต้องเช็กรูปแบบหัวข้อที่ระบุใน `.agent/resources/schemas/test_report.template.md` ก่อนดำเนินการเขียนหรือวิเคราะห์ผล
- **การบันทึกไฟล์รายงาน:** บังคับสร้างรายงานและ Coverage ลงที่ `.workspaces/reports/test_report_{target}.md`

### `/41-Simplify`

```text
/41-Simplify "src/features/invitations"
```

refactor ให้เรียบง่ายขึ้นโดยไม่เปลี่ยน behavior

**กฎเกณฑ์และ Gotchas (Rules & Gotchas):**
- **ตรวจสอบแม่แบบ:** ต้องเช็กรูปแบบหัวข้อที่ระบุใน `.agent/resources/schemas/refactoring.template.md` ก่อนปรับแก้โค้ด
- **การบันทึกไฟล์รายงาน:** บังคับสร้างผลเปรียบเทียบก่อน-หลัง (Diff/Transformation) ลงที่ `.workspaces/reports/refactoring_{slug}.md`

### `/42-Preview`

```text
/42-Preview start
/42-Preview status
/42-Preview stop
```

จัดการ preview server

### `/50-Commit`

```text
/50-Commit "task 016 only"
```

stage และ commit อย่างระวัง

### `/51-PR`

```text
/51-PR main
```

สร้าง PR จาก branch ปัจจุบัน

### `/52-Deploy`

```text
/52-Deploy staging
```

deploy พร้อม preflight และ verification

**กฎเกณฑ์และ Gotchas (Rules & Gotchas):**
- **ตรวจสอบแม่แบบ:** ต้องเช็กรูปแบบหัวข้อที่ระบุใน `.agent/resources/schemas/deploy_report.template.md` ก่อนปล่อยระบบ
- **การบันทึกไฟล์รายงาน:** บังคับสร้างรายงานความเรียบร้อยลงที่ `.workspaces/reports/deploy_report_{timestamp}.md`

### `/53-Changelog`

```text
/53-Changelog
```

อัปเดต changelog จาก task artifacts และ git history

### `/54-Insight`

```text
/54-Insight 016
```

สกัด lesson, pattern, gotcha จากงานที่ทำ

For bug, regression, or incident work, this workflow can apply `9arm-skills/post-mortem` after the fix has validation evidence.

### `/55-PR-Review`

```text
/55-PR-Review "PR #123"
```

ใช้ GitHub PR prompt addons เพื่อรีวิวโค้ด

This workflow applies `9arm-skills/scrutinize` as an outsider review lens: intent check, smaller alternative, actual path trace, then findings first.

### `/56-PR-Followup`

```text
/56-PR-Followup "PR #123 unresolved comments"
```

ใช้แยก comment เพื่อแปลงเป็น Fixes ใน Workspace

**กฎเกณฑ์และ Gotchas (Rules & Gotchas):**
- **ตรวจสอบแม่แบบ:** ต้องเช็กรูปแบบหัวข้อที่ระบุใน `.agent/resources/schemas/pr_followup.template.md` ก่อนเริ่มจัดประเภทคอมเมนต์
- **การบันทึกไฟล์รายงาน:** บังคับสร้างแผนสรุปงานแก้ไขแยกประเด็นลงที่ `.workspaces/reports/pr_followup_{ID}.md`

### `/57-Issue-Triage`

```text
/57-Issue-Triage "issue #456"
```

ใช้ GitHub issue prompt เพื่อคัดกรองจัดกลุ่มความสำคัญ

**กฎเกณฑ์และ Gotchas (Rules & Gotchas):**
- **ตรวจสอบแม่แบบ:** ต้องเช็กรูปแบบหัวข้อที่ระบุใน `.agent/resources/schemas/triage.template.md` ก่อนเริ่มประเมิน
- **การบันทึกไฟล์รายงาน:** บังคับสร้างผลประเมินอาการและช่องโหว่ความเสี่ยงลงที่ `.workspaces/issues/triage_{issue_number}.md`

### `/58-Merge`

```text
/58-Merge
```

ผสาน feature branch และทำความสะอาด

### `/60-Graphify`

```text
/60-Graphify docs
```

สร้าง knowledge graph จาก folder

### `/90-Agent`

```text
/90-Agent code-reviewer .workspaces/specs/016
```

เรียก specialist agent แบบ manual

### `/99-Help`

```text
/99-Help "งานนี้ควรเริ่มด้วย workflow ไหน"
```

ถามทางแบบ read-only

When asked for stakeholder-facing wording, Help applies `9arm-skills/management-talk` while staying read-only.

## Common Decision Guide

| Situation | Use |
| :--- | :--- |
| มี goal กว้าง ๆ และอยากให้ระบบเลือก flow ให้ก่อน | `/05-Goal` |
| ยังไม่รู้ว่าจะทำอะไรดี | `/10-Brainstorm` |
| idea ใหญ่และยังไม่ชัด | `/18-Spec-Orchestrate` |
| ต้องเช็ก SDK/API ก่อน | `/15-Spec-Research` |
| ต้องดูคู่แข่งหรือ market gap | `/16-Competitor` |
| ต้องจัด roadmap | `/17-Roadmap` |
| พร้อมสร้างงานแล้ว | `/30-Task` |
| มี task แล้วแต่ยังไม่มีแผน | `/31-Plan` |
| มี plan แล้วพร้อมทำ | `/32-Code` |
| ทำเสร็จแล้วต้องตรวจ | `/33-Verify` |
| QA ซับซ้อน | `/39-QA-Orchestrate` |
| อยากต่อยอด task เดิม | `/35-Followup` |
| อยากเก็บบทเรียน | `/54-Insight` |
| ต้อง review PR | `/55-PR-Review` |
| ต้องแก้ PR comments | `/56-PR-Followup` |
| ต้อง triage GitHub issue | `/57-Issue-Triage` |
| ต้องผสานสาขา (Merge Branch) | `/58-Merge` |
| ไม่แน่ใจ | `/99-Help` |

## Workspace Folder Map

| Folder | เก็บอะไร | Flow ที่เกี่ยวข้อง |
| :--- | :--- | :--- |
| `.workspaces/specs/` | task workspace และ JSON artifacts | `/30-Task`, `/31-Plan`, `/32-Code`, `/33-Verify`, `/34-Human`, `/35-Followup` |
| `.workspaces/research/` | research reports และ integration/brainstorm notes | `/11-Research`, `/15-Spec-Research`, `/16-Competitor`, `/10-Brainstorm` |
| `.workspaces/prds/` | PRD ก่อนแตกเป็น task | `/12-PRD`, `/18-Spec-Orchestrate` |
| `.workspaces/roadmap/` | roadmap discovery และ feature priorities | `/17-Roadmap` |
| `.workspaces/issues/` | issue triage, duplicate/spam decisions | `/57-Issue-Triage` |
| `.workspaces/debug/` | RCA/debug reports | `/20-Debug` |
| `.workspaces/reports/` | specialist, QA, design, test, refactor reports | `/13-UI-UX`, `/14-Orchestrate`, `/18-Spec-Orchestrate`, `/39-QA-Orchestrate`, `/40-Test`, `/41-Simplify`, `/52-Deploy`, `/55-PR-Review`, `/56-PR-Followup`, `/90-Agent` |
| `.workspaces/lessons.md` | lessons, gotchas, reusable patterns | `/20-Debug`, `/34-Human`, `/54-Insight`, `/99-Help` |

ถ้า folder ว่างแต่เป็นรายการในตารางนี้ ให้เก็บไว้ เพราะเป็น staging area ของ workflow นั้น ๆ

## Artifact And Validation Rules

หลังแก้ JSON ทุกครั้งควร validate:

```powershell
npm.cmd run agent -- validate {ID}
```

ถ้า JSON เสีย:

```powershell
npm.cmd run agent -- repair {ID}
npm.cmd run agent -- validate {ID}
```

สำหรับ plan:

```powershell
npm.cmd run agent -- plan:validate {ID}
```

สำหรับ roadmap:

```powershell
npm.cmd run roadmap:validate
```

ก่อนส่งงานหรือ commit:

```powershell
npm.cmd run validate
node .agent\scripts\test-prp.mjs
node .agent\scripts\test-goal-runner.mjs
```

Goal session files:

- `.workspaces/specs/goal-sessions/session-{goal_id}.json` stores each `/05-Goal` run.
- `.workspaces/specs/goal_latest_session.json` stores the latest session copy.
- `.workspaces/specs/goal_execution_log.json` stores the latest execution log contract.

## Recommended Operating Style

0. ใช้ `/05-Goal` เมื่อมีเป้าหมายกว้าง ๆ และอยากให้ระบบ route ไป flow ที่เหมาะสมพร้อมบันทึก session log

1. ใช้ `/99-Help` ถ้าไม่แน่ใจว่าจะไปทางไหน
2. อย่าข้าม `/31-Plan` ถ้างานมีมากกว่า 1-2 จุด
3. ใช้ `/15-Spec-Research` ก่อนแตะ integration ที่ไม่แน่ใจ
4. ใช้ `/35-Followup` แทนการแก้ plan เดิมทับ เมื่อเป็นงานต่อยอด
5. ใช้ `/54-Insight` หลังงานยาก เพื่อให้ session ถัดไปฉลาดขึ้น
6. ใช้ `npm.cmd run validate` เป็น checkpoint สม่ำเสมอ
