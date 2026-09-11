# ⚡ 40-tasks: Active Living Spec Workspaces

This directory contains active, isolated task workspaces (`{xxx-slug}/`) during development.

Each active task folder contains:
- `spec.md` - Task-isolated living specification and implementation checklist
- `stage.md` - Lifecycle stage tracker (`defined`, `in-progress`, `checked`, `verified`)
- `findings.md` - Dedicated findings ledger for audit and verification proof
- `review.md` - Optional independent review request and receipt

When a task is completed via `/complete`, its spec is archived to `devflow/50-history/features/` (or `fixes/`, `rollbacks/`) and the active folder in `40-tasks/` is cleanly removed.
