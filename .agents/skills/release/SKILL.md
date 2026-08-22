---
name: release
description: "Prepare a DevFlow project for deployment to Render or Vercel. Inspects project stack, package manager, commands, and environment variables; verifies local build, start, output, and health endpoints; creates or updates render.yaml or vercel.json; and enforces strict safety gates before any remote action. Use when the user runs /release, invokes $release, asks for Render setup, Vercel setup, deploy readiness, deployment config, render.yaml, or vercel.json."
argument-hint: "[render | vercel | check | config]"
---

# release - deployment readiness for Render and Vercel

Where this sits in the workflow:

```text
/complete (or 70-deliver)  ->  [release]  ->  deploy with explicit approval
(feature / run finished)        (config,       (human confirms external action)
                                 readiness)
```

`/release` is an optional deployment preparation step. It gets the application ready to ship, but it is **not** an auto-deploy button. It can inspect, recommend, create local config files (`render.yaml`, `vercel.json`), and run local readiness checks. It **must stop** before any external provider action unless the user gives an explicit confirmation in the current chat.

Supported initial targets:

- **Render** - static sites, web services, background workers, cron jobs, databases, and `render.yaml`.
- **Vercel** - frontend apps, full-stack framework apps, serverless functions, and `vercel.json`.

---

## Usage

```text
release
release render
release vercel
release check
release config
```

### Scopes & Arguments

- **no argument**: inspect the project and recommend Render or Vercel if the target is obvious; otherwise ask which target to prepare.
- `render`: prepare Render readiness and local configuration (`render.yaml`).
- `vercel`: prepare Vercel readiness and local configuration (`vercel.json`).
- `check`: read-only deployment readiness report (runs local checks without changing files).
- `config`: focus on creating or updating local provider configuration files.

> [!CAUTION]
> **Strict Safety Gate**: If the user asks to deploy, connect a cloud provider, create a remote service, set remote env vars, push, publish, or run CLI commands that affect a remote infrastructure, pause and request explicit user confirmation before executing.

---

## 5-Step Deployment Readiness Protocol

### Step 1 - Read & Inspect the Project

Read:
- `AGENTS.md` and `devflow/context/project-overview.md`
- `devflow/project-plan.md` and `devflow/build-plan.md` (if present)
- `devflow/context/current-feature.md` or recent history
- Package and build manifests: `package.json`, lockfiles, framework configs, Dockerfile, `render.yaml`, `vercel.json`, `.env.example`, README
- Git working tree status

Identify:
- **App Type**: static frontend, SSR/hybrid app, API service, background worker, CLI, monorepo
- **Commands & Output**: build command, start command, dev command, test command, output directory (`dist/`, `build/`, `.next/`, `out/`), package manager
- **Runtime Needs**: Node version, Python version, Docker, database, cache, object storage, background jobs, cron, migrations
- **Environment Variables**: identify required variables **by name only**; never print, request, or record secret values
- **Health / Smoke Path**: health endpoint (e.g. `/api/health`, `/healthz`, `/`) or smoke test command

---

### Step 2 - Choose Provider Shape

For **Render**, decide whether the service should be configured as:
- **Static Site**: client-side SPAs (Vite, React, Vue) with static publish path
- **Web Service**: Node.js/Python/Go API or SSR server running on a specified port
- **Background Worker**: queue consumers or long-running worker processes
- **Cron Job**: periodic scheduled jobs
- **Database**: PostgreSQL or Redis paired with a service

For **Vercel**, decide whether the app should be:
- **Framework Deployment**: Next.js, Nuxt, SvelteKit, Astro with zero-config auto-detection
- **Static Output**: static site export
- **Serverless / Edge Functions**: API routes or standalone serverless functions
- **Monorepo Project**: root directory specification

*Note*: If a provider is a poor fit for the stack, state it plainly and recommend the better target (e.g. long-running background workers fit Render better than Vercel serverless).

---

### Step 3 - Verify Local Readiness

Run only local, non-destructive checks:
1. **Dependency check**: verify required dependencies are installed.
2. **Build check**: run the project build command (e.g. `npm run build`).
3. **Test check**: run unit/integration tests when declared (e.g. `npm test`).
4. **Smoke test**: start local server in test mode or verify health endpoints if safe.
5. **Lint / Typecheck**: run typecheck/lint when listed in project scripts.

If a command fails or is missing, report the exact gap. If a check requires remote credentials, list the required environment variable names and skip that check.

---

### Step 4 - Prepare Local Config Files

Only create or update local configuration files when the target is clear or requested.

#### For Render (`render.yaml`)
Create or update `render.yaml` for repeatable infrastructure:
```yaml
services:
  - type: web # or static, worker, cron
    name: my-app
    runtime: node # or python, docker, etc.
    buildCommand: npm run build
    startCommand: npm run start
    staticPublishPath: dist # for static sites
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false # prompt in Render dashboard, no secret in code
```

#### For Vercel (`vercel.json`)
Create `vercel.json` only when default framework auto-detection is insufficient:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

#### For Both Providers
- Sync `.env.example` with newly required environment variable names (with empty or dummy placeholder values).
- Add deployment instructions to `README.md` if requested.
- **Never write secret values into config files or git commits.**

---

### Step 5 - Report Deployment Readiness Packet

Produce a clean, scannable summary:

```markdown
## 🚀 Deployment Readiness Packet

- **Target Provider**: Render / Vercel (Rationale: ...)
- **Service Shape**: Web Service / Static Site / Framework App / Worker
- **Config Files Changed**: `render.yaml` / `vercel.json` / `.env.example` (or None)
- **Local Checks Run**:
  - Build: ✅ PASS
  - Tests: ✅ PASS (X/X tests)
  - Typecheck: ✅ PASS
- **Required Env Variables**: `DATABASE_URL`, `API_KEY` (names only)
- **Smoke Test Command / Path**: `/api/health`
- **Blockers / Warnings**: None (or list any gaps)
- **Next Action**: Review generated config files. When ready, deploy via Provider Dashboard or CLI.
```

---

## Strict Rules & Guardrails

1. **Optional Step**: `/release` is an optional helper sitting outside the core development loop.
2. **No Unprompted Remote Actions**: Never deploy, create remote cloud services, modify remote environment variables, push, or publish without explicit confirmation in the current chat.
3. **Zero Secret Leaks**: Never print, log, or commit passwords, tokens, API keys, or private certificates.
4. **Lean Configurations**: Do not add unnecessary configuration files if platform zero-config defaults suffice.
5. **No Hallucinations**: Do not mask failing local builds or unknown output directories; report failures accurately.
