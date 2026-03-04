import os
from dotenv import load_dotenv
from redminelib import Redmine
from redminelib.exceptions import AuthError, ForbiddenError
from core_utils import get_current_user

def main():
    load_dotenv()
    
    url = os.getenv('REDMINE_URL', 'https://mobileapp.nstda.or.th/redmine/')
    api_key = os.getenv('REDMINE_API_KEY')
    
    if not api_key:
        print("ERROR: REDMINE_API_KEY not found in .env")
        return

    try:
        redmine = Redmine(url, key=api_key)
        user = get_current_user(redmine)
        
        if user:
            print("-" * 40)
            print(f"👤 User Profile: {user.firstname} {user.lastname}")
            print(f"🆔 ID: {user.id}")
            print(f"📧 Email: {user.mail}")
            print(f"🔑 API Key Status: Active")
            print("-" * 40)
            
            # Additional info if available
            if hasattr(user, 'groups'):
                print(f"👥 Groups: {', '.join([g.name for g in user.groups])}")
            if hasattr(user, 'projects'):
                print(f"📂 Projects Member: {len(user.projects)}")
        
    except AuthError:
        print("ERROR: Authentication failed. Please check your REDMINE_API_KEY in .env")
    except ForbiddenError:
        print("ERROR: No permission to fetch user profile.")
    except Exception as e:
        print(f"ERROR: Unexpected error: {e}")

if __name__ == "__main__":
    main()
