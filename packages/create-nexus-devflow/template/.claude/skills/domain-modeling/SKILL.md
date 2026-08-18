---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when the user wants to pin down domain terminology or a ubiquitous language, record an architectural decision, or when another skill needs to maintain the domain model.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the active discipline: challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down when they crystallize.

## File Structure

Most repos have a single context:

```text
/
|-- CONTEXT.md
|-- docs/
|   `-- adr/
|       |-- 0001-event-sourced-orders.md
|       `-- 0002-postgres-for-write-model.md
`-- src/
```

If a `CONTEXT-MAP.md` exists at the root, the repo has multiple contexts. The map points to where each one lives:

```text
/
|-- CONTEXT-MAP.md
|-- docs/
|   `-- adr/                         system-wide decisions
`-- src/
    |-- ordering/
    |   |-- CONTEXT.md
    |   `-- docs/adr/                context-specific decisions
    `-- billing/
        |-- CONTEXT.md
        `-- docs/adr/
```

Create files lazily. If no `CONTEXT.md` exists, create one when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

## During The Session

### Challenge Against The Glossary

When the user uses a term that conflicts with the existing language in `CONTEXT.md`, call it out immediately and ask which meaning should win.

### Sharpen Fuzzy Language

When the user uses vague or overloaded terms, propose a precise canonical term. For example, distinguish `Customer` from `User` when those concepts have different responsibilities.

### Discuss Concrete Scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force precision about the boundaries between concepts.

### Cross-Reference With Code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it and route the decision back to the active DevFlow stage.

### Update `CONTEXT.md` Inline

When a term is resolved, update `CONTEXT.md` as part of the session. Use the format in `CONTEXT-FORMAT.md`.

`CONTEXT.md` is a glossary only. It should not contain implementation details, specification text, scratch notes, or implementation decisions.

### Offer ADRs Sparingly

Only offer to create an ADR when all three are true:

1. Hard to reverse: the cost of changing your mind later is meaningful.
2. Surprising without context: a future reader will wonder why the decision was made.
3. Based on a real trade-off: there were genuine alternatives and one was chosen for specific reasons.

If any condition is missing, skip the ADR. Use the format in `ADR-FORMAT.md`.
