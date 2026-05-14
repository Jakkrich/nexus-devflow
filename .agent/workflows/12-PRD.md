---
description: Strategic PRD Generator (Orchestration) - Transform a product/feature idea into a problem-first, hypothesis-driven Product Requirements Document (PRD).
---
# 🧠 Phase 12: Strategic PRD Generator (Orchestration)

## Feature Idea: $ARGUMENTS

Transform a product/feature idea into a problem-first, hypothesis-driven Product Requirements Document (PRD).

---

## 🛠️ Internal Process

You are an orchestrator. Your goal is to call the specialized PRD Architect agent to generate a high-quality product specification.

### Phase 1: Interactive Discovery
**Call Agent**: `prp-core-prd-architect`
- Provide the feature idea (if any).
- If no idea is provided, the agent will initiate discovery via targeted questions.
- Support the agent in gathering info on:
  - **Who**: Persona and context.
  - **What**: The core problem.
  - **Why**: Limitations of existing solutions.
  - **Success**: Measurable outcomes.

### Phase 2: Grounding & Feasibility
- Facilitate the agent's research into technical feasibility and market context.
- Ensure the agent evaluates internal codebase patterns if applicable.

### Phase 3: Scope Definition
- Review the agent's MoSCoW prioritization (Must, Should, Won't).
- Confirm the MVP definition.

### Phase 4: Output Generation
- Ensure the PRD is saved as `.workspaces/prds/{slug}.prd.md`.
- Verify the document includes the problem statement, key hypotheses, and implementation phases.

---

📌 **Next Step**: Run `/30-Task` referencing the generated PRD to begin execution.
