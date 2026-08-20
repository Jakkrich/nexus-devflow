---
name: brief
description: "[Devflow] Read-only scope, dependency, and risk pre-briefing before speccing a run."
---

# brief - Scope, Dependency & Risk Pre-Check

Where this sits in the workflow:

```text
10-define or project-overview.md  ->  [brief]  ->  20-spec  ->  30-plan  ->  40-execute
(proposed scope & context)            (read-only   (write        (break down)  (build it)
                                      explainer)    contract)
```

This skill answers one essential question: ***"What does this upcoming feature or run actually involve before I commit to writing a full specification?"***

It inspects the relevant context files and provides a concise briefing so the team can decide whether to spec it now, split it into smaller runs, reorder priorities, or clear an architectural blocker first.

It is **strictly read-only 100%**. It never writes specs, creates directories, branches, or commits code.

## Input

- **no argument**: briefs the active run in `devflow/context/current-stage.md` (or the first planned feature in `devflow/context/project-overview.md`).
- **running ID or feature name**: e.g. `brief RUN-003`, `brief "OAuth Login"`.
- **topic / concern**: e.g. `brief "database migration"`.

If there is no active run and the overview does not list planned features, plainly report that context is needed and recommend `00-discover` or `10-define`.

## Step 1 - Read Context (Read-Only)

Gather and synthesize:

1. **Active/Target Scope**: Target Running ID, `10-define.md`, or roadmap feature item.
2. **Project Context**: `devflow/context/project-overview.md` (Data models, architecture layout, primary stack, existing shipped capabilities).
3. **Existing Codebase State**: Inspect existing directory structures, schemas, and routes touching this feature.
4. **Dependencies**: What previously completed runs (`devflow/runs/`) or modules must be in place first.

## Step 2 - Analyze & Assess

Evaluate:

- **What It Is**: Core capability and user-visible or system-visible outcome.
- **Depends On**: Required upstream models, tables, APIs, environment variables, or sibling runs.
- **Unblocks**: Downstream features or workflows that this run enables.
- **Touches**: Files, modules, API routes, database tables, or UI components likely to change.
- **Estimated Size**: Small (S), Medium (M), Large (L), or Extra-Large (XL - recommend splitting in `10-define`).
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
- **Key Risks & Open Questions**: Technical or product unknowns that must be settled in `20-spec`.

---
👉 **Next Recommended Action**: `20-spec {running-id}` (or resolve prerequisite blocker first).
```

## Rules

- **Always Read-Only**: Never edit any workspace file, never allocate running IDs, never commit or execute scripts.
- **Explain, Don't Spec**: Focus on scope, architectural dependencies, and size estimation. The formal delivery contract is the responsibility of `20-spec`.
- **Ground In Reality**: Trace all assertions back to `project-overview.md` or actual codebase facts. Do not invent non-existent packages or fictional architecture.
- **Highlight Blockers Early**: Flagging a missing prerequisite before speccing is the primary value of this command.

## Output Formatting

Follow the project conventions in `devflow/context/ai-interaction.md`: concise, scannable markdown with bold labels and actionable bullet points.
