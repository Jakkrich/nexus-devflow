---
name: to-prd
description: Synthesize existing conversation, discovery, and codebase context into a PRD draft behind the PRD companion command.
disable-model-invocation: true
---

# To PRD

Use this support skill behind `PRD` when enough context already exists and the task is synthesis, not fresh interviewing.

Do not create a new public command. `PRD` owns the user-facing surface.

## Process

1. Load existing context.
   - conversation summary
   - `00-discover.md` and `10-define.md` when present
   - relevant research notes
   - `CONTEXT.md` and ADRs when product language or decisions matter

2. Check product readiness.
   - If core user, problem, or desired outcome is missing, route back to `PRD` discovery.
   - If implementation details dominate, route to `/20-Spec`.

3. Sketch test seams at product level.
   - Prefer existing user-facing or caller-facing seams.
   - Use `codebase-design` only if a new seam is a real product constraint.

4. Write the PRD using `.agent/resources/schemas/prd.template.md`.
   - Save under `.workspaces/prds/`.
   - Keep product framing separate from implementation plan.

5. Route into DevFlow.
   - `/10-Define` when product framing still needs decisions.
   - `/20-Spec` when the delivery contract is ready.

## Output

Return:

- PRD path
- product thesis
- user stories or outcomes
- scope boundaries
- test seams or verification shape
- recommended next DevFlow command
