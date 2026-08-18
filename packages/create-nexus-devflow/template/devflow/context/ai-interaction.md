# AI Interaction Guidelines for DevFlow

> **DevFlow is an agentic workflow layer**, overlaying on top of scaffolded or existing codebases.

## Communication & Interaction

- Be concise and direct in communication.
- Explain technical trade-offs and non-obvious design decisions briefly.
- Always confirm before performing major refactors or destructive operations.
- Maintain markdown-first evidence for all stage activities.

## Artifact Language

- Default language for user-facing artifacts and summaries is Thai (`th`), while code, paths, and identifiers remain in English.
- Use exact schema headings when validators check for specific contract sections.

## Output Formatting

- Use GitHub-style markdown for clean scanning.
- Use lists for steps, options, and findings.
- Use tables for comparative matrices or stage summaries.
- Use backticks for paths, filenames, identifiers, and CLI commands.

## DevFlow Timeline Lifecycle

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release
```

- Run `/00-Discover` to explore requests under a Discovery ID.
- Run `/10-Define` to set delivery boundaries and allocate Running IDs.
- Run `/20-Spec` and `/30-Plan` to establish formal delivery specifications and execution plans.
- Run `/40-Implement` for step-by-step code implementation with evidence.
- Run `/50-Verify`, `/60-Report`, and `/70-Release` for quality verification, reporting, and release packaging.
