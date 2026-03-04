import os
import argparse
from dotenv import load_dotenv
from redminelib import Redmine
from redminelib.exceptions import AuthError, ResourceNotFoundError, ForbiddenError
from core_utils import validate_and_run

def upload_file_to_issue(redmine, issue, file_path, description=""):
    try:
        if not os.path.exists(file_path):
            print(f"ERROR: File {file_path} not found.")
            return

        filename = os.path.basename(file_path)
        print(f"Uploading {filename} to Redmine...")
        
        # 1. Upload the file to Redmine server first
        upload = redmine.upload(file_path)
        
        # 2. Attach the uploaded file to the issue
        issue.save(
            uploads=[{
                'token': upload['token'],
                'filename': filename,
                'description': description
            }]
        )
        
        print(f"SUCCESS: File {filename} attached to Issue #{issue.id}")
        
    except Exception as e:
        print(f"ERROR: Failed to upload file to issue #{issue.id}: {e}")

def main():
    load_dotenv()
    
    url = os.getenv('REDMINE_URL', 'https://mobileapp.nstda.or.th/redmine/')
    api_key = os.getenv('REDMINE_API_KEY')
    
    if not api_key:
        print("ERROR: REDMINE_API_KEY not found in .env")
        return

    parser = argparse.ArgumentParser(description="Upload a file and attach it to a Redmine issue.")
    parser.add_argument("issue_id", type=int, help="The ID of the Redmine issue.")
    parser.add_argument("file_path", type=str, help="Path to the file to upload.")
    parser.add_argument("--desc", type=str, default="", help="Optional description for the file.")
    args = parser.parse_args()

    try:
        redmine = Redmine(url, key=api_key)
        # Use safety wrapper
        validate_and_run(redmine, args.issue_id, upload_file_to_issue, args.file_path, args.desc)
            
    except AuthError:
        print("ERROR: Authentication failed. Please check your REDMINE_API_KEY in .env")
    except ForbiddenError:
        print("ERROR: No permission to access this resource or perform this action.")
    except Exception as e:
        print(f"ERROR: Unexpected error: {e}")

if __name__ == "__main__":
    main()
