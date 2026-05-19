#!/usr/bin/env python3
import os
import json
import datetime
import copy
from pathlib import Path
from typing import Dict, Any, List

def get_project_root() -> Path:
    """Finds the project root by looking for the .agent folder."""
    current = Path(os.getcwd()).resolve()
    for parent in [current] + list(current.parents):
        if (parent / ".agent").exists():
            return parent
    return current

PROJECT_ROOT = Path(os.environ["PRP_PROJECT_ROOT"]).resolve() if os.environ.get("PRP_PROJECT_ROOT") else get_project_root()
AGENT_DIR = Path(os.environ["PRP_AGENT_DIR"]).resolve() if os.environ.get("PRP_AGENT_DIR") else PROJECT_ROOT / ".agent"
WORKSPACE_DIR = PROJECT_ROOT / ".workspaces"
SPECS_DIR = WORKSPACE_DIR / "specs"
TEMPLATE_DIR = AGENT_DIR / "resources" / "schemas"

def ensure_dirs():
    """Ensure essential directories exist."""
    SPECS_DIR.mkdir(parents=True, exist_ok=True)

def get_timestamp() -> str:
    """Returns an ISO-8601 UTC timestamp for dashboard sorting."""
    return datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")

def read_json(path: Path) -> Dict[str, Any]:
    """Reads a JSON file safely."""
    if not path.exists():
        return {}
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {path}: {e}")
        return {}

def write_json(path: Path, data: Dict[str, Any]):
    """Writes a JSON file with pretty print."""
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
    except Exception as e:
        print(f"Error writing {path}: {e}")

def get_template(name: str) -> Dict[str, Any]:
    """Reads a template JSON."""
    template_path = TEMPLATE_DIR / name
    return read_json(template_path)

def get_text_template(name: str) -> str:
    """Reads a Markdown/text template."""
    return (TEMPLATE_DIR / name).read_text(encoding="utf-8")

def normalize_to_template(data: Any, template: Any) -> Any:
    """Return data with every key from template present, preserving real values."""
    if isinstance(template, dict):
        normalized = copy.deepcopy(data) if isinstance(data, dict) else {}
        for key, default_value in template.items():
            if key not in normalized or normalized[key] is None:
                normalized[key] = copy.deepcopy(default_value)
            else:
                normalized[key] = normalize_to_template(normalized[key], default_value)
        return normalized

    if isinstance(template, list):
        if not isinstance(data, list):
            return copy.deepcopy(template)
        if template and isinstance(template[0], dict):
            return [
                normalize_to_template(item, template[0]) if isinstance(item, dict) else item
                for item in data
            ]
        return data

    return data

def find_missing_keys(data: Any, template: Any, prefix: str = "") -> List[str]:
    """Find missing object keys compared with a template, including array items."""
    missing: List[str] = []
    if isinstance(template, dict):
        if not isinstance(data, dict):
            return [prefix or "<root>"]
        for key, default_value in template.items():
            path = f"{prefix}.{key}" if prefix else key
            if key not in data:
                missing.append(path)
            else:
                missing.extend(find_missing_keys(data[key], default_value, path))
    elif isinstance(template, list) and template and isinstance(template[0], dict):
        if isinstance(data, list):
            for index, item in enumerate(data):
                missing.extend(find_missing_keys(item, template[0], f"{prefix}[{index}]"))
        elif data is not None:
            missing.append(prefix)
    return missing

def validate_against_template(path: Path, template_name: str) -> List[str]:
    """Return missing-key errors for one JSON file."""
    return find_missing_keys(read_json(path), get_template(template_name))

def update_recursive(d: Dict[str, Any], u: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively updates a dictionary."""
    for k, v in u.items():
        if isinstance(v, dict) and k in d and isinstance(d[k], dict):
            d[k] = update_recursive(d[k], v)
        else:
            d[k] = v
    return d
