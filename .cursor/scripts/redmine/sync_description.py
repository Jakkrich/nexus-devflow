import os
import argparse
from dotenv import load_dotenv
from redminelib import Redmine
from redminelib.exceptions import AuthError, ResourceNotFoundError, ForbiddenError
from core_utils import validate_and_run

def md_to_redmine(text):
    import re
    # Headers: # Heading -> h1. Heading (Adding blank lines before and AFTER as requested)
    text = re.sub(r'\n+# (.*)', r'\n\nh1. \1\n', text)
    text = re.sub(r'\n+## (.*)', r'\n\nh2. \1\n', text)
    text = re.sub(r'\n+### (.*)', r'\n\nh3. \1\n', text)
    
    # Handle the case where a header is at the very first line
    text = re.sub(r'^# (.*)', r'h1. \1\n', text)
    text = re.sub(r'^## (.*)', r'h2. \1\n', text)
    text = re.sub(r'^### (.*)', r'h3. \1\n', text)
    
    # Bold: **text** -> *text*
    text = re.sub(r'\*\*(.*?)\*\*', r'*ิ \1*', text)
    
    # Lists: - item -> * item
    text = re.sub(r'^- (.*)', r'* \1', text, flags=re.MULTILINE)
    
    # Code blocks: ``` -> <pre>
    text = re.sub(r'```.*?\n(.*?)\n```', r'<pre>\n\1\n</pre>', text, flags=re.DOTALL)
    
    return text

def update_issue_description(redmine, issue, file_path):
    try:
        if not os.path.exists(file_path):
            print(f"ERROR: File {file_path} not found.")
            return

        print(f"Reading content from {file_path}...")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Convert MD to Redmine Wiki syntax
        new_description = md_to_redmine(content)

        # Update the issue description
        issue.save(description=new_description)
        
        print(f"SUCCESS: Description of Issue #{issue.id} has been updated using {file_path}")
        
    except Exception as e:
        print(f"ERROR: Failed to update description for issue #{issue.id}: {e}")

def main():
    load_dotenv()
    
    url = os.getenv('REDMINE_URL', 'https://mobileapp.nstda.or.th/redmine/')
    api_key = os.getenv('REDMINE_API_KEY')
    
    if not api_key:
        print("ERROR: REDMINE_API_KEY not found in .env")
        return

    parser = argparse.ArgumentParser(description="Update Redmine issue description with content from a file (e.g., spec.md).")
    parser.add_argument("issue_id", type=int, help="The ID of the Redmine issue to update.")
    parser.add_argument("file_path", type=str, help="Path to the file containing the new description.")
    args = parser.parse_args()

    try:
        redmine = Redmine(url, key=api_key)
        # Use safety wrapper
        validate_and_run(redmine, args.issue_id, update_issue_description, args.file_path)
            
    except AuthError:
        print("ERROR: Authentication failed. Please check your REDMINE_API_KEY in .env")
    except ForbiddenError:
        print("ERROR: No permission to access this resource or perform this action.")
    except Exception as e:
        print(f"ERROR: Unexpected error: {e}")

if __name__ == "__main__":
    main()
