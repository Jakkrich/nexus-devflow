# Master Release History Ledger

This master ledger tracks all released delivery runs, milestones, and rollbacks in chronological order. Each entry is recorded during `/complete` and links to its exact Git commit hash, release status, category, and archived delivery artifacts.

---

## 📜 Master Release Log

| Completed Date | Run ID | Category | Title | Git Commit | Status | Archive Link |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-09-16 | `090` | Feature | Align Documentation Site & Complete 46 Pages Content Taxonomy | `46d5dc8` | `Completed` | [`090-docs-getting-started-alignment.md`](features/090-docs-getting-started-alignment.md) |
| 2026-09-16 | `089` | Feature | Clone & Adapt ai-blueprint.dev UI for Nexus-DevFlow Documentation | `dba9130` | `Completed` | [`089-clone-ai-blueprint-ui.md`](features/089-clone-ai-blueprint-ui.md) |
| 2026-09-16 | `088` | Feature | Sync Upstream AI Blueprint v1.7.0–v1.9.0 | `9d73f9e` | `Completed` | [`088-sync-upstream-ai-blueprint-v170-v190.md`](features/088-sync-upstream-ai-blueprint-v170-v190.md) |
| 2026-09-14 | `087` | Fix | Prevent unused devflow/runs from client install | `383fff0` | `Completed` | [`087-remove-unused-installer-folders.md`](fixes/087-remove-unused-installer-folders.md) |
| 2026-09-14 | `086` | Fix | Align skill prompts and routing verification | `d212330` (integration) | `Included in v2.17.4` | [`086-align-skill-prompts.md`](fixes/086-align-skill-prompts.md) |

---

## 🗄️ History Categories (The Core 3 Model)

- **`features/`**: New user-facing features, enhancements, architecture migrations, refactoring, and tooling/infra.
- **`fixes/`**: Bug fixes, hotfixes, regressions, security patches, and performance optimizations.
- **`rollbacks/`**: Safe feature reversal and rollback execution records.
