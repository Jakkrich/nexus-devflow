#!/usr/bin/env python3
import sys
import argparse
import re
from pathlib import Path
from prp_core import (
    SPECS_DIR, get_timestamp, read_json, write_json, 
    get_template, get_text_template, normalize_to_template, validate_against_template, ensure_dirs
)

PLAN_STATUS_MAP = {
    "backlog": ("pending", "backlog"),
    "queue": ("approved", "planning"),
    "planning": ("planning", "planning"),
    "in_progress": ("approved", "coding"),
    "ai_review": ("review", "qa_review"),
    "human_review": ("review", "human_review"),
    "done": ("done", "done"),
    "error": ("rejected", "validation"),
}

TEMPLATE_MANIFEST = {
    "task_metadata.json": "task_metadata.template.json",
    "implementation_plan.json": "implementation_plan.template.json",
    "requirements.json": "requirements.template.json",
    "task_logs.json": "task_logs.template.json",
    "context.json": "context.template.json",
    "complexity_assessment.json": "complexity_assessment.template.json",
}

def materialize(template_name, replacements=None):
    data = get_template(template_name)
    replacements = replacements or {}
    return replace_placeholders(data, replacements)

def materialize_text(template_name, replacements=None):
    text = get_text_template(template_name)
    replacements = replacements or {}
    for key, replacement in replacements.items():
        text = text.replace("{" + key + "}", str(replacement))
    return text

def render_initial_spec(task_id, title, description):
    scope = description or title
    return f"""# Specification: {task_id} - {title}

## 1. Overview
- **Objective**: Deliver "{title}" according to the requested scope: {scope}
- **Business Value**: Turn the request into a tracked, testable task so planning, implementation, and verification can proceed without relying on an empty template.
- **Target Audience/Users**: The users, maintainers, or reviewers affected by "{title}" as described in the request. Refine the exact roles during clarification if the request does not name them.

## 2. Requirements & Acceptance Criteria
- [ ] Capture the concrete behavior, bug, or deliverable described by: {scope}
- [ ] Preserve existing behavior that is not explicitly part of this task.
- [ ] Add enough validation evidence for reviewers to confirm the task is complete.

## 3. Context & Background
- **Current State**: The current system needs work related to "{title}". Inspect the relevant code, docs, and artifacts before planning.
- **Problem Statement**: The request needs to be converted into an implementation-ready specification with clear behavior and verification.
- **Related Issues/Features**: No related issue was provided during task creation.

## 4. Technical Constraints & Assumptions
- **Constraints**: Follow the existing project architecture, coding conventions, and validation commands discovered during planning.
- **Assumptions**: Any missing product, UX, data, or integration detail must be clarified before implementation or recorded explicitly in the plan.

## 5. UI/UX Considerations (If applicable)
- **Design Guidelines**: Match existing UI patterns when the task affects user-facing screens.
- **Interactions**: Preserve current interaction behavior unless the request explicitly changes it.

## 6. Out of Scope
- Changes unrelated to "{title}" are out of scope unless the user approves them as follow-up work.
"""

def markdown_headings(text):
    return [line.strip() for line in text.splitlines() if re.match(r"^#{2,6}\s+", line.strip())]

def markdown_quality_issues(text):
    body = re.sub(r"```[\s\S]*?```", "", text)
    checks = [
        ("bracketed template instruction", re.compile(r"\[[^\]\n]*(?:what|why|who|describe|detailed|condition|link|benefit|drawback|example|e\.g\.|missing|coverage|will implement|out of scope)[^\]\n]*\]", re.I)),
        ("unresolved brace placeholder", re.compile(r"\{[A-Za-z][A-Za-z0-9 _/#.-]{1,80}\}")),
        ("numbered requirement placeholder", re.compile(r"\b(?:Requirement\s+[12]|Acceptance Criterion\s+1|Option\s+[ABC]:\s*(?:\{Option Name\}|\[Name\]|Option Name)|Subtask Title)\b", re.I)),
        ("unfinished marker", re.compile(r"\b(?:TODO|TBD|FIXME|PLACEHOLDER)\b", re.I)),
    ]
    issues = []
    for label, pattern in checks:
        match = pattern.search(body)
        if match:
            issues.append(f"{label}: {match.group(0).strip()}")
    return issues

def validate_markdown(path, template_name):
    text = path.read_text(encoding="utf-8")
    template_headings = markdown_headings(get_text_template(template_name))
    file_headings = set(markdown_headings(text))
    missing = [heading for heading in template_headings if heading not in file_headings]
    return missing, markdown_quality_issues(text)

def replace_placeholders(value, replacements):
    if isinstance(value, dict):
        return {k: replace_placeholders(v, replacements) for k, v in value.items()}
    if isinstance(value, list):
        return [replace_placeholders(v, replacements) for v in value]
    if isinstance(value, str):
        for key, replacement in replacements.items():
            value = value.replace("{" + key + "}", str(replacement))
        return value
    return value

def find_task_dir(task_id):
    matches = sorted(SPECS_DIR.glob(f"{task_id}-*"))
    return matches[0] if matches else None

def normalize_file(path, template_name):
    normalized = normalize_to_template(read_json(path), get_template(template_name))
    write_json(path, normalized)
    return normalized

def sync_status(plan, status):
    plan["status"] = status
    plan_status, xstate_state = PLAN_STATUS_MAP.get(status, (plan.get("planStatus", "planning"), plan.get("xstateState", "planning")))
    plan["planStatus"] = plan_status
    plan["xstateState"] = xstate_state

def cmd_init(args):
    task_dir = SPECS_DIR / f"{args.id}-{args.slug}"
    if task_dir.exists() and not args.force:
        print(f"Error: Task directory {task_dir} already exists. Use --force to overwrite.")
        return

    ensure_dirs()
    task_dir.mkdir(parents=True, exist_ok=True)
    ts = get_timestamp()
    replacements = {
        "ID": args.id,
        "Title": args.title,
        "slug": args.slug,
        "Description": args.description or args.title,
        "Goal": args.description or args.title,
        "ISO_TIMESTAMP": ts,
    }

    # 1. task_metadata.json
    meta = materialize("task_metadata.template.json", replacements)
    meta["created_at"] = ts
    meta["updated_at"] = ts
    write_json(task_dir / "task_metadata.json", meta)

    # 2. implementation_plan.json
    plan = materialize("implementation_plan.template.json", replacements)
    plan["feature"] = f"{args.id}: {args.title}"
    plan["description"] = args.description or args.title
    plan["created_at"] = ts
    plan["updated_at"] = ts
    write_json(task_dir / "implementation_plan.json", plan)

    # 3. requirements.json
    reqs = materialize("requirements.template.json", replacements)
    write_json(task_dir / "requirements.json", reqs)

    # 4. task_logs.json
    logs = materialize("task_logs.template.json", replacements)
    logs["spec_id"] = f"{args.id}-{args.slug}"
    logs["created_at"] = ts
    logs["updated_at"] = ts
    write_json(task_dir / "task_logs.json", logs)

    # 5. Optional dashboard context files. These keep the dashboard contract stable
    # even before planning agents enrich the task.
    context = materialize("context.template.json", replacements)
    write_json(task_dir / "context.json", context)

    complexity = materialize("complexity_assessment.template.json", replacements)
    write_json(task_dir / "complexity_assessment.json", complexity)

    # 6. spec.md (created from Markdown template)
    spec_path = task_dir / "spec.md"
    if not spec_path.exists():
        spec_path.write_text(render_initial_spec(args.id, args.title, args.description or args.title), encoding="utf-8")

    print(f"Successfully initialized task {args.id} in {task_dir}")

def cmd_update(args):
    # Find directory by ID prefix
    task_dir = find_task_dir(args.id)
    if not task_dir:
        print(f"Error: Task with ID {args.id} not found in {SPECS_DIR}")
        return
    plan_path = task_dir / "implementation_plan.json"
    plan = normalize_file(plan_path, "implementation_plan.template.json")
    
    ts = get_timestamp()
    plan["updated_at"] = ts

    if args.status:
        sync_status(plan, args.status)
    
    if args.subtask and args.substatus:
        found = False
        for phase in plan.get("phases", []):
            for st in phase.get("subtasks", []):
                if st.get("id") == args.subtask:
                    st["status"] = args.substatus
                    found = True
                    break
            if found: break
        if not found:
            print(f"Warning: Subtask {args.subtask} not found.")

    write_json(plan_path, plan)
    print(f"Updated task {args.id} status.")

def cmd_log(args):
    task_dir = find_task_dir(args.id)
    if not task_dir:
        print(f"Error: Task with ID {args.id} not found.")
        return
    logs_path = task_dir / "task_logs.json"
    logs_data = normalize_file(logs_path, "task_logs.template.json")

    ts = get_timestamp()
    logs_data["updated_at"] = ts
    
    phase = args.phase or "coding" # Default to coding logs
    if phase in logs_data:
        if logs_data[phase].get("status") == "pending":
            logs_data[phase]["status"] = "active"
            logs_data[phase]["started_at"] = logs_data[phase].get("started_at") or ts
        logs_data[phase]["logs"].append(f"[{ts}] {args.message}")
        if args.complete:
            logs_data[phase]["status"] = "completed"
            logs_data[phase]["completed_at"] = ts
    else:
        # Fallback if phase not in template
        if "general_logs" not in logs_data: logs_data["general_logs"] = []
        logs_data["general_logs"].append(f"[{ts}] {args.message}")

    write_json(logs_path, logs_data)
    print(f"Logged activity for task {args.id}.")

def cmd_validate(args):
    task_dirs = [find_task_dir(args.id)] if args.id else sorted(p for p in SPECS_DIR.glob("*") if p.is_dir())
    task_dirs = [p for p in task_dirs if p]
    if not task_dirs:
        print("No task directories found.")
        return

    had_errors = False
    for task_dir in task_dirs:
        print(f"Validating {task_dir.name}")
        for filename, template_name in TEMPLATE_MANIFEST.items():
            path = task_dir / filename
            if not path.exists():
                had_errors = True
                print(f"  MISSING FILE: {filename}")
                if args.fix:
                    write_json(path, get_template(template_name))
                    print(f"  FIXED FILE: {filename}")
                continue

            missing = validate_against_template(path, template_name)
            if missing:
                had_errors = True
                print(f"  MISSING KEYS in {filename}: {', '.join(missing)}")
                if args.fix:
                    normalize_file(path, template_name)
                    print(f"  FIXED KEYS: {filename}")
            else:
                print(f"  OK: {filename}")

        spec_path = task_dir / "spec.md"
        if not spec_path.exists():
            had_errors = True
            print("  MISSING FILE: spec.md")
            if args.fix:
                task_id = task_dir.name.split("-", 1)[0]
                title = read_json(task_dir / "requirements.json").get("task_description") or task_dir.name
                spec_path.write_text(render_initial_spec(task_id, title, title), encoding="utf-8")
                print("  FIXED FILE: spec.md")
        else:
            missing_headings, quality_issues = validate_markdown(spec_path, "spec.template.md")
            if missing_headings or quality_issues:
                had_errors = True
                if missing_headings:
                    print(f"  MISSING HEADINGS in spec.md: {', '.join(missing_headings)}")
                for issue in quality_issues:
                    print(f"  PLACEHOLDER TEXT in spec.md: {issue}")
            else:
                print("  OK: spec.md")

    if had_errors and not args.fix:
        raise SystemExit(1)

def main():
    parser = argparse.ArgumentParser(description="PRP Task Management Tool")
    subparsers = parser.add_subparsers(dest="command", help="Sub-commands")

    # Init
    p_init = subparsers.add_parser("init", help="Initialize a new task")
    p_init.add_argument("id", help="Task ID (e.g., 001)")
    p_init.add_argument("title", help="Task Title")
    p_init.add_argument("slug", help="Task Slug (kebab-case)")
    p_init.add_argument("description", nargs="?", help="Task description")
    p_init.add_argument("--force", action="store_true", help="Overwrite existing task")

    # Update
    p_upd = subparsers.add_parser("update", help="Update task status")
    p_upd.add_argument("id", help="Task ID")
    p_upd.add_argument("--status", help="Overall task status")
    p_upd.add_argument("--subtask", help="Subtask ID (e.g., 1.1)")
    p_upd.add_argument("--substatus", help="Subtask status (e.g., completed)")

    # Log
    p_log = subparsers.add_parser("log", help="Log task activity")
    p_log.add_argument("id", help="Task ID")
    p_log.add_argument("message", help="Log message")
    p_log.add_argument("--phase", choices=["planning", "coding", "validation"], help="Phase to log into")
    p_log.add_argument("--complete", action="store_true", help="Mark the phase completed after writing the log")

    # Validate
    p_val = subparsers.add_parser("validate", help="Validate dashboard JSON files against templates")
    p_val.add_argument("id", nargs="?", help="Optional task ID")
    p_val.add_argument("--fix", action="store_true", help="Fill missing files and keys from templates")

    args = parser.parse_args()
    if args.command == "init":
        cmd_init(args)
    elif args.command == "update":
        cmd_update(args)
    elif args.command == "log":
        cmd_log(args)
    elif args.command == "validate":
        cmd_validate(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
