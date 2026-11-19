# Overlay install

Overlay install scaffolds Nexus-DevFlow into a target project directory, creates `.nexus/nexus-devflow.json` and adapter skill trees, and leaves existing non-DevFlow project files intact.

## Sub-features

- `install-dry-run` previews the install footprint without writing files.
- `install-fresh` installs `AGENTS.md`, `CLAUDE.md`, `.agents/skills/`, `.claude/skills/`, `devflow/`, and `.nexus/nexus-devflow.json`.
- `install-role-full` scaffolds SA directories (`devflow/inbox`, `devflow/analysis`, `devflow/blueprints`) when `--role full` is used.

## How to get to it (user POV)

- Run `create-nexus-devflow <target> --dry-run --role full` to preview changes.
- Run `create-nexus-devflow <target> --yes --role full` to install non-interactively.

## Driving it with create-nexus-devflow

Preconditions:

- `$Cli` points to `packages/create-nexus-devflow/dist/bin/create-nexus-devflow.js` and Doctor passed.
- `$Target` is a fresh empty directory containing a sample user file `README.md` (`"My App"`).

- **Dry-run preview.** Run `node $Cli $Target --dry-run --role full`. Exit code is `0`, stdout prints `Files to create`, and `Test-Path (Join-Path $Target ".nexus")` is `False`.
- **Fresh overlay install.** Run `node $Cli $Target --yes --role full`. Exit code is `0` and stdout prints `Nexus-DevFlow overlay successfully installed!`.
- **Verify workspace footprint.** Check `Test-Path` for `.nexus/nexus-devflow.json`, `AGENTS.md`, `CLAUDE.md`, `.agents/skills/feature/SKILL.md`, `.claude/skills/feature/SKILL.md`, `devflow/context/project-overview.md`, and `devflow/inbox`. All return `True`.
- **Verify user file untouched.** Run `Get-Content (Join-Path $Target "README.md") -Raw`. Content still equals `"My App"`.
- **Proof.** Copy `.nexus/nexus-devflow.json` to `$ProofDir/install-manifest.json` and record stdout + exit codes to `$ProofDir/install-overlay.log`.

## Gotchas

- Without `--yes`, interactive prompts wait for stdin if conflicts or extras setup triggers.
- `prepare-template` must be run after editing skills or `devflow/` in the repo, otherwise `templateRoot` is missing or stale.
- `--dry-run` still runs `validateInstallDestinations`; verify `$Target` remains free of `.nexus/` afterward.
