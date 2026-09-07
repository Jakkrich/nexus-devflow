---
id: "DISC-20260825-001-user-auth"
title: "Discovery: Modern Authentication & SSO Integration"
doc_type: "discovery"
stage: "discovery"
created: "2026-08-25"
updated: "2026-08-25"
owner: "Lead Architect"
status: "completed"
decision: "Proceed"
selected_route: "Direct"
related_ideas: ["IDEA-012"]
related_runs: ["001-user-auth"]
related_files: []
---

# Discovery: Modern Authentication & SSO Integration

## 1. Request Summary & Problem Statement
- **Objective**: สำรวจแนวทางการผสานรวมระบบยืนยันตัวตน (Authentication) ร่วมกับ OAuth2 / SSO สำหรับองค์กร
- **Context**: ระบบเดิมใช้ Local Basic Auth ซึ่งขาดความปลอดภัยและการบริหารจัดการสิทธิ์แบบรวมศูนย์

## 2. Decision-Blocking Unknowns & Feasibility
- [x] **Unknown 1**: โครงสร้าง Database Schema รองรับ Multi-tenant OAuth provider หรือไม่?
  - *Finding*: รองรับได้โดยเพิ่มตาราง `accounts` และ `sessions` แบบ decouple
- [x] **Unknown 2**: ประสิทธิภาพและการจัดเก็บ Token ใน Redis
  - *Finding*: ทดสอบ Session cache lookup ใช้เวลาเฉลี่ย < 2ms

## 3. Candidate Architectural Routes
| Route | Pros | Cons | Verdict |
| :--- | :--- | :--- | :--- |
| **Custom OAuth2 Provider** | ควบคุมได้ทั้งหมด 100% | Maintenance สูง, ความเสี่ยง Security | ❌ Reject |
| **Auth.js / Better-Auth** | มาตรฐานความปลอดภัยสูง, Type-safe, Zero-config DB adapters | ต้อง Migrate Session เดิม | ✅ Recommended |

## 4. Architectural Recommendation & Decisions
- เลือกใช้ **Better-Auth** ร่วมกับ PostgreSQL และ Redis
- บันทึกรายละเอียดการตัดสินใจลงใน [ADR-001-auth-architecture.md](file:///d:/Projects/devtools/nexus-devflow/devflow/decisions/ADR-001-auth-architecture.md)

## 5. Delivery Slices & Plan Handoff
- **Slice 1 (Run 001)**: Core Auth Schema & OAuth2 Providers (`/feature "Core Auth Schema and OAuth2"`)
- **Slice 2 (Run 002)**: Session Management & Middleware (`/feature "Session Middleware"`)

## 6. Decision & Human Sign-off
- **Status**: `Proceed`
- **Next Allowed Command**: `/feature 001-user-auth`
