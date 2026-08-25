# Release Process

This guide is for framework maintainers preparing a Nexus-DevFlow release. Keep the flow manual-first, use only the commands that already exist in this repository, and treat validation evidence as the release gate.

---

## 1. Pre-Release Readiness

- Confirm the intended release scope before changing version or release wording.
- Confirm that maintainer-facing and user-facing docs (`README.md`, `README.th.md`, `docs/`) stay aligned.
- Review `ROADMAP.md` only for a status refresh when the release changes roadmap milestones.
- Decide whether the release is patch, minor, or major according to Semantic Versioning.

---

## 2. Validation Suite

Run baseline checks from the framework root:

```bash
npm run check
npm run check:static
npm test
npm run test:package
```

Release only after all validation steps pass with exit code 0.

---

## 3. Install & Upgrade Verification

Verify that the overlay package builds and updates cleanly:

```bash
npx @jakkrichm/create-nexus-devflow update --dry-run
```

---

## 4. Release Notes

- Summarize user-facing changes separately from maintainer-only changes in `CHANGELOG.md`.
- Call out changes to release, install, or upgrade guidance explicitly.
- State whether the release is patch, minor, or major and why.

---

## 5. Tagging & Release Policy

- **Commits to `main`**: Internal maintenance, documentation tweaks, or minor refactoring that does not affect the npm overlay package should be pushed directly to `main` without creating a git tag.
- **Git Tag Releases (`v*`)**: Create and push git tags (`v2.5.x`) only when there is a functional update to `@jakkrichm/create-nexus-devflow` or a new release intended for npm publishing and GitHub Releases.
