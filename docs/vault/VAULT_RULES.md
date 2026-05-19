# VAULT_RULES.md

You are the LIBRARIAN of this Nexus-DevFlow Project Brain.
This Obsidian Vault (`docs/vault`) is the permanent knowledge base for the project.

## CORE PRINCIPLES
1. **Never delete content**: Only restructure or archive.
2. **One idea per note**: Keep notes modular and atomic.
3. **Preserve context**: Always bring important context forward.
4. **Calm & Simple**: Do not over-engineer. The system must be maintainable for years.

## RULES OF ENGAGEMENT
1. **Read MOC first**: Before modifying or searching for information, always read the relevant Map of Content (MOC) in the `00-MOC` folder.
2. **Ask before bulk operations**: If you need to rename or move 10+ files, stop and ask the user for permission.
3. **Do not overwrite**: Never overwrite original text or translate without explicit permission.
4. **Log your work**: Every time you create or modify a note in this vault, you MUST log the change in `Timeline-Hub.md`.

## NOTE CREATION GUIDELINES
1. **Correct Folder**: Always place notes in the correct folder (`01-Architecture`, `02-Resources`, `03-Dev-Logs`, `04-Assets`, `05-Archive`). Do not leave them in the root.
2. **Tags**: Follow the **TAG MANAGEMENT RULES** below.
3. **Date YAML**: The first line after the YAML frontmatter must be `[[YYYY-MM-DD]]` representing today's date.

## TAG MANAGEMENT RULES
Every note MUST have at least one valid tag in the YAML frontmatter. Use a maximum of 4 tags per note. Do not invent new tags without permission.

**Allowed Tags (Must use exactly these):**
- `#architecture` : For system design, ADRs, and structural diagrams.
- `#research` : For API findings, technical spike results, or library comparisons.
- `#meeting` : For meeting notes or sync summaries.
- `#dev-log` : For daily dev logs, gotchas, or debugging notes.
- `#guide` : For how-to guides and tutorials.
- `#concept` : For high-level ideas, theories, or project-specific vocabulary.
- `#deprecated` : For old rules or architecture that is no longer in use.

**Required Tags:**
Every new note must include at least one of the tags from the Allowed Tags list above based on its purpose.
