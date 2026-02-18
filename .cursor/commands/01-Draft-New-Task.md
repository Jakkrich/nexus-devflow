# Create ISSUE Spec File

Create an ISSUE spec file (input for `generate-prp`) for any kind of work item (bug, feature, change, refactor, etc.).

## Arguments: $ARGUMENTS

The arguments should describe the issue/feature at a high level:

- Optional explicit type keyword at the beginning: `BUG`, `FEAT`/`FEATURE`, `CHANGE`/`CHG`, `REFACTOR`, etc.
- An ID or short code if available: e.g. `123`, `AUTH-001`
- A short human-readable title

Examples:

- `BUG 456 Login fails after password reset`
- `FEAT 123 Add social login`
- `AUTH-002 Improve token refresh flow` (type inferred later)

## Process

1. **Analyze Request (Agentic Step)**
   - **System Prompt**: Use `PRPs-Framework/prompts/github/issue_analyzer.md` to analyze the arguments.
   - **Goal**: Understand if the user provided enough information.
     - If sufficient: Proceed to parsing and file creation.
     - If insufficient: Ask clarifying questions (Needs Clarification) or generate a "Stub" issue with what is known.

2. **Parse Arguments**
   - Try to detect an explicit type from the first token:
     - `BUG`, `BUG-` → bug
     - `FEAT`, `FEATURE`, `FEAT-` → feature
     - `CHANGE`, `CHG`, `REFactor` → change/refactor
   - Extract an identifier (numeric or code-like) if present (e.g. `456`, `FEAT-123`, `AUTH-002`).
   - Extract a short title from the remaining text.

2. **Decide folder and filename (under `PRPs-Framework/issues/`)**
   - Extract an identifier (numeric or code-like) if present (e.g. `456`, `FEAT-123`, `AUTH-002`).
   - Extract a short title from the remaining text.
   - Build a folder name using the identifier (if any) and a slugified title:
     - Example: `456_login-fails/`
     - Example: `auth-002_improve-refresh/`
   - Build the spec file path: `PRPs-Framework/issues/{folder-name}/spec.md`.
   - Ensure the directory `PRPs-Framework/issues/{folder-name}/` exists (create if missing).

3. **Generate ISSUE Spec Template Content**
   - Use a generic issue template (not tied to BUG/FEAT yet), for example:

```markdown
# {ISSUE_ID}: {TITLE}

## Type (optional)
BUG | FEATURE | CHANGE | REFACTOR | OTHER

## Context
- [Background, related systems, related PRPs]

## Problem / Goal
- [For BUG: describe the problem]
- [For FEATURE: describe the goal]

## Details
- [Any relevant notes from users, stakeholders, or logs]

## Steps to Reproduce (for BUG) / High-level Requirements (for FEATURE)
- [Step or requirement 1]
- [Step or requirement 2]

## Impact / Priority
- Impact: [Low/Medium/High/Critical]
- Priority: [P1/P2/P3...]

## Related PRPs (if known)
- [PRPs-Framework/issues/REF_slug/prp.md]
```

4. **Write File**
   - If the target ISSUE spec file does not exist:
     - Create it with the generated template content filled with the parsed ID/title.
   - If it already exists:
     - Do not overwrite; instead, report that the ISSUE spec already exists and show its path.

## Output

- **New ISSUE spec directory** created under `PRPs-Framework/issues/{folder-name}/` with `spec.md` inside.
- The file contains a generic issue template for the user to complete.
- Next step for the user/agent:
  - Fill in the `spec.md` details in the folder.
  - Then run `/02-Plan-Implementation PRPs-Framework/issues/{folder-name}/spec.md` to create the full PRP.

