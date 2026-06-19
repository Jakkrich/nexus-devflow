---
description: Minimal context template for DevFlow 2.0 work.
---

# Minimal Context

Use this template when context must be reduced before handing work to an agent, skill, or workflow.

## Task

- **Objective**: {what needs to happen}
- **Current Stage**: {discover|define|spec|plan|implement|verify|release|report}
- **Running ID**: {id-or-none}

## Required Context

- {artifact or file 1}
- {artifact or file 2}
- {artifact or file 3}

## Important Constraints

- {constraint 1}
- {constraint 2}

## Patterns Or Examples

- {file or artifact} - {pattern to follow}

## Expected Output

- {what should be produced next}

## Token Discipline

- Read only the files needed for the next step.
- Prefer summaries over raw bulk context.
- Prefer exact references over full-file dumps.
