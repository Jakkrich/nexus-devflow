## graphify

If this project has a graphify knowledge graph at `graphify-out/`, use it as an optional navigation aid.

Rules:

- Before answering architecture or codebase questions, prefer `graphify-out/GRAPH_REPORT.md` if it exists.
- If `graphify-out/wiki/index.md` exists, navigate it before reading large raw file sets.
- If the graphify MCP server is active, prefer graph queries over broad grep for cross-module questions.
- If graphify artifacts are absent, continue with normal DevFlow 2.0 discovery using current workflows and skills.
- After modifying code files, run `graphify update .` only when this repo actively uses graphify as part of its workflow.
