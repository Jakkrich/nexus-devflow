# Changelog

All notable changes to **Nexus-DevFlow** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.9.3] - 2026-08-28

### Added
- **Archify Technical Diagramming Integration (`/archify`)**: Integrated `tt-a1i/archify` engine supporting interactive, verifiable technical architecture, workflow, dataflow, sequence, and lifecycle diagrams with responsive SVG rendering, dark/light theme switching, route probes, reach analysis, and trace motion.
- **Interactive System & Lifecycle Maps (`docs/diagrams/`)**: Generated showcase-validated interactive maps for Nexus-DevFlow System Architecture and 4-Stage Task-Isolated Living Spec Lifecycle.
- **Recommended Third-Party Skills Documentation**: Added comprehensive extension tables with direct CLI installation commands for all 8 supported community skills (`archify`, `diagram-design`, `debug-mantra`, `post-mortem`, `qwen-agent`, `scrutinize`, `management-talk`, `qwenchance`) to `README.md` and `README.th.md`.

## [2.9.2] - 2026-08-28

### Added
- **Third-Party Skill Update Engine (`nexus-devflow skill update`)**: Added `updateThirdPartySkills` supporting `nexus-devflow skill update [name]` and `nexus-devflow skill update --all` to automatically re-fetch latest skill definitions from original Git / local sources, update manifest timestamps and metadata, and synchronize `.agents/` and `.claude/` adapters.

## [2.9.1] - 2026-08-28

### Added
- **Nested Multi-Skill Repository Discovery**: Recursive directory scanner (`discoverSkillsInDirectory`) up to depth 5 to discover all valid skills located inside arbitrary category folders (e.g. `skills/engineering/` and `skills/productivity/` in `thananon/9arm-skills`).
- **Targeted Skill Installation (`--name <skill-name>`)**: Support installing a specific skill from a multi-skill repository or bundle.
- **Batch Multi-Skill Installation (`--all`, `--all-skills`)**: One-command installation and registration of all discovered skills from a multi-skill bundle into both `.agents/skills/` and `.claude/skills/`.
- **Friendly Multi-Skill Ambiguity Guidance**: When multiple skills are found in source without a target name, CLI lists all available skills and suggests `--name` or `--all`.

## [2.9.0] - 2026-08-28

### Added
- **Dashboard Activity State Contract (`devflow/.state/run.json`)**: Real-time activity state engine tracking running commands, boundary modes, progression status, and automatic stale-activity calculations (> 1h).
- **First-Action Activity Protocol**: Standardized first-action activity reporting across tracked skills before project inspection or tool execution.
- **Local Checkout Linking (`scripts/link-local.ts`)**: Built-in `npm run link:local` and `unlink:local` scripts allowing local repository linking and global CLI testing without publishing.
- **Dynamic Package Root Resolution (`findPackageRoot`)**: Robust parent search for `package.json` ensuring CLI works seamlessly from source checkouts.
- **Onboarding Marker Sentinel**: Added `<!-- devflow:onboarding-required -->` sentinel in `AGENTS.md` and automated status check directing fresh scaffolds to `/onboard`.

### Changed
- **Rollback & Implementation Safeguards**: Hardened `/rollback` and `/implement` with full 40-character SHA verification, ancestor check against `HEAD`, and strict merge-commit blocking to prevent history corruption.
- **Findings Persistence Safety**: Guarded `/complete` from archiving or deleting `fixed` findings until explicitly audited and closed by `/audit`.
- **Synchronized with Upstream AI Blueprint v1.0.0 & v1.0.1 baseline**.

## [2.7.0] - 2026-08-26

### Added
- **Deterministic Project Configuration Engine (`devflow/config.json`)**: Machine-readable configuration controlling workflow review strictness, checkpoint commits, branch naming prefixes, verification logic, regular/continuous quality gates (audit, check, tryGuide), and continuous loop limits.
- **Autonomous Continuous Mode (`/continuous`)**: 29th bundled Core Skill for autonomous serial multi-feature delivery loops with local branch isolation, quality gatekeeper enforcement, and safe squash-merges.
- **29 Core Skills Architecture**: Expanded canonical core skill inventory from 28 to 29 across `.agents` and `.claude` adapters.

### Changed
- Integrated `readProjectConfig` into `status`, `doctor`, and `dashboard` to report active workflow configuration and quality gate rules.
- Synchronized with AI Blueprint Upstream v0.14.0 baseline.

## [2.6.2] - 2026-08-26

### Changed
- Purged legacy Deep Track numbered stage artifacts (00-70) across all scripts, test suites, and documentation.
- Enhanced idle status detection and gatekeeper fallback resolution in `@jakkrichm/create-nexus-devflow`.
- Removed standalone upstream monitor flow and legacy upstream tracking contracts.

## [2.6.1] - 2026-08-26

### Added
- Single Living Spec Model (DevFlow 2.6.x) with Multi-Run active context isolation.

## [2.6.0] - 2026-08-25

### Added
- Canonical ordered inventory for 28 bundled Core Skills shared by validation and package generation.
- Automated tests for manifest validation, adapter parity, local-extension classification, and documentation-count drift.

### Changed
- Package generation now includes only allowlisted Core Skills and excludes workspace-local extensions.
- Public EN/TH guides now document the current Single Living Spec lifecycle, Dual-Axis `/check`, six-phase `/debug`, and Deep Modules guidance consistently.
- Static and package smoke verification now prove exact Core Skill inventory integrity across `.agents` and `.claude` adapters.

## [2.2.1] - 2026-08-24

### 🔍 Unified Discovery Engine (`/discovery`) & Socratic Alignment (`/grill`)

#### Added
- **Unified `/discovery` Dual-Mode Engine**:
  - Consolidated `00-explore` and `discovery` into a single, seamless entry point.
  - **Macro Project Mode**: Invoked without arguments or `--project` to conduct product roadmap discovery and draft `project-plan.md` & `build-plan.md` before `/overview`.
  - **Micro Feature Mode (Stage 00)**: Invoked with a feature title, request, or `IDEA-xxx` to explore problem space, evaluate feasibility across 5 lenses (Brainstorm, Research, PRD, Bug Triage, Grill), and produce `devflow/discoveries/{DISC-ID}/discovery.md` with explicit Proceed/Defer/Reject decisions before `10-define`.
- **Socratic Alignment Companion Skill (`/grill` / `/align`)**:
  - Added codebase-grounded interactive interview loop to stress-test designs and eliminate ambiguity before speccing.
  - Added lazy inline persistence for project domain terminology in `devflow/context/glossary.md`.
  - Added Architecture Decision Records (ADRs) generation under `devflow/decisions/ADR-xxx-{slug}.md` for durable architectural governance.
  - Integrated as **Lens 5** within `/discovery`.

#### Changed
- **Consolidated Deep-Track Lifecycle**:
  - Standardized Deep-Track 8-step pipeline to: `discovery ➔ 10-define ➔ 20-spec ➔ 30-plan ➔ 40-execute ➔ 50-verify ➔ 60-report ➔ 70-deliver`.
  - Removed obsolete `.agents/skills/00-explore` and `.claude/skills/00-explore` skill directories.
  - Updated CLI tools, status inspection, manifest, maintainer scripts, and documentation across all adapters to use `discovery`.
  - Added backward-compatible fallback parsing for legacy `00-explore.md` artifacts in `devflow/discoveries/`.

## [2.2.0] - 2026-08-24

### 🔄 Upstream AI Blueprint v0.13.0 Sync & Multi-Adapter Expansion

#### Added
- **OpenCode AI Tool Adapter Support (`050-sync-upstream-adopt-visibility-and-opencode`)**:
  - Added `opencode` adapter choice and sharing rules with `.agents/skills/` and `.claude/skills/` without duplicate skill trees.
  - Added CLI flags `--opencode` and `--all` to installer.
  - Added interactive multi-select checkbox prompt for flexible adapter selection during `create-nexus-devflow` installation.
- **Adopt & Onboard DevFlow Visibility (Step 5/6)**:
  - Added interactive choice between `1. Commit DevFlow workflow files` and `2. Keep DevFlow workflow files local` (`.gitignore`).
  - Added Guarded Untracking safety check prompting before running `git rm --cached` on previously tracked workflow files.
  - Ensured `AGENTS.md` remains public-safe in local-only mode.
- **Doctor Diagnostics for Visibility & OpenCode**:
  - Enhanced `/doctor` to verify ignored local-only files on disk, detect tracked files in local-only mode, and inspect OpenCode adapter health.
- **Upstream Baseline Update**:
  - Updated tracking SHA to `0b65166` (AI Blueprint v0.13.0).

## [2.1.0] - 2026-08-23

### 🚀 Enterprise Agentic Architecture Release (Phases 1–7 Evolution)

#### Added
- **Multi-Agent Swarm Orchestrator & Semantic Code Graph RAG (`048-multi-agent-swarm-and-code-graph-rag`)**:
  - `lib/swarm-orchestrator.ts`: Developed Role-based Swarm Engine allocating tasks across `👑 Lead Architect`, `👨‍💻 Coder Specialist`, `🕵️ QA Verifier`, and `🛡️ Security Auditor` with parallel group dispatch.
  - `lib/code-graph.ts`: Developed In-Memory AST Dependency Graph indexer parsing module imports/exports and computing deterministic **Blast Radius** (Direct & Transitive Dependents) with Impact Scores (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
  - Added CLI subcommands `nexus-devflow swarm [--json]` and `nexus-devflow graph [--file <path>] [--json]`.
  - Added MCP tools `devflow_swarm_plan` and `devflow_query_code_graph`.

- **IDE Native Extension & Interactive Webview Studio (`047-ide-native-extension-webview-studio`)**:
  - `lib/webview-studio.ts`: Built a self-contained, zero-dependency HTML/CSS/JS 3-Pillars Kanban Studio (Ideas Inbox, Active Living Spec, History Archives) with dynamic Gatekeeper status, Git Drift indicator, and Interactive Quick Action bar with click-to-copy / IDE terminal dispatch.
  - `lib/ide-extension.ts`: Created typed VS Code & Google Antigravity IDE Extension manifest generator (`package.json`) contributing Webview views and commands.
  - Added CLI subcommand `nexus-devflow studio [--json]` and MCP tool `devflow_get_studio_html`.

- **Git Diff Drift Reconciler & Self-Healing State Engine (`046-git-diff-drift-reconciler`)**:
  - `lib/drift-reconciler.ts`: Built Git diff drift analyzer classifying Undocumented, Phantom, and Matched files, plus Stage Drift.
  - Added self-healing engine auto-syncing living spec files list non-destructively and healing `current-stage.md`.
  - Added CLI subcommands `nexus-devflow drift [--json]` and `nexus-devflow reconcile [--fix] [--json]`.
  - Added MCP tools `devflow_detect_drift` and `devflow_reconcile_state`.

- **Just-In-Time (JIT) Dynamic Context Slicing Engine (`045-jit-dynamic-context-slicing-engine`)**:
  - `lib/context-slicer.ts`: Implemented stage-aware markdown context slicer reducing token consumption by 60–70% for `/implement`, `/check`, and `/00-explore`.
  - Added CLI subcommand `nexus-devflow slice --stage <stage> [--max-tokens <N>] [--json]`.
  - Added MCP tool `devflow_get_sliced_context`.

- **Branch-Scoped Context Isolation & Dynamic Router (`044-branch-scoped-context-isolation`)**:
  - `lib/branch-context.ts`: Engineered isolated context routing under `devflow/context/<branch>/` allowing seamless concurrent delivery runs across separate Git branches.
  - Added auto-cleanup upon `/complete` and fallback to default `devflow/context/`.

- **Model Context Protocol (MCP) Server Hub (`043-devflow-mcp-server-hub`)**:
  - `lib/mcp.ts`: Implemented full JSON-RPC 2.0 MCP server over StdIO exposing 12 typed tools for AI agents.
  - Added CLI subcommand `nexus-devflow mcp`.

- **Automated Quality Gatekeeper & Pre-commit Hook Integration (`042-quality-gatekeeper-and-precommit-hooks`)**:
  - `lib/gatekeeper.ts` & `lib/git-hooks.ts`: Added Hard Quality Gatekeeper blocking commits/merges on unchecked tasks, failing tests, or P0/P1 blockers.
  - Added CLI subcommands `nexus-devflow check-gate [--strict]` and `nexus-devflow hook install/uninstall [pre-commit|pre-push]`.
  - Added MCP tool `devflow_evaluate_gate`.

## [2.0.27] - 2026-08-22


### Added
- **Unified Dual-Track Root Switch & Priority-Aware Reader (`041-unified-track-root-switch`)**: Set `devflow/context/current-stage.md` as the authoritative source of truth for `Track: fast | deep | idle`, resolving status split-brain between AI suggestions and CLI/Dashboard next actions.
- **Context Auto-Sync & Auto-Detect Fallback**: Added auto-detection fallback in `readCurrentWork` to seamlessly switch tracks when active work files exist even if `current-stage.md` is idle.
- **Dashboard Track Auto-Focus & Active Tab Badge**: Added automatic tab switching to active track from `workflow.track` with a pulsing `● ACTIVE` badge indicator.
- **Authoritative Next Action for Complete Stage**: Enhanced `selectNextAction` and `selectCompletion` to recognize passed verification and transition to `/complete` smoothly.

## [2.0.26] - 2026-08-22

### Added
- **Dashboard Mockup & Blueprint Theme Parity (`040-dashboard-mockup-parity`)**: Redesigned Web Dashboard UI to achieve full visual and structural parity with Blueprint reference mockup (`#071626` navy grid theme, semantic color accents, card spacing, and clean responsive hierarchy).
- **Interactive Dual-Track Visualizer**: Integrated dynamic stage pipelines for Fast-Track (4 stages) and Deep-Track (8 stages) with deterministic state rendering (`done`, `active`, `pending`).
- **Quick Commands Tooltip & Interactive Copy**: Added accessible hover and keyboard focus tooltips with skill descriptions, along with one-click copy-to-clipboard functionality and visual `Copied!` feedback.
- **Dedicated Dashboard Snapshot Backend (`/api/dashboard`)**: Implemented `/api/dashboard` composing live workflow state, history records, doctor checks, discoveries, package version status, command catalog, and adapter health, while retaining backward compatibility for `/api/status`.

## [2.0.25] - 2026-08-22

### Added
- **Update Backup & Safety Rollback Engine**: Added automatic backup of replaced/removed files and manifest metadata to `.nexus/backups/{timestamp}-{prevVersion}-to-{nextVersion}-{hash}/` upon `applyPreparedUpdate` in `packages/create-nexus-devflow/lib/update.ts`.
- **Backup Metadata (`backup.json`) & Control GitIgnore**: Added `backup.json` recording `fromVersion`, `toVersion`, `replaced`, and `removed` lists, as well as automatic `.nexus/.gitignore` writing for `backups/` and `staging/`.
- **Atomic Rollback Mechanism**: Added automatic rollback recovery if file writing fails mid-update, restoring original files from backup directory.

## [2.0.24] - 2026-08-21

### Added
- **Unified Document Converter Skill (`convert-any-to-md`)**: Integrated a single consolidated skill in `.agents/skills/convert-any-to-md/` and `.claude/skills/convert-any-to-md/` for converting Excel (`.xlsx`), PDF (`.pdf`), Word (`.docx`), and Plaintext (`.txt`, `.csv`, `.log`, `.json`, `.yaml`, etc.) documents into clean Markdown.
- **Embedded Image Extractor Engine (`convert_any_to_md.py`)**: Added a Python conversion engine with automatic format detection, per-sheet image extraction for Excel, per-page appendix images for PDF, ZIP media extraction for Word, and folder batch processing (`--recursive`).
- **Default Reference Destination (`devflow/reference/`)**: Set default output directory to `devflow/reference/` for seamless integration into DevFlow workflow and reference library.

### Changed
- **AI Blueprint Upstream v0.11.1 Sync**: Synced Dashboard UI accessibility improvements (ARIA attributes `aria-live`, `aria-label`, `role="progressbar"`), Project Health summary calculation, Active Build item progress status ("Current: xxx"), Connected server indicator label, and CSS hydration animation from AI Blueprint v0.11.1 (`d8e6700`).

## [2.0.23] - 2026-08-21

### Added
- **Fast-Track & Flow Icons in QuickPick & Status Bar**: Added Fast-Track commands (`/feature`, `/fix`, `/implement`, `/check`, `/complete`), Deep-Track stages, and Utilities into 3-category QuickPick layout with stage icons.
- **Stage Icons & Track Mode Logic**: Enhanced `scripts/summarize-run-status.mjs` with `stageIcons` dictionary and `trackMode` (`Fast-Track` vs `Deep-Track`) detection.
- **Live Dashboard Micro-Animations & State Diffing**: Added CSS pulse animations, JS DOM state diffing, reduced motion accessibility, and visual feedback for live stage updates.
- **AI Blueprint Upstream v0.11.0 Sync**: Synced GitHub Copilot adapter tooling and updated Live Dashboard UI baseline from AI Blueprint upstream.

### Fixed
- **Dashboard CSS Transform Animations**: Fixed transform scaling animations for `.live-dot` and status pills by setting explicit `display: inline-block`.

## [2.0.22] - 2026-08-21

### Added
- **Interactive Terminal Spinner**: Added zero-dependency smooth terminal spinner animation during project inspection, file overlay, update, and uninstall operations.
- **Enhanced ANSI Styling**: Colorized CLI headers, parameters, file counts, and command suggestions with bold bright cyan, green, and dimmed accents.

### Changed
- **Concise Onboarding Guide**: Streamlined post-install Next Steps to focus strictly on project baseline setup (`/adopt` for existing projects, `/onboard` for fresh projects) with clean unnumbered list.

## [2.0.21] - 2026-08-21

### Changed
- **Lean Skills Architecture (28 Core Skills)**: Streamlined multi-agent skills from 81 down to 28 core skills across Fast-Track (5), Deep-Track (8), and Companion Tools & Gates (15), eliminating bloated/redundant cheatsheet skills.
- **In-Flow Best Practices Consolidation**: Absorbed Conventional Commits, SemVer calculation, Keep a Changelog updates, and PR templates into `complete` and `70-deliver`; Brainstorming Matrix and Empirical Research into `00-explore`; and 9arm Scrutinize QA and Security Review into `check` and `50-verify`.
- **Enriched Coding Standards**: Added Deep Module Architecture, Code Simplification rules, API Boundary Stability, and Safe Database Migration standards to `devflow/context/coding-standards.md`.
- **Multi-IDE Adapter Parity**: Synced `.agents/skills/` (Codex/Antigravity) and `.claude/skills/` (Claude Code) with 100% 1:1 parity.

## [2.0.17] - 2026-08-20

### Added
- **Clean Eject & Uninstall Subcommands (`nexus-devflow uninstall` / `nexus-devflow eject`)**: Standalone CLI utility to completely remove all DevFlow files (`devflow/`, `.agents/`, `.claude/`, `.nexus/`, `AGENTS.md`, `CLAUDE.md`) from a codebase without touching user application code.
- **Safety Flags & Automation Controls**: Added `--dry-run` to preview deleted items, `-y`/`--yes`/`-f`/`--force` for non-interactive execution, `--keep-history` to preserve run archives, and `--json` structured output.
- **Core Uninstall Module & Test Suite**: Added `packages/create-nexus-devflow/lib/uninstall.ts` with 5 new unit tests in `test/uninstall.test.ts` (bringing total unit tests to 20/20 passing).

## [2.0.16] - 2026-08-20

### Added
- **Native Status CLI (`nexus-devflow status` / `create-nexus-devflow status`)**: Standalone terminal status inspection utility displaying project metadata, progress of living spec and active delivery runs, findings blocker detection (`P0`/`P1`), git status and remote divergence, and automated next action recommendation.
- **Machine-Readable JSON Output (`--json`)**: Added `--json` flag to `status` command for automated CI/CD pipeline checks and external tooling integration.
- **Core Status Inspection Libraries (`packages/create-nexus-devflow/lib/`)**: Added TypeScript modules for project root auto-detection (`project-root.ts`), metadata and adapter discovery (`project-metadata.ts`), findings ledger parser (`findings.ts`), git status reader (`git-status.ts`), and current work progress tracker (`current-work.ts`).
- **Comprehensive Status Unit Test Suite**: Added 15 unit tests across `test/project-root.test.ts`, `test/project-metadata.test.ts`, `test/git-status.test.ts`, `test/findings.test.ts`, and `test/status.test.ts`.

### Changed
- **Synced AI Blueprint Upstream Baseline**: Updated `.nexus/upstream-ai-blueprint.json` tracking commit to `c394e3b` (v0.9.1).

## [2.0.15] - 2026-08-20

### Added
- **Dual-Track Delivery Model**: High-velocity Fast-Track (4 Steps: `/feature`, `/fix` ➔ `/implement` ➔ `/check` ➔ `/complete`) with Single Living Spec (`spec.md`) alongside Deep-Track (8 Steps: `00-explore` ➔ `70-deliver`) for architectural epics.
- **Dedicated Fast-Track Skills (`feature`, `fix`)**: Separate canonical commands for new feature specs and bugfix specs to prevent command collisions.
- **Quick Idea Capture Inbox (`/idea`)**: Quick capture tool with AI feasibility and value enrichment storing to `devflow/ideas.md`.
- **Standalone HTML Dashboard Command (`/report:html`)**: Dedicated interactive single-file HTML report generator on demand.

### Changed
- **Renamed Deep-Track Step 40 to `40-execute`**: Cleared naming ambiguity between Fast-Track `/implement` and Deep-Track `40-execute`.
- **Updated Documentation & Guides**: Complete website overhaul (`website/src/content/docs/`), `README.md`, and `README.th.md` with Dual-Track guidance.

## [2.0.14] - 2026-08-20

### Added
- **Centralized AI Blueprint Upstream Monitor**: Moved and installed the automated AI Blueprint Upstream Monitor workflow (`.github/workflows/check-upstream.yml`) in `nexus-devflow`. Includes `scripts/upstream-monitor.ts`, `scripts/update-upstream-issue.ts`, tracking metadata in `.nexus/upstream-ai-blueprint.json`, and maintainer skill `sync-upstream`.
- **TypeScript Architecture & Dist Pipeline**: Upgraded installer package `@jakkrichm/create-nexus-devflow` to TypeScript with compilation pipeline (`tsconfig.json`, `dist/bin/create-nexus-devflow.js`, `lib/update.ts`, `scripts/prepare-template.ts`).
- **Robust Multi-lane Verification Gate**: Root `npm run check` with full TypeScript typechecking (`tsc --noEmit`), TF-IDF skill routing evaluations (`scripts/evals/routing.ts`), installer unit tests, and packed tarball smoke testing.

## [2.0.10] - 2026-08-18

### Changed
- **Standardized Canonical Command Naming**: Standardized all Mainline Stages (`00-explore`, `10-define`, `20-spec`, `30-plan`, `40-execute`, `50-verify`, `60-report`, `70-deliver`) and Companion Commands to use a single Canonical Name, completely removing confusing shorthand and redundant semantic aliases from core documentation and tables.
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
- **Universal Command Invocations**: Native support for normal stage names (`00-explore`, `10-define`, `20-spec`, `devflow`), semantic aliases (`discover`, `spec`, `implement`, `verify`, `report`, `release`, `status`), Codex macro syntax (`$00-explore`), and slash commands (`/00-explore`).
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
