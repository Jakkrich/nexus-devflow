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
- **Choose `/check`**: For Dual-Axis verification before delivery: observable spec fidelity plus independent standards, architecture, security, and quality gates.
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
| **Root-Cause Analysis** | `/debug` | Scientific six-phase diagnosis using a deterministic red-capable feedback loop without modifying source. |
| **Architecture & Spec Verification** | `/check` | Reviews Deep Modules, documented standards, and behavioral acceptance as independent axes. |
| **Manual QA Guide** | `/try` | Generates click-by-click human manual test guide. |
| **Code & Security Audit** | `/audit` | Branch-aware or full-project code and security audit. |
| **Feature Reversal** | `/rollback` | Analyzes dependency risks and drafts safe rollback spec. |
| **CI Setup** | `/ci` | Configures `.github/workflows/verify.yml` with detected package manager. |
| **Unit Test Setup** | `/tests` / `/test` | Runs test suites or scaffolds missing unit tests. |
| **Autonomous Pass** | `/autopilot` | Bounded Single Living Spec execution loop (`feature`/`fix` -> `implement` -> `check`) stopping before merge. |
| **Visual Mockup** | `/prototype` | Throwaway HTML/CSS mockups sharing design tokens. |
| **Cloud Readiness** | `/release` | Deployment readiness check (Render / Vercel). |
| **Interactive Report** | `/report-html` | Generates standalone HTML dashboard on demand. |

---

## 4. Selection Boundaries & References

- The **28 bundled Core Skills** are the names in `agent-bundle.manifest.json#core_skills`; Local or Personal Skills are workspace extensions, not automatic public commands.
- Prefer an existing Core Skill before adding a new public surface. Follow [governance rules](governance-rules.md) for promotion and placement decisions.
- Generated artifacts follow the [Markdown metadata contract](markdown-metadata-contract.md).
- Human review responsibilities are defined in the [manual review workflow](manual-review-workflow-spec.md).
- Use [Living Spec examples](examples/living-spec/) as structural references, not as copy-paste requirements.
