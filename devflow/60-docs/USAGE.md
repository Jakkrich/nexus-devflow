# Nexus-DevFlow 2.13.0 Comprehensive Usage Guide

This guide provides full operating instructions for **Nexus-DevFlow 2.13.0 (The 3-Pillars Workspace Architecture & Pure Task-Isolated Living Spec Model)** across Google Antigravity, OpenAI Codex, Claude Code, Cursor, GitHub Copilot, and related AI development environments.

---

## 1. Core Architecture: The 3-Pillars Model

Nexus-DevFlow structures development history and active context into three distinct temporal pillars:

1. **🔮 Future (Backlog)**: [`devflow/ideas.md`](../ideas.md), [`devflow/project-plan.md`](../project-plan.md), [`devflow/build-plan.md`](../build-plan.md)
   - Centralized Idea Inbox with AI feasibility, value scoring, and priority tagging (`[IDEA-xxx]`).
   - Product vision and master build-plan sequencing.
   - Quick idea capture via `/idea {description}`.
2. **⚡ Present (Active Context)**: `devflow/context/`
   - Global Shared Source of Truth: `project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `glossary.md`.
   - **Task-Isolated Workspaces**: `devflow/context/{xxx-slug}/`
     - `spec.md`: The Living Spec, task checklist, and empirical proof.
     - `stage.md`: Stage pointer and transition state.
     - `findings.md`: Dedicated quality, security, and Fowler smell findings ledger.
3. **📦 Past (History Archive)**: `devflow/history/`
   - Categorized delivery archives: `features/`, `fixes/`, `rollbacks/`.
   - Master Release Ledger: `HISTORY.md`.

---

## 2. The Unified 4-Stage Living Spec Lifecycle

All development tasks execute through the progressive 4-stage task-isolated living spec lifecycle:

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

| Step | Command | Artifact | Description |
| :--- | :--- | :--- | :--- |
| **1. Spec** | `/feature {title}`<br>`/fix {bug}` | `context/{xxx-slug}/spec.md` | Allocates sequential ID (`xxx-slug`), initializes task workspace, writes living spec behind review gate. |
| **2. Build** | `/implement [id]` | `context/{xxx-slug}/spec.md` | Executes tasks incrementally with strict TDD discipline (Red-Green-Refactor) and evidence recording. |
| **3. Verify**| `/check [id]` | `context/{xxx-slug}/spec.md` | Dual-Axis review: empirical spec fidelity plus independent standards, architecture, and quality gates. |
| **4. Deliver** | `/complete [id]` | `history/{cat}/{xxx-slug}.md` | Final safety audit, records Release Digest, archives living spec, cleans active task folder, squash-merges branch. |

---

## 3. Pre-Flight Discovery, SA & Architectural Alignment Suite

Before committing to delivery, use specialized companion skills:

```text
/analyze ──▶ /idea (Inbox) ──▶ /grill (Socratic ADR) ──▶ /discovery (Explore) ──▶ /feature (Deliver)
```

- **`/analyze`**: Multi-format requirement ingestion (PDF, Word, Excel, Images), Codebase Impact scan & Socratic Gap checklist.
- **`/idea`**: Capture raw ideas in `devflow/ideas.md` with instant AI feasibility scoring.
- **`/grill`** (or **`/align`**): Socratic alignment & domain modeling; records Architecture Decision Records (`devflow/decisions/ADR-xxx.md`).
- **`/brainstorm`**: Structured ideation with trade-off analysis.
- **`/discovery`**: Deep inception and exploratory discovery (`devflow/discoveries/DISC-xxx.md`).

---

## 4. Core Skills Inventory (32 Skills)

DevFlow ships **32 bundled Core Skills** from the ordered `core_skills` inventory
in `agent-bundle.manifest.json`, synchronized 1:1 across `.agents/skills/`
(Codex / Antigravity / Copilot) and `.claude/skills/` (Claude Code). Local or
Personal Skills may coexist in a workspace, but are excluded from the Core count
and package template until explicitly promoted.

### A. Lifecycle Delivery Skills (8 Skills)
- `feature`: Turn a build-plan item or new idea into a task-isolated living spec (`devflow/context/{xxx-slug}/spec.md`).
- `fix`: Document and spec an ad-hoc bug or issue into `devflow/context/{xxx-slug}/spec.md`.
- `implement`: Step-by-step TDD implementation behind review gates.
- `check`: Dual-Axis verification of observable spec behavior and independent architecture/standards quality.
- `complete`: Final safety audit, Conventional Commit, archiving, and branch delivery gate.
- `autopilot`: Bounded single-pass delivery loop with self-review and safe repair.
- `continuous`: Autonomous serial multi-feature delivery loop completing build-plan items with quality gates.
- `rollback`: Plan a safe reversal of a completed feature preserving history.

### B. Pre-Flight Discovery, SA & Alignment Skills (5 Skills)
- `analyze`: Multi-format requirement ingestion (PDF, Word, Excel, Images), Codebase Impact scan & Socratic Gap checklist.
- `discovery`: Inception exploration and deep multi-turn planning (`devflow/discoveries/`).
- `idea`: Quick idea capture and AI feasibility scoring (`devflow/ideas.md`).
- `grill` / `align`: Socratic alignment, domain modeling, and ADR recording (`devflow/decisions/`).
- `brainstorm`: Structured divergent & convergent ideation with trade-off matrices.

### C. Workspace & Governance Skills (19 Skills)
- `devflow`: Interactive workspace inspector and intent router.
- `doctor`: Read-only health check for setup, adapters, and workflow drift.
- `onboard`: Configure freshly scaffolded projects.
- `adopt`: Bootstrap DevFlow into existing brownfield codebases.
- `overview`: Compile living source of truth from planning docs.
- `brief`: Feature scope and dependency briefing before speccing.
- `audit`: Branch-aware or full-project code and security audit.
- `bughunter`: Offensive security orchestrator, 83 vulnerability patterns & CVE payloads.
- `ci`: Set up single Verify command and GitHub Actions.
- `test`: Test suite runner and coverage analyzer.
- `setup-tests`: Add or normalize unit test suite.
- `browser-tests`: Add or normalize Playwright browser test harness & connect with MCP browseros-neo.
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

### Debugging, TDD & Review Reference Guides

The `debug`, `implement`, and `audit` skills include five English reference guides.
They are supporting files read when needed, not additional commands. Both
`.agents/skills/` and `.claude/skills/` contain matching copies; no separate
Superpowers plugin installation is required.

| Situation | Entry point | Reference guide |
| :--- | :--- | :--- |
| Error deep in a call stack or unclear input origin | `/debug` Phase 4 | [Root-cause tracing](../../.agents/skills/debug/root-cause-tracing.md) |
| Confirmed root cause needs protective checks | `/debug` repair planning → `/fix` → `/implement` | [Defense-in-depth](../../.agents/skills/debug/defense-in-depth.md) |
| Flaky async tests or guessed sleep delays | `/debug` Phase 4 | [Condition-based waiting](../../.agents/skills/debug/condition-based-waiting.md) |
| Planning RED/GREEN or inspecting test quality | `/implement [id]` | [TDD anti-patterns](../../.agents/skills/implement/tdd-anti-patterns.md) |
| Preparing an independent review | `/audit independent current` | [Two-stage review template](../../.agents/skills/audit/two-stage-review-template.md) |

**Debugging:** Trace the trigger before planning a repair. Use validation layers
according to actual invariants and risks, and keep diagnostic output redacted.
The waiting example accepts synchronous predicates only; async I/O needs an
appropriate async helper with cancellation or timeout. `/debug` remains a
diagnostic stage. After three unsuccessful repair attempts in the supplied
history, stop and discuss the architecture before attempting another fix.

**Implementation:** Apply the Iron Law to behavior changes according to the
spec's test decision: observe the intended failing test before production code.
Confirm that RED reflects missing behavior rather than broken setup, implement
the minimum change for GREEN, then refactor with tests passing. Preserve existing
user work; verify documentation or configuration without logic as the spec directs.

**Review:** Check spec compliance first, then code quality only after Stage 1
passes. Use the template alongside the canonical
[independent-review contract](../../.agents/skills/audit/reference/independent-review.md).
The configured gate still determines whether review runs, and its request,
immutable checkpoint, reviewer identity, and receipt requirements remain in force.
Open or fixed P0/P1 findings continue to block completion.

Example prompts (use `$debug` and `$implement` in Codex where appropriate):

```text
/debug "This async test passes locally but times out in CI; inspect its waiting conditions"
/implement 085
/audit independent current
```

Replace `085` with your active task ID. For the review prompt, ask the reviewer
to use `audit/two-stage-review-template.md` with the canonical receipt contract;
the template does not launch a reviewer or authorize a checkpoint commit itself.

---

## 6. Web Dashboard & CLI Management

```bash
# Launch interactive Local Dashboard (0ms SSR Hydration & Git Cache)
npx @jakkrichm/create-nexus-devflow dashboard

# Check active project status across 3-Pillars
npx @jakkrichm/create-nexus-devflow status

# Automated Quality Gatekeeper
npx @jakkrichm/create-nexus-devflow gate [--strict]

# Model Context Protocol (MCP) Server Hub
npx @jakkrichm/create-nexus-devflow mcp

# Just-In-Time (JIT) Dynamic Context Slicing
npx @jakkrichm/create-nexus-devflow slice --stage implement

# Multi-Agent Swarm & Code Graph RAG
npx @jakkrichm/create-nexus-devflow swarm
npx @jakkrichm/create-nexus-devflow graph --file src/index.ts
```
