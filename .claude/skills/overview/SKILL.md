---
name: overview
description: "[devflow] Distill user-owned planning docs into `devflow/context/project-overview.md` using a deterministic compiler. The overview is the living source of truth that agents read every session."
---

# overview - dynamic project overview compiler

## Position in workflow

```text
project-plan.md + build-plan.md + history + codebase signals
            -> scripts/overview.ts
            -> devflow/context/project-overview.md
            -> /feature / fix / check / complete
```

`/overview` updates the living context from planning documents and runtime signals.

## Input

- `devflow/project-plan.md` - Product vision, users, stack, constraints, roadmap
- `devflow/build-plan.md` - Ordered checkbox feature queue
- `devflow/history/HISTORY.md` - Shipped capability context
- `devflow/ideas.md` - Current idea pressure and backlog pulse
- `package.json` (if present) - Verified commands and language/tooling signals

If either primary plan file is missing or still placeholder-only, stop and ask for
actual planning content first.

## Step 1 - read and validate planning docs

1. Read `devflow/project-plan.md` and `devflow/build-plan.md`.
2. Validate shape:
   - `build-plan.md` must be a checkbox list in tracked order (`- [ ]`, `- [x]`).
   - plan items must be feature-sized and executable by `/feature`.
   - unresolved feature mismatch between plan and overview is reported in the final note.

### Stub plan hard-stop (existing contract)

- If `build-plan.md` is still a template stub but `project-plan.md` contains real features,
  **do not** generate a fake overview from `project-plan.md` alone.
- Offer normalization first, then ask for approval before writing.

## Step 2 - compile overview payload

Run:

```bash
npm run overview
```

The compiler writes:

- purpose + architecture summary (from `project-plan.md`)
- ordered queue (from `build-plan.md`)
- shipped features snapshot (from `devflow/history/HISTORY.md`)
- idea status and backlog pulse (from `devflow/ideas.md`)
- stack/tooling context (from project root signals)

The generated output follows `devflow/reference/project-overview-template.md`.

## Step 3 - output and report

After compilation:

- report what changed in structure and which sections are now `TODO`
- list conflicts or unresolved questions between the two plans
- suggest `/feature` as the next action when the queue is ready

## Rules

- `project-overview.md` is generated, not authored manually.
- Do not invent features, data models, or stack claims not sourced from inputs.
- Keep user-owned plans intact unless the user explicitly approved normalization.
- Re-run `/overview` whenever plan docs or shipped-history change materially.

## Formatting

- Use concise lists and tables for matrices.
- Follow `devflow/context/ai-interaction.md` language and tone conventions.
