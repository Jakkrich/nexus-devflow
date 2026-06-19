# Prompt Addons

เอกสารนี้อธิบายการ map prompt family ภายนอกเข้าสู่ DevFlow 2.0

## Core Principle

เอา “intent และวิธีคิด” มาใช้ แต่ไม่ย้าย contract เดิมเข้ามาทั้งชุด

DevFlow 2.0 ใช้หลักดังนี้:

1. mainline workflow มีเฉพาะ state ของงาน
2. companion commands ใช้กับงานที่ไม่ควรแทรกเลขในเส้นหลัก
3. reusable methods ไปอยู่ใน skills
4. domain expertise ไปอยู่ใน agents
5. JSON/dashboard-heavy behavior เก็บเป็น legacy หรือ migration note

## Mainline Map

| Need | Route to |
| :--- | :--- |
| Explore problem space | `/00-Discover` |
| Clarify scope and decisions | `/10-Define` |
| Lock delivery contract | `/20-Spec` |
| Build execution plan | `/30-Plan` |
| Implement the work | `/40-Implement` |
| Verify the result | `/50-Verify` |
| Prepare release-ready handoff | `/60-Release` |
| Summarize full run | `/70-Report` |

## Companion Command Map

| Command | Use when |
| :--- | :--- |
| `Brainstorm` | โจทย์ยังไม่นิ่ง ต้องคิดทางเลือกก่อน lock |
| `Research` | ต้องหาข้อมูลหรือหลักฐานเพิ่ม |
| `Debug` | ต้องหา root cause |
| `Preview` | ต้องตรวจงานระหว่างทาง |
| `Wiki` | ต้องสกัดความรู้ reusable |
| `Help` | ผู้ใช้ไม่แน่ใจว่าจะเริ่มจาก stage ไหน |

## Prompt Family Routing

| Family | Route in DevFlow 2.0 | Keep as |
| :--- | :--- | :--- |
| Spec | Discover, Define, Spec, Plan | workflow + `requirements-engineer` |
| Complexity | Define, Plan | workflow content |
| Roadmap | work outside core line | internal companion wrapper + `roadmap-strategy` |
| Ideation | `Brainstorm`, `Research` | companion command |
| Competitor | `Research` in early stages | companion command or research skill |
| Insight | `Wiki`, `Report` | companion command + report content |
| Coder | `/40-Implement` | workflow + specialist agents |
| QA | `/50-Verify` | workflow + QA/test skills |
| Follow-up | new round through Define/Spec/Plan | internal companion wrapper + follow-up routing skill |
| GitHub PR | Verify, Release side flows | internal companion wrappers + review/release skills |
| Validation tools | `/50-Verify` | tool-specific skill guidance |
| 9arm discipline | Debug, Verify, Report, PR review support | credited skill layer |

## Classification Rule

ก่อนเพิ่ม workflow ใหม่:

1. ถ้า intent คือการย้าย state ของงาน ให้ map เข้าสู่ mainline stage
2. ถ้าเป็นวิธีทำงานที่ใช้ซ้ำได้หลาย stage ให้เป็น skill
3. ถ้าเป็นความเชี่ยวชาญเฉพาะสาย ให้เป็น agent
4. ถ้าเป็นตัวช่วยคิดหรือรวบรวมหลักฐาน ให้เป็น companion command
5. ถ้าอิง flow เก่าหรือเลขเก่าย้อนกลับ ให้หลีกเลี่ยงการเพิ่มเป็น numbered workflow

## Borderline Cases

| Idea | Decision |
| :--- | :--- |
| validation fixer | อยู่ใต้ `/50-Verify` แล้วค่อยย้อน `/40-Implement` ถ้าต้องแก้โค้ด |
| documentation ideation | ใช้ `Brainstorm`, `Wiki`, หรือ `Report` ไม่เปิด mainline ใหม่ |
| performance/security ideation | อยู่ใน verification/review flow และ specialist skills |
| follow-up planning | เริ่มรอบใหม่ผ่าน stage หลัก ไม่สร้างเลขแยก |
| autonomous orchestration alias | เก็บเป็น internal companion wrapper หรือ doc note |

## Suggested Starts

| User intent | Start here |
| :--- | :--- |
| โจทย์ยังกว้าง ยังไม่ชัด | `/00-Discover` |
| โจทย์พอชัดแต่ยังไม่ lock | `/10-Define` |
| ต้องการ spec ส่งมอบที่ชัด | `/20-Spec` |
| พร้อมแตกงาน | `/30-Plan` |
| พร้อมลงมือทำ | `/40-Implement` |
| ต้องการตรวจคุณภาพ | `/50-Verify` |
| ต้องการสรุปจบงาน | `/70-Report` |
