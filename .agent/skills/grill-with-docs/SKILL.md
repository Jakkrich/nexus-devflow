---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design, while creating durable docs such as ADRs and glossary entries as decisions crystallize.
disable-model-invocation: true
---

# Grill With Docs

Run a grilling session using the `domain-modeling` skill.

Use this as a DevFlow support skill, not as a numbered mainline stage.

## Best DevFlow Placement

- `/10-Define`: strongest default fit. Use it when the problem, terms, boundaries, non-goals, or decision points are still fuzzy.
- `/20-Spec`: use it before finalizing requirements, acceptance criteria, constraints, and out-of-scope items.
- `/30-Plan`: use it only as a final stress test before implementation planning is locked, especially when the design has hard-to-reverse choices.

Avoid using this as the first tool in `/40-Implement` unless implementation reveals a domain contradiction that must be routed back to `/20-Spec` or `/30-Plan`.

## Session Contract

During the session:

- question vague or overloaded terms until they have canonical names
- test the design with concrete edge cases
- compare claims against existing code or stage artifacts when available
- update `CONTEXT.md` when glossary terms are resolved
- offer ADRs sparingly when a decision is hard to reverse, surprising without context, and based on a real trade-off

## DevFlow Output

Record outcomes in the owning stage artifact:

- `/10-Define`: assumptions, open questions, scope boundaries, and decisions
- `/20-Spec`: requirements, constraints, out-of-scope items, and acceptance criteria
- `/30-Plan`: risks, dependency order, verification notes, and handoff guidance

If durable domain language is created, update `CONTEXT.md`.
If an architectural decision deserves a record, create an ADR under `docs/adr/`.
