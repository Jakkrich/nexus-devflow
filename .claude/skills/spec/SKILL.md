---
name: spec
description: "[Devflow] Fast-Track Spec router in DevFlow (Blueprint Mode) - aliases and routes to /feature or /fix to create the single living spec.md contract."
argument-hint: "{feature title, bug description, IDEA-xxx, or running-id}"
---

# Fast-Track: Spec Router (Blueprint Mode)

$ARGUMENTS

Unified Fast-Track entry point that routes to `/feature` or `/fix` to create and maintain the **Single Living Spec (`spec.md`)**.

> [!TIP]
> **Preferred Commands**:
> - ใช้ **`/feature <title>`** สำหรับฟีเจอร์ใหม่หรืองานพัฒนาทั่วไป
> - ใช้ **`/fix <bug-description>`** สำหรับแก้บั๊กหรือ hotfix

## Invocations & Aliases

- `/feature <title>`: Fast-Track feature workflow (แนะนำ)
- `/fix <bug-description>`: Fast-Track ad-hoc bugfix workflow (แนะนำ)
- `/spec <title>` or `/spec IDEA-xxx`: Generic Fast-Track specification
- `$feature`, `$fix`, `$spec`: Codex CLI invocation

## Fast-Track Mainline Workflow

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

## Behavior & Contract

When invoked:

1. If the input describes a bug or hotfix, routes to `/fix` behavior.
2. Otherwise, routes to `/feature` behavior.
3. Allocates sequential Running ID (`RUN-xxx`), creates directory `devflow/runs/{RUNNING_ID}/`, and generates `spec.md` in **Thai (`th`)**.
4. Updates `devflow/context/current-stage.md` and reports next step: `/implement`.
