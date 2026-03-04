## Project Context Index

Use this file as the "Project Overview Overview" and an index linking to PRPs, references, and other documentation.
Caution: Before making major structural changes, you should keep a snapshot with a Git commit.

### Project Overview
- **Platform/Stack**: Generic / PRPs-Framework
- **Description**: Framework for Context Engineering and Agent-based Development to systematically help SA/BA and DEV collaborate with AI.

### System Requirements Summary (for Rebuild)
- **Workflow**: 4-Step Cycle (JSON-Driven): Create (/01-Task) -> Plan (/02-Plan) -> Execute (/03-Code) -> Verify (/04-Verify).
- **Organization**: Uses an Issue ID-based directory structure to group Spec, PRP, and execution results together.
- **Traceability**: Enforces the use of an External Ref ID as a prefix for file and branch names for traceability back to the task management system.
- **Execution**: The AI must follow the Plan/Subtasks in the PRP and run the Validation Loop to confirm correctness.

### File & Directory Index
- `INITIAL.md`: Project index file (current page)
- `.auto-claude/`: Workspace status storage
  - `specs/`: List of Tasks that have been processed
  - `issues/`: Staging Area for pending tasks
  - `research/`: Staging Area for pending tasks

### 🛠️ Core Commands (Zero-Script Mode)
Use these commands in Chat to control the Workflow:
- `/00-Init` : (Init) Analyze the project and set up `.cursorrules` from a Template
- `/01-Task` : (New Task) Create a task folder and write an initial Spec
- `/02-Plan` : (Plan) In-depth code analysis and step-by-step planning
- `/03-Code` : (Implement) Write code and continuously run the Validation Loop
- `/04-Verify` : (Verify) Inspect code quality (Senior Review) and summarize QA Report
- `/05-PRD` : (Strategic) Create Product Requirements in a Hypothesis-driven manner
- `/06-Debug` : (Debug) Investigate the root cause via Root Cause Analysis with 5 Whys
- `/07-Commit` : (Git) Save work and write clear, communicative Commit messages
- `/08-PR` : (Git) Create a standardized Pull Request with a summary of changes
- `/09-Research` : (Explorer) Explore and map the code structure (Cartography)
- `/99-Coach` : (Coach) Consult guidelines and previously recorded lessons

### Project Context (Auto-Synced)
- **Detected Stack**: Generic / PRPs-Framework
- **Active Project**: `./` (Root)
- **Project Path**: `D:/wsl/prp-auto-dev/`
- **Mode**: Pure Agentic (Zero-Script)
- **Standard**: Follows `.cursorrules` (Multi-project aware)
- **Last Sync**: 2026-03-04 15:13 (Local Time)

### Active Specs & Tasks
- *(Empty)*

### Incoming Issues (Staging Area)
- *(Empty)*

### Documentation
- [README (Root)] - `README.md`


### Other Considerations (Global Gotchas)
- **External Ref ID**: Always check the External Ref ID before creating a file or branching off.
- **Index Refresh**: You can re-run the `/00-Init` command to update this file to the latest state.
