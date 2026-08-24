# Skill Selection Policy

Use this policy when deciding which skill or companion tool to activate for a given task in **Nexus-DevFlow 2.5.0**.

---

## 1. Lifecycle Selection Policy

Nexus-DevFlow 2.5.0 uses the **Single Living Spec Lifecycle** for all development work:

```text
/feature (or /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

- **Choose `/feature`**: For all planned features, new capabilities, refactorings, or architecture upgrades. Supports intake from Idea Inbox (`/feature IDEA-xxx`) or Discovery (`/feature DISC-xxx`).
- **Choose `/fix`**: For ad-hoc bug repairs, regressions, or hotfixes.
- **Choose `/implement`**: To execute checklist tasks with strict TDD discipline (Red-Green-Refactor).
- **Choose `/check`**: For Senior QA multi-lane verification before delivery.
- **Choose `/complete`**: For final safety audit, Release Digest, archiving, and branch delivery gate.

---

## 2. Pre-Flight Discovery & Architectural Alignment Policy

Use pre-flight skills before committing to delivery when exploring new ideas or resolving ambiguity:

```text
/idea (Inbox) ──▶ /grill (Socratic ADR) ──▶ /discovery (Explore) ──▶ /feature (Deliver)
```

- **Choose `/idea`**: When capturing raw thoughts or feature proposals with AI feasibility scoring.
- **Choose `/grill`** (or **`/align`**): When complex domain concepts need pressure-testing and Architecture Decision Records (ADRs).
- **Choose `/brainstorm`**: When exploring 2–3 viable approaches with trade-off matrices.
- **Choose `/discovery`**: For deep multi-turn inception research and exploration before speccing.

---

## 3. Companion Tools & Quality Gates Mapping

| Need | Recommended Command | Behavior |
| :--- | :--- | :--- |
| **System Diagnostics** | `/doctor` | Read-only check of adapters, configs, and workflow drift. |
| **Workspace Navigation** | `/devflow` | Flagship state inspector and next action router. |
| **Root-Cause Analysis** | `/debug` | Non-destructive reproduction and defect diagnosis without modifying source. |
| **Manual QA Guide** | `/try` | Generates click-by-click human manual test guide. |
| **Code & Security Audit** | `/audit` | Branch-aware or full-project code and security audit. |
| **Feature Reversal** | `/rollback` | Analyzes dependency risks and drafts safe rollback spec. |
| **CI Setup** | `/ci` | Configures `.github/workflows/verify.yml` with detected package manager. |
| **Unit Test Setup** | `/tests` / `/test` | Runs test suites or scaffolds missing unit tests. |
| **Autonomous Pass** | `/autopilot` | Bounded Single Living Spec execution loop (`feature`/`fix` -> `implement` -> `check`) stopping before merge. |
| **Visual Mockup** | `/prototype` | Throwaway HTML/CSS mockups sharing design tokens. |
| **Cloud Readiness** | `/release` | Deployment readiness check (Render / Vercel). |
| **Interactive Report** | `/report-html` | Generates standalone HTML dashboard on demand. |
