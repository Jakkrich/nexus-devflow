---
name: deploy
description: "[Devflow] Production deployment pre-flight checks, launch readiness, smoke validation, and deployment execution."
---

# Production Deployment & Launch Readiness

## Overview

This is the comprehensive deployment master skill for Nexus-DevFlow. It handles pre-flight validation, multi-platform deployment execution (Vercel, Render, Railway, Fly.io, Docker), health checks, smoke verification, and safe rollback readiness.

```text
Pre-Flight Checks ➔ Build & Smoke Test ➔ Deployment Execution ➔ Health Verification ➔ Release Logging
```

---

## 1. Pre-Flight Verification Checklist

Before initiating any deployment, verify:
1. **Code & Quality**: Zero syntax/type errors, linters clean, unit & integration tests passing (`npm test`).
2. **Security**: No secrets in source code, environment variables documented in `.env.example`, `npm audit` checked.
3. **Database & Migrations**: Schema migrations verified backwards-compatible and applied.
4. **Performance & Assets**: Production bundles compiled, assets compressed, Core Web Vitals considered.
5. **Observability**: Healthcheck endpoint (`/api/health`) responsive, error tracking configured.

---

## 2. Platform Deployment Matrix

| Target Platform | Deploy Method / Command | Verification Method |
| :--- | :--- | :--- |
| **Vercel** | `vercel --prod` or Git push | Inspect deployment URL & build logs |
| **Render / Railway** | `railway up` or Git integration | Check service status & container logs |
| **Fly.io** | `fly deploy` | Check `fly status` and HTTP response |
| **Docker / VPS** | `docker compose up -d --build` | Check container health & PM2 logs |

---

## 3. Post-Deployment Smoke Verification & Health Check

1. Send an HTTP request to the deployed domain: verify HTTP 200 OK.
2. Test critical paths (Authentication, API endpoints, core database transactions).
3. Confirm telemetry and error log stream are free of unhandled exceptions.

---

## 4. Rollback Readiness

Always have an immediate rollback plan before triggering production releases:
- Pin the previous stable build artifact, Docker image tag, or Git commit hash.
- If post-deployment smoke tests fail, trigger rollback immediately:
  ```text
  deploy rollback
  ```

---

## Relationship To DevFlow 2.0

- **Classification**: Companion command & Delivery support
- **Mainline integration**: Invoked after `70-release` when ready to deploy.
- **Handoff**: `60-report`, `changelog`, `rollback`
