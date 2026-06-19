---
description: Discover stage in DevFlow 2.0 - turn a raw request into a grounded running-id workspace and decide the correct next step.
argument-hint: "{title or request}"
---

# Phase 00: Discover

$ARGUMENTS

Start a new DevFlow 2.0 run by grounding the request, creating or selecting the running ID, and deciding whether the work should go to Define, Brainstorm, or Research.

## Usage

```text
/00-Discover {title or request}
```

Use this when:

- a new request arrives
- the work has not been anchored to a running ID yet
- the team needs to understand whether the request is stable enough to define

## Markdown-First Contract

Write the primary stage artifact to:

```text
.workspaces/specs/{ID}-{slug}/00-discover.md
```

using:

```text
.agent/resources/schemas/discover.template.md
```

Do not route new DevFlow 2.0 work through JSON-first task initialization.

## Process

### 1. Intake The Request

- restate the request in plain language
- identify the obvious problem or opportunity
- identify the user, stakeholder, or system affected
- note constraints that are already visible

### 2. Anchor The Run

- inspect the current workspace layout
- choose or create the running ID
- generate a stable slug
- establish the canonical workspace path

### 3. Assess Stability

Decide whether the request is:

- **stable enough for Define**
- **still fuzzy and should use Brainstorm**
- **missing evidence and should use Research**

Do not pretend the request is well-defined if it is still ambiguous.

### 4. Write `00-discover.md`

- preserve the template headings
- replace placeholders with concrete context
- capture open questions explicitly
- capture assumptions only when they are necessary and visible

## Output

Report:

- running ID and workspace path
- restated request
- target problem or opportunity
- known constraints
- open questions
- recommended next step

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: Start of a new run
- Next state: `/10-Define` when scope is ready
- Common companion commands: `Brainstorm` when the request is fuzzy, `Research` when evidence is missing

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/discover.template.md`
- Related commands: `Brainstorm`, `Research`, `/10-Define`

## Next Workflow Recommendation

- **Primary**: `/10-Define`
- **Why**: The request is grounded and ready for scope and decision locking.
- **Alternatives**:
  - `Brainstorm` - choose this when direction is still unstable.
  - `Research` - choose this when missing facts block a confident definition.

