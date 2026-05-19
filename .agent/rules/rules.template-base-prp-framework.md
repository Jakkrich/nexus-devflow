---
description: Core governance rules for the PRP-Framework (Context Engineering).
---
# Nexus-DevFlow Core Rules - Governance Template

## ðŸ” Project Detection

**IMPORTANT: Detect if this is a PRP-Framework managed project at the start of each conversation.**

### Detection Logic:
1. **Check for Framework Indicators:**
   - Presence of `.workspaces/` directory
   - Presence of `INITIAL.md` in the root
   - Presence of `npm run activate` script
2. **Check Configuration:**
   - Look for commands like `/01-Task`, `/02-Plan` in `INITIAL.md`
3. **Report detected framework:**
   - "Detected: Nexus-DevFlow (Context Engineering & Agentic Workflow)"

---

## ðŸ”„ Project Awareness & Context

- **Always read `INITIAL.md`** at the beginning of the conversation to understand the project structure, active tasks, and current status.
- **Follow the 4-Step Cycle strictly:**
  1. `/01-Task` -> Create Metadata & Spec
  2. `/02-Plan` -> Analyze & Design
  3. `/03-Code` -> Implement & Validate
  4. `/04-Verify` -> Quality Check & Summary
- **Use the `.workspaces/` directory** for storing all JSON metadata, specs, and execution logs.

---

## ðŸš€ Token Optimization Rules

**MANDATORY: Always follow token optimization rules from `.claude/rules/token-optimization.md`**

### Core Principles:

- **Read Only What You Need** - à¹ƒà¸Šà¹‰ `offset` à¹à¸¥à¸° `limit` à¹€à¸¡à¸·à¹ˆà¸­à¸­à¹ˆà¸²à¸™à¹„à¸Ÿà¸¥à¹Œ
- **Create Minimal Context** - à¸ªà¸£à¹‰à¸²à¸‡ summary file à¹à¸—à¸™à¸à¸²à¸£à¸ªà¹ˆà¸‡à¹€à¸­à¸à¸ªà¸²à¸£à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”
- **Incremental Processing** - à¸—à¸³à¸—à¸µà¸¥à¸°à¸‚à¸±à¹‰à¸™à¸•à¸­à¸™à¹à¸¥à¸° verify à¸—à¸±à¸™à¸—à¸µ
- **Pattern-Based Approach** - à¹ƒà¸Šà¹‰ `grep` à¹à¸¥à¸° line numbers à¹à¸—à¸™à¸à¸²à¸£à¸­à¹ˆà¸²à¸™à¸—à¸±à¹‰à¸‡à¹„à¸Ÿà¸¥à¹Œ
- **Direct Code Generation** - à¸ªà¸³à¸«à¸£à¸±à¸šà¸‡à¸²à¸™à¸‡à¹ˆà¸²à¸¢à¹† à¹ƒà¸«à¹‰à¸ªà¸£à¹‰à¸²à¸‡à¹‚à¸„à¹‰à¸”à¹‚à¸”à¸¢à¸•à¸£à¸‡

### Token Budget:

- **Simple Tasks:** < 100K tokens
- **Complex Tasks:** < 300K tokens
- **Alert Threshold:** > 500K tokens (à¸„à¸§à¸£à¹à¸šà¹ˆà¸‡à¸‡à¸²à¸™)

### Before Starting Work:

1. à¸ªà¸£à¹‰à¸²à¸‡ minimal context file (à¹ƒà¸Šà¹‰ template à¸ˆà¸²à¸ `.claude/rule-templates/minimal-context.md`)
2. à¸­à¹ˆà¸²à¸™à¹€à¸‰à¸žà¸²à¸°à¸ªà¹ˆà¸§à¸™à¸—à¸µà¹ˆà¸ˆà¸³à¹€à¸›à¹‡à¸™ (à¹ƒà¸Šà¹‰ offset à¹à¸¥à¸° limit)
3. à¹ƒà¸Šà¹‰ grep à¹€à¸žà¸·à¹ˆà¸­à¸«à¸² pattern (à¸–à¹‰à¸²à¹€à¸›à¹‡à¸™à¹„à¸›à¹„à¸”à¹‰)
4. à¹à¸šà¹ˆà¸‡à¸‡à¸²à¸™à¹€à¸›à¹‡à¸™ steps à¹€à¸¥à¹‡à¸à¹†
5. Verify à¸«à¸¥à¸±à¸‡à¹à¸•à¹ˆà¸¥à¸° step

**See:** `.claude/rules/token-optimization.md` for detailed rules and examples

---

## ðŸ›¡ï¸ PHASE LOCKING & WORKFLOW ENFORCEMENT (STRICT)

> âš ï¸ **STRICT GATE: ZERO TOLERANCE FOR CODE MODIFICATION IN PHASE 1 & 2**

| Phase | Command | Allowed Action | Forbidden Action |
|-------|---------|----------------|------------------|
| **1. Create** | `/01-Task` | Create Metadata, `spec.md`, JSON files | âŒ **Modify Source Code** |
| **2. Plan** | `/02-Plan` | Create Plan, Analyze Codebase | âŒ **Modify Source Code** |
| **3. Execute** | `/03-Code` | âœ… Modify Source Code according to Plan | â€” |
| **4. Verify** | `/04-Verify` | Inspect, Create QA Report | âŒ **Modify Logic** |

### Mandatory Rules:
- **STRICT PHASE LOCKING**: While running `/01-Task` or `/02-Plan`, using any tool to modify files outside the `.workspaces/specs/` directory is **STRICTLY PROHIBITED**.
- **EXECUTION GATE**: If the User provides implementation details in early phases, record them as requirements in `spec.md` only. Do **NOT** apply them to the codebase.
- **MANDATORY STOP & CONFIRM**: You must stop after creating the spec or plan and wait for the User to execute the next phase command.

---

## ðŸ“‚ Directory & File Standards

### .workspaces/ structure:
- `specs/{TaskID}/spec.md`: Detailed requirements for a specific task.
- `specs/{TaskID}/plan.md`: Step-by-step implementation plan.
- `specs/{TaskID}/logs/`: Chronological execution logs.
- `specs/{TaskID}/results/`: Output artifacts and validation reports.

### Naming Conventions:
- **Task ID**: Uses the format `[REF-ID]` as a prefix (e.g., `FIX-123_login-bug`).
- **File Naming**: Descriptive and prefixed with Task ID where applicable.

---

## ðŸ¤– AI Behavior Rules

- **Always maintain traceability**: Connect every code change back to a specific requirement in the Spec.
- **Be proactive but safe**: Always verify the current phase before executing any tool.
- **Explain the "Why"**: Use `# Reason:` comments for complex logic to aid future AI and human reviewers.
- **Self-Correction**: If you detect a breach of the 4-step workflow, halt immediately and inform the user.

---

## ðŸ§ª Validation & Quality

- **The Validation Loop is mandatory**: Any code change in `/03-Code` must be followed by a verification sweep.
- **Continuous Documentation**: Update logs and status files incrementally, don't wait until the end of the task.
- **Final Audit**: A task is only "Done" when `/04-Verify` returns a success signal and all checklist items are checked.

