import os
from redminelib.exceptions import AuthError, ForbiddenError, ResourceNotFoundError

def get_current_user(redmine):
    """Returns the current authenticated user object."""
    try:
        return redmine.user.get('current')
    except Exception as e:
        print(f"ERROR: Could not fetch current user: {e}")
        return None

def is_owner_or_assignee(redmine, issue_id, current_user_id=None):
    """
    Checks if the current user is either the author or the assignee of the issue.
    Returns (bool, issue_object, error_message)
    """
    try:
        if current_user_id is None:
            user = get_current_user(redmine)
            if not user:
                return False, None, "Could not identify current user."
            current_user_id = user.id

        issue = redmine.issue.get(issue_id)
        
        is_author = issue.author.id == current_user_id
        is_assignee = hasattr(issue, 'assigned_to') and issue.assigned_to.id == current_user_id
        
        if is_author or is_assignee:
            return True, issue, None
        else:
            return False, issue, f"Access Denied: You are neither the author nor the assignee of Issue #{issue_id}."
            
    except ResourceNotFoundError:
        return False, None, f"Issue #{issue_id} not found."
    except ForbiddenError:
        return False, None, f"Forbidden: You do not have permission to view Issue #{issue_id}."
    except Exception as e:
        return False, None, f"Unexpected error during ownership check: {e}"

def validate_and_run(redmine, issue_id, action_func, *args, **kwargs):
    """
    Utility wrapper to ensure safety before running an update action.
    """
    is_safe, issue, error = is_owner_or_assignee(redmine, issue_id)
    if not is_safe:
        print(f"ERROR: {error}")
        return False
    
    return action_func(redmine, issue, *args, **kwargs)
