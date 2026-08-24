# 🏛️ Architecture Decision Records (ADRs)

This directory stores durable Architecture Decision Records (ADRs) produced during `/grill`, `00-explore`, or high-stakes architectural design sessions.

---

## 📋 ADR Format & Standards

Each ADR is named `ADR-xxx-{slug}.md` (e.g. `ADR-001-database-schema-migration.md`) and follows this structure:

```markdown
# ADR-xxx: {Title}

- **Status**: Accepted | Proposed | Deprecated | Superseded by ADR-yyy
- **Date**: YYYY-MM-DD
- **Context**: Problem statement, background, and why this decision was needed.
- **Decision**: The selected architectural approach or invariant.
- **Alternatives Considered**:
  - *Option 1*: Pros / Cons
  - *Option 2*: Pros / Cons
- **Consequences**:
  - *Positive*: Benefits and capabilities unlocked
  - *Trade-offs / Risks*: Costs, complexity, or constraints
```
