# 🎛️ Interactive Choice & Predictive Follow-Up Guide (In-IDE Native)

> **Protocol & Reference Guide**: Zero Copy-Paste Interaction using In-App Native Modal in Google Antigravity IDE.

---

## 📌 Overview & UX Principle

In AI-assisted software engineering, agents frequently formulate recommendations, proposed next actions, or anticipated follow-up questions. Historically, agents output numbered lists (e.g., `1. Option A`, `2. Option B`) into the chat stream, forcing users to highlight, copy, or type responses into the prompt.

### 🚫 Design Decision: No External OS Popups
During discovery and prototyping, external OS-level popup windows (such as PowerShell GUI / WinForms / WPF modals) were evaluated and tested. The empirical UX finding was clear: **External OS floating windows are disruptive, steal window focus, require Alt+Tab switching, and degrade developer flow.**

**Nexus-DevFlow strictly standardizes on Seamless In-IDE Interaction**:
- **Exclusively use Antigravity's built-in `ask_question` tool**:
  - The modal dialog renders directly inside the IDE interface.
  - Zero Alt+Tab or taskbar switching.
  - Completely non-intrusive and keyboard/mouse friendly.
  - Radio buttons for single-choice, checkboxes for multi-select, and integrated write-in text field.

---

## ⚡ Antigravity IDE (Native Integration)

### How It Works
- Enforced in `AGENTS.md` (Directive 7), `devflow/context/ai-interaction.md` (Section 2), and `.agents/rules/interactive-selection.md`.
- Whenever presenting 2+ choices or next actions, the agent MUST call `ask_question` instead of writing raw markdown lists in chat.
- An interactive modal appears directly within Antigravity IDE.
- Selecting an option submits the response immediately to the agent. Zero copy-pasting is required.
