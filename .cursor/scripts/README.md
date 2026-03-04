# 📜 Specialist Scripts

This folder contains external supplementary scripts that help Agents interact with other systems (Specialist Tools).

---

## 📁 Folder Structure

### [redmine/](./redmine/)
A set of commands for connecting to the **Redmine** system to help Agents read and write Issues directly.
- `get_issue.py`: Fetch Issue details
- `search_issues.py`: Search for Issues based on conditions
- `update_issue_note.py`: Add a Note or log progress to an Issue
- `sync_description.py`: Sync data from `spec.md` back to the Redmine Description
- `upload_to_issue.py`: Upload documents or QA evidence proofs to the system

---

## 🛠 Usage Guide (For Developers)

These scripts are designed for Agents to call via `run_command`, but if you want to run them manually:

1. **Setup Environment**:
   ```powershell
   cd .cursor/scripts/redmine
   pip install -r requirements.txt
   ```

2. **Configuration**:
   Copy the `.env.example` file to `.env` and configure the API Key for Redmine.

---

## 🤖 For Agents
Agents will detect these supplementary Tools and automatically use them when given a task related to "Redmine" or "Issue Tracking".
