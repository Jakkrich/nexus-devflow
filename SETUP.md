# Nexus-DevFlow Setup Guide

This setup uses npm, the `.agent` bundle, and a Codex global skill. The legacy Python switcher is no longer used.

## 1. Clone the Framework

Place the framework in a shared tools folder. For this machine the canonical path is:

```powershell
D:\Projects\nexus-devflow
```

## 2. Install Globally for Codex

Run this once from the Nexus-DevFlow directory:

```powershell
cd D:\Projects\nexus-devflow
npm run codex:install-global
```

The installer creates:

- `%USERPROFILE%\.codex\skills\nexus-devflow\SKILL.md`
- `%USERPROFILE%\.codex\nexus-devflow.json`
- a managed Nexus-DevFlow section in `%USERPROFILE%\.codex\AGENTS.md`

After that, Codex can use Nexus-DevFlow from any project when you ask for DevFlow or numbered workflows such as:

```text
/05-Goal "add password reset with email token and regression tests"
/30-Task "Add password reset"
/31-Plan 001
/32-Code 001
/33-Verify 001
```

The global install keeps the framework engine in `D:\Projects\nexus-devflow`. Project-specific artifacts should stay in each target project's own `.workspaces` directory.

## 3. Check and Update Codex Global Install

When you want Codex to verify or refresh the global Nexus-DevFlow install, ask Codex to run one of these from the framework root:

```powershell
cd D:\Projects\nexus-devflow
npm run codex:check-global
npm run codex:update-global
npm run codex:update-global:pull
```

- `codex:check-global` verifies the global skill, manifest, installer syntax, and framework validation.
- `codex:update-global` reinstalls the Codex global skill from the local checkout and validates the framework.
- `codex:update-global:pull` first runs `git pull --ff-only`, then reinstalls and validates. It refuses to pull if the working tree is dirty.

## 3. Optional Project-Local Install

### Manual Installation (Alternative)

If you don't want to clone the entire repository, you can manually copy the essential framework files into your own project:

1. Copy the `.agent/` folder into your project root.
2. Copy the `scripts/` folder into your project root.
3. Merge the `"scripts"` block from `package.json` into your project's `package.json`.
4. (Optional) Copy documentation files like `README.md`, `SETUP.md`, `ROADMAP.md`, `AGENTS.md`, and `INITIAL.md` for reference.

## 4. Activate the Agent Bundle

```powershell
npm run activate
```

This command:

- Confirms `.agent` exists
- Creates `.workspaces/roadmap`
- Creates `.workspaces/specs`
- Creates `.workspaces/issues`
- Creates `.workspaces/research`
- Writes `.workspaces/active-agent.json`
- Regenerates `.workspaces/project_index.json`
- Regenerates `.workspaces/roadmap/project_index.json`

## 5. Validate the Framework

```powershell
npm run validate
```

Validation checks required files, generated JSON artifacts, roadmap feature references, and legacy files that should no longer exist.

## 6. Use the PRP CLI

```powershell
npm run agent -- --help
npm run agent:status
```

Create a task:

```powershell
npm run agent -- init 001 "Example Task" example-task "Describe the task"
```

## 7. Link Framework into Your Project (Symlink)

If you have cloned Nexus-DevFlow in a central location and want to use it in multiple projects, you can link it automatically using the `link-project` script. This script will create symbolic links (or junctions on Windows) for `.agent` and `scripts/` into your target project.

```powershell
# Inside the Nexus-DevFlow directory, run:
npm run link-project -- <path-to-your-project>

# Example:
npm run link-project -- D:\MyProjects\AwesomeApp
```

After linking, copy or adapt the `scripts` section from Nexus-DevFlow's `package.json` into your project's `package.json` to enable `npm run agent`, `npm run validate`, etc.

### What to Link vs. What to Keep Project-Specific

It is critical to separate the framework engine from your project's data:

**✅ Things that SHOULD be Linked (Shared Engine):**
- **`.agent/`**: Contains the core workflows, skills, and agent instructions. This keeps all your projects using the same updated standards.
- **`scripts/`**: Contains the Node.js automation scripts that power the `npm run` commands.

**❌ Things that MUST NOT be Linked (Project-Specific Data):**
- **`.workspaces/`**: This folder stores your project's tasks, specs, research, and roadmap. It is the "brain" of your specific project. Linking this would mix tasks across all your projects.
- **`package.json`**: You must keep your project's own `package.json` for dependencies. Only copy the `"scripts"` block from the framework.
- **`INITIAL.md` / `ROADMAP.md`**: These contain context and planning strictly for the specific project you are building.

## Expected Files After Activation

```text
.agent/
.workspaces/active-agent.json
.workspaces/project_index.json
.workspaces/roadmap/project_index.json
.workspaces/roadmap/roadmap_discovery.json
.workspaces/roadmap/roadmap.json
```

Run `npm run validate` whenever framework structure changes.

