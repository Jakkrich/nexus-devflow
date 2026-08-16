# @jakkrichm/create-nexus-devflow

> **Nexus-DevFlow 2.0 Scaffolder & Overlay Tool** — Safely overlay the stage-based agentic workflow layer onto any scaffolded or existing codebase.

[![npm version](https://img.shields.io/npm/v/@jakkrichm/create-nexus-devflow.svg)](https://www.npmjs.com/package/@jakkrichm/create-nexus-devflow)
[![license](https://img.shields.io/npm/l/@jakkrichm/create-nexus-devflow.svg)](https://github.com/Jakkrich/nexus-devflow/blob/main/LICENSE)

---

## Quick Start

### 1. Overlay into Current Project
```bash
npx @jakkrichm/create-nexus-devflow
```

### 2. Overlay into Specific Directory
```bash
npx @jakkrichm/create-nexus-devflow ./my-project
```

### 3. Specify Tool Adapters
```bash
# Install both OpenAI Codex / Antigravity (.agents) and Claude Code (.claude)
npx @jakkrichm/create-nexus-devflow --adapter both

# Install Codex & Google Antigravity adapter only
npx @jakkrichm/create-nexus-devflow --adapter codex

# Install Claude Code adapter only
npx @jakkrichm/create-nexus-devflow --adapter claude
```

### 4. Update Existing DevFlow Installation
```bash
npx @jakkrichm/create-nexus-devflow update
```

---

## CLI Options

| Flag | Shortcut | Description | Default |
| :--- | :--- | :--- | :--- |
| `--adapter <name>` | | Select AI tool adapters (`codex`, `antigravity`, `claude`, `both`) | `both` |
| `--force` | `-f` | Overwrite conflicting files without prompting | `false` |
| `--dry-run` | | Preview changes without modifying disk | `false` |
| `--yes` | `-y` | Automatically confirm interactive prompts | `false` |
| `--version` | `-v` | Display package version | |
| `--help` | `-h` | Display help screen | |

---

## Workflow Timeline & Stage Lifecycle

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release
```

1. **`/00-Discover`**: Explore requests before delivery commitment under a Discovery ID.
2. **`/10-Define`**: Lock delivery boundaries and allocate Running IDs (`.workspaces/specs/{RUNNING_ID}`).
3. **`/20-Spec`**: Formalize markdown-first specification contracts and done-when criteria.
4. **`/30-Plan`**: Transform specs into executable task breakdowns.
5. **`/40-Implement`**: Execute planned tasks incrementally with implementation evidence.
6. **`/50-Verify`**: Senior QA review and runtime validation check.
7. **`/60-Report`**: Generate standardized markdown and HTML stage reports.
8. **`/70-Release`**: Package verified work for PR merge or production deployment.

---

## Tool Adapters Architecture

- **`AGENTS.md`**: Universal cross-tool entry point and source of truth for Codex, Antigravity, Cursor, Gemini CLI, Aider, and Zed.
- **`CLAUDE.md`**: Imports `@AGENTS.md` for Claude Code.
- **`.agents/skills/`**: Stores stage workflows and discipline skills for Codex & Google Antigravity.
- **`.claude/skills/`**: Stores synced stage workflows and skills for Claude Code.

---

## License

MIT License — Copyright (c) 2026 Nexus-DevFlow Contributors / Jakkrich
