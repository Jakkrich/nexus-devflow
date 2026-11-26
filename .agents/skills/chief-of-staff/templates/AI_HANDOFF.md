# AI_HANDOFF — `<project-name>`

Project governance and handoff hub. Active task board and Chief of Staff status live in [`.context/cos-board.md`](./.context/cos-board.md).

## 0. Start here

1. Read [`.context/cos-board.md`](./.context/cos-board.md) and `AI_HANDOFF.md` §1–§2 plus the top 3 entries of §5.
2. Check §2 (`Active Lock`) and `.context/cos-board.md` so you do not overwrite files owned by another active agent.
3. Read §3–§4 as needed for architecture, pitfalls, and open tech debt.

## 1. Current State (update on every change)

| Field | Value |
|---|---|
| Repository / Owner | `<owner>/<repo>` (branch `main`) |
| Last known commit | `—` |
| Runtime / Stack | `<fill during bootstrap>` |
| Build command | `<fill during bootstrap>` |
| Test / Verify command | `<fill during bootstrap>` |
| Deploy | `<fill during bootstrap>` |

### Repo Invariants (never break)

- `<Add hard rules discovered in this repo, e.g. schema migrations, bundle parity, determinism, never commit secrets>`
- Run the project's verification checks (`.agents/skills/verify-project/SKILL.md`) before reporting any task complete.

## 2. Active Lock (avoid agent conflicts)

| Agent | Since | Task | Files touched |
|---|---|---|---|
| — | — | no active tasks | — |

## 3. Architecture & Known Pitfalls

- **Entry points & load order:** `<fill during bootstrap>`
- **State / Persistence:** `<fill during bootstrap>`
- **Known pitfalls:** `<fill during bootstrap>`

## 4. Tech Debt / Open Gaps

- [ ] `<Add known gaps or follow-ups>`

## 5. Change Log (newest at top)

### YYYY-MM-DD · <Agent> · <short title>
- **What:** exact file paths and symbols changed
- **Why:** user request / bug / improvement
- **Verification:** exact commands run and observed results
- **Pending / Notes for next agent:** none
