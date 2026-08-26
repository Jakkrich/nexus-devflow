# DevFlow 2.6.0 Running ID & 3-Pillars Multi-Run Context Contract

## The 3-Pillars Workspace Architecture

All DevFlow framework assets are organized into three clean pillars representing Future, Present, and Past:

```text
devflow/
├── 🔮 ideas.md                 # [1. Future / Backlog] Centralized Idea Inbox with AI scoring
├── 🗺️ project-plan.md          # [1. Future] Master product roadmap and system vision
├── 📋 build-plan.md            # [1. Future] User-owned feature queue and sizing
│
├── ⚡ context/                  # [2. Present / Active] Living Source of Truth & Multi-Run Contexts
│   ├── project-overview.md     # Primary source of truth for project architecture and tech stack
│   ├── coding-standards.md     # Engineering, code quality, TDD, and testing standards
│   ├── ai-interaction.md       # AI agent interaction rules, unified living spec flow, and Thai defaults
│   ├── glossary.md             # Domain glossary and architecture vocabulary
│   ├── current-feature.md      # Active Living Spec pointer / legacy fallback
│   ├── current-stage.md        # Active state pointer and run tracker
│   ├── findings.md             # Shared/default audit findings ledger (P0-P3)
│   │
│   ├── {xxx-slug}/             # Active Run Workspace & Spec Queue (Multi-Run Active Task)
│   │   ├── spec.md             # Living Spec + Checklist for this run
│   │   ├── stage.md            # Runtime stage, track, and branch pointer
│   │   └── findings.md         # Dedicated audit findings ledger for this run
│   └── ...
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
- **Format**: `xxx-slug` (e.g. `001-setup-auth`, `058-multi-run-context-architecture`)
- **Prefix Removal**: The legacy `RUN-` prefix is discontinued in favor of clean 3-digit sequential numbering.
- **Git Branch Standard**: `feature/{xxx-slug}` or `fix/{xxx-slug}` (or specific release branches such as `2.6.0`).

### 2. Sub-Feature Running IDs (`xxx[a-z]-slug`)
- **Format**: `xxx[a-z]-slug` (e.g. `038a-backend-schema-and-api`, `038b-frontend-ui-and-state`)
- **Git Branch Standard**: `feature/{xxx[a-z]-slug}`
- **Build Plan Notation**: `- [ ] 4a. Backend Schema...`, `- [ ] 4b. Frontend UI...`
- **When to Use**: Used when a feature is decomposed via the **Sub-Feature Automatic Splitting Engine** to prevent context overflow on `L`/`XL` tasks.

---

## Multi-Run Spec Queue & Selective Execution Rule

1. **Spec-Ahead & Non-blocking Drafting**:
   - `/feature [id / title]` and `/fix [title]` create dedicated run folders at `devflow/context/{xxx-slug}/`.
   - Creating a spec does **not block** drafting additional specs. Multiple specs can reside in `devflow/context/` simultaneously.
2. **Selective Execution (`/implement [id]`)**:
   - Spec execution can be invoked targeting a specific ID (e.g. `/implement 12`, `/implement 012`, or `/implement kanban`).
   - The AI checks out the matching git branch `feature/{xxx-slug}`, loads only that run's `spec.md` and global context, and executes tasks with Strict TDD.
3. **Dedicated Quality Ledger & Safe Archival (`/complete [id]`)**:
   - Each run maintains its own `findings.md` within `devflow/context/{xxx-slug}/`.
   - `/complete` compiles the living spec, archives it to `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`, removes `devflow/context/{xxx-slug}/`, updates `HISTORY.md` and `build-plan.md`, and prompts for squash-merge/PR.

