# Verify Harness Templates

## 1. Template for `.agents/skills/verify-<app>/SKILL.md`

```markdown
---
name: verify-<app>
description: "[project] Launch, doctor, drive, and capture end-to-end proof for <app> (<surface>). Use during /check or after changes to user-facing flows."
---

# verify-<app>

## Launch
- Command: `<exact start command>`
- Isolation: `<temp dir / port / profile flags>`
- Readiness signal: `<log line / health payload / prompt>`

## Doctor
- Read-only check: `<command checking process, build version, port ownership, and auth/seed state>`

## Drive
- Primary flows live in `features/README.md`.
- Prefer stable handles (`data-testid`, ARIA roles, exact CLI flags, documented API endpoints).

## Evidence
- Store artifacts in `devflow/reports/{run-id}/` (gitignored).
- Capture: command/action, exit code or HTTP status, resulting UI/output, and persisted side effects.

## Cleanup
- Tear down only PIDs and temp directories created by this run.
- Preserve `devflow/reports/{run-id}/` evidence files after teardown.
```

## 2. Template for `.agents/skills/verify-<app>/features/README.md`

```markdown
# Feature Verification Map

| Feature | Entry Point | Primary Journey File |
|---|---|---|
| `<feature-name>` | `<route / command / endpoint>` | `<feature-slug>.md` |
```

## 3. Template for `.agents/skills/verify-<app>/features/<feature-slug>.md`

```markdown
# Feature: <Title>

## Sub-features
- <User-visible capability 1>

## How to get to it (user POV)
- <Exact route, menu path, or CLI command from a cold start>

## Driving it
- <Concrete steps, inputs, and observable end state / side effects>

## Gotchas
- <Missing seed data, timing/async readiness notes, or isolation limits>
```
