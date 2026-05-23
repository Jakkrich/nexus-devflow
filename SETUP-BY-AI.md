# Nexus-DevFlow Setup By AI

This playbook is for AI assistants installing or upgrading Nexus-DevFlow for a user. It is provider-neutral. Adapt the final integration step to the AI environment you are running in, but keep the checks and safety rules intact.

## Mission

Install or upgrade Nexus-DevFlow so the user's AI tools can call the framework workflows, read the `.agent` bundle, and keep task artifacts in each target project's `.workspaces` folder.

Always report:

- framework root
- framework version
- target project, if any
- target AI provider or tool
- install mode used
- files created or changed
- validation commands and results
- manual follow-up required from the user

## Safety Rules

- Do not overwrite user-authored instructions without preserving existing content.
- Do not link or copy `.workspaces` from the framework into target projects.
- Do not run `git pull` with a dirty working tree.
- Do not assume the AI provider's instruction file path. Detect it or ask the user.
- Do not claim the install is complete until validation has run and the output has been checked.
- Prefer idempotent managed blocks with clear start/end markers when editing provider instruction files.

## Terms

- Framework root: the local Nexus-DevFlow repository, such as `D:\Projects\nexus-devflow`.
- Target project: the user's application repository that will use Nexus-DevFlow.
- Provider instruction file: the file where the active AI tool reads standing instructions, such as `AGENTS.md`, `CLAUDE.md`, provider-specific rules, or a skill/command registry.
- Installed manifest: a provider-specific record that stores the framework root and version. Codex uses `%USERPROFILE%\.codex\nexus-devflow.json`.

## Phase 1. Detect Context

Run or inspect:

```powershell
pwd
git status --short
node --version
npm --version
```

Find the framework root:

1. Prefer the repository that contains `package.json`, `.agent/`, `scripts/`, and `CHANGELOG.md`.
2. If multiple candidates exist, ask the user which one is canonical.
3. Read `package.json` and record `version`.
4. Read `CHANGELOG.md` and record the latest changelog entry.

Useful checks:

```powershell
Get-Content package.json
Get-Content CHANGELOG.md -TotalCount 80
npm run validate
```

## Phase 2. Choose Install Mode

Use one of these modes.

### Mode A. Codex Global Install

Use this when the provider is Codex and the framework checkout should be available from any project.

Commands from the framework root:

```powershell
npm run codex:update-global
npm run codex:check-global
```

Expected outputs:

- global skill path under `%USERPROFILE%\.codex\skills\nexus-devflow\SKILL.md`
- global manifest at `%USERPROFILE%\.codex\nexus-devflow.json`
- managed Nexus-DevFlow block in `%USERPROFILE%\.codex\AGENTS.md`
- `codex:check-global` prints `Version: <package version>`

After install, read the manifest and confirm:

- `name` is `nexus-devflow`
- `version` equals root `package.json` version
- `framework_root` equals the detected framework root
- `update_commands.check` exists
- `update_commands.update` exists

### Mode B. Provider Instruction Install

Use this for AI tools that read repository-level or user-level instruction files but do not have a built-in Nexus installer.

1. Detect the provider instruction file. Common examples:
   - `AGENTS.md`
   - `CLAUDE.md`
   - provider-specific rules or memory files
   - a user-level skill or command directory
2. Add a managed Nexus-DevFlow block.
3. Include the framework root, version, update/check commands, and routing instructions.

Recommended managed block:

```markdown
<!-- nexus-devflow:start -->
# Nexus-DevFlow

Use Nexus-DevFlow when the user asks for DevFlow, PRP workflows, or numbered commands such as /05-Goal, /10-Brainstorm, /30-Task, /31-Plan, /32-Code, /33-Verify, /40-Test, /53-Changelog, /55-PR-Review, or /99-Help.

Framework root: `<absolute-framework-root>`
Framework version: `<package-version>`

Before running a workflow:
- Read the matching file under `<absolute-framework-root>/.agent/workflows/`.
- Keep target project artifacts in the target project's `.workspaces` directory.
- Use PRP CLI commands for JSON artifacts whenever possible.
- Run validation before reporting completion.

Update/check:
- Check local framework: `npm run validate`
- Check installed provider integration: inspect this managed block and compare Framework version with `<absolute-framework-root>/package.json`
- Upgrade local checkout: check `git status --short`; if clean, pull or ask the user to approve pull; then reapply this block with the new package version.
<!-- nexus-devflow:end -->
```

Replace every angle-bracket value with the real framework root and package version before saving the installed block.

### Mode C. Project-Local Link

Use this when a target project should call Nexus-DevFlow scripts directly.

From the framework root:

```powershell
npm run link-project -- <absolute-target-project-path>
```

Then merge the relevant `scripts` block from the framework `package.json` into the target project's `package.json`.

Verify in the target project:

```powershell
npm run activate
npm run validate
npm run agent -- --help
```

Confirm `.workspaces` is project-local, not linked to the framework.

### Mode D. Project-Local Copy

Use this only when symlinks are not allowed.

Copy into the target project:

- `.agent/`
- `scripts/`

Then merge npm scripts manually and run:

```powershell
npm run activate
npm run validate
```

Record that future upgrades require copying `.agent/` and `scripts/` again from the updated framework checkout.

## Phase 3. Upgrade Procedure

Before upgrading:

```powershell
cd <framework-root>
git status --short
Get-Content package.json
Get-Content CHANGELOG.md -TotalCount 80
```

If `git status --short` is not clean:

1. Do not pull.
2. Report the dirty files.
3. Ask whether to commit, stash, discard, or skip pulling.

If clean and the user wants latest repository changes:

```powershell
git pull --ff-only
```

After pulling or after the user provides a newer checkout:

```powershell
npm run validate
```

Then reapply the provider install:

- Codex: `npm run codex:update-global` then `npm run codex:check-global`
- Other providers: update the managed instruction block version and framework root if needed
- Project-local link: verify links still point to the framework root
- Project-local copy: recopy `.agent/` and `scripts/`, then validate in the target project

## Phase 4. Version Checks

Always compare versions in this order:

1. Current framework version: root `package.json` field `version`
2. Human-readable release notes: latest heading in `CHANGELOG.md`
3. Provider installed version:
   - Codex: `%USERPROFILE%\.codex\nexus-devflow.json` field `version`
   - Other providers: managed instruction block `Framework version`
   - Project-local copy: target project's copied `.agent/package.json` version, if present
4. Report mismatches clearly.

A provider install is current only when the provider installed version equals root `package.json` version and validation passes.

## Phase 5. Validation Checklist

Run from the framework root:

```powershell
npm run validate
node --check scripts\install-codex-global.mjs
node --check scripts\update-codex-global.mjs
```

For Codex global install:

```powershell
npm run codex:check-global
```

For project-local install, run from the target project:

```powershell
npm run activate
npm run validate
npm run agent -- --help
```

If the task involves generated task artifacts, also run:

```powershell
npm run agent -- validate <task-id>
```

## Phase 6. Final Report Format

Respond to the user with:

```text
Nexus-DevFlow setup result
- Mode:
- Framework root:
- Framework version:
- Target project:
- Provider:
- Installed version:
- Files changed:
- Validation:
- Warnings or manual steps:
```

Keep the report concise, but include exact commands that passed or failed.

## Provider Adaptation Notes

- Codex: use the built-in scripts in this repository.
- Claude-like tools: add the managed block to the instruction file that the tool actually reads, often `CLAUDE.md` or a project memory file.
- Cursor-like tools: add the managed block to the rule/instruction surface the user confirms is active.
- Other IDE agents: prefer a project-root `AGENTS.md` managed block unless the provider has a dedicated skill or memory mechanism.

If unsure, ask the user where their AI tool reads persistent instructions. Do not guess and write to random provider files.
