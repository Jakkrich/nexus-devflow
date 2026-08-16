# Release Process

This guide is for framework maintainers preparing a Nexus-DevFlow release. Keep the flow manual-first, use only the commands that already exist in this repository, and treat validation evidence as the release gate.

## Pre-Release Readiness

- Confirm the intended release scope before changing version or release wording.
- Confirm that maintainer-facing and user-facing docs stay aligned for any changed guidance.
- Review `ROADMAP.md` only for a small status or progress refresh when the release actually changes roadmap state.
- Decide whether the release is patch, minor, or major according to Semantic Versioning.

## Validation

Run the baseline checks from the framework root:

```powershell
npm run check
npm run check:static
npm test
npm run test:routing
npm run test:package
```

Release only after all validation steps pass.

## Install And Upgrade Verification

Verify that the overlay package builds and updates cleanly:

```powershell
npx @jakkrichm/create-nexus-devflow update --dry-run
```

## Release Notes

- Summarize user-facing changes separately from maintainer-only changes in `CHANGELOG.md`.
- Call out changes to release, install, or upgrade guidance explicitly.
- State whether the release is patch, minor, or major and why.
