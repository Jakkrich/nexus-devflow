# Changelog

All notable changes to **Nexus-DevFlow** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.4] - 2026-08-17

### Fixed
- **Pre-commit Git Hook Removal**: Removed `.git/hooks/pre-commit` and `scripts/install-git-hook.mjs` to prevent git commits from auto-generating `graphify-out/` artifacts.
- **NPM Scripts Hygiene**: Removed `graphify:hook:install` from `package.json`.

## [2.0.3] - 2026-08-17

### Removed
- **Obsolete Scripts Cleanup**: Removed 7 outdated scripts (`migrate-to-blueprint-adapters.js`, `update-skill-paths.mjs`, `ob-runner.mjs`, `ob-tools.mjs`, `install-codex-global.mjs`, `update-codex-global.mjs`, `test-install-codex-global.mjs`).
- **NPM Scripts Cleanup**: Removed legacy script commands (`ob-loop`, `codex:install-global`, `codex:check-global`, `codex:update-global`, `codex:update-global:pull`, `validate:all`) from `package.json`.

## [2.0.2] - 2026-08-17

### Removed
- **Obsolete Skills Removal**: Removed 16 outdated/obsolete skills (`check-for-updates`, `devflow-concept-intake`, `prompt-addons`, `prp-dev-fastapi`, `prp-dev-multiplatform`, `prp-dev-odoo`, `prp-dev-php`, `prp-sa-ba`, `obsidian-cli`, `obsidian-bases`, `obsidian-markdown`, `obsidian-clipper-template-creator`, `english-to-thai-translator`, `red-team-tactics`, `writing-great-skills`, `devflow-wiki`) from `.agents/skills` and `.claude/skills`.

### Improved
- **Package Size Optimization**: Reduced NPX installer package size from 688 kB to 621 kB and total overlay files from 426 to 362 clean files.
- **Skill Routing Accuracy**: Increased evaluation Rank 1 match accuracy to 98.96% across 96 active skills.

## [2.0.1] - 2026-08-17

### Changed
- **Workspace Layout Migration**: Completed migration of all remaining `.workspaces` path references in skills, docs, and scripts to `devflow/`.
- **NPM Package README**: Aligned package `README.md` for `@jakkrichm/create-nexus-devflow` with Blueprint standard design and badges.
- **Git Ignore**: Added `graphify-out/` to `.gitignore`.

## [2.0.0] - 2026-08-17

### Added
- **NPX Overlay Installer**: Package `packages/create-nexus-devflow` (`@jakkrichm/create-nexus-devflow`) allowing instant installation or update via `npx @jakkrichm/create-nexus-devflow`.
- **Multi-Tool Adapter Layer**: Dual adapter architecture supporting Codex & Google Antigravity ([.agents/skills/](file:///.agents/skills/)) and Claude Code ([.claude/skills/](file:///.claude/skills/)).
- **Universal Source of Truth**: Unified `AGENTS.md` entry point and lightweight `CLAUDE.md` (`@AGENTS.md`).
- **DevFlow Framework Context**: Added `devflow/context/` (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`) and `devflow/reference/running-id-contract.md`.
- **Skill Routing Evaluation Suite**: Evaluation dataset in `evals/routing/` covering skills with 98.96% Rank 1 accuracy.
- **GitHub Workflows & Release Pipeline**: GitHub Actions workflows for automated verification (`validate.yml`) and automated npm publishing (`publish.yml`).

### Changed
- Migrated all legacy `.agent/workflows/` and `.agent/skills/` into standard `.agents/skills/<skill>/SKILL.md` format.
- Consolidated goal runner and maintenance scripts under `scripts/`.

### Removed
- Completely removed legacy `.agent/` folder in favor of clean `.agents/` and `.claude/` adapters.
