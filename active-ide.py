import os
import shutil
import sys
import argparse
from pathlib import Path

# IDE Configuration Registry
IDEs = {
    "cursor": {
        "name": "Cursor",
        "root": ".cursor",
        "rule_file": ".cursorrules",
        "sub_dirs": {
            "workflows": "commands",
            "rules": "rules-templates"
        }
    },
    "antigravity": {
        "name": "Antigravity/Agent",
        "root": ".agent",
        "rule_file": ".agentrules",
        "sub_dirs": {
            "workflows": "workflows",
            "rules": "rules-templates" # Keep as rules-templates as requested before for Antigravity
        }
    },
    "windsurf": {
        "name": "Windsurf",
        "root": ".windsurf",
        "rule_file": ".windsurfrules",
        "sub_dirs": {
            "workflows": "workflows",
            "rules": "rules" # Windsurf native expects '.windsurf/rules'
        }
    }
}

EXTENSIONS = [".md", ".ps1", ".sh", ".json", ".txt"]

def detect_current_ide():
    for key, config in IDEs.items():
        if Path(config["root"]).exists():
            return key
    return None

def get_replacements(source_key, target_key):
    s = IDEs[source_key]
    t = IDEs[target_key]
    
    replacements = {
        f"{s['root']}/{s['sub_dirs']['workflows']}/": f"{t['root']}/{t['sub_dirs']['workflows']}/",
        f"{s['root']}/{s['sub_dirs']['rules']}/": f"{t['root']}/{t['sub_dirs']['rules']}/",
        f"{s['root']}/": f"{t['root']}/",
        s["rule_file"]: t["rule_file"],
        s["root"].replace("/", "\\"): t["root"].replace("/", "\\")
    }
    return replacements

def switch_ide(target_key):
    source_key = detect_current_ide()
    target = IDEs[target_key]
    
    if source_key == target_key:
        print(f"✨ Already in {target['name']} mode.")
        return

    print(f"\n🚀 Switching structure to {target['name']}...")
    
    # If no current IDE detected, we assume default source is Cursor for mappings 
    # but practically we would just try to rename whatever is there.
    # However, to be safe, if source is Unknown, we skip link replacement.
    if source_key:
        replacements = get_replacements(source_key, target_key)
        source = IDEs[source_key]
        
        # 1. Internal content replacements
        print("📝 Updating internal links in files...")
        root = Path(".")
        for ext in EXTENSIONS:
            for file_path in root.rglob(f"*{ext}"):
                if ".git" in str(file_path) or "active-ide.py" in str(file_path): continue
                try:
                    content = file_path.read_text(encoding="utf-8")
                    new_content = content
                    for old, new in replacements.items():
                        new_content = new_content.replace(old, new)
                    
                    if new_content != content:
                        file_path.write_text(new_content, encoding="utf-8")
                        print(f"   ✅ Updated: {file_path}")
                except Exception: pass

        # 2. Sub-folders rename
        s_workflow = Path(source["root"]) / source["sub_dirs"]["workflows"]
        t_workflow = Path(source["root"]) / target["sub_dirs"]["workflows"]
        if s_workflow.exists() and source["sub_dirs"]["workflows"] != target["sub_dirs"]["workflows"]:
            if t_workflow.exists(): shutil.rmtree(t_workflow)
            s_workflow.rename(t_workflow)
            print(f"   📂 Sub-folder: {source['sub_dirs']['workflows']} -> {target['sub_dirs']['workflows']}")

        s_rules = Path(source["root"]) / source["sub_dirs"]["rules"]
        t_rules = Path(source["root"]) / target["sub_dirs"]["rules"]
        if s_rules.exists() and source["sub_dirs"]["rules"] != target["sub_dirs"]["rules"]:
            if t_rules.exists(): shutil.rmtree(t_rules)
            s_rules.rename(t_rules)
            print(f"   📂 Sub-folder: {source['sub_dirs']['rules']} -> {target['sub_dirs']['rules']}")

        # 3. Root files rename
        s_file = Path(source["rule_file"])
        t_file = Path(target["rule_file"])
        if s_file.exists():
            if t_file.exists(): t_file.unlink()
            s_file.rename(t_file)
            print(f"   📄 Rule file: {source['rule_file']} -> {target['rule_file']}")

        # 4. Root folder rename
        s_root = Path(source["root"])
        t_root = Path(target["root"])
        if s_root.exists():
            if t_root.exists(): shutil.rmtree(t_root)
            s_root.rename(t_root)
            print(f"   📁 Root folder: {source['root']} -> {target['root']}")

    print(f"\n✨ Done! Switched to {target['name']}.")

def main():
    parser = argparse.ArgumentParser(description="PRPs-Framework IDE Switcher")
    parser.add_argument("--cursor", action="store_true")
    parser.add_argument("--antigravity", action="store_true")
    parser.add_argument("--windsurf", action="store_true")

    args = parser.parse_args()

    if args.cursor: switch_ide("cursor")
    elif args.antigravity: switch_ide("antigravity")
    elif args.windsurf: switch_ide("windsurf")
    else:
        current = detect_current_ide()
        print("\n--- PRPs-Framework IDE Switcher ---")
        print(f"Current mode: {IDEs[current]['name'] if current else 'Unknown'}")
        print("-" * 35)
        print("[1] Antigravity (.agent)")
        print("[2] Cursor (.cursor)")
        print("[3] Windsurf (.windsurf)")
        print("[Q] Quit")
        
        choice = input("\nSelect an option: ").strip().lower()
        if choice == '1': switch_ide("antigravity")
        elif choice == '2': switch_ide("cursor")
        elif choice == '3': switch_ide("windsurf")
        elif choice == 'q': print("Exit.")

if __name__ == "__main__":
    main()
