---
description: Codebase Research (Research Orchestration) - Answer complex questions about the codebase by mapping existing patterns, data flows, and architectures.
---
# 🗺️ Phase 11: Codebase Research (Research Orchestration)

## Topic: $ARGUMENTS

Answer complex questions about the codebase by mapping existing patterns, data flows, and architectures.

---

## 🛠️ Internal Process

You are an orchestrator. Your goal is to call the specialized Codebase Assistant agent to perform deep technical research.

Use the prompt addon patterns when the topic matches:

| Topic | Addon pattern | Output |
| :--- | :--- | :--- |
| External libraries, APIs, SDKs, services | `spec_researcher` | Validated integration notes with sources and implementation constraints |
| Competitors, alternatives, market gaps | `competitor_analysis` | Competitor list, real user pain points, differentiator opportunities |
| Completed implementation lessons | `insight_extractor` | Reusable patterns, gotchas, file insights, recommendations |
| API/database/browser validation | `mcp_tools/*` | Available validation steps for the current IDE/tooling |

### Phase 1: Query Decomposition
**Call Agent**: `prp-core-codebase-assistant`
- Provide the research topic or question.
- The agent will classify the query (Where, How, What, Pattern) and identify the scope.
- Use the `--web` flag if external documentation research is needed.

### Phase 2: Parallel Exploration
- The agent may recommend `/90-Agent codebase-explorer` or `/90-Agent codebase-analyst` to:
  - Locate relevant code with `file:line` references.
  - Trace data flows and integration points.
  - Extract existing project patterns.

### Phase 3: Synthesis & Documentation
- Ensure the agent prioritizes **What IS** over "What SHOULD BE" (Cartographer Mindset).
- **MANDATORY:** Before generating the research report, inspect `.agent/resources/schemas/research.template.md` and use its headings and table structure. Before reporting completion, run `npm run agent -- markdown:validate {report_path} research.template.md` and replace any placeholder/template text with concrete sources, findings, constraints, and follow-up questions.
- Verify the agent generates a research file in `.workspaces/research/{date}-{slug}.md`.
- Ensure all claims are backed by code evidence.
- For external research or competitor analysis, include source links and separate facts from inference.

### Phase 4: Knowledge Management
- If significant patterns or best practices are discovered, ensure they are also recorded in `.workspaces/lessons.md`.

---

📌 **Next Step**: Use this research to inform `/31-Plan` or `/20-Debug`.
