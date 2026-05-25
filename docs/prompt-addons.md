# Prompt Addons

This document maps external prompt families into Nexus-DevFlow.

These prompts are not copied verbatim. They are adapted into PRPs workflows, agents, and skills so the user keeps manual IDE control and JSON artifacts are still handled by scripts.

## Addon Families

| Prompt family | Source prompts | PRPs destination | Adaptation |
| :--- | :--- | :--- | :--- |
| Spec | `spec_gatherer`, `spec_quick`, `spec_writer`, `spec_critic`, `spec_researcher`, `spec_orchestrator_agentic` | `/12-PRD`, `/15-Spec-Research`, `/18-Spec-Orchestrate`, `/30-Task`, `/31-Plan`, `requirements-engineer`, `prp-core-prd-architect` | Gather requirements, research integrations, write specs, critique completeness, and convert agentic orchestration into user-approved phase steps. |
| Complexity | `complexity_assessor` | `/31-Plan`, `prp-core-planner` | Classify simple, standard, or complex work before planning. Use script commands for `complexity_assessment.json`. |
| Roadmap | `roadmap_discovery`, `roadmap_features` | `/17-Roadmap`, roadmap docs, roadmap validation flows | Improve project discovery, audience, gaps, phases, and feature prioritization. Keep output under `.workspaces/roadmap`. |
| Ideation | `ideation_code_improvements`, `ideation_code_quality`, `ideation_documentation`, `ideation_performance`, `ideation_security`, `ideation_ui_ux` | `/10-Brainstorm`, `/11-Research`, `/13-UI-UX`, `/33-Verify`, `/41-Simplify` | Produce option sets and improvement candidates. No automatic implementation; user chooses the next workflow. |
| Competitor | `competitor_analysis` | `/16-Competitor`, `/11-Research`, `/12-PRD`, `/17-Roadmap` | Research alternatives, user pain points, gaps, and differentiator opportunities. Requires source attribution when browsing. |
| Insight | `insight_extractor` | `/54-Insight`, `/33-Verify`, `/34-Human-Approve`, `/34-Human-Reject`, `/34-Human-Feedback`, `/53-Changelog`, lessons docs | Extract reusable file insights, patterns, gotchas, approach outcomes, and recommendations after completed work. |
| Coder | `coder`, `coder_recovery`, `validation_fixer` | `/32-Code`, `/20-Debug`, `/33-Verify`, `prp-core-coder`, `prp-core-debugger` | Work one subtask at a time, recover from failures, repair artifacts before regenerating. |
| QA | `qa_reviewer`, `qa_fixer`, `qa_orchestrator_agentic` | `/33-Verify`, `/39-QA-Orchestrate`, `/40-Test`, `code-reviewer`, `test-engineer` | Five-axis review, focused fix routing, and user-controlled QA orchestration. |
| Follow-up | `followup_planner` | `/35-Followup`, `/34-Human-Feedback`, `/31-Plan`, `/32-Code` | Extend existing plans without replacing completed subtasks. New phases/subtasks are appended with `plan:*` commands. |
| GitHub PR | `github/pr_*`, `github/QA_REVIEW_SYSTEM_PROMPT`, `github/spam_detector`, `github/duplicate_detector`, `github/issue_*` | `/51-PR`, `/55-PR-Review`, `/56-PR-Followup`, `/57-Issue-Triage`, `code-reviewer`, `security-auditor` | Review PRs, classify findings, validate comments, fill templates, triage issues, and resolve follow-up comments. |
| Validation Tools | `mcp_tools/api_validation`, `database_validation`, `electron_validation`, `puppeteer_browser` | `/33-Verify`, `/40-Test`, frontend/backend specialist agents | Convert tool-specific assumptions into available IDE/browser/API/database validation steps. |
| 9arm-skills | `debug-mantra`, `post-mortem`, `scrutinize`, `management-talk` from `thananon/9arm-skills` | `/20-Debug`, `/54-Insight`, `/55-PR-Review`, `/90-Agent`, `/51-PR`, `/53-Changelog`, `/99-Help` | Use as a credited engineering discipline layer adapted for Antigravity IDE. Keep Nexus report formats and artifact destinations unchanged. |

## Manual IDE Conversion Rules

Use these conversions whenever an external prompt assumes autonomous Claude behavior:

| External prompt behavior | PRPs behavior |
| :--- | :--- |
| Agentic orchestrator runs all phases | Present next workflow command and wait for user confirmation. |
| Write full JSON file | Use `npm run agent -- artifact:*` or `npm run agent -- plan:*`. |
| Spawn subagents automatically | Recommend `/90-Agent {agent} {target}`. |
| WebSearch without citation | Browse or research with source links and note limitations. |
| Output a JSON object only | Use script-first JSON commands, then validate. |
| Continue after QA/follow-up automatically | Route to `/32-Code`, `/31-Plan`, `/34-Human-Approve`, `/34-Human-Reject`, `/34-Human-Feedback`, or `/34-Human-ReCheck` based on user choice. |

## Borderline Commands

Some source prompts look like commands but should not become standalone DevFlow workflows yet. Use this rule:

- If it changes the user's lifecycle phase, route to the existing numbered workflow.
- If it is a method that can run inside several phases, keep it as a skill.
- If it is only a friendlier name for existing behavior, document it as a thin alias to the existing workflow plus skill.
- If it depends on unavailable Claude/MCP/runtime behavior, convert it into validation guidance for the current IDE tools.

| Borderline source | DevFlow location | Decision | Notes |
| :--- | :--- | :--- | :--- |
| `validation_fixer` | `/33-Verify` fail path, `/32-Code` retry when implementation must change | Thin skill alias | Use `json-artifact-handling` for PRP CLI repair and `lint-and-validate` for project checks. |
| `ideation_documentation` | `/10-Brainstorm`, `/11-Research`, `/54-Insight`, `/53-Changelog` | Skill-backed agent action | Use `documentation-and-adrs` and `documentation-maintainer`; no standalone docs-ideation workflow. |
| `ideation_performance` | `/33-Verify`, `/39-QA-Orchestrate`, `/41-Simplify` | Skill-backed review | Use `performance-optimization` and `performance-engineer`; require measurement before optimization. |
| `ideation_security` | `/33-Verify`, `/39-QA-Orchestrate`, `/20-Debug` for incidents | Skill-backed review | Use `security-and-hardening` and `security-auditor`; findings become review output or task input. |
| `mcp_tools/*` validation prompts | `/33-Verify`, `/40-Test` | Tool-specific skill guidance | Map to available browser/API/database validation tools; document limitations when a tool is unavailable. |
| Autonomous orchestration aliases | `/14-Orchestrate`, `/18-Spec-Orchestrate`, `/39-QA-Orchestrate`, `/90-Agent` | Thin alias only | Preserve user-controlled phase gates instead of auto-running subagents. |

## 9arm-Skills Adaptation Rules

`9arm-skills` is integrated as a credited discipline pack under `.agent/skills/9arm-skills/`.

- Keep the source credit: `9arm-skills`, `thananon/9arm-skills`, https://github.com/thananon/9arm-skills.
- Replace Claude Code-specific wording with Antigravity IDE / Nexus-DevFlow wording.
- Keep the existing Nexus workflow commands and output files.
- Add `Source Discipline` notes to substantial reports when a 9arm lens is applied.
- Do not let 9arm reports replace required Nexus templates such as RCA and PR review templates.

## Suggested Workflow Routing

| User intent | Start here | Optional specialist |
| :--- | :--- | :--- |
| Explore feature ideas | `/10-Brainstorm` | `/90-Agent prp-core-prd-architect` |
| Research integrations or external APIs | `/15-Spec-Research` | `/90-Agent web-researcher` |
| Analyze competitors | `/16-Competitor` | `/90-Agent prp-core-prd-architect` |
| Refresh roadmap | `/17-Roadmap` | `/90-Agent prp-core-planner` |
| Orchestrate broad spec work | `/18-Spec-Orchestrate` | `/90-Agent requirements-engineer` |
| Create product requirements | `/12-PRD` | `/90-Agent requirements-engineer` |
| Create executable task artifacts | `/30-Task` | `/90-Agent requirements-engineer` |
| Plan implementation | `/31-Plan` | `/90-Agent prp-core-planner` |
| Extend completed work | `/35-Followup` | `/90-Agent prp-core-planner` |
| Orchestrate complex QA | `/39-QA-Orchestrate` | `/90-Agent code-reviewer` |
| Extract lessons after completion | `/54-Insight` | `/90-Agent prp-core-codebase-assistant` |
| Create PR | `/51-PR` | `/90-Agent prp-core-git-pr-maker` |
| Review PR | `/55-PR-Review` | `/90-Agent code-reviewer` |
| Resolve PR comments | `/56-PR-Followup` | `/90-Agent code-reviewer` |
| Triage GitHub issue | `/57-Issue-Triage` | `/90-Agent prp-core-codebase-assistant` |
