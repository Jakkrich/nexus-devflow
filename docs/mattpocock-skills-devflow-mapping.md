# Matt Pocock Skills To DevFlow Mapping

Source: <https://github.com/mattpocock/skills/tree/main/skills>

This mapping treats Nexus-DevFlow mainline stages as lifecycle states. Imported skills should not create new numbered workflow stages unless they change the lifecycle itself. Most skills are support skills invoked by a stage, an agent, or a companion command.

Selection policy: `docs/skill-selection-policy.md`

Import plan: `docs/mattpocock-skills-import-plan.md`

## Classification Rules

| Classification | Meaning | DevFlow rule |
| :--- | :--- | :--- |
| Mainline stage | A required lifecycle state | Do not add these from the external skill set; DevFlow already owns `/00` through `/70`. |
| Public companion command candidate | A user-facing command outside the numbered mainline | Use only when users should call it directly and often. |
| Internal companion surface | A retained prompt/workflow wrapper | Use when the behavior is useful but should not expand the public command list yet. |
| Support skill | Reusable method loaded inside a stage, agent, or companion command | Default classification for most imported skills. |
| Do not import | Deprecated, personal, too repo-specific, or superseded | Keep as reference only. |

## Recommended Mapping

| Upstream skill | Upstream group | Recommended DevFlow placement | Classification | Closest existing DevFlow surface | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ask-matt` | engineering | Before `/00-Discover`, any stage when routing is unclear | Public companion command candidate | `Help`, `Goal`, `intelligent-routing` | Best adapted as a router, not as another mainline state. |
| `setup-matt-pocock-skills` | engineering | Before using imported skills | Internal companion surface | `Check-For-Updates` | Useful as setup guidance, but repo-specific pieces should be translated to DevFlow conventions. |
| `grill-with-docs` | engineering | `/10-Define`, `/20-Spec`, optional `/30-Plan` | Support skill | `Brainstorm`, `PRD`, `domain-modeling` | Already installed locally. Best for sharpening scope, domain language, decisions, and acceptance targets. |
| `domain-modeling` | engineering | `/10-Define`, `/20-Spec`, `/30-Plan`, `Wiki` | Support skill | `type-design`, `Wiki` | Already installed locally. Captures `CONTEXT.md` glossary and ADRs when decisions crystallize. |
| `codebase-design` | engineering | `/20-Spec`, `/30-Plan`, `/40-Implement`, `/50-Verify` | Support skill | `architecture`, `type-design`, `code-simplification` | Use for module boundaries, interface shape, testability, and agent-friendly codebase structure. |
| `diagnosing-bugs` | engineering | `/40-Implement`, `/50-Verify` | Support skill or `Debug` enhancer | `Debug`, `prp-core-debugger` | Fits the existing Debug companion rather than a new public command. |
| `tdd` | engineering | `/30-Plan`, `/40-Implement`, `/50-Verify` | Support skill | `test-driven-development`, `test-execution-and-coverage` | Use when behavior changes require test-first implementation or red/green evidence. |
| `implement` | engineering | `/40-Implement` | Support skill | `/40-Implement`, `prp-core-coder` | Do not create another Implement command; fold useful process into the existing stage. |
| `prototype` | engineering | `/00-Discover`, `/10-Define`, `/20-Spec`, sometimes `/30-Plan` | Public companion command candidate or internal companion | `Research`, `Brainstorm`, `Preview` | Good when uncertainty needs runnable evidence before spec or plan. |
| `to-prd` | engineering | `/10-Define`, `/20-Spec` | Support skill | `PRD` | Maps cleanly to the existing PRD companion. |
| `to-issues` | engineering | `/30-Plan`, `/60-Release` when issue packaging is needed | Internal companion surface | `Issue-Triage`, `release-git-operations` | Useful for splitting PRD/spec into vertical slices; keep as support unless issue generation becomes a common public workflow. |
| `triage` | engineering | Before `/10-Define`, `Debug`, `/50-Verify` | Public companion command candidate | `Issue-Triage` | Existing `Issue-Triage` is the right public name. Use this as implementation guidance. |
| `improve-codebase-architecture` | engineering | `Research`, `/30-Plan`, `/50-Verify`, `Wiki`, roadmap work | Internal companion surface | `Roadmap`, `code-reviewer`, `architecture` | Good for periodic codebase health scans; not feature mainline work by itself. |
| `resolving-merge-conflicts` | engineering | `/60-Release` | Support skill | `Merge`, `release-git-operations` | Use during release packaging when merge/rebase conflicts block delivery. |
| `decision-mapping` | in-progress | `/00-Discover`, `/10-Define`, `/30-Plan` | Support skill | `Brainstorm`, `planning-and-task-breakdown` | Good for turning fuzzy unknowns into sequenced investigation tickets. Keep experimental. |
| `loop-me` | in-progress | `/00-Discover`, `/10-Define`, `/20-Spec` | Do not import directly | `grill-with-docs`, `Brainstorm` | Workspace-specific variant of grilling; superseded by `grill-with-docs` in DevFlow. |
| `review` | in-progress | `/50-Verify`, `/60-Release` | Support skill | `PR-Review`, `pr-review-analysis`, `code-reviewer` | Useful review mode: compare changes against standards and originating spec/issue. |
| `writing-fragments` | in-progress | `Wiki`, `/70-Report`, docs/content work | Support skill | `documentation-maintainer`, `insight-capture` | Useful only for writing-heavy tasks. Not core engineering flow. |
| `writing-beats` | in-progress | `Wiki`, `/70-Report`, docs/content work | Support skill | `documentation-maintainer`, `report` | Use to shape raw material into narrative beats for docs/reporting. |
| `writing-shape` | in-progress | `Wiki`, `/70-Report`, docs/content work | Support skill | `documentation-maintainer`, `report` | Use for article/report shaping, not implementation workflow. |
| `git-guardrails-claude-code` | misc | Before using DevFlow on a machine | Internal companion surface | `Check-For-Updates`, setup docs | Claude-specific; adapt principles, not raw hooks, unless the environment is Claude Code. |
| `setup-pre-commit` | misc | `/60-Release`, setup/check phase | Support skill | `release-git-operations`, `Check-For-Updates` | Useful when release readiness needs local quality gates. |
| `migrate-to-shoehorn` | misc | `/40-Implement`, `/50-Verify` | Support skill only when stack matches | `code-simplification`, `test-execution-and-coverage` | Very stack-specific. Do not expose publicly in DevFlow. |
| `scaffold-exercises` | misc | `/40-Implement`, docs/training projects | Support skill only when task matches | `app-builder`, `documentation-maintainer` | Not a general DevFlow lifecycle skill. |
| `edit-article` | personal | `Wiki`, `/70-Report`, documentation tasks | Do not import by default | `documentation-maintainer` | Personal writing workflow; use only as reference for docs editing. |
| `obsidian-vault` | personal | `Wiki` | Do not import by default | `devflow-wiki`, `obsidian-markdown` | Personal vault management. DevFlow already has Wiki surfaces. |
| `grill-me` | productivity | Before `/00-Discover`, `/00-Discover`, `/10-Define` | Support skill | `Brainstorm`, `grilling`, `grill-with-docs` | Use when no codebase/docs context exists. With a codebase, prefer `grill-with-docs`. |
| `grilling` | productivity | `/00-Discover`, `/10-Define`, `/20-Spec`, `/30-Plan` | Support skill | `Brainstorm`, `grill-with-docs` | Generic interview engine. `grill-with-docs` is the codebase-aware wrapper. |
| `handoff` | productivity | Any stage, especially before context switch or multi-agent handoff | Support skill or internal companion | `Followup`, `Agent`, report artifacts | DevFlow stage markdown already provides handoff; use this for temporary cross-session summaries. |
| `teach` | productivity | `Help`, `Wiki`, onboarding | Public companion command candidate only if training becomes a goal | `Help`, `documentation-maintainer` | Useful for learning workspaces, not core delivery. |
| `writing-great-skills` | productivity | When maintaining `.agent/skills` | Support skill | `skill-development`, `workflow-documentation-sync` | Good maintainer reference for writing predictable skills. |
| `design-an-interface` | deprecated | `/20-Spec`, `/30-Plan` | Do not import directly | `codebase-design` | Deprecated upstream; use `codebase-design` concepts instead. |
| `qa` | deprecated | `/50-Verify`, `Issue-Triage` | Do not import directly | `QA-Orchestrate`, `Issue-Triage` | Deprecated upstream; DevFlow already has better QA surfaces. |
| `request-refactor-plan` | deprecated | `/10-Define`, `/20-Spec`, `/30-Plan` | Do not import directly | `code-simplification`, `planning-and-task-breakdown` | Deprecated upstream; useful ideas can feed refactor planning. |
| `ubiquitous-language` | deprecated | `/10-Define`, `/20-Spec`, `Wiki` | Do not import directly | `domain-modeling` | Deprecated upstream; superseded by `domain-modeling` and DevFlow glossary/ADR conventions. |

## Stage View

| DevFlow stage or companion | Best upstream skills to adapt |
| :--- | :--- |
| Before DevFlow / setup | `ask-matt`, `setup-matt-pocock-skills`, `git-guardrails-claude-code`, `setup-pre-commit` |
| `Goal` / `Help` | `ask-matt`, `teach` |
| `/00-Discover` | `grill-me`, `grilling`, `prototype`, `decision-mapping` |
| `/10-Define` | `grill-with-docs`, `domain-modeling`, `to-prd`, `decision-mapping`, `codebase-design` |
| `/20-Spec` | `grill-with-docs`, `domain-modeling`, `codebase-design`, `to-prd`, `prototype`, `design-an-interface` as deprecated reference |
| `/30-Plan` | `codebase-design`, `tdd`, `to-issues`, `decision-mapping`, `request-refactor-plan` as deprecated reference |
| `/40-Implement` | `implement`, `tdd`, `diagnosing-bugs`, `codebase-design`, `migrate-to-shoehorn` when stack-specific |
| `/50-Verify` | `review`, `diagnosing-bugs`, `tdd`, `qa` as deprecated reference, `improve-codebase-architecture` |
| `/60-Release` | `resolving-merge-conflicts`, `setup-pre-commit`, `review`, `to-issues` when packaging follow-up work |
| `/70-Report` | `handoff`, `writing-fragments`, `writing-beats`, `writing-shape`, `edit-article` as reference |
| `Issue-Triage` | `triage`, `qa` as deprecated reference |
| `Debug` | `diagnosing-bugs`, `tdd` |
| `PRD` | `to-prd`, `grill-with-docs`, `domain-modeling` |
| `Wiki` | `domain-modeling`, `handoff`, `obsidian-vault` as personal reference, writing skills |
| `Check-For-Updates` | `setup-matt-pocock-skills`, `git-guardrails-claude-code`, `setup-pre-commit` |

## Import Recommendation

Import now:

- `grill-with-docs`
- `domain-modeling`
- `codebase-design`
- `diagnosing-bugs`
- `tdd`
- `review`
- `prototype`
- `triage`
- `to-prd`
- `to-issues`
- `handoff`
- `writing-great-skills`

Keep as reference or adapt later:

- `ask-matt`
- `setup-matt-pocock-skills`
- `implement`
- `improve-codebase-architecture`
- `resolving-merge-conflicts`
- `decision-mapping`
- `setup-pre-commit`
- `git-guardrails-claude-code`
- writing/article/personal skills

Do not import directly:

- all upstream `deprecated/*` skills
- personal skills unless the user explicitly wants personal knowledge management or article editing inside this framework
