# Master Release History Ledger

This master ledger tracks all released delivery runs, milestones, and rollbacks in chronological order. Each entry is recorded during `/complete` and links to its exact Git commit hash, release status, category, and archived delivery artifacts.

---

## 📜 Master Release Log

| Completed Date | Run ID | Category | Title | Git Commit | Status | Archive Link |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-09-14 | `086` | Fix | Align skill prompts and routing verification | `d212330` (integration) | `Included in v2.17.4` | [`086-align-skill-prompts.md`](fixes/086-align-skill-prompts.md) |

---

## 🗄️ History Categories (The Core 3 Model)

- **`features/`**: New user-facing features, enhancements, architecture migrations, refactoring, and tooling/infra.
- **`fixes/`**: Bug fixes, hotfixes, regressions, security patches, and performance optimizations.
- **`rollbacks/`**: Safe feature reversal and rollback execution records.
