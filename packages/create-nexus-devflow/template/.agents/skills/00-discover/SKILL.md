---name: 00-discover

description: Discover stage in DevFlow 2.0 - explore a request, route supporting inquiry, and decide whether delivery work should begin without allocating a running ID.
argument-hint: "{title, request, or discovery-id}"
---

# Phase 00: Discover

$ARGUMENTS

Explore a request before delivery commitment. Create or resume a Discovery ID, choose only the supporting route that the uncertainty requires, and finish with a visible `Proceed`, `Defer`, or `Reject` decision. Do not create a Running ID in this stage.

## Usage

```text
/00-Discover {title or request}
/00-Discover {discovery-id}
```

Use this when:

- a new request needs discussion before the team commits to delivery
- the best route may be `Brainstorm`, `PRD`, `Research`, or `Debug`
- supporting findings need to be synthesized into a go/no-go decision

## Markdown-First Contract

Write the primary discovery artifact to:

```text
devflow/discoveries/{DISCOVERY_ID}-{slug}/00-discover.md
```

using:

```text
.agent/resources/schemas/discover.template.md
```

Before writing `00-discover.md`, read `artifact_language` from `discover.template.md` and produce the artifact in that language.

A Discovery ID uses a separate namespace such as `DISC-YYYYMMDD-NNN`. It is not a Running ID and must not reserve a numeric delivery run.

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

Run discovery as a decision-and-routing loop, not as task initialization.

- **Intent**: understand the request, select proportionate supporting inquiry, and decide whether the idea should enter delivery definition.
- **Context**: read the request, the discovery artifact when resuming, companion outputs, project context, constraints, and available evidence.
- **Action**: restate the problem, identify the decision-blocking uncertainty, select `Brainstorm`, `PRD`, `Research`, `Debug`, or direct decision, then synthesize returned findings.
- **Observation**: use concrete evidence such as option tradeoffs, product framing, research results, root cause, stakeholder constraints, open questions, and visible risk.
- **Adjustment**: invoke only the companion route needed to resolve the current uncertainty; every companion invoked by Discover must return to this Discovery ID for synthesis.
- **Stop Condition**: stop when the selected route and evidence are recorded, open questions are visible, and the decision is `Proceed`, `Defer`, or `Reject`.
- **Handoff**: only an approved `Proceed` discovery may hand off to `/10-Define {discovery_id}`. `Defer` and `Reject` end without allocating a Running ID.

### 1. Create Or Resume The Discovery

- inspect `devflow/discoveries/`
- create a collision-free Discovery ID or resume the one supplied
- generate a stable slug
- do not inspect or increment numeric Running IDs during this stage

### 2. Ground The Request

- restate the request in plain language
- identify the affected users, stakeholders, or systems
- capture known constraints and decision-blocking unknowns
- distinguish an idea worth exploring from delivery work already approved elsewhere

### 3. Select The Supporting Route

Choose proportionally:

- `Brainstorm` when several viable directions need comparison
- `PRD` when user value, product outcomes, MVP boundaries, or success measures need framing
- `Research` when facts, codebase evidence, feasibility, or external constraints are missing
- `Debug` when the request begins with a failure and root cause is unknown
- direct decision when the request and evidence are already clear

Routes are not mutually exclusive, but do not stack them by default. Record why each selected route is necessary. Pass the Discovery ID to the companion and require its output to link back to the discovery.

### 4. Synthesize Returned Findings

After each companion route:

- update `00-discover.md` with the durable findings and source path
- reassess whether another route is materially necessary
- return to the Discover decision rather than jumping directly to `/10-Define`

### 5. Decide

Set one decision:

- `Proceed`: enough value and evidence exist to define delivery work
- `Defer`: the idea remains relevant but timing, evidence, or ownership is not ready
- `Reject`: the idea should not proceed under the current framing

Candidate delivery slices may be suggested, but they remain provisional and unnumbered until `/10-Define`.

### 6. Write `00-discover.md`

- preserve the template headings
- follow the configured `artifact_language`
- replace placeholders with concrete context
- record selected routes, returned findings, open questions, decision, and rationale
- keep `related_runs` empty until `/10-Define` materializes approved slices

### 7. Manual Review Gate

Before `/10-Define`:

- confirm the selected route and evidence are sufficient
- confirm the decision is `Proceed`
- set `Approval Status` to `Approved`

Do not allocate Running IDs when the decision or approval is pending.

## Output

Report:

- Discovery ID and artifact path
- request and problem summary
- selected support route and why
- important findings and open questions
- `Proceed`, `Defer`, or `Reject` decision
- recommended next step, including `/10-Define {discovery_id}` only when Proceed is approved

## Relationship To DevFlow 2.0

- Classification: Mainline discovery stage
- Previous state: request intake
- Next state: `/10-Define {discovery_id}` only after approved Proceed
- Common companion routes: `Brainstorm`, `PRD`, `Research`, `Debug`
- Running ID lifecycle: begins in `/10-Define`, not in Discover

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/discover.template.md`

## Next Workflow Recommendation

- **Primary**: the selected companion route, or `/10-Define {discovery_id}` after approved Proceed
- **Alternatives**:
  - `Brainstorm {discovery_id}` for unresolved options
  - `PRD {discovery_id}` for product framing
  - `Research {discovery_id}` for missing evidence
  - `Debug {discovery_id}` for unknown root cause
  - no next command when the decision is Defer or Reject

## Nexus Event

- Use `grill-with-docs` when focused clarification could change the decision or selected route.
- Use `prototype` when runnable evidence is the fastest way to settle feasibility.
