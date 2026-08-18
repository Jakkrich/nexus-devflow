---name: 10-define

description: "[Devflow] Define stage in DevFlow 2.0 - turn an approved discovery into one or more bounded delivery runs with stable scope."
argument-hint: "{approved discovery-id, discovery path, running-id, or run path}"
---

# Phase 10: Define

$ARGUMENTS

Convert an approved `Proceed` discovery into bounded delivery slices. Allocate one Running ID per independently specifiable and reviewable slice, then write one `10-define.md` contract per generated run. This is the first stage that creates Running IDs.

## Usage

```text
10-define {discovery-id or discovery path}
10-define {running-id or run path}
```

Use a Discovery ID to materialize new delivery runs. Use an existing Running ID only to revise or split a definition that already exists.

## Markdown-First Contract

For every approved delivery slice, write:

```text
devflow/runs/{ID}-{slug}10-define.md
```

using:

```text
.agent/resources/schemas/define.template.md
```

Before writing any `10-define.md`, read `artifact_language` from `define.template.md` and produce every generated artifact in that language.

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

Run definition as a scope-stabilization and run-allocation loop.

- **Intent**: turn an approved discovery into the smallest coherent set of delivery runs that can each be specified, planned, implemented, and verified without carrying the entire initiative context.
- **Context**: read the approved `00-discover.md`, linked Brainstorm/PRD/Research/Debug outputs, project-wide rules, existing run IDs, and dependencies between candidate slices.
- **Action**: lock initiative and scope boundaries, decompose delivery slices, review the run map, allocate collision-free Running IDs, and write one `10-define.md` per slice.
- **Observation**: use independent acceptance boundaries, release boundaries, ownership, dependencies, context size, cross-domain coupling, and reviewability as evidence for splitting or combining slices.
- **Adjustment**: merge slices that are only implementation tasks; split slices that require separate specs, releases, ownership, or large independent context; return to `00-discover` if the decision or product direction is still unstable.
- **Stop Condition**: stop when the run map is approved, IDs are materialized without collision, each run has stable in/out scope, and every generated run can proceed independently to `20-spec {running_id}`.
- **Handoff**: each `10-define.md` must identify its source Discovery ID, sibling runs, dependencies, scope, non-goals, and exact next command.

### 1. Validate The Discovery Gate

For new delivery work, require:

- `Decision: Proceed`
- `Approval Status: Approved`
- a resolvable Discovery ID and `00-discover.md`

If either gate is missing, do not create a Running ID. Return to `00-discover {discovery_id}`.

### 2. Build The Delivery Run Map

Define candidate slices around coherent delivery outcomes, not small tasks.

Create separate runs when work has materially independent:

- acceptance or verification boundaries
- release or rollback boundaries
- domain context or ownership
- dependency sequencing
- implementation context large enough to threaten reliable planning or review

Keep ordinary subtasks inside `30-plan` and checklists.

For every slice record:

- title and slug
- outcome and scope boundary
- exclusions
- dependencies
- shared project constraints
- reason it deserves one Running ID

### 3. Review Before Allocation

Present the proposed run map for human review before consuming numeric IDs when the split is large, disputed, or high risk. A single clear slice may proceed directly when approval is already explicit.

### 4. Allocate Running IDs

- inspect `devflow/runs/` immediately before allocation
- choose sequential IDs after the highest existing numeric Running ID
- never reuse a gap merely because it is available
- create each target directory immediately to reserve it
- recheck for collisions before writing artifacts
- if any collision occurs, stop, rescan, and allocate a fresh contiguous range

One invocation may create one or many Running IDs. Record the complete allocation back into the source discovery's `related_runs` and allocated-run section.

### 5. Write One `10-define.md` Per Run

- preserve template headings
- set `source_discovery`
- identify sibling runs and dependencies
- carry forward only the project context needed by this slice
- make scope, non-goals, assumptions, and success criteria explicit
- keep implementation tasks out of Define

### 6. Split An Existing Run When Necessary

If an existing definition is too broad:

- propose a replacement run map
- preserve traceability to the original run and discovery
- allocate new IDs only after approval
- mark the old definition as `Superseded` and list its replacement runs
- do not silently fork scope during `20-spec`

### 7. Manual Review Gate

Before recommending `20-spec`, confirm each generated definition independently. Approval of one run must not imply approval of every sibling run.

## Output

Report:

- source Discovery ID
- proposed and allocated run map
- workspace path for every generated run
- scope and dependency summary per run
- any superseded run
- exact `20-spec {running_id}` commands for approved runs

## Relationship To DevFlow 2.0

- Classification: Mainline workflow and Running ID creation boundary
- Previous state: approved `00-discover`
- Next state: `20-spec {running_id}` per generated run
- Running ID lifecycle: starts here

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/define.template.md`

## Next Workflow Recommendation

- **Primary**: `20-spec {running_id}` for each approved run
- **Alternatives**:
  - `00-discover {discovery_id}` when the go/no-go decision or direction is unstable
  - `Research {discovery_id}` when evidence still blocks a reliable split
  - `grill-with-docs` when boundaries or terminology remain ambiguous

## Nexus Event

- Use `domain-modeling` when sibling runs need shared language or durable architectural decisions.
- Use `planning-and-task-breakdown` only after the delivery boundary is stable; small tasks belong in `30-plan`, not separate Running IDs.
