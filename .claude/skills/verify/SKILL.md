---
name: verify
description: "Drive the built create-nexus-devflow CLI in an isolated temp workspace to prove overlay install, status, doctor, ideas, findings, check-gate, update, and uninstall end to end."
---

# Verify `create-nexus-devflow` CLI

Drive the real compiled `create-nexus-devflow` CLI (`packages/create-nexus-devflow/dist/bin/create-nexus-devflow.js`) against a disposable workspace outside this checkout, observe stdout, exit codes, and files on disk, and preserve proof artifacts under `devflow/reports/verify-proof/<run-id>/` (gitignored).

Read [`features/README.md`](features/README.md) first, then open the matching feature recipe before driving it.

## Launch

This surface is a short-lived CLI with no background server. Prepare the runnable binary and template once per run, then allocate an isolated target directory in OS temp space:

```powershell
npm --prefix packages/create-nexus-devflow run build
npm --prefix packages/create-nexus-devflow run prepare-template
$RunId = (Get-Date -Format "yyyyMMdd-HHmmss") + "-" + ([guid]::NewGuid().ToString("N").Substring(0, 6))
$Target = Join-Path ([IO.Path]::GetTempPath()) "devflow-verify-$RunId"
$ProofDir = "d:\devtools\nexus-devflow\devflow\reports\verify-proof\$RunId"
New-Item -ItemType Directory -Force -Path $Target, $ProofDir | Out-Null
```

Never point `$Target` at the repository root or another active session's temp directory. Every run uses its own `$Target` and `$ProofDir`.

## Doctor

Run this read-only check before driving any feature to confirm the built entrypoint and template exist and match `package.json`:

```powershell
$Cli = "d:\devtools\nexus-devflow\packages\create-nexus-devflow\dist\bin\create-nexus-devflow.js"
node $Cli --version
Test-Path "d:\devtools\nexus-devflow\packages\create-nexus-devflow\template\AGENTS.md"
Test-Path "d:\devtools\nexus-devflow\packages\create-nexus-devflow\template\.nexus\nexus-devflow.json"
```

Expected: `--version` prints `2.20.5` (matching `packages/create-nexus-devflow/package.json`) with exit code `0`, and `Test-Path` on `template/AGENTS.md` returns `True` (`template/.nexus/nexus-devflow.json` is generated in `$Target` on install, so `AGENTS.md` + `.agents/skills` in `template/` are the preflight check). If `template/AGENTS.md` is `False`, re-run `prepare-template` before continuing.

## Drive

Invoke the compiled CLI directly with `node $Cli ...` using the literal commands in the feature map:

- **Overlay install:** `node $Cli $Target --yes --role full`
- **Status & doctor:** `node $Cli status $Target --json` and `node $Cli doctor $Target --json`
- **Ideas & findings:** `node $Cli idea add "..." $Target --title "..." --json`, `node $Cli findings add "..." --severity P1 $Target --json`, `node $Cli check-gate $Target --json`
- **Update & uninstall:** `node $Cli update $Target --yes` and `node $Cli uninstall $Target --yes`

Use `--json` for machine-readable assertions and a second read-only command (`status --json`, `ideas --json`, `findings --json`, `Get-Content`) to confirm persistence on disk.

## Evidence

Capture proof for every driven step inside `$ProofDir` (never inside `$Target`, because Cleanup deletes `$Target`):

1. Save the exact command, stdout, stderr, and `$LASTEXITCODE` to `$ProofDir/<feature>.log`.
2. Save JSON outputs or read-only file snapshots (`status.json`, `doctor.json`, `manifest.json`, `ideas.md`) to `$ProofDir/`.
3. Record both the mutation step and a second read-only observation proving the on-disk state matches.
4. For `--dry-run`, verify via file existence / hash timestamps that `$Target` was NOT modified.

## Cleanup

Remove only the disposable `$Target` workspace created by this run and clean generated package templates if needed; **never delete `$ProofDir`**:

```powershell
if (Test-Path $Target) { Remove-Item -Recurse -Force $Target }
npm --prefix packages/create-nexus-devflow run clean-template
```

Confirm `Test-Path $ProofDir` is still `True` after cleanup.
