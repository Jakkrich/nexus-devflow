## Project Context Index

Use this file as a human-readable project overview. Machine-readable project context is generated at `.workspaces/project_index.json`.

### Project Overview

- **Platform/Stack**: Nexus-DevFlow, Context Engineering, Node.js CLI, Python helpers, Markdown/JSON artifacts
- **Description**: Framework for structured agent-based development that helps SA/BA, DEV, QA, and reviewers collaborate with AI agents.
- **Active Bundle**: `.agent`
- **Command Surface**: root npm scripts

### System Requirements Summary

- **Workflow**: Create -> Plan -> Execute -> Verify
- **Artifact Style**: JSON and Markdown source-of-truth files
- **Canonical Workspace Directory**: `.workspaces`
- **Task Workspace Directory**: `.workspaces/specs`
- **Roadmap Directory**: `.workspaces/roadmap`

### Important Files

- `package.json`: root npm command surface
- `.agent/package.json`: agent bundle package metadata
- `.agent/scripts/prp.mjs`: PRP task CLI
- `.workspaces/project_index.json`: machine-readable project index
- `.workspaces/roadmap/roadmap_discovery.json`: roadmap discovery output
- `.workspaces/roadmap/roadmap.json`: machine-readable roadmap
- `ROADMAP.md`: human-readable roadmap
- `docs/quickstart.md`: setup and first-use guide

### Core Commands

- `npm run activate`: activate `.agent` and generate required project artifacts
- `npm run index`: regenerate project indexes
- `npm run validate`: validate framework health
- `npm run sync:check`: confirm `.agent` is the only active bundle
- `npm run agent -- <command>`: run PRP task CLI commands

### Active Specs & Tasks

- *(Empty)*

### Documentation

- [README](README.md)
- [Setup](SETUP.md)
- [Roadmap](ROADMAP.md)
- [Quickstart](docs/quickstart.md)
- [Workspace Artifacts](docs/workspace-artifacts.md)

### Knowledge Base (Project Brain)

This project uses an Obsidian-style Vault as its Second Brain, located in `docs/vault/`.
**ATTENTION ALL AGENTS:** Before performing any major documentation changes or retrieving historical lessons, you MUST read the Librarian rules at [docs/vault/VAULT_RULES.md](docs/vault/VAULT_RULES.md).

### Maintenance Notes

- Regenerate project index after directory or package changes.
- Keep `.agent` as the single source for framework runtime assets.
- Keep generated roadmap JSON and human-readable roadmap docs aligned.

