---
title: Workflow Surface Map
version: 2.0
status: active
updated: 2026-06-18
---

# Workflow Surface Map

เอกสารนี้ใช้ตัดสินใจว่า workflow ใดควรเป็น public command, internal companion surface, skill target, agent target, archive หรือ remove ใน DevFlow 2.0

## Decision Rule

- ถ้าผู้ใช้ควรเรียกเอง และมี input/output/handoff ชัด ให้เป็น `public command`
- ถ้าเป็นวิธีคิดหรือวิธีทำที่ควรถูกเรียกจาก workflow หรือ agent ให้ย้ายเป็น `skill target`
- ถ้าเป็นบทบาทผู้เชี่ยวชาญที่ควรรับผิดชอบผลลัพธ์โดยตรง ให้ย้ายเป็น `agent target`
- ถ้าเนื้อหายังมีค่าแต่ไม่ควรเป็นผิวหน้าหลักของระบบแล้ว ให้เป็น `internal companion`
- ถ้าเหลือไว้เพื่ออ้างอิงย้อนหลังเท่านั้น ให้เป็น `archive`

## Public Commands

| File | Decision | Why |
| :--- | :--- | :--- |
| `Goal.md` | `public command` | ใช้ route เป้าหมายกว้างก่อนเข้าสู่ mainline |
| `Brainstorm.md` | `public command` | ทีมใช้งานบ่อยและมีคุณค่าด้านการคิดก่อนล็อกโจทย์ |
| `Research.md` | `public command` | เป็นคำสั่งที่ผู้ใช้เข้าใจและเรียกตรงได้ง่าย |
| `Debug.md` | `public command` | root cause analysis เป็น public need ที่ชัด |
| `PRD.md` | `public command` | product framing ยังมีบทบาทก่อน spec |
| `Issue-Triage.md` | `public command` | issue-driven intake เป็น use case ที่ชัด |
| `Wiki.md` | `public command` | ใช้ query หรือ ingest knowledge ได้โดยตรง |
| `Help.md` | `public command` | เป็น command หลักสำหรับ routing และ onboarding |

## Keep Internal For Now

| File | Decision | Future direction |
| :--- | :--- | :--- |
| `Preview.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `preview-local-check` แล้ว เหลือ wrapper |
| `Simplify.md` | `internal companion` | ใช้ skill `code-simplification` เป็นแกนหลักแล้ว |
| `Spec-Research.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `spec-research` แล้ว เหลือ wrapper |
| `Competitor.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `competitor-analysis` แล้ว เหลือ wrapper |
| `Roadmap.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `roadmap-strategy` แล้ว เหลือ wrapper เชิงกลยุทธ์ |
| `Spec-Orchestrate.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `spec-orchestration` แล้ว เหลือ wrapper |
| `Test.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `test-execution-and-coverage` แล้ว เหลือ wrapper |
| `QA-Orchestrate.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `verification-orchestration` แล้ว เหลือ wrapper |
| `Followup.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `review-followup-routing` โหมด `task-followup` แล้ว |
| `Human-Approve.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `human-review-decisions` แล้ว เหลือ wrapper |
| `Human-Feedback.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `human-review-decisions` แล้ว เหลือ wrapper |
| `Human-ReCheck.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `human-review-decisions` แล้ว เหลือ wrapper |
| `Human-Reject.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `human-review-decisions` แล้ว เหลือ wrapper |
| `Commit.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `release-git-operations` แล้ว เหลือ wrapper |
| `PR.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `release-git-operations` แล้ว เหลือ wrapper |
| `PR-Review.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `pr-review-analysis` แล้ว เหลือ wrapper |
| `PR-Followup.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `review-followup-routing` โหมด `pr-followup` แล้ว |
| `Merge.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `release-git-operations` แล้ว เหลือ wrapper |
| `Deploy.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `release-git-operations` แล้ว เหลือ wrapper |
| `Changelog.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `release-git-operations` แล้ว เหลือ wrapper |
| `Insight.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `insight-capture` แล้ว เหลือ wrapper |
| `Agent.md` | `internal companion` | ย้ายพฤติกรรมหลักเข้า `specialist-agent-routing` แล้ว เหลือ advanced wrapper |

## Agent Targets

| Current file | Preferred target |
| :--- | :--- |
| `Spec-Orchestrate.md` | `spec-orchestration` หรือ `orchestrator` |
| `Roadmap.md` | `roadmap-strategy` หรือ strategy-oriented planner mode |
| `Agent.md` | `specialist-agent-routing` หรือ direct agent invocation guidance ผ่าน `Help` |

## Skill Targets

| Current file | Preferred target |
| :--- | :--- |
| `Preview.md` | `preview-local-check` |
| `Simplify.md` | `code-simplification` |
| `Spec-Research.md` | `spec-research` |
| `Spec-Orchestrate.md` | `spec-orchestration` |
| `Competitor.md` | `competitor-analysis` |
| `Roadmap.md` | `roadmap-strategy` |
| `Test.md` | `test-execution-and-coverage` |
| `QA-Orchestrate.md` | `verification-orchestration` |
| `Followup.md` | `review-followup-routing` |
| `Human-*` | `human-review-decisions` |
| `Commit.md` | `release-git-operations` |
| `PR.md` | `release-git-operations` |
| `PR-Review.md` | `pr-review-analysis` |
| `PR-Followup.md` | `review-followup-routing` |
| `Merge.md` | `release-git-operations` |
| `Deploy.md` | `release-git-operations` |
| `Changelog.md` | `release-git-operations` |
| `Insight.md` | `insight-capture` |
| `Agent.md` | `specialist-agent-routing` |

## Current Policy

- ตอนนี้ยังไม่ลบไฟล์ที่มี prompt body ดี
- ให้ลด public exposure ก่อน แล้วค่อยย้าย behavior หลักเข้า skill หรือ agent
- companion workflows ที่ย้าย behavior แล้ว ให้คงไว้เป็น wrapper เพื่อรักษา UX และความเข้ากันได้
- mainline numbered workflows ยังคงเป็นเส้นหลักเพียงชุดเดียว: `00-Discover -> 10-Define -> 20-Spec -> 30-Plan -> 40-Implement -> 50-Verify -> 60-Release -> 70-Report`
- กลุ่ม companion หลักถูกย้าย behavior เข้า skill layer ครบตามเป้าหมาย phase นี้แล้ว
