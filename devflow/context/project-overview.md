# Project Overview

Primary source of truth for the project context, architecture, tech stack, and active DevFlow stage status.

## Application Summary

- **Project Name**: Nexus-DevFlow
- **Goal**: Agent-ready DevFlow 2.0 workflow layer framework with .agents and .claude adapter tooling, living context synchronization, and automated AI Blueprint upstream monitoring.
- **Target Audience**: AI coding assistants (Google Antigravity, OpenAI Codex, Claude Code, Cursor) and software development teams building resilient agentic delivery workflows.

## Tech Stack

- **Core & Runtime**: Node.js (>=18.17 / Node 22), TypeScript 5.7, Node Next ESM (`"type": "module"`)
- **Execution & Tooling**: `tsx` (TypeScript execute/test runner), `tsc` (Typecheck & compilation)
- **Installer Package**: `@jakkrichm/create-nexus-devflow` (with `dist/` compilation pipeline)
- **Documentation**: VitePress / Astro website under `website/` (GitHub Pages)
- **Upstream Integration**: Automated GitHub Actions monitor (`.github/workflows/check-upstream.yml`) tracking `aiblueprinthq/ai-blueprint`
- **Verification Gate**: `npm run check` (TypeScript typechecking, static contract validation, TF-IDF skill routing evaluations, installer unit tests, packed smoke tests)

## Architecture & Key Modules

- **Dual-Track Delivery Engine**:
  - **Fast-Track (Blueprint Mode — 4 Steps)**: High-velocity spec loop (`/feature` or `/fix` ➔ `/implement` ➔ `/check` ➔ `/complete`) with Single Living Spec (`spec.md`).
  - **Deep-Track (Architect Mode — 8 Steps)**: Full-lifecycle delivery pipeline (`00-discover` ➔ `10-define` ➔ `20-spec` ➔ `30-plan` ➔ `40-execute` ➔ `50-verify` ➔ `60-report` ➔ `70-release`).
- **`packages/create-nexus-devflow/`**: Distribution CLI package with TypeScript compilation (`dist/bin/create-nexus-devflow.js`), atomic update engine (`lib/update.ts`), and prepack template bundler (`scripts/prepare-template.ts`).
- **`.agents/skills/` & `.claude/skills/`**: 80 synchronized AI agent skills covering Dual-Track workflows and companion tools (`devflow`, `idea`, `report-html`, `try`, `doctor`, `overview`, `sync-upstream`, `ci`, `rollback`).
- **`scripts/`**: Maintainer infrastructure (`check-devflow.ts`, `validate-framework.ts`, `smoke-package.ts`, `upstream-monitor.ts`, `evals/routing.ts`).
- **`devflow/`**: Workspace state, discoveries, runs, ideas, context, reference contracts, and master release history ledger.

## Shipped Capabilities (Recent Milestones)

- **`RUN-019` (2026-08-20)**: Native Terminal Status CLI (`nexus-devflow status` / `create-nexus-devflow status`), project root detection, metadata & findings parser, 15 Unit tests suite, and upstream AI Blueprint v0.9.1 baseline synchronization.
- **`RUN-018` (2026-08-20)**: Complete website and documentation overhaul for Dual-Track Architecture (`website/src/content/docs/`).
- **`RUN-017` (2026-08-20)**: Separate Fast-Track skills (`/feature`, `/fix`) and rename Deep-Track stage 40 to `40-execute` to eliminate command collisions.
- **`RUN-016` (2026-08-20)**: Quick Idea Capture and AI Feasibility Assessment (`/idea`) with centralized Idea Inbox (`devflow/ideas.md`).
- **`RUN-015` (2026-08-20)**: Dual-Track Architecture (Fast-Track 4 Steps & Deep-Track 8 Steps) + Living Spec (`spec.md`) + Standalone HTML Reporting Policy.
- **`RUN-014` (2026-08-20)**: Upgraded DevFlow to full TypeScript architecture (`tsconfig.json`, `tsx`, `tsc`, `dist/`), migrated AI Blueprint Upstream Monitor workflow to DevFlow, and established multi-lane verification matrix.

## DevFlow Workspace Status

- **Active Discovery ID**: None (Idle)
- **Active Running ID**: None (Idle)
- **Last Completed Run**: `RUN-019-sync-upstream-status-cli-and-project-detection` (2026-08-20)
