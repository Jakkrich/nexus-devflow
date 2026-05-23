---
name: silent-failure-audit
description: Audits error handling, logging, fallbacks, and observability for silent failures. Use after adding catch blocks, fallback logic, retry handling, optional chaining, or user-facing failure paths.
---

# Silent Failure Audit

Use this skill to find errors that disappear, get logged without user impact, or fall back in ways that make failures hard to debug.

## Core Rule

Every important failure must be visible to the right audience: logged with context for maintainers, surfaced with actionable guidance for users, or intentionally propagated to a caller that can handle it.

## When To Use

- Code adds or changes try/catch, `.catch`, callbacks, result handling, or retry logic.
- A fallback, default value, mock, optional chaining, or null coalescing branch could hide a failure.
- A reviewer needs to assess whether error handling is observable and actionable.
- A production incident involved confusing, missing, or misleading errors.

## Audit Scope

Review:

- Empty or broad catch blocks.
- Logs that omit operation, identifiers, input shape, or original error.
- User-facing failures with vague or unactionable messages.
- Fallbacks that silently substitute data or behavior.
- Retry exhaustion paths.
- Optional chaining or default values that mask required data.

## Failure Patterns

| Pattern | Severity | Why it matters |
|---|---|---|
| Empty catch block | Critical | The failure vanishes completely. |
| Log and continue with no user signal | High | Operators may see logs, but users think the action worked. |
| Silent default/null return | High | Callers cannot distinguish no data from failed data. |
| Broad catch-all around unrelated work | High | Unexpected bugs are converted into normal control flow. |
| Fallback without explicit visibility | Medium | Users and maintainers cannot tell degraded mode is active. |
| Generic message only | Medium | Users cannot recover and maintainers lack breadcrumbs. |

## Output Format

```markdown
## Silent Failure Audit: [Scope]

### Scope
- **Reviewing**: [PR diff / file / feature]
- **Error handlers found**: [count]
- **Files**: [files]

### Findings
#### [Severity] [Title]
**Location**: `path/file.ts:45`
**Pattern**: [Empty catch / silent fallback / generic message]
**Problem**: [What is hidden]
**User or operator impact**: [Concrete impact]
**Required fix**: [Specific behavior/logging/message/propagation change]

### Positive Patterns
- `path/file.ts:88` logs operation context and surfaces an actionable user message.

### Verdict
[Pass / Needs fixes / Critical issues]
```

## Verification

- Every critical or high finding identifies the hidden failure and concrete user/operator impact.
- Required fixes preserve useful context from the original error.
- Fallbacks are documented, observable, and intentional.
- Passing audits mention the positive patterns that justify the pass.
