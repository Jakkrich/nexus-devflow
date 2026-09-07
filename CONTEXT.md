# Nexus-DevFlow Domain Model

Nexus-DevFlow is an agentic workflow layer and spec-driven pair programming operating system for human developers and AI coding agents.

## Language

**Tooling Engine**:
A unified execution engine that dispatches internal developer CLI utilities and tooling commands behind a single programmatic seam.
_Avoid_: Script runner, script bundle, utility collection

**Tool Command**:
A self-contained command implementation registered in the Tooling Engine that executes a specific automation or reporting task without producing side-effect exits.
_Avoid_: CLI script, sub-script, runner

**Living Spec**:
The single active task specification document (`spec.md`) that drives the 4-stage lifecycle from definition through empirical proof.
_Avoid_: PRD, design document, static specification

**Quality Gate**:
A hard programmatic verification checkpoint that blocks completion or commit when tests fail, spec tasks remain incomplete, or unresolved findings persist.
_Avoid_: Lint check, completion check, pre-commit barrier

**Dashboard State Engine**:
The deep state computation engine that aggregates project status, snapshots, code graphs, and blast radius reports behind a protocol-agnostic in-memory seam.
_Avoid_: Dashboard server, dashboard backend, snapshot handler

**Dashboard Transport Adapter**:
A concrete presentation or network adapter (HTTP server, IDE Webview) that translates external requests into calls against the Dashboard State Engine.
_Avoid_: Dashboard controller, route handler

**Gatekeeper Engine**:
The centralized policy enforcement and verification engine that evaluates Two-Stage quality criteria (Spec Fidelity & Code Quality), absorbs finding blocker inspection, detects Git drift, and triggers state reconciliation behind a unified seam.
_Avoid_: Gate check, gate script, verification runner

**Gate Policy**:
The deterministic set of quality rules defined in `devflow/config.json` that governs whether gates run in strict, standard, or conditional modes (e.g. `when-sensitive`, `always`, `manual`).
_Avoid_: Gate settings, gate flags, config overrides

**Active Context Engine**:
The authoritative engine that resolves active task workspaces (`devflow/context/{xxx-slug}/`), detects Git branch alignment, parses living spec task checklists, and tracks workflow state behind a unified in-memory seam.
_Avoid_: Branch context resolver, current work parser, stage detector

**Studio View Renderer**:
The deep presentation and component engine that renders the 3-Pillars Workspace, dual-track steppers, and real-time project status across web browsers and IDE Webviews behind a unified, adaptive design system.
_Avoid_: Dashboard template, HTML generator, studio builder

**Delivery Lifecycle Engine**:
The deep transactional engine that orchestrates the 4-stage task delivery boundary, atomic archiving of living specs into historical categories, bidirectional build-plan synchronization, and history ledger recording behind a unified seam.
_Avoid_: Task archiver, history writer, completion script

**History Ledger**:
The structured, chronological markdown ledger (`devflow/history/HISTORY.md`) and in-memory table model that tracks all released delivery runs, categories, git commit references, and archive links.
_Avoid_: Release log, changelog table, history file

**Skill Registry Engine**:
The deep lifecycle engine that orchestrates skill cataloging, package resolution, repository cloning, compound knowledge unpacking, and multi-adapter synchronization behind a minimal programmatic seam (`list`, `install`, `sync`).
_Avoid_: Skill manager, skill script, skill downloader

**Skill Repository Adapter**:
A swappable adapter satisfying the skill resolution seam for specific storage or remote sources (e.g. `GitCloneAdapter`, `NpmArchiveAdapter`, `InMemoryRepositoryAdapter`).
_Avoid_: Git helper, npm fetcher

**MCP Server Engine**:
The protocol and tool dispatch engine that exposes DevFlow intelligence to MCP clients behind a protocol-agnostic in-memory message seam (`handleMessage`) and registered tool adapters.
_Avoid_: MCP script, MCP runner, JSON-RPC handler

**Project Status Engine**:
The deep evaluation engine that consolidates active task context, gate policies, Git porcelain status, review state, and findings into an atomic, verified project health snapshot (`getStatus`).
_Avoid_: Status script, status formatter, health check runner
