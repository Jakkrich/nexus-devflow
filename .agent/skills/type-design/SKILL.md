---
name: type-design
description: Analyzes type and interface design for encapsulation, invariant expression, usefulness, and enforcement. Use when introducing new types, reviewing PRs with type changes, or refactoring domain models.
---

# Type Design

Use this skill to evaluate whether types make invalid states hard or impossible to represent without over-engineering the codebase.

## Core Rule

Make illegal states unrepresentable when it prevents real bugs, but do not make simple things complex.

## When To Use

- New type, interface, schema, model, DTO, or value object is introduced.
- A PR changes type relationships, constructors, factories, or public API contracts.
- A refactor moves validation, mutation, or domain rules across module boundaries.
- A reviewer needs a pragmatic quality rating for type design.

## Analysis Scope

Review:

- Type/interface definitions.
- Constructors, factories, parsers, and validators.
- Setter methods and mutation points.
- Public API surface and exported types.
- Relationships between fields that must remain consistent.

## Evaluation Dimensions

| Dimension | Ask |
|---|---|
| Encapsulation | Can callers violate invariants from outside the type boundary? |
| Invariant Expression | Are the important constraints obvious from the type shape? |
| Invariant Usefulness | Do the constraints prevent real bugs or only add ceremony? |
| Invariant Enforcement | Are invalid instances impossible or at least rejected at boundaries? |

Rate each dimension from 1 to 10. Scores below 5 require concrete findings.

## Anti-Patterns

| Anti-pattern | Risk |
|---|---|
| Exposed mutable internals | Callers can break invariants after construction. |
| Doc-only invariants | The rule exists only in comments and is easy to bypass. |
| No constructor or parser validation | Invalid instances can enter the system. |
| Anemic domain model | Rules are scattered across callers. |
| God type | Too many responsibilities make the type hard to use correctly. |
| Over-modeled simple data | Complexity exceeds the bug-prevention value. |

## Output Format

```markdown
## Type Design Review: [Scope]

### Types Reviewed
| Type | File | Purpose |
|---|---|---|
| `TypeName` | `path/file.ts:10` | Represents ... |

### Ratings
| Type | Encapsulation | Expression | Usefulness | Enforcement | Overall |
|---|---:|---:|---:|---:|---:|
| `TypeName` | 8 | 7 | 8 | 6 | 7.25 |

### Findings
#### [Severity] [Title]
**Location**: `path/file.ts:23`
**Problem**: [What invariant can fail]
**Impact**: [Concrete bug or maintenance risk]
**Recommendation**: [Smallest useful improvement]

### Verdict
[Well-designed / Adequate / Needs improvement / Significant issues]
```

## Verification

- Findings cite concrete files and lines.
- Recommendations fit the project's existing type style.
- Suggestions include trade-offs when they add ceremony.
- No recommendation depends on speculative future requirements.
