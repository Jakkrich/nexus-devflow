---
description: Strategic PRD Generator (Orchestration) - Transform a product or feature idea into a problem-first, hypothesis-driven Product Requirements Document (PRD).
---
# Phase 12: Strategic PRD Generator (Orchestration)

## Feature Idea: $ARGUMENTS

Transform a product or feature idea into a problem-first, hypothesis-driven Product Requirements Document (PRD).

In DevFlow 2.0, this is a supporting workflow, not part of the numbered mainline state path. Use it when the idea is still too product-shaped for `/10-Define` or `/20-Spec` to proceed cleanly.

---

## Internal Process

You are an orchestrator. Your goal is to call the specialized PRD Architect agent and preserve the quality of discovery, framing, and scope decisions before the work enters the mainline execution flow.

### Phase 1: Interactive Discovery
**Call Agent**: `prp-core-prd-architect`

- Provide the feature idea if one exists.
- If no idea is provided, the agent should initiate discovery through targeted questions or structured prompting.
- Support the agent in grounding the PRD around:
  - **Who**: primary persona, context, environment, and trigger moment.
  - **What**: the core problem or desired outcome.
  - **Why**: limitations of the current process, product, or alternative solutions.
  - **Success**: measurable outcomes, user signals, or business impact.

### Phase 2: Grounding And Feasibility

- Facilitate research into technical feasibility, domain context, and operational constraints.
- Ensure the agent checks internal codebase or platform patterns when the idea must fit an existing system.
- Apply `Research` or the relevant research agent/skill when the PRD mentions:
  - external APIs
  - SDKs
  - databases
  - cloud services
  - auth providers
  - payments
  - browser or device dependencies
- Apply competitor or market analysis only when differentiation, market positioning, or user pain points materially affect scope decisions.

### Phase 3: Scope Definition

- Review the agent's prioritization carefully.
- Confirm:
  - MVP definition
  - non-goals
  - explicit assumptions
  - open questions
  - risks that should remain visible before delivery planning
- Do not let the PRD silently drift into implementation detail that belongs in `/20-Spec` or `/30-Plan`.

### Phase 4: Output Generation

- **MANDATORY:** Before generating the PRD, inspect `.agent/resources/schemas/prd.template.md` and use its required headings and table structure.
- Before reporting completion, run:

Review `{prd_path}` against `prd.template.md`, keep the required headings, and remove placeholder text before completion.

- Replace any placeholder or template text with concrete product details, assumptions, risks, metrics, and open questions.
- Save the PRD to:

```text
.workspaces/prds/{date}-{slug}.prd.md
```

- Verify the document includes:
  - problem statement
  - target user or actor
  - key hypotheses
  - success measures
  - scope boundaries
  - implementation phases at a product level, not task granularity

### Phase 5: Map Into DevFlow 2.0

Convert the PRD into explicit next steps for the Timeline flow:

- `/10-Define` when product framing still needs decisions
- `/20-Spec` when the delivery contract is ready to be locked
- `/30-Plan {ID}` only after the spec is execution-ready

The user should still approve the transition into execution work. Do not treat PRD generation as automatic task creation.

---

## Output

Return:

- where the PRD was saved
- the short product thesis
- major scope boundaries
- the biggest open questions
- the exact recommended next DevFlow 2.0 command

---

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: product framing before implementation-ready scope exists
- Typical handoff targets: `/10-Define`, `/20-Spec`, `Roadmap`, `Spec-Orchestrate`

## Sources

- `AGENTS.md`
- `.agent/resources/schemas/prd.template.md`
- Related commands: `Brainstorm`, `Research`, `/10-Define`, `/20-Spec`, `Roadmap`, `Spec-Orchestrate`

## Next Workflow Recommendation

- **Primary**: `/10-Define` or `/20-Spec`
- **Why**: PRD shapes product intent; the Timeline flow should lock decisions and delivery contract before planning.
- **Alternative**: `Research` when technical feasibility or external dependencies are still unresolved.

