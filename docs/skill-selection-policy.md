# Skill Selection Policy

Use this policy when deciding which skill or workflow track to activate for a given task in Nexus-DevFlow 2.0.

---

## 1. Track Selection Policy

### A. Choose Fast-Track (4 Steps) When:
- Scope is well-understood (iterative feature, UI enhancement, bug fix, refactor).
- Fits within 1–5 focused tasks.
- Does not alter core system architecture or database schemas.
- **Commands**: `/feature` (or `/fix`) ➔ `/implement` ➔ `/check` ➔ `/complete`.

### B. Choose Deep-Track (8 Steps) When:
- Scope involves significant ambiguity or architectural trade-offs.
- Requires multi-step discovery before delivery commitment.
- Involves breaking changes, database migrations, or multi-agent orchestration.
- **Commands**: `/00-explore` ➔ `/10-define` ➔ `/20-spec` ➔ `/30-plan` ➔ `/40-execute` ➔ `/50-verify` ➔ `/60-report` ➔ `/70-deliver`.

---

## 2. Core Selection Rules

1. **Stage Ownership Wins**: Mainline stages own the active state, markdown artifacts, and next-step decisions.
2. **28 Core Skills**: All skills are self-contained and synchronized 1:1 across `.agents/skills/` and `.claude/skills/`.
3. **Absorbed Best Practices**: Do not invoke external cheat-sheets for commits, tests, or security; they are built directly into `complete`, `70-deliver`, `check`, `50-verify`, and `coding-standards.md`.
4. **State-Aware Routing**: When unsure what command to use, run `/devflow` or `npx @jakkrichm/create-nexus-devflow status` to inspect active context.

---

## 3. Companion Tools & Quality Gates Mapping

| Need | Recommended Command | Behavior |
| :--- | :--- | :--- |
| **System Diagnostics** | `/doctor` | Read-only check of adapters, configs, and workflow drift. |
| **Root-Cause Analysis** | `/debug` | Non-destructive reproduction and defect diagnosis without modifying source. |
| **Manual QA Guide** | `/try` | Generates click-by-click human manual test guide. |
| **Idea Capture** | `/idea` | Evaluates feasibility and adds to `devflow/ideas.md`. |
| **Feature Reversal** | `/rollback` | Analyzes dependency risks and drafts rollback spec. |
| **CI Setup** | `/ci` | Configures `.github/workflows/verify.yml` with detected package manager. |
| **Unit Test Setup** | `/test` | Runs test suites or scaffolds missing unit tests. |
| **Autonomous Pass** | `/autopilot` | Bounded Fast-Track (`feature`/`fix` -> `implement` -> `check`) or Deep-Track (`20-spec` -> `30-plan` -> `40-execute` -> `50-verify` -> `60-report`) loop stopping before merge. |
| **Visual Mockup** | `/prototype` | Throwaway HTML/CSS mockups sharing design tokens. |
| **Interactive Report** | `/report-html` | Generates standalone HTML dashboard on demand. |
