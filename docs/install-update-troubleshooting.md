# Install And Update Troubleshooting

Use this guide when Nexus-DevFlow install, check, or update behavior is not what you expected.

## Commands Covered

- `npm.cmd run codex:check-global`
- `npm.cmd run codex:update-global`
- `npm.cmd run codex:update-global:pull`
- `npm.cmd run validate`
- `npm.cmd run validate:all`

Run these commands from the framework root:

```powershell
cd D:\Projects\nexus-devflow
```

## Start With The Smallest Useful Check

If you are not sure where the problem is, use this order:

1. Run `npm.cmd run codex:check-global`
2. Run `npm.cmd run validate`
3. Run `npm.cmd run validate:all` when you need the broadest repo check

This keeps the first pass aligned with the real lifecycle commands before you try a broader update.

## Global Check Fails

Run:

```powershell
npm.cmd run codex:check-global
```

What this command checks:

- the global Nexus-DevFlow skill exists
- the global manifest exists
- the manifest points at this framework root
- the installed version matches the current local framework version
- framework validation still passes

If the check fails:

1. Confirm you are in `D:\Projects\nexus-devflow`
2. Read the error closely to see whether it is a missing install, a root mismatch, a version mismatch, or a validation failure
3. Run `npm.cmd run codex:update-global` if the global install needs to be refreshed from your current local checkout
4. Run `npm.cmd run codex:check-global` again
5. Run `npm.cmd run validate` if the failure points at framework validation rather than the global install itself

## Update After Local Changes Or A Dirty Worktree

If you want to pull latest framework changes before updating, the supported command is:

```powershell
npm.cmd run codex:update-global:pull
```

This path refuses to pull when the working tree is dirty.

Check the worktree first:

```powershell
git status --short
```

If local changes are present:

1. Do not pull blindly
2. Decide whether to commit the local work, stash it, or skip the pull path for now
3. Only use `npm.cmd run codex:update-global:pull` after the worktree is clean

If you already have the version you want in your local checkout, use:

```powershell
npm.cmd run codex:update-global
```

That updates the global install from the current local framework without pulling.

## Update Succeeds But You Want Post-Update Confidence

Run:

```powershell
npm.cmd run codex:check-global
npm.cmd run validate
```

Use:

```powershell
npm.cmd run validate:all
```

when you want the full maintainer-level validation sweep after a broader documentation or framework change.

## Validation Fails After Install Or Update

Run:

```powershell
npm.cmd run validate
```

Use this first when you need the core framework signal. If that passes but you still need broader confidence, run:

```powershell
npm.cmd run validate:all
```

Because `validate:all` includes the documentation contract scan and the supporting script checks, use it when the change touches more than the narrow global install surface.

## Practical Recovery Paths

- Global install missing or stale: run `npm.cmd run codex:update-global`, then `npm.cmd run codex:check-global`
- Pull-based update blocked by local edits: inspect `git status --short`, clean or intentionally preserve the worktree, then retry `npm.cmd run codex:update-global:pull`
- Core framework validation issue: run `npm.cmd run validate` and fix that result before trusting the install
- Broader maintainer confidence needed: run `npm.cmd run validate:all`
