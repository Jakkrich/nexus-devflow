# Nexus-DevFlow Master Release History Ledger

This master ledger tracks all released delivery runs, milestones, and rollbacks in chronological order. Each entry is recorded during the `70-release` stage and links to its exact Git commit hash, release tag, and generated delivery artifacts.

---

## 📜 Release Log

| Release Date | Running ID | Title | Git Tag / Commit | Release Status | Report Link |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-08-20 | `RUN-016` | ระบบบันทึกไอเดียพร้อม AI วิเคราะห์ความเป็นไปได้ (`/idea`) และเชื่อมต่อกับ Status Backlog | `HEAD` | `Released` | [`spec.md`](../runs/RUN-016-idea-capture-inbox-and-status-integration/spec.md) |
| 2026-08-20 | `RUN-015` | Dual-Track Architecture (Fast-Track 4 Steps & Deep-Track 8 Steps) + Living Spec (`spec.md`) + Standalone HTML Report Policy | `HEAD` | `Released` | [`spec.md`](../runs/RUN-015-fast-track-and-living-blueprint/spec.md) |
| 2026-08-20 | `RUN-014` | ยกระดับสถาปัตยกรรม DevFlow สู่ TypeScript และย้ายระบบ Check AI Blueprint Upstream Monitor | `HEAD` | `Released` | [`60-report.md`](../runs/RUN-014-typescript-migration-and-upstream-monitor-for-devflow/60-report.md) |
| 2026-08-20 | `RUN-013` | เพิ่ม Skill `/overview` และระบบ Living Context Sync สำหรับ Nexus-DevFlow | `e30375b` | `Released` | [`60-report.md`](../runs/RUN-013-add-overview-and-context-sync-skill/60-report.md) |
| 2026-08-18 | `RUN-008` | ปรับปรุงโครงสร้าง Nexus-DevFlow ให้ Lean & Clean ยุบรวม Skills บริหารจัดการ History และ Safe Rollback | `be713ea` | `Released` | [`60-report.md`](../runs/RUN-008-lean-and-clean-devflow-optimization/60-report.md) |
| 2026-08-18 | `RUN-007` | ยกระดับระบบ Nexus-DevFlow ด้วยวินัยและกลไกสำคัญจาก Blueprint | `e79528b` | `Released` | [`60-report.md`](../runs/RUN-007-integrate-blueprint-skills-enhancements/60-report.md) |
| 2026-08-18 | `RUN-006` | Standardize Command Naming and Provider Invocation | `HEAD` | `Released` | [`60-report.md`](../runs/RUN-006-standardize-command-naming-and-provider-invocation/60-report.md) |
| 2026-08-18 | `RUN-005` | Add DevFlow Prefix to Skill Descriptions | `HEAD` | `Released` | [`60-report.md`](../runs/RUN-005-add-devflow-prefix-to-skill-descriptions/60-report.md) |
| 2026-08-18 | `RUN-004` | Add Autopilot Skill | `HEAD` | `Released` | [`60-report.md`](../runs/RUN-004-add-autopilot-skill/60-report.md) |
| 2026-08-18 | `RUN-003` | Add Try, Rollback, CI, Brief Skills | `HEAD` | `Released` | [`60-report.md`](../runs/RUN-003-add-try-rollback-ci-brief-skills/60-report.md) |
| 2026-08-18 | `RUN-002` | Add Onboard, Adopt, Doctor Skills | `HEAD` | `Released` | [`60-report.md`](../runs/RUN-002-add-onboard-adopt-doctor-skills/60-report.md) |
| 2026-08-18 | `RUN-001` | Align DevFlow with Blueprint Architecture | `HEAD` | `Released` | [`60-report.md`](../runs/RUN-001-align-devflow-blueprint/60-report.md) |

---

## 🗄️ Run Lifecycle States

- **Active**: Currently executing in `devflow/runs/{running-id}-{slug}/` (tracked in `devflow/context/current-stage.md`).
- **Released**: Finished `70-release`, merged, and logged in this master ledger.
- **Archived**: Older historical runs moved to `devflow/history/archived-runs/` to maintain a clean workspace.
- **Rolled Back**: Features safely reversed via `/rollback` with documented post-reversal verification.
