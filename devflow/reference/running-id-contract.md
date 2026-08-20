# DevFlow 2.0 Running ID & 3-Pillars Workspace Contract

## The 3-Pillars Workspace Architecture

All DevFlow framework assets are organized into three clean pillars representing Future, Present, and Past:

```text
devflow/
├── 🔮 ideas.md                 # [1. Future / Backlog] Centralized Idea Inbox with AI scoring
│
├── ⚡ context/                  # [2. Present / Active] Living Source of Truth & Active Work
│   ├── project-overview.md     # Primary source of truth for project architecture and tech stack
│   ├── coding-standards.md     # Engineering, code quality, TDD, and testing standards
│   ├── ai-interaction.md       # AI agent interaction rules, dual-track flow, and Thai defaults
│   ├── findings.md             # Open and resolved audit findings ledger (P0-P3)
│   ├── current-stage.md        # Active state pointer and run tracker
│   ├── current-feature.md      # Fast-Track Single Living Spec (Active work / stub when idle)
│   └── current-run/            # Deep-Track Active Run folder (Temporary during 10-70 execution)
│
├── 📦 history/                  # [3. Past / Completed] Permanent Delivery & Release Archives
│   ├── features/               # Completed features, architecture migrations, tooling (xxx-slug.md or xxx-slug/)
│   ├── fixes/                  # Completed bug fixes, hotfixes, security patches (xxx-slug.md)
│   ├── rollbacks/              # Completed feature reversals (YYYY-MM-DD-xxx-slug.md)
│   └── HISTORY.md              # Master release ledger summary table
│
└── 🔍 discoveries/              # Pre-delivery discovery records (DISC-YYYYMMDD-NNN-slug/00-discover.md)
```

## Running ID Naming Convention

- **Format**: `xxx-slug` (e.g. `001-setup-auth`, `021-categorized-history-and-clean-living-spec-architecture`)
- **Prefix Removal**: The legacy `RUN-` prefix is discontinued in favor of clean 3-digit sequential numbering.
- **Git Branch Standard**: `feature/{xxx-slug}` or `fix/{xxx-slug}`.

## Single Active Run Rule (One Thing at a Time)

1. Only **one active run** is permitted at any given time across both Fast-Track and Deep-Track.
2. Before opening a new run (`/feature`, `/fix`, or `10-define`), the AI checks `current-stage.md` and `current-feature.md`.
3. If an active run is in progress, the AI **blocks** starting a new task and requires closing the active run via `/complete` or `70-release` (or explicitly cancelling/rolling back).
