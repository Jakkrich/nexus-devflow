<!-- nexus-devflow:start -->
# Nexus-DevFlow 2.0

Use Nexus-DevFlow when the user asks for DevFlow, stage-based workflow, running-id workspaces, or commands such as:

- `/00-Discover`
- `/10-Define`
- `/20-Spec`
- `/30-Plan`
- `/40-Implement`
- `/50-Verify`
- `/60-Report`
- `/70-Release`

Public companion commands are not part of the numbered mainline and should not use workflow numbers:

- `Goal`
- `Brainstorm`
- `Research`
- `Debug`
- `PRD`
- `Issue-Triage`
- `Wiki`
- `Check-For-Updates`
- `Help`

For Codex global installation, treat these command names as prompt forms routed through the single global skill `nexus-devflow`, not as separate generated command files.

Framework root: `d:\Projects\nexus-devflow`
Framework target mode: `workspace-stage-first`
Artifact contract: `markdown-first`

Before running a workflow:

- Read the matching file under `d:\Projects\nexus-devflow/.agent/workflows/`.
- Keep target project artifacts in the target project's `.workspaces` directory.
- Use stage `.md` files as the primary input/output contract.
- Keep numbered workflows strictly on the mainline only.
- Run validation before reporting completion.

Mainline rules:

1. Numbered workflows exist only for the linear mainline.
2. Mainline numbers must move from lower to higher with no backward jump.
3. If a command is not a true mainline state, do not give it a number.
4. Companion commands may be suggested by a mainline workflow but do not replace that workflow.

Update/check:

- Check local framework: `npm run validate`
- Check installed provider integration: inspect this managed block and compare Framework version with `d:\Projects\nexus-devflow/package.json`
- Upgrade local checkout: check `git status --short`; if clean, pull or ask the user to approve pull; then reapply this block with the new package version.
<!-- nexus-devflow:end -->

# DevFlow 2.0 Operating Model

## Timeline Workflow

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release
```

Each Timeline stage owns one primary markdown contract file inside the task workspace.

Example workspace layout:

```text
.workspaces/
  012-auth-refactor/
    00-discover/
      discover.md
    10-define/
      define.md
    20-spec/
      spec.md
    30-plan/
      plan.md
    40-implement/
      implement.md
    50-verify/
      verify.md
    60-report/
      report.md
      report.html
    70-release/
      release.md
```

## Running ID Rule

- Keep a running ID for each work item.
- Use the running ID as the stable reference across all stage folders and files.
- The workflow number is the stage state.
- The running ID is the work reference.

## Markdown Contract Rule

- Stage `.md` files are the only user-facing handoff contract in DevFlow 2.0.
- Context that used to live in JSON must move into stage `.md` files.
- Every stage uses a required template contract with fixed headings.
- Every template must also end with an open section so AI or the user can add custom headings when needed.

## Public Companion Commands

These are the public non-mainline commands that users may call directly:

| Command | Use when | Typical attachment point |
| :--- | :--- | :--- |
| `Goal` | The user starts with a broad goal and still needs routing | Before `00-Discover` or before a running ID exists |
| `Brainstorm` | The task is still fuzzy or has multiple directions | `00-Discover`, `10-Define` |
| `Research` | More source, codebase, or external knowledge is needed | `00-Discover`, `10-Define`, `20-Spec` |
| `Debug` | Root-cause investigation is needed | `40-Implement`, `50-Verify` |
| `PRD` | Product framing is needed before a stable spec exists | `10-Define`, `20-Spec` |
| `Issue-Triage` | Work starts from an issue intake rather than a stage artifact | Before `10-Define` or `Debug` |
| `Wiki` | Knowledge should be captured or queried | Any stage |
| `Check-For-Updates` | Install, upgrade, or verify Nexus-DevFlow setup for a machine or project | Before using DevFlow or when updating framework integration |
| `Help` | The user needs routing or explanation | Any stage |

## Internal Companion Surfaces

These files still exist because their prompt bodies contain useful behavior, but they should be treated as internal support surfaces or future skill/agent candidates rather than first-choice public commands:

- `Preview`
- `Simplify`
- `Spec-Research`
- `Competitor`
- `Roadmap`
- `Spec-Orchestrate`
- `Test`
- `QA-Orchestrate`
- `Followup`
- `Human-Approve`
- `Human-Feedback`
- `Human-ReCheck`
- `Human-Reject`
- `Commit`
- `PR`
- `PR-Review`
- `PR-Followup`
- `Merge`
- `Deploy`
- `Changelog`
- `Insight`
- `Agent`

## Workflow, Agent, Skill Boundary

| Type | Meaning | Rule |
| :--- | :--- | :--- |
| Workflow | A public stage on the Timeline | Owns stage state, required input/output, and next-step guidance |
| Agent | An accountable specialist role | Can be called directly or from a workflow |
| Skill | A reusable method or discipline | Can be loaded by workflows, agents, or users |
| Public companion command | A reusable user-facing command outside the numbered Timeline | Supports the active stage but does not replace it |
| Internal companion surface | A retained prompt surface that may later move into a skill or agent | Keep behavior, but do not treat it as the preferred public entry point |

## Stage Clarification Policy

Before advancing a run, the AI may ask targeted clarification questions when that interaction will materially improve the decision quality of the current stage.

Rules:

1. Clarification is optional, not mandatory.
2. Do not force the same questioning routine on every stage or every task.
3. Only gather information that can change the decision of the current stage.
4. Prefer the smallest useful interaction over a long interview.
5. If the environment has a `grill-with-docs` skill available, treat it as an internal support skill for deeper clarification, not as a public command or required pre-step.

Recommended use by stage:

- `/00-Discover`: optional only when the request, stakeholder, or constraints are still too unclear to choose the next route confidently
- `/10-Define`: preferred when scope, terminology, non-goals, decision boundaries, or success criteria are still unstable
- `/20-Spec`: useful when acceptance criteria, edge cases, rules, or integration constraints are still ambiguous
- `/30-Plan`: use sparingly when architecture, dependency order, rollout risk, or verification strategy still depends on unresolved decisions
- `/40-Implement` and later: avoid by default; only re-open deep questioning when a contradiction or missing decision forces a return to an earlier stage

Stage-specific information bias:

- `/00-Discover`: goal, pain point, urgency, affected users, known constraints
- `/10-Define`: scope, non-goals, success criteria, terminology, ownership boundaries
- `/20-Spec`: required behavior, edge cases, acceptance criteria, policy or rule constraints
- `/30-Plan`: dependency order, irreversible decisions, rollout risk, verification expectations

Do not collect extra background that does not affect the current stage decision.

## Nexus Event Policy

DevFlow distinguishes between `Next Allowed Command` and `Nexus Event`.

- `Next Allowed Command` is the Timeline continuation for the current stage.
- `Nexus Event` is an optional branch, support skill, companion command, or specialist route that may help when the current conversation reveals a specific need.

Rules:

1. `Nexus Event` must not replace the Timeline stage model.
2. `Nexus Event` is situational and should be chosen by the AI and user based on the conversation, not forced by default.
3. `Nexus Event` should describe why a branch is useful and imply that the run returns to the Timeline afterward.
4. Prefer a small set of high-signal hints over an exhaustive list.
5. Include skills, companion commands, or specialist routes only when they are plausible from the current stage context.

Maintainer note:

- Use `docs/governance-rules.md` when deciding whether a future framework change belongs in a workflow, skill, script, validation rule, or focused maintainer doc.
- Keep the public surface stable unless the change truly needs a new user-facing command or lifecycle state.

## Agent Catalog

### 1. Discovery, Definition, and Planning

Use mainly in `/00-Discover`, `/10-Define`, `/20-Spec`, `/30-Plan`

| Agent | Role | Primary responsibility |
| :--- | :--- | :--- |
| `prp-core-planner` | Planner | Build plans and implementation structure |
| `requirements-engineer` | Requirements analyst | Refine goals, scope, and requirements |
| `prp-core-prd-architect` | Product/spec architect | Help shape requirement documents when needed |
| `orchestrator` | Orchestrator | Coordinate multi-agent work |
| `prp-core-codebase-assistant` | Codebase assistant | Answer architecture and codebase questions |
| `codebase-explorer` | Explorer | Find files, patterns, flows, and references |
| `web-researcher` | Researcher | External docs, APIs, best practices, and citations |

### 2. Implementation

Use mainly in `/40-Implement`

| Agent | Role | Primary responsibility |
| :--- | :--- | :--- |
| `prp-core-coder` | Implementer | Make the code changes |
| `backend-specialist` | Backend specialist | API, business logic, server architecture |
| `frontend-specialist` | Frontend specialist | UI/UX and frontend implementation |
| `database-architect` | Database architect | Schema, indexes, query design |

### 3. Verification and Hardening

Use mainly in `/50-Verify`

| Agent | Role | Primary responsibility |
| :--- | :--- | :--- |
| `test-engineer` | Test engineer | Write and run test coverage plans |
| `prp-core-debugger` | Debugger | Root cause analysis and fix validation |
| `code-reviewer` | Reviewer | Quality, risk, correctness, maintainability |
| `security-auditor` | Security auditor | Security and logic-risk review |
| `performance-engineer` | Performance engineer | Performance bottlenecks and validation |
| `penetration-tester` | Penetration tester | Offensive security validation when explicitly needed |

### 5. Infrastructure and Maintenance

Use mainly for overnight maintenance loops, security/lint automation, and repository cleanup.

| Agent | Role | Primary responsibility |
| :--- | :--- | :--- |
| `ob-loop-engineer` | Maintenance specialist | Run overnight asynchronous maintenance and cleanup loops |

### 6. Release and Documentation

Use mainly in `/60-Report`, `/70-Release`

| Agent | Role | Primary responsibility |
| :--- | :--- | :--- |
| `prp-core-git-committer` | Commit specialist | Commit preparation and git packaging |
| `prp-core-git-pr-maker` | PR specialist | Pull request preparation |
| `documentation-maintainer` | Documentation maintainer | Doc updates and impact notes |
| `devops-engineer` | DevOps engineer | Deploy, release, and environment readiness |
| `coach-guideline` | Guide | Help wording, onboarding, and process explanation |

## Reusable Skills

These are not numbered workflows and should be invoked through the active stage, the responsible agent, or by the user directly when needed.

Use `docs/skill-selection-policy.md` when multiple skills appear to fit. Stage ownership wins, choose one primary skill per pass, add secondary skills only for distinct bounded purposes, and prefer the most specific skill when descriptions overlap.

| Skill | Typical use |
| :--- | :--- |
| `brainstorming` | Before locking direction in Discover or Define |
| `grill-with-docs` | During Define or Spec to stress-test fuzzy domain language, boundaries, decisions, and acceptance targets; optionally before Plan to challenge a nearly locked design |
| `domain-modeling` | During Define, Spec, or Plan when glossary terms or durable architectural decisions must be captured |
| `codebase-design` | During Spec, Plan, Implement, or Verify when module boundaries, seams, interfaces, or testability need design pressure |
| `diagnosing-bugs` | During Debug, Implement, or Verify when a tight repro loop is needed before fixing broken, flaky, or slow behavior |
| `tdd` | During Plan, Implement, or Verify when behavior changes need red-green-refactor evidence |
| `review` | During Verify or Release when changed work needs standards and spec review as separate axes |
| `handoff` | Any stage when context must transfer without duplicating existing artifacts |
| `writing-great-skills` | When creating, importing, pruning, or refactoring DevFlow skills |
| `to-prd` | Behind PRD when existing context should be synthesized into a product document without another interview |
| `to-issues` | Behind Plan or Issue-Triage when a PRD, spec, or plan should become vertical issue slices |
| `prototype` | During Discover, Define, Spec, Research, or Plan when a runnable experiment is needed to answer an uncertainty |
| `triage` | Behind Issue-Triage when incoming reports need classification, verification, and agent-ready briefs |
| `preview-local-check` | During Implement or Verify for local preview and smoke checks |
| `code-simplification` | During Implement or Verify |
| `spec-research` | During Spec or Verify when integrations need source-backed confirmation |
| `competitor-analysis` | During PRD, Define, or Roadmap when market context is needed |
| `roadmap-strategy` | During strategic planning when roadmap work should stay outside the numbered mainline |
| `spec-orchestration` | During complex discovery or framing when multiple support lanes are needed before spec |
| `test-execution-and-coverage` | During Implement or Verify for explicit testing evidence |
| `verification-orchestration` | During Verify when multi-lane QA coordination is needed |
| `pr-review-analysis` | During Verify or Release when a structured findings-first review is needed |
| `review-followup-routing` | After review, QA, or human feedback when existing work must be extended or classified |
| `insight-capture` | After Verify, debugging, or release work when lessons should become durable knowledge |
| `human-review-decisions` | After Verify when a human approval, feedback, rejection, or recheck gate is needed |
| `release-git-operations` | During Release for commit, PR, merge, deploy, and changelog support |
| `type-design` | During Define, Spec, or Verify |
| `silent-failure-audit` | During Verify |
| `workflow-documentation-sync` | When updating framework docs and workflow docs |
| `intelligent-routing` | When deciding which agent or skill to call next |
| `specialist-agent-routing` | When the user wants direct specialist judgment on a bounded target |
| `planning-and-task-breakdown` | During Plan |
| `shipping-and-launch` | During Release |
| `grill-with-docs` | Optional during Define, Spec, or complex Plan work when deeper clarification is needed before advancing stage decisions |

## Deprecation Notes

- Dashboard-centered flow is legacy in DevFlow 2.0.
- Old numbered commands that are not mainline should be treated as retired legacy references, not active workflow choices.
