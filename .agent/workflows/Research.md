---
description: Codebase and evidence research. Transitional compatibility path for the Research companion command in DevFlow 2.0.
---

# Research - Codebase And Evidence Exploration

## Topic: $ARGUMENTS

This file keeps its old numeric path for migration compatibility.

In DevFlow 2.0, `Research` is a companion command, not a numbered mainline workflow. The operational behavior remains detailed so it can still function like the original research workflow.

## Purpose

Use `Research` to answer complex questions with code evidence, source material, and structured findings.

Use it when:

- facts are missing
- source material must be collected
- the codebase or external docs need deeper investigation
- Discover, Define, or Spec cannot proceed confidently without evidence

Preferred DevFlow 2.0 pairing:

- from `/00-Discover`
- from `/10-Define`
- from `/20-Spec`
- from `/50-Verify` when validating a claim or implementation choice

---

## Internal Process

You are an orchestrator. Your goal is to perform deep technical or evidence research while preserving the richer research UX from the original workflow.

Apply prompt addon patterns when the topic matches:

| Topic | Addon pattern | Output |
| :--- | :--- | :--- |
| External libraries, APIs, SDKs, services | `spec_researcher` | validated integration notes with sources and implementation constraints |
| Competitors, alternatives, market gaps | `competitor_analysis` | competitor list, pain points, differentiator opportunities |
| Completed implementation lessons | `insight_extractor` | reusable patterns, gotchas, file insights, recommendations |
| API/database/browser validation | `mcp_tools/*` | available validation steps for the current IDE/tooling |

### Phase 1: Query Decomposition

- clarify the research question
- classify whether the work is mainly codebase research, external research, or both
- identify the evidence needed to answer it

### Phase 2: Exploration

- locate relevant code with file and line references
- trace data flows, architecture, and integration points
- gather external documentation and source material when needed
- prioritize "what is" over "what should be"

### Phase 3: Synthesis And Documentation

- summarize key findings
- separate facts from inference
- record constraints, risks, and unanswered questions
- save the durable research note to disk

### Phase 4: Knowledge Management

- if significant patterns or durable lessons are discovered, recommend recording them in `.workspaces/lessons.md` or `Wiki`

## Output Format

Save the full research note to `.workspaces/research/{date}-{slug}.md`.

Before generating the report:

1. Inspect `.agent/resources/schemas/research.template.md`
2. Preserve its required headings and tables
3. Replace placeholder text with concrete evidence
4. Re-check the output against `research.template.md`, ensure required headings remain, and remove all placeholders before completion

Return a concise chat summary plus a persistent report with:

```markdown
## Research Summary: [Topic]

### Question
[What needed to be answered]

### Findings
- [Finding 1]
- [Finding 2]

### Evidence
- [file:line, source, or doc link]

### Constraints And Risks
- [Constraint]

### Open Questions
- [Question still unanswered]

### Recommended Next Step
- [What to do with this research]
```

## Examples

```text
Research auth patterns in the current codebase
Research Stripe webhook handling constraints
Research competitor onboarding flows
Research whether this API version is compatible
```

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: `/00-Discover`, `/10-Define`, `/20-Spec`, `/30-Plan`
- Typical handoff targets: return to the stage that asked for the evidence

## Sources

- `AGENTS.md`
- `.agent/resources/schemas/research.template.md`
- Related commands: `/00-Discover`, `/10-Define`, `/20-Spec`, `/30-Plan`, `Spec-Research`, `Agent`

## Next Workflow Recommendation

- Default: return to the stage that asked for evidence
- Common routes: `/10-Define`, `/20-Spec`, `/30-Plan`, or `/50-Verify`
- Alternate: `Brainstorm` if the research opens multiple strategic options

