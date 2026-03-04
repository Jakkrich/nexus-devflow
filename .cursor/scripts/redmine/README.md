# 🔴 Redmine Integration Scripts (Specialist Tools)

A set of specialized scripts that empower AI Agents to interact with the **Redmine** project management system. These tools bridge the gap between local development cycles (PRPs) and corporate issue tracking.

---

## 🏗️ Getting Started

### 1. Prerequisites
- **Python 3.10+**
- Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```

### 2. Configuration
Create a `.env` file in this directory based on `.env.example`:
- `REDMINE_URL`: Your Redmine server URL (e.g., `https://redmine.yourcompany.com`)
- `REDMINE_API_KEY`: Your personal API Key (found under "My Account" in Redmine).

---

## 📋 Available Commands & Workflows

| Script | Purpose | AI Use Case |
| :--- | :--- | :--- |
| **`get_issue.py`** | Fetch Jira/Issue data. | Used during `/01-Task` to download requirements. |
| **`search_issues.py`**| Search issues. | Used to find related bugs or historical context. |
| **`update_issue_note.py`**| Log progress. | Automates status updates in Redmine after steps. |
| **`sync_description.py`**| Sync `spec.md`. | Keeps Redmine updated with the latest local Spec. |
| **`upload_to_issue.py`**| Attach proofs. | Uploads `qa_report.md` or screenshots as evidence. |
| **`get_my_context.py`**| User context. | Helps Agent identify who is currently working. |

---

## 🔄 Multi-IDE Environment Notice
These scripts are called using relative paths from the active IDE root. 
- If using **Cursor**: `.cursor/scripts/redmine/`
- If using **Antigravity**: `.agent/scripts/redmine/`
- If using **Windsurf**: `.windsurf/scripts/redmine/`

*The **`active-ide.py`** at the project root will automatically update internal framework references to these paths.*

---

## 🛡️ Operational Safeguards
- **Ownership Verification**: By default, agents are restricted to modifying issues where the user is either the **Author** or **Assignee**.
- **Human-in-the-loop**: High-impact actions (like bulk updates) should be reviewed by the developer via the console output.

---
*Powered by PRPs-Framework Integration Engine*
