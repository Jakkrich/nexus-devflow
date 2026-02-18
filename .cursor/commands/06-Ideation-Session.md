# Ideation Session

Run an ideation session to brainstorm improvements.

## Usage

```
/ideation-session [type] [context]
```

## Arguments

- **type**: The type of ideation.
  - `quality`: Code Quality (`ideation_code_quality.md`)
  - `security`: Security Audit (`ideation_security.md`)
  - `ui`: UI/UX (`ideation_ui_ux.md`)
  - `perf`: Performance (`ideation_performance.md`)
  - `docs`: Documentation (`ideation_documentation.md`)
  - `improvements`: General Code Improvements (`ideation_code_improvements.md`)
- **context** (optional): Specific file or folder.

## Process

1. **Load Prompt**: Load the corresponding `ideation_*.md` prompt.
2. **Brainstorm**: Generate actionable ideas.
