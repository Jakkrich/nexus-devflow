---
description: Production Deployment (Auto-Deploy) - Perform pre-flight checks, deployment execution, and verification for production releases.
---
# ๐€ Phase 52: Production Deployment (Auto-Deploy)

## Usage: `Deploy [subcommand]`

Perform pre-flight checks, deployment execution, and verification for production releases.

Primary behavior now lives in:

```text
.agent/skills/release-git-operations/SKILL.md
```

Treat this workflow file as a compatibility wrapper around that skill in `deploy` mode.

---

## ๐ ๏ธ Sub-commands

- `Deploy`            - Interactive deployment wizard
- `Deploy check`      - Run pre-deployment checks only
- `Deploy preview`    - Deploy to preview/staging
- `Deploy production` - Deploy to production
- `Deploy rollback`   - Rollback to previous version

---

## ๐ฆ Internal Process

### Phase 1: Pre-Flight Checks
Before any deployment, the AI MUST verify the following Checklist:
1. **Code Quality**: No syntax errors, Linters passing, Tests passing.
2. **Security**: No hardcoded secrets, Environment variables documented, Dependencies audited.
3. **Performance**: Bundle size acceptable, Images optimized, No N+1 queries.
4. **Accessibility**: Keyboard nav works, screen reader compatible, contrast adequate.
5. **Infrastructure**: Env vars set, migrations ready, monitoring configured.
6. **Documentation**: README / ADRs / CHANGELOG updated.

*You MUST run appropriate validation commands to systematically audit the codebase before giving the green light.*

### Phase 2: Deployment Execution
Determine the project's platform (Vercel, Railway, Docker, Fly.io, etc.) and execute the appropriate build & deploy commands.
- Vercel: `vercel --prod`
- Railway: `railway up`
- Docker: `docker compose up -d`
- Fly.io: `fly deploy`

### Phase 3: Health Check, Verify & Report
- **Template Verification**: **MANDATORY:** Before final deployment, inspect `.agent/resources/schemas/deploy_report.template.md`, preserve its required layout, and replace placeholder text with concrete environment, commands, checks, rollback notes, and deployment result.
- Save the final deployment and pre-flight check report to `.workspaces/reports/{date}-deploy-report-{timestamp}.md` (where `{date}` is today's date in `YYYY-MM-DD` format and `{timestamp}` is a clean date/time slug).
- Verify that the deployed application is responding (HTTP 200 OK) and all services (Database, API) are healthy.

---

## ๐“ Output Formats

### Successful Deploy
Generate a summary indicating:
- **Summary**: Version, Environment, Duration, Platform
- **URLs**: Production, Dashboard
- **Report Location**: Confirm the deploy checklist and validation report has been written to the specified workspace path.
- **What Changed**: Bullet points of new features or fixes
- **Health Check**: Status of API and Database

### Failed Deploy
Generate an Error summary detailing:
- **Error**: Step where it failed (e.g., Build failed at TypeScript compilation)
- **Details**: Exact error snippet
- **Resolution**: Step-by-step fix recommendation
- **Rollback Available**: Suggest running `Deploy rollback` if needed.

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Release support command, not a numbered stage
- Typical entry points: `/70-Release` after the report is aligned and packaging is ready to execute
- Typical handoff targets: `/60-Report`, `Changelog`, `Wiki`

## Sources

- `AGENTS.md`
- `.agent/skills/release-git-operations/SKILL.md`
- `.agent/skills/shipping-and-launch/SKILL.md`
- `.agent/skills/deployment-procedures/SKILL.md`
- `.agent/resources/schemas/deploy_report.template.md`
- Related commands: `/70-Release`, `Commit`, `PR`, `Changelog`, `/60-Report`


