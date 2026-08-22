---
name: 10-define
description: "[Devflow] Define stage in DevFlow 2.0 - turn an approved discovery into a bounded delivery run in context/current-run with stable scope."
argument-hint: "{approved discovery-id, discovery path, running-id, or run path}"
---

# Phase 10: Define

$ARGUMENTS

Convert an approved `Proceed` discovery into a bounded delivery run. Checks the Single Active Run Guardrail, allocates a sequential ID without prefix (`xxx-slug`), and writes `devflow/context/current-run/10-define.md`.

## Usage

```text
10-define {discovery-id or discovery path}
10-define {id or run path}
```

## Markdown-First Contract

For the active delivery run, write:

```text
devflow/context/current-run/10-define.md
```

using:

```text
.agent/resources/schemas/define.template.md
```

## Process & Quality Gates

### 1. Single Active Run Guardrail (One Thing at a Time)
1. Inspect `devflow/context/current-stage.md`, `devflow/context/current-feature.md`, and `devflow/context/current-run/`.
2. If an active uncompleted run exists:
   - **HALT and reject opening a new define stage**.
   - Warn the user to complete or close the active run with `/complete` or `70-deliver` first.

### 2. Validate The Discovery Gate
Require:
- `Decision: Proceed`
- `Approval Status: Approved`
- A resolvable Discovery ID and `00-explore.md`

### 3. Allocate Sequential ID
- Inspect `devflow/history/HISTORY.md` and allocate sequential ID without prefix (e.g. `022-{slug}`).
- Create directory `devflow/context/current-run/` if it does not exist.
- Write `devflow/context/current-run/10-define.md`.
- Update `devflow/context/current-stage.md`:
  - `Active Running ID`: `{ID}`
  - `Current Stage`: `10-define (Completed -> Ready for 20-spec)`
