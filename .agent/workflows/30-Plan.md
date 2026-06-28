---
description: Plan implementation in DevFlow 2.0 - transform `20-spec.md` into a markdown-first executable plan.
---
# Phase 30: Plan Implementation

**Strict mode: planning only. Do not edit source code in this phase.**

Create a codebase-informed implementation plan using `30-plan.md` as the primary artifact in DevFlow 2.0.

## Usage

```text
/30-Plan {ID}
```

## Markdown-First Contract

Use `30-plan.md` as the main planning artifact.

Use controlled task-engine commands when plan status or subtask tracking must be synchronized:

Record complexity, context, phases, subtasks, and validation notes directly in the stage markdown files for this running ID. Treat `30-plan.md` as the source of truth.

**MANDATORY RULE:** If you create temporary script files (e.g. `.ps1`, `.sh`) to execute multiple compatibility commands in batch, save them inside the task workspace, never in the central `scripts/` directory.

## Process

### Loop Contract

Run planning as an evidence loop, not as a one-shot outline.

- **Intent**: produce a plan that lets implementation proceed without guessing scope, files, risks, or verification.
- **Context**: read the spec, prior stage artifacts, relevant code/docs, existing commands, and any research that constrains execution.
- **Action**: draft the smallest useful plan, then inspect whether every phase has files, dependencies, risks, verification, and a test decision.
- **Observation**: use concrete evidence such as file paths, existing patterns, package scripts, validation commands, and unresolved assumptions.
- **Adjustment**: if evidence is missing, search/read more, recommend `Research` or `Agent codebase-explorer`, split the work, or route back to `/20-Spec` when the contract is not plan-ready.
- **Stop Condition**: stop only when phases are ordered, subtasks are scoped, verification is explicit, test decisions are recorded, and any blockers are visible.
- **Handoff**: `30-plan.md` must give `/40-Implement` enough context to select one scoped unit and execute it without inventing intent.

### 1. Read Task Artifacts

Read:

- `.workspaces/specs/{ID}-*/20-spec.md`
- `10-define.md` and `00-discover.md` when they exist and help clarify intent

### 2. Assess Complexity

Use the old planning discipline:

- `simple`: 1 phase, 1-3 subtasks
- `standard`: multiple ordered phases with clear verification
- `complex`: deeper codebase exploration, possibly specialist help

If architecture or data flow is still unclear, recommend `Research` or `Agent codebase-explorer` before pretending the plan is stable.
If domain terms, boundaries, or hard-to-reverse design choices are still questionable, use `grill-with-docs` before locking the plan.
Use `codebase-design` when phases depend on seam placement or module interfaces. Use `tdd` when behavior-change subtasks need red-green-refactor test cases.

### 3. Explore Codebase Patterns

Use fast searches (`rg`, file reads) to find:

- similar implementations
- entry points
- config and test commands
- files likely to change
- patterns that implementation should mirror

Record important findings in `30-plan.md`. Use legacy context updates only when compatibility tooling still needs them.

### 4. Build The Plan

Use the old planner discipline, but keep `30-plan.md` as the main contract:

- record the planning loop evidence: context read, observations, adjustments made, stop condition, and handoff notes
- add phases in dependency order
- add subtasks that are small, verifiable units
- include explicit files to modify or create
- include patterns to follow
- include verification command or manual check
- include a test decision for every subtask
- record assumptions, scope boundaries, and risks explicitly

Each subtask should answer:

- what to change
- where to change it
- which pattern to follow
- how to verify it
- whether automated tests are required, manual, or not required

### 4.1 Test Decision Gate

**STRICT MANDATE (กฎเหล็ก Unit Test)**: สำหรับทุก subtask ที่มีการเพิ่ม แก้ไข หรือเปลี่ยนแปลงการทำงานของโค้ด (Behavior Change) **ต้องระบุเป็น `Required` เสมอ** ห้ามละเว้นเด็ดขาด ยกเว้นงานประเภทเอกสารหรือแก้ไข Configuration เท่านั้น

For every subtask, decide one of:

- `Required`: automated tests must be created or updated (Mandatory for all behavior changes)
- `Manual/Command Only`: verification is non-test but still explicit (Only for configuration/infrastructure tasks)
- `Not Required`: no new automated test is needed because there is no meaningful behavior surface (Only for documentation/comments)

Record:

- reason
- planned cases when tests are required (using AAA pattern: Arrange-Act-Assert)
- verification command or manual check
- expected result

Do not use "too simple" as the only reason for skipping tests.

### 5. Create Human-Readable Plan

Create `30-plan.md` in the task workspace and base its structure on:

```text
.agent/resources/schemas/plan.template.md
```

Before writing `30-plan.md`, read `artifact_language` from `plan.template.md` and produce the artifact in that language.

Before reporting completion:

Review `{plan_md_path}` against `plan.template.md`, keep the required headings, and remove placeholder text before completion.

Replace every placeholder with concrete phases, files, commands, dependencies, and verification evidence.
Follow the `artifact_language` configured in `plan.template.md` for all plan narrative text.

Create the checklist directory when detailed execution tracking is needed:

```text
.workspaces/specs/{ID}-*/checklists/
```

Seed at least:

- `implementation-checklist.md`
- `verification-checklist.md`

Use the schema templates under `.agent/resources/schemas/` and turn approved phases/subtasks into live markdown checklist items using task markers such as `- [ ]`, `- [/]`, `- [!]`, and `- [-]` so humans can follow the run without reading the full planning narrative.

### 6. Validate And Close Planning

Run:

Run `npm run validate` after changing the framework, templates, or shared references. For task work, manually verify that `30-plan.md` still matches the required template contract.

If validation fails, repair only what is necessary and keep `30-plan.md` aligned with the corrected state.

## Output Checklist

- complexity is clear
- loop evidence is recorded: intent, context, observation, adjustment, stop condition, and handoff
- phases are ordered by dependency
- every subtask is scoped and verifiable
- every subtask has a test decision
- `30-plan.md` is written and reviewable
- validation passes
- next command is ready

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `/20-Spec`
- Next state: `/40-Implement` when execution steps and verification are clear
- Common companion commands: `Research` or `Agent` when architecture, data flow, or external constraints still need investigation; support skills: `grill-with-docs`, `domain-modeling`, `codebase-design`, `tdd`, and `to-issues` for final design stress-testing, durable terminology capture, test planning, and issue packaging

## Sources

- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `.agent/resources/schemas/plan.template.md`
- Related commands: `/20-Spec`, `Research`, `Agent`, `/40-Implement`

## Next Workflow Recommendation

- **Primary**: `/40-Implement {ID}`
- **Why**: Approved planning is the gate before implementation in DevFlow 2.0.
- **Alternatives**:
  - `Research` - choose this when the plan still depends on missing evidence.
  - `Agent codebase-explorer .workspaces/specs/{ID}-*/` - choose this when architecture or data flow is unclear.
  - `grill-with-docs` - choose this when plan assumptions or design boundaries need one last adversarial pass.
  - `codebase-design` - choose this when a plan needs clearer seams, interfaces, or test surfaces.
  - `/20-Spec {ID}` - choose this when the spec itself is not strong enough for planning.

## Wiki Update Recommendation

- **Needed**: `yes` when planning records a reusable architecture decision, project pattern, or context-loading lesson.
- **Scope**: `project` unless the planning lesson changes DevFlow framework behavior.
- **Reason**: Plans often discover stable patterns that future sessions should reuse.
- **Suggested Command**: `Wiki project ingest .workspaces/specs/{ID}-*/30-plan.md`


