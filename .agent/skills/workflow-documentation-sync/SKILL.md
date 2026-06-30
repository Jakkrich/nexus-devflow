---
name: workflow-documentation-sync
description: Enforces the synchronization and comprehensive update of documentation, manuals, usage guides, and examples whenever a new workflow is introduced or modified in the project. Use when introducing new workflows or changing existing ones.
---

# Workflow Documentation Sync

## Overview
This skill ensures that whenever a DevFlow 2.0 workflow or companion command is introduced or modified, all associated documents, user guides, manuals, and usage examples are thoroughly and systematically updated. This prevents outdated context and ensures humans and AI agents have an accurate, uniform understanding of the available tools.

## When to Use
- When creating a new workflow file under `.agent/workflows/*.md`.
- When modifying the inputs, outputs, processes, or rules of an existing workflow.
- When deprecating or removing a workflow.

Do NOT use when modifying source code logic that doesn't impact workflow interface, arguments, or overall process.

---

## 🏗️ Core Process

### Step 1: Identify Documentation Targets
Whenever a workflow is added or modified, compile the list of documents that must be synchronized:
1. **User Guide / Manual**: [**`USAGE.md`**](file:///d:/nexus-devflow/USAGE.md) (The main IDE user manual).
2. **Workflow Index**: `.agent/workflows/README.md` (if present) or any registry that lists command interfaces.
3. **Template/Example files**: Any scratch templates, templates, or example files that demonstrate workflow inputs.

### Step 2: Extract Workflow Metadata
Identify the exact interface changes:
- What is the **Command trigger**? (e.g., `/70-Release` or `Brainstorm`)
- What are the **Arguments**? (e.g., Target Branch, default main)
- What is the **Process flow**? (Pre-flight -> Execution -> Cleanup)
- What are the **Mandatory Rules**? (e.g., Enforced branch checks)

### Step 3: Comprehensive Updates
Update all target files systematically:
1. **Update USAGE.md**: Locate the quick command index and detail sections. Inject the new workflow command, its purpose, argument syntax, full execution steps, and real-world examples.
2. **Update Workflow Index**: Add the new workflow to the lists of available command surfaces.
3. **Create Examples**: If the workflow uses complex parameters or stage artifacts, ensure clean, tested examples are placed in the task workspace or referenced guides.

### Step 4: Verify Alignment
Ensure that:
- The command prefix is consistent across all documents.
- Any manual steps described in the guide match the automation logic of the workflow file.
- Outdated versions or deleted arguments are removed from all documents.

---

## 🛠️ Documentation Template for USAGE.md

When injecting a new workflow into `USAGE.md`, use the following structure:

```markdown
### 🔀 /{Workflow-Name} - {Workflow-Title}
- **วัตถุประสงค์**: {Brief description of what it does in Thai}
- **วิธีใช้งาน**:
  ```powershell
  /{Workflow-Name} [Arguments]
  ```
- **ขั้นตอนการทำงาน (Process)**:
  1. {Step 1}
  2. {Step 2}
- **กฎเกณฑ์และ Gotchas (Rules & Gotchas)**:
  - {Mandatory rules or things to watch out for}
- **ตัวอย่างการใช้งาน (Example)**:
  - `/{Workflow-Name} {Example-Arguments}`
```

---

## 🚫 Common Rationalizations

| Rationalization | Reality |
|:---|:---|
| "I'll update USAGE.md in the next task." | Undocumented workflows are forgotten workflows. Doc drift starts with a single missed update. |
| "The prompt in the workflow file is self-documenting." | Workflow prompts are optimized for AI. Humans need clean, Thai-friendly usage instructions with clear examples. |
| "The workflow is too simple to need examples." | Even simple workflows (like Merge or PR) have edge cases (e.g., force delete warnings) that must be documented. |

---

## ✅ Verification Checklist

- [ ] Every new/modified workflow has been mapped to `USAGE.md`.
- [ ] Argument parameters in the markdown guide perfectly match the actual `.md` workflow trigger.
- [ ] Real-world, copy-pasteable execution examples are provided.
- [ ] Deprecated or old workflow definitions have been removed or clearly marked as legacy to prevent hallucination.
- [ ] Verification command output or terminal execution proof is recorded.
