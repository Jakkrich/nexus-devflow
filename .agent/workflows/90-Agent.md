---
description: Invoke Agent - Run a specialist persona on a file, folder, task artifact, or codebase concern.
---
# Phase 90: Invoke Agent

Run a specialist agent persona for targeted expertise while preserving the PRPs script-first artifact contract.

## Usage

```text
/90-Agent {AGENT_NAME} {TARGET}
```

Examples:

```text
/90-Agent discuss-spec .workspaces/specs/007-example/spec.md
/90-Agent codebase-explorer src/services/
/90-Agent code-reviewer .workspaces/specs/007-example
```

## Available Agents

Agent definitions live in `../agents/`.

Planning and requirements:

| Agent | Purpose |
| :--- | :--- |
| `prp-core-planner` | Create implementation plans from specs and codebase patterns. |
| `discuss-spec` | Refine `spec.md` and requirements before planning. |
| `prp-core-prd-architect` | Draft PRD documents from early ideas. |
| `orchestrator` | Coordinate complex work and recommend next specialist steps. |
| `prp-core-boss` | Route `/goal` requests, decompose work, enforce turn budgets, and validate worker output. |

Research and exploration:

| Agent | Purpose |
| :--- | :--- |
| `codebase-explorer` | Find files, patterns, and examples. |
| `codebase-analyst` | Analyze architecture, data flow, and module relationships. |
| `web-researcher` | Research external APIs, docs, and best practices. |

Implementation:

| Agent | Purpose |
| :--- | :--- |
| `prp-core-coder` | Implement planned subtasks. |
| `prp-core-worker` | Execute focused Boss-assigned `/goal` subtasks and report validation status. |
| `backend-specialist` | Backend, APIs, database, server logic. |
| `frontend-specialist` | UI/UX and frontend implementation. |
| `database-architect` | Schema, indexing, and query design. |
| `code-simplifier` | Refactor without changing behavior. |
| `type-design-analyzer` | Type/interface consistency. |

Quality and debugging:

| Agent | Purpose |
| :--- | :--- |
| `test-engineer` | Unit and integration tests. |
| `prp-core-debugger` | Root cause analysis. |
| `code-reviewer` | Code review, risk, regressions. |
| `security-auditor` | Security and logic risk. |
| `performance-optimizer` | Performance bottlenecks. |
| `silent-failure-hunter` | Swallowed errors and missing observability. |

Git and docs:

| Agent | Purpose |
| :--- | :--- |
| `prp-core-git-committer` | Commit preparation and message quality. |
| `prp-core-git-pr-maker` | Pull request summary and preparation. |
| `docs-impact-agent` | Documentation impact analysis. |

## Artifact Contract

Specialist agents must follow the same script-first JSON rule:

- Do not silently rewrite full JSON artifacts.
- Use `npm run agent -- artifact:*` for generic JSON changes.
- Use `npm run agent -- plan:*` for `implementation_plan.json`.
- Run `npm run agent -- validate {ID}` after artifact mutation.
- If validation fails, use `npm run agent -- repair {ID}` or `npm run agent -- json:repair {ID} {artifact}`.

If the specialist is only reviewing, it should recommend exact commands instead of mutating artifacts.

## Process

1. Load persona from `../agents/{AGENT_NAME}.md`.
2. Read the target file, folder, task directory, or recent changes.
3. Apply the persona's specialist logic.
4. If JSON artifact changes are needed, use script commands.
5. Produce either a concise report or a focused set of changes.

## Output

If a report is substantial, save it to:

```text
.workspaces/reports/{AGENT_NAME}_{TIMESTAMP}.md
```

Before saving a substantial agent report, inspect `.agent/resources/schemas/agent_report.template.md` and use its required headings unless the target workflow provides a more specific template.

Short reports can be returned directly in chat.
