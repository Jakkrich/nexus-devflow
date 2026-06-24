---
title: Workflow Surface Map
version: 2.0
status: active
updated: 2026-06-18
---

# Workflow Surface Map

This document decides which workflow surfaces should remain public commands, which should stay internal companions, and which behaviors should live primarily in skills or agents in DevFlow 2.0.

## Decision Rule

- If users should call the surface directly and it has a clear input, output, or handoff contract, keep it as a `public command`.
- If the behavior is mainly a reusable method that should be invoked from a workflow or agent, route it to a `skill target`.
- If the behavior is mainly specialist ownership with accountable judgment, route it to an `agent target`.
- If the content is still useful but should not be a first-choice public entry point, keep it as an `internal companion`.
- If the surface remains only for history or backward reference, treat it as `archive`.

## Public Commands

| File | Decision | Why |
| :--- | :--- | :--- |
| `Goal.md` | `public command` | It routes broad goals before the work enters the mainline. |
| `Brainstorm.md` | `public command` | It is a common user-facing ideation surface before direction is locked. |
| `Research.md` | `public command` | It is a clear command that users can invoke directly for evidence gathering. |
| `Debug.md` | `public command` | Root-cause analysis is a distinct public need. |
| `PRD.md` | `public command` | Product framing still matters before a stable spec exists. |
| `Issue-Triage.md` | `public command` | Issue-driven intake is a clear standalone use case. |
| `Wiki.md` | `public command` | It supports direct knowledge query and capture. |
| `Check-For-Updates.md` | `public command` | Install and upgrade verification is a distinct maintainer and onboarding need. |
| `Help.md` | `public command` | It remains the primary routing and onboarding command. |

## Keep Internal For Now

| File | Decision | Future direction |
| :--- | :--- | :--- |
| `Preview.md` | `internal companion` | Core behavior now lives in `preview-local-check`; keep this as a wrapper for now. |
| `Simplify.md` | `internal companion` | `code-simplification` is now the primary behavior surface. |
| `Spec-Research.md` | `internal companion` | Core behavior now lives in `spec-research`; keep this as a wrapper for now. |
| `Competitor.md` | `internal companion` | Core behavior now lives in `competitor-analysis`; keep this as a wrapper for now. |
| `Roadmap.md` | `internal companion` | Core behavior now lives in `roadmap-strategy`; keep this as a strategy wrapper for now. |
| `Spec-Orchestrate.md` | `internal companion` | Core behavior now lives in `spec-orchestration`; keep this as a wrapper for now. |
| `Test.md` | `internal companion` | Core behavior now lives in `test-execution-and-coverage`; keep this as a wrapper for now. |
| `QA-Orchestrate.md` | `internal companion` | Core behavior now lives in `verification-orchestration`; keep this as a wrapper for now. |
| `Followup.md` | `internal companion` | Core behavior now lives in `review-followup-routing` with `task-followup` behavior. |
| `Human-Approve.md` | `internal companion` | Core behavior now lives in `human-review-decisions`; keep this as a wrapper for now. |
| `Human-Feedback.md` | `internal companion` | Core behavior now lives in `human-review-decisions`; keep this as a wrapper for now. |
| `Human-ReCheck.md` | `internal companion` | Core behavior now lives in `human-review-decisions`; keep this as a wrapper for now. |
| `Human-Reject.md` | `internal companion` | Core behavior now lives in `human-review-decisions`; keep this as a wrapper for now. |
| `Commit.md` | `internal companion` | Core behavior now lives in `release-git-operations`; keep this as a wrapper for now. |
| `PR.md` | `internal companion` | Core behavior now lives in `release-git-operations`; keep this as a wrapper for now. |
| `PR-Review.md` | `internal companion` | Core behavior now lives in `pr-review-analysis`; keep this as a wrapper for now. |
| `PR-Followup.md` | `internal companion` | Core behavior now lives in `review-followup-routing` with `pr-followup` behavior. |
| `Merge.md` | `internal companion` | Core behavior now lives in `release-git-operations`; keep this as a wrapper for now. |
| `Deploy.md` | `internal companion` | Core behavior now lives in `release-git-operations`; keep this as a wrapper for now. |
| `Changelog.md` | `internal companion` | Core behavior now lives in `release-git-operations`; keep this as a wrapper for now. |
| `Insight.md` | `internal companion` | Core behavior now lives in `insight-capture`; keep this as a wrapper for now. |
| `Agent.md` | `internal companion` | Core behavior now lives in `specialist-agent-routing`; keep this as an advanced wrapper for now. |

## Agent Targets

| Current file | Preferred target |
| :--- | :--- |
| `Spec-Orchestrate.md` | `spec-orchestration` or `orchestrator` |
| `Roadmap.md` | `roadmap-strategy` or a strategy-oriented planner mode |
| `Agent.md` | `specialist-agent-routing` or direct agent invocation guidance through `Help` |

## Skill Targets

| Current file | Preferred target |
| :--- | :--- |
| `Preview.md` | `preview-local-check` |
| `Simplify.md` | `code-simplification` |
| `Spec-Research.md` | `spec-research` |
| `Spec-Orchestrate.md` | `spec-orchestration` |
| `Competitor.md` | `competitor-analysis` |
| `Roadmap.md` | `roadmap-strategy` |
| `Test.md` | `test-execution-and-coverage` |
| `QA-Orchestrate.md` | `verification-orchestration` |
| `Followup.md` | `review-followup-routing` |
| `Human-*` | `human-review-decisions` |
| `Commit.md` | `release-git-operations` |
| `PR.md` | `release-git-operations` |
| `PR-Review.md` | `pr-review-analysis` |
| `PR-Followup.md` | `review-followup-routing` |
| `Merge.md` | `release-git-operations` |
| `Deploy.md` | `release-git-operations` |
| `Changelog.md` | `release-git-operations` |
| `Insight.md` | `insight-capture` |
| `Agent.md` | `specialist-agent-routing` |

## Current Policy

- Do not delete files just because they still contain useful prompt bodies.
- Reduce public exposure first, then move the primary behavior into a skill or agent.
- When a companion workflow has already offloaded its main behavior, keep it as a wrapper to preserve UX and continuity.
- Keep the numbered mainline as the only canonical stage path: `00-Discover -> 10-Define -> 20-Spec -> 30-Plan -> 40-Implement -> 50-Verify -> 60-Release -> 70-Report`.
- The main companion group in this phase has already moved its primary behavior into the skill layer as intended.
