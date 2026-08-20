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

- **`packages/create-nexus-devflow/`**: Distribution CLI package with TypeScript compilation (`dist/bin/create-nexus-devflow.js`), atomic update engine (`lib/update.ts`), and prepack template bundler (`scripts/prepare-template.ts`).
- **`.agents/skills/` & `.claude/skills/`**: 72 synchronized AI agent skills covering Mainline stages (00-70) and companion tools (`devflow`, `try`, `doctor`, `overview`, `sync-upstream`, `ci`, `rollback`).
- **`scripts/`**: Maintainer infrastructure (`check-devflow.ts`, `validate-framework.ts`, `smoke-package.ts`, `upstream-monitor.ts`, `evals/routing.ts`).
- **`devflow/`**: Workspace state, discoveries, runs, context, reference contracts, and master release history ledger.

## Shipped Capabilities (Recent Milestones)

- **`RUN-014` (2026-08-20)**: Upgraded DevFlow to full TypeScript architecture (`tsconfig.json`, `tsx`, `tsc`, `dist/`), migrated AI Blueprint Upstream Monitor workflow to DevFlow, and established multi-lane verification matrix.
- **`RUN-013` (2026-08-20)**: Added `/overview` skill for living context scanning and synchronization.
- **`RUN-008` (2026-08-18)**: Lean & Clean DevFlow optimization, consolidated skill taxonomy, and safe rollback mechanisms.

## DevFlow Workspace Status

- **Active Discovery ID**: None (Idle)
- **Active Running ID**: None (Idle)
- **Last Completed Run**: `RUN-014-typescript-migration-and-upstream-monitor-for-devflow`
