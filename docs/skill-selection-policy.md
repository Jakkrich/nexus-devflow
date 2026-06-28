# Skill Selection Policy

Use this policy when deciding which support skill, companion command, or specialist agent should help a DevFlow stage.

The goal is predictable skill use. A skill should sharpen the active stage, not compete with the stage for ownership.

## Core Rules

1. Stage ownership wins.
   - Mainline stages own lifecycle state, artifacts, and next-step guidance.
   - Skills may support a stage, but they must not move work forward or backward by themselves.

2. Prefer the thinnest public surface.
   - Use existing public companion commands before adding new commands.
   - Keep imported skills as support skills unless users need to call them directly and often.

3. Pick the most specific useful skill.
   - If two skills overlap, choose the one with the narrowest fit for the current uncertainty.
   - Do not stack broad skills when one specific skill can resolve the question.

4. Limit active skill load.
   - Use one primary skill per pass.
   - Add at most two support skills when they have distinct jobs.
   - If more than three skills seem necessary, route through `intelligent-routing` or an orchestrator first.

5. Separate exploration from commitment.
   - Exploration skills produce options, evidence, questions, or prototypes.
   - Mainline stages turn stable results into stage artifacts.

6. Route contradictions back to the owning stage.
   - If implementation reveals a spec flaw, route back to `/20-Spec`.
   - If verification reveals a plan or implementation gap, route back to `/30-Plan` or `/40-Implement`.
   - Do not let a support skill silently rewrite stage intent.

## Selection Order

Apply these gates in order:

| Gate | Question | Route |
| :--- | :--- | :--- |
| 1 | Does this request advance lifecycle state? | Use the matching mainline stage. |
| 2 | Is this support work the user may call directly? | Use a public companion command. |
| 3 | Does the active stage need a reusable method? | Use a support skill. |
| 4 | Does the active stage need expert judgment? | Use a specialist agent. |
| 5 | Is routing still unclear? | Use `intelligent-routing` or `Help`. |

## Conflict Rules

| Conflict | Prefer | Reason |
| :--- | :--- | :--- |
| `Brainstorm` vs `grilling` | `Brainstorm` | Use when generating or comparing options. |
| `grilling` vs `grill-with-docs` | `grill-with-docs` | Use when a codebase or durable docs should shape the interview. |
| `grill-with-docs` vs `domain-modeling` | `grill-with-docs` first, `domain-modeling` only when terms or ADRs crystallize | The interview discovers decisions; domain modeling records durable language and decisions. |
| `PRD` vs `/20-Spec` | `PRD` for product framing, `/20-Spec` for delivery contract | PRD explains why and product shape; spec defines buildable acceptance targets. |
| `to-prd` vs `PRD` | `PRD` as the public surface | `to-prd` is an imported synthesis method behind the existing command. |
| `to-issues` vs `/30-Plan` | `/30-Plan` | Planning owns work breakdown; `to-issues` can package slices for an issue tracker. |
| `implement` vs `/40-Implement` | `/40-Implement` | The mainline stage owns implementation state and artifact updates. |
| `diagnosing-bugs` vs `Debug` | `Debug` as public surface, `diagnosing-bugs` as method | Debug owns the user-facing workflow. |
| `review` vs `/50-Verify` | `/50-Verify` | Verify owns validation evidence; review is one verification lane. |
| `handoff` vs `/70-Report` | `/70-Report` for final stage report, `handoff` for temporary context transfer | Report is durable lifecycle closure; handoff is operational continuity. |

## Stage Defaults

| Stage or companion | Default support skills | Escalate when |
| :--- | :--- | :--- |
| `Goal`, `Help` | `intelligent-routing`, optional `ask-matt` adaptation | The route is still ambiguous after one pass. |
| `/00-Discover` | `Brainstorm`, `grilling`, `prototype`, `decision-mapping` | Discovery needs runnable evidence or sequenced research. |
| `/10-Define` | `grill-with-docs`, `domain-modeling`, `to-prd` | Scope, language, or product intent remains unstable. |
| `/20-Spec` | `grill-with-docs`, `domain-modeling`, `codebase-design`, `spec-research` | Acceptance criteria, constraints, or integration facts are not testable. |
| `/30-Plan` | `planning-and-task-breakdown`, `codebase-design`, `tdd`, `to-issues` | Plan lacks file evidence, test decisions, or vertical slices. |
| `/40-Implement` | `incremental-implementation`, `tdd`, `diagnosing-bugs`, `codebase-design` | Implementation exposes a stage contradiction or missing tests. |
| `/50-Verify` | `test-execution-and-coverage`, `review`, `diagnosing-bugs`, `silent-failure-audit` | Validation lacks evidence or a failure cannot be localized. |
| `/60-Release` | `release-git-operations`, `resolving-merge-conflicts`, `setup-pre-commit` | Packaging, conflicts, or release gates block handoff. |
| `/70-Report` | `handoff`, `insight-capture`, writing skills | Lessons should become durable project knowledge. |
| `Issue-Triage` | `triage`, `domain-modeling` | Incoming reports need stable language or agent-ready issue briefs. |
| `Wiki` | `domain-modeling`, `handoff`, writing skills | Stage learning should become reusable knowledge. |

## Invocation Pattern

When selecting skills, record a short routing line:

```text
Applying DevFlow skill policy: <stage or command> owns this work; using <primary skill> because <reason>.
```

If a second support skill is needed:

```text
Also loading <support skill> only for <bounded purpose>.
```

## Anti-Patterns

- Loading every plausible skill at once.
- Letting an imported skill create a new lifecycle path.
- Promoting a support skill to public companion command before repeated use proves it.
- Using a general interview skill when a specific stage artifact is already ready to write.
- Writing durable docs from unresolved conversation instead of confirmed decisions.
