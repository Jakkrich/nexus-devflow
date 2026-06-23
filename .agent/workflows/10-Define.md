---
description: Define stage in DevFlow 2.0 - convert discovery output into a stable, decision-ready work definition.
argument-hint: "{running-id or workspace path}"
---

# Phase 10: Define

$ARGUMENTS

Convert discovery output into a stable work definition by locking goals, scope boundaries, assumptions, and decision points before writing the formal spec.

## Usage

```text
/10-Define {running-id or workspace path}
```

Use this when:

- the problem is known but still needs sharper scope
- multiple interpretations still exist
- the team needs a stable definition before writing the spec

## Markdown-First Contract

Write the primary stage artifact to:

```text
.workspaces/specs/{ID}-{slug}/10-define.md
```

using:

```text
.agent/resources/schemas/define.template.md
```

Before writing `10-define.md`, read `artifact_language` from `define.template.md` and produce the artifact in that language.

## Process

### 1. Load Discovery Context

Read:

- `00-discover.md`
- any attached notes or research that materially affect scope

Understand:

- what the request is
- why it matters
- what is still unclear

### 2. Stabilize The Work Definition

Define:

- the core goal
- the intended outcome
- the important non-goals
- scope boundaries
- decision points that downstream stages must respect

### 3. Resolve Instability

If the direction is still unstable:

- use `Brainstorm` for option comparison

If evidence is missing:

- use `Research`

Do not move to Spec if the work can still be interpreted in materially different ways.

### 4. Write `10-define.md`

- preserve the template headings
- follow the `artifact_language` configured in `define.template.md`
- make the scope and success framing explicit
- keep implementation details out unless they are hard constraints

## Output

Report:

- core goal
- non-goals
- assumptions
- scope boundaries
- missing evidence or open risks
- recommended next step

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `/00-Discover`
- Next state: `/20-Spec` when scope, decisions, and constraints are stable
- Common companion commands: `Brainstorm` for unresolved options, `Research` for missing evidence

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/define.template.md`
- Related commands: `/00-Discover`, `Brainstorm`, `Research`, `/20-Spec`

## Next Workflow Recommendation

- **Primary**: `/20-Spec`
- **Why**: The work definition is stable enough to formalize into a delivery contract.
- **Alternatives**:
  - `Brainstorm` - choose this when multiple strategic directions are still open.
  - `Research` - choose this when missing evidence still blocks a confident spec.

