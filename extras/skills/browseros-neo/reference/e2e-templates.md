# BrowserOS neo E2E Test Plan & Evidence Templates

Use these templates whenever executing `browseros-neo` in **Mode A (E2E Test & Verify)** or **Mode B (E2E Debug & Fix Verification)**. Keep prose concise and follow the project's `artifactLanguage` (default Thai for DevFlow artifacts, English for code/paths/identifiers).

---

## 1. Pre-Execution Test Plan (`devflow/reports/{run-id}/browser-test-plan.md`)

Write this file **before** calling `run` / `navigate` / `act`:

```markdown
# Browser E2E Test Plan: {run-id}

- **Run ID**: `{run-id}`
- **Mode**: `E2E Test & Verify` | `E2E Debug & Fix Verification`
- **Target URL / App**: `{base-url}`
- **Source Spec / Request**: `devflow/context/{xxx-slug}/spec.md` (or ad-hoc goal)
- **BrowserOS Session Name**: `{run-id}-e2e` (or `{run-id}-debug`)
- **Planned At**: `{ISO-8601 timestamp}`

## Test Cases

| Case ID | Linked AC / Goal | Preconditions | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| `TC-1` | `AC-1` | Logged-in BrowserOS session | 1. Open route<br>2. Fill/submit<br>3. Verify UI + network | Expected state shown, 0 console/5xx errors |
| `TC-2` | `AC-2` | ... | ... | ... |
```

---

## 2. Persistent Evidence Report (`devflow/reports/{run-id}/evidence.md`)

Always create or **append** a new timestamped run block (never overwrite prior runs for the same `{run-id}`):

```markdown
# Browser E2E Evidence Log: {run-id}

---

## Run `{YYYY-MM-DD HH:mm}` — `{E2E Test & Verify | E2E Debug}`

- **Session (`name_session`)**: `{run-id}-e2e` *(ค้นดู video/session replay ย้อนหลังใน BrowserOS neo cockpit ด้วยชื่อนี้)*
- **Target URL**: `{url}`
- **Plan File**: `devflow/reports/{run-id}/browser-test-plan.md`
- **Overall Verdict**: `PASS` | `FAIL` | `BLOCKED`

### Results Matrix

| Case ID | Status | Observed Behavior | Console / Network | Artifacts |
| :--- | :--- | :--- | :--- | :--- |
| `TC-1` | `[pass]` | ... | 0 console errors, HTTP 200 | `screenshots/tc1-ok.png` |
| `TC-2` | `[fail]` | ... | `POST /api/...` HTTP 500 | `screenshots/tc2-err.png` |

### Debug Root Cause & Re-Verification *(Mode B only)*
- **Symptom / Repro**: ...
- **Root Cause Observed**: ...
- **Post-Fix Re-Check**: `TC-2` re-verified -> `[pass]` / still `[fail]`
```

---

## 3. `run` Script Pattern Checklist

When writing a BrowserOS neo `run` script:
1. Derive or open the target tab inside the `run` script (`tabs` `"new"` or match URL); carry **URLs** (not page IDs) across separate calls.
2. Batch `snapshot -> act -> verify` for one logical test case (`<= 5` fresh navigations per 30s `run` call).
3. Use `diff: "summary"` or a cap number in `act` on large pages to keep context clean.
4. Capture a screenshot at key assertions or failures and save under `devflow/reports/{run-id}/screenshots/`.
5. Read tool descriptions at runtime for exact MCP parameter names (since BrowserOS neo MCP versions may evolve).
