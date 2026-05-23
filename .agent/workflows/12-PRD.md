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
- Apply `spec_researcher` when the PRD mentions external APIs, SDKs, databases, cloud services, or other integrations.
- Apply `competitor_analysis` when the idea needs market positioning, alternative products, user pain points, or differentiator opportunities.

### Phase 3: Scope Definition
- Review the agent's MoSCoW prioritization (Must, Should, Won't).
- Confirm the MVP definition.

### Phase 4: Output Generation
- **MANDATORY:** Before generating the PRD, inspect `.agent/resources/schemas/prd.template.md` and use its required headings and table structure. Before reporting completion, run `npm run agent -- markdown:validate {prd_path} prd.template.md` and replace any placeholder/template text with concrete product details, assumptions, risks, metrics, and open questions.
- Ensure the PRD is saved as `.workspaces/prds/{slug}.prd.md`.
- Verify the document includes the problem statement, key hypotheses, and implementation phases.
- Convert any autonomous `spec_orchestrator_agentic` assumptions into explicit next steps. The user should still confirm before `/30-Task` and `/31-Plan`.

---

📌 **Next Step**: Run `/30-Task` referencing the generated PRD to begin execution.
