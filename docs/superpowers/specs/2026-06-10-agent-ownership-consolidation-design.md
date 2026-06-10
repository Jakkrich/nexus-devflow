# Agent Ownership Consolidation Design

## Goal

Reduce overlapping agent responsibilities by removing `codebase-analyst`, making `codebase-explorer` the single codebase discovery agent, and documenting explicit ownership and handoff rules for the remaining overlapping agent groups.

## Scope

This change updates the Nexus-DevFlow agent personas and user-facing agent catalogs. It does not change PRP artifact schemas, workflow lifecycle commands, or introduce a compatibility alias for `codebase-analyst`.

## Canonical Codebase Discovery Agent

`codebase-explorer` becomes the only internal-codebase research persona. It owns both breadth and depth:

- locating relevant implementation, tests, configuration, types, and documentation;
- extracting existing implementation and test patterns;
- identifying entry points and integration boundaries;
- tracing actual data flow, state changes, side effects, contracts, error handling, and configuration;
- producing a unified factual report with precise file and line references.

It remains a documentarian. It must not critique code, diagnose root causes, assess security or performance, or recommend changes.

The file `.agent/agents/codebase-analyst.md` will be deleted. All examples, catalogs, planner guidance, and references will use `codebase-explorer`. Calls to the removed name are unsupported and should fail naturally rather than redirect through an alias.

## Unified Discovery Output

The merged `codebase-explorer` report contains these sections when relevant:

1. Overview and scope searched.
2. File locations grouped by implementation, tests, configuration, types, and documentation.
3. Entry points and module relationships.
4. Implementation flow and data flow.
5. Existing code and test patterns.
6. Contracts, state changes, side effects, error handling, and configuration.
7. Observed conventions and unresolved factual questions.

Every factual claim should cite an actual file and line. Code examples must come from the repository rather than being invented.

## Ownership Model

Each overlapping persona will define five explicit fields:

- **Owns:** decisions or deliverables for which the persona is accountable.
- **Does Not Own:** neighboring responsibilities that belong elsewhere.
- **Input:** the minimum context expected before work begins.
- **Output:** the concrete artifact, report, or change produced.
- **Handoff:** the next persona or lifecycle workflow and the condition that triggers transfer.

Lifecycle owners remain responsible for producing the primary artifact or completing execution. Specialists supply focused analysis or implementation within a bounded domain and return control to the lifecycle owner.

## Agent Boundaries

### Planning And Coordination

- `prp-core-prd-architect` owns product intent and PRD creation from early ideas. It hands an approved PRD to `requirements-engineer` or `/30-Task`.
- `requirements-engineer` owns requirement completeness, acceptance criteria, and task-ready specifications. It hands a validated spec to `prp-core-planner` or `/31-Plan`.
- `prp-core-planner` owns the executable implementation plan, dependency order, and validation strategy. It does not coordinate concurrent specialist execution. It hands an approved plan to `prp-core-coder` or `/32-Code`.
- `orchestrator` owns decomposition, specialist selection, parallel work boundaries, synthesis, and conflict resolution for complex multi-domain work. It does not replace the lifecycle artifact owner and hands synthesized results back to the appropriate workflow owner.

### Implementation

- `prp-core-coder` owns end-to-end execution of approved plan subtasks and the validation loop.
- `backend-specialist` owns bounded server-side implementation and advice for APIs, services, authentication, and backend business logic.
- `frontend-specialist` owns bounded user-interface implementation and advice for browser behavior, accessibility, responsive layout, and interaction.
- `database-architect` owns schema, migration, indexing, persistence-integrity, and query-design decisions.

Specialists return their changes, assumptions, and validation evidence to `prp-core-coder` or `/32-Code`. Cross-domain work remains coordinated by the lifecycle owner or `orchestrator` when parallel orchestration is explicitly needed.

### Quality

- `code-reviewer` owns the general correctness and regression review, consolidates cross-cutting findings, and routes deep specialist concerns.
- `test-engineer` owns test strategy, test implementation, coverage gaps, and execution evidence.
- `security-auditor` owns threat-focused security analysis, permissions, sensitive data, validation boundaries, and security findings.
- `performance-engineer` owns measurement-based performance analysis and bottleneck findings.

Specialists return findings to `code-reviewer` or the owning verification workflow. `code-reviewer` must not claim specialist depth without evidence from the relevant specialist lens.

### Support

- `coach-guideline` owns workflow selection, command guidance, and process coaching.
- `prp-core-codebase-assistant` owns concise answers about project structure and existing implementation logic.

The coach hands code-specific questions to the codebase assistant or `codebase-explorer`. The codebase assistant hands broad, evidence-heavy investigations to `codebase-explorer` and workflow-routing questions to the coach.

## Planner Integration

`prp-core-planner` will perform one unified codebase discovery pass instead of separate Explorer and Analyst passes. Its prompt will ask `codebase-explorer` to locate relevant code and patterns, trace entry points and data flow, document contracts and side effects, and return one discovery table used by the plan.

External research remains a separate `web-researcher` responsibility and occurs after codebase discovery.

## Documentation And Compatibility

All maintained catalogs and examples will list only `codebase-explorer`. Documentation will state that `codebase-analyst` was removed rather than deprecated. No alias file, redirect behavior, or dual-name support will be added.

The current framework version remains unchanged because this task changes persona contracts and documentation but does not alter the package or artifact format.

## Validation

Validation must demonstrate:

- no maintained file references `codebase-analyst`;
- `codebase-explorer` includes both location/pattern discovery and execution/data-flow analysis;
- each retained overlapping persona has explicit ownership and handoff guidance;
- planner guidance uses one unified discovery pass;
- `npm run validate` succeeds.

## Risks And Mitigations

- Existing users may still invoke `codebase-analyst`. The intentional breaking behavior keeps the catalog unambiguous; documentation will identify `codebase-explorer` as the replacement.
- The merged Explorer persona could become too broad. Its output is structured by discovery category, and its non-critic boundary remains strict.
- Ownership text could drift across catalogs and persona files. Validation includes repository-wide reference scans, and the canonical details live in each persona definition.
