# Workspace Artifacts Contract (The 3-Pillars Model)

Nexus-DevFlow 2.0 structures all project artifacts according to **The 3-Pillars Workspace Architecture** and the framework's `markdown-first` contract.

---

## 1. Canonical Folder Layout

```text
devflow/
├── ideas.md                    # 🔮 Future (Backlog): Idea Inbox with AI scoring
├── context/                    # ⚡ Present (Active Context): Single Living Spec & Active State
│   ├── current-feature.md      # Fast-Track Single Living Spec (Active feature/fix/rollback)
│   ├── current-stage.md        # Active stage inspector & Single Active Run Guardrail
│   ├── current-run/            # Deep-Track active stage artifacts (10-define.md to 70-release.md)
│   ├── project-overview.md     # Single Source of Truth
│   ├── coding-standards.md     # Engineering standards & conventions
│   ├── ai-interaction.md       # AI interaction guidelines
│   └── findings.md             # Quality & security findings ledger
├── history/                    # 📦 Past (History Archive): Categorized delivery archives
│   ├── features/               # Shipped features ({xxx-slug}/ or {xxx-slug}.md)
│   ├── fixes/                  # Resolved bug fixes
│   ├── rollbacks/              # Reversal audit logs
│   └── HISTORY.md              # Master release ledger
└── discoveries/                # Pre-delivery discovery records (DISC-xxx/00-explore.md)
```

---

## 2. Temporal Pillars & Responsibilities

| Pillar | Location | Responsibility | Lifecycle & Mutation |
| :--- | :--- | :--- | :--- |
| **🔮 Future (Backlog)** | `devflow/ideas.md` | Idea Inbox, AI feasibility scoring, backlog tags (`[IDEA-xxx]`). | Appended via `/idea` or manual edits. |
| **⚡ Present (Active Context)** | `devflow/context/` | Source of Truth, Active Stage State, Single Living Spec, and Active Run. | Mutated during active delivery; reset to stub on `/complete` or `/70-release`. |
| **📦 Past (History Archive)** | `devflow/history/` | Categorized immutable delivery records (`features/`, `fixes/`, `rollbacks/`) and Master Ledger (`HISTORY.md`). | Appended upon stage completion; immutable. |

---

## 3. Fast-Track vs Deep-Track Artifacts

### A. Fast-Track Artifact: `devflow/context/current-feature.md`
- Acts as the Single Living Spec combining Definition, Spec, Checklist, Verification Evidence, and Review Gates.
- Initialized by `/feature` or `/fix`.
- Updated incrementally by `/implement` and `/check`.
- Archived to `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md` on `/complete`.
- Reset to idle stub upon completion.

### B. Deep-Track Artifacts: `devflow/context/current-run/`
- Contains individual stage markdown contracts:
  - `10-define.md`: Delivery boundary and scope.
  - `20-spec.md`: Formal specification & Given-When-Then acceptance criteria.
  - `30-plan.md`: Executable task breakdown with TDD test decisions.
  - `40-execute.md`: Implementation log and evidence.
  - `50-verify.md`: QA 6-lane verification matrix.
  - `60-report.md`: Delivery digest and retrospective insights.
  - `70-release.md`: Release packaging and verification.
- Archived to `devflow/history/{category}/{xxx-slug}/` on `/70-release`.

---

## 4. Standalone HTML Reporting Policy

- **Markdown-First**: Mainline workflows (`/complete` and `/60-report`) strictly output clean Markdown.
- **On-Demand HTML**: When an interactive dashboard is desired for human presentation or stakeholders, generate it on demand via `/report-html` or:
  ```bash
  npm run report:html -- {RUN_ID}
  ```
