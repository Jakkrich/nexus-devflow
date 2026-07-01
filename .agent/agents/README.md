---
description: ภาพรวม specialist agents สำหรับ DevFlow 2.0
---

# DevFlow 2.0 Specialist Agents

เอกสารนี้อธิบายบทบาทของ specialist agents หลักในระบบ และ stage ที่มักถูกเรียกใช้

## วิธีเรียกใช้งาน

```text
Agent {AGENT_NAME} {TARGET}
```

ตัวอย่าง:

```text
Agent requirements-engineer .workspaces/specs/007-auth-refactor/20-spec.md
Agent codebase-explorer src/services/
Agent code-reviewer .workspaces/specs/007-auth-refactor/
```

## หลักการสำคัญ

- `Agent` เป็น advanced companion surface ไม่ใช่ mainline stage
- ใช้เมื่อผู้ใช้ต้องการ specialist judgment แบบเจาะจง
- หลังเรียก agent แล้ว ควรกลับไป workflow หรือ stage ที่เป็นเจ้าของ lifecycle
- stage `.md` ยังเป็น source of truth หลัก

## 1. Discovery, Definition, Planning

ใช้บ่อยกับ `/00-Discover`, `/10-Define`, `/20-Spec`, `/30-Plan`

| Agent | Role | Responsibility |
| :--- | :--- | :--- |
| `prp-core-planner` | Planner | สร้างแผนงานและลำดับ implementation |
| `requirements-engineer` | Requirements | ขัดเกลา scope, assumptions, acceptance criteria |
| `prp-core-prd-architect` | PRD architect | ช่วยร่าง PRD และ framing เชิง product |
| `orchestrator` | Orchestrator | ประสานงานหลาย agent เมื่อโจทย์ซับซ้อน |
| `prp-core-boss` | Goal router | route งานแบบ goal-first และคุม worker execution |

## 2. Research and Exploration

ใช้บ่อยกับ `Research`, `Brainstorm`, `Debug`, `/30-Plan`

| Agent | Role | Responsibility |
| :--- | :--- | :--- |
| `codebase-explorer` | Explorer | หาไฟล์, pattern, architecture, data flow |
| `web-researcher` | Researcher | หา external docs, APIs, best practices, references |
| `prp-core-codebase-assistant` | Codebase assistant | ตอบคำถามเชิงโครงสร้างและช่วย route agent ที่เหมาะ |

## 3. Implementation

ใช้บ่อยกับ `/40-Implement`

| Agent | Role | Responsibility |
| :--- | :--- | :--- |
| `prp-core-coder` | Implementer | ลงมือเปลี่ยนโค้ดตามแผน |
| `prp-core-worker` | Worker | ทำ goal subtasks ที่ถูก route มาแบบ focused |
| `backend-specialist` | Backend | API, server logic, integrations |
| `frontend-specialist` | Frontend | UI, frontend behavior, interaction details |
| `database-architect` | Database | schema, indexes, query design |

## 4. Verification and Hardening

ใช้บ่อยกับ `/50-Verify`, `Debug`, `PR-Review`

| Agent | Role | Responsibility |
| :--- | :--- | :--- |
| `test-engineer` | Test engineer | วาง test coverage และหลักฐานการตรวจ |
| `prp-core-debugger` | Debugger | root cause analysis และ fix validation |
| `code-reviewer` | Reviewer | correctness, risk, maintainability |
| `security-auditor` | Security | security review และ logic risk |
| `performance-engineer` | Performance | performance bottleneck และ optimization evidence |
| `penetration-tester` | Pen tester | offensive security validation เมื่อจำเป็นจริง |

## 5. Infrastructure and Maintenance

ใช้บ่อยกับการรันรอบบำรุงรักษา (maintenance loops), ตรวจสอบความปลอดภัย หรือทำความสะอาด repo ในช่วงข้ามคืน

| Agent | Role | Responsibility |
| :--- | :--- | :--- |
| `ob-loop-engineer` | Maintenance | รัน overnight asynchronous maintenance และ cleanup loops |

## 6. Release and Documentation

ใช้บ่อยกับ `/60-Report`, `/70-Release`

| Agent | Role | Responsibility |
| :--- | :--- | :--- |
| `prp-core-git-committer` | Git committer | จัด commit scope และ commit message |
| `prp-core-git-pr-maker` | PR maker | เตรียม PR summary และ handoff |
| `documentation-maintainer` | Documentation | อัปเดตเอกสารที่ได้รับผลกระทบ |
| `devops-engineer` | DevOps | deploy readiness และ release environment |
| `coach-guideline` | Guide | ช่วยสื่อสารหรืออธิบาย next step ให้คนใช้งาน |

## 7. Skill Boundary

ทักษะต่อไปนี้ไม่ควรถูกเรียกผ่าน `Agent` โดยตรงแล้ว:

| Skill | ให้เรียกผ่าน |
| :--- | :--- |
| `code-simplification` | `Simplify`, `prp-core-coder`, `code-reviewer` |
| `type-design` | `backend-specialist`, `frontend-specialist`, `database-architect`, `code-reviewer` |
| `silent-failure-audit` | `code-reviewer`, `test-engineer`, `backend-specialist`, `security-auditor` |
| `spec-orchestration` | `Spec-Orchestrate` |
| `roadmap-strategy` | `Roadmap` |
| `pr-review-analysis` | `PR-Review` |

## Recommended Routing

ตัวอย่างการเลือก agent:

- ถ้า spec ยังไม่ชัด -> `Agent requirements-engineer ...`
- ถ้า architecture ยังไม่เข้าใจ -> `Agent codebase-explorer ...`
- ถ้าต้อง review ความเสี่ยง -> `Agent code-reviewer ...`
- ถ้าต้อง debug root cause -> `Agent prp-core-debugger ...`
- ถ้าต้องช่วยจัด PR/commit -> `Agent prp-core-git-committer ...` หรือ `Agent prp-core-git-pr-maker ...`
- ถ้าต้องการรันงานบำรุงรักษาข้ามคืน -> `Agent ob-loop-engineer ...`

ถ้าไม่แน่ใจว่าจะใช้ agent ไหน ให้เริ่มที่ `Help` หรือดู [workflow-surface-map.md](/D:/Projects/nexus-devflow/docs/workflow-surface-map.md:1) ก่อน
