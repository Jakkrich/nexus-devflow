# 🎛️ Interactive Choice & Predictive Follow-Up Rules

> Rules for Google Antigravity & Nexus-DevFlow Agents (Zero Copy-Paste Friction)

---

## 📌 Principles & Mandatory Workflow

When the agent needs to:
1. **Present Options & Recommendations**: (e.g. Next Actions, Architecture Options, Design Choices)
2. **Ask Clarification & Confirmations**: (e.g. Branching paths, confirming spec/scope)
3. **Anticipate Next Follow-up Questions**: (e.g. What the user might want to explore or ask next)

### ❌ Strict Prohibitions
- **DO NOT** output a raw numbered or bulleted list (e.g. `1. Option A`, `2. Option B`) in the markdown chat and ask the user to type or copy-paste their choice into the chat prompt.

### ✅ Mandatory Action
- **ALWAYS call the `ask_question` tool** (if running in Antigravity IDE) or use the interactive picker:
  - Formulate a clear, direct question in `question`.
  - Provide 2–4 concise, predictive choices in `options`.
  - Always prefix the recommended choice with `(Recommended)` as the first item.
  - Set `is_multi_select: false` (or `true` if multiple selections make sense).
- In Antigravity IDE, calling `ask_question` automatically opens an interactive modal window on the user's screen with radio/checkbox buttons and a write-in feedback box. The user can simply click their preferred option without typing or copying text!
