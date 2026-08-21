---
name: 00-discover
description: "[Devflow] Discover stage in DevFlow 2.0 - explore a request, route supporting inquiry, and decide whether delivery work should begin without allocating a running ID."
argument-hint: "{title, request, or discovery-id}"
---

# Phase 00: Discover

$ARGUMENTS

Explore a request before delivery commitment. Create or resume a Discovery ID, choose only the supporting route that the uncertainty requires, and finish with a visible `Proceed`, `Defer`, or `Reject` decision. Do not create a Running ID in this stage.

## Usage

```text
00-discover {title or request}
00-discover IDEA-xxx
00-discover {discovery-id}
```

Use this when:

- a new request needs discussion before the team commits to delivery
- exploring a pending idea from `devflow/ideas.md` (`00-discover IDEA-xxx`)
- the best route may be `Brainstorm`, `PRD`, `Research`, or `Debug`
- supporting findings need to be synthesized into a go/no-go decision

## Markdown-First Contract

Write the primary discovery artifact to:

```text
devflow/discoveries/{DISCOVERY_ID}-{slug}/00-discover.md
```

A Discovery ID uses a separate namespace such as `DISC-YYYYMMDD-NNN`. It is not a Running ID and must not reserve a numeric delivery run.

## Process

### Loop Contract

Run discovery as a decision-and-routing loop, not as task initialization.

- **Intent**: understand the request, select proportionate supporting inquiry, and decide whether the idea should enter delivery definition.
- **Context**: read the request, discovery artifact when resuming, project context, constraints, and available evidence.
- **Action**: restate the problem, identify the decision-blocking uncertainty, select `Brainstorm`, `PRD`, `Research`, `Debug`, or direct decision, then synthesize returned findings.
- **Observation**: use concrete evidence such as option tradeoffs, product framing, research results, root cause, stakeholder constraints, open questions, and visible risk.
- **Stop Condition**: stop when the selected route and evidence are recorded, open questions are visible, and the decision is `Proceed`, `Defer`, or `Reject`.
- **Handoff**: only an approved `Proceed` discovery may hand off to `10-define {discovery_id}`.

### 1. Supporting Routes & Built-in Lenses

1. **Brainstorming Lens (Divergent & Convergent)**:
   - Formulate 2-3 viable options.
   - Construct a **Trade-off Comparison Table**:
     | Option | Pros | Cons | Recommendation |
     | :--- | :--- | :--- | :--- |
2. **Research & Empirical Proof Lens**:
   - Inspect existing codebase patterns with search tools (`grep_search`, `rg`).
   - Conduct external web search if library feasibility or API contracts are uncertain.
   - Record verifiable empirical facts.
3. **PRD & Scoping Lens**:
   - Problem Statement & Target User Persona.
   - Core User Stories (`As a... I want to... So that...`).
   - In-Scope vs. Out-of-Scope boundaries.
4. **Issue & Bug Triage Lens**:
   - Classify severity (`Critical/Blocker`, `Major`, `Minor`).
   - Determine whether root-cause analysis (`debug`) is required before spec.

### 2. Decision & Approval Gate

Set one decision:
- `Proceed`: enough value and evidence exist to define delivery work
- `Defer`: the idea remains relevant but timing, evidence, or ownership is not ready
- `Reject`: the idea should not proceed under the current framing

### 3. Write `00-discover.md`

Record selected routes, returned findings, open questions, decision, and rationale.

## Next Workflow Recommendation

- **Primary**: `10-define {discovery_id}` only after approved Proceed
- **Defer/Reject**: No next command needed
