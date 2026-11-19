# `create-nexus-devflow` CLI verification map

This directory is the maintained source for verifying the user-facing CLI behavior of `create-nexus-devflow`. Read this index before driving the CLI, then follow the matching feature recipe.

## Baseline preconditions

- Build `packages/create-nexus-devflow` (`npm --prefix packages/create-nexus-devflow run build`) and prepare its template (`npm --prefix packages/create-nexus-devflow run prepare-template`).
- Allocate an isolated disposable directory (`$Target` under OS temp) and a separate persistent `$ProofDir` under `devflow/reports/verify-proof/$RunId`.
- Run the Doctor check (`node $Cli --version` and `Test-Path .../template/AGENTS.md`) before starting.
- Never drive the repository root as `$Target` or reuse another run's `$Target`.

## Driving conventions

- Invoke `node $Cli ...` literally with the documented subcommands and flags.
- Always pair mutating CLI commands with a second read-only check (`status --json`, `ideas --json`, `findings --json`, or `Test-Path`/`Get-Content`).
- Capture command text, stdout, stderr, exit code, and verified JSON/file snapshots in `$ProofDir`.
- Keep implementation internals out of this map; assert observable CLI outputs, exit codes, and workspace files.
- Report any unreachable path with the attempted command and unmet precondition; never claim a skipped path passed.

## Feature entry contract

Each feature file starts with an H1 title and one summary paragraph, followed by four H2 sections in order:

1. `Sub-features`
2. `How to get to it (user POV)`
3. `Driving it with create-nexus-devflow` (starts with `Preconditions:`)
4. `Gotchas`

## Features

- [Overlay install](./install-overlay.md) covers fresh install, `--dry-run` non-mutation, and adapter/manifest creation.
- [Status and doctor](./status-and-doctor.md) covers JSON and human status reporting plus diagnostic checks.
- [Ideas and findings](./ideas-and-findings.md) covers adding/listing ideas, adding/resolving P0/P1 findings, and `check-gate` exit behavior.
- [Update and uninstall](./update-and-uninstall.md) covers conflict detection, non-destructive update, backup creation, and clean uninstall.
