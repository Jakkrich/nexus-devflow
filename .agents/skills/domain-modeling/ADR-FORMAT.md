# ADR Format

ADRs live in `docs/adr/` and use sequential numbering: `0001-slug.md`, `0002-slug.md`, and so on.

Create the `docs/adr/` directory lazily, only when the first ADR is needed.

## Template

```md
# {Short title of the decision}

{1-3 sentences: what is the context, what did we decide, and why.}
```

That is enough for many ADRs. The value is in recording that a decision was made and why, not in filling out sections.

## Optional Sections

Only include these when they add genuine value:

- Status frontmatter: `proposed`, `accepted`, `deprecated`, or `superseded by ADR-NNNN`
- Considered Options: only when the rejected alternatives are worth remembering
- Consequences: only when non-obvious downstream effects need to be called out

## Numbering

Scan `docs/adr/` for the highest existing number and increment by one.

## When To Offer An ADR

All three of these must be true:

1. Hard to reverse: the cost of changing your mind later is meaningful.
2. Surprising without context: a future reader will wonder why the decision was made.
3. Based on a real trade-off: there were genuine alternatives and one was chosen for specific reasons.

If a decision is easy to reverse, skip it. If it is not surprising, nobody will need the explanation. If there was no real alternative, there is nothing to record beyond doing the obvious thing.

## What Qualifies

- Architectural shape, such as monorepo structure or event-sourced write models.
- Integration patterns between contexts.
- Technology choices that carry lock-in, such as database, message bus, auth provider, or deployment target.
- Boundary and scope decisions.
- Deliberate deviations from the obvious path.
- Constraints not visible in the code.
- Rejected alternatives when the rejection is non-obvious.
