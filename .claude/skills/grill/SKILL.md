---
name: grill
description: "[devflow] Interactive Socratic alignment & domain modeling - stress-test plans, extract domain glossary, and record architecture decision records (ADRs) before delivery."
argument-hint: "{topic, plan, or question}"
---

# grill - Socratic Alignment & Domain Modeling

$ARGUMENTS

Use this skill to conduct a codebase-grounded, interactive Socratic interview with the user. It clarifies domain vocabulary, resolves architectural ambiguities, and prevents misalignment before writing specifications or code.

## Invocations & Aliases

- `/grill {topic or plan}`: Standard slash command in Claude Code, Google Antigravity, and Gemini CLI
- `grill {topic or plan}`: Plain text invocation
- `$grill {topic or plan}`: Codex CLI invocation
- `/align {topic}`: Alias for domain alignment

## Core Philosophy: Align Before You Build

1. **Codebase-Grounded**: Read existing code and context first. Never ask questions the codebase can already answer.
2. **One Round at a Time**: Ask 1-2 focused, high-leverage questions per round with clear recommended defaults. Never dump a wall of 10 questions.
3. **Lazy Inline Persistence**:
   - Write agreed domain terminology to `devflow/context/glossary.md` the moment each term resolves.
   - Record significant, hard-to-reverse technical decisions as ADRs in `devflow/decisions/ADR-xxx-{slug}.md`.
4. **Zero Assumptions**: Challenge ambiguities, contradictory requirements, and naming inconsistencies upfront.

---

## Process & Execution Loop

### 1. Grounding Phase (Silent Inspection)
Before asking the first question:
- Read `devflow/context/project-overview.md` and `devflow/context/coding-standards.md`.
- Inspect existing domain terms in `devflow/context/glossary.md` (if present).
- Search codebase patterns (`grep_search` / `rg`) related to the topic to ground technical reality.

### 2. Interactive Socratic Interview Loop
In each turn:
- Identify the most critical unresolved branch in the design tree:
  - **Domain Language & Boundaries**: "What exactly is an Entity X versus Entity Y in this context?"
  - **Data Flow & Contracts**: "Who owns state X? Synchronous vs. asynchronous?"
  - **Edge Cases & Failure Modes**: "What happens on network failure, concurrent mutation, or invalid input?"
  - **Irreversible Trade-offs**: "Database schema change vs. application-layer adapter?"
- Ask **1-2 questions maximum** per turn.
- Always provide a recommended default with concise technical rationale.
- Wait for the user's answer.

### 3. Immediate State Persistence

#### A. Domain Glossary (`devflow/context/glossary.md`)
When a domain term or conceptual definition crystallizes, immediately create or append to `devflow/context/glossary.md`:

```markdown
### [Term / Concept]
- **Definition**: Clear, unambiguous definition within this project.
- **Constraints**: Invariants, boundaries, or lifecycle rules.
- **Aliases / Related**: Related terms or common misnomers.
```

#### B. Architecture Decision Records (`devflow/decisions/ADR-xxx-{slug}.md`)
When a decision meets the 3 ADR criteria:
1. **Significant Impact**: Affects architecture, data schema, security, or public API.
2. **Hard to Reverse**: Changing it later requires painful migration or refactoring.
3. **Multiple Viable Alternatives**: There were real trade-offs between 2+ options.

Allocate the next sequential ID (`ADR-001`, `ADR-002`, ...) and create `devflow/decisions/ADR-xxx-{slug}.md`:

```markdown
# ADR-xxx: {Title}

- **Status**: Accepted
- **Date**: {YYYY-MM-DD}
- **Context**: {Why was this decision needed? What problem does it solve?}
- **Decision**: {What did we decide to do?}
- **Alternatives Considered**:
  - *Option 1*: {Pros / Cons}
  - *Option 2*: {Pros / Cons}
- **Consequences**:
  - *Positive*: {Benefits gained}
  - *Trade-offs / Risks*: {Costs, constraints, or follow-ups}
```

---

## 4. Closing & Handoff

When all design branches are resolved:
1. Summarize settled domain terms and created ADRs.
2. Provide explicit next command recommendations:
   - **Fast-Track (Standard Features/Fixes)**: Run `/feature {topic}` or `/fix {topic}` to immediately start the living spec.
   - **Deep-Track (Large Architectural Epics)**: Run `10-define` or `/discovery` with the discovery context.
