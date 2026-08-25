# Nexus-DevFlow 2.6.0 Comprehensive Usage Guide

This guide provides full operating instructions for **Nexus-DevFlow 2.6.0 (The 3-Pillars & Single Living Spec Model)** across Google Antigravity, OpenAI Codex, Claude Code, Cursor, GitHub Copilot, and related AI development environments.

---

## 1. Core Architecture: The 3-Pillars Model

Nexus-DevFlow structures development history and active context into three distinct temporal pillars:

1. **🔮 Future (Backlog)**: [`devflow/ideas.md`](../devflow/ideas.md)
   - Centralized Idea Inbox with AI feasibility, value scoring, and priority tagging (`[IDEA-xxx]`).
   - Quick idea capture via `/idea {description}`.
2. **⚡ Present (Active Context)**: `devflow/context/`
   - Single Source of Truth: `project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `glossary.md`.
   - **The Single Living Spec**: `current-feature.md` (Active delivery spec / idle reset stub).
   - Active Stage Inspector & Single Active Run Guardrail: `current-stage.md`.
   - Findings Ledger: `findings.md` (P0/P1 quality & security blockers).
3. **📦 Past (History Archive)**: `devflow/history/`
   - Categorized delivery archives: `features/`, `fixes/`, `rollbacks/`.
   - Master Release Ledger: `HISTORY.md`.

---

## 2. The Unified 4-Stage Living Spec Lifecycle

All development tasks execute through the progressive 4-stage single living spec lifecycle:

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

| Step | Command | Artifact | Description |
| :--- | :--- | :--- | :--- |
| **1. Spec** | `/feature {title}`<br>`/fix {bug}` | `context/current-feature.md` | Allocates sequential ID (`xxx-slug`), writes living spec with 6 structured sections behind review gate. |
| **2. Build** | `/implement` | `context/current-feature.md` | Executes tasks incrementally with strict TDD discipline (Red-Green-Refactor) and evidence recording. |
| **3. Verify**| `/check` | `context/current-feature.md` | Dual-Axis review: empirical spec fidelity plus independent standards, architecture, and quality gates. |
| **4. Deliver** | `/complete` | `history/{cat}/{xxx-slug}.md` | Final safety audit, records Release Digest, archives living spec, squash-merges branch, and resets stub. |

---

## 3. Pre-Flight Discovery & Architectural Alignment Suite

Before committing to delivery, use specialized companion skills:

```text
/idea (Inbox) ──▶ /grill (Socratic ADR) ──▶ /discovery (Explore) ──▶ /feature (Deliver)
```

- **`/idea`**: Capture raw ideas in `devflow/ideas.md` with instant AI feasibility scoring.
- **`/grill`** (or **`/align`**): Socratic alignment & domain modeling; records Architecture Decision Records (`devflow/decisions/ADR-xxx.md`).
- **`/brainstorm`**: Structured ideation with trade-off analysis.
- **`/discovery`**: Deep inception and exploratory discovery (`devflow/discoveries/DISC-xxx.md`).

---

## 4. Core Skills Inventory (28 Skills)

DevFlow ships **28 bundled Core Skills** from the ordered `core_skills` inventory
in `agent-bundle.manifest.json`, synchronized 1:1 across `.agents/skills/`
(Codex / Antigravity / Copilot) and `.claude/skills/` (Claude Code). Local or
Personal Skills may coexist in a workspace, but are excluded from the Core count
and package template until explicitly promoted.

### A. Lifecycle Delivery Skills
- `feature`: Turn a build-plan item or new idea into a single living spec (`devflow/context/current-feature.md`).
- `fix`: Document and spec an ad-hoc bug or issue into `current-feature.md`.
- `implement`: Step-by-step TDD implementation behind review gates.
- `check`: Dual-Axis verification of observable spec behavior and independent architecture/standards quality.
- `complete`: Final safety audit, Conventional Commit, archiving, and branch delivery gate.
- `rollback`: Plan a safe reversal of a completed feature preserving history.

### B. Pre-Flight Discovery & Alignment Skills
- `discovery`: Inception exploration and deep multi-turn planning (`devflow/discoveries/`).
- `idea`: Quick idea capture and AI feasibility scoring (`devflow/ideas.md`).
- `grill` / `align`: Socratic alignment, domain modeling, and ADR recording (`devflow/decisions/`).
- `brainstorm`: Structured divergent & convergent ideation with trade-off matrices.

### C. Workspace & Governance Skills
- `devflow`: Interactive workspace inspector and intent router.
- `doctor`: Read-only health check for setup, adapters, and workflow drift.
- `onboard`: Configure freshly scaffolded projects.
- `adopt`: Bootstrap DevFlow into existing brownfield codebases.
- `overview`: Compile living source of truth from planning docs.
- `brief`: Feature scope and dependency briefing before speccing.
- `audit`: Branch-aware or full-project code and security audit.
- `ci`: Set up single Verify command and GitHub Actions.
- `tests`: Add or normalize unit test suite.
- `release`: Cloud deployment readiness check (Render / Vercel).
- `prototype`: Static HTML/CSS prototype mockups.
- `status`: Progress summary and next action inspector.
- `try`: Manual review testing guide.
- `debug`: Scientific six-phase diagnosis built around a deterministic red-capable feedback loop.
- `report-html`: Generate interactive standalone HTML report dashboard.
- `convert-any-to-md`: Document conversion utility into markdown.

---

## 5. Quality, Governance & Authoring Contracts

- [Workflow surface map](workflow-surface-map.md): canonical command taxonomy and artifacts.
- [Skill selection policy](skill-selection-policy.md): choose the smallest suitable workflow surface.
- [Governance rules](governance-rules.md): public-surface and documentation placement rules.
- [Markdown metadata contract](markdown-metadata-contract.md): frontmatter and semantic heading requirements.
- [Manual review workflow](manual-review-workflow-spec.md): review gates from spec through delivery.
- [Living Spec examples](examples/living-spec/): reference specs, discoveries, ADRs, and ideas.

`/check` applies the Deep Modules standard independently from spec fidelity:
small public interfaces, hidden complexity, stable seams, and no speculative
abstraction. `/debug` diagnoses first and hands confirmed repairs to `/fix` or
`/implement`; it does not edit source during diagnosis.

---

## 6. Web Dashboard & CLI Management

```bash
# Launch interactive Local Dashboard (0ms SSR Hydration & Git Cache)
npx @jakkrichm/create-nexus-devflow dashboard

# Automated Quality Gatekeeper & Pre-commit Hooks
npx @jakkrichm/create-nexus-devflow check-gate [--strict]
npx @jakkrichm/create-nexus-devflow hook install pre-commit

# Model Context Protocol (MCP) Server Hub (12 Native Tools)
npx @jakkrichm/create-nexus-devflow mcp

# Just-In-Time (JIT) Dynamic Context Slicing
npx @jakkrichm/create-nexus-devflow slice --stage implement

# Multi-Agent Swarm & Code Graph RAG
npx @jakkrichm/create-nexus-devflow swarm
npx @jakkrichm/create-nexus-devflow graph --file src/index.ts
```
