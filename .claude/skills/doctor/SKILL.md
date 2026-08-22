---
name: doctor
description: "[Devflow] Read-only DevFlow health check and diagnostics for context files, adapters, commands, and workflow drift."
---

# doctor - Read-Only DevFlow Health Check & Diagnostics

Where this sits in the workflow:

```text
Any time during development -> [doctor] -> Health Report & Actionable Fixes
(read-only inspection)          (diagnostics)    (remediation recommendations)
```

`doctor` is a safe, read-only diagnostic skill that verifies whether your repository's Nexus-DevFlow configuration, context files, tool adapters, commands, and active runs are healthy and aligned.

---

## Input

No argument is required.

---

## Diagnostics Checklist

Run through these 5 health checks:

### Check 1: Core Framework & Context Files Integrity
- Check if [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md) exist and are populated.
- Check required context files under `devflow/context/`:
  - `project-overview.md` (Check if still empty/placeholder -> recommend `onboard` or `adopt`)
  - `coding-standards.md` (Check if customized for stack)
  - `ai-interaction.md` (Check if rules are configured)
  - `current-stage.md` (Check if active run matches filesystem)
  - `findings.md` (Check if ledger exists)

### Check 2: Tool Adapters Parity
- Check if `.agents/skills/` exists and contains core lifecycle skills (`00-explore` through `70-release`, `devflow`, `onboard`, `adopt`, `doctor`).
- Check if `.claude/skills/` is in sync with `.agents/skills/`.

### Check 3: Commands & Script Verification
- Inspect the Commands section in `AGENTS.md`.
- Cross-reference with project manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, etc.):
  - Does the `Dev` command exist in scripts?
  - Does the `Build` command exist in scripts?
  - Does the `Test` command exist in scripts?
  - Does the `Verify` command exist in scripts?

### Check 4: Active Runs & Workflow Drift Detection
- Inspect `devflow/runs/`:
  - Are there active runs?
  - Is `current-stage.md` consistent with the latest stage artifact in the active run?
  - Are checklists (`checklists/implementation-checklist.md`, `checklists/verification-checklist.md`) properly tracked?
  - Detect stage skips or workflow drift (e.g. jumping from `10-define` directly to `40-execute` without `20-spec` and `30-plan`).

### Check 5: Findings Ledger Inspection
- Inspect `devflow/context/findings.md`:
  - Are there open P0 or P1 findings that block release?
  - Are resolved findings properly closed?

---

## Output Format

Present a clean, scannable diagnostic report:

```markdown
# 🩺 Nexus-DevFlow Health Report

## Overall Status: [HEALTHY | WARNING | ACTION REQUIRED]

| Component | Status | Details |
| :--- | :--- | :--- |
| **Context Files** | [PASS / WARN] | project-overview.md, coding-standards.md status |
| **Tool Adapters** | [PASS / WARN] | .agents and .claude parity |
| **Configured Commands**| [PASS / WARN] | dev, build, test, verify alignment |
| **Active Runs & Drift**| [PASS / WARN] | active run status, stage progression |
| **Findings Ledger** | [PASS / WARN] | open P0/P1 issues count |

### Recommended Remediation Actions:
1. [Action item if any warning or failure detected]
2. [Suggested next command, e.g. devflow, onboard, adopt, etc.]
```
