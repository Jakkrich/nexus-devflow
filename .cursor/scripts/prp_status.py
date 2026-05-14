#!/usr/bin/env python3
from pathlib import Path
from prp_core import SPECS_DIR, read_json

def show_status():
    if not SPECS_DIR.exists():
        print("No tasks found (.workspaces/specs does not exist).")
        return

    print("\n" + "="*50)
    print("      PRP PROJECT STATUS DASHBOARD")
    print("="*50)

    tasks = sorted(list(SPECS_DIR.iterdir()))
    if not tasks:
        print("No task folders found.")
        return

    print(f"{'ID':<6} | {'Status':<15} | {'Title'}")
    print("-" * 50)

    for task_dir in tasks:
        if not task_dir.is_dir(): continue
        
        plan_path = task_dir / "implementation_plan.json"
        if plan_path.exists():
            plan = read_json(plan_path)
            title = plan.get("feature", task_dir.name)
            status = plan.get("status", "unknown")
            task_id = task_dir.name.split("-")[0]
            print(f"{task_id:<6} | {status:<15} | {title}")
        else:
            print(f"{task_dir.name:<6} | {'No Plan':<15} | -")

    print("="*50 + "\n")

if __name__ == "__main__":
    show_status()
