import os
import argparse
from dotenv import load_dotenv
from redminelib import Redmine
from redminelib.exceptions import AuthError, ResourceNotFoundError, ForbiddenError
from core_utils import validate_and_run

def save_issue_to_md(redmine, issue, target_path=None):
    try:
        issue_id = issue.id
        # Build path relative to project root
        # Script is in .cursor/scripts/redmine/, so root is ../../../
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.abspath(os.path.join(script_dir, "..", "..", ".."))
        
        if target_path:
            # Use provided target path (relative to project root)
            folder_name = os.path.join(project_root, target_path, str(issue_id))
        else:
            # Default: .auto-claude/issues/{issue_id}
            folder_name = os.path.join(project_root, ".auto-claude", "issues", str(issue_id))
        os.makedirs(folder_name, exist_ok=True)
        
        # Define markdown file path
        md_file_path = os.path.join(folder_name, f"issue_{issue_id}.md")
        
        # Build markdown content
        md_content = f"# Issue #{issue.id}: {issue.subject}\n\n"
        md_content += f"**Project:** {issue.project.name}\n"
        md_content += f"**Status:** {issue.status.name}\n"
        md_content += f"**Priority:** {issue.priority.name}\n"
        md_content += f"**Author:** {issue.author.name}\n"
        md_content += f"**Assigned to:** {getattr(issue, 'assigned_to', 'None')}\n"
        md_content += f"**Created on:** {issue.created_on}\n"
        md_content += f"**Updated on:** {issue.updated_on}\n\n"
        md_content += "## Description\n\n"
        md_content += f"{getattr(issue, 'description', 'No description provided.')}\n\n"
        
        # Handle attachments
        if hasattr(issue, 'attachments') and issue.attachments:
            md_content += "## Attachments\n\n"
            attachments_dir = os.path.join(folder_name, "attachments")
            os.makedirs(attachments_dir, exist_ok=True)
            
            for attachment in issue.attachments:
                print(f"Downloading attachment: {attachment.filename}...")
                save_path = os.path.join(attachments_dir, attachment.filename)
                attachment.download(savepath=attachments_dir, filename=attachment.filename)
                md_content += f"- [{attachment.filename}](attachments/{attachment.filename})\n"
        
        # Save to markdown file
        with open(md_file_path, "w", encoding="utf-8") as f:
            f.write(md_content)
            
        print(f"SUCCESS: Issue #{issue_id} saved to {md_file_path}")
        
    except Exception as e:
        print(f"ERROR: Failed to process issue #{issue.id}: {e}")

def main():
    load_dotenv()
    
    url = os.getenv('REDMINE_URL', 'https://mobileapp.nstda.or.th/redmine/')
    api_key = os.getenv('REDMINE_API_KEY')
    
    if not api_key:
        print("ERROR: REDMINE_API_KEY not found in .env")
        return

    parser = argparse.ArgumentParser(description="Fetch Redmine issue and save as Markdown with attachments.")
    parser.add_argument("issue_id", type=int, help="The ID of the Redmine issue to fetch.")
    parser.add_argument("--target-path", type=str, help="Target path relative to project root (e.g., 'extra-addons/nstda_crm/.auto-claude/issues')")
    args = parser.parse_args()

    try:
        redmine = Redmine(url, key=api_key)
        # Use safety wrapper with target_path
        def save_with_path(redmine, issue):
            return save_issue_to_md(redmine, issue, args.target_path)
        validate_and_run(redmine, args.issue_id, save_with_path)
            
    except AuthError:
        print("ERROR: Authentication failed. Please check your REDMINE_API_KEY in .env")
    except ForbiddenError:
        print("ERROR: No permission to access this resource or perform this action.")
    except Exception as e:
        print(f"ERROR: Unexpected error: {e}")

if __name__ == "__main__":
    main()
