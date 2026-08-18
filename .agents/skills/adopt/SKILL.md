---
name: adopt
description: "[Devflow] Survey existing brownfield codebase and bootstrap DevFlow context files."
---

# adopt - Bootstrap Nexus-DevFlow from an Existing Codebase

Where this sits in the workflow:

```text
existing codebase  ->  [adopt]  ->  project-overview + coding-standards  ->  /00-discover or /10-define
(already has code)     (survey +    (seeded from the real code;               (first feature / refactoring
                        interview)   shipped architecture documented)          delivery lifecycle)
```

Standard onboarding assumes a freshly scaffolded, near-empty app. That does not fit a codebase that already has thousands of lines of working code.

`/adopt` is the brownfield on-ramp for Nexus-DevFlow: it reads what is already there, asks only for what the code cannot reveal (the *intent*, the *why*, and the *upcoming roadmap*), and produces the exact context files the rest of the DevFlow lifecycle expects (`project-overview.md`, `coding-standards.md`, `AGENTS.md` commands).

---

## Input

A description of what the project is, if provided. Otherwise, inspect the repository directly. No argument is required.

---

## Step 0 - Confirm Brownfield Safety

Inspect `devflow/context/project-overview.md` and `devflow/context/coding-standards.md`:

- If they contain default placeholders or empty templates, proceed.
- If they already hold rich, user-owned content, stop and inform the user; offer to refresh specific sections rather than overwriting existing context without confirmation.

Never run a framework scaffolder (DevFlow is an overlay, never a generator).

---

## Step 1 - Survey the Codebase (Read-Only)

Read the repository to establish the facts. Change nothing in this step:

- **Stack & Tooling**: Languages, frameworks, and versions from manifest files (`package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, `Cargo.toml`, etc.). Note the active package manager from lockfiles.
- **Commands**: Real dev, build, test, lint, and verify scripts.
- **Conventions in Practice**: Directory layout, component naming, state management, styling, data-fetching, error handling, validation. Read what the code *actually does*.
- **Testing Reality**: Inspect existing test suites, runners, and coverage. Be honest about test status.
- **Shipped Capabilities & Architecture**: Inferred from routes, pages, controllers, database schemas, and entry points.

Keep structured notes for generation in Step 3.

---

## Step 2 - Interview for Intent

The code reveals *what* and *how*, but not *why* or *what next*. Ask a short set of 3-4 questions to fill the gaps:

1. **Purpose & Users**: What is the core problem this project solves, and who are the target users?
2. **Architecture Status**: Is the current structure and stack intentional, or are there legacy parts/technical debt the team wants to change or refactor?
3. **Upcoming Roadmap**: What are the top priorities to build, fix, or refactor next?
4. **Clarifications**: Anything the survey got wrong or missed?

*(If the user already provided this context in the prompt, skip questions that are already answered).*

---

## Step 3 - Generate the Context Artifacts

Write the baseline context files drawn from the survey (facts) and interview (intent):

1. **`devflow/context/project-overview.md`**:
   - Project Name, Purpose, and Target Users
   - Architecture summary and directory layout
   - Shipped capabilities and existing major modules
   - Key technical stack components and verified commands
   - Known technical debt or architectural focus areas

2. **`devflow/context/coding-standards.md`**:
   - Rewrite defaults to reflect the project's *actual* conventions discovered in Step 1
   - Framework patterns, state management, error handling, styling, and test rules based on real code

3. **`AGENTS.md` Commands Section**:
   - Fill in the real dev, build, test, lint, and verify commands found during survey.

---

## Step 4 - Review Gate and Handoff

Present the adoption summary for review:

- Shipped features and architectural baseline recorded
- Inferred conventions and coding standards
- Available verified commands in `AGENTS.md`
- Recommended next step:
  - Run `00-discover` (or `/00-discover`, `$00-discover`) to explore the next major initiative or feature
  - Run `10-define` (or `/10-define`, `$10-define`) to immediately scope a delivery run for known roadmap items
