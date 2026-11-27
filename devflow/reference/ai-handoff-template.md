# AI_HANDOFF — `<project-name>`

Project governance, live engineering handbook, and cross-provider agent handoff hub.
Released delivery history lives in [`devflow/history/HISTORY.md`](./devflow/history/HISTORY.md). Repository rules, active locks, architecture notes, known pitfalls, and recent cross-provider change logs live in §0–§6 below.

## 0. Start here

1. Read [`devflow/history/HISTORY.md`](./devflow/history/HISTORY.md) and `AI_HANDOFF.md` §1–§2 plus the top 3 entries of §6 before editing code.
2. Check §2 (`Active Lock`) so you do not overwrite files owned by another active provider/agent or branch.
3. Read §3–§5 only as needed for runtime flow, entry points, persistence, pitfalls, and open tech debt.

## 1. Current State (update on every change)

| Field | Value |
|---|---|
| Repository / Owner | `<owner>/<repo>` (branch `main`) |
| Last known commit | `—` |
| Runtime / Stack | `<fill during /onboard>` |
| Build command | `<fill during /onboard>` |
| Test / Verify command | `<fill during /onboard>` |
| Deploy | `<fill during /onboard or Manual>` |

### Repo Invariants & Wrap-up (never break)

- **Multi-provider parity:** Every AI provider (Claude Code, Codex, Antigravity, Copilot, OpenCode) must check §2 before editing and run project verification before reporting done.
- **Keep secrets out of Git:** Never write tokens, API keys, passwords, or `.env` values into `AI_HANDOFF.md`.
- **On finish:** Update or clear your row in §2 (`Active Lock`), prepend an entry at the top of §6 (`Recent Handoffs / Change Log`, keeping the latest ~10 entries; archive older shipped work in `devflow/history/HISTORY.md` + Git log), update `## 1. Current State`, and report changed files + exact verification results.

---

## 2. Active Lock (lightweight conflict guard)

| Provider / Agent | Branch / Worktree | Since | Task | Files touched |
|---|---|---|---|---|
| — | — | — | no active tasks | — |

---

## 3. Architecture & Entry Points

- **Entry points & load order:** `<fill during /onboard>`
- **State / Persistence:** `<fill during /onboard>`
- **Key modules & boundaries:** `<fill during /onboard>`

---

## 4. Known Pitfalls

- `<Add real pitfalls discovered in this repo (e.g., global side-effects, ordering constraints, caching TTL, platform quirks)>`

---

## 5. Tech Debt / Open Gaps

- [ ] `<Add open technical debt, known bugs, or deferred follow-ups>`

---

## 6. Recent Handoffs / Change Log (newest at top)

### YYYY-MM-DD · <Provider / Agent> · <short title>
- **What:** exact file paths and symbols changed
- **Why:** user request / bug / feature
- **Verification:** exact commands run and observed results
- **Pending / Notes for next agent:** none
