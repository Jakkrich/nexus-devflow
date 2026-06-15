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
/90-Agent requirements-engineer .workspaces/specs/007-example/spec.md
/90-Agent codebase-explorer src/services/
/90-Agent code-reviewer .workspaces/specs/007-example
```

## Available Agents

Agent definitions live in `../agents/`.

Planning and requirements:

| Agent | Purpose |
| :--- | :--- |
| `prp-core-planner` | Create implementation plans from specs and codebase patterns. |
| `requirements-engineer` | Refine `spec.md` and requirements before planning. |
| `prp-core-prd-architect` | Draft PRD documents from early ideas. |
| `orchestrator` | Coordinate complex work and recommend next specialist steps. |
| `prp-core-boss` | Route `/goal` requests, decompose work, enforce turn budgets, and validate worker output. |

Research and exploration:

| Agent | Purpose |
| :--- | :--- |
| `codebase-explorer` | Find files and patterns; analyze architecture, data flow, and module relationships. |
| `web-researcher` | Research external APIs, docs, and best practices. |

Implementation:

| Agent | Purpose |
| :--- | :--- |
| `prp-core-coder` | Implement planned subtasks. |
| `prp-core-worker` | Execute focused Boss-assigned `/goal` subtasks and report validation status. |
| `backend-specialist` | Backend, APIs, database, server logic. |
| `frontend-specialist` | UI/UX and frontend implementation. |
| `database-architect` | Schema, indexing, and query design. |

Quality and debugging:

| Agent | Purpose |
| :--- | :--- |
| `test-engineer` | Unit and integration tests. |
| `prp-core-debugger` | Root cause analysis. |
| `code-reviewer` | Code review, risk, regressions. |
| `security-auditor` | Security and logic risk. |
| `performance-engineer` | Performance bottlenecks. |

Git and docs:

| Agent | Purpose |
| :--- | :--- |
| `prp-core-git-committer` | Commit preparation and message quality. |
| `prp-core-git-pr-maker` | Pull request summary and preparation. |
| `documentation-maintainer` | Documentation impact analysis. |

## Reusable Skills

The following former narrow agents are now skills. Invoke them through the responsible agent or workflow instead of `/90-Agent`:

| Skill | Apply Through |
| :--- | :--- |
| `code-simplification` | `prp-core-coder`, `code-reviewer`, or `/41-Simplify` |
| `type-design` | `backend-specialist`, `frontend-specialist`, `database-architect`, or `code-reviewer` |
| `silent-failure-audit` | `code-reviewer`, `test-engineer`, `backend-specialist`, or `security-auditor` |

## Artifact Contract

Specialist agents must follow the same script-first JSON rule:

- Do not silently rewrite full JSON artifacts.
- Use `npm run agent -- artifact:*` for generic JSON changes.
- Use `npm run agent -- plan:*` for `implementation_plan.json`.
- Run `npm run agent -- validate {ID}` after artifact mutation.
- If validation fails, use `npm run agent -- repair {ID}` or `npm run agent -- json:repair {ID} {artifact}`.

If the specialist is only reviewing, it should recommend exact commands instead of mutating artifacts.

## 9arm-Skills Discipline Routing

When the target task matches one of these review or communication modes, apply the credited local pack under `.agent/skills/9arm-skills/` while preserving the normal specialist output contract:

| Situation | Apply |
| :--- | :--- |
| `code-reviewer`, PR review, plan critique, or change risk review | `9arm-skills/scrutinize` |
| debug/RCA specialist work | `9arm-skills/debug-mantra` |
| completed bug/regression lesson extraction | `9arm-skills/post-mortem` |
| stakeholder-readable summary, PR body, release note, standup, or status update | `9arm-skills/management-talk` |

Reports that use the pack should include a short `Source Discipline` note with credit to `thananon/9arm-skills`.

## Process

1. Load persona from `../agents/{AGENT_NAME}.md`.
2. Read the target file, folder, task directory, or recent changes.
3. Apply the persona's specialist logic.
4. If JSON artifact changes are needed, use script commands.
5. Record lightweight context usage in the report or task log when the agent loads notable context.
6. Produce either a concise report or a focused set of changes.

## Output

If a report is substantial, save it to:

```text
.workspaces/reports/{date}-{agent-name}-{timestamp}.md
```

Before saving a substantial agent report, inspect `.agent/resources/schemas/agent_report.template.md` and use its required headings unless the target workflow provides a more specific template. Before reporting completion, run `npm run agent -- markdown:validate {report_path} agent_report.template.md` and replace any placeholder/template text with concrete files reviewed, findings, recommendations, and validation needs.

For substantial reports, add a short `Context Usage Notes` subsection under the context reviewed area with files/artifacts loaded, any known token counts, and one practical optimization note for future runs.

Short reports can be returned directly in chat.

## Next Workflow Recommendation

- **Primary**: the workflow that owns the target's lifecycle, such as `/31-Plan`, `/32-Code`, `/33-Verify`, `/54-Insight`, or `/55-PR-Review`.
- **Why**: `/90-Agent` supplies specialist judgment; the owning workflow should execute the next lifecycle step.
- **Alternatives**:
  - `/14-Orchestrate {target}` - choose this when multiple specialist perspectives are needed.
  - `/59-Wiki project ingest {report_path}` - choose this when the specialist report contains reusable project knowledge.
  - `/99-Help {target}` - choose this when the correct next route is unclear.

## Wiki Update Recommendation

- **Needed**: `yes` when the agent report captures reusable findings, conventions, gotchas, decisions, or context usage lessons.
- **Scope**: `project` for target-project knowledge, `framework` for DevFlow/agent behavior knowledge.
- **Reason**: Specialist reports are valuable wiki sources only when they contain reusable, source-backed conclusions.
- **Suggested Command**: `/59-Wiki project ingest .workspaces/reports/{date}-{agent-name}-{timestamp}.md`
