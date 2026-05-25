# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-05-25

### Added
- **DevFlow Concept Intake Skill (`devflow-concept-intake`)**: ระบบสแกนและประเมิน Repository เบื้องต้น (`Concept Intake Skill`) ติดตั้งใน `.agent/skills/devflow-concept-intake/` ประกอบด้วยโครงสร้างข้อมูล `SKILL.md`, `openai.yaml` สำหรับ Agent และเทมเพลตมาตรฐานสำหรับการเสนอแนวทางการพัฒนาและการติดตาม upstream

### Changed
- **Standardized Markdown Metadata Contract**: ออกแบบสัญญาโครงสร้างเอกสาร (Markdown Metadata Contract) จัดเก็บที่ `docs/markdown-metadata-contract.md` เพื่อบังคับใช้อภิข้อมูล (YAML Frontmatter) และ Obsidian-compatible heading tags ในการรวบรวมและวิเคราะห์เอกสาร specs, plans, และ reports ในระบบ
- **README Refactoring & Asset Cleanups**: ปรับปรุงเนื้อหา `README.md` ให้ทันสมัย เพิ่มดัชนี Workflow Index และปรับโครงสร้างภาพประกอบ โดยลบไฟล์ `.png` เดิมที่ไม่ได้ใช้งานออกจาก `docs/` เพื่อกระชับขนาดของ repository

### Fixed
- **Adoption of MIT License**: เปลี่ยนแปลงเงื่อนไขสัญญาอนุญาต (License) ของระบบเป็นสัญญาอนุญาตแบบ MIT อย่างเป็นทางการ โดยเพิ่มไฟล์ `LICENSE` และปรับค่าใน `package.json`

### Removed
- ลบไฟล์ภาพประกอบการทำงานเดิม (`docs/dva_*.png`) ที่ล้าสมัยและไม่ได้ใช้งานออกจากระบบ

### Security
- ไม่มีประเด็นความปลอดภัยหรือช่องโหว่ใหม่จากการตรวจสอบระบบและสุขอนามัยของ repository

### Validation
- `npm run validate`
- `npm run validate:docs`
- `npm run sync:check`

## [1.3.0] - 2026-05-24

### Added
- **ระบบ DevFlow Wiki (`/59-Wiki`)**: นำเสนอระบบรวบรวมและสกัดองค์ความรู้ (Knowledge Compilation Engine) แบบ 2-Namespace (`framework` และ `project`) สำหรับจัดระเบียบสถาปัตยกรรม, แนวทางปฏิบัติการพัฒนา, ข้อควรระวัง (Gotchas), และการตัดสินใจเชิงโครงสร้างจาก source artifacts ใน workspace
- **Wiki CLI Automation Tools**: เพิ่มคำสั่งควบคุมคุณภาพและความปลอดภัยของเอกสารผ่าน CLI `prp wiki:init` และ `prp wiki:lint` ป้องกันข้อผิดพลาดของข้อมูลที่ไม่เสร็จสมบูรณ์ (TODO/TBD) หรือข้อมูลที่ขาดการอ้างอิงแหล่งที่มา (`## Sources`)
- **Lightweight Context & Token Telemetry**: ติดตั้งโครงสร้างบันทึกและวิเคราะห์ telemetry ของบริบท (`context_usage`) ในระบบสตรีมงาน `/05-Goal` เพื่อติดตาม token usage (input, output, cached) และ optimize การอ่านไฟล์

### Changed
- **Unified Workflow Inter-linking**: ปรับปรุงและอัปเกรดมาตรฐาน workflow สำคัญทั้งหมด 10 รายการในระบบเพื่อเพิ่มส่วน *Wiki Update Recommendation* สำหรับผสานความรู้กลับสู่ DevFlow Wiki
- **Standardized Recommendations Template**: กำหนดกรอบของระบบแนะนำลำดับงาน (Workflow Recommendation) ด้วยเทมเพลตมาตรฐานและระบบสคริปต์ทดสอบอัตโนมัติ

### Fixed
- **Workflow Semantic Consistency**: แก้ไขปัญหางานสแกนและจัดหมวดหมู่ข้อมูล session ให้มีความเสถียรยิ่งขึ้น รองรับการเชื่อมต่อ workflow ที่ซับซ้อนและการส่งต่อข้อมูลของ boss-worker agents

### Validation
- `node .agent/scripts/test-goal-runner.mjs`
- `node .agent/scripts/test-workflow-recommendations.mjs`
- `npm run agent -- wiki:lint project`
- `npm run agent -- wiki:lint framework`
- `npm run validate`

## [1.2.0] - 2026-05-23

### Added
- Added `npm run agent -- markdown:validate {path} {template_name}` to validate generated Markdown artifacts for required headings and unresolved template placeholders.
- Added Markdown quality gates across Nexus-DevFlow workflows that generate specs, research, PRDs, plans, QA reports, RCA reports, test reports, deploy reports, triage reports, PR review reports, lessons, and agent reports.
- Added regression coverage to ensure placeholder text in `spec.md` and generated reports is rejected by validation.
- Added the framework SemVer version to the Codex global install manifest and made `codex:check-global` compare installed versus current framework versions.
- Added separate setup guides for human installation (`SETUP.md`) and provider-neutral AI-assisted installation or upgrade (`SETUP-BY-AI.md`).

### Changed
- Updated task initialization in both Node and legacy Python PRP tools to create populated `spec.md` drafts from the task title and description instead of saving raw template placeholders.
- Updated `spec.template.md` and the agent output contract to require concrete task-specific content, explicit assumptions, or concrete questions instead of template scaffolding.
- Synced the framework and bundled `.agent` package versions to `1.2.0` so installer/check workflows can compare the installed release by SemVer.
- Reworked `SETUP.md` into a human-focused guide with a single copyable prompt for delegating installation to an AI assistant.

### Fixed
- Fixed the recurring issue where generated `spec.md` files could pass validation while still containing generic placeholder text such as `[What are we trying to achieve?]`, `Requirement 1`, or `Acceptance Criterion 1`.

### Validation
- `node .agent\scripts\test-prp.mjs`
- `python .agent\scripts\test_prp_tools.py`
- `npm run agent -- markdown:validate SETUP.md`
- `npm run agent -- markdown:validate SETUP-BY-AI.md`
- `npm run validate`

## [1.1.0] - 2026-05-19

### Added
- Established an Obsidian Vault at `docs/vault/` to serve as the Project Brain for long-term knowledge retention.
- Created AI Librarian boundaries via `docs/vault/VAULT_RULES.md` to prevent messy tag usage and arbitrary file deletions.
- Added `Timeline-Hub.md` to automatically track AI note modifications.

### Changed
- Updated `INITIAL.md` to require AI agents to read the Vault rules before interacting with project documentation.
