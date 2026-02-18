# Create ISSUE Spec File

Create an ISSUE spec file (input for `generate-prp`) for any kind of work item (bug, feature, change, refactor, etc.). This process follows the standards defined in `PRPs-Framework/_notes/git-branch-naming-conventions.md`.

## Arguments: $ARGUMENTS

The arguments should describe the issue/feature at a high level:

- Optional explicit type keyword at the beginning: `BUG`, `FEAT`/`FEATURE`, `CHG`, `REFACTOR`, `DOCS`, `TEST`, `CHORE`, etc.
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

2. **Parse Arguments & Map to Git Convention**
   - Detect type and map to `PRPs-Framework/_notes/git-branch-naming-conventions.md`:
     - `BUG`, `BUG-` → `fix`
     - `FEAT`, `FEATURE`, `FEAT-` → `feat`
     - `CHG`, `CHANGE` → `feat` or `chore` (default to `feat` if adding, `chore` if maintenance)
     - `REFACTOR` → `refactor`
     - `DOCS` → `docs`
     - `TEST` → `test`
     - `CHORE` → `chore`
   - Extract an identifier (numeric or code-like) if present (e.g. `456`, `FEAT-123`, `AUTH-002`).
   - Extract a short title and generate a slug for the `alias`.

3. **Generate Proposed Branch Name**
   - Follow: `<type>/#<issueNumber>-<alias>`
   - Example: `fix/#456-password-reset-fix`

4. **Decide folder and filename (under `PRPs-Framework/issues/`)**
   - Build a folder name using the identifier (if any) and a slugified title:
     - Example: `456_login-fails/`
     - Example: `auth-002_improve-refresh/`
   - Build the spec file path: `PRPs-Framework/issues/{folder-name}/spec.md`.
   - Ensure the directory `PRPs-Framework/issues/{folder-name}/` exists (create if missing).

5. **Generate ISSUE Spec Template Content**
   - Fill the template, including the **Git Context** section.

```markdown
# {ISSUE_ID}: {TITLE}

## Type
{TYPE} (mapped from {INPUT_TYPE})

## Git Context
- **Proposed Branch**: {PROPOSED_BRANCH_NAME}
- **Commit Pattern**: {TYPE}: <summary>

## Context
- [Background, related systems, related PRPs]

## Problem / Goal
- [Description of the issue or goal]

## Details
- [Any relevant notes from users, stakeholders, or logs]

## Steps to Reproduce / High-level Requirements
- [Step or requirement 1]
- [Step or requirement 2]

## Impact / Priority
- Impact: [Low/Medium/High/Critical]
- Priority: [P1/P2/P3...]

## Related PRPs (if known)
- [PRPs-Framework/issues/REF_slug/prp.md]
```

6. **Write File**
   - If the target ISSUE spec file does not exist:
     - Create it with the generated template content filled with the parsed ID/title.
   - If it already exists:
     - Do not overwrite; instead, report that the ISSUE spec already exists and show its path.

## Output

- **New ISSUE spec directory** created under `PRPs-Framework/issues/{folder-name}/` with `spec.md` inside.
- The file contains a generic issue template with **Proposed Branch Name** for the user to confirm.
- Next step for the user/agent:
  - Fill in the `spec.md` details in the folder.
  - Then run `/02-Plan-Implementation PRPs-Framework/issues/{folder-name}/spec.md` to create the full PRP.

