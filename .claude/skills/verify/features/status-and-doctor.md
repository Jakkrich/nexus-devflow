# Status and doctor

Status and doctor inspect an installed workspace from disk, reporting current run state, completion readiness, and configuration health in human or JSON format.

## Sub-features

- `status-human` renders the readable workspace summary.
- `status-json` returns structured JSON with `currentWork`, `completion`, `findings`, and `warnings`.
- `doctor-json` evaluates workspace diagnostics and returns pass/fail checks.

## How to get to it (user POV)

- Run `create-nexus-devflow status <target>` or `create-nexus-devflow status <target> --json`.
- Run `create-nexus-devflow doctor <target>` or `create-nexus-devflow doctor <target> --json`.

## Driving it with create-nexus-devflow

Preconditions:

- `$Target` has a completed fresh overlay install (`node $Cli $Target --yes --role full`).

- **Human status.** Run `node $Cli status $Target`. Exit code is `0` and stdout summarizes the workspace without unhandled errors.
- **JSON status.** Run `node $Cli status $Target --json | Tee-Object -FilePath "$ProofDir\status.json"`. Exit code is `0`, and `ConvertFrom-Json` succeeds with `currentWork.state -eq "idle"` and `configuration.values.execution.tier -in @("auto", "docs", "standard", "high-risk")`.
- **Doctor check.** Run `node $Cli doctor $Target --json | Tee-Object -FilePath "$ProofDir\doctor.json"`. Exit code is `0`, valid JSON is returned, and `checks` includes `verification_driver_skill`.
- **Proof.** Save combined command log and parsed field assertions (`currentWork.state`, `completion.state`, `execution.tier`, `verification_driver_skill`, doctor summary) in `$ProofDir/status-and-doctor.log`.

## Gotchas

- `status` uses the target directory as the second positional argument (`status $Target`), not `status --target` only; both work, so pass `$Target` explicitly.
- ANSI color codes appear in human output unless `--json` is used.
