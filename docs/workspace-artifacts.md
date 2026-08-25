# Workspace Artifacts Contract (The 3-Pillars Model)

Nexus-DevFlow 2.6.0 structures all project artifacts according to **The 3-Pillars Workspace Architecture & Single Living Spec Model**.

---

## 1. Canonical Folder Layout

```text
devflow/
├── ideas.md                    # 🔮 Future (Backlog): Idea Inbox with AI scoring
├── context/                    # ⚡ Present (Active Context): Single Living Spec & Active State
│   ├── current-feature.md      # The Single Living Spec (Active feature/fix/rollback or idle stub)
│   ├── current-stage.md        # Active stage inspector & Single Active Run Guardrail
│   ├── project-overview.md     # Single Source of Truth
│   ├── coding-standards.md     # Engineering standards & conventions
│   ├── ai-interaction.md       # AI interaction guidelines
│   ├── findings.md             # Quality & security findings ledger
│   └── glossary.md             # Domain glossary & architecture terms
├── decisions/                  # 🏛️ Decisions: Architecture Decision Records (ADR-xxx.md)
├── history/                    # 📦 Past (History Archive): Categorized delivery archives
│   ├── features/               # Shipped features ({xxx-slug}.md)
│   ├── fixes/                  # Resolved bug fixes ({xxx-slug}.md)
│   ├── rollbacks/              # Reversal audit logs (YYYY-MM-DD-{xxx-slug}.md)
│   └── HISTORY.md              # Master release ledger
└── discoveries/                # 🔍 Discoveries: Pre-delivery discovery records (DISC-xxx.md)
```

---

## 2. Temporal Pillars & Responsibilities

| Pillar | Location | Responsibility | Lifecycle & Mutation |
| :--- | :--- | :--- | :--- |
| **🔮 Future (Backlog)** | `devflow/ideas.md` | Idea Inbox, AI feasibility scoring, backlog tags (`[IDEA-xxx]`). | Appended via `/idea` or manual edits. |
| **⚡ Present (Active Context)** | `devflow/context/` | Source of Truth, Active Stage State, and the Single Living Spec (`current-feature.md`). | Mutated during active delivery; reset to stub on `/complete`. |
| **📦 Past (History Archive)** | `devflow/history/` | Categorized immutable delivery records (`features/`, `fixes/`, `rollbacks/`) and Master Ledger (`HISTORY.md`). | Appended upon stage completion; immutable. |

---

## 3. The Single Living Spec Contract (`current-feature.md`)

- **Single Living Spec**: Combines Definition, Technical Spec, TDD Checklist, Implementation Log, Multi-Lane Verification Matrix, and Release Digest in one living file.
- **Initialized**: By `/feature` or `/fix`.
- **Updated Incrementally**: By `/implement` and `/check`.
- **Archived**: To `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md` on `/complete`.
- **Reset**: To the idle reset stub upon completion.
