# @jakkrichm/create-nexus-devflow

Install Nexus-DevFlow into an already scaffolded app or existing repository.

[![npm version](https://img.shields.io/npm/v/@jakkrichm/create-nexus-devflow?style=flat-square&color=155eef)](https://www.npmjs.com/package/@jakkrichm/create-nexus-devflow)
[![Validate DevFlow](https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml/badge.svg)](https://github.com/Jakkrich/nexus-devflow/actions/workflows/validate.yml)
[![MIT license](https://img.shields.io/npm/l/@jakkrichm/create-nexus-devflow?style=flat-square&color=155eef)](LICENSE)

[Repository](https://github.com/Jakkrich/nexus-devflow) |
[Documentation](https://github.com/Jakkrich/nexus-devflow#readme) |
[Changelog](https://github.com/Jakkrich/nexus-devflow/blob/main/CHANGELOG.md)

Requires Node.js 18 or newer. Run the installer from an application that has
already been scaffolded and initialized as a Git repository.

```bash
npx @jakkrichm/create-nexus-devflow@latest
```

The installer copies the shared DevFlow workflow files into the current
directory:

- `AGENTS.md`
- `CLAUDE.md`
- `.nexus/nexus-devflow.json`
- `devflow/context/`
- `devflow/reference/`

It adds `.agents/skills/` for Codex and Google Antigravity. Claude Code uses `CLAUDE.md` plus
`.claude/skills/`. The `--both` option (default) installs both adapter families.

It keeps the app's root `README.md` alone and installs the DevFlow framework context under
`devflow/context/` and `devflow/reference/`.

The installed workflow guides AI assistants through an explicit 8-stage lifecycle:

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Execute -> /50-Verify -> /60-Report -> /70-Release
```

It also includes public companion commands (`Goal`, `Brainstorm`, `Research`, `Debug`, `PRD`, `Issue-Triage`, `Security-Review`, `Wiki`, `Check-For-Updates`, `Help`) and the flagship guide command `/devflow`.

If you install Nexus-DevFlow while Claude Code is already open in the project,
restart Claude Code in that folder so the newly added project skills appear.
For Google Antigravity, start a new conversation or reopen the workspace after
installing so the new slash commands are discovered.

## Tool support

| Tool | Installed adapter | Invocation |
| --- | --- | --- |
| Codex | `.agents/skills/` | `$devflow`, `$00-discover`, `$40-execute`, or plain language |
| Google Antigravity | Shared `.agents/skills/` project skills | `/devflow`, `/00-discover`, `/40-execute`, and other slash commands after restarting Antigravity |
| Claude Code | `.claude/skills/` | `/devflow`, `/00-discover`, `/40-execute`, and other slash commands |
| Other tools | `AGENTS.md` plus readable skill files | Ask the agent to follow the matching `SKILL.md` |

Codex and Antigravity share `.agents/skills`. The `--antigravity` or `--codex` option installs
that shared adapter.

## Options

```bash
npx @jakkrichm/create-nexus-devflow@latest -- --codex
npx @jakkrichm/create-nexus-devflow@latest -- --antigravity
npx @jakkrichm/create-nexus-devflow@latest -- --claude
npx @jakkrichm/create-nexus-devflow@latest -- --both
npx @jakkrichm/create-nexus-devflow@latest -- --force
npx @jakkrichm/create-nexus-devflow@latest -- --target ./my-app
```

Use `--force` to overwrite existing DevFlow files. Without `--force`, the
installer asks before overwriting in an interactive terminal and exits in
non-interactive runs.

## Updating an existing installation

Preview the update plan:

```bash
npx @jakkrichm/create-nexus-devflow@latest update --dry-run
```

Apply the update:

```bash
npx @jakkrichm/create-nexus-devflow@latest update
```

The updater detects the installed adapters and manages only these paths:

- `.agents/skills/`
- `.claude/skills/`
- `devflow/reference/`

It preserves `AGENTS.md`, `CLAUDE.md`, `devflow/context/`, `devflow/history/`,
`devflow/runs/`, and `devflow/discoveries/`. The `.nexus/nexus-devflow.json` file records the
installed version and hashes of managed files.

Locally modified managed files are reported as conflicts. Interactive updates
ask before replacing them. Non-interactive updates exit unless you pass
`--force`, which backs up the conflicting files before replacement.

## Artifact language

New installations default user-facing artifacts and explanations to Thai via
`artifact_language: "th"` in `devflow/context/ai-interaction.md`. Technical
names, code, paths, commands, schema keys, quoted errors, and required template
headings remain unchanged for compatibility. Because the updater preserves this
project-owned file, the language choice remains in place across updates.

For an older installation, add the same setting and guidance to its local
`devflow/context/ai-interaction.md` once.

## Help and contributing

- Read the [full documentation](https://github.com/Jakkrich/nexus-devflow#readme).
- Report reproducible problems through the repository's
  [issue forms](https://github.com/Jakkrich/nexus-devflow/issues/new/choose).
- Follow the repository's
  [security policy](https://github.com/Jakkrich/nexus-devflow/security/policy)
  for private vulnerability reports.
- Read the
  [contribution guide](https://github.com/Jakkrich/nexus-devflow/blob/main/CONTRIBUTING.md)
  before opening a pull request.

## License

MIT License — Copyright (c) 2026 Nexus-DevFlow Contributors / Jakkrich
