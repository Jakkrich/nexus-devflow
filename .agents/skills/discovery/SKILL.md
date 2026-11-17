---
name: discovery
description: "[devflow] Unified discovery, SA requirement intake (docs/images/REQ-ID), Socratic alignment (glossary/ADR), and roadmap or pre-delivery exploration before /feature. Use for /discovery, /analyze, or /grill."
argument-hint: "[--project | --grill | {title, file-path, IDEA-xxx, REQ-id, or discovery-id}]"
---

# discovery - Unified Discovery & Pre-Delivery Exploration

$ARGUMENTS

`/discovery` is the central discovery entry point in Nexus-DevFlow. It operates in three adaptive modes based on input scope:
1. **🗺️ Macro Project Discovery**: Develops high-level product and build roadmap plans (`devflow/project-plan.md` & `devflow/build-plan.md`) through an adaptive conversation before `/overview`.
2. **🔍 Micro Feature Exploration (Pre-Flight)**: Explores a specific feature, request, or idea before committing to delivery, routes through supporting lenses, and finishes with a visible `Proceed`, `Defer`, or `Reject` decision before `/feature` or `/fix`.
3. **📥 SA Requirement Ingestion & Socratic Grill**: Ingests raw documents/wireframes/chat requirements (`REQ-YYYYMMDD-NNN` or `--grill`), scans codebase blast radius, clarifies ambiguities 1–2 questions at a time, and persists settled domain terms and ADRs ([`reference/intake-and-grill.md`](reference/intake-and-grill.md)).

---

## Invocations & Usage

```text
# 1. Macro Project Planning Mode (No arguments or project scope)
/discovery
/discovery --project

# 2. Micro Feature Exploration Mode (Pre-Flight)
/discovery {title or request}
/discovery IDEA-xxx
# 3. SA Requirement Ingestion / Socratic Alignment (--grill, file paths, REQ-ID)
/discovery ./customer-spec.pdf ./mockup.png
/discovery REQ-20260903-001
/discovery --grill "Loyalty point expiration rules"
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

## Mode 2: Micro Feature Exploration (Pre-Flight)

Use when:
- Exploring a specific feature, complex architectural change, or pending idea (`/discovery IDEA-xxx`).
- The team needs to evaluate feasibility, options, domain glossary, or root causes before locking delivery scope.

### Markdown-First Contract:
Write the primary discovery artifact to:
```text
devflow/discoveries/{DISCOVERY_ID}-{slug}/discovery.md
```
*(A Discovery ID uses the namespace `DISC-YYYYMMDD-NNN`. It is not a Running ID and does not reserve a numeric delivery run.)*

### 6 Supporting Routes & Built-in Lenses:

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
5. **Socratic Grilling & Domain Alignment Lens**:
   - Codebase-grounded interactive inquiry (1–2 questions/turn) to clarify entity boundaries, data flows, and edge cases; persist settled terms to `devflow/context/glossary.md` and hard-to-reverse decisions to `devflow/decisions/ADR-xxx-{slug}.md` (see [`reference/intake-and-grill.md`](reference/intake-and-grill.md)).
6. **🎨 Visual Architecture & Diagram Design Lens (`archify` / `diagram-design`)**:
   - When exploring system topologies, legacy IT modernizations, sequence flows, data platform pipelines, state machines, or user journeys, check for `archify` or `diagram-design` in `.agents/skills/`.
   - **For interactive system architecture, dataflows, state transitions, and sequence traces**: Use `archify` (`.agents/skills/archify/SKILL.md`) to compile validated interactive HTML artifacts with dark/light themes, motion, and route probes.
   - **For editorial, business, quadrant, or broad diagram types**: Use `diagram-design` (`.agents/skills/diagram-design/SKILL.md`).
   - Save diagram artifacts to `devflow/discoveries/{DISCOVERY_ID}-{slug}/diagrams/{name}.html` and reference them directly in `discovery.md`.
7. **🧩 Slicing & Decomposition Lens (4 Slicing Archetypes)**:
   - When breaking down a large initiative into sub-features or milestones, evaluate against `devflow/reference/slicing-archetypes.md`:
     - **Skateboard**: Minimal functional loop (prove core logic end-to-end with minimal UI).
     - **Facade**: Rich UI/DX with mock backend (validate user flow & interaction first).
     - **Tracer Bullet**: Deep vertical slice across all layers (DB -> API -> UI) for 1 happy path.
     - **Journey**: Slice along natural user workflow milestones.
   - Recommend the primary Archetype for each proposed sub-feature in `discovery.md`.



### Decision & Approval Gate:
Set one visible decision:
- `Proceed`: Enough value and evidence exist to define delivery work:
  - Handoff to `/feature {discovery_id}` or `/fix {discovery_id}` to create the Task-Isolated Living Spec in `devflow/context/{xxx-slug}/spec.md`.
- `Defer`: The idea remains relevant but timing or evidence is not ready.
- `Reject`: The idea should not proceed under current framing.

---

## Mode 3: SA Requirement Ingestion & Socratic Grill

Use when the input supplies raw files (PDF, DOCX, XLSX, images, or pending files in `devflow/inbox/`), stakeholder requirement text, an existing `REQ-YYYYMMDD-NNN`, or `--grill` (including legacy `/analyze` & `/grill` invocations).
Read and follow [`reference/intake-and-grill.md`](reference/intake-and-grill.md) to allocate/resume `devflow/inbox/{REQ-ID}/`, parse and normalize requirements, inspect codebase blast radius (`devflow/analysis/{REQ-ID}/codebase-impact.md`), and run a codebase-grounded Socratic interview (1–2 questions per round) persisting directly to `devflow/context/glossary.md` and `devflow/decisions/ADR-xxx-{slug}.md`.

---

## Next Workflow Recommendations

- **From Macro Project Mode**: Run `/overview` to compile context into `devflow/context/project-overview.md`.
- **From Micro Pre-Flight / Mode 3 (Approved Proceed)**: Run `/feature {discovery_id}` / `/feature {REQ-ID}` or `/fix {discovery_id}` to start the Task-Isolated Living Spec lifecycle.
- **From Micro Pre-Flight (Defer / Reject)**: No next command needed.
