---
name: 20-spec
description: "[devflow][D] Spec stage in DevFlow 2.0 - write the formal markdown-first specification from a stable definition."
argument-hint: "{running-id or workspace path}"
---

# Phase 20: Spec

$ARGUMENTS

Turn the defined work into a specification that is concrete enough for planning and explicit enough to serve as the delivery contract.

## Usage

```text
20-spec {running-id or workspace path}
```

Use this when:

- the goal and scope are stable
- the team needs testable or reviewable requirements
- planning should not start until the contract is explicit

## Markdown-First Contract

Write the primary stage artifact to:

```text
devflow/runs/{ID}-{slug}20-spec.md
```

using:

```text
.agent/resources/schemas/spec.template.md
```

Before writing `20-spec.md`, read `artifact_language` from `spec.template.md` and produce the artifact in that language.

## Required Section Content

Before completing any generated artifact:

- preserve every heading required by the selected template
- write concrete information under every heading
- when no information exists or the section does not apply, write exactly `-`
- never leave a heading immediately followed by another heading with no body content
- remove template placeholders from the final artifact
- do not invent facts merely to avoid using `-`
- re-read the saved artifact and verify every heading satisfies this rule

## Process

### Loop Contract

Run specification as a contract-hardening loop, not as a prose expansion of the definition.

- **Intent**: produce requirements and acceptance criteria that are concrete enough for planning and review.
- **Context**: read the run's `10-define.md`, follow its `source_discovery` link when original framing matters, and read relevant research, hard constraints, and domain or codebase decisions that shape this run's delivery contract.
- **Action**: write requirements, acceptance criteria, constraints, and out-of-scope items, then inspect whether each requirement is testable and unambiguous.
- **Observation**: use concrete evidence such as ambiguous wording, unchecked assumptions, edge cases, missing acceptance criteria, conflicting constraints, and implementation details that are not true constraints.
- **Adjustment**: if facts are missing, route to `Research`; if requirements need stress-testing, use `grill-with-docs`; if module or interface boundaries affect the contract, use `codebase-design`; if scope is unstable or still contains multiple independently deliverable contracts, return to `10-define` and split the run before continuing.
- **Stop Condition**: stop when every requirement has checkable acceptance criteria, hard constraints are explicit, out-of-scope items are visible, and `30-plan` can break the work down without inventing intent.
- **Handoff**: `20-spec.md` must tell `30-plan` what must be delivered, how success will be checked, what constraints cannot move, and what is intentionally excluded.

### 1. Read Definition Artifacts

Read:

- `10-define.md`
- the shared `00-explore.md` referenced by `source_discovery` when the original framing still matters
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

Do not combine sibling Running IDs into one spec. If this run still contains multiple independent acceptance, release, ownership, or context boundaries, stop and return to `10-define {running_id}` for an explicit split.

### 4. Finalize `20-spec.md`

- preserve the template headings
- follow the `artifact_language` configured in `spec.template.md`
- replace all placeholders
- keep implementation details out unless they are true constraints
- make sure the acceptance criteria can actually be checked

### 5. Manual Review Soft Gate

Before recommending `30-plan`, check whether the delivery contract has been human-reviewed.
If `Approval Status` is not approved yet:

- warn that planning may drift if the spec is still under review
- recommend review of requirements, exclusions, and acceptance criteria first
- keep `30-plan` as a soft recommendation only

## Output

Report:

- core requirements
- acceptance criteria
- hard constraints
- out-of-scope items
- manual review warnings when the contract is still pending
- recommended next step

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `10-define`
- Next state: `30-plan` when the contract is implementation-ready
- Common companion commands: `PRD`, `Spec-Research`, `Competitor`, `Spec-Orchestrate` when product or integration context is still incomplete; support skills: `grill-with-docs`, `domain-modeling`, and `codebase-design` when the spec depends on precise domain language, durable decisions, or module/interface constraints

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/spec.template.md`
- Related commands: `10-define`, `PRD`, `Spec-Research`, `Competitor`, `Spec-Orchestrate`, `30-plan`

## Next Workflow Recommendation

- **Primary**: `30-plan`
- **Why**: The specification is now concrete enough to break into executable work.
- **Alternatives**:
  - `Research` - choose this when the spec still depends on missing facts.
  - `grill-with-docs` - choose this when the spec is readable but not yet tough enough to plan from.
  - `codebase-design` - choose this when interface shape or testability constraints must be settled before planning.
  - `10-define` - choose this when the scope itself is still unstable.

## Nexus Event

- Use `Research` when a requirement, rule, or integration constraint still lacks evidence.
- Use `Spec-Research`, `Competitor`, or `PRD` when the contract needs stronger external, product, or market framing before planning.
- Use `grill-with-docs` when available if clarification could materially change acceptance criteria, edge cases, exclusions, or rules.
