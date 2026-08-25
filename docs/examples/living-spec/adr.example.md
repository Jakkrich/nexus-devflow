---
id: "ADR-001-auth-architecture"
title: "ADR: Authentication Engine Selection"
doc_type: "decision"
status: "accepted"
deciders: ["Lead Architect", "Security Auditor"]
created: "2026-08-25"
updated: "2026-08-25"
source_discovery: "DISC-20260825-001-user-auth"
related_files: ["src/lib/auth.ts", "src/db/schema/auth.ts"]
---

# ADR-001: Authentication Engine Selection

## Context & Problem Statement
ระบบต้องการรองรับทั้ง Email/Password และ OAuth2 SSO (Google, GitHub, Microsoft) สำหรับลูกค้าองค์กร โดยต้องมี Type safety และทำงานร่วมกับ Edge/Node.js runtime ได้

## Decision Drivers
- Type-safe Client & Server APIs
- Zero-leak Security Boundary
- Minimal Third-party Vendor Lock-in
- Native Support for PostgreSQL + Redis Session Store

## Considered Options
1. **Option 1**: NextAuth / Auth.js
2. **Option 2**: Better-Auth
3. **Option 3**: In-house Custom JWT Implementation

## Decision Outcome
- **Chosen Option**: **Option 2 (Better-Auth)**
- **Rationale**: มีโครงสร้างโมดูลที่แยก Layer ชัดเจน (Deep Module), รองรับ TypeScript แบบ 100% strict, และมี built-in rate-limiting รวมถึง CSRF protection

## Consequences & Trade-offs
### Positive
- ประหยัดเวลาในการพัฒนา Security middleware
- Audit ผ่านได้ง่ายเนื่องจากเป็น Open-source ที่ผ่านการทดสอบ
### Negative
- ทีมต้องเรียนรู้ Plugin API ของเฟรมเวิร์กใหม่

## Technical Implementation Rules
- เก็บ Secrets ทั้งหมดใน Environment Variables (`.env`)
- ใช้งาน Database Adapter ผ่าน Drizzle ORM
- ห้าม Bypass Session verification middleware เด็ดขาด
