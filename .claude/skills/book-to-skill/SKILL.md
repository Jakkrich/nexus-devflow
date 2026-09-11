---
name: book-to-skill
description: "[devflow] Converts technical books, documents, and folders (PDF, EPUB, DOCX, Markdown, HTML, RTF, MOBI) into structured on-demand agent skills. Extracts frameworks, mental models, decision rules, and anti-patterns with 24x-51x token reduction. JIT resources in devflow/.vendor/book-to-skill/."
origin: custom-vendor
referencePath: devflow/.vendor/book-to-skill
argument-hint: "<path-to-document-or-folder> [skill-name-slug] [--mode technical|text] [help]"
---

# 📚 book-to-skill - Technical Document & Book to Structured Agent Skill Converter

$ARGUMENTS

`book-to-skill` turns technical books, architecture specs, ADR collections, and dense documentation into structured, on-demand agent skills ready for pair-programming and context-efficient reference.

Instead of dumping raw PDFs or books into context (which triggers the expensive "discovery loop tax" where agents re-read table-of-contents repeatedly), `book-to-skill` structures knowledge once into **mental models, decision rules, anti-patterns, and on-demand chapter files**, reducing ongoing token usage by **24×–51×**.

---

## ⚠️ Pre-Flight Check (Knowledge Base Availability)

Before executing any extraction or skill generation:
1. **Check if `devflow/.vendor/book-to-skill/` exists in this project using your file inspection tool**.
2. **If `devflow/.vendor/book-to-skill/` is MISSING / NOT INSTALLED**:
   - Inform the user in their configured communication language (Thai default):
     - State clearly that the book-to-skill upstream repository is not yet cloned in this project.
     - Provide the installation command:
       ```bash
       /vendor https://github.com/virgiliojr94/book-to-skill
       ```
   - Stop and wait for installation before proceeding.
3. **If `devflow/.vendor/book-to-skill/` is PRESENT**:
   - Proceed with extraction and generation steps below.

---

## 🎯 Core Philosophy & Structure

**"Extract structure, not summaries."** A skill isn't a book report—it is an actionable toolkit:
- **Named Frameworks**: Mental models with concrete application rules.
- **Actionable Principles**: Clear rules that guide architectural and coding decisions.
- **Techniques & Patterns**: Step-by-step algorithms, implementations, and design patterns.
- **Anti-Patterns**: What to avoid and empirical failure modes.
- **On-Demand Chapters**: Detailed chapter notes loaded only when querying specific topics.

### Standard Output Structure

When converting a document, the generator creates:
```text
.agents/skills/<slug>/ (and .claude/skills/<slug>/)
├── SKILL.md                 # Core mental models, frameworks & chapter index (~4,000 tokens)
├── chapters/
│   ├── ch01-*.md            # On-demand chapter breakdowns (~1,000 tokens each)
│   └── ch02-*.md
├── glossary.md              # Domain terms, alphabetically sorted with chapter refs (~1,500 tokens)
├── patterns.md              # Techniques, algorithms, design patterns (~2,000 tokens)
└── cheatsheet.md            # Decision tables & quick-reference rules (~1,000 tokens)
```

---

## 🎛️ Modes of Operation

1. **Full Conversion (Default)**:
   - **Trigger**: `/book-to-skill <path-to-file-or-folder> [slug]`
   - **Lifecycle**: Pre-flight format check → text extraction → analyze structure → synthesize skill files → validate.
2. **Analyze Only**:
   - **Trigger**: `/book-to-skill analyze <path>`
   - **Lifecycle**: Runs extraction and outputs a structured extraction report (frameworks, models, outline) for user inspection without creating skill files.
3. **Generate from Prior Analysis**:
   - **Trigger**: User provides prior extraction analysis notes.
   - **Lifecycle**: Skips extraction, builds final skill files directly from analysis.
4. **Update / Fold-in**:
   - **Trigger**: `/book-to-skill update <path> <existing-skill-slug>`
   - **Lifecycle**: Extracts new material and merges into existing chapter summaries, glossary, and decision cheatsheet.

---

## 🚀 Execution Instructions & Tooling

### 1. Environment & Extractor Health Check
Run dependency preflight check to see available format extractors:
```bash
python devflow/.vendor/book-to-skill/scripts/extract.py --check
```

### 2. Document Extraction
Extract text from supported formats (`.pdf`, `.epub`, `.docx`, `.txt`, `.md`, `.html`, `.rtf`, `.mobi`):
```bash
python devflow/.vendor/book-to-skill/scripts/extract.py <input-path> --mode [technical|text]
```
- `--mode technical`: Preserves code blocks, markdown tables, and math formulas (uses Docling when installed). Recommended for programming, architecture, and engineering books.
- `--mode text`: High-speed text extraction (pdftotext / pypdf / beautifulsoup4 / stdlib fallback). Recommended for prose-heavy books.

### 3. Skill Validation
After synthesizing the new skill files, validate standard compliance:
```bash
python devflow/.vendor/book-to-skill/tools/validate_skill.py <path-to-generated-skill>
```

---

## 🛡️ Safety & Project Boundaries

- **Vendor Immutability**: NEVER edit files inside `devflow/.vendor/book-to-skill/` directly. Treat as read-only upstream knowledge and tooling.
- **Repository Cleanliness**: `devflow/.vendor/` is ignored by Git in `.gitignore`.
- **Destination Targeting**: When generating new skills for project-wide agent use, place them in `.agents/skills/<slug>/` and mirror to `.claude/skills/<slug>/` for dual-adapter compatibility.
- **Temporary Files**: Use system temp directory or `devflow/scratch/` for intermediate extraction dumps.

---

## 📖 Universal Contextual Help & Playbook Protocol (`help`, `--help`, `-h`, `?`)

When invoked with `/book-to-skill help`, `book-to-skill --help`, or `/book-to-skill -h`:
1. **Execution Safety Gate**: Do not extract documents or write skill files.
2. **5W1H Framework Presentation**: Render the 5W1H guide in chat.
3. **HTML Playbook Generation**: Generate or update the styled HTML report at:
   `devflow/docs/playbooks/book-to-skill.html`
4. Conclude with: `"Help menu displayed successfully"`
