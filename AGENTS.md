# PRPs Specialist Agents

เอกสารนี้สรุป persona หลักที่ใช้ใน PRPs-Framework สำหรับทำงานแบบ agentic workflow ผ่าน `.agent` bundle

## วิธีเรียกใช้งาน

```text
/90-Agent {ชื่อ_AGENT} {ไฟล์_หรือ_โฟลเดอร์_เป้าหมาย}
```

ตัวอย่าง:

```text
/90-Agent discuss-spec .workspaces/specs/007/spec.md
```

## 1. Requirements & Planning

ใช้ในขั้นตอน `/30-Task`, `/31-Plan`, `/12-PRD`

| Agent | บทบาท | หน้าที่หลัก |
| :--- | :--- | :--- |
| `prp-core-planner` | ผู้วางแผนหลัก | วิเคราะห์โค้ดและสร้าง implementation plan |
| `discuss-spec` | วิศวกรข้อกำหนด | ตรวจและขัดเกลา `spec.md` ก่อนเริ่มงาน |
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
| `code-simplifier` | ผู้เชี่ยวชาญ refactor | ปรับโค้ดให้อ่านง่ายและลดความซับซ้อน |
| `type-design-analyzer` | สถาปนิก type | ตรวจ type/interface ให้สอดคล้องกัน |

## 4. Quality & Debugging

ใช้ในขั้นตอน `/33-Verify`, `/20-Debug`, `/40-Test`

| Agent | บทบาท | หน้าที่หลัก |
| :--- | :--- | :--- |
| `test-engineer` | วิศวกรทดสอบ | เขียน unit/integration tests |
| `prp-core-debugger` | ผู้เชี่ยวชาญ RCA | วิเคราะห์ root cause ของบั๊ก |
| `code-reviewer` | ผู้ตรวจโค้ดอาวุโส | ตรวจคุณภาพ ความเสี่ยง และมาตรฐานโปรเจค |
| `security-auditor` | ผู้ตรวจความปลอดภัย | ตรวจช่องโหว่และ logic risk |
| `performance-optimizer` | ผู้ปรับประสิทธิภาพ | วิเคราะห์ bottleneck ด้าน CPU, memory และ latency |
| `silent-failure-hunter` | ผู้ตรวจ failure ที่เงียบ | หาจุดที่ error อาจเกิดแต่ไม่มี log หรือ alert |

## 5. Git & Documentation

ใช้ในขั้นตอน `/50-Commit`, `/51-PR`

| Agent | บทบาท | หน้าที่หลัก |
| :--- | :--- | :--- |
| `prp-core-git-committer` | ผู้เชี่ยวชาญ Git | ช่วยเลือกไฟล์และเขียน commit message |
| `prp-core-git-pr-maker` | ผู้จัดการ PR | สรุปข้อมูลและสร้าง pull request |
| `docs-impact-agent` | ผู้ดูแลเอกสาร | วิเคราะห์ผลกระทบต่อเอกสารจากการเปลี่ยนโค้ด |

## 6. Support & Coaching

ใช้ในขั้นตอน `/99-Coach`

| Agent | บทบาท | หน้าที่หลัก |
| :--- | :--- | :--- |
| `coach-guideline` | ที่ปรึกษาหลัก | แนะนำ workflow และคำสั่งที่เหมาะสม |
| `prp-core-codebase-assistant` | ผู้ช่วยโค้ดเบส | ตอบคำถามเกี่ยวกับโครงสร้างและ logic ในโปรเจค |
| `devops-engineer` | วิศวกร DevOps | ดูแล Docker, pipeline, deployment และ server readiness |

## หมายเหตุ

- `.agent` คือ bundle หลักของ framework
- ใช้ `npm run validate` เพื่อตรวจความพร้อมของ framework
- ใช้ `npm run agent -- <command>` เพื่อเรียก PRP CLI จาก Node
