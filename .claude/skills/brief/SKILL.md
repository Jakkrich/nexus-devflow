---
name: brief
description: "[Devflow] Read-only scope, dependency, and risk pre-briefing before speccing a run (reads build-plan.md or ideas.md)."
---

# brief - Scope, Dependency & Risk Pre-Check

Where this sits in the workflow:

```text
devflow/build-plan.md (or ideas.md)  ->  [brief]  ->  feature / 20-spec  ->  implement / 40-execute
(feature queue & context)                (read-only   (write spec)          (build it)
                                          explainer)
```

This skill answers one essential question: ***"What does this upcoming feature or run actually involve before I commit to writing a full specification?"***

It inspects `devflow/build-plan.md` (or `devflow/ideas.md` / `project-overview.md`) and provides a concise briefing so the team can decide whether to spec it now, split it into smaller runs, reorder priorities, or clear an architectural blocker first.

It is **strictly read-only 100%**. It never writes specs, creates directories, branches, or commits code.

## Input

- **no argument**: briefs the next unchecked feature in `devflow/build-plan.md` (or the active run in `devflow/context/current-stage.md`).
- **feature number or name**: e.g. `brief 1`, `brief "OAuth Login"`.
- **idea ID**: e.g. `brief IDEA-003`.

If there is no build plan or pending idea, plainly report that context is needed and recommend `/overview` or `/discovery`.

## Step 1 - Read Context (Read-Only)

Gather and synthesize:

1. **Target Feature/Item**: Read `devflow/build-plan.md`, `devflow/ideas.md`, or `devflow/context/current-stage.md`.
2. **Project Context**: `devflow/context/project-overview.md` (Data models, architecture layout, primary stack, existing shipped capabilities).
3. **Existing Codebase State**: Inspect existing directory structures, schemas, and routes touching this feature.
4. **Dependencies**: What previously completed runs or modules must be in place first.

## Step 2 - Analyze & Assess

Evaluate:

- **What It Is**: Core capability and user-visible or system-visible outcome.
- **Depends On**: Required upstream models, tables, APIs, environment variables, or sibling runs.
- **Unblocks**: Downstream features or workflows that this run enables.
- **Touches**: Files, modules, API routes, database tables, or UI components likely to change.
- **Estimated Size**: Small (S), Medium (M), Large (L), or Extra-Large (XL - recommend splitting).
- **Open Questions & Risks**: Ambiguous requirements, missing external APIs, or complex migrations.

## Step 3 - Output Structured Briefing

Produce a short, scannable briefing:

```markdown
### 📋 Feature Briefing: [Feature / Run Name]

- **What**: Brief summary of the core outcome.
- **Depends On**: Prerequisite modules, runs, or infrastructure.
- **Unblocks**: Downstream capabilities enabled by this feature.
- **Touches**: Anticipated files, schemas, endpoints, and UI views.
- **Estimated Scope & Size**: `[S / M / L / XL]` (and split recommendation if XL).
- **Key Risks & Open Questions**: Technical or product unknowns that must be settled during speccing.

---
👉 **Next Recommended Action**: `/feature {name-or-id}` (or resolve prerequisite blocker first).
```

## Rules

- **Always Read-Only**: Never edit any workspace file, never allocate running IDs, never commit or execute scripts.
- **Explain, Don't Spec**: Focus on scope, architectural dependencies, and size estimation. The formal delivery contract is the responsibility of `/feature` or `20-spec`.
- **Ground In Reality**: Trace all assertions back to `project-overview.md` or actual codebase facts. Do not invent non-existent packages or fictional architecture.
