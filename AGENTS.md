# PRPs Specialist Agents

## Script-First JSON Rule

Agents should use PRP CLI commands for JSON artifacts whenever possible:

```powershell
npm run agent -- artifact:get {ID} {artifact}
npm run agent -- artifact:set {ID} {artifact} {field_path} {value}
npm run agent -- artifact:append {ID} {artifact} {field_path} {value}
npm run agent -- plan:add-phase {ID} "{Name}"
npm run agent -- plan:add-subtask {ID} {PHASE_ID} "{Title}"
npm run agent -- plan:set-subtask-status {ID} {SUBTASK_ID} completed
npm run agent -- validate {ID}
```

Use manual JSON editing only as a fallback, then run validation immediately.

เอกสารนี้สรุป persona หลักที่ใช้ใน Nexus-DevFlow สำหรับทำงานแบบ agentic workflow ผ่าน `.agent` bundle

## วิธีเรียกใช้งาน

```text
/90-Agent {ชื่อ_AGENT} {ไฟล์_หรือ_โฟลเดอร์_เป้าหมาย}
```

ตัวอย่าง:

```text
/90-Agent requirements-engineer .workspaces/specs/007/spec.md
```

## 1. Requirements & Planning

ใช้ในขั้นตอน `/30-Task`, `/31-Plan`, `/12-PRD`

| Agent | บทบาท | หน้าที่หลัก |
| :--- | :--- | :--- |
| `prp-core-planner` | ผู้วางแผนหลัก | วิเคราะห์โค้ดและสร้าง implementation plan |
| `requirements-engineer` | วิศวกรข้อกำหนด | ตรวจและขัดเกลา `spec.md` ก่อนเริ่มงาน |
| `prp-core-prd-architect` | ผู้ออกแบบ PRD | ร่าง PRD จากไอเดียเริ่มต้น |
| `orchestrator` | ผู้ประสานงานหลัก | ประสาน agent หลายตัวในงานซับซ้อน |

## 2. Research & Exploration

ใช้ในขั้นตอน `/11-Research`

| Agent | บทบาท | หน้าที่หลัก |
| :--- | :--- | :--- |
| `codebase-explorer` | นักสำรวจโค้ด | ค้นหาโค้ดและ pattern เดิมที่นำกลับมาใช้ได้ |
| `codebase-analyst` | นักวิเคราะห์ระบบ | วิเคราะห์ data flow และความสัมพันธ์ระหว่างโมดูล |
| `web-researcher` | นักวิจัยข้อมูล | ค้นคว้า API, best practices และแหล่งอ้างอิง |

## 3. Implementation & Development

ใช้ในขั้นตอน `/32-Code`, `/90-Agent`

| Agent | บทบาท | หน้าที่หลัก |
| :--- | :--- | :--- |
| `prp-core-coder` | นักพัฒนาหลัก | เขียนโค้ดตามแผนและทำ validation loop |
| `backend-specialist` | ผู้เชี่ยวชาญ Backend | ออกแบบ API, database และ server logic |
| `frontend-specialist` | ผู้เชี่ยวชาญ Frontend | พัฒนา UI/UX และ frontend implementation |
| `database-architect` | ผู้ออกแบบฐานข้อมูล | ออกแบบ schema, index และ query |

## 4. Quality & Debugging

ใช้ในขั้นตอน `/33-Verify`, `/20-Debug`, `/40-Test`

| Agent | บทบาท | หน้าที่หลัก |
| :--- | :--- | :--- |
| `test-engineer` | วิศวกรทดสอบ | เขียน unit/integration tests |
| `prp-core-debugger` | ผู้เชี่ยวชาญ RCA | วิเคราะห์ root cause ของบั๊ก |
| `code-reviewer` | ผู้ตรวจโค้ดอาวุโส | ตรวจคุณภาพ ความเสี่ยง และมาตรฐานโปรเจค |
| `security-auditor` | ผู้ตรวจความปลอดภัย | ตรวจช่องโหว่และ logic risk |
| `performance-engineer` | ผู้ปรับประสิทธิภาพ | วิเคราะห์ bottleneck ด้าน CPU, memory และ latency |

### 4.1 9arm-Skills Discipline Layer

ใช้เป็นหลักคิดเสริมใน flow เดิม ไม่ใช่ agent ที่มาแทน flow เดิม

Credit เดิม:

- `9arm-skills`
- `thananon/9arm-skills`
- https://github.com/thananon/9arm-skills

| 9arm Skill | ใช้กับ Flow | หน้าที่หลัก |
| :--- | :--- | :--- |
| `debug-mantra` | `/20-Debug` | บังคับ reproduce, trace fail path, falsify hypothesis, cross-reference breadcrumbs ก่อนเสนอ fix |
| `post-mortem` | `/54-Insight` | เปลี่ยน bug/incident ที่แก้และ validate แล้วให้เป็นความรู้ทีม |
| `scrutinize` | `/55-PR-Review`, `/90-Agent code-reviewer` | ตรวจ intent, ทางเลือกที่เล็กกว่า, actual code path, และ risk ก่อน approve |
| `management-talk` | `/51-PR`, `/53-Changelog`, `/99-Help` | แปลงรายละเอียดวิศวกรรมเป็น status/impact/owner/next step ที่ stakeholder อ่านเข้าใจ |

### 4.2 Reusable Engineering Skills

ทักษะเหล่านี้ไม่ใช่ agent แยกแล้ว ให้เรียกผ่าน agent หรือ workflow ที่รับผิดชอบงานนั้นแทน

| Skill | ใช้ผ่าน |
| :--- | :--- |
| `code-simplification` | `prp-core-coder`, `code-reviewer`, `/41-Simplify` |
| `type-design` | `backend-specialist`, `frontend-specialist`, `database-architect`, `code-reviewer` |
| `silent-failure-audit` | `code-reviewer`, `test-engineer`, `backend-specialist`, `security-auditor` |

## 5. Git & Documentation

ใช้ในขั้นตอน `/50-Commit`, `/51-PR`

| Agent | บทบาท | หน้าที่หลัก |
| :--- | :--- | :--- |
| `prp-core-git-committer` | ผู้เชี่ยวชาญ Git | ช่วยเลือกไฟล์และเขียน commit message |
| `prp-core-git-pr-maker` | ผู้จัดการ PR | สรุปข้อมูลและสร้าง pull request |
| `documentation-maintainer` | ผู้ดูแลเอกสาร | วิเคราะห์ผลกระทบต่อเอกสารจากการเปลี่ยนโค้ด |

## 6. Support & Help

ใช้ในขั้นตอน `/99-Help`

| Agent | บทบาท | หน้าที่หลัก |
| :--- | :--- | :--- |
| `coach-guideline` | ที่ปรึกษาหลัก | แนะนำ workflow และคำสั่งที่เหมาะสม |
| `prp-core-codebase-assistant` | ผู้ช่วยโค้ดเบส | ตอบคำถามเกี่ยวกับโครงสร้างและ logic ในโปรเจค |
| `devops-engineer` | วิศวกร DevOps | ดูแล Docker, pipeline, deployment และ server readiness |

## หมายเหตุ

- `.agent` คือ bundle หลักของ framework
- ใช้ `npm run validate` เพื่อตรวจความพร้อมของ framework
- ใช้ `npm run agent -- <command>` เพื่อเรียก PRP CLI จาก Node
