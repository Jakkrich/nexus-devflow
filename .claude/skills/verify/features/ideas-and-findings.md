# Ideas and findings

Ideas and findings let users record ideas into `devflow/ideas.md`, track severity-ranked review findings, resolve them, and enforce quality gate exit codes via `check-gate`.

## Sub-features

- `idea-add-list` appends a titled idea and returns it via `ideas --json`.
- `finding-blocker` records a `P0`/`P1` finding and causes `check-gate` to fail with exit code `1`.
- `finding-resolve` closes a finding and restores `check-gate` exit code `0`.

## How to get to it (user POV)

- Run `create-nexus-devflow idea add "<text>" <target> --title "<title>"` and `create-nexus-devflow ideas <target> --json`.
- Run `create-nexus-devflow findings add "<title>" --severity P1 <target>`, `create-nexus-devflow findings resolve <id> <target>`, and `create-nexus-devflow check-gate <target>`.

## Driving it with create-nexus-devflow

Preconditions:

- `$Target` has a fresh overlay install (`node $Cli $Target --yes --role full`).

- **Add idea.** Run `node $Cli idea add "Support offline cache" $Target --title "Offline Cache" --json`. Exit code is `0` and JSON contains the generated `id` and `title`.
- **Read ideas.** Run `node $Cli ideas $Target --json | Tee-Object -FilePath "$ProofDir\ideas.json"`. Exit code is `0` and the saved JSON includes `"Offline Cache"`.
- **Add P1 blocker.** Run `node $Cli findings add "Unvalidated config path" --severity P1 $Target --json | Tee-Object -FilePath "$ProofDir\finding-added.json"`. Extract `finding.id`.
- **Check gate fails.** Run `node $Cli check-gate $Target --json | Tee-Object -FilePath "$ProofDir\gate-blocked.json"`. Exit code is `1` and `passed` is `false` with `findingsBlockers -ge 1`.
- **Resolve blocker.** Run `node $Cli findings resolve <id> $Target --json`. Exit code is `0` and `success` is `true`.
- **Check gate passes.** Run `node $Cli check-gate $Target --json | Tee-Object -FilePath "$ProofDir\gate-passed.json"`. Exit code is `0` and `passed` is `true`.
- **Proof.** Retain `$ProofDir/ideas.json`, `$ProofDir/finding-added.json`, `$ProofDir/gate-blocked.json`, `$ProofDir/gate-passed.json`, and `$ProofDir/ideas-and-findings.log`.

## Gotchas

- `check-gate` intentionally exits `1` when blockers exist; capture `$LASTEXITCODE` instead of letting PowerShell `set -e`-style checks abort before reading `gate-blocked.json`.
- Positional order matters: `idea add "<text>" $Target`, not `$Target` before `"<text>"`.
