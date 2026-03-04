# 🔴 Redmine Integration Scripts

A set of scripts to allow the AI Agent to connect with the Redmine API and act as a **Redmine Specialist Agent**.

## 🛠 Prerequisites
- Python 3.10+
- `pip install -r requirements.txt`

## 🔑 Configuration
Copy the `.env.example` file to `.env` and specify the details:
- `REDMINE_URL`: URL of the Redmine system
- `REDMINE_API_KEY`: Personal API Key (obtainable from My Account in Redmine)

## 📋 Available Commands
| Script | Description |
| :--- | :--- |
| `get_issue.py` | Fetch Issue data (ID, Subject, Description, Notes) |
| `search_issues.py` | Search for Issues (Title, assigned_to, author) |
| `update_issue_note.py` | Add Note/Comment to an Issue |
| `sync_description.py` | Sync `spec.md` to Redmine Description |
| `upload_to_issue.py` | Attach files to an Issue (e.g., QA Reports) |
| `get_my_context.py` | Check the User's permissions and assigned tasks |

## 🛡 Security Rules
- The scripts will only allow modifications to Issues where the User is the **Author** or **Assignee** to prevent accidental modifications to others' work.
