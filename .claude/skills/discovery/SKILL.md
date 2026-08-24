---
name: discovery
description: "[devflow][D] Unified discovery and exploration stage in DevFlow 2.0 - conducts project-level roadmap discovery (project-plan.md/build-plan.md) or feature-level exploration (Stage 00) before delivery commitment."
argument-hint: "[{title, request, IDEA-xxx, or discovery-id}]"
---

# discovery - Unified Discovery & Pre-Delivery Exploration

$ARGUMENTS

`/discovery` is the central discovery entry point in Nexus-DevFlow. It operates in two adaptive modes based on input scope:
1. **🗺️ Macro Project Discovery**: Develops high-level product and build roadmap plans (`devflow/project-plan.md` & `devflow/build-plan.md`) through an adaptive conversation before `/overview`.
2. **🔍 Micro Feature Exploration (Stage 00)**: Explores a specific feature, request, or idea before committing to delivery, routes through supporting lenses, and finishes with a visible `Proceed`, `Defer`, or `Reject` decision before `10-define`.

---

## Invocations & Usage

```text
# 1. Macro Project Planning Mode (No arguments or project scope)
/discovery
/discovery --project

# 2. Micro Feature Exploration Mode (Stage 00 of Deep-Track)
/discovery {title or request}
/discovery IDEA-xxx
/discovery {discovery-id}
```

---

## Mode 1: Macro Project Discovery (Roadmap & System Planning)

Use when:
- Starting a new product or shaping high-level architecture across the entire repository.
- Revisiting the overall project vision, major milestones, or tech stack before generating `/overview`.

### Process:
1. **Establish Baseline**: Read `devflow/project-plan.md` and `devflow/build-plan.md` (if present).
2. **Adaptive Conversation**: Ask 1-2 focused questions at a time covering problem space, user workflows, MVP boundaries, non-goals, data models, and stack constraints.
3. **Periodic Snapshots**: Provide compact summaries of confirmed decisions, working assumptions, and open TODOs.
4. **Draft Plans Behind Approval Gate**: Draft proposed `project-plan.md` and `build-plan.md` only when the user explicitly requests drafts.
5. **Write on Approval**: Write approved files and recommend `/overview` as the next step.

---

## Mode 2: Micro Feature Exploration (Stage 00 of Deep-Track)

Use when:
- Exploring a specific feature, complex architectural change, or pending idea (`/discovery IDEA-xxx`).
- The team needs to evaluate feasibility, options, domain glossary, or root causes before locking delivery scope.

### Markdown-First Contract:
Write the primary discovery artifact to:
```text
devflow/discoveries/{DISCOVERY_ID}-{slug}/discovery.md
```
*(A Discovery ID uses the namespace `DISC-YYYYMMDD-NNN`. It is not a Running ID and does not reserve a numeric delivery run.)*

### 5 Supporting Routes & Built-in Lenses:

1. **Brainstorming Lens (Divergent & Convergent)**:
   - Formulate 2-3 viable options with trade-offs.
   - Construct a **Trade-off Comparison Table** (Pros, Cons, Recommendation).
2. **Research & Empirical Proof Lens**:
   - Inspect existing codebase patterns with search tools (`grep_search`, `rg`).
   - Conduct external web search if library feasibility or API contracts are uncertain.
3. **PRD & Scoping Lens**:
   - Problem Statement, Target Persona, Core User Stories, and In-Scope vs. Out-of-Scope boundaries.
4. **Issue & Bug Triage Lens**:
   - Classify severity (`Critical/Blocker`, `Major`, `Minor`) and determine whether root-cause analysis (`debug`) is required.
5. **Socratic Grilling & Domain Alignment Lens (`grill`)**:
   - Codebase-grounded interactive inquiry to clarify entity boundaries, data flows, and edge cases.
   - Record agreed terminology in `devflow/context/glossary.md` and major architecture decisions in `devflow/decisions/ADR-xxx-{slug}.md`.

### Decision & Approval Gate:
Set one visible decision:
- `Proceed`: Enough value and evidence exist to define delivery work:
  - **🏎️ Fast-Track (Recommended for 85% of standard features/fixes)**: Handoff to `/feature {discovery_id}` or `/fix {discovery_id}` (writes `devflow/context/current-feature.md`).
  - **🏗️ Deep-Track (For large architectural epics/migrations)**: Handoff to `10-define {discovery_id}` (writes `devflow/context/current-run/10-define.md`).
- `Defer`: The idea remains relevant but timing or evidence is not ready.
- `Reject`: The idea should not proceed under current framing.

---

## Next Workflow Recommendations

- **From Macro Project Mode**: Run `/overview` to compile context into `devflow/context/project-overview.md`.
- **From Micro Stage 00 (Approved Proceed ➔ Fast-Track)**: Run `/feature {discovery_id}` to start lean living spec.
- **From Micro Stage 00 (Approved Proceed ➔ Deep-Track)**: Run `10-define {discovery_id}` to allocate a Running ID.
- **From Micro Stage 00 (Defer / Reject)**: No next command needed.