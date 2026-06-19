---
description: Roadmap - Update or review roadmap discovery and feature priorities under .workspaces/roadmap.
---

# Phase 17: Roadmap

## Topic: $ARGUMENTS

Use this workflow to create, review, or refine product roadmap artifacts.

Primary behavior now lives in the `roadmap-strategy` skill. Keep this workflow as the compatibility wrapper and user-facing strategy prompt surface.

## Prompt Source

Adapted from:

- `roadmap_discovery.md`
- `roadmap_features.md`
- `competitor_analysis.md` when market context is needed
- `insight_extractor.md` when completed work should influence priorities

## Roadmap Artifacts

```text
.workspaces/roadmap/roadmap-discovery.md
ROADMAP.md
```

## Process

### 1. Load Current Roadmap State

Read:

```powershell
npm.cmd run roadmap:validate
```

Then inspect `.workspaces/roadmap/roadmap-discovery.md` and `ROADMAP.md`.

### 2. Discover Or Refresh Strategy

Use markdown-first discovery to clarify:

- project purpose
- target audience
- current product state
- constraints
- market context
- known gaps

Use `Competitor` first when competitor evidence is needed.

### 3. Prioritize Features

Use roadmap prioritization to group work into:

- near-term improvements
- medium-term product bets
- long-term strategic bets
- technical debt and platform readiness

Keep roadmap items traceable to evidence from specs, user feedback, competitor findings, or implementation insights.

When refreshing discovery, inspect `.agent/resources/schemas/roadmap_discovery.template.md` first and replace placeholder text with real context, constraints, strategy inputs, and sources.

When creating or updating `ROADMAP.md`, inspect `.agent/resources/schemas/roadmap.template.md` first, preserve its required headings and table structure, and replace any placeholder text with concrete phases, features, rationale, risks, dependencies, and validation needs.

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
- recommended next step: `PRD`, `/10-Define`, `/20-Spec`, or `Brainstorm`

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: `PRD`, `Competitor`, strategic planning requests
- Typical handoff targets: `/10-Define`, `/20-Spec`, `PRD`

## Sources

- `AGENTS.md`
- `.agent/resources/schemas/roadmap_discovery.template.md`
- `.agent/resources/schemas/roadmap.template.md`
- Related commands: `PRD`, `Competitor`, `/10-Define`, `/20-Spec`


