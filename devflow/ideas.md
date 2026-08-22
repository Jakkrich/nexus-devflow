# 💡 DevFlow Idea Inbox & Backlog

บันทึกไอเดียที่รอดำเนินการ พร้อมบทวิเคราะห์ความเป็นไปได้เบื้องต้นจาก AI (บันทึกด้วยคำสั่ง `/idea "<text>"`)

---

## 📌 Pending Ideas

### [IDEA-001] ขยาย Subcommands สำหรับ CLI (`idea`, `findings`, `doctor --fix`, `archive`)
- **บันทึกเมื่อ**: 2026-08-20
- **ไอเดียตั้งต้น**: เพิ่ม Subcommands ให้กับ CLI Engine เพื่อให้จัดการไอเดีย, ดู/แก้ Findings blockers, ทำ Auto-healing context, และจัดเก็บประวัติ (Archive) ผ่าน Terminal ได้โดยตรง
- **AI Feasibility & Tech**: **ง่ายถึงปานกลาง (High Feasibility)** — สามารถต่อยอดจากโมดูลที่มีอยู่แล้วใน `packages/create-nexus-devflow/lib/` (`findings.ts`, `status.ts`) และเพิ่มฟังก์ชันจัดการไฟล์ `devflow/ideas.md` กับ `devflow/history/`
- **Value & Potential**: **สูงมาก** — เพิ่มความคล่องตัวให้นักพัฒนาสามารถจัดการ Inbox, ตรวจ Blockers และสั่ง Auto-fix context ได้ทันทีโดยไม่ต้องเปิด Session คุยกับ AI
- **Quick Seed (กันลืม)**:
  1. `nexus-devflow idea add "<text>"` และ `nexus-devflow ideas list`
  2. `nexus-devflow findings --blockers` และ `nexus-devflow findings resolve <ID>`
  3. `nexus-devflow doctor --fix` ช่วยสร้าง Context Files และ Sync Adapters ที่หายไป
  4. `nexus-devflow archive` ย้าย Runs ที่ Release แล้วไป `devflow/history/archived-runs/`
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-001` หรือ `/00-discover IDEA-001`)

---

### [IDEA-002] CI/CD Quality Gatekeeper & Git Pre-commit Hooks (`devflow check-gate`)
- **บันทึกเมื่อ**: 2026-08-20
- **ไอเดียตั้งต้น**: สร้างระบบตรวจจับใน GitHub Actions PR และ Local Pre-commit เพื่อบล็อกการ Merge หรือ Commit หากยังมี P0/P1 Findings หรือ Checklist ยังไม่เสร็จ
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — ใช้ความสามารถของ `nexus-devflow status --json` ร่วมกับ `jq` หรือสร้าง subcommand `check-gate` ที่ return exit code `1` เมื่อ `completion.state == "blocked"`
- **Value & Potential**: **สูงมาก (Enterprise Governance)** — รับประกันว่าทีมงานจะไม่สามารถ Merge โค้ดที่มีข้อผิดพลาดร้ายแรงหรือข้ามขั้นตอน QA Gate เข้าสู่ Branch หลักได้
- **Quick Seed (กันลืม)**:
  1. เพิ่มคำสั่ง `nexus-devflow check-gate` ที่อ่าน JSON Status และคืนค่า Exit Code 0 หรือ 1
  2. สร้าง GitHub Actions Action / Reusable Workflow สำหรับตรวจ PR
  3. เตรียมสคริปต์ติดตั้ง Git Hook (เช่น `husky` หรือ `.git/hooks/pre-commit`)
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-002` หรือ `/00-discover IDEA-002`)

---

### [IDEA-003] Interactive Terminal UI (TUI) Dashboard (Ink / Clack)
- **บันทึกเมื่อ**: 2026-08-20
- **ไอเดียตั้งต้น**: สร้างแดชบอร์ดอินเตอร์แอคทีฟบน Terminal แบบ Rich UI สำหรับแสดงสถานะงาน Living Spec, รายการ Checklists, Findings และคำแนะนำ Next Action
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — ใช้ไลบรารี CLI UI เช่น `@clack/prompts` หรือ `ink` (React for CLI) ในการเรนเดอร์ Interface แบบ Interactive
- **Value & Potential**: **สูง (Premium DX)** — สร้างความประทับใจระดับ Wow ให้กับผู้ใช้ สามารถใช้คีย์บอร์ดเลื่อนดู Task, ติ๊ก Checklist และกดคัดลอกคำสั่ง AI เข้า Clipboard ได้ทันที
- **Quick Seed (กันลืม)**:
  1. แถบ Navigation ด้านบน: `[Status] [Tasks] [Findings] [Next Action]`
  2. หน้า Tasks แสดง Checkbox ที่กดติ๊ก Spacebar ได้จริงเพื่ออัปเดตไฟล์ Markdown
  3. ปรับแต่ง Theme ให้เข้ากับ Dark Mode และแสดงผลผ่าน ANSI 256 Colors
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-003` หรือ `/00-discover IDEA-003`)

---

### [IDEA-004] DevFlow MCP Server (Model Context Protocol) & Multi-Agent API
- **บันทึกเมื่อ**: 2026-08-20
- **ไอเดียตั้งต้น**: ยกระดับ CLI ให้สามารถรันเป็น MCP Server (Model Context Protocol) เพื่อให้ AI Agents (Antigravity, Claude, Cursor, Codex) เรียกใช้ Tools ควบคุม DevFlow ได้โดยตรง
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — ใช้ `@modelcontextprotocol/sdk` ของ Anthropic ในการเปิด JSON-RPC Server ผ่าน Stdio
- **Value & Potential**: **สูงสุด (Next-Gen AI Integration)** — AI ไม่ต้องใช้ Regex คอยสแกนหรือแก้ Markdown เอง แต่สามารถเรียก Tools เช่น `devflow_add_finding`, `devflow_update_task`, `devflow_get_status` ได้แบบ 100% Type-safe
- **Quick Seed (กันลืม)**:
  1. สร้าง Subcommand `nexus-devflow mcp` สำหรับรันเป็น MCP Server
  2. กำหนด MCP Tools: `get_status`, `add_idea`, `update_task`, `record_finding`
  3. เพิ่มไฟล์คอนฟิก `mcp_config.json` ให้ติดตั้งเข้า Antigravity/Claude ได้ในคลิกเดียว
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-004` หรือ `/00-discover IDEA-004`)

---

### [IDEA-005] ระบบ Internal State (`devflow/.state/`) สำหรับจัดการ Version Manifest, File Hashes & Safe Update Backups
- **บันทึกเมื่อ**: 2026-08-21
- **ไอเดียตั้งต้น**: เพิ่มการทำงานของ `.state/` แบบ blueprint โฟลเดอร์ภายในสำหรับบันทึก metadata, version, tool adapters, file checksums ใน manifest.json เพื่อรองรับคำสั่งอัปเดต พร้อมระบบ auto-backup ไฟล์ที่เกิด conflict ลงใน `devflow/.state/backups/` (ถูก `.gitignore`)
- **AI Feasibility & Tech**: **ง่ายถึงปานกลาง (High Feasibility)** — ใช้ Node.js built-in `crypto` (`createHash('sha256')`) ในการคำนวณ Checksum ของ workflow/skill/context files ร่วมกับ FS utilities ใน `packages/create-nexus-devflow` เพื่อรองรับคำสั่งอัปเดตเวอร์ชัน (`nexus-devflow update` / CLI updater) ตรวจจับ conflict และสร้าง backup อัตโนมัติ
- **Value & Potential**: **สูงมาก (Enterprise-grade Lifecycle & Maintainability)** — ป้องกันปัญหาไฟล์ workflow โดนเขียนทับโดยไม่ตั้งใจเมื่ออัปเกรดเวอร์ชันใหม่ รองรับการตรวจจับความเปลี่ยนแปลงของผู้ใช้ และช่วยให้การอัปเดต DevFlow ในโปรเจกต์ปลายทางเป็นไปอย่างปลอดภัย 100%
- **Quick Seed (กันลืม)**:
  1. สร้างโครงสร้าง `devflow/.state/manifest.json` เก็บ `version`, `installedAt`, `adapters` (antigravity, codex, claude), และ `fileHashes` (SHA-256)
  2. สร้าง `devflow/.state/.gitignore` เพื่อละเว้นโฟลเดอร์ `backups/` ไม่ให้ commit เข้า Git
  3. พัฒนาระบบ Update & Conflict Resolver ใน CLI: ตรวจสอบ hash ปัจจุบันเทียบกับ hash ใน manifest หากผู้ใช้แก้ไขไฟล์เดิม ให้ทำสำเนาลง `backups/<timestamp>-<filename>` ก่อนผสานหรือแจ้งเตือน
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-005` หรือ `/00-discover IDEA-005`)

---

### [IDEA-007] Support Two User-Owned Planning Documents (`project-plan.md` & `build-plan.md`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: รองรับระบบวางแผนระยะยาวล่วงหน้าด้วย `project-plan.md` และ `build-plan.md` พร้อมคิวฟีเจอร์ย่อย เพื่อวางแผนโครงการขนาดใหญ่แบบ Long-term Roadmap
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — สร้างโครงสร้างไฟล์ใน `devflow/` และปรับให้ `/overview` สามารถอ่าน/เขียนรวบรวมแผนงานลงใน `project-overview.md` ได้
- **Value & Potential**: **สูง** — ตอบโจทย์โครงการขนาดใหญ่ที่ต้องการกำหนดขอบเขตและแผนสร้างล่วงหน้าหลายๆ ฟีเจอร์
- **Quick Seed (กันลืม)**:
  1. สร้างเทมเพลต `devflow/project-plan.md` สำหรับภาพรวมสถาปัตยกรรม
  2. สร้างเทมเพลต `devflow/build-plan.md` สำหรับแสดงคิวฟีเจอร์แบบ Checkbox
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-007` หรือ `/00-discover IDEA-007`)

---

### [IDEA-008] Dedicated Code & Security Audit Skill (`/audit` with Durable Ledger)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: สร้างคำสั่ง `/audit` สำหรับสแกนตรวจสอบคุณภาพโค้ด, ความปลอดภัย (Security), ประสิทธิภาพ (Performance), และ Dead Code โดยบันทึกรายการข้อผิดพลาดลง `devflow/context/findings.md`
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — สร้าง Skill `/audit` ที่สามารถรับ Flag เลนส์ที่ต้องการตรวจ (เช่น Quality, Security, Tests) และมีระบบบล็อกการปิดงาน หากมีข้อผิดพลาดระดับ P0/P1
- **Value & Potential**: **สูงมาก (Enterprise Quality Control)** — ช่วยเพิ่ม Governance และการควบคุมคุณภาพโค้ดอย่างเข็มงวดก่อนทำ Release
- **Quick Seed (กันลืม)**:
  1. สร้าง `.agents/skills/audit/SKILL.md` และ `.claude/skills/audit/SKILL.md`
  2. กำหนดโครงสร้างบันทึก Findings ด้วย Durable ID (เช่น `AUDIT-001`) ใน `findings.md`
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-008` หรือ `/00-discover IDEA-008`)

---

### [IDEA-009] Guided Discovery Interview Skill (`/discovery`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: พัฒนาทักษะ `/discovery` สำหรับทำบทสนทนาสัมภาษณ์แบบหลายรอบ (Multi-turn Deep Interview) ช่วยผู้ใช้คิดและตกผลึกความต้องการตั้งแต่ก่อนเริ่มเขียนโค้ด
- **AI Feasibility & Tech**: **ง่ายถึงปานกลาง (High Feasibility)** — พัฒนา Skill สัมภาษณ์เชิงรุกที่ค่อยๆ ถามทีละประเด็น สรุปความต้องการ แล้วร่างเป็นแผนงาน
- **Value & Potential**: **สูง** — เหมาะสำหรับผู้ใช้ที่เริ่มต้นไอเดียใหม่จากศูนย์ และยังไม่มีแผนงานชัดเจน
- **Quick Seed (กันลืม)**:
  1. สัมภาษณ์เชิงลึกทีละด้าน: เป้าหมาย, ฟีเจอร์หลัก, ข้อจำกัดทางเทคนิค
  2. ร่างสรุปและขออนุมัติจากผู้ใช้ก่อนเขียนลงไฟล์แผนงาน
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-009` หรือ `/00-discover IDEA-009`)

---

### [IDEA-010] Cloud Deployment Readiness & Config Generator Skill (`/release:cloud`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: สร้าง Skill สำหรับตรวจเช็กความพร้อมในการ Deploy บน Render / Vercel พร้อมสร้างไฟล์ `render.yaml` หรือ `vercel.json` ให้อัตโนมัติ
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — ตรวจสอบค่า Environment variables, Build command, Start command และเจนเนอเรตคอนฟิก
- **Value & Potential**: **ปานกลางถึงสูง** — ช่วยให้การต่อยอดนำแอปพลิเคชันขึ้น Cloud Production ทำได้อย่างสะดวกรวดเร็ว
- **Quick Seed (กันลืม)**:
  1. ตรวจสอบการตั้งค่า Build script และ Port
  2. ร่างและสร้าง `render.yaml` / `vercel.json` ตาม Cloud Provider ที่ผู้ใช้เลือก
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-010` หรือ `/00-discover IDEA-010`)

---

### [IDEA-011] Feature Briefing Skill จากแผนงาน (`/brief`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: ปรับปรุงคำสั่ง `/brief` ให้สามารถสแกนและประเมินฟีเจอร์ใน `ideas.md` หรือแผนงานล่วงหน้า โดยประเมินขนาดงาน, Dependencies, และไฟล์ที่ต้องแก้ไข ก่อนเริ่มทำ Spec
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — ปรับเพิ่มความสามารถในการอ่านและสรุปคิวไอเดีย
- **Value & Potential**: **ปานกลาง** — ช่วยให้ผู้ใช้เข้าใจภาพรวมของงานถัดไปก่อนกดรัน `/feature`
- **Quick Seed (กันลืม)**:
  1. อ่านคิวไอเดียหรือแผนงานย่อย
  2. ประเมินไฟล์ที่จะได้รับผลกระทบและขนาดความซับซ้อน
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-011` หรือ `/00-discover IDEA-011`)

---

### [IDEA-012] Sub-Feature Automatic Splitting Engine (4a, 4b, 4c)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: ระบบแบ่งฟีเจอร์ขนาดใหญ่ออกเป็นฟีเจอร์ย่อย (Sub-features) อัตโนมัติเมื่อขนาดงานเกินขีดจำกัด
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — เพิ่มตรรกะใน `/brief` และ `/feature` เพื่อตรวจเช็กขนาดงานและแตกเป็น `007a`, `007b` ให้อัตโนมัติ
- **Value & Potential**: **สูง** — ป้องกันไม่ให้ AI ทำงานในขอบเขตที่กว้างเกินไปในรันเดียว
- **Quick Seed (กันลืม)**:
  1. กำหนดเกณฑ์ประเมินขนาดงาน (เช่น เกิน 5 ไฟล์ หรือ 100+ บรรทัด)
  2. สับแบ่งเป็น sub-task เรียงตามลำดับความขึ้นตรงกัน (Dependencies)
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-012` หรือ `/00-discover IDEA-012`)

---

### [IDEA-013] Dynamic Project Overview Compiler (`/overview`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: พัฒนาคำสั่ง `/overview` ให้ทำหน้าที่รวบรวมและซิงก์ข้อมูลจากไอเดีย, เอกสารอ้างอิง, และบริบทโครงการ มาอัปเดตใส่ `devflow/context/project-overview.md` อัตโนมัติ
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — สร้างสคริปต์ซิงก์ข้อมูลภาพรวมโครงการ
- **Value & Potential**: **ปานกลาง** — ช่วยรักษาความสดใหม่ของ `project-overview.md` เมื่อมีการเปลี่ยนแปลงสถาปัตยกรรม
- **Quick Seed (กันลืม)**:
  1. สแกนไฟล์บริบทและบันทึกสรุปความเปลี่ยนแปลง
  2. รักษาสครงสร้าง Single Source of Truth
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-013` หรือ `/00-discover IDEA-013`)

---

### [IDEA-014] Standalone `/status` Skill for AI Chat Context
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: สร้าง Skill `/status` ในรูปแบบ Markdown สำหรับ AI Agent ในแชตโดยเฉพาะ เพื่ออ่านสรุปความก้าวหน้า ตรวจสอบ Drift และแนะนำ Next Action
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — พัฒนา `.agents/skills/status/SKILL.md` และ `.claude/skills/status/SKILL.md`
- **Value & Potential**: **ปานกลาง** — เพิ่มความสะดวกให้ผู้ใช้สั่งดูสถานะผ่านแชตโดยไม่ต้องสลับไปเทอร์มินัล
- **Quick Seed (กันลืม)**:
  1. อ่าน `current-feature.md` และ `current-stage.md`
  2. แสดงผลสรุปความก้าวหน้าสั้นๆ พร้อมคำแนะนำ
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-014` หรือ `/00-discover IDEA-014`)

---

### [IDEA-015] Configurable Artifact Language (`artifactLanguage: th | en`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: รองรับการสลับภาษาเริ่มต้นของเอกสารและบทสนทนาระหว่าง ภาษาไทย (`th`) และ ภาษาอังกฤษ (`en`) ผ่านคอนฟิก `nexus-devflow.json`
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — อ่านค่า `artifactLanguage` จาก `nexus-devflow.json` แล้วปรับ Directive ใน Skills
- **Value & Potential**: **สูง** — รองรับการใช้งานของทีมงานระดับสากลหรือทีมที่ต้องการเอกสารเป็นภาษาอังกฤษ
- **Quick Seed (กันลืม)**:
  1. เพิ่มฟิลด์ `artifactLanguage` ใน schema
  2. สลับเทมเพลตภาษาตามคอนฟิก
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-015` หรือ `/00-discover IDEA-015`)

---

### [IDEA-016] Strict HTML Report Generation Control Policy
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: นโยบายและคำสั่งควบคุมการสร้าง HTML Report เพื่อป้องกันไม่ให้สร้างไฟล์ `.html` ขยะใน Repo โดยให้สร้างเฉพาะเมื่อเรียก `/report:html`
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — เพิ่ม Directive ในการตรวจเช็กคำสั่งสร้างรายงาน
- **Value & Potential**: **ปานกลาง** — รักษาความสะอาดของ Git repository
- **Quick Seed (กันลืม)**:
  1. กำหนดกฎห้ามสร้าง HTML ในสเตจปกติ
  2. เรียกสร้างด้วยสคริปต์ standalone แยกต่างหาก
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-016` หรือ `/00-discover IDEA-016`)

---

### [IDEA-017] Automated AI Adapter Detection & Sync (`adapters: auto`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: ระบบตรวจจับ AI Client (Antigravity, Claude, Codex, Copilot) อัตโนมัติและคอยซิงก์โฟลเดอร์ `.agents/` หรือ `.claude/` ให้อัตโนมัติเมื่อสั่ง `update`
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — ตรวจจับการมีอยู่ของไฟล์คอนฟิก AI ในโฟลเดอร์ผู้ใช้
- **Value & Potential**: **สูง** — ทำให้ผู้ใช้ไม่ต้องระบุ `--adapter` เองทุกครั้งที่อัปเดต
- **Quick Seed (กันลืม)**:
  1. สแกนไฟล์ `.agents/`, `.claude/`, `AGENTS.md`, `CLAUDE.md`
  2. เลือก Adapter ให้อัตโนมัติเมื่อรัน CLI update
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-017` หรือ `/00-discover IDEA-017`)

---

### [IDEA-018] Multi-Stage Deep-Track Directory Structure (`devflow/context/current-run/`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: รองรับการแยกไฟล์บริบทรายสเตจสำหรับงานสถาปัตยกรรมใหญ่ เพื่อบันทึกประวัติการตัดสินใจแต่ละสเตจอย่างเป็นระบบ
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — เพิ่มระบบจัดการโฟลเดอร์ `current-run/`
- **Value & Potential**: **สูง** — เหมาะสำหรับงานที่มีความซับซ้อนสูงและต้องการบันทึก Traceability
- **Quick Seed (กันลืม)**:
  1. แยกโฟลเดอร์ `10-define.md`, `20-spec.md`...
  2. อัปเดตสเตจทีละขั้นตอนในรันใหญ่
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-018` หรือ `/00-discover IDEA-018`)

---

### [IDEA-019] Safe Scaffolding Overlay Guard System
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: ระบบป้องกันการเขียนทับเมื่อมีการใช้ Framework Scaffolder ร่วมกับ DevFlow
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — ปรับปรุง CLI `init` ให้สามารถติดตั้งทับโปรเจกต์ที่มีอยู่แล้วได้อย่างปลอดภัย
- **Value & Potential**: **สูง** — ลดความผิดพลาดเมื่อนำ DevFlow ไปใช้งานกับ Brownfield Project
- **Quick Seed (กันลืม)**:
  1. ตรวจสอบไฟล์ที่มีอยู่ก่อนลงทับ
  2. สร้างไฟล์สำรองอัตโนมัติหากมี conflict
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-019` หรือ `/00-discover IDEA-019`)

---

### [IDEA-020] Upstream AI-Blueprint Sync Engine (`upstream-ai-blueprint.json`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: ระบบติดตามและเปรียบเทียบ Commit ของ AI-Blueprint ต้นฉบับเพื่อนำฟีเจอร์ใหม่ๆ มาปรับใช้ใน DevFlow
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — พัฒนาสคริปต์เปรียบเทียบ Diff และอัปเดต `upstream-ai-blueprint.json`
- **Value & Potential**: **สูงมาก** — ช่วยให้ DevFlow ทันสมัยตามมาตรฐานสากลเสมอ
- **Quick Seed (กันลืม)**:
  1. อ่าน `lastReviewedCommit` จาก `upstream-ai-blueprint.json`
  2. เปรียบเทียบ Diff ของ Blueprint และแจ้งเตือนจุดที่สามารถพอร์ตเข้ามาได้
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-020` หรือ `/00-discover IDEA-020`)

---

### [IDEA-021] Single Active Run Lock & Concurrency Guardrail
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: ระบบล็อกไม่ให้เริ่มรันใหม่หากยังมีงานเก่าค้างอยู่ เพื่อป้องกันบริบทสับสน
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — ตรวจเช็กสถานะใน `current-feature.md` และ `current-stage.md`
- **Value & Potential**: **สูง** — ป้องกันความผิดพลาดของ AI ในการสลับงานไปมา
- **Quick Seed (กันลืม)**:
  1. เช็กสถานะก่อนสร้างรันใหม่
  2. แจ้งเตือนผู้ใช้ให้ทำ `/complete` รันเดิมก่อน
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-021` หรือ `/00-discover IDEA-021`)

---

### [IDEA-022] Universal Document Parser via Python Helper Integration
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: เพิ่มสคริปต์ Python ในการแปลงเอกสาร PDF, DOCX, XLSX เป็น Markdown ที่สมบูรณ์แบบ
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — รวมไลบรารี `pdfplumber`, `docx`, `openpyxl`
- **Value & Potential**: **สูง** — ขยายความสามารถในการอ่านบริบทธุรกิจจากเอกสารต่างๆ
- **Quick Seed (กันลืม)**:
  1. พัฒนา `convert_any_to_md.py`
  2. รองรับตารางและข้อความแบบหลายคอลัมน์
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-022` หรือ `/00-discover IDEA-022`)

---

### [IDEA-023] Lightweight Zero-Dependency Pure Markdown Mode
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: สร้างคำสั่งหรือสคริปต์สำหรับ Export DevFlow ออกเป็น Pure Markdown สำหรับโปรเจกต์ที่ไม่มี Node.js
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — สร้างไฟล์เทมเพลตบริสุทธิ์แบบไม่ต้องใช้ CLI
- **Value & Potential**: **ปานกลาง** — รองรับสภาพแวดล้อมการทำงานแบบปิโตรเลียม/งานเครื่องมือพื้นฐานที่ไม่มี Node.js
- **Quick Seed (กันลืม)**:
  1. สกัดเฉพาะสคิลและเอกสาร Markdown
  2. รองรับการทำงานแบบก๊อปปี้โฟลเดอร์วางใช้งาน
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-023` หรือ `/00-discover IDEA-023`)

---

### [IDEA-024] Automated Categorized History Ledger (`devflow/history/HISTORY.md`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: ระบบบันทึกประวัติการส่งมอบงานทั้งหมดลงในตารางสรุป `HISTORY.md` แยกตามประเภทงาน (Feature, Fix, Rollback)
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — อัปเดตคำสั่ง `/complete` ให้บันทึกบรรทัดใหม่ลงใน `HISTORY.md` อัตโนมัติ
- **Value & Potential**: **สูง** — ช่วยให้ติดตามประวัติการเปลี่ยนแปลงทั้งหมดของระบบได้อย่างรวดเร็ว
- **Quick Seed (กันลืม)**:
  1. บันทึก ID, วันที่, ชื่อฟีเจอร์, และ Git Commit Hash
  2. สรุปเป็นตารางย่อใน `devflow/history/HISTORY.md`
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-024` หรือ `/00-discover IDEA-024`)

---

---

## 📦 Archived / Shipped Ideas

- [x] **[IDEA-006]** อัปเดตเอกสารคู่มือและ Reference ให้ครอบคลุม DevFlow v2.0.20 (The 3-Pillars Model, Categorized History & Clean Living Spec) — *Claimed in `022-update-documentation-and-guides-for-v2-0-20` (2026-08-21)*


