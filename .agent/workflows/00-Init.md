---
description: Init Context Auto-Sync - create or update the Project Context by combining IDE project structure scanning and technical analysis.
---
# PRP: Init Context Auto-Sync

This command is the backbone of the Framework, used to **create or update the Project Context** by combining IDE project structure scanning and technical analysis via Backend Tools (`_tools`).

## Usage

Run the command by typing:
```
/00-Init
```
## Objectives

1.  **AI Analysis**: Analyze the Stack, Dependencies, and prepare the project context using the agent's own tools.
2.  **IDE Context Setup**: Create or update `INITIAL.md` to serve as the "front page" of the work, helping the AI understand the current structure and plans.
3.  **Requirements Summary**: Gather summaries of all goals from tasks in `.workspaces/`.

## Process

### 1. Execute AI-Powered Sync & Project Detection

**Project Identification**:
1. **Handle `@module`**: If the user specifies `@module` (e.g., `/00-Init @module1`), the AI will search for a folder with that name containing an `.workspaces` folder inside.
2. **Auto-Detection**: If `@module` is not specified:
   - Check if the currently open file in the Editor is inside a sub-folder that contains `.workspaces`.
   - If not found, scan for all `.workspaces` occurrences in the Workspace.
   - If one is found, use it. If multiple are found, ask the user or default to the Root.
3. **Set Active Project**: Save the selected project's Path in `INITIAL.md` under the heading `Active Project`.

### 2. Identify Stack & Framework
1. **Analyze Stack**: Analyze the language and framework used in the `Active Project` (e.g., Odoo 8, Python, JS).
2. **Inspect Files**: Inspect important files in that Path.
3. **Generate/Update .antigravityrules**: 
   - Check the detected Stack and select the matching Template from `../rules-templates/`.
   - Use `write_to_file` to bring content from the Template to create or update the `.antigravityrules` file at the root.
4. **Update INITIAL.md**: Before creating or updating `INITIAL.md`, inspect `.agent/resources/schemas/initial.template.md` and preserve its required headings.
   - Fill in the list of specs found in `.workspaces/specs/`.
   - Update **Last Sync** to the current date and time.
   - Summarize the **Project Overview** based on findings.

### 3. Project Structure & Requirements Scanning
Understand the project deeply:
- **Project Structure**: Find key folders (src, tests, docs, config).
- **Task Indexing**: Scan the `.workspaces/specs/` and `.workspaces/issues/` folders for completed or ongoing tasks.
- **Goal Summary**: Read the Goal section from each task to summarize the system requirements.

### 4. Update INITIAL.md & .antigravityrules (The Source of Truth)
Create or update key files:
- **.antigravityrules**: Strict rules for the project aligning with the Tech Stack.
- **INITIAL.md**: Table of contents and project context, structured from `.agent/resources/schemas/initial.template.md`.
   - **Project Overview**: Project type and core Stack.
   - **Project Context (Auto-Synced)**: List of Allowed Commands and the latest Sync status.
   - **Last Sync**: The time of the most recent Sync.

### 5. Verify & Signal Readiness
- Ensure that `INITIAL.md` has complete information and is ready to act as context for other AIs.
- Provide a summary to the user indicating that "The project is ready for Agentic work."

## Benefits
- **Consistency**: Information in the IDE matches the Backend findings 100%.
- **Token Efficiency**: The AI does not waste Tokens scanning all files itself, as everything is summarized in `INITIAL.md`.
- **Traceability**: Connects every issue with specs, plans, and code.

## System Prompt / Persona
- **Context Engineer**: Focuses on structuring context so it's easy for AI to read and act upon immediately.
- **Automation Expert**: Acts as a bridge between Python Scripts and Cursor IDE.
