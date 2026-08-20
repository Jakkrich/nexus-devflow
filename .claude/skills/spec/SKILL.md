---
name: spec
description: "[Devflow] Fast-Track Spec router in DevFlow (Blueprint Mode) - aliases and routes to /feature or /fix to create the living current-feature.md contract in context."
argument-hint: "{feature title, bug description, IDEA-xxx, or running-id}"
---

# Fast-Track: Spec Router (Blueprint Mode)

$ARGUMENTS

Unified Fast-Track entry point that routes to `/feature` or `/fix` to create and maintain the **Single Living Spec (`devflow/context/current-feature.md`)**.

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

1. Checks Single Active Run Guardrail: rejects if an uncompleted active run already exists in `devflow/context/current-stage.md` or `devflow/context/current-feature.md`.
2. If the input describes a bug or hotfix, routes to `/fix` behavior.
3. Otherwise, routes to `/feature` behavior.
4. Allocates sequential ID without prefix (`xxx-slug`), generates `devflow/context/current-feature.md` in **Thai (`th`)**.
5. Updates `devflow/context/current-stage.md` and reports next step: `/implement`.
