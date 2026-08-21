# Project Overview & Source of Truth

> Living context artifact automatically synchronized with codebase reality and DevFlow delivery history.

---

## 1. Project Purpose & Target Users

- **Application Name**: Nexus-DevFlow
- **Core Mission**: Production-grade Agentic Workflow Layer supporting **The 3-Pillars Workspace Architecture & Dual-Track Delivery** (Fast-Track Single Living Spec & Deep-Track Architect Stages), universal multi-AI IDE adapters (`.agents` for Google Antigravity & OpenAI Codex, `.claude` for Claude Code), upstream AI Blueprint monitor, and native terminal diagnostics CLI.
- **Target Audience**: AI coding assistants (Google Antigravity, OpenAI Codex, Claude Code, Cursor, Windsurf) and software engineering teams building test-driven, spec-driven agentic software delivery pipelines.
- **Key Differentiator**: Unifies high-velocity daily task execution (**Fast-Track: 4 Steps with Single Living Spec**) and high-governance architectural epics (**Deep-Track: 8 Steps**), backed by strict Empirical Proof Contracts and zero-ceremony automation.

---

## 2. Architecture & Directory Layout

```text
nexus-devflow/
├── .agents/skills/             # OpenAI Codex & Google Antigravity skill adapters (28 lean skills)
├── .claude/skills/             # Claude Code skill adapters (28 lean skills, synchronized 1:1)
├── .github/workflows/          # Automated GitHub Actions (Upstream monitor, CI checks)
├── .nexus/                     # Metadata manifests and upstream tracking configuration
│
├── devflow/                    # 🏛️ The 3-Pillars Workspace Architecture
│   ├── 🔮 ideas.md             # [1. Future] Centralized Idea Inbox with AI scoring & backlog
│   ├── ⚡ context/              # [2. Present] Living source of truth & active work state
│   │   ├── project-overview.md # Primary living source of truth (this document)
│   │   ├── coding-standards.md # Engineering, code quality, TDD, and test standards
│   │   ├── ai-interaction.md   # AI agent interaction rules, dual-track flow, and Thai defaults
│   │   ├── findings.md         # Open and resolved audit findings ledger (P0-P3)
│   │   ├── current-stage.md    # Active stage run pointer and state tracker
│   │   ├── current-feature.md  # Fast-Track Single Living Spec (Active work / stub when idle)
│   │   └── current-run/        # Deep-Track Active Run folder (Temporary during execution)
│   ├── 📦 history/              # [3. Past] Permanent delivery & release archives
│   │   ├── features/           # Completed features, migrations, tooling (001-xxx ... 021-xxx)
│   │   ├── fixes/              # Completed bug fixes, hotfixes, security patches
│   │   ├── rollbacks/          # Completed feature reversals and rollback records
│   │   └── HISTORY.md          # Master release history ledger summary table
│   ├── 🔍 discoveries/          # Pre-delivery discovery records (DISC-YYYYMMDD-NNN-slug/)
│   └── 📚 reference/            # Architectural contracts and specifications
│
├── packages/
│   └── create-nexus-devflow/   # Core installer & CLI distribution package (@jakkrichm/create-nexus-devflow)
│       ├── bin/                # CLI entry points (create-nexus-devflow, nexus-devflow, devflow)
│       ├── lib/                # Core engines (current-work, status, findings, git, uninstall, update)
│       ├── test/               # Automated unit tests suite (21/21 passing)
│       └── dist/               # Compiled ESM binaries
│
└── scripts/                    # Maintainer verification, static checks, evals, and HTML renderer
    ├── check-devflow.ts        # Master verification gate orchestrator
    ├── validate-framework.ts   # Static framework and stage contract validator
    ├── smoke-package.ts        # Package tarball packaging and overlay smoke test
    ├── upstream-monitor.ts     # AI Blueprint upstream release monitor
    ├── evals/routing.ts        # TF-IDF skill routing evaluation engine (312 test cases)
    └── lib/render-html/        # Standalone HTML report renderer
```

---

## 3. Technology Stack & Key Tooling

| Category | Technology / Tool | Purpose / Configuration |
| :--- | :--- | :--- |
| **Runtime & Core** | Node.js (>=18.17 / Node 22+ LTS) | Modern Node.js runtime with native ESM support (`"type": "module"`) |
| **Language** | TypeScript 5.7 | Strict typechecking across CLI, maintainer scripts, and tests |
| **Execution Engine** | `tsx` | High-speed TypeScript execution and native test runner |
| **Compiler** | `tsc` | Production build pipeline compiling to `dist/` |
| **Distribution Package** | `@jakkrichm/create-nexus-devflow` | Zero-dependency CLI installer supporting `install`, `update`, `status`, `uninstall`, `eject` |
| **AI Adapters** | Universal Multi-IDE | Synchronized `.agents/` (Antigravity/Codex) and `.claude/` (Claude Code) |
| **Testing** | Node.js Test Runner (`node:test`) | Fast, native unit test runner with 21 test suites |
| **Upstream Monitor** | GitHub Actions | Periodic automated diff check against `aiblueprinthq/ai-blueprint` |

---

## 4. Concrete Data Models & Entities

### 1. `CurrentWorkSummary` (`lib/current-work.ts`)
```typescript
interface CurrentWorkSummary {
  state: "active" | "idle" | "empty";
  type: "feature" | "fix" | "rollback" | "stage" | null;
  runningId: string | null;
  title: string | null;
  specPath: string | null;
  statusText: string | null;
  branch: string | null;
  steps: CurrentWorkStep[];
  completed: number;
  remaining: number;
  total: number;
  nextStep: CurrentWorkStep | null;
  warnings: CurrentWorkWarning[];
}
```

### 2. `ProjectStatus` (`lib/status.ts`)
```typescript
interface ProjectStatus {
  schemaVersion: 1;
  projectRoot: string;
  projectName: string;
  version: string | null;
  adapters: string[];
  manifest: ProjectManifest | null;
  currentWork: CurrentWorkSummary;
  findings: FindingsSummary;
  git: GitStatusSummary;
  recommendation: StatusRecommendation;
}
```

### 3. `FindingsSummary` (`lib/findings.ts`)
```typescript
interface FindingsSummary {
  total: number;
  open: number;
  fixed: number;
  closed: number;
  blockers: FindingItem[]; // P0/P1 in open or fixed state
}
```

---

## 5. Shipped Capabilities & Milestones

- **`021` (2026-08-21)**: **The 3-Pillars Workspace Architecture**: Categorized history (`features/`, `fixes/`, `rollbacks/`), eliminated `devflow/runs/`, migrated sequential IDs to `xxx-slug`, placed Fast-Track living spec in `devflow/context/current-feature.md`, and installed Single Active Run Guardrail.
- **`020` (2026-08-20)**: **Clean Eject & Uninstall CLI**: Subcommands (`nexus-devflow uninstall` / `eject`), complete footprint removal engine, safety flags (`--dry-run`, `-y`, `--keep-history`, `--json`), and 20/20 unit tests.
- **`019` (2026-08-20)**: **Native Terminal Status CLI**: Subcommand (`nexus-devflow status` / `create-nexus-devflow status`), project root detection, metadata & findings parser, and AI Blueprint v0.9.1 baseline synchronization.
- **`018` (2026-08-20)**: **Documentation Overhaul**: Dual-Track Architecture guides (`README.md`, `README.th.md`, and context files).
- **`017` (2026-08-20)**: **Fast-Track Separation**: Dedicated `/feature` and `/fix` skills, and renamed Deep-Track stage 40 to `40-execute`.
- **`016` (2026-08-20)**: **Idea Inbox & AI Feasibility Scoring**: Quick Idea Capture (`/idea`) with centralized Idea Inbox (`devflow/ideas.md`).
- **`015` (2026-08-20)**: **Dual-Track Delivery Architecture**: Fast-Track (4 Steps with Living Spec) & Deep-Track (8 Steps) + Standalone HTML Reporting Policy.
- **`014` (2026-08-20)**: **TypeScript Architecture Migration**: Upgraded DevFlow to strict TypeScript and integrated AI Blueprint Upstream Monitor workflow.
- **`001`–`013` (2026-08-18)**: **Foundation & Adapter Ecosystem**: Blueprint alignment, onboard, adopt, doctor, try, rollback, ci, brief, autopilot, and context sync.

---

## 6. Verified Commands & Developer Workflow

- **Master Verification Gate**: `npm run check` (TypeScript Typecheck, static contract validation, skill routing evals, installer unit tests, packed tarball smoke test)
- **Unit Tests Suite**: `npm test` (Runs all 21 unit test suites in `packages/create-nexus-devflow/`)
- **Static Contract Check**: `npm run check:static` (Validates stage templates, skill schemas, and upstream contracts)
- **Skill Adapter Synchronization**: `npm run sync:adapters` (Synchronizes `.agents/skills/` ➔ `.claude/skills/`)
- **Package Smoke Test**: `npm run test:package` (Packs tarball and tests fresh overlay installation)
- **Status CLI**: `node packages/create-nexus-devflow/dist/bin/create-nexus-devflow.js status`

---

## 7. Known Architectural Focus Areas

1. **Backlog & Planning Flexibility**: Support both Agile dynamic intake via `devflow/ideas.md` and phased long-term planning via `devflow/build-plan.md` seamlessly.
2. **Upstream Alignment**: Continuously monitor upstream AI Blueprint releases to adopt non-breaking workflow enhancements while preserving DevFlow's 3-Pillars & Dual-Track model.
3. **IDE Adapter Parity**: Maintain 100% feature parity between OpenAI Codex / Google Antigravity IDE and Claude Code adapter distributions.
