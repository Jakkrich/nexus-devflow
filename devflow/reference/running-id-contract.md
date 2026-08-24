# DevFlow 2.5.0 Running ID & 3-Pillars Workspace Contract

## The 3-Pillars Workspace Architecture

All DevFlow framework assets are organized into three clean pillars representing Future, Present, and Past:

```text
devflow/
├── 🔮 ideas.md                 # [1. Future / Backlog] Centralized Idea Inbox with AI scoring
│
├── ⚡ context/                  # [2. Present / Active] Living Source of Truth & Active Work
│   ├── project-overview.md     # Primary source of truth for project architecture and tech stack
│   ├── coding-standards.md     # Engineering, code quality, TDD, and testing standards
│   ├── ai-interaction.md       # AI agent interaction rules, unified living spec flow, and Thai defaults
│   ├── findings.md             # Open and resolved audit findings ledger (P0-P3)
│   ├── glossary.md             # Domain glossary and architecture vocabulary
│   ├── current-stage.md        # Active state pointer and run tracker
│   └── current-feature.md      # Single Living Spec (Active work / stub when idle)
│
├── 📦 history/                  # [3. Past / Completed] Permanent Delivery & Release Archives
│   ├── features/               # Completed features, architecture migrations, tooling (xxx-slug.md)
│   ├── fixes/                  # Completed bug fixes, hotfixes, security patches (xxx-slug.md)
│   ├── rollbacks/              # Completed feature reversals (YYYY-MM-DD-xxx-slug.md)
│   └── HISTORY.md              # Master release ledger summary table
│
├── 🔍 discoveries/              # Pre-delivery discovery records (DISC-YYYYMMDD-NNN-slug/discovery.md)
└── 🏛️ decisions/                # Architecture Decision Records (ADR-xxx-slug.md)
```

---

## Running ID Naming Convention

### 1. Standard Running IDs
- **Format**: `xxx-slug` (e.g. `001-setup-auth`, `053-unify-deep-and-fast-track-model`)
- **Prefix Removal**: The legacy `RUN-` prefix is discontinued in favor of clean 3-digit sequential numbering.
- **Git Branch Standard**: `feature/{xxx-slug}` or `fix/{xxx-slug}` (or specific release branches such as `2.5.0`).

### 2. Sub-Feature Running IDs (`xxx[a-z]-slug`)
- **Format**: `xxx[a-z]-slug` (e.g. `038a-backend-schema-and-api`, `038b-frontend-ui-and-state`)
- **Git Branch Standard**: `feature/{xxx[a-z]-slug}`
- **Build Plan Notation**: `- [ ] 4a. Backend Schema...`, `- [ ] 4b. Frontend UI...`
- **When to Use**: Used when a feature is decomposed via the **Sub-Feature Automatic Splitting Engine** to prevent context overflow on `L`/`XL` tasks.

---

## Multi-Factor Sizing Heuristic & Splitting Engine

A feature is considered **Oversized (`L` or `XL`)** and recommended for sub-feature splitting when any of the following conditions are met:
1. **Files Touched**: Predicted to modify or create $\ge 6$ files.
2. **Architectural Layers**: Crosses $\ge 3$ distinct layers (e.g. Database Migrations + Backend APIs + Frontend UI + State Store).
3. **Task Complexity**: Contains $\ge 6$ checklist tasks or involves heavy multi-service integrations.

When detected during `/feature` or `/brief`, the AI triggers the **Interactive Split Gate**, proposing a clean `4a`, `4b` sub-feature breakdown before opening the first spec.

---

## Single Active Run Rule (One Thing at a Time)

1. Only **one active run** is permitted at any given time in `current-feature.md`.
2. Before opening a new run (`/feature` or `/fix`), the AI checks `current-stage.md` and `current-feature.md`.
3. If an active run is in progress, the AI **blocks** starting a new task and requires closing the active run via `/complete` (or explicitly cancelling/rolling back).
