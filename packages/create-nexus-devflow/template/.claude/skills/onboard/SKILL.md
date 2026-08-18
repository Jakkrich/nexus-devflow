---
name: onboard
description: "[Devflow] Set up Nexus-DevFlow after overlaying it onto a freshly scaffolded or early-stage project."
---

# onboard - Finish the Nexus-DevFlow Setup for Fresh Projects

Where this sits in the workflow:

```text
scaffold app  ->  overlay DevFlow  ->  [onboard]  ->  00-discover or 10-define  ->  Mainline Loop
(user/tool)       (create-nexus)       (tune setup)   (discovery / run scoping)      (20-spec -> 70-release)
```

`onboard` is the fresh-project on-ramp for Nexus-DevFlow. It assumes the application was scaffolded first (e.g. via `create-next-app`, `create-vite`, `cargo new`, etc.) and DevFlow was overlaid after.

Run `onboard` before starting discovery or delivery runs. Its job is to make DevFlow fit the real project from day one: detecting commands, project name, coding conventions, ignore rules, and tool adapters.

Use `adopt` instead when the app already has substantial shipped code, working routes, and existing business logic.

---

## Input

No argument is required. If the user provides context about the stack, database, authentication, or preferred tooling, use it as a hint and verify against files.

---

## Step 0 - Confirm Onboarding vs Adoption

Inspect the repository and context files:

- If the project is freshly scaffolded with minimal boilerplate, proceed.
- If `devflow/context/project-overview.md` and `devflow/context/coding-standards.md` already contain rich, user-customized content, do not overwrite them without explicit confirmation.
- If the repository already has substantial existing routes, controllers, or database models, stop and recommend `adopt` instead.

Never run a framework scaffolder. DevFlow is already overlaid.

---

## Step 1 - Survey the Project Facts

Read only enough to identify the setup:

- **Package Manager & Lockfile**: `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb`, `Cargo.lock`, `poetry.lock`, `go.sum`, etc.
- **Manifest Scripts**: `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, etc.
- **Framework & Configs**: `tsconfig.json`, `next.config.*`, `vite.config.*`, `astro.config.*`, `tailwind.config.*`, database configs, test configs.
- **Source Layout**: `src/`, `app/`, `pages/`, `components/`, `lib/`, etc.
- **Existing Git & Ignore Rules**: `.gitignore`, git branches.
- **Project Name**: Extracted from manifest, root directory, or user.

---

## Step 2 - Update Entry Files (AGENTS.md & CLAUDE.md)

1. **Update `AGENTS.md` Commands**:
   - Fill in the actual commands found in the project:
     - `Dev`: dev server command (e.g. `npm run dev`)
     - `Build`: production build command (e.g. `npm run build`)
     - `Test`: test runner command (e.g. `npm test`, `vitest`, `pytest`)
     - `Lint / Typecheck`: linting and typechecking commands
     - `Verify`: combined verification command if present (e.g. `npm run check` or `npm run typecheck && npm test && npm run build`)
   - If no test command exists, state explicitly that testing is opt-in and not yet configured.

2. **Update `CLAUDE.md`**:
   - Replace any `# Project Name` placeholder with the real detected project name.
   - Keep `@AGENTS.md` and `@devflow/context/...` imports intact.

---

## Step 3 - Tune Coding Standards

Update `devflow/context/coding-standards.md` to match the detected stack:

- Framework, rendering model, and component architecture
- Package manager and runtime
- Project directory conventions
- Styling approach (Tailwind CSS, Vanilla CSS, CSS Modules)
- Data fetching, state management, and API boundaries
- Validation and error handling expectations
- Testing expectations

Keep core general rules (functional style, small focused functions, clear naming) and replace template placeholders with real patterns.

---

## Step 4 - Check AI Interaction Rules

Review `devflow/context/ai-interaction.md` and adjust if needed:
- Language preferences (`artifact_language: "th"` or `"en"`)
- Branching conventions
- Review checkpoint expectations

---

## Step 5 - Check Ignore Files, Visibility & Tool Adapters

1. **Update `.gitignore`**: Ensure common build artifacts, dependencies, and environment files are ignored.
2. **DevFlow Visibility**:
   - By default, keep DevFlow files tracked in git for team collaboration.
   - If local-only mode is requested, add `devflow/`, `.agents/`, `.claude/`, `CLAUDE.md` to `.gitignore` while keeping `AGENTS.md` public.
3. **Tool Adapters**:
   - Codex & Antigravity use `.agents/skills/`.
   - Claude Code uses `.claude/skills/`.
   - Both can coexist cleanly.

---

## Step 6 - Initialize Project Overview

Populate `devflow/context/project-overview.md` with baseline information:
- Project Name and One-line Summary
- Tech Stack & Tooling Architecture
- Initial Repository Structure
- Available Verified Commands

---

## Step 7 - Handoff to Planning

Present a concise onboarding summary report:

- Stack, framework, and package manager detected
- Commands configured in `AGENTS.md`
- Files tuned during onboarding
- Adapter status (`.agents/`, `.claude/`)
- Recommended next step:
  - Run `00-discover` (or `00-discover`, `$00-discover`) to explore the first feature or product direction
  - Run `10-define` (or `10-define`, `$10-define`) if the initial delivery slice is already clear and ready for execution
