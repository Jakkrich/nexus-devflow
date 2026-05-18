# PRPs-Framework Setup Guide

This setup uses npm and the `.agent` bundle. The legacy Python switcher is no longer used.

## 1. Clone or Copy the Framework

Place the framework in a shared tools folder or directly inside the repository that will use it.

```powershell
git clone <repo-url> PRPs-Framework
cd PRPs-Framework
```

## 2. Activate the Agent Bundle

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

## 3. Validate the Framework

```powershell
npm run validate
```

Validation checks required files, generated JSON artifacts, roadmap feature references, and legacy files that should no longer exist.

## 4. Use the PRP CLI

```powershell
npm run agent -- --help
npm run agent:status
```

Create a task:

```powershell
npm run agent -- init 001 "Example Task" example-task "Describe the task"
```

## 5. Optional Symlink Into Another Project

If this framework is stored centrally, link only the `.agent` bundle into a target project.

Windows PowerShell:

```powershell
New-Item -ItemType SymbolicLink -Path ".agent" -Target "D:\Tools\PRPs-Framework\.agent"
```

Linux, macOS, or WSL:

```bash
ln -s /path/to/PRPs-Framework/.agent .agent
```

Then copy or adapt the root `package.json` scripts for that project.

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

