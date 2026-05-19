# 🛡️ QA Orchestration Plan: Task {ID} - {Task Title}

> **Source Trigger**: `/39-QA-Orchestrate`
> **Target Task ID**: {ID}
> **Status**: QA-PLANNING

---

## 🏗️ 1. QA Strategy & Multi-Lane Allocation
To ensure comprehensive test coverage, the following QA Lanes are activated:

- **Correctness & Acceptance Criteria**: [Verify functional deliverables]
- **Tests & Regressions**: [Verify test suite coverage and prevent regression]
- **Security & Data Safety**: [Verify input sanitation, authentication, and permissions]
- **Performance & Scalability**: [Verify load speed, DB index hits, and resource locks]
- **UX / Manual Verification**: [Verify responsiveness, styling, and premium interactive flow]

---

## 📂 2. Recommended Specialist Reviews
To drill down into specific areas, the following senior specialist agents are recommended:

*   `/90-Agent code-reviewer .workspaces/specs/{ID}-*/` -> Codebase fit, architecture check
*   `/90-Agent test-engineer .workspaces/specs/{ID}-*/` -> Missing test cases discovery
*   `/90-Agent security-auditor .workspaces/specs/{ID}-*/` -> Deep vulnerability check

---

## 🚦 3. Test Routing & Action Items
*Actionable findings identified during the orchestration scan:*

| Finding / Target | Severity | Lanes Affected | Action Item / Fix Instructions |
| :--- | :--- | :--- | :--- |
| [e.g. Unhandled error fallback] | [Low | Medium | High] | Correctness, UX | [e.g. Implement custom catch block] |

---

## 📌 4. Concrete Next Command
If findings are minor, proceed to:
```text
/33-Verify {ID}
```
If significant fixes are needed, proceed to:
```text
/32-Code {ID}
```
