#!/usr/bin/env python3
import os
import shutil
import json
import sys
from pathlib import Path
import subprocess

AGENT_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = Path(os.environ.get("PRP_TEST_PROJECT_ROOT", AGENT_DIR / ".test-workspace")).resolve()
SCHEMA_DIR = AGENT_DIR / "resources" / "schemas"

def run_cmd(cmd):
    print(f"Running: {cmd}")
    env = os.environ.copy()
    env["PRP_PROJECT_ROOT"] = str(PROJECT_ROOT)
    env["PRP_AGENT_DIR"] = str(AGENT_DIR)
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=PROJECT_ROOT, env=env)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        raise AssertionError(f"Command failed: {cmd}")
    return result.stdout

def test_prp_tools():
    PROJECT_ROOT.mkdir(parents=True, exist_ok=True)
    test_id = "999"
    test_slug = "test-task"
    task_dir = PROJECT_ROOT / f".workspaces/specs/{test_id}-{test_slug}"

    # 1. Cleanup
    if task_dir.exists():
        shutil.rmtree(task_dir)

    # 2. Init
    runner = f'"{sys.executable}" "{AGENT_DIR / "scripts" / "prp_task_tool.py"}"'

    run_cmd(f'{runner} init {test_id} "Integration Test" {test_slug}')

    # 3. Verify Files exist
    files = [
        "task_metadata.json",
        "implementation_plan.json",
        "requirements.json",
        "task_logs.json",
        "context.json",
        "complexity_assessment.json",
        "spec.md",
    ]
    for f in files:
        f_path = task_dir / f
        assert f_path.exists(), f"File {f} was not created!"
        print(f"[OK] {f} created.")

    # 4. Verify Completeness vs Templates
    templates = {
        "task_metadata.json": "task_metadata.template.json",
        "implementation_plan.json": "implementation_plan.template.json",
        "task_logs.json": "task_logs.template.json",
        "requirements.json": "requirements.template.json",
        "context.json": "context.template.json",
        "complexity_assessment.json": "complexity_assessment.template.json",
    }

    for json_file, template_name in templates.items():
        with open(task_dir / json_file, 'r', encoding='utf-8') as f:
            generated = json.load(f)
        with open(SCHEMA_DIR / template_name, 'r', encoding='utf-8') as f:
            template = json.load(f)
        
        # Check if all top-level keys from template are in generated
        for key in template.keys():
            assert key in generated, f"Key '{key}' missing in {json_file}!"
        
        print(f"[OK] {json_file} is complete vs {template_name}")

    # 5. Test Update
    run_cmd(f"{runner} update {test_id} --status coding")
    with open(task_dir / "implementation_plan.json", 'r', encoding='utf-8') as f:
        plan = json.load(f)
    assert plan["status"] == "coding", "Status update failed!"
    assert plan["planStatus"] == "planning", "Unknown status should preserve planStatus!"
    print("[OK] Status update verified.")

    run_cmd(f"{runner} update {test_id} --status in_progress")
    with open(task_dir / "implementation_plan.json", 'r', encoding='utf-8') as f:
        plan = json.load(f)
    assert plan["planStatus"] == "approved", "planStatus mapping failed!"
    assert plan["xstateState"] == "coding", "xstateState mapping failed!"
    print("[OK] Dashboard status mapping verified.")

    # 6. Test Log
    run_cmd(f'{runner} log {test_id} "Testing log entry"')
    with open(task_dir / "task_logs.json", 'r', encoding='utf-8') as f:
        logs = json.load(f)
    assert any("Testing log entry" in entry for entry in logs["coding"]["logs"]), "Logging failed!"
    print("[OK] Log entry verified.")

    # 7. Test validate
    run_cmd(f"{runner} validate {test_id}")
    print("[OK] Schema validation passed.")

    # 8. Test Dashboard
    output = run_cmd(f'"{sys.executable}" "{AGENT_DIR / "scripts" / "prp_status.py"}"')
    assert test_id in output, "Task not found in dashboard output!"
    print("[OK] Dashboard verification passed.")

    print("\nALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_prp_tools()
