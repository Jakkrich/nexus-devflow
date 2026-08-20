# DevFlow 2.0 Running ID & Workspace Contract Reference

## DevFlow Workspace Directory Structure

All DevFlow framework context, active runs, templates, and history are consolidated under `devflow/`:

- **Context (`devflow/context/`)**:
  - `project-overview.md` - Primary source of truth for project architecture and stack.
  - `coding-standards.md` - Development, code quality, and testing standards.
  - `ai-interaction.md` - AI agent interaction rules and Thai artifact defaults.
  - `current-stage.md` - Active stage run state.
  - `findings.md` - Open and resolved audit findings ledger.

- **Active Delivery Runs (`devflow/runs/{RUNNING_ID}/`)**:
  - `10-define.md`
  - `20-spec.md`
  - `30-plan.md`
  - `40-execute.md`
  - `50-verify.md`
  - `60-report.md` (and `60-report.html`)
  - `70-release.md`

- **Active Discoveries (`devflow/discoveries/{DISCOVERY_ID}-{slug}/`)**:
  - `00-discover.md`

- **History Archive (`devflow/history/`)**:
  - `discoveries/` - Completed discovery archives.
  - `runs/` - Completed delivery run archives.
  - `reports/` - Completed stage reports.

- **Reference Contracts (`devflow/reference/`)**:
  - `running-id-contract.md`
  - `stage-lifecycle-contract.md`

## Mainline Lifecycle Rules

1. Mainline stages move linearly: `/00-Discover` ➔ `/10-Define` ➔ `/20-Spec` ➔ `/30-Plan` ➔ `/40-Execute` ➔ `/50-Verify` ➔ `/60-Report` ➔ `/70-Release`.
2. Companion commands (`Goal`, `Brainstorm`, `Research`, `Debug`, `PRD`, `Issue-Triage`, `Security-Review`, `Check-For-Updates`, `Help`) provide supporting context without replacing mainline stage numbers.
3. Every stage produces markdown-first evidence in `devflow/runs/` before passing verification gates.
