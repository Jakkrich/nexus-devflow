import os
import shutil
from pathlib import Path

# Configuration (Reverse)
MAPPINGS = {
    "dirs": [
        (".agent/workflows", ".agent/commands"),
        (".agent/rules", ".agent/rules-templates"),
    ],
    "root_dirs": [
        (".agent", ".cursor"),
    ],
    "files": [
        (".agentrules", ".cursorrules"),
    ],
    "replacements": {
        ".agent/workflows/": ".cursor/commands/",
        ".agent/rules/": ".cursor/rules-templates/",
        ".agent/": ".cursor/",
        ".agentrules": ".cursorrules",
        "\\.agent\\": "\\.cursor\\",
    },
    "extensions": [".md", ".ps1", ".sh", ".json", ".txt"]
}

def revert():
    root = Path(".")
    
    print("\n🔄 Reverting to Cursor structure...")

    # 1. Internal content replacements
    print("📝 Restoring internal links in files...")
    for ext in MAPPINGS["extensions"]:
        for file_path in root.rglob(f"*{ext}"):
            if ".git" in str(file_path): continue
            try:
                content = file_path.read_text(encoding="utf-8")
                new_content = content
                for old, new in MAPPINGS["replacements"].items():
                    new_content = new_content.replace(old, new)
                
                if new_content != content:
                    file_path.write_text(new_content, encoding="utf-8")
                    print(f"   ✅ Restored: {file_path}")
            except Exception as e:
                pass # Silent fail for binary or restricted files

    # 2. Rename internal sub-folders
    for old, new in MAPPINGS["dirs"]:
        old_path, new_path = root / old, root / new
        if old_path.exists():
            if new_path.exists(): 
                shutil.rmtree(new_path)
            old_path.rename(new_path)
            print(f"   📂 Restored sub-folder: {old} -> {new}")

    # 3. Rename root files
    for old, new in MAPPINGS["files"]:
        old_path, new_path = root / old, root / new
        if old_path.exists():
            if new_path.exists():
                new_path.unlink()
            old_path.rename(new_path)
            print(f"   📄 Restored file: {old} -> {new}")

    # 4. Rename root folders
    for old, new in MAPPINGS["root_dirs"]:
        old_path, new_path = root / old, root / new
        if old_path.exists():
            if new_path.exists(): 
                shutil.rmtree(new_path)
            old_path.rename(new_path)
            print(f"   📁 Restored folder: {old} -> {new}")

    print("\n✨ Revert complete! Mode: Cursor (.cursor)")

if __name__ == "__main__":
    revert()
