# 🎓 Project Lessons Learned

Record of lessons learned from working with AI in this project, enabling future Agents to work more accurately and closer to expectations.

---

*(No new lessons recorded yet)*

## Lesson #1: Beware of using PowerShell for files with Thai text (UTF-8) 🐛

### 📋 Context
- **Project**: PRPs-Framework (Dashboard File Replace)
- **Date**: 2026-02-27

### ❌ What Went Wrong
Used the `Get-Content` command in PowerShell (older versions) to read a file and perform Mass Replace, then overwrote it (`Set-Content` or `[IO.File]::WriteAllText`). However, the **read** encoding was not specified as UTF-8. As a result, PowerShell read the Thai file in ANSI/System locale, and when saved back, Thai characters and emojis became corrupted, breaking the entire project.

### ✅ What I Learned
> **File management commands in PowerShell have very dangerous default encodings!**
> 1. Avoid using PowerShell for Mass Text Replacement in projects containing Thai text or emojis. Always use **Python** or **Node.js** instead (e.g. `open(file, 'r', encoding='utf-8')`).
> 2. If PowerShell is absolutely necessary, explicitly specify the `-Encoding UTF8` parameter every single time for both reading (`Get-Content`) and writing (`Set-Content`/`Out-File`).

### 🛡️ Prevention
```python
# Use Python instead of PowerShell for overriding multiple files
import os

def replace_in_file(filepath, target, replacement):
    # Always explicitly specify the encoding
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace(target, replacement)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
```

---
> 💡 **Tip**: AI will automatically log lessons to this file when triggered via `/10-Human`, or you can manually add them by referencing the format from [.cursor/PRPs/templates/lessons.template.md](../.cursor/PRPs/templates/lessons.template.md)
