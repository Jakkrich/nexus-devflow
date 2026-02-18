# Execute BASE PRP

Implement a feature using the PRP file.

## PRP File: $ARGUMENTS

## System Prompt / Persona
- **Coder**: Use `PRPs-Framework/prompts/coder.md` for the Execution Process.
- **Coder Recovery**: Use `PRPs-Framework/prompts/coder_recovery.md` if stuck.
- **Git Standards**: Follow `PRPs-Framework/_notes/git-branch-naming-conventions.md`.
- **Full Guide**: See `PRPs-Framework/_prompt_guides/prompt_integration_guide.md`.

> NOTE: The PRP file name is also used to derive a Git branch name for this work (if the project is under Git).

## Execution Process

0. **Git Branch & Checkpoints (if using Git)**
   - **Detect Git repository:**
     - Try running a Git detection command (e.g., `git rev-parse --is-inside-work-tree`).
     - If this fails, or Git is not available, **skip this step** and continue on the current branch/directory.
   - **Derive branch name:**
      - **Check PRP/Spec for "Proposed Branch" first.** If present, use it.
      - Otherwise, derive from the folder name containing the `prp.md`, e.g. `456_login-fails`.
      - Normalize to lowercase and replace spaces/underscores with dashes.
      - Ensure it follows the `<type>/#<issueNumber>-<alias>` format if possible.
   - **Create or switch to branch:**
     - If the branch does not exist: create it and switch to it (e.g., `git checkout -b feat-123-social-login`).
     - If the branch exists: switch to it (e.g., `git checkout feat-123-social-login`).
     - If checkout fails due to uncommitted changes or conflicts, report the issue and either:
       - Ask the user to resolve it, or
       - Continue on the current branch if appropriate for the project.
   - **Checkpoint strategy:**
      - Plan to create **small, meaningful commits** during execution:
        - After completing each major task from the PRP \"list of tasks\" section.
        - After passing important validation gates (e.g., all tests passing).
      - For each checkpoint (only if there are changes):
        - Stage changes: `git add -A`
        - Commit with a semantic message: `<type>: <summary>` (e.g. `feat: implement task 1 - create models`).
        - Follow the subject guidelines in `PRPs-Framework/_notes/git-branch-naming-conventions.md`.
     - If Git is not available or repository is not detected:
       - Skip branch creation and commits, and continue with the rest of the execution steps.

1. **Load PRP**
   - Read the specified PRP file
   - Understand all context and requirements
   - **Resolve references** cited in the PRP (section "All Needed Context" or similar):
     - For **paths under `PRPs-Framework/issues/{folder}/`**: read those files (code, .md). For **.md files that contain URLs**, fetch those URLs and use the content for context. For **PDFs** (e.g. `PRPs-Framework/issues/{folder}/spec.pdf`), read the PDF and use sections relevant to this PRP’s problem.
     - For **direct URLs** listed in the PRP: fetch them and use key content for context.
     - **Select only references that apply to this issue** (by topic, keywords, and paths cited in the PRP).
   - Follow all instructions in the PRP and extend the research if needed
   - Ensure you have all needed context to implement the PRP fully
   - Do more web searches and codebase exploration as needed
   - **Detect project language/framework** from codebase structure
   - See `PRPs-Framework/references/README.md` for conventions (external links, PDFs, code examples)

2. **ULTRATHINK & Task Planning**
   - Think hard before you execute the plan. Create a comprehensive plan addressing all requirements.
   
   **Priority 1: Check for "Plan / Subtasks" section (NEW - Preferred Method)**
   - If PRP has "## Plan / Subtasks" section:
     - Use subtasks from this section (preferred method)
     - Each subtask has: checkbox `[ ]`/`[x]`, target files, dependencies (Depends on: [T1, T2]), notes
     - Work through subtasks sequentially, respecting dependencies
     - Update checkboxes `[ ]` → `[OK]` after completing each subtask
     - Skip to step 3a (Plan/Subtasks execution)
   
   **Priority 2: Check for "list of tasks" in Implementation Blueprint (LEGACY - Backward Compatible)**
   - If no "Plan / Subtasks" section, check for "list of tasks" in Implementation Blueprint
   - **Evaluate PRP complexity and execution strategy:**
     - Check if PRP has "Execution Strategy" section with "Task Breakdown Required" setting
     - If PRP explicitly says "YES" → Must break into tasks
     - If PRP explicitly says "NO" → Execute as single unit
     - If PRP says "AUTO" or no strategy specified → Evaluate complexity:
       - **Simple PRP indicators:**
         - Single file modification
         - Few lines of code changes
         - No dependencies on other components
         - No integration points (database, routes, config)
         - Clear, straightforward implementation
       - **Complex PRP indicators:**
         - Multiple files to create/modify
         - Multiple components (models, controllers, views, services)
         - Database migrations required
         - Integration with existing systems
         - Multiple validation gates
         - Clear "list of tasks" section in PRP
   - **Decision logic:**
     - **If Simple PRP:** Implement directly without task breakdown
     - **If Complex PRP OR PRP has "list of tasks" section:** Break into tasks using TodoWrite tool
     - **If PRP explicitly requires tasks:** Always break into tasks
   - **If breaking into tasks:**
     - Use tasks from PRP's "list of tasks" section if available
     - Otherwise, create logical task breakdown based on PRP structure
     - Each task should be atomic and testable
     - Order tasks by dependencies
     - Use TodoWrite tool to create and track implementation plan
     - Skip to step 3b (Legacy task execution)
   
   - Identify implementation patterns from existing code to follow
   - Use language/framework-appropriate patterns based on detected project type

3. **Execute the plan**

   **3a. If PRP has "Plan / Subtasks" section (NEW - Preferred):**
   - Read "Plan / Subtasks" section from PRP
   - Find subtask that is not completed (still `[ ]`) and has no uncompleted dependencies
     - Check that subtasks in "Depends on" are marked `[x]`
   - Execute that subtask:
     - Read target files specified in subtask
     - Read relevant context (from PRP section "All Needed Context")
     - Modify/create files according to Plan
     - Verify code follows patterns in codebase
   - Update checkbox in PRP:
     - Change `[ ]` to `[OK]` for completed subtask
     - Add short note about what was done (e.g., "✅ Created User model with fields: id, email, password_hash")
   - If using Git: commit checkpoint after completing important subtask
     - `git add -A`
     - `git commit -m "PRP [TYPE-XXX]: checkpoint - [subtask name]"`
   - Repeat until all subtasks are completed
   - **If using `--auto-qa` flag:**
     - After all subtasks complete → run validation automatically
     - Use same logic as step 4 (Validate) below
     - Summarize validation results
     - If FAIL → recommend fixing and running `/03-Implement-Code` again
     - If PASS → proceed to step 5 (Complete)

   **3b. If using "list of tasks" from Implementation Blueprint (LEGACY):**
   - Execute each task sequentially
   - For each task:
     - Read task requirements carefully
     - Implement the task following PRP patterns
     - Run task-specific validation (if validation gates exist for that task)
     - If validation fails, fix issues before proceeding
     - Mark task complete in TodoWrite
     - **Report task completion** before moving to next task
   - Ensure all tasks are completed before final validation

   **3c. If no tasks (Simple PRP):**
   - Execute the entire PRP implementation in one go
   - Follow all PRP instructions and patterns
   - Implement all required code
   - Validate after completion

4. **Validate**
   - Run each validation command from PRP's "Validation Loop" section
   - Use project-appropriate validation commands (detected from codebase)
   - Fix any failures
   - Re-run until all pass
   - **Level 1:** Syntax & Style checks
   - **Level 2:** Unit tests
   - **Level 3:** Integration tests (if applicable)

5. **Complete**
   - Ensure all checklist items from PRP's "Final validation Checklist" are done
   - Run final validation suite
   - Verify all success criteria from PRP are met
   - Report completion status
   - Read the PRP again to ensure you have implemented everything
   - If tasks were used, verify all tasks are marked complete

6. **Reference the PRP**
   - You can always reference the PRP again if needed
   - If stuck, re-read relevant sections of the PRP

## Flag Options

- `--auto-qa`: Run validation automatically after all subtasks/tasks complete (uses same logic as step 4 - Validate)
  - Only applies when using "Plan / Subtasks" section (3a)
  - If validation fails, recommend fixing and running `/03-Implement-Code` again
  - If validation passes, proceed directly to step 5 (Complete)

## Important Notes

- **If validation fails:** Use error patterns in PRP to fix and retry. Never skip validation.
- **If task/subtask fails:** Fix the task/subtask before proceeding to next one. Don't accumulate errors.
- **Language detection:** Always detect project language/framework first and use appropriate patterns.
- **Validation commands:** Use project-appropriate commands, not hardcoded examples.
- **Pattern consistency:** Follow existing codebase patterns, don't create new ones unnecessarily.
- **Plan/Subtasks vs list of tasks:** Prefer "Plan / Subtasks" section (created by `/02-Plan-Implementation`) over "list of tasks" in Implementation Blueprint for better tracking and dependency management.
