---
description: Production Deployment (Auto-Deploy) - Perform pre-flight checks, deployment execution, and verification for production releases.
---
# 🚀 Phase 52: Production Deployment (Auto-Deploy)

## Usage: `/52-Deploy [subcommand]`

Perform pre-flight checks, deployment execution, and verification for production releases.

---

## 🛠️ Sub-commands

- `/52-Deploy`            - Interactive deployment wizard
- `/52-Deploy check`      - Run pre-deployment checks only
- `/52-Deploy preview`    - Deploy to preview/staging
- `/52-Deploy production` - Deploy to production
- `/52-Deploy rollback`   - Rollback to previous version

---

## 🚦 Internal Process

### Phase 1: Pre-Flight Checks
Before any deployment, the AI MUST verify the following Checklist:
1. **Code Quality**: No syntax errors, Linters passing, Tests passing.
2. **Security**: No hardcoded secrets, Environment variables documented, Dependencies audited.
3. **Performance**: Bundle size acceptable, Images optimized, No N+1 queries.
4. **Accessibility**: Keyboard nav works, screen reader compatible, contrast adequate.
5. **Infrastructure**: Env vars set, migrations ready, monitoring configured.
6. **Documentation**: README / ADRs / CHANGELOG updated.

*You MUST run `python <ROOT_AI_FOLDER>/scripts/verify_all.py .` (e.g., `../scripts/verify_all.py` or `.claude/scripts/verify_all.py`) to systematically audit the codebase before giving the green light.*

### Phase 2: Deployment Execution
Determine the project's platform (Vercel, Railway, Docker, Fly.io, etc.) and execute the appropriate build & deploy commands.
- Vercel: `vercel --prod`
- Railway: `railway up`
- Docker: `docker compose up -d`
- Fly.io: `fly deploy`

### Phase 3: Health Check & Verify
Verify that the deployed application is responding (HTTP 200 OK) and all services (Database, API) are healthy.

---

## 📝 Output Formats

### Successful Deploy
Generate a summary indicating:
- **Summary**: Version, Environment, Duration, Platform
- **URLs**: Production, Dashboard
- **What Changed**: Bullet points of new features or fixes
- **Health Check**: Status of API and Database

### Failed Deploy
Generate an Error summary detailing:
- **Error**: Step where it failed (e.g., Build failed at TypeScript compilation)
- **Details**: Exact error snippet
- **Resolution**: Step-by-step fix recommendation
- **Rollback Available**: Suggest running `/52-Deploy rollback` if needed.
