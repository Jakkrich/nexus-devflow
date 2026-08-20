# Changelog

All notable changes to **Nexus-DevFlow** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.14] - 2026-08-20

### Added
- **Centralized AI Blueprint Upstream Monitor**: Moved and installed the automated AI Blueprint Upstream Monitor workflow (`.github/workflows/check-upstream.yml`) in `nexus-devflow`. Includes `scripts/upstream-monitor.ts`, `scripts/update-upstream-issue.ts`, tracking metadata in `.nexus/upstream-ai-blueprint.json`, and maintainer skill `sync-upstream`.
- **TypeScript Architecture & Dist Pipeline**: Upgraded installer package `@jakkrichm/create-nexus-devflow` to TypeScript with compilation pipeline (`tsconfig.json`, `dist/bin/create-nexus-devflow.js`, `lib/update.ts`, `scripts/prepare-template.ts`).
- **Robust Multi-lane Verification Gate**: Root `npm run check` with full TypeScript typechecking (`tsc --noEmit`), TF-IDF skill routing evaluations (`scripts/evals/routing.ts`), installer unit tests, and packed tarball smoke testing.

## [2.0.10] - 2026-08-18

### Changed
- **Standardized Canonical Command Naming**: Standardized all Mainline Stages (`00-discover`, `10-define`, `20-spec`, `30-plan`, `40-implement`, `50-verify`, `60-report`, `70-release`) and Companion Commands to use a single Canonical Name, completely removing confusing shorthand and redundant semantic aliases from core documentation and tables.
- **AI Provider Invocation Guideline**: Added clear and concise instructions across `AGENTS.md`, `README.md`, and `README.th.md` explaining that command invocation syntax (Plain Name, `/`, or `$`) depends on the AI Provider or tool being used (e.g., Slash Commands for Claude Code & Antigravity, Dollar Macro for OpenAI Codex CLI).
- **Skill Adapters & Template Alignment**: Updated usage blocks and next-step references across all `SKILL.md` files in `.agents/skills/` and `.claude/skills/`, and synchronized template package.

## [2.0.9] - 2026-08-18

### Added
- **Companion Skills (`try`, `rollback`, `ci`, `brief`)**: Integrated 4 high-value companion skills from Blueprint (`/try` for human manual QA walkthroughs, `/rollback` for safe run reversal planning with dependency risk analysis, `/ci` for automated GitHub Actions pipeline setup, and `/brief` for read-only scope/risk pre-checks before spec).
- **Autonomous Bounded Loop (`autopilot`)**: Added `/autopilot` for continuous execution across Spec -> Plan -> Implement -> QA Verify -> Report Digest with checkpoint commits and strict hard stops (no auto-merge, push, or deploy).
- **Standardized `[Devflow]` Prefix**: Added `[Devflow]` prefix across all 104 skill descriptions in `.agents/skills/` and `.claude/skills/` for cleaner categorization and better AI agent discovery.
- **Reviewed & Enhanced Descriptions**: Significantly improved descriptions for all companion wrappers and specialist skills to provide concrete action, purpose, and trigger intents.

## [2.0.8] - 2026-08-18

### Added
- **Onboarding & Adoption Companion Skills (`onboard`, `adopt`)**: Introduced dedicated setup and ingestion workflows. `/onboard` detects stack, tunes `AGENTS.md` commands and `coding-standards.md`, and initializes baseline context for freshly scaffolded projects. `/adopt` provides a read-only survey and intent interview to bootstrap DevFlow context into existing brownfield codebases.
- **Health Check & Diagnostics Skill (`doctor`)**: Added a read-only diagnostic skill (`/doctor`) to verify context file completeness, adapter parity, command validity, active run progression, and detect workflow drift.
- **Router Integration**: Upgraded the flagship `devflow` router to automatically detect unconfigured projects and route users to `/onboard` or `/adopt`, and to recommend `/doctor` for diagnostics.
- **Ecosystem Synchronization**: Added `onboard`, `adopt`, `doctor` across [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md), package installer template, and documentation.

## [2.0.7] - 2026-08-18

### Added
- **Blueprint-Style Self-Contained Model**: Upgraded [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) to a comprehensive, self-contained operating blueprint with execution rules for OpenAI Codex, Google Antigravity, Claude Code, Cursor, and generic AI coding assistants.
- **Mandatory Tool Reading Directive**: Added explicit instructions in `AGENTS.md` for agents without background skill loaders (e.g. OpenAI Codex CLI, Aider) to inspect `.agents/skills/<skill>/SKILL.md` before executing stages.
- **Universal Command Invocations**: Native support for normal stage names (`00-discover`, `10-define`, `20-spec`, `devflow`), semantic aliases (`discover`, `spec`, `implement`, `verify`, `report`, `release`, `status`), Codex macro syntax (`$00-discover`), and slash commands (`/00-discover`).
- **State-Aware Inspection in `devflow` Router**: Upgraded flagship `devflow` guide to automatically scan active runs in `devflow/runs/` and `devflow/context/current-stage.md` to recommend the exact next step.

### Fixed
- **HTML Report Template Path**: Fixed template resolution in `scripts/lib/render-html/md2html-report.mjs` to dynamically look in `.agents/skills/md2html/template.html` and `.claude/`.

## [2.0.6] - 2026-08-17

### Removed
- **Obsolete Documentation Cleanup**: Removed 3 outdated documentation files (`docs/prompt-addons.md`, `docs/install-update-troubleshooting.md`, `docs/upgrade-path.md`) from `docs/`.

### Improved
- **Release Guidance**: Updated `docs/release-process.md` with DevFlow 2.0 standard validation commands and NPX installer update checks.

## [2.0.5] - 2026-08-17

### Removed
- **Legacy Index Artifact Removal**: Removed `devflow/context/project_index.json` and `scripts/generate-project-index.mjs` to eliminate machine-specific hardcoded local paths.

### Fixed
- **Portable Link Hygiene**: Replaced all hardcoded developer machine absolute paths (such as `D:/Projects/...` or `D:\devtools\...`) with clean, portable relative markdown links across `docs/` and framework skills.

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
