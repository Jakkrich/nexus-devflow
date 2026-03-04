# 🤖 AI Agent Commands & Workflows (PRPs)

The Markdown files in this folder are **Custom Commands / Workflows** to be used in AI-enabled IDEs (Cursor, Windsurf, Antigravity/Agent), designed around the principles of **Context Engineering** and **System-Agentic Development** so that the AI can tackle complex tasks systematically.

---

## 🚀 Core Workflow Commands (The 4 Core Steps)

Standard sequence for developing a feature or fixing a bug:

### 1️⃣ **/01-Task**
*   **Role:** Start a new task, create the workspace.
*   **Input:** `{ID} {Title} ["Description"]` (e.g., `/01-Task 007 "Add Login Page"`)
*   **Output:** 
    *   Folder `.auto-claude/specs/{ID}-{slug}/`
    *   Files `spec.md`, `task_metadata.json`, `requirements.json`, `implementation_plan.json`

### 2️⃣ **/02-Plan**
*   **Role:** Deeply analyze the code and plan the implementation step-by-step.
*   **Input:** `{ID}` (e.g., `/02-Plan 007`)
*   **Output:** 
    *   `implementation_plan.json` (update Subtasks)
    *   `plan.md` (summary of the plan for human reading)
    *   `context.json`, `task_logs.json`

### 3️⃣ **/03-Code**
*   **Role:** Execute code writing based on the plan and verify correctness (Validation Loop).
*   **Input:** `{ID}` (e.g., `/03-Code 007`)
*   **Output:** 
    *   Source Code (The actual modified files)
    *   Update Subtasks status in `implementation_plan.json` and records Logs in `task_logs.json`

### 4️⃣ **/04-Verify**
*   **Role:** Assess work quality (Senior Review) and summarize test results.
*   **Input:** `{ID}` (e.g., `/04-Verify 007`)
*   **Output:** 
    *   `qa_report.md` (result log of running Test/Lint/Build and the acceptance criteria)
    *   Update status to `human_review` in `implementation_plan.json`

---

## 🛠️ Advanced & Utility Commands

| Command | Input | Output | Description |
| :--- | :--- | :--- | :--- |
| **app-builder** | `{Description}` | New Project | Set up a brand new application from scratch. |
| **05-PRD** | `{Idea}` | `*.prd.md` | Create a strategic/level requirements document |
| **06-Debug** | `{Error/Symptom}` | `rca-*.md` | Investigate bug causes using the 5 Whys (Root Cause Analysis) |
| **07-Commit** | `[Target]` | Git Commit | Automatically stage files and draft a Commit Message |
| **08-PR** | `[Base Branch]` | GitHub PR | Push branch and create a Pull Request on GitHub |
| **09-Research** | `{Topic}` | `research-*.md` | Explore existing code patterns and structure |
| **10-Human** | `{Action} {ID}` | Updated Status | Humans issue an Approve ✅ or Reject ❌ to loop the task |
| **11-Agent** | `{Agent} {Target}` | Report/Code | Call specialized experts (e.g., `frontend-specialist`) |
| **12-Deploy** | `{Subcommand}` | Web Deploy | Run pre-flight checks and deploy to production |
| **13-Test** | `{Target}` | Test Cases | Generate tests, run test suites, check coverage |
| **14-Preview**| `{Subcommand}` | Server Log | Manage preview server (start, stop, check status) |
| **99-Coach** | `{Question}` | Advice/Note | Consult approaches, project knowledge, Q&A, and suggest commands |

---

## 📝 Usage Examples

### Scenario 1: Starting a new feature from scratch
1. `/01-Task 008 "Dark Mode Support"` (Create task)
2. `/02-Plan 008` (Analyze which CSS needs to be added)
3. `/03-Code 008` (AI edits themes/colors)
4. `/04-Verify 008` (AI verifies work)
5. `/10-Human Approve 008` (Human approves, close task)

### Scenario 2: Find a bug and want to fix it
1. `/06-Debug "Uncaught TypeError: cannot read property 'id' of null"` (Find the root cause)
2. Once RCA is acquired, run `/01-Task 009 "Fix Login null ID"`
3. Run in order `/02-Plan` -> `/03-Code` -> `/04-Verify`

### Scenario 3: Need to explore the codebase before starting a task
1. `/09-Research "How is authentication handled in this project?"`
2. AI will summarize relevant files and their operational sequence in the research folder.

### Scenario 4: Reviewing work and providing Feedback/Reject
1. After AI completes `/04-Verify 010` and the task is in `human_review` status.
2. Human reviews the code and finds a modification point: `/10-Human Feedback 010 "Change the variable name from data to userData to be more descriptive"`
3. Or if the work has major errors: `/10-Human Reject 010 "Tax calculation logic is incorrect, please double-check the implementation plan"`
4. Once work has been fixed and proven satisfactory: `/10-Human Approve 010` (Task switches to `done`)

#### 📊 Comparison Table: Feedback vs Reject

| Comparison Factor | 🟡 Feedback (Recommend) | 🔴 Reject (Deny) |
| :--- | :--- | :--- |
| **Meaning** | Work "passes" but needs improvement/polish | Work "failed" due to mistakes or misses criteria |
| **Severity** | Low - Tuning style or aesthetics | High - Related to correctness (Correctness/Logic) |
| **Recording** | Logged under `## Feedback History` in QA Report | Logged under `## Rejection History` along with Action Items |
| **Affect on Agent** | Learns human stylistic preferences | Acknowledges failure and pays extra attention during re-planning |
| **Example** | "Rename variable", "Add a comment here" | "Crashes on run", "Calculates digits incorrectly", "Differs from Spec" |

#### 📈 Quality Analysis
We use statistics from these commands to improve the efficiency of the team and Agent:
*   **If the number of Rejects is high**: Suggests **"Poor planning"** or **"Agent did not understand prompt"**. Return to the `/01-Task` and `/02-Plan` phases more rigorously.
*   **If the number of Feedback is high**: Suggests **"High attention to detail"** by the reviewer, or **"Coding Styles"** where AI hasn't matched human preference. Record lessons in [`.auto-claude/lessons.md`](../.auto-claude/lessons.md) (Reference template from [`.cursor/PRPs/templates/lessons.template.md`](../.cursor/PRPs/templates/lessons.template.md))

---

## 📂 Internal Folder Structure
- `*.md`: Main command/workflow files that appear when typing `/` into the chat box.
- All commands here act as an **Orchestrator** to call Specialized Agents in the `agents/` folder (within your active IDE's root folder).

---

## 🔄 Multi-IDE Support (IDE Switcher)
This framework supports multiple AI IDEs. You can switch the folder structure and internal links using the `active-ide.py` script at the project root.

| IDE | Root Folder | Command Folder | Rule File |
| :--- | :--- | :--- | :--- |
| **Cursor** | `.cursor/` | `commands/` | `.cursorrules` |
| **Windsurf** | `.windsurf/` | `workflows/` | `.windsurfrules` |
| **Antigravity** | `.agent/` | `workflows/` | `.agentrules` |

**How to switch:**
- **Interactive:** `python active-ide.py`
- **Arguments:** `python active-ide.py --cursor` | `--windsurf` | `--antigravity`



---

---

## 📂 Directory & Storage Map

To ensure systematic and traceable processes, data is stored in the `.auto-claude/` folder, delineated by task types:

| Data Type | Storage Folder | Creation Command | Description |
| :--- | :--- | :--- | :--- |
| **Tasks (Active)** | `.auto-claude/specs/` | `/01-Task` | Stores ongoing jobs (JSON, Markdown) |
| **Issue Staging** | `.auto-claude/issues/` | `/01-Task` | Stores tasks waiting to be imported or semi-finished tasks |
| **Product Needs** | `.auto-claude/prds/` | `/05-PRD` | Strategic/Idea level requirements documents |
| **Root Causas** | `.auto-claude/debug/` | `/06-Debug` | Bug Root Cause Analysis (RCA) records |
| **Research Logs** | `.auto-claude/research/` | `/09-Research` | Knowledge records from exploring code or technologies |
| **Lessons Learned** | `.auto-claude/lessons.md` | `/10-Human` | Record of lessons and coding styles preferred by humans |
| **Agent Reports** | `.auto-claude/reports/` | `/11-Agent` | Progress reports generated by specialized experts |
| **Templates** | `PRPs/templates/` | `Internal` | Data structure prototype files (within IDE root) |

---

## 💡 How to use effectively
1. **Always use an ID number**: So the Agent can accurately access data in `.auto-claude/specs/`.
2. **Sequential Flow**: Run in numeric order to maintain Context of the task.
3. **Review Output**: Every time the AI finishes a task, open the file in the task folder to review the progress.

---
*Generated by Antigravity AI for PRPs-Framework*
