---
name: roadmap-strategy
description: Create or refresh product roadmap direction using markdown-first discovery and roadmap artifacts. Use when strategic planning should stay outside the mainline but still follow DevFlow 2.0 contracts.
---

# Roadmap Strategy

## Overview

This skill is the shared behavior layer behind `Roadmap`.

It replaces the older JSON-centered roadmap flow with a markdown-first strategy workflow that still preserves structured validation.

## Related Assets

This skill should reuse and align with:

- `.agent/resources/schemas/roadmap_discovery.template.md`
- `.agent/resources/schemas/roadmap.template.md`
- `ROADMAP.md`

## When to Use

- when product direction, priority, or sequencing needs a dedicated roadmap pass
- when competitor, PRD, research, or delivery insight should be consolidated into strategy
- when roadmap work should stay outside the numbered mainline but still hand off cleanly into `PRD`, `/10-Define`, or `/20-Spec`

## Canonical Artifacts

Use markdown-first artifacts:

- `.workspaces/roadmap/roadmap-discovery.md`
- `ROADMAP.md`

Optional supporting context may include:

- `.workspaces/project_index.json` until project-index migration is fully complete
- research notes
- PRD outputs
- release or insight notes

## Process

### 1. Load Current Strategy Context

Read the minimum useful context:

- existing `ROADMAP.md`
- `.workspaces/roadmap/roadmap-discovery.md`
- current research, competitor notes, PRD, or insights when relevant

### 2. Refresh Discovery

Capture:

- project purpose
- target users
- current state
- constraints
- market context
- known gaps

Save discovery notes in `.workspaces/roadmap/roadmap-discovery.md` using the discovery template.

### 3. Prioritize The Roadmap

Group roadmap work into useful strategic buckets such as:

- near-term improvements
- medium-term bets
- long-term bets
- technical debt and platform readiness

Keep priorities traceable to evidence from stage work, user feedback, competitor findings, or implementation insight.

### 4. Save The Canonical Roadmap

Update `ROADMAP.md` using `.agent/resources/schemas/roadmap.template.md`.

Replace placeholder content fully and keep headings and tables intact so validation can inspect the roadmap structure.

### 5. Route Back

- `PRD` when product framing needs to deepen
- `/10-Define` when roadmap decisions should become bounded work
- `/20-Spec` when one item is ready for delivery contract work
- `Brainstorm` when strategy is still too fuzzy to lock

## Output

Return:

- what changed in discovery
- what changed in the roadmap
- priority rationale
- validation result
- the recommended next command
