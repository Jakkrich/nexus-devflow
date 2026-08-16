---
name: prompt-addons
description: Routes external prompt families into DevFlow 2.0 workflows, specialist agents, or thin skill aliases. Use when deciding whether a prompt-inspired behavior should become a mainline workflow, a companion command, a reusable skill, or remain legacy-only.
---

# Prompt Addons

Use this skill when adapting outside prompt patterns into the DevFlow 2.0 system.

## Core Rule

Adapt intent, not old output contracts.

DevFlow 2.0 uses a stage-based, markdown-first model:

1. Mainline workflow stays minimal and ordered
2. Companion commands exist for non-mainline help
3. Specialist agents and skills handle reusable methods
4. JSON-first orchestration is legacy and should not define new architecture

## Mainline Routing

| Need | Route to |
| :--- | :--- |
| Explore problem space | `/00-Discover` |
| Clarify goal, scope, decisions | `/10-Define` |
| Lock delivery contract | `/20-Spec` |
| Break into execution plan | `/30-Plan` |
| Build the change | `/40-Implement` |
| Validate quality and evidence | `/50-Verify` |
| Package release-ready outcome | `/70-Release` |
| Summarize the full run | `/60-Report` |

## Companion Command Routing

| Command | Use when | Typical stage pairing |
| :--- | :--- | :--- |
| `Brainstorm` | โจทย์ยังไม่นิ่ง ต้องคิดทางเลือกก่อน lock | Discover, Define |
| `Research` | ต้องหาหลักฐานหรือข้อมูลเพิ่ม | Discover, Define, Spec, Verify |
| `Debug` | งานผิดปกติ ต้องหา root cause | Implement, Verify |
| `Preview` | ต้องตรวจชิ้นงานระหว่างทาง | Implement, Verify |
| `Wiki` | ต้องสกัดความรู้ reusable | Verify, Release, Report |
| `Help` | ผู้ใช้ไม่แน่ใจว่าจะเริ่มตรงไหน | ก่อนเข้า stage หรือระหว่างทาง |

## Classification Rule

ก่อนสร้าง workflow ใหม่ ให้จัดประเภทก่อน:

1. ถ้า intent เปลี่ยน stage ของงาน ให้ route เข้าสู่ mainline stage ที่มีอยู่
2. ถ้าเป็นวิธีทำงานที่ใช้ซ้ำหลาย stage ให้เป็น skill
3. ถ้าเป็นความเชี่ยวชาญเฉพาะด้าน ให้เป็น agent
4. ถ้าเป็นแค่ตัวช่วยคิดหรือหาหลักฐานระหว่างทาง ให้เป็น companion command
5. ถ้าอิง dashboard/json orchestration เดิมเป็นหลัก ให้คงไว้เป็น legacy หรือ migration note

## Prompt Family Routing

| Family | DevFlow 2.0 route | Keep as |
| :--- | :--- | :--- |
| Spec | `/10-Define`, `/20-Spec`, `/30-Plan` | workflow + `requirements-engineer` |
| Complexity | `/10-Define`, `/30-Plan` | workflow content, not standalone mainline |
| Roadmap | Discover/Define adjacent | skill or optional workflow outside core line |
| Ideation | `Brainstorm`, `Research` | companion command |
| Competitor | `Research` during Discover/Define | companion command or research skill |
| Insight | `Wiki`, `/60-Report` | companion command + report content |
| Coder | `/40-Implement` | workflow + specialist agents |
| QA | `/50-Verify` | workflow + QA/test skills |
| Follow-up | `/10-Define` or `/30-Plan` ของรอบใหม่ | stage reuse, not separate numbered mainline |
| GitHub review | `/50-Verify`, `/70-Release` | workflow/agent support |
| MCP tool validation | `/50-Verify` | tool-specific verification skill |

## Borderline Rules

| Idea | Route | Keep as | Rule |
| :--- | :--- | :--- | :--- |
| Validation fixer | `/50-Verify` แล้วค่อยย้อน `/40-Implement` ถ้าต้องแก้โค้ด | thin skill/process note | ให้ verification ชี้ failure ก่อนเสมอ |
| Documentation ideation | `Brainstorm`, `Wiki`, `/60-Report` | skill-backed support | ไม่ต้องเปิด mainline ใหม่ |
| Performance ideation | `/50-Verify` หรือ `/40-Implement` เมื่อมีหลักฐาน | specialist skill/agent | ต้องมี measurement |
| Security ideation | `/50-Verify` หรือ `Debug` เมื่อมี incident symptom | specialist skill/agent | treat as finding-first |
| Follow-up planning | `/10-Define` -> `/20-Spec` -> `/30-Plan` ของรอบใหม่ | mainline reuse | ไม่แยก workflow หมายเลขใหม่ |
| Legacy dashboard orchestration | legacy note only | migration-only | ไม่ใช้เป็นแบบตั้งต้นของ DevFlow 2.0 |

## Follow-Up Planning

เมื่อผู้ใช้ต้องการต่อยอดงานเดิม:

1. อ่าน stage artifacts ที่มีอยู่ของ running ID เดิม
2. ระบุให้ชัดว่าอะไร lock แล้ว และอะไรจะเพิ่มใหม่
3. เริ่มรอบใหม่จาก `/10-Define` ถ้าโจทย์เปลี่ยน หรือ `/30-Plan` ถ้า spec ยังใช้ได้
4. ใช้ไฟล์ `.md` ของ stage ใหม่เป็นหลักในการบันทึกบริบท

## Output Principle

เมื่อ prompt family ถูกแปลงเข้าระบบ:

1. อย่า copy contract เดิมเข้ามาตรง ๆ
2. แปลงให้สอดคล้องกับ numbering rule ของ DevFlow 2.0
3. อย่าทำให้ผู้ใช้ต้องเดาเลขย้อนกลับ
4. ให้ mainline มีเฉพาะ state ของงาน
5. ให้ความสามารถเสริมไปอยู่ใน skill, agent, หรือ companion command ตามความเหมาะสม
