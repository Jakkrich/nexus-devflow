# Nexus-DevFlow Master Release History Ledger

This master ledger tracks all released delivery runs, milestones, and rollbacks in chronological order. Each entry is recorded during `/complete` or `70-release` and links to its exact Git commit hash, release status, category, and archived delivery artifacts.

---

## 📜 Master Release Log

| Completed Date | Run ID | Category | Title | Git Commit | Status | Archive Link |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-08-22 | `028` | Feature | ซิงก์ AI Blueprint Upstream v0.11.1 (Dashboard Accessibility & Health Status Clarification) | `HEAD` | `Released` | [`028-sync-upstream-v0111.md`](features/028-sync-upstream-v0111.md) |
| 2026-08-21 | `027` | Feature | รวม Skill การแปลงเอกสารทุกชนิดเป็น `convert-any-to-md` พร้อม Default Destination `devflow/reference/` | `HEAD` | `Released` | [`027-convert-any-to-md.md`](features/027-convert-any-to-md.md) |
| 2026-08-21 | `026` | Feature | เพิ่มการสนับสนุน Fast-Track และ Flow Icons ให้กับ DevFlow IDE Extension / QuickPick & Status Bar UI | `HEAD` | `Released` | [`60-report.md`](features/026-fast-track-and-flow-icons-extension-ui/60-report.md) |
| 2026-08-21 | `025` | Feature | เพิ่ม Micro-animations, JS State Diffing, และ Reduced Motion ให้กับ Live Dashboard | `HEAD` | `Released` | [`025-dashboard-animations.md`](features/025-dashboard-animations.md) |
| 2026-08-21 | `024` | Feature | ซิงก์ AI Blueprint Upstream v0.11.0 (Copilot Adapter & Live DevFlow Dashboard UI) | `HEAD` | `Released` | [`024-sync-upstream-v0110.md`](features/024-sync-upstream-v0110.md) |
| 2026-08-21 | `023` | Feature | ปรับโครงสร้าง Skills ให้ Lean (เหลือ 28 Core Skills), ดูดซับ Best Practices, และตัด Cheatsheet Skills ออก | `8457b13` | `Released` | [`60-report.md`](features/023-prune-unused-skills-and-consolidate/60-report.md) |
| 2026-08-21 | `022` | Feature | อัปเดตเอกสารคู่มือและ Reference ให้ครอบคลุม DevFlow v2.0.20 (The 3-Pillars Model, Dual-Track & Migration Guide) | `HEAD` | `Released` | [`022-update-documentation-and-guides-for-v2-0-20.md`](features/022-update-documentation-and-guides-for-v2-0-20.md) |
| 2026-08-21 | `021` | Feature | สถาปัตยกรรม 3 เสาหลัก (The 3-Pillars Model), Categorized History, ตัด `runs/`, ใช้ ID `xxx-slug`, และ Single Active Run Guardrail | `HEAD` | `Released` | [`60-report.md`](features/021-categorized-history-and-clean-living-spec-architecture/60-report.md) |
| 2026-08-20 | `020` | Feature | คำสั่ง Uninstall / Eject สำหรับถอนการติดตั้งไฟล์ DevFlow ออกจากโปรเจกต์อย่างหมดจด (Clean Eject) | `HEAD` | `Released` | [`current-feature.md`](features/020-uninstall-and-eject-devflow-cli/current-feature.md) |
| 2026-08-20 | `019` | Feature | ซิงก์ฟีเจอร์ Status CLI, Project Detection, Unit Tests และ Upstream Baseline จาก AI Blueprint v0.9.1 | `HEAD` | `Released` | [`60-report.md`](features/019-sync-upstream-status-cli-and-project-detection/60-report.md) |
| 2026-08-20 | `018` | Feature | อัปเดตคู่มือ เอกสาร และ Website Documentation ให้เป็นปัจจุบันและครอบคลุม Dual-Track Model ล่าสุด | `HEAD` | `Released` | [`current-feature.md`](features/018-update-documentation-and-guides/current-feature.md) |
| 2026-08-20 | `017` | Feature | แยกคำสั่ง Fast-Track เป็น `/feature`, `/fix` และเปลี่ยน Deep-Track สเตจ 40 เป็น `40-execute` | `HEAD` | `Released` | [`current-feature.md`](features/017-split-spec-and-rename-40-execute/current-feature.md) |
| 2026-08-20 | `016` | Feature | ระบบบันทึกไอเดียพร้อม AI วิเคราะห์ความเป็นไปได้ (`/idea`) และเชื่อมต่อกับ Status Backlog | `HEAD` | `Released` | [`current-feature.md`](features/016-idea-capture-inbox-and-status-integration/current-feature.md) |
| 2026-08-20 | `015` | Feature | Dual-Track Architecture (Fast-Track 4 Steps & Deep-Track 8 Steps) + Living Spec (`current-feature.md`) + Standalone HTML Report Policy | `HEAD` | `Released` | [`current-feature.md`](features/015-fast-track-and-living-blueprint/current-feature.md) |
| 2026-08-20 | `014` | Feature | ยกระดับสถาปัตยกรรม DevFlow สู่ TypeScript และย้ายระบบ Check AI Blueprint Upstream Monitor | `HEAD` | `Released` | [`60-report.md`](features/014-typescript-migration-and-upstream-monitor-for-devflow/60-report.md) |
| 2026-08-20 | `013` | Feature | เพิ่ม Skill `/overview` และระบบ Living Context Sync สำหรับ Nexus-DevFlow | `e30375b` | `Released` | [`60-report.md`](features/013-add-overview-and-context-sync-skill/60-report.md) |
| 2026-08-18 | `008` | Feature | ปรับปรุงโครงสร้าง Nexus-DevFlow ให้ Lean & Clean ยุบรวม Skills บริหารจัดการ History และ Safe Rollback | `be713ea` | `Released` | [`60-report.md`](features/008-lean-and-clean-devflow-optimization/60-report.md) |
| 2026-08-18 | `007` | Feature | ยกระดับระบบ Nexus-DevFlow ด้วยวินัยและกลไกสำคัญจาก Blueprint | `e79528b` | `Released` | [`60-report.md`](features/007-integrate-blueprint-skills-enhancements/60-report.md) |
| 2026-08-18 | `006` | Feature | Standardize Command Naming and Provider Invocation | `HEAD` | `Released` | [`60-report.md`](features/006-standardize-command-naming-and-provider-invocation/60-report.md) |
| 2026-08-18 | `005` | Feature | Add DevFlow Prefix to Skill Descriptions | `HEAD` | `Released` | [`60-report.md`](features/005-add-devflow-prefix-to-skill-descriptions/60-report.md) |
| 2026-08-18 | `004` | Feature | Add Autopilot Skill | `HEAD` | `Released` | [`60-report.md`](features/004-add-autopilot-skill/60-report.md) |
| 2026-08-18 | `003` | Feature | Add Try, Rollback, CI, Brief Skills | `HEAD` | `Released` | [`60-report.md`](features/003-add-try-rollback-ci-brief-skills/60-report.md) |
| 2026-08-18 | `002` | Feature | Add Onboard, Adopt, Doctor Skills | `HEAD` | `Released` | [`60-report.md`](features/002-add-onboard-adopt-doctor-skills/60-report.md) |
| 2026-08-18 | `001` | Feature | Align DevFlow with Blueprint Architecture | `HEAD` | `Released` | [`60-report.md`](features/001-align-devflow-blueprint/60-report.md) |

---

## 🗄️ History Categories (The Core 3 Model)

- **`features/`**: New user-facing features, enhancements, architecture migrations, refactoring, and tooling/infra.
- **`fixes/`**: Bug fixes, hotfixes, regressions, security patches, and performance optimizations.
- **`rollbacks/`**: Safe feature reversal and rollback execution records.
