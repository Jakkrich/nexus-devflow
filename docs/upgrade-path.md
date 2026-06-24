# Upgrade Path

This guide explains how maintainers should classify Nexus-DevFlow releases, choose the right update path, and confirm the framework still behaves as expected after an update.

## Release Types

### Patch

Use `patch` for documentation refinement, validation tightening, or internal cleanup that does not change the public DevFlow workflow surface.

Expected maintainer posture:

- Check the installed state first.
- Update from the local checkout when that is the intended source.
- Re-run the normal validation path after the update.

### Minor

Use `minor` for new framework capability, new maintainer guidance, or broader artifact support that keeps the public command model stable.

Expected maintainer posture:

- Verify the current install state before upgrading.
- Re-run core validation after the update.
- Use broader validation when the release touches multiple framework surfaces.

### Major

Use `major` for a change that alters stable maintainer or team expectations, changes workflow assumptions, or needs a meaningful migration note.

Expected maintainer posture:

- Check the installed state before updating.
- Decide whether a pull-backed update is required to bring the local checkout to the intended release.
- Run the broadest validation path after updating.
- Document any required migration or follow-up step in the release notes.

## Upgrade Flow

1. Run the global status check:

```powershell
npm.cmd run codex:check-global
```

2. Choose the update path:

```powershell
npm.cmd run codex:update-global
```

Use this when the current local checkout is already the version you want to install globally.

```powershell
npm.cmd run codex:update-global:pull
```

Use this when you intentionally want the updater to pull the latest repository state first. Do not use the pull path blindly when the worktree is dirty.

3. Re-run the baseline framework validation:

```powershell
npm.cmd run validate
```

4. Run the broader validation path when the release affects multiple docs, scripts, workflow surfaces, or policy guidance:

```powershell
npm.cmd run validate:all
```

## Post-Update Expectations

After a successful update:

- `codex:check-global` should no longer report a mismatch for the installed global framework.
- `validate` should pass for the current framework checkout.
- `validate:all` should pass when the upgrade had broader framework impact.
- Maintainers should be able to explain whether the release was patch, minor, or major and what follow-up, if any, teams need.

If the update path fails, stop and fix the release or local checkout state before telling teams to upgrade.
