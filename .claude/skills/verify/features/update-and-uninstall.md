# Update and uninstall

Update synchronizes managed framework files while backing up overwritten files and preserving user customizations unless forced, and uninstall removes DevFlow cleanly from the workspace.

## Sub-features

- `update-dry-run` inspects pending creates, updates, orphans, and conflicts without touching disk.
- `update-preserve` keeps non-managed user files intact and creates `.nexus/backups/` when updating managed files.
- `uninstall-clean` removes DevFlow artifacts via `uninstall --yes` while leaving user source files untouched.

## How to get to it (user POV)

- Run `create-nexus-devflow update <target> --dry-run` or `create-nexus-devflow update <target> --yes`.
- Run `create-nexus-devflow uninstall <target> --dry-run --json` or `create-nexus-devflow uninstall <target> --yes`.

## Driving it with create-nexus-devflow

Preconditions:

- `$Target` has an installed overlay plus a non-managed user file `src/app.ts` (`"export const ok = true;"`).

- **Modify a managed skill to test conflict detection.** Append a comment line to `$Target/.agents/skills/feature/SKILL.md`.
- **Dry-run update.** Run `node $Cli update $Target --dry-run`. Exit code is `0`, stdout reports `Conflicts found : 1`, and `.nexus/backups/` does not exist.
- **Apply update with `--yes`.** Run `node $Cli update $Target --yes`. Exit code is `0` and `Test-Path (Join-Path $Target ".nexus\backups")` is `True`.
- **Dry-run uninstall JSON.** Run `node $Cli uninstall $Target --dry-run --json | Tee-Object -FilePath "$ProofDir\uninstall-plan.json"`. Exit code is `0` and `dryRun` is `true`.
- **Apply uninstall.** Run `node $Cli uninstall $Target --yes`. Exit code is `0`, `Test-Path (Join-Path $Target ".nexus")` is `False`, and `Get-Content (Join-Path $Target "src\app.ts") -Raw` still equals `"export const ok = true;"`.
- **Proof.** Save `$ProofDir/uninstall-plan.json` and `$ProofDir/update-and-uninstall.log`.

## Gotchas

- `update --yes` bypasses conflict confirmation with `defaultYes: true`, which overwrites the modified managed file after backing it up in `.nexus/backups/`. Never assume `--yes` skips conflicts.
- `uninstall` keeps files not owned by DevFlow (`src/app.ts`); verify both `.nexus/` removal and `src/app.ts` survival.
