# 🎯 GitHub Issue Triage Report: #{Issue_Number}

> **Source Trigger**: `/57-Issue-Triage`
> **Target Issue Number**: #{Issue_Number}
> **Title**: {Issue Title}

---

## 🔍 1. Issue Overview & Diagnosis
- **Summary**: [What is reported? Description of bug or feature request]
- **Symptom / Trace**: [Error logs or step to reproduce]
- **Duplicate Detection**: [Search results for similar issues]
- **Spam Verdict**: [✅ Valid Issue | ❌ Spam/Noise]

---

## 🚦 2. Severity & Priority Evaluation
- **Classification**: [e.g. Bug | Feature Request | Security | Chore]
- **Priority Level**: [Low | Medium | High | Critical]
- **Impact Assessment**: [How many users are affected? Security vulnerability risk?]

---

## 🛠️ 3. Triage Routing Action Plan
- **Triage Action**: [Create PRP Task | Defer | Close | Request Clarification]
- **Recommended Workflow**:
  - For bugfixes: Run `/20-Debug "RCA for #{Issue_Number}"`
  - For features: Run `/12-PRD "PRD for #{Issue_Number}"`
- **Next Command**:
  ```text
  /{Workflow} "{Arguments}"
  ```
