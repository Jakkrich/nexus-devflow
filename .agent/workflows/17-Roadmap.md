---
description: Roadmap - Update or review roadmap discovery and feature priorities under .workspaces/roadmap.
---

# Phase 17: Roadmap

## Topic: $ARGUMENTS

Use this workflow to create, review, or refine product roadmap artifacts.

## Prompt Source

Adapted from:

- `roadmap_discovery.md`
- `roadmap_features.md`
- `competitor_analysis.md` when market context is needed
- `insight_extractor.md` when completed work should influence priorities

## Roadmap Artifacts

```text
.workspaces/roadmap/project_index.json
.workspaces/roadmap/roadmap_discovery.json
.workspaces/roadmap/roadmap.json
ROADMAP.md
```

## Process

### 1. Load Current Roadmap State

Read:

```powershell
npm.cmd run roadmap:validate
```

Then inspect `.workspaces/roadmap/roadmap_discovery.json`, `.workspaces/roadmap/roadmap.json`, and `ROADMAP.md`.

### 2. Discover Or Refresh Strategy

Use `roadmap_discovery` pattern to clarify:

- project purpose
- target audience
- current product state
- constraints
- market context
- known gaps

Use `/16-Competitor` first when competitor evidence is needed.

### 3. Prioritize Features

Use `roadmap_features` pattern to group work into:

- near-term improvements
- medium-term product bets
- long-term strategic bets
- technical debt and platform readiness

Keep roadmap items traceable to evidence from specs, user feedback, competitor findings, or implementation insights.

When creating or updating `ROADMAP.md`, inspect `.agent/resources/schemas/roadmap.template.md` first and preserve its required headings and table structure.

### 4. Validate

Run:

```powershell
npm.cmd run roadmap:validate
npm.cmd run validate
```

## Output

Return:

- what roadmap artifacts changed or should change
- priority rationale
- validation result
- recommended next step: `/12-PRD`, `/30-Task`, or `/10-Brainstorm`
