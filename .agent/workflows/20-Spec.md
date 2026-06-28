---
description: Spec stage in DevFlow 2.0 - write the formal markdown-first specification from a stable definition.
argument-hint: "{running-id or workspace path}"
---

# Phase 20: Spec

$ARGUMENTS

Turn the defined work into a specification that is concrete enough for planning and explicit enough to serve as the delivery contract.

## Usage

```text
/20-Spec {running-id or workspace path}
```

Use this when:

- the goal and scope are stable
- the team needs testable or reviewable requirements
- planning should not start until the contract is explicit

## Markdown-First Contract

Write the primary stage artifact to:

```text
.workspaces/specs/{ID}-{slug}/20-spec.md
```

using:

```text
.agent/resources/schemas/spec.template.md
```

Before writing `20-spec.md`, read `artifact_language` from `spec.template.md` and produce the artifact in that language.

## Process

### Loop Contract

Run specification as a contract-hardening loop, not as a prose expansion of the definition.

- **Intent**: produce requirements and acceptance criteria that are concrete enough for planning and review.
- **Context**: read `10-define.md`, `00-discover.md`, relevant research, hard constraints, and any domain or codebase decisions that shape the delivery contract.
- **Action**: write requirements, acceptance criteria, constraints, and out-of-scope items, then inspect whether each requirement is testable and unambiguous.
- **Observation**: use concrete evidence such as ambiguous wording, unchecked assumptions, edge cases, missing acceptance criteria, conflicting constraints, and implementation details that are not true constraints.
- **Adjustment**: if facts are missing, route to `Research`; if requirements need stress-testing, use `grill-with-docs`; if module or interface boundaries affect the contract, use `codebase-design`; if scope is unstable, return to `/10-Define`.
- **Stop Condition**: stop when every requirement has checkable acceptance criteria, hard constraints are explicit, out-of-scope items are visible, and `/30-Plan` can break the work down without inventing intent.
- **Handoff**: `20-spec.md` must tell `/30-Plan` what must be delivered, how success will be checked, what constraints cannot move, and what is intentionally excluded.

### 1. Read Definition Artifacts

Read:

- `10-define.md`
- `00-discover.md` when the original framing still matters
- research notes if they impose real constraints

### 2. Write The Specification

Define:

- core requirements
- acceptance criteria
- hard constraints
- explicit out-of-scope items

The spec should be strong enough that planning can break it into executable units without guessing intent.

### 3. Handle Missing Certainty

If the spec cannot be written confidently:

- call `Research` when facts are missing
- use `grill-with-docs` when requirements, acceptance criteria, constraints, or out-of-scope items need to be stress-tested against scenarios and domain language
- use `codebase-design` when requirements imply module boundaries, interface contracts, seams, or testability constraints
- record assumptions explicitly when they are unavoidable

Do not hide uncertainty inside vague requirement text.

### 4. Finalize `20-spec.md`

- preserve the template headings
- follow the `artifact_language` configured in `spec.template.md`
- replace all placeholders
- keep implementation details out unless they are true constraints
- make sure the acceptance criteria can actually be checked

## Output

Report:

- core requirements
- acceptance criteria
- hard constraints
- out-of-scope items
- recommended next step

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `/10-Define`
- Next state: `/30-Plan` when the contract is implementation-ready
- Common companion commands: `PRD`, `Spec-Research`, `Competitor`, `Spec-Orchestrate` when product or integration context is still incomplete; support skills: `grill-with-docs`, `domain-modeling`, and `codebase-design` when the spec depends on precise domain language, durable decisions, or module/interface constraints

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/spec.template.md`
- Related commands: `/10-Define`, `PRD`, `Spec-Research`, `Competitor`, `Spec-Orchestrate`, `/30-Plan`

## Next Workflow Recommendation

- **Primary**: `/30-Plan`
- **Why**: The specification is now concrete enough to break into executable work.
- **Alternatives**:
  - `Research` - choose this when the spec still depends on missing facts.
  - `grill-with-docs` - choose this when the spec is readable but not yet tough enough to plan from.
  - `codebase-design` - choose this when interface shape or testability constraints must be settled before planning.
  - `/10-Define` - choose this when the scope itself is still unstable.

