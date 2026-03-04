# 🤖 PRPs Framework Skills Guide

> **Guide to creating and utilizing Skills within the PRPs-Framework across multiple IDEs.**

---

## 📋 Overview

While modern AI models are powerful generalists, they don't inherently know your specific project context or your team's unique standards. Loading every rule or tool into the agent's context window leads to "tool bloat," higher costs, latency, and confusion.

**PRPs Framework Skills** solve this through **Progressive Disclosure**. A Skill is a package of specialized knowledge that remains dormant until needed. This information is only loaded into the agent's context when your specific request matches the skill's description.

---

## � Structure and Scope

Skills are folder-based packages. Within the PRPs Framework, these are managed dynamically depending on your active IDE.

| Scope | Location (Dynamic) | Description |
| :--- | :--- | :--- |
| **Workspace** | `[IDE-ROOT]/skills/` | Available only in a specific project |

### Skill Directory Structure
```text
my-skill/
├── SKILL.md      # (Required) Metadata & instructions
├── scripts/      # (Optional) Python or Bash scripts
├── references/   # (Optional) Documentation, templates, checklists
└── assets/       # (Optional) Images or logos
```

---

## 🔄 Multi-IDE Folder Mapping
The location of your skills folder changes based on the environment you are using. Use the **`active-ide.py`** script at the project root to switch between them:

- **Cursor**: `.cursor/skills/`
- **Antigravity**: `.cursor/skills/`
- **Windsurf**: `.cursor/skills/`

---

## 🔍 Example 1: Code Review Skill

This is an instruction-only skill; you only need to create the `SKILL.md` file.

### Step 1: Create the directory
```bash
# Path relative to your active IDE root
mkdir -p .cursor/skills/code-review
```

### Step 2: Create SKILL.md
```markdown
---
name: code-review
description: Reviews code changes for bugs, style issues, and best practices. Use when reviewing PRs or checking code quality.
---

# Code Review Skill

When reviewing code, follow these steps:

## Review checklist
1. **Correctness**: Does the code do what it's supposed to?
2. **Edge cases**: Are error conditions handled?
3. **Style**: Does it follow project conventions?
4. **Performance**: Are there obvious inefficiencies?

## How to provide feedback
- Be specific about what needs to change.
- Explain why, not just what.
- Suggest alternatives when possible.
```

> 💡 **Note**: The Agent will only read the metadata (YAML frontmatter) and load the full instructions only when the request context matches the description.

---

## 📄 Example 2: License Header Skill

This skill uses a template file in the `references/` directory.

### Step 1: Create the directory
```bash
mkdir -p .cursor/skills/license-header-adder/references
```

### Step 2: Create the template file
**`references/HEADER.txt`**:
```text
/*
 * Copyright (c) 2026 YOUR_COMPANY_NAME LLC.
 * All rights reserved.
 */
```

### Step 3: Create SKILL.md
```markdown
---
name: license-header-adder
description: Adds the standard corporate license header to new source files.
---

# License Header Adder

1. **Read the Template**: Read `references/HEADER.txt`.
2. **Apply to File**: Prepend this content to new source files.
3. **Adapt Syntax**: Use `/* */` for JS/TS/Java and `#` for Python/Shell.
```

---

## 🎯 Conclusion

By creating Skills, you transform a general AI model into an expert for your project:

- ✅ **Systematize** best practices.
- ✅ **Enforce** code quality standards automatically.
- ✅ **Reduce** context window noise by loading knowledge "Just-in-Time".
- ✅ **Agnostic**: Skills work across Cursor, Windsurf, and Antigravity.

---
*Powered by PRPs-Framework — Agnostic Agentic Workflows*
