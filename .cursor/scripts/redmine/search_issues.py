import os
import argparse
from dotenv import load_dotenv
from redminelib import Redmine
from redminelib.exceptions import AuthError, ResourceNotFoundError, ForbiddenError

def search_my_issues(redmine, query=None, status='*'):
    try:
        # Get 'me' user ID to filter
        me = redmine.user.get('current')
        print(f"Searching issues for: {me.firstname} {me.lastname} (ID: {me.id}) | Status: {status}")
        
        results = []
        
        # 1. Assigned to me
        assigned_issues = redmine.issue.filter(assigned_to_id='me', status_id=status)
        results.extend(list(assigned_issues))
        
        # 2. Reported by me
        reported_issues = redmine.issue.filter(author_id='me', status_id=status)
        results.extend(list(reported_issues))
        
        # De-duplicate by issue id
        unique_issues = {issue.id: issue for issue in results}
        
        # Filter by query if provided
        final_list = []
        if query:
            q = query.lower()
            for issue_id, issue in unique_issues.items():
                # Match by ID or Subject
                if q in str(issue_id) or q in issue.subject.lower():
                    final_list.append(issue)
        else:
            final_list = list(unique_issues.values())

        # Sort by updated_on descending
        final_list.sort(key=lambda x: x.updated_on, reverse=True)

        if not final_list:
            print(f"INFO: No matching issues found for query: '{query if query else 'All'}' with status: '{status}'")
            return

        print(f"SUCCESS: Found {len(final_list)} matching issues:")
        print("-" * 80)
        print(f"{'ID':<8} | {'Status':<12} | {'Subject'}")
        print("-" * 80)
        for issue in final_list:
            subject = issue.subject[:60] + "..." if len(issue.subject) > 60 else issue.subject
            print(f"{issue.id:<8} | {issue.status.name:<12} | {subject}")
            
    except AuthError:
        print("ERROR: Authentication failed. Please check your REDMINE_API_KEY in .env")
    except ForbiddenError:
        print("ERROR: No permission to access this resource.")
    except Exception as e:
        print(f"ERROR: Unexpected error: {e}")

def main():
    load_dotenv()
    
    url = os.getenv('REDMINE_URL', 'https://mobileapp.nstda.or.th/redmine/')
    api_key = os.getenv('REDMINE_API_KEY')
    
    if not api_key:
        print("ERROR: REDMINE_API_KEY not found in .env")
        return

    parser = argparse.ArgumentParser(description="Search for Redmine issues assigned to or reported by current user.")
    parser.add_argument("query", type=str, nargs='?', default=None, help="The search term (ID or Subject).")
    parser.add_argument("--status", "-s", type=str, default="*", help="Status ID (e.g., 'open', 'closed', '1', '5') or '*' for all. Default is '*'")
    args = parser.parse_args()

    try:
        redmine = Redmine(url, key=api_key)
        search_my_issues(redmine, args.query, args.status)
            
    except AuthError:
        print("ERROR: Authentication failed. Please check your REDMINE_API_KEY in .env")
    except ForbiddenError:
        print("ERROR: No permission to access this resource.")
    except Exception as e:
        print(f"ERROR: Unexpected error: {e}")

if __name__ == "__main__":
    main()
