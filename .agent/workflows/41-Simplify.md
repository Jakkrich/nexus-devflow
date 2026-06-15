---
description: Simplify code for clarity and maintainability — reduce complexity without changing behavior
---

# /simplify - Code Simplification & Refactoring

Invoke the agent-skills:code-simplification skill.

Simplify recently changed code (or the specified scope) while preserving exact behavior:

1. Read CLAUDE.md and study project conventions.
2. Identify the target code — recent changes unless a broader scope is specified.
3. Understand the code's purpose, callers, edge cases, and test coverage before touching it.
4. Scan for simplification opportunities:
   - Deep nesting → guard clauses or extracted helpers
   - Long functions → split by responsibility
   - Nested ternaries → if/else or switch
   - Generic names → descriptive names
   - Duplicated logic → shared functions
   - Dead code → remove after confirming
5. **Template Verification**: **MANDATORY:** Before executing any changes, the agent MUST inspect the layout, required sections, and format defined in `.agent/resources/schemas/refactoring.template.md` to ensure a consistent output layout. Before reporting completion, run `npm run agent -- markdown:validate {report_path} refactoring.template.md` and replace any placeholder/template text with concrete before/after observations, risk, and validation.
6. Apply each simplification incrementally — run tests after each change.
7. **Save Refactoring Report**: Save the before/after code comparison and simplification breakdown report to `.workspaces/reports/{date}-refactoring-{slug}.md` (where `{date}` is today's date in `YYYY-MM-DD` format and `{slug}` is a URL-friendly name derived from the target file name or component).
8. Verify all tests pass, the build succeeds, and the diff is clean.

If tests fail after a simplification, revert that change and reconsider. Use `code-review-and-quality` to review the result.
