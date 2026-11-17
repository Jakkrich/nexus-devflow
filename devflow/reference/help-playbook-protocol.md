# Contextual Help Protocol

**Universal Contextual Help (`help`, `--help`, `-h`, `?`)**:
Whenever any skill or command is invoked with a help keyword or flag (e.g., `/feature help`, `audit --help`, `/check ?`):

1. **Execution Safety Gate**: Do NOT execute the command's primary or mutating actions, do NOT edit source files, do NOT write HTML playbooks, and do NOT initialize task runs or `devflow/.state/run.json`.
2. **Concise In-Chat Markdown Cheat Sheet**: Read only the target skill's `SKILL.md` (and already-loaded context if needed) and reply directly in chat with a compact guide (10–20 lines):
   - **What & When**: One-sentence summary of what the command does and when to use it.
   - **Usage & Flags**: Exact command forms, arguments, and optional flags.
   - **Boundaries**: Read-only vs. mutating scope and key safety gates.
   - **Next Step**: Typical command that follows.
3. **Optional Export Only When Explicitly Requested**: Only generate a standalone HTML document if the user explicitly asks to export or save an HTML doc.
