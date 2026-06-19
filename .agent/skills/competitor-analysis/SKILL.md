---
name: competitor-analysis
description: Research competitors, market alternatives, user pain points, and differentiation opportunities. Use when product framing, roadmap decisions, or strategic positioning need source-backed external context.
---

# Competitor Analysis

## Overview

This skill gathers market context and converts it into usable product insight for PRD, Define, Spec, or Roadmap work.

## When to Use

- The team needs to understand competitors or substitutes
- Product framing needs real external context
- Roadmap decisions need evidence about gaps or opportunities
- A feature idea needs differentiation, not just implementation detail

## Process

### 1. Load Product Context

- read the user request, PRD, Define, Spec, or Roadmap context
- identify target users, use case, and known alternatives

### 2. Gather Evidence

- find direct and indirect competitors
- inspect public docs, reviews, forums, comparisons, issue trackers, and discussion surfaces when available
- cite sources and separate evidence from inference

### 3. Analyze Opportunities

For each competitor or market segment, summarize:

- positioning
- strengths
- recurring pain points
- opportunity for the current project

### 4. Produce Reusable Output

If the result is reusable, write it under:

```text
.workspaces/research/{date}-{slug}-competitor-analysis.md
```

Use `.agent/resources/schemas/competitor_analysis.template.md` when saving a reusable report.

### 5. Route Back

- `PRD` for product framing
- `/10-Define` for scope and decision shaping
- `Roadmap` for prioritization
- `/20-Spec` when a selected opportunity becomes actionable

## Output

Return:

- competitors researched
- market gaps
- evidence-backed opportunities
- source links
- recommended return stage or command
