# Changelog

All notable changes to **Nexus-DevFlow** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-08-17

### Added
- **NPX Overlay Installer**: Package `packages/create-nexus-devflow` (`@jakkrichm/create-nexus-devflow`) allowing instant installation or update via `npx @jakkrichm/create-nexus-devflow`.
- **Multi-Tool Adapter Layer**: Dual adapter architecture supporting Codex & Google Antigravity ([.agents/skills/](file:///.agents/skills/)) and Claude Code ([.claude/skills/](file:///.claude/skills/)).
- **Universal Source of Truth**: Unified `AGENTS.md` entry point and lightweight `CLAUDE.md` (`@AGENTS.md`).
- **DevFlow Framework Context**: Added `devflow/context/` (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`) and `devflow/reference/running-id-contract.md`.
- **Skill Routing Evaluation Suite**: Evaluation dataset in `evals/routing/` covering 127 skills with 98.62% Rank 1 accuracy.
- **Clean GitHub Templates**: Standardized `.github/` with YAML Issue Forms (`bug_report.yml`, `feature_request.yml`, `question.yml`, `config.yml`), PR template, and `CODEOWNERS` (no workflow jobs).

### Changed
- Migrated all legacy `.agent/workflows/` and `.agent/skills/` into standard `.agents/skills/<skill>/SKILL.md` format.
- Consolidated goal runner and maintenance scripts under `scripts/`.

### Removed
- Completely removed legacy `.agent/` folder in favor of clean `.agents/` and `.claude/` adapters.
