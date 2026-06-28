# Release Process

This guide is for framework maintainers preparing a Nexus-DevFlow release. Keep the flow manual-first, use only the commands that already exist in this repository, and treat validation evidence as the release gate.

## Pre-Release Readiness

- Confirm the intended release scope before changing version or release wording.
- Confirm that maintainer-facing and user-facing docs stay aligned for any changed guidance.
- Review `ROADMAP.md` only for a small status or progress refresh when the release actually changes roadmap state.
- Decide whether the release is mostly maintainer-facing guidance, broader framework capability, or a change that needs migration notes.

## Validation

Run the baseline checks from the framework root:

```powershell
npm.cmd run roadmap:validate
npm.cmd run validate
npm.cmd run validate:all
```

Release only after the validation path is green. If a documentation-only change fails validation, fix the contract problem before continuing.

For framework behavior changes, also run a feature benchmark:

```powershell
npm.cmd run benchmark:feature -- --feature <release-or-feature-slug>
npm.cmd run benchmark:html
```

Use the latest comparable `.workspaces/benchmarks/*.benchmark.json` as `--baseline` when one exists. Document any negative delta or accepted trade-off in the release notes.

## Install And Upgrade Verification

Use the real global lifecycle commands to verify that the released framework can still be checked and updated intentionally:

```powershell
npm.cmd run codex:check-global
npm.cmd run codex:update-global
```

After running the update path, re-run the core validation check:

```powershell
npm.cmd run validate
```

Use `npm.cmd run codex:update-global` when the local framework checkout is the source you want to install globally. Use the broader upgrade-path guide when a pull-based update or release-type decision needs more context.

## Release Notes

- Summarize user-facing changes separately from maintainer-only changes.
- Call out changes to release, install, or upgrade guidance explicitly.
- State whether the release is patch, minor, or major and why.
- Note any manual follow-up expected after upgrading.
