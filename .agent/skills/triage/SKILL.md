---
name: triage
description: Support Issue-Triage by classifying incoming issues, verifying claims, and producing agent-ready briefs.
disable-model-invocation: true
---

# Triage

Use this support skill behind `Issue-Triage`.

It evaluates bug reports, feature requests, support requests, duplicates, spam, or external PRs before they enter the mainline DevFlow.

## Roles

Category:

- bug
- enhancement
- documentation
- support/question
- duplicate
- spam/noise

State:

- needs-triage
- needs-info
- ready-for-agent
- ready-for-human
- wontfix

## Process

1. Gather issue context.
   - title and body
   - comments and labels
   - reporter evidence
   - screenshots, logs, versions, reproduction steps
   - linked PRs or related issues

2. Explore relevant code and knowledge.
   - Search by domain concepts, not only issue wording.
   - Read `CONTEXT.md` and ADRs when present.
   - Check whether the request is already implemented or previously rejected.

3. Verify the claim when possible.
   - Bugs need a reproduction attempt or a clear reason why reproduction is blocked.
   - Feature requests need scope and product intent.
   - PRs need diff and claim review.

4. Decide the route.
   - `Debug` for confirmed bugs needing root cause work.
   - `PRD` for product-level feature shaping.
   - `/10-Define` for actionable work with scope decisions remaining.
   - `/20-Spec` for stable work ready for delivery contract.
   - `needs-info` when required evidence is missing.
   - `wontfix` when duplicate, already implemented, spam, or intentionally rejected.

5. Write the triage report with `.agent/resources/schemas/triage.template.md`.
   - Save under `.workspaces/issues/`.
   - Create issue tracker comments only when a tracker is configured or explicitly requested.

## Agent Brief

For `ready-for-agent`, include:

- problem statement
- expected behavior
- evidence and reproduction
- acceptance criteria
- constraints
- route into DevFlow

## Output

Return:

- classification
- state recommendation
- evidence confidence
- report path
- next DevFlow route
