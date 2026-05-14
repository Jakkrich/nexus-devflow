# PRPs-Framework 🧠

**Context Engineering Framework for Multi-IDE System-Agentic Development.**

This framework is designed to maximize the efficiency of collaboration between **SA/BA** and **DEV** when working with AI (Agentic Workflow). It shifts the paradigm from fragmented verbal/document-based discussions to a **JSON & Markdown Structure** that AI Agents can read, understand, and execute with surgical precision.

---

## 🔑 Key Feature: Multi-IDE Switcher
The PRPs-Framework is **IDE-Agnostic**. You can switch the entire codebase structure and internal links to support your favorite AI IDE using the `active-ide.py` script at the root.

| AI IDE / Agent | Root Folder | Workflow Folder | Rules File |
| :--- | :--- | :--- | :--- |
| **Cursor** | `.cursor/` | `commands/` | `.cursorrules` |
| **Windsurf** | `.cursor/` | `workflows/` | `.cursorrules` |
| **Antigravity** | `.cursor/` | `workflows/` | `.antigravityrules` |

**How to switch:**
```powershell
# Interactive Menu
python active-ide.py

# Direct Switch
python active-ide.py --cursor
python active-ide.py --windsurf
python active-ide.py --antigravity
```

---

## 🛠 Installation Guide

### 📥 1. Quick Installation (One-Liner) ⭐ RECOMMENDED
Open your terminal inside your project's root folder and run the command below to inject the PRPs engines directly into your project!

**For Windows (PowerShell):**
```powershell
git clone -b prp-auto-dev --filter=blob:none --sparse https://git.nstda.or.th/application-etc/rules-development.git "$env:TEMP\prp-setup" 2>$null; git -C "$env:TEMP\prp-setup" sparse-checkout set .cursor/scripts; powershell -ExecutionPolicy Bypass -File "$env:TEMP\prp-setup\.cursor\scripts\update-prp.ps1" -Apply; Remove-Item "$env:TEMP\prp-setup" -Recurse -Force
```

**For Linux / Mac / WSL (Bash):**
```bash
git config --global credential.helper "cache --timeout=900" 2>/dev/null; git clone -b prp-auto-dev --filter=blob:none --sparse https://git.nstda.or.th/application-etc/rules-development.git /tmp/prp-setup 2>/dev/null; git -C /tmp/prp-setup sparse-checkout set .cursor/scripts; bash /tmp/prp-setup/.cursor/scripts/update-prp.sh --apply; rm -rf /tmp/prp-setup
```

### 📂 2. Project Structuring (Recommended)

#### **Standard Multi-Module Isolation**
Focus on isolating context to prevent AI confusion. Place Rules at the root but keep task data specific to each module:
```text
your-project/
├── .cursor/ (or .cursor/.windsurf)  <-- Rules & Prompts (One place)
├── active-ide.py                   <-- Switcher Script
├── module1/
│   └── .auto-claude/               <-- Specs specific to module1
└── module2/
    └── .auto-claude/               <-- Specs specific to module2
```

---

## 🔄 Core Workflow (JSON-Driven)

We work in cycles using JSON as the "Source of Truth" for maximum precision:

| Step | Command | Description | Outputs (Source of Truth) |
| :--- | :--- | :--- | :--- |
| **1. Create** | `/30-Task` | Define problem & set basics | `spec.md`, `requirements.json` |
| **2. Plan** | `/31-Plan` | Code analysis & subtasking | `implementation_plan.json`, `context.json` |
| **3. Execute** | `/32-Code` | AI writes code (Validation Loop) | Source Code, `task_logs.json` |
| **4. Verify** | `/33-Verify` | Senior Review & QA report | `qa_report.md`, Status: `done` |

---

## 📊 Dashboard & Monitoring
View overall task status via the **PRPs Dashboard** (Kanban Board):
1. **Via Browser:** Open `[active-ide-root]/PRPs/html/dashboard.html`
2. **Via Extension:** Install the `.vsix` from `[active-ide-root]/PRPs/extension/`

---

## 🔍 Further Information
- **Commands Guide:** [commands/README.md](.cursor/commands/README.md)
- **Specialist Agents:** [agents/README.md](.cursor/agents/README.md)
- **Knowledge Skills:** [skills/README.md](.cursor/skills/README.md)

---

## 🙏 Credits & Inspiration
This project is inspired by and draws concepts from:
- [PRPs-agentic-eng](https://github.com/Wirasm/PRPs-agentic-eng)
- [Auto-Claude](https://github.com/AndyMik90/Auto-Claude)
- [antigravity-kit](https://github.com/vudovn/antigravity-kit)

---
*Developed by Antigravity Team for Agent-Ready Repositories*
