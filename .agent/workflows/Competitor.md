---
description: Competitor Analysis - Research competitors, user pain points, market gaps, and differentiator opportunities.
---

# Phase 16: Competitor Analysis

## Topic: $ARGUMENTS

Use this workflow when the user wants market context, alternative products, competitor positioning, user pain points, or differentiator ideas.

Primary behavior now lives in:

```text
.agent/skills/competitor-analysis/SKILL.md
```

Treat this workflow file as a compatibility wrapper around that skill.

## Prompt Source

Adapted from:

- `competitor_analysis.md`

## Process

### 1. Load Product Context

- Read `roadmap-discovery.md`, PRD, `spec.md`, or the user request.
- Identify project type, target audience, use case, and existing competitors.

### 2. Research Competitors

- Find direct competitors, indirect competitors, and common workarounds.
- Look for real user feedback: reviews, forums, issue trackers, comparison pages, social posts, public docs.
- Cite source links.
- Separate evidence from inference.

### 3. Analyze Opportunities

For each competitor, summarize:

- positioning
- strengths
- recurring pain points
- severity and frequency of pain points
- opportunity for this project

For market gaps, summarize:

- affected users
- competitor weakness
- possible feature or product angle
- confidence level

### 4. Create Competitor Analysis Report
- **MANDATORY:** Before generating the final report, inspect `.agent/resources/schemas/competitor_analysis.template.md`, preserve its required layout, and replace all placeholder text with concrete competitors, segments, strengths, gaps, and strategic recommendations.
- Save the final report to `.workspaces/research/{date}-{slug}-competitor-analysis.md` (where `{date}` is today's date in YYYY-MM-DD format, and `{slug}` is a URL-friendly name derived from the topic).

### 5. Route The Result

- For product strategy, send findings to `PRD` or `/10-Define`.
- For roadmap planning, send findings to `Roadmap`.
- For execution-ready opportunities, convert selected findings through `/20-Spec`.

## Output

Return a concise competitor analysis in chat, cite sources, verify that the report has been successfully written to the specified path, and recommend the next workflow.

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: `PRD`, `Roadmap`, `Spec-Orchestrate`
- Typical handoff targets: `PRD`, `Roadmap`, `/10-Define`, `/20-Spec`

## Sources

- `AGENTS.md`
- `.agent/skills/competitor-analysis/SKILL.md`
- `.agent/resources/schemas/competitor_analysis.template.md`
- Related commands: `PRD`, `Roadmap`, `Spec-Orchestrate`, `/10-Define`, `/20-Spec`


