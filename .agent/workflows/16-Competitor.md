---
description: Competitor Analysis - Research competitors, user pain points, market gaps, and differentiator opportunities.
---

# Phase 16: Competitor Analysis

## Topic: $ARGUMENTS

Use this workflow when the user wants market context, alternative products, competitor positioning, user pain points, or differentiator ideas.

## Prompt Source

Adapted from:

- `competitor_analysis.md`

## Process

### 1. Load Product Context

- Read `roadmap_discovery.json`, PRD, `spec.md`, or the user request.
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
- **MANDATORY:** Before generating the final report, the agent MUST inspect the layout, required sections, and format defined in `.agent/resources/schemas/competitor_analysis.template.md` to ensure a consistent output layout.
- Save the final report to `.workspaces/research/{date}-{slug}-competitor-analysis.md` (where `{date}` is today's date in YYYY-MM-DD format, and `{slug}` is a URL-friendly name derived from the topic).

### 5. Route The Result

- For product strategy, send findings to `/12-PRD`.
- For roadmap planning, send findings to `/17-Roadmap`.
- For implementation, convert selected opportunities through `/30-Task`.

## Output

Return a concise competitor analysis in chat, cite sources, verify that the report has been successfully written to the specified path, and recommend the next workflow.
