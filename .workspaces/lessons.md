# Project Lessons Learned

This file records durable lessons, gotchas, preferences, and reusable implementation patterns discovered while using Nexus-DevFlow.

Use this for knowledge that should guide future tasks. Keep task-specific logs inside `.workspaces/specs/{ID}-*/task_logs.json`.

## Chronological Lessons

### YYYY-MM-DD | TASK-ID | Category | Source
- **Context**: What happened or what was discovered.
- **Lesson**: What future agents or users should remember.
- **Action**: How to apply the lesson in future workflows.

### 2026-05-19 | 001 | Architecture | /34-Human Approve
- **Context**: The project established an Obsidian Vault (`docs/vault`) as a 'Project Brain' managed by AI Librarians using `VAULT_RULES.md` to prevent messy tag usage and arbitrary file deletions.
- **Lesson**: Relying purely on AI to manage a knowledge base without strict boundaries can lead to runaway tags and lost contexts. Explicit boundary rules (like a whitelist of allowed tags and atomic note concepts) must be written in `VAULT_RULES.md`.
- **Action**: Always mandate that any AI performing documentation or long-term knowledge retention MUST first read `docs/vault/VAULT_RULES.md` to learn the project's tagging and file structure conventions.

### 2026-05-19 | 002 | Process & Quality | /34-Human Approve
- **Context**: The project required implementing standardized Markdown reporting across 10 core discovery, implementation, QA, and release workflows, enforcing template validation and persistent file generation.
- **Lesson**: AI Agents can perform inconsistent and unstructured analysis unless guided by standard, structured templates (.template.md) and strict process rules. Standardized reports ensure persistent documentation, better traceability, and a premium developer experience.
- **Action**: Always mandate that any workflow performing complex analysis (brainstorming, UI/UX, competitor, QA, testing, deploy, issue triage, etc.) MUST first check its standard schema template under `.agent/resources/schemas/` and write a structured `.md` report to its designated workspace directory.

