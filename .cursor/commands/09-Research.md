# 🗺️ Codebase Research (Research Orchestration)

## Topic: $ARGUMENTS

Answer complex questions about the codebase by mapping existing patterns, data flows, and architectures.

---

## 🛠️ Internal Process

You are an orchestrator. Your goal is to call the specialized Codebase Assistant agent to perform deep technical research.

### Phase 1: Query Decomposition
**Call Agent**: `prp-core-codebase-assistant`
- Provide the research topic or question.
- The agent will classify the query (Where, How, What, Pattern) and identify the scope.
- Use the `--web` flag if external documentation research is needed.

### Phase 2: Parallel Exploration
- The agent will spawn parallel specialized tasks (e.g., `codebase-explorer`, `codebase-analyst`) to:
  - Locate relevant code with `file:line` references.
  - Trace data flows and integration points.
  - Extract existing project patterns.

### Phase 3: Synthesis & Documentation
- Ensure the agent prioritizes **What IS** over "What SHOULD BE" (Cartographer Mindset).
- Verify the agent generates a research file in `.auto-claude/research/{date}-{slug}.md`.
- Ensure all claims are backed by code evidence.

### Phase 4: Knowledge Management
- If significant patterns or best practices are discovered, ensure they are also recorded in `.auto-claude/lessons.md`.

---

📌 **Next Step**: Use this research to inform `/02-Plan` or `/06-Debug`.
