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
- Common companion commands: `PRD`, `Spec-Research`, `Competitor`, `Spec-Orchestrate` when product or integration context is still incomplete; support skills: `grill-with-docs` and `domain-modeling` when the spec depends on precise domain language or durable decisions

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
  - `/10-Define` - choose this when the scope itself is still unstable.

