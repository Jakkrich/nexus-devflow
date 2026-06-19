---
description: Simplify code for clarity and maintainability while preserving behavior.
---

# Simplify - Code Simplification And Refactoring

Invoke the `code-simplification` skill.

Primary behavior already lives in:

```text
.agent/skills/code-simplification/SKILL.md
```

Treat this workflow file as a wrapper around that skill.

Use this workflow when the code works but has grown harder to read, harder to change, or more general than necessary.

In DevFlow 2.0, `Simplify` is a supporting implementation workflow. It usually pairs with `/40-Implement` and should end in `/50-Verify`.

## Process

1. Read project instructions and study local conventions.
2. Identify the target code: recent changes unless a broader scope is specified.
3. Understand purpose, callers, edge cases, and test coverage before touching it.
4. Scan for simplification opportunities:
   - deep nesting to guard clauses or extracted helpers
   - long functions to responsibility-based splits
   - nested ternaries to clearer control flow
   - vague names to descriptive names
   - duplicated logic to shared helpers
   - dead code to removal after confirmation
   - speculative abstraction to simpler concrete flow
5. Inspect `.agent/resources/schemas/refactoring.template.md` before generating a report.
6. Apply each simplification incrementally and run verification after each meaningful change.
7. Save the refactoring report to:

```text
.workspaces/reports/{date}-refactoring-{slug}.md
```

8. Verify tests pass, the build succeeds, and the diff stays behavior-preserving.

If tests fail after a simplification, revert that specific change and reconsider.

## Output

Return:

- what was simplified
- what was intentionally left alone
- validation evidence
- remaining risks or debt

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: `/40-Implement`, `/50-Verify`, `PR-Review`, `Agent`
- Typical handoff targets: `/40-Implement`, `/50-Verify`, `PR-Review`

## Sources

- `AGENTS.md`
- `.agent/skills/code-simplification/SKILL.md`
- `.agent/resources/schemas/refactoring.template.md`
- Related commands: `/40-Implement`, `/50-Verify`, `PR-Review`, `Agent`

## Next Workflow Recommendation

- **Primary**: `/50-Verify`
- **Why**: simplification should finish with explicit proof that behavior did not regress
- **Alternative**: `/40-Implement` when simplification exposed a deeper implementation change rather than a pure refactor

