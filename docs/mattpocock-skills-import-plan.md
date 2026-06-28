# Matt Pocock Skills Import Plan

This plan develops the import recommendation in `docs/mattpocock-skills-devflow-mapping.md` into a controlled DevFlow integration.

## Objective

Adapt selected skills from <https://github.com/mattpocock/skills/tree/main/skills> into Nexus-DevFlow without expanding the public workflow surface or weakening stage ownership.

## Principles

- Keep `/00-Discover` through `/70-Report` as the only numbered mainline.
- Use imported skills as support skills unless a public companion command is clearly earned.
- Prefer DevFlow names for public surfaces.
- Convert upstream wording to DevFlow artifact paths, stage contracts, and validation expectations.
- Validate after each import phase.

## Phase 0: Policy And Routing Foundation

Status: ready to start.

Tasks:

- Add `docs/skill-selection-policy.md`.
- Link the policy from the skill mapping doc.
- Update `intelligent-routing` so support skill selection follows the policy.
- Add a short skill-load rule to `AGENTS.md` without listing every imported skill.

Validation:

- `npm run validate`
- Manual review that no new public command or numbered workflow was introduced.

Exit criteria:

- Maintainers have one policy for resolving skill overlap.
- Stage ownership rules are explicit.

## Phase 1: Low-Risk Support Skill Imports

Status: in progress. `grill-with-docs` and `domain-modeling` are imported. `codebase-design`, `diagnosing-bugs`, `tdd`, `review`, `handoff`, and `writing-great-skills` are imported as support skills.

Import:

- `grill-with-docs`
- `domain-modeling`
- `codebase-design`
- `diagnosing-bugs`
- `tdd`
- `review`
- `handoff`
- `writing-great-skills`

Adaptation rules:

- Keep imported skills under `.agent/skills/{skill-name}/`.
- Replace upstream command names with DevFlow stage or companion names.
- Remove assumptions about external issue trackers unless the active stage needs them.
- Keep file-writing behavior aligned with DevFlow markdown-first artifacts.

Validation:

- `npm run validate`
- Read each imported `SKILL.md` for stale upstream command references.
- Confirm each skill has clear "When to use" and "When not to use" sections.

Exit criteria:

- Support skills can be invoked by stage workflows without changing public lifecycle.

## Phase 2: Stage Workflow Hints

Status: in progress. `triage`, `to-prd`, `to-issues`, and `prototype` are imported as support skills behind existing DevFlow surfaces.

Tasks:

- Add compact support skill hints to:
  - `/00-Discover`
  - `/10-Define`
  - `/20-Spec`
  - `/30-Plan`
  - `/40-Implement`
  - `/50-Verify`
  - `/60-Release`
  - `/70-Report`
- Keep hints short: one line per stage, not a full skill manual.
- Route skill conflicts to `docs/skill-selection-policy.md`.

Validation:

- `npm run validate`
- Review workflow files for public surface drift.

Exit criteria:

- Each stage can suggest the right support skill without overloading context.

## Phase 3: Companion Surface Adaptation

Status: in progress. `validate-framework.mjs` now checks policy docs, imported support skill presence, upstream slash-command drift, unsupported numbered workflow routes, and overloaded workflow support-skill hints.

Adapt behind existing public companion commands:

- `triage` behind `Issue-Triage`
- `to-prd` behind `PRD`
- `prototype` behind `Research` or `Brainstorm`
- `to-issues` behind `/30-Plan` or `Issue-Triage`
- `ask-matt` behind `Help` or `intelligent-routing`

Do not add new public commands unless repeated use shows a real gap.

Validation:

- `npm run validate`
- Compare `AGENTS.md` public companion list before and after. It should remain stable unless deliberately changed.

Exit criteria:

- Imported companion-like behavior strengthens existing commands instead of competing with them.

## Phase 4: Validation And Drift Checks

Status: ready for pilot execution. See `docs/mattpocock-skills-pilot-runs.md`.

Add validation only after the policy stabilizes.

Candidate checks:

- Imported skills must not introduce new numbered workflow names.
- Imported skills must not recommend deprecated upstream commands as public routes.
- Workflow files should not list more than a small bounded number of support skills per stage.
- Deprecated upstream skills should remain unimported unless explicitly marked as reference.

Validation:

- `npm run validate`
- Add focused tests under `scripts/` only when the rule is stable enough to fail builds.

Exit criteria:

- Routing drift is caught automatically for important rules.

## Phase 5: Pilot Runs

Status: initial decisions documented. See `docs/mattpocock-skills-promotion-decisions.md`.

Run controlled examples:

| Scenario | Expected route | Skills |
| :--- | :--- | :--- |
| Fuzzy feature idea with codebase impact | `/00-Discover` -> `/10-Define` | `Brainstorm`, then `grill-with-docs` |
| Stable feature requiring module design | `/20-Spec` -> `/30-Plan` | `codebase-design`, optional `domain-modeling` |
| Bug report with unknown root cause | `Debug` -> `/40-Implement` -> `/50-Verify` | `diagnosing-bugs`, `tdd` |
| Existing work needs review | `/50-Verify` | `review`, `pr-review-analysis` |
| Release blocked by conflicts | `/60-Release` | `resolving-merge-conflicts` |

Validation:

- Stage artifacts remain the source of truth.
- Support skill output is captured in the owning stage artifact or durable docs.

Exit criteria:

- The policy works in real DevFlow runs without skill confusion.

## Phase 6: Promotion Decisions

Status: pending.

Promote only after pilot evidence.

Possible promotions:

- `prototype` may become a public companion command if users repeatedly request runnable exploration directly.
- `ask-matt` should probably remain behind `Help`.
- `to-issues` should remain behind `/30-Plan` unless issue tracker packaging becomes a frequent standalone workflow.

Do not promote:

- deprecated upstream skills
- personal skills
- stack-specific migration skills
- skills that duplicate existing public companion names

Validation:

- Update `AGENTS.md` only for deliberate public surface changes.
- Update `docs/workflow-surface-map.md` if a companion surface changes.
- Run `npm run validate`.

Exit criteria:

- DevFlow stays small on the outside and more capable on the inside.

## Immediate Next Changes

Recommended next implementation batch:

1. Link `docs/skill-selection-policy.md` from `docs/mattpocock-skills-devflow-mapping.md`.
2. Update `.agent/skills/intelligent-routing/SKILL.md` with support skill selection rules.
3. Add a concise skill-load policy note to `AGENTS.md`.
4. Import `codebase-design`, `diagnosing-bugs`, `tdd`, `review`, `handoff`, and `writing-great-skills`.
5. Run `npm run validate`.
