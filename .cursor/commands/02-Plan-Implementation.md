# Create PRP

## Feature/Issue file: $ARGUMENTS

Generate a complete PRP for general feature implementation with thorough research. Ensure context is passed to the AI agent to enable self-validation and iterative refinement. Read the feature file first to understand what needs to be created, how the examples provided help, and any other considerations.

## System Prompt / Persona
- **Spec Researcher**: Use `PRPs-Framework/prompts/spec_researcher.md` for the Research Process.
- **Planner**: Use `PRPs-Framework/prompts/planner.md` for the PRP Generation Process.
- **Spec Writer**: Use `PRPs-Framework/prompts/spec_writer.md` if creating a new spec from scratch.
- **Full Guide**: See `PRPs-Framework/_prompt_guides/prompt_integration_guide.md` for details.

The AI agent only gets the context you are appending to the PRP and training data. Assume the AI agent has access to the codebase and the same knowledge cutoff as you, so it's important that your research findings are included or referenced in the PRP. The Agent has Websearch capabilities, so pass URLs to documentation and examples.

## Research Process

1. **Codebase Analysis**
   - Search for similar features/patterns in the codebase
   - Identify files to reference in PRP
   - Note existing conventions to follow
   - Check test patterns for validation approach
   - **Scan `PRPs-Framework/references/` directory** (if exists):
     - List all files and folders in `PRPs-Framework/references/` (including `.md`, `.pdf`, code files)
     - **Select references relevant to this issue only** (by title, context, keywords)
     - For **.md files**: read content; if they contain URLs (http/https), **fetch those URLs** and use the content for context
     - For **.pdf files**: when the path is referenced in the issue/PRP or clearly related to the problem, **read the PDF** and extract relevant sections for context
     - For **code/files**: read and extract patterns
     - Note folder structures if references are organized in folders
   - See `PRPs-Framework/references/README.md` for conventions (external links, PDFs, code examples)

2. **External Research**
   - Search for similar features/patterns online
   - Library documentation (include specific URLs)
   - Implementation examples (GitHub/StackOverflow/blogs)
   - Best practices and common pitfalls

3. **References Review** (if PRPs-Framework/references/ provided)
   - **Scan `PRPs-Framework/references/` directory** for files relevant **to this issue only**:
     - List all files (`.md`, `.pdf`, code files, etc.) in `PRPs-Framework/references/`
     - **Select** only references that match the problem (keywords, topic, path mentioned in issue/spec)
     - **For .md files containing URLs**: fetch each relevant URL and include key content/snippets in the PRP context
     - **For .pdf files**: when selected as relevant to the issue, read the PDF and extract sections that apply to the problem; cite path in PRP (e.g. `PRPs-Framework/references/docs/spec.pdf`)
     - **For code/other files**: read and extract patterns
   - **Extract patterns** from selected reference files:
     - Code patterns to follow
     - Implementation approaches
     - Gotchas and considerations
   - **Reference dynamically**: Use actual file/folder paths found in `PRPs-Framework/references/` (including PDFs and .md with external links)

4. **User Clarification** (if needed)
   - Specific patterns to mirror and where to find them?
   - Integration requirements and where to find them?

## PRP Generation

Using `PRPs-Framework/templates/prp_base.md` as template (create this file if it doesn't exist):

- The input file is typically a **spec file under a folder in `PRPs-Framework/issues/`**:
  - Example: `PRPs-Framework/issues/456_login-fails/spec.md`
  - Example: `PRPs-Framework/issues/123_social-login/spec.md`

The assistant should read the spec, research the codebase and external docs, then generate a **full PRP** (`prp.md`) inside the same folder.

### Critical Context to Include and pass to the AI agent as part of the PRP
- **Documentation**: URLs with specific sections (fetch external URLs when found in `PRPs-Framework/references/` .md files)
- **Code Examples**: 
  - Real snippets from codebase
  - **Files/folders from `PRPs-Framework/references/` directory** (dynamically discovered, **selected by relevance to this issue**):
    - Scan `PRPs-Framework/references/` for `.md` (with URLs), `.pdf`, and code files
    - **External links**: In .md files, fetch URLs and include key content for this problem
    - **PDFs**: When a PDF path is relevant to the issue, read it and cite path (e.g. `PRPs-Framework/references/docs/spec.pdf`); include extracted sections in context
    - Reference actual paths found (e.g. `PRPs-Framework/references/auth_pattern.py`, `PRPs-Framework/references/docs/api-spec.pdf`)
    - Include why each reference is relevant to this issue
- **Gotchas**: Library quirks, version issues
- **Patterns**: Existing approaches to follow OR documentation patterns

### Implementation Blueprint
- Start with pseudocode showing approach
- Reference real files for patterns:
  - Files from codebase
  - **Files/folders from `PRPs-Framework/references/` directory** (use actual paths found when scanning)
- Include error handling strategy
- List tasks to be completed to fulfill the PRP in the order they should be completed

### Plan / Subtasks (NEW - Recommended)

**IMPORTANT: Always create section "## Plan / Subtasks" in the PRP after Implementation Blueprint**

After creating the Implementation Blueprint, create a detailed "Plan / Subtasks" section with the following format:

```markdown
## Plan / Subtasks

- [ ] T1: [ชื่อ subtask]
     - Target files: [path/to/file1, path/to/file2]
     - Depends on: []
     - Notes: [คำอธิบายสั้น ๆ]

- [ ] T2: [ชื่อ subtask]
     - Target files: [...]
     - Depends on: [T1]
     - Notes: [...]
```

**Principles for creating Plan/Subtasks:**
- Break work into clear, atomic subtasks that can be done one at a time
- Each subtask should have clear target files specified
- Specify dependencies between subtasks (Depends on: [T1, T2])
- Subtasks should be ordered by dependency (no circular dependencies)
- Subtasks should align with "list of tasks" in Implementation Blueprint
- Each subtask should be testable and have clear completion criteria

**This section enables `/03-Implement-Code` to work with structured subtasks and track progress via status symbols `[OK]`, `[..]`, `[--]`, `[  ]`.**

**If PRP is very simple (single file change, minor modification):**
- You may create a minimal Plan/Subtasks with just one subtask
- Or omit this section if truly trivial (but `/03-Implement-Code` will still work with "list of tasks" from Implementation Blueprint)

### Validation Gates (Must be Executable)

**IMPORTANT: Detect project language/framework and use appropriate validation commands.**

**Detection Logic:**
1. Check for language indicators (Python, PHP, JavaScript/TypeScript, etc.)
2. Check for framework indicators (FastAPI, CodeIgniter, Yii, React, etc.)
3. Check existing test/lint commands in project (package.json, Makefile, etc.)
4. Use project-appropriate validation commands

**For Python projects:**
```bash
# Syntax/Style
ruff check --fix && mypy .
# OR
black . && flake8 .
# OR
pylint .

# Unit Tests
pytest tests/ -v
# OR
python -m unittest discover
```

**For PHP projects:**
```bash
# Syntax/Style
phpcs --standard=PSR12 app/
phpstan analyse
# OR
php-cs-fixer fix

# Unit Tests
phpunit tests/
# OR
vendor/bin/phpunit
```

**For JavaScript/TypeScript projects:**
```bash
# Syntax/Style
eslint . --fix
npm run type-check
# OR
tsc --noEmit

# Unit Tests
npm test
# OR
jest
# OR
vitest
```

**For Odoo projects:**
```bash
# Syntax/Style
pylint odoo/addons/
black odoo/addons/

# Unit Tests
odoo-bin -c odoo.conf --test-enable --stop-after-init -d test_db
```

**For other languages/frameworks:**
- Use appropriate linting and testing commands for the detected project type
- Check project's existing scripts (package.json, Makefile, etc.)
- Follow framework-specific testing patterns

*** CRITICAL AFTER YOU ARE DONE RESEARCHING AND EXPLORING THE CODEBASE BEFORE YOU START WRITING THE PRP ***

*** ULTRATHINK ABOUT THE PRP AND PLAN YOUR APPROACH THEN START WRITING THE PRP ***

### Type Detection & Naming (BUG / FEAT / CHANGE / OTHER)

Before deciding the output filename, detect the **work item type** from the input spec file:

- Look for an explicit `Type:` field (case-insensitive) in the spec content:
  - `Type: BUG` → bug
  - `Type: FEATURE` or `Type: FEAT` → feature
  - `Type: CHANGE`, `CHG`, or `REFACTOR` → change/refactor
- If no explicit type, infer from keywords in the title/content:
  - Contains words like `bug`, `error`, `exception`, `issue`, `fails` → BUG
  - Contains words like `feature`, `add`, `implement`, `new`, `support` → FEAT (feature)
  - Contains words like `refactor`, `cleanup`, `improve`, `optimize` → CHG (change)
  - Otherwise → ISSUE (generic)

Derive the **output path** from the input folder:

- If input file is `PRPs-Framework/issues/456_login-fails/spec.md`:
  - Output PRP path: `PRPs-Framework/issues/456_login-fails/prp.md`

If there is no numeric ID, use a slug based on the title only, e.g. `BUG_login-fails-after-password-reset_prp.md`.

**Important:** The PRP (`prp.md`) should ALWAYS be saved in the same folder as the input `spec.md`.

## Output

- Save the generated PRP as: `PRPs-Framework/issues/{folder-name}/prp.md`.
- Include a section in the PRP (using `prp_base.md`) that can list **Related PRPs** so future work can see history and relationships.

### Update INITIAL.md

**IMPORTANT: After generating the PRP, you MUST update `INITIAL.md` to include the new PRP entry.**

1. **Read `INITIAL.md`** (create it if it doesn't exist, using `PRPs-Framework/templates/initial_base.md` as template)
2. **Determine the appropriate section** based on PRP type:
   - BUG → Add to "### Bugs / Issues" section
   - FEAT → Add to "### Features" section
   - CHG → Add to "### Changes / Refactors" section
   - ISSUE/OTHER → Add to "### Bugs / Issues" section
3. **Add entry** in the format:
   ```markdown
   - [PRP Title/Name] - PRP: `PRPs-Framework/issues/{folder-name}/prp.md`
   ```
   Example:
   ```markdown
   - BUG-456: Login fails after password reset - PRP: `PRPs-Framework/issues/456_login-fails/prp.md`
   - FEAT-123: Add social login - PRP: `PRPs-Framework/issues/123_social-login/prp.md`
   ```
4. **Maintain alphabetical or chronological order** within each section (optional, but recommended)
5. **Save `INITIAL.md`** with the new entry

**Note:** If `INITIAL.md` doesn't exist, create it using the structure from `PRPs-Framework/templates/initial_base.md`.

## Quality Checklist
- [ ] All necessary context included
- [ ] Validation gates are executable by AI
- [ ] References existing patterns OR documentation
- [ ] Clear implementation path
- [ ] Error handling documented
- [ ] Validation commands match project language/framework

Score the PRP on a scale of 1-10 (confidence level to succeed in one-pass implementation)

Remember: The goal is one-pass implementation success through comprehensive context.
