# PRPs-Framework 🧠

**Context Engineering Framework for System-Agentic Development.**

This Framework is designed to maximize the efficiency of collaboration between **SA/BA** and **DEV** when working with AI (Agentic Workflow). It shifts the paradigm from fragmented verbal/document-based discussions to a **JSON & Issue-Based Structure** that AI can read, understand, and execute accurately.

---

## 🛠 Installation Guide for Your Project

If you want to use this Framework in your own project (e.g., Odoo, FastAPI, PHP), follow these steps:

### 📥 1. Quick Installation (One-Liner) ⭐ RECOMMENDED
Open your Terminal inside your project's root folder and run the appropriate command below. This will securely download and inject the `.cursor/` AI framework engines directly into your project!

**For Windows (PowerShell):**
```powershell
git clone -b prp-auto-dev --filter=blob:none --sparse https://git.nstda.or.th/application-etc/rules-development.git "$env:TEMP\prp-setup" 2>$null; git -C "$env:TEMP\prp-setup" sparse-checkout set .cursor/scripts; powershell -ExecutionPolicy Bypass -File "$env:TEMP\prp-setup\.cursor\scripts\update-prp.ps1" -Apply; Remove-Item "$env:TEMP\prp-setup" -Recurse -Force
```

**For Linux / Mac / WSL (Bash):**
```bash
git config --global credential.helper "cache --timeout=900" 2>/dev/null; git clone -b prp-auto-dev --filter=blob:none --sparse https://git.nstda.or.th/application-etc/rules-development.git /tmp/prp-setup 2>/dev/null; git -C /tmp/prp-setup sparse-checkout set .cursor/scripts; bash /tmp/prp-setup/.cursor/scripts/update-prp.sh --apply; rm -rf /tmp/prp-setup
```

### 📥 2. Manual Installation
If you prefer not to use the automated script, manually copy these folders and files to the **Root Directory** of your project:
- `.cursor/` (or the name depending on your IDE) - Agent command system
- `.auto-claude/` - Folder for storing task states (*if it is a new project, create an empty folder*)

> 💡 **For other IDEs (Multi-IDE Support):** If you are not using Cursor, rename the `.cursor/` folder and the `.cursorrules` file as follows:
>
> | AI IDE / Agent | Folder Name | Rules File |
> | :--- | :--- | :--- |
> | **Cursor** | `.cursor/` | `.cursorrules` |
> | **Windsurf** | `.windsurf/` | `.windsurfrules` |
> | **Trae** | `.trae/` | `.traerules` |
> | **Antigravity / Generic** | `.cursor/` | `.cursorrules` |
> | **PearAI** | `.pearai/` | `.pearairules` |
> | **VS Code (Cline/Roo)** | *(place file at Root)* | `.clinerules` / `.roo-code-rules` |

### 📂 2. Structuring (2 Formats)

#### **Case 1: Single Project**
Place everything at the Root of the project:
```text
your-project/
├── .cursor/
└── .auto-claude/  <-- Store all Specs for the project here
```

#### **⭐ Case 2: Multi-Module / Multi-Project (e.g., Odoo) [RECOMMENDED]**
Focus on entirely isolating the Context to prevent AI confusion. Place them at the Root but strictly separate the task folders by Module:
```text
odoo8/
├── .cursor/       <-- Place Rules & Prompts at the Root once
├── extra-addons/
│   ├── module1/
│   │   └── .auto-claude/ <-- Store Specs specific only to module1 here
│   └── module2/
│       └── .auto-claude/ <-- Store Specs specific only to module2 here
```

#### **❌ Case 2.1: Odoo Workspace (Anti-Pattern / Not Recommended)**
Attempting to merge everything at a single Root for large-scale projects:
```text
odoo8/
├── .cursor/
└── .auto-claude/  <-- Store all Specs of all modules mixed together here
```

> **⚠️ Caution (Anti-Pattern):** 
> It is not recommended to use Case 2.1 for very large-scale projects. Consolidating Specs across 10-20 modules in a single location will lead to **"Context Bleeding"**, where the AI becomes confused, inaccurately grabbing the Logic of module A and mixing it with module B. Furthermore, it consumes a massive amount of **Tokens**, potentially hitting the Limit.
> 👉 *It is advised to use folder separation as in Case 2; it provides better stability, scalability, and faster execution.*

---

### ⚡ 3. Getting Started
After placing the files, open the Cursor Chat and run the command to Sync the data:

- **For Case 1**: Run `/00-Init`
- **For Case 2**: Run `/00-Init @<module_folder_name>` (e.g., `/00-Init @module1`)

---

## 🚀 Quick Start (For Beginners)

### ⚡ First Time Use
To help the Agent recognize the project structure and create the primary index file (`INITIAL.md`), run this command in the Cursor Chat box:
```text
/00-Init
```
> **Tip**: This command will Sync all existing task data and prepare the Agent to start new work.

### 📊 Dashboard & Monitoring (Kanban Board)
You can view the overall task status via the **PRPs Dashboard** (Kanban Board) by opening the Dashboard Application and Browsing to this project folder.
- **Auto-Sync**: Data is fetched automatically from the JSON files in `.auto-claude/specs/`.
- **Timeline Logs**: Monitor the real-time AI progress in the "Logs" Tab.

---

## 🛠 Core Workflow (JSON-Driven)

We work in cycles (Cycles) using JSON as the "Source of Truth" for maximum precision:

| Step | Command | Description | Inputs (Required) | Outputs (Source of Truth) | Next Step |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Create** | `/01-Task` | Define the problem and set basics | User Request | `requirements.json`, `task_metadata.json`, `spec.md` | Proceed to Step 2 for planning |
| **2. Plan** | `/02-Plan` | AI performs code analysis & plans steps | `requirements.json`, `spec.md`, `project_index.json` | `implementation_plan.json`, `context.json`, `task_logs.json` | Proceed to Step 3 to write code |
| **3. Execute** | `/03-Code` | AI writes code based on the plan | `implementation_plan.json`, `context.json`, `task_metadata.json` | Source Code, `task_logs.json` (updated) | Proceed to Step 4 for verification |
| **4. Verify** | `/04-Verify` | Verify quality and finalize the task | `implementation_plan.json`, `source code` | `qa_report.md`, `task_logs.json` (done), Status: `done` | Task completed (Sign-off) |

> 💡 **Tip**: You can append a specific task number to the commands (e.g., `/01-Task 001` or `/02-Plan 001`) to target a specific task directly.
>
> 📚 **Looking for detailed instructions?**: Read the Commands Guide (Commands Guide) along with examples and file storage locations at 👉 [.cursor/commands/README.md](.cursor/commands/README.md)

---

## 📚 File Structure & Standards

- `INITIAL.md`: Overall project overview (Index of all tasks)
- `.auto-claude/specs/`: Directory for processing tracks segregated by tasks (JSON & Markdown)
- `.cursor/PRPs/templates/`: **Source of Truth** for all JSON structures (Refer to `SCHEMA.md` within for specs)
- `PRPs-Framework/`: Core Engine, Templates, and full manuals

---

## 🔌 VS Code Extension & Dashboard

For greater convenience, you can install the Extension and launch the Dashboard as follows:

### 📥 Installing the Extension (.vsix)
1. Navigate to the **Extensions** tab (`Ctrl+Shift+X`) in VS Code
2. Click the **...** (More Actions) icon in the upper right corner of the Extensions menu
3. Select **Install from VSIX...**
4. Choose the file: `.cursor/PRPs/extension/auto-claude-explorer-0.0.1.vsix`

### 🖥️ Launching the Dashboard (2 Options)
You can access the Dashboard page to view the centralized task status in 2 ways:
1. **Via Browser:** Open `.cursor/PRPs/html/dashboard.html` using a Browser (Chrome or Edge recommended)
2. **Via Extension:** Once installed following the steps above, you can open and manage the Dashboard and Tasks directly from the **Auto-Claude** Sidebar in VS Code

---

## 🔍 Further Information
- **Commands Guide (Commands Guide):** [.cursor/commands/README.md](.cursor/commands/README.md)
- **Context Engineering Techniques:** [PRPs-Framework/README.md](./PRPs-Framework/README.md) (if available)

## 🙏 Credits & Inspiration
This project is inspired by and draws concepts from the following projects:
- [PRPs-agentic-eng](https://github.com/Wirasm/PRPs-agentic-eng)
- [Auto-Claude](https://github.com/AndyMik90/Auto-Claude)
- [antigravity-kit](https://github.com/vudovn/antigravity-kit)

---
*Developed by Antigravity Team for Agent-Ready Repositories*
