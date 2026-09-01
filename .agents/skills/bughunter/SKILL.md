---
name: bughunter
description: "Offensive security orchestrator & bug hunting guide. Indexes 83 vulnerability classes, 5-phase methodology (Think, Hunt, Perimeter, Ship), 681 disclosed HackerOne patterns, and JIT reference guides in devflow/.vendor/bughunter/. Use when running /bughunter, performing security reviews, verifying auth/injection risks in /check or /audit, or testing API endpoints for vulnerabilities."
argument-hint: "[{target, vuln-class, or topic}]"
---

# 🛡️ bughunter - Offensive Security & Vulnerability Assessment Orchestrator

$ARGUMENTS

`bughunter` is the master security testing orchestrator in Nexus-DevFlow, bringing the complete power of **Claude-BugHunter** into your development lifecycle with **Zero Token Bloat**.

---

## ⚠️ Pre-Flight Check (Knowledge Base Availability)

Before executing any BugHunter analysis or security test:
1. **Check if `devflow/.vendor/bughunter/` exists in this project using your file inspection tool**.
2. **If `devflow/.vendor/bughunter/` is MISSING / NOT INSTALLED**:
   - **DO NOT hallucinate payloads or fake security reports**.
   - Respond immediately to the user in Thai:
     > 💡 **คลังความรู้ BugHunter (83 Vulnerability Classes, Payloads & 681 Disclosed Reports) ยังไม่ได้ถูกดาวน์โหลดในโปรเจกต์นี้**
     > 
     > 👉 กรุณารันคำสั่งนี้ใน Terminal เพื่อดาวน์โหลดคลังความรู้และ CVE Payloads:
     > ```bash
     > npx @jakkrichm/create-nexus-devflow skill add bughunter
     > ```
     > *(หรือพิมพ์บอกให้ผมช่วยรันคำสั่งติดตั้งให้ได้เลยครับ)*
   - Stop and wait for the user to install or give permission.
3. **If `devflow/.vendor/bughunter/` is PRESENT**:
   - Proceed with the JIT Knowledge Map and 5-phase testing methodology below.

---

### 📦 Full Upstream Arsenal in `devflow/.vendor/bughunter/`:
- **83 Full Skills** (`devflow/.vendor/bughunter/skills/<skill-name>/SKILL.md`): Detailed detection patterns, bypass tables, and payloads for all 83 classes.
- **15 Slash Commands** (`devflow/.vendor/bughunter/commands/<command>.md`): `hunt`, `recon`, `triage`, `validate`, `chain`, `report`, `scope`, `token-scan`, `surface`, `autopilot`, ฯลฯ
- **681 Disclosed HackerOne Reports** (`devflow/.vendor/bughunter/disclosed-reports/<class>.md`): Real-world vulnerability citations across 24 core classes.
- **Engagement Scaffolding** (`devflow/.vendor/bughunter/ENGAGEMENTS.md`): Comprehensive directory and methodology scaffolding for security assessments.

---

## 🧭 The 4-Layer Architecture & 5-Phase Methodology

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. THINK      │ bb-methodology, redteam-mindset, 5-phase workflow      │
├───────────────┼────────────────────────────────────────────────────────┤
│ 2. HUNT       │ 58 web app vulnerability classes (IDOR, SSRF, SQLi)    │
├───────────────┼────────────────────────────────────────────────────────┤
│ 3. PERIMETER  │ M365/Entra, Okta, vCenter, Cloud IAM, SSL-VPN          │
├───────────────┼────────────────────────────────────────────────────────┤
│ 4. SHIP       │ 7-Question Gate, VRT-aware triage, H1/Bugcrowd reports │
└────────────────────────────────────────────────────────────────────────┘
```

### The 5-Phase Workflow:
1. **Recon & Scope**: Fingerprint tech stack, enumerate subdomains/endpoints, define in-scope vs. out-of-scope boundaries (`skills/web2-recon/`, `skills/recon-scope-triage/`).
2. **Map & Surface Ranking**: Identify high-value targets (Auth, Payment, GraphQL mutations, File uploads, Webhook receivers) (`commands/surface.md`).
3. **Hunt & Test**: Apply vulnerability-specific bypass tables, edge-case payloads, and condition variations (`skills/hunt-*/SKILL.md`).
4. **Validate**: Apply the **7-Question Gate** (Impact, Pre-conditions, Repro steps, Root cause, Severity score) (`skills/triage-validation/`).
5. **Report / Remediate**: Produce actionable vulnerability proof, remediation advice, or bug bounty reports (`commands/report.md`, `skills/report-writing/`).

---

## 🗂️ Just-in-Time (JIT) Reference Knowledge Map

Before analyzing or probing any security concern, **ALWAYS read the relevant reference document in `devflow/.vendor/bughunter/` using your file reading tool (`view_file` / `grep_search`)**:

| Target Category | Specific Skill Path in `devflow/.vendor/bughunter/` | Disclosed Reports Path |
| :--- | :--- | :--- |
| **Index & Overview** | `devflow/.vendor/bughunter/INDEX.md` | - |
| **IDOR / BOLA** | `skills/hunt-idor/SKILL.md` | `disclosed-reports/hunt-idor.md` |
| **OAuth 2.0 / SSO** | `skills/hunt-oauth/SKILL.md` | `disclosed-reports/hunt-oauth.md` |
| **JWT Flaws & Crypto** | `skills/hunt-jwt-crypto/SKILL.md` | `disclosed-reports/hunt-jwt-crypto.md` |
| **SSRF (Cloud IMDS)** | `skills/hunt-ssrf/SKILL.md` | `disclosed-reports/hunt-ssrf.md` |
| **SQL & NoSQL Injection** | `skills/hunt-sqli/SKILL.md`, `skills/hunt-nosqli/SKILL.md` | `disclosed-reports/hunt-sqli.md` |
| **XSS & DOM Injection** | `skills/hunt-xss/SKILL.md`, `skills/hunt-dom/SKILL.md` | `disclosed-reports/hunt-xss.md` |
| **GraphQL & APIs** | `skills/hunt-graphql/SKILL.md`, `skills/hunt-fintech-graphql/` | `disclosed-reports/hunt-graphql.md` |
| **Next.js / Node.js** | `skills/hunt-nextjs/SKILL.md`, `skills/hunt-nodejs/SKILL.md` | - |
| **Cloud IAM & Perimeter** | `skills/hunt-cloud-misconfig/`, `skills/m365-entra-attack/` | `disclosed-reports/hunt-cloud-misconfig.md` |
| **CI/CD & Kubernetes** | `skills/hunt-cicd/SKILL.md`, `skills/hunt-k8s/SKILL.md` | - |
| **LLM & AI Security** | `skills/hunt-llm-ai/SKILL.md`, `skills/hunt-rag-vector/SKILL.md` | - |

---

## 🔗 Integration with Nexus-DevFlow Core Lifecycle

1. **During `/check` (Security & QA Verification)**:
   - When verifying a feature dealing with Auth, Multi-tenancy, or Data Exports, run a BugHunter self-assessment:
     `"เปิดอ่าน devflow/.vendor/bughunter/skills/hunt-idor/SKILL.md เพื่อทดสอบหาช่องโหว่ IDOR และ Token Tampering ใน Endpoint นี้"`
2. **During `/audit` (Code Audit)**:
   - Review code against Fowler smells AND offensive attack vectors simultaneously.
3. **During `/debug` (Security Incident Investigation)**:
   - Trace vulnerability root causes using the 681 disclosed report patterns in `disclosed-reports/`.

---

## 🔄 Updating Knowledge Base

To update all 83 skills, 15 commands, and report patterns to the latest upstream version:
```bash
npx @jakkrichm/create-nexus-devflow skill update bughunter
```
