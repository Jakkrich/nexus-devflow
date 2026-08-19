# Coding Standards & Guidelines

General engineering standards for code, tests, and documentation in Nexus-DevFlow.

## 1. Code Quality & Architecture

- Write clear, self-documenting code with single-responsibility functions.
- Avoid unnecessary complexity (prefer simple solutions over indirect abstractions).
- Maintain type safety and static validation across module boundaries.
- Treat `project-overview.md` as the single source of truth for concrete data models and entity definitions.

## 2. Testing & Empirical Proof Standards

- **Unit Test Mandate**: Any logic modification or bug fix must be accompanied by new or updated unit tests.
- **Empirical Proof Contract**: Never claim "passed", "verified", or "working" without citing exact command outputs, test run reports, route responses, logs, or screenshots.
- **Manual Try Guide**: Every delivery run must provide a human-testable Try Guide ("Where to go", "What to click", "What to expect") for manual validation.

## 3. Findings Ledger & Quality Gates (`findings.md`)

- All audit, security, and verification issues must be tracked in `devflow/context/findings.md`.
- **Finding State Machine**:
  - `open`: Confirmed defect not yet repaired.
  - `fixed`: Repaired in code, pending verification.
  - `closed`: Verified in `50-verify` as completely resolved without regressions.
  - `accepted`: Waived with recorded user rationale.
  - `invalid`: Proven non-issue with concrete evidence.
- **P0/P1 Blockers**: P0 and P1 findings in `open` or `fixed` status block `70-release` unconditionally. `fixed` status must be promoted to `closed` via `50-verify` re-examination.

## 4. Git Workflow & Release Safety
 
- Commit messages follow conventional/imperative format (e.g., `feat(RUN-007): ...`).
- Feature branches follow `feature/{slug}-{running-id}` or `fix/{slug}-{running-id}`.
- **2-Stage Release Approvals**: Explicit consent to merge into `main` is strictly separate from consent to `git push` to remote repositories or deploy to production.

## 5. Fast-Track & Quick-Fix Guidelines (Lean Mode)

- For trivial bug fixes, typo corrections, or single-file non-architectural changes, developers and agents may use the **Quick-Fix Fast-Track**:
  - Consolidate Discovery, Define, and Spec into an inline fix brief (`devflow/runs/{fix-id}/fix-brief.md`).
  - Jump directly to `40-implement` (with reproduction unit test) ➔ `50-verify` ➔ `70-release`.
  - Avoid creating heavy redundant documentation for changes under 20 lines of code while preserving Empirical Proof and Unit Test requirements.
