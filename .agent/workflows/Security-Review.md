---
description: High-severity security code review for folders, projects, files, or diffs with English Markdown output contract.
argument-hint: "[target folder, project path, file list, or git diff] [--lang=en]"
---

# Security Review

$ARGUMENTS

Perform a focused security-only review of a specified target (directory, project, list of files, or code diff) for **High Severity** and **Critical** security vulnerabilities.

This workflow is a companion command in DevFlow 2.0. It creates a standardized stage artifact contract inside the active workspace.

## Purpose

Use this workflow to check an entire folder, project, or changed files for major security risks. It ensures your codebase does not introduce high-severity flaws before advancing to verification or release.

## Behavior

When `Security-Review` is triggered:

1. **Resolve target and scope**:
   - Determine the target folder, project, list of files, or git diff from the arguments.
   - Scan all source files in the target directory recursively, or evaluate the specific list of files/diff.
2. **Anchor the run**:
   - Locate the active `running_id` from the workspace.
   - If no active running ID is found, prompt the user or create a temporary run workspace (e.g., `sec-global` under `.workspaces/specs/sec-global/`).
3. **Execute security-focused analysis**:
   - Trace trust boundaries and inputs across the target files.
   - Check only for **High Severity** and **Critical** security vulnerabilities (e.g., SQL/Command Injection, hardcoded secrets, authentication bypass, path traversal, RCE, data exposure).
   - Ignore theoretical, style, low-impact, or medium/low severity findings for status blocking, but report them under Suggestions if present.
4. **Load Template**:
   - Inspect `.agent/resources/schemas/security_review.template.md`.
   - Read the `artifact_language` configuration (default: `"en"`).
   - Generate the report in English.
5. **Write the Artifact**:
   - Write the finalized security report to `.workspaces/specs/{ID}-{slug}/security-review.md`.
   - Ensure the output strictly follows the template contract structure (Headings 1 to 11).

## Output Contract & Formats

The generated artifact must follow the English contract shape below.

### English Output Template

```markdown
---
id: "{running_id}-security-review"
title: "Security Review: {Work Title}"
doc_type: "companion"
stage: "security-review"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
status: "draft"
artifact_language: "en"
related_run: "{running_id}"
related_files: []
---

# Security Review: {Work Title}

## 1. Objective

- Perform a focused security review on the target directory, project, or files to detect High Severity and Critical security vulnerabilities.

## 2. Source Inputs

- Review Target: {Review Target}
- Files Evaluated: []

## 3. Project Context To Preserve

- Global security constraints and authorization invariants.
- Known exceptions or legacy patterns excluded from security flags.

## 4. Stage-Specific Content

### 🛡️ Security Review Result
- **Status:** [pass | fail]
- **Reason:** [Explain in detail with file and line references if fail, or "No high-severity or Critical security vulnerabilities found" if pass]

### 💡 Suggestions for Next Agent Action / Handoff
[Provide concrete instructions and guidance for the subsequent Agent. If pass, list any medium/low security findings or recommendations for human consideration, directing the next verification/release Agent accordingly. If fail, list step-by-step remediation tasks for the implementer Agent to execute.]

### 🔍 Detailed Scope Analysis
- **Secrets & Configuration:** [Pass | Fail]
- **Input Validation & Injection:** [Pass | Fail]
- **Access Control & Auth:** [Pass | Fail]
- **Data Protection & Cryptography:** [Pass | Fail]
- **File System & Shell Safety:** [Pass | Fail]

## 5. AI Actions Performed

- Analyzed target codebase and traced untrusted inputs to critical sinks.
- Scanned for hardcoded secrets, API keys, and environment leaks.

## 6. Human Review Required

- Verify findings and evaluate false positives if any.
- Review medium/low risk suggestions for optional implementation.

## 7. Approval Status

- Pending

## 8. Next Allowed Command

- `/40-Implement {running_id}` (if fail, for code remediation)
- `/50-Verify {running_id}` (if pass, to verify execution correctness)

## 9. Nexus Event

- `Debug` for deep-dive diagnostics or debugging.
- `grill-with-docs` to clarify security guidelines.

## 10. Change Log

- {Date}: Initial English security review report created.

## 11. Additional Notes

- [Add custom sub-headings below if needed]
```

## Pass Response Requirements

When no High Severity or Critical vulnerability is found, the sections under **Stage-Specific Content** must be formatted as:

```markdown
### 🛡️ Security Review Result
- **Status:** pass
- **Reason:** No high-severity or Critical security vulnerabilities found

### 💡 Suggestions for Next Agent Action / Handoff
[List any medium, low security findings or recommendations for human consideration, directing the next verification/release Agent accordingly]
```

## Fail Response Requirements

When a High Severity or Critical vulnerability is found:

- Use status `fail`.
- Explain why the issue is High/Critical Severity with file and line references.
- In **Suggestions for Next Agent Action / Handoff**, write a clear set of step-by-step remediation tasks for the Coder/Implementer Agent to resolve the vulnerability.

## Security Scope & Rules

Evaluate high-severity risks including:
- **Hardcoded secrets**: passwords, API keys, private keys, database strings.
- **Injections**: SQL, NoSQL, OS Command, Template, or Path traversal.
- **Unvalidated inputs**: dynamic evaluation (`eval`), shell execution, or raw unescaped HTML rendering.
- **Insecure configuration**: broken authorization, sensitive exposure in public endpoints/logs.

## Relationship To DevFlow 2.0

- **Classification**: Companion command
- **Mainline Status**: Not part of the linear Timeline. Can be run at any stage.
- **Typical Entry Points**: Any stage, especially before `/50-Verify` or `/70-Release` to verify security health.

## Sources

- `AGENTS.md`
- `.agent/resources/schemas/security_review.template.md`
- `docs/workspace-artifacts.md`
