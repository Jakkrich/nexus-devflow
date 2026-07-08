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
- **Status:** Pending
- **Reason:** [Explain in detail with file and line references if fail, or "No high-severity or critical security vulnerabilities found" if pass]

### 💡 Suggestions for Next Agent Action / Handoff
- [Specify concrete instructions for the next Agent. If pass, list any medium/low security findings or improvement areas for human consideration. If fail, list step-by-step remediation tasks for the implementer Agent to resolve the vulnerability.]

### 🔍 Detailed Scope Analysis
- **Secrets & Configuration:** [Pending | Pass | Fail]
- **Input Validation & Injection:** [Pending | Pass | Fail]
- **Access Control & Auth:** [Pending | Pass | Fail]
- **Data Protection & Cryptography:** [Pending | Pass | Fail]
- **File System & Shell Safety:** [Pending | Pass | Fail]

## 5. AI Actions Performed

- Analyzed target codebase and traced untrusted inputs to critical sinks.
- Scanned for hardcoded secrets, API keys, and environment leaks.

## 6. Human Review Required

- Verify findings and evaluate false positives if any.
- Review medium/low risk suggestions for optional implementation.

## 7. Approval Status

- Pending

## 8. Next Allowed Command

- /40-Implement {running_id} (if fail, for code remediation)
- /50-Verify {running_id} (if pass, to verify execution correctness)

## 9. Nexus Event

- `Debug` for deep-dive diagnostics or debugging.
- `grill-with-docs` to clarify security guidelines.

## 10. Change Log

- {Date}: Initial security review report created.

## 11. Additional Notes

- [Add custom sub-headings below if needed]
