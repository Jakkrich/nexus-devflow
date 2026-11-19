---
name: verify-harness
description: "[devflow] Opt-in generator for a project-local verification skill (.agents/skills/verify-<app>/) and feature map so agents can launch, doctor, drive, and prove real app behavior across CLI, API, TUI, or web surfaces."
argument-hint: "[app-name] [--surface cli|api|web|tui|library]"
---

# verify-harness - generate a repo-local app verification skill

Generate a project-local verification skill (`.agents/skills/verify-<app>/`) that teaches any fresh agent how to launch the real app, check readiness, exercise user journeys, capture proof, and clean up safely across Windows, macOS, and Linux.

## Step 1 - interview the repo, not the user

Inspect codebase files first (`AGENTS.md`, `package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod`, existing tests, routes/commands). Ask the user only for facts you cannot observe:

- **Surface**: What does a user actually touch (web UI, CLI/TUI, HTTP API, desktop app, or library)?
- **Run & Readiness**: How does the app start locally, and what signal proves it is actually usable (not just listening on a port while migrations/init still run)?
- **Drive**: Which existing harness or stable handles exist first (`@playwright/test`, MCP browser tools, PTY/expect, HTTP client, CLI invocation)? Prefer ARIA labels, `data-*` attributes, route paths, or CLI flags over fragile coordinates.
- **Observe**: What evidence proves behavior (terminal output, exit codes, HTTP responses, screenshots, DB/file side effects)?
- **Isolate**: Can two verification runs execute concurrently using isolated ports, temp dirs, or profiles? If not, document the lock/single-instance rule explicitly.

If the checkout does not build or start cleanly, fix or report the exact baseline blocker before generating the skill.

## Step 2 - generate `.agents/skills/verify-<app>/`

Create `.agents/skills/verify-<app>/SKILL.md` (mirroring to `.claude/skills/verify-<app>/` via `npm run sync:adapters` when `.claude/skills` is active) using `reference/harness-template.md`, with no placeholders left:

1. **Launch**: Exact command, env vars, seed/migration setup from a clean state, readiness signal, and teardown.
2. **Doctor**: One read-only check verifying the instance is healthy and owned by this verification run.
3. **Drive**: Concrete commands/selectors from this repo exercising real user paths (no test-only backdoors or internal setters).
4. **Evidence**: Exact storage path (prefer `devflow/reports/{run-id}/` or gitignored artifact dir) capturing both the action and resulting state/side effects.
5. **Cleanup**: Stop only processes/PIDs or temp dirs created by this run; **never** kill broadly by process name and **never** delete captured evidence during cleanup.

## Step 3 - seed the feature map

Create `.agents/skills/verify-<app>/features/README.md` plus 3–5 top user-facing feature files (`features/<feature>.md`) following `reference/harness-template.md`. Each feature file documents:

- `Sub-features`
- `How to get to it (user POV)`
- `Driving it`
- `Gotchas` (if preconditions or seed data are missing, fail loudly and document why — never weaken assertions to force a pass)

## Step 4 - prove the generated skill before handoff

A generated verification skill that has never been executed is a draft, not a deliverable:

1. Run **Launch** -> **Doctor** -> **Drive** on at least one mapped feature -> **Cleanup**.
2. Confirm the proof artifact still exists at its named path *after* Cleanup completes.
3. Fix any broken command/selector, re-running Cleanup after failed attempts so no stray processes or ports remain.
4. Report any environment gap honestly if verification ran against a stand-in rather than the full target.
