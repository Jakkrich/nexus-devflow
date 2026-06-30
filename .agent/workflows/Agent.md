---
description: Invoke Agent - Run a specialist persona on a file, folder, stage artifact, or codebase concern.
---
# Phase 90: Invoke Agent

Run a specialist agent persona for targeted expertise while preserving the DevFlow 2.0 stage-first contract.

Primary behavior now lives in the `specialist-agent-routing` skill. Keep this workflow as the compatibility wrapper and advanced user-facing agent entry point.

## Usage

```text
Agent {AGENT_NAME} {TARGET}
```

Examples:

```text
Agent requirements-engineer .workspaces/specs/007-auth-refactor/20-spec.md
Agent codebase-explorer src/services/
Agent code-reviewer .workspaces/specs/007-auth-refactor
```

## Available Agents

Agent definitions live in `../agents/`.

Planning and requirements:

| Agent | Purpose |
| :--- | :--- |
| `prp-core-planner` | Create implementation plans from specs and codebase patterns. |
| `requirements-engineer` | Refine `10-define.md` and `20-spec.md` before planning. |
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

The following former narrow agents are now skills. Invoke them through the responsible agent or workflow instead of `Agent`:

| Skill | Apply Through |
| :--- | :--- |
| `code-simplification` | `prp-core-coder`, `code-reviewer`, or `Simplify` |
| `type-design` | `backend-specialist`, `frontend-specialist`, `database-architect`, or `code-reviewer` |
| `silent-failure-audit` | `code-reviewer`, `test-engineer`, `backend-specialist`, or `security-auditor` |

## Artifact Contract

Specialist agents must use the DevFlow 2.0 stage-first contract:

- Prefer `00-discover.md`, `10-define.md`, `20-spec.md`, `30-plan.md`, `40-implement.md`, `50-verify.md`, `70-release.md`, and `60-report.md` as the primary artifacts.
- Do not silently rewrite legacy JSON artifacts.
- If migration work still requires JSON, prefer CLI-backed minimal updates instead of full-file rewrites.
- If the specialist is only reviewing, recommend exact commands instead of mutating artifacts.
- Keep reports readable without requiring a dashboard or JSON viewer.

## 9arm-Skills Discipline Routing

When the target task matches one of these review or communication modes, apply the credited local pack under `.agent/skills/9arm-skills/` while preserving the normal specialist output contract:

| Situation | Apply |
| :--- | :--- |
| `code-reviewer`, PR review, plan critique, or change risk review | `9arm-skills/scrutinize` |
| debug or RCA specialist work | `9arm-skills/debug-mantra` |
| completed bug or regression lesson extraction | `9arm-skills/post-mortem` |
| stakeholder-readable summary, PR body, release note, standup, or status update | `9arm-skills/management-talk` |

Reports that use the pack should include a short `Source Discipline` note with credit to `thananon/9arm-skills`.

## Process

1. Load the persona from `../agents/{AGENT_NAME}.md`.
2. Read the target file, folder, stage directory, or recent changes.
3. Apply the persona's specialist logic.
4. If artifact changes are needed, prefer stage markdown updates first.
5. Record lightweight context usage in the report when the agent loads notable context.
6. Produce either a concise report or a focused set of changes.

## Output

If a report is substantial, save it to:

```text
.workspaces/reports/{date}-{agent-name}-{timestamp}.md
```

Before saving a substantial agent report, inspect `.agent/resources/schemas/agent_report.template.md` and use its required headings unless the target workflow provides a more specific template.

Before reporting completion, run:

Review `{report_path}` against `agent_report.template.md`, keep the required headings, and remove placeholder text before completion.

Replace any placeholder or template text with concrete files reviewed, findings, recommendations, and validation needs.

For substantial reports, add a short `Context Usage Notes` subsection under the context reviewed area with files or artifacts loaded, any known token counts, and one practical optimization note for future runs.

Short reports can be returned directly in chat.

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Specialist invocation command, not a numbered stage
- Typical entry points: any stage that needs focused specialist judgment
- Typical handoff targets: return to the owning workflow such as `/10-Define`, `/20-Spec`, `/30-Plan`, `/40-Implement`, `/50-Verify`, `/60-Report`, `/70-Release`

## Sources

- `AGENTS.md`
- `.agent/agents/README.md`
- `.agent/resources/schemas/agent_report.template.md`
- Related commands: `Research`, `PR-Review`, `Debug`, `Help`, all mainline stages

## Next Workflow Recommendation

- **Primary**: the workflow that owns the target's lifecycle, such as `/10-Define`, `/20-Spec`, `/30-Plan`, `/40-Implement`, `/50-Verify`, `/60-Report`, `/70-Release`, or `PR-Review`.
- **Why**: `Agent` supplies specialist judgment; the owning workflow should execute the next lifecycle step.
- **Alternatives**:
  - `Research` when the specialist work uncovered unresolved external uncertainty
  - `Wiki` when the specialist report contains reusable project knowledge
  - `Help {target}` when the correct next route is unclear

