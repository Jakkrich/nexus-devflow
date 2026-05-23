# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
