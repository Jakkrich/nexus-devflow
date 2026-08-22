---
name: overview
description: "[Devflow] Distill user-owned planning docs into `devflow/context/project-overview.md` using a deterministic compiler so the workspace context stays live and generated, not hand-authored."
---

# overview - dynamic project overview compiler

## Position in workflow

```text
project-plan.md + build-plan.md + history + codebase signals
            -> scripts/overview.ts
            -> devflow/context/project-overview.md
            -> /feature / fix / check / complete
```

`/overview` turns planning and delivery context into one generated
`devflow/context/project-overview.md` artifact.

## Input

- `devflow/project-plan.md` - product vision, users, stack, constraints
- `devflow/build-plan.md` - ordered checkbox feature queue
- `devflow/history/HISTORY.md` - shipped capability context
- `devflow/ideas.md` - backlog pulse
- `package.json` (if available) - command/tooling signal

## Process

### Step 1: Read and validate plans

1. Read `project-plan.md` and `build-plan.md`.
2. Validate plan shape:
   - checkbox list in `build-plan.md`
   - feature-sized items
   - no pre-build setup or unclear one-liners

If `build-plan.md` is still placeholder-only while planning is real in `project-plan.md`,
pause for user approval before normalizing and writing.

### Step 2: Compile overview

Run:

```bash
npm run overview
```

The script uses `devflow/reference/project-overview-template.md` and writes the output
to `devflow/context/project-overview.md`.

### Step 3: Report

Summarize what changed and list:

- sections marked `TODO`
- any plan conflicts / unresolved scope gaps
- next recommended action (`/feature` when queue is clean)

## Rules

- Keep overview generation deterministic and input-sourced.
- Do not invent scope.
- Never rewrite user-owned plan files unless explicitly requested.
- Re-run whenever plans or history materially change.
