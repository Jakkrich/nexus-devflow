---
name: security-review
description: "[Devflow] Security review, vulnerability scanner, and code hardening. Audits for OWASP vulnerabilities, secrets, injections, and auth flaws."
---

# Security Review, Hardening & Vulnerability Audit

## Overview

This is the comprehensive security master skill for Nexus-DevFlow. It combines static vulnerability scanning, threat modeling, OWASP Top 10 defenses, and code hardening. Treat every external input as hostile, every secret as sacred, and every authorization check as mandatory.

---

## 1. The Three-Tier Security Boundary

### Always Do (No Exceptions)
- **Validate & sanitize all inputs** at the boundary (Zod, Yup, schema validation).
- **Parameterize all queries** — never concatenate user input into SQL/NoSQL queries.
- **Encode outputs** to prevent XSS (rely on framework auto-escaping).
- **Hash credentials** using bcrypt, Argon2, or scrypt.
- **Enforce secure cookies**: `httpOnly`, `secure`, `sameSite=lax/strict`.

### Never Do
- **Never commit secrets**, API keys, tokens, or credentials to git.
- **Never trust client-side checks** as a security barrier.
- **Never use `eval()`, `exec()`, or raw `innerHTML`** with untrusted user data.
- **Never expose internal stack traces** or detailed database errors to users.

---

## 2. OWASP & Critical Vulnerability Vectors

| Category | Primary Risk | Mandatory Defense |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | IDOR, missing role checks | Enforce server-side authorization on every endpoint/data fetch |
| **A02: Cryptographic Failures** | Plaintext tokens/passwords, weak cipher | Use TLS 1.3, salted hashing, secret managers / `.env` |
| **A03: Injection** | SQL, NoSQL, OS Command, Template | Parameterized queries, avoid shell spawning with user input |
| **A04: Insecure Design** | Missing rate limits, business logic flaw | Defense-in-depth, token bucket throttling, safe defaults |
| **A05: Security Misconfig** | Permissive CORS (`*`), exposed debug endpoints | Restrict CORS origins, disable debug/admin paths in production |
| **A07: Identification & Auth** | Session fixation, brute-force | Account lockouts, secure session rotation, MFA support |
| **A08: Software & Data Integrity**| Untrusted CI/CD packages, deserialization | Run `npm audit`, pin dependency hashes, validate payloads |
| **A09: Logging & Monitoring** | Missing audit logs or logging secrets | Structured logging with PII masking, alert on repeated auth failure |
| **A10: SSRF** | Fetching internal URLs from user input | Whitelist allowable destination protocols and domains |

---

## 3. Security Review Process

1. **Target & Scope**: Inspect targeted files, PR diffs, or entire project directories.
2. **Trace Trust Boundaries**: Follow untrusted data from entry (HTTP handlers, CLI arguments, file uploads) to sinks (DB, shell, HTML).
3. **Scan for Secrets & Configs**: Detect hardcoded passwords, private keys, and environment variable leaks.
4. **Generate Report**: Save formal security audits under:
   ```text
   devflow/runs/{ID}-{slug}/security-review.md
   ```

---

## Relationship To DevFlow 2.0

- **Classification**: Companion command & Safety gate
- **Mainline integration**: Run during `40-implement` or `50-verify` before `70-release`.
- **Handoff**: P0/P1 security findings block release and return to `40-implement` for immediate remediation.
