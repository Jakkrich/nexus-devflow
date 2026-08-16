---
name: preview-local-check
description: Manage local preview, smoke-check, and temporary runtime verification before formal verification. Use when implementation needs a quick visual or runtime check, when a reviewer needs a local URL, or when a change should be inspected before /50-Verify.
---

# Preview Local Check

## Overview

This skill handles preview management and lightweight runtime checks without pretending that preview success is the same as full verification success.

Use it to:

- start or stop a local preview server
- report preview health and URL
- run a quick smoke check before formal verification
- give humans a concrete local artifact to inspect

## When to Use

- During `/40-Implement` when a quick runtime check is useful
- During `/50-Verify` when the change needs visual or interactive confirmation
- When a reviewer asks for a local preview URL

Do not use this skill as a replacement for test evidence, verification evidence, or release readiness.

## Process

### 1. Detect Preview Path

- identify the correct project-local preview command
- detect the likely app type and default port
- separate preview management from deployment logic

### 2. Manage State

- support `status`, `start`, `stop`, `restart`, and `check`
- report port conflicts clearly
- offer a safe alternate port when possible

### 3. Report Health

Always report:

- URL
- project path
- app type
- health status
- blockers or warnings

### 4. Route Back

- return to `/50-Verify` when preview confirms the change is ready for formal checks
- return to `/40-Implement` when preview reveals implementation issues
- use `Debug` when the preview failure needs RCA

## Output

Return a concise preview status or action summary. When useful, save notes into the current stage artifact rather than inventing a separate contract.
