# Nexus-DevFlow Setup Guide

This setup uses npm and the `.agent` bundle. The legacy Python switcher is no longer used.

## 1. Clone the Framework

Place the framework in a shared tools folder or directly inside the repository that will use it.

```powershell
git clone https://github.com/Jakkrich/nexus-devflow
cd nexus-devflow
```

## 2. Install With AI Prompt

Recommended for AI-enabled IDEs such as Antigravity: clone Nexus-DevFlow once into a tools folder, then ask the AI to install or link it into the project you are currently working on.

Example folder layout:

```text
D:\Tools\nexus-devflow        # cloned framework
D:\Projects\AwesomeApp        # target project
```

Open the target project in your AI IDE, then paste a prompt like this:

```text
I have cloned Nexus-DevFlow at:
D:\Tools\nexus-devflow

Please install Nexus-DevFlow into this project.

Follow these rules:
- Inspect this project's package.json first.
- Link or copy only the framework engine files needed for DevFlow:
  - .agent/
  - scripts/
- Do not link or copy .workspaces/ from the framework repo.
- Keep this project's own package.json dependencies intact.
- Merge only the useful Nexus-DevFlow npm scripts into this project's package.json.
- Create project-local .workspaces folders by running the framework activation step.
- Validate the setup when finished.
- Report exactly what changed and which validation checks passed.

If symlinks or junctions require permission, ask me before doing that step.
```

For a safer copy-based install instead of links, use:

```text
I have cloned Nexus-DevFlow at:
D:\Tools\nexus-devflow

Please copy Nexus-DevFlow into this project without symlinks.

Copy:
- .agent/
- scripts/

Then merge the Nexus-DevFlow npm scripts into this project's package.json without removing existing scripts.
Do not copy .workspaces/.
After copying, activate and validate the framework.
Show me the changed files and any validation result.
```

For a link-based install across many projects, use:

```text
I have cloned Nexus-DevFlow at:
D:\Tools\nexus-devflow

Please link Nexus-DevFlow into this project using the framework's link-project workflow.

Target project:
<current project root>

Rules:
- Link .agent/ and scripts/ only.
- Never link .workspaces/.
- Merge npm scripts carefully into package.json.
- Activate and validate after linking.
- Tell me if Windows administrator permission or developer mode is needed for symlinks.
```

After installation, normal usage should be through DevFlow prompts, for example:

```text
/05-Goal "add password reset with email token and regression tests"
/30-Task "Add password reset"
/31-Plan 001
/32-Code 001
/33-Verify 001
```

The AI should run the behind-the-scenes commands, update JSON artifacts through the PRP CLI, and summarize validation results.

## 3. Manual Installation (Alternative)

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

