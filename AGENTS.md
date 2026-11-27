# Nexus-DevFlow

Project instructions for AI coding agents. This is the single cross-tool entry point for Codex, Google Antigravity, GitHub Copilot, OpenCode, and Claude Code (via `CLAUDE.md` importing `@AGENTS.md`).

This project uses **Nexus-DevFlow**, an agentic workflow layer supporting **The 3-Pillars Workspace Architecture & Pure Task-Isolated Living Spec Model**:
1. **Future**: `devflow/ideas.md`, `devflow/project-plan.md`, `devflow/build-plan.md`
2. **Present**: `devflow/context/` (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `glossary.md`) & task workspaces `devflow/context/{xxx-slug}/`
3. **Past**: `devflow/history/` (`features/`, `fixes/`, `rollbacks/`, `HISTORY.md`)

## Load context for the task

Reuse instructions already loaded. Read relevant sections rather than every document before every edit:

- `devflow/config.json` for workflow policy and quality-gate decisions.
- `devflow/context/project-overview.md` for project purpose, architecture, and cross-module boundaries.
- `devflow/context/coding-standards.md` for conventions affecting changed code.
- `devflow/context/ai-interaction.md` for workflow interaction, formatting, and review cadence.
- `devflow/context/glossary.md` when domain terminology matters.
- `devflow/context/{xxx-slug}/` for the selected run's spec, stage, findings, and review receipt.
- `devflow/workflow.md` on demand when running or checking a DevFlow command (lifecycle, adapter, activity schema, and config details).

## Task intent and authorization

Explicit user scope takes precedence over skill guidance, within runtime permissions and safety constraints. A request to draft a spec ends at the spec; a request to implement and verify continues through those authorized steps. A skill transition is not a new approval requirement. Ask when a material decision or authorization is missing, reuse existing authorization, and identify the exact instruction if it requires a pause. Preserve separate authorization for commit, merge, push, and deployment. Configuration in `devflow/config.json` never grants commit, merge, push, or deployment permission.

Use focused checks during edits, and run the documented required gates before handoff. Repeat passing checks only after relevant changes, failures, or unresolved concerns. Apply TDD to logic and behavior changes; documentation-only edits need appropriate structural or review evidence.

## Proportional engineering

Build for established requirements, not hypothetical scale, threats, or future flexibility. Reuse existing code, the standard library, native platform features, and installed dependencies before adding machinery. Harmonize with DevFlow's `ponytail` skill for operational bloat reduction and YAGNI discipline.

- Unknown scale or extensibility defaults to the smaller reversible design. Do not infer enterprise, multi-tenant, hostile-user, or compliance requirements.
- Derive trust and data-integrity boundaries from actual reachability: untrusted input, auth/session/ownership, shared persisted data, destructive operations, payments, secrets, and sensitive data.
- Ask only when an unknown materially changes behavior, architecture, persisted data, interoperability, a real security boundary, or cost. Otherwise choose the simplest repository-native implementation.
- Add an abstraction, dependency, service, configuration surface, compatibility layer, or security mechanism only for a current requirement.
- Simplicity never removes real trust-boundary validation, data-loss prevention, accessibility, explicit security requirements, configured tests, or project rules.
- Stack-specific template standards apply only when the project uses that stack.

## Workflow

- **4-Stage Loop**: `/feature` (or `/fix`) ──▶ `/implement` ──▶ `/check` ──▶ `/complete` (using `.agents/skills/<skill>/SKILL.md` or `.claude/skills/<skill>/SKILL.md`).
- **Default Language (Thai)**: All generated stage artifacts (`spec.md`, `discovery.md`, etc.) and user communication MUST default to **Thai (`th`)**, while code, technical terms, file paths, and identifiers remain in English.
- **Contextual Help**: When invoked with `help`, `--help`, `-h`, or `?`, follow [the help protocol](devflow/reference/help-playbook-protocol.md) to reply with a concise in-chat Markdown cheat sheet without running the command's primary action.
- **Activity State**: Never create or edit `devflow/.state/run.json` directly. Tracked commands record activity via the first helper that exists (see `devflow/workflow.md` for schema and field rules):

```text
node .agents/skills/devflow-help/scripts/run-state.mjs <action> <options>
node .claude/skills/devflow-help/scripts/run-state.mjs <action> <options>
```

## Verification & Commands

<!-- devflow:onboarding-required -->
- Verify framework integrity: `npm run check`
- Static contract check: `npm run check:static`
- Test installer package: `npm test`
- Package smoke test: `npm run test:package`
- Browser tests (Optional): `npm run test:browser` (via Playwright) + interactive browser MCP (e.g., Playwright MCP, Chrome DevTools MCP, or `browseros-neo` if configured) for live visual QA
