---
name: vendor
description: "[devflow] Ingest an external Git repository into project-local devflow/.vendor/<slug>/ and synthesize an intelligent custom wrapper skill (.claude/skills/<slug>/SKILL.md) with update immunity protection. Use for /vendor, /skill-add, /equip, or /ingest."
argument-hint: "<git-url-or-path> [--name <slug>]"
---

# vendor - Project-Local AI-Orchestrated Vendor Skill Ingestion

**Context reuse:** Reuse any required file already loaded in project instructions or the current session.

**Aliases:** `/vendor`, `/skill-add`, `/add-skill`, `/equip`, `/ingest`

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

Where this sits in the workflow:

    external git repo  ->  [vendor]  ->  devflow/.vendor/<slug>/  +  .claude/skills/<slug>/SKILL.md  ->  ready
    (GitHub / GitLab)      (clone +       (isolated vendor code)     (AI-synthesized custom wrapper)    (/<slug>)
                            inspect)

`/vendor` is the AI-driven bridge between raw 3rd-party repositories and your project's agentic workflow. While standard package managers (npm/pip) perform "dumb file copying", `/vendor` deploys the AI Agent to inspect the cloned repository, understand its APIs, CLI flags, schemas, and heuristics, and synthesize a tailor-made **Custom Wrapper Skill (`SKILL.md`)** designed specifically for pair-programming in this project.

---

## 🛡️ Core Guarantees & Operational Principles

1. **Local-Only Scope**: Installs strictly into the project workspace (`devflow/.vendor/<slug>/` and `.claude/skills/<slug>/`). Never touches global system tools or outside directories.
2. **Repository Hygiene**: `devflow/.vendor/` is excluded from Git commits via `.gitignore`. Your project repo stays lean and uncluttered.
3. **DevFlow Update Immunity**: Registered as a protected custom vendor skill in `.nexus/nexus-devflow.json`. Running `npx nexus-devflow update` will **never** purge, modify, or delete your custom wrapper skill.
4. **Upstream Upgradable**: Can be updated from git upstream at any time via `npx nexus-devflow skill update all` or `npx nexus-devflow skill update <slug>` without overwriting the AI-crafted wrapper.

---

## 🚀 Execution Lifecycle (4-Phase Ingestion)

### Phase 1: Local Fetch & Workspace Isolation
1. Parse the provided Git URL or local path. Derive the `<slug>` name (or use `--name <slug>` if specified).
2. Validate target location: `devflow/.vendor/<slug>/`.
   - If the directory already exists, ask the user whether to refresh/re-clone or abort.
3. Run shallow clone:
   ```bash
   git clone --depth 1 <git-url> devflow/.vendor/<slug>
   ```
4. Verify clone integrity (confirm files exist in `devflow/.vendor/<slug>/`).

### Phase 2: AI Codebase Inspection & Capability Mapping
1. Read the vendor directory to discover its capabilities:
   - Documentation: `README.md`, `USAGE.md`, `docs/`, `examples/`
   - Manifests: `package.json`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`
   - Existing skill definitions: `SKILL.md` or `skills/` (if already present)
   - Executable entry points: CLI scripts, binaries, or python modules
2. Analyze what this tool does best and map its role to DevFlow workflows:
   - Does it assist in Pre-Flight Analysis / Discovery? (e.g. `book-to-skill`, `diagram-design`)
   - Does it provide Quality, Security, or TDD guardrails? (e.g. `bughunter`, `ponytail`)
   - Does it offer domain-specific code generators or format converters?

### Phase 3: Synthesize Custom Wrapper Skill (`SKILL.md`)
Create `.claude/skills/<slug>/SKILL.md` (and replicate to `.agents/skills/<slug>/SKILL.md` if `.agents` adapter is installed):

```markdown
---
name: <slug>
description: "<Clear, concise summary of what this custom skill does and when to call it>"
origin: custom-vendor
referencePath: devflow/.vendor/<slug>
---

# <slug> - <Skill Title>

## Purpose & When to Use
[Explain trigger conditions and practical scenarios for calling this skill]

## Execution Instructions
[Provide exact CLI commands, python invocations, or relative file reading instructions pointing to devflow/.vendor/<slug>/]

## Heuristics & Decision Rules
[Extract key domain principles from the vendor repository]

## Safety & Boundaries
- Do not modify files inside devflow/.vendor/<slug>/ directly.
- Operate only within project boundaries.
```

### Phase 4: Register Manifest & Update Immunity
1. Read `.nexus/nexus-devflow.json`.
2. Ensure the skill is recorded in `thirdPartySkills`:
   ```json
   {
     "name": "<slug>",
     "source": "<git-url>",
     "type": "compound-knowledge",
     "referencePath": "devflow/.vendor/<slug>",
     "version": "1.0.0",
     "protected": true,
     "installedAt": "<ISO timestamp>"
   }
   ```
3. Save `.nexus/nexus-devflow.json`.
4. Report completion to the user with:
   - Clickable links to [devflow/.vendor/<slug>/](file:///d:/devtools/nexus-devflow/devflow/.vendor/) and [.claude/skills/<slug>/SKILL.md](file:///d:/devtools/nexus-devflow/.claude/skills/)
   - How to invoke: `/<slug>`
   - How to update upstream: `npx nexus-devflow skill update <slug>` or `npx nexus-devflow skill update all`

---

## 📖 Universal Contextual Help & Playbook Protocol (`help`, `--help`, `-h`, `?`)

Whenever `/vendor` is invoked with a help keyword or flag:
1. **Safety Gate**: Do NOT clone any repository or mutate files.
2. Render the practical 5W1H Playbook in chat.
3. Conclude with: `"Help menu displayed successfully"`.
