# 00 Explore: ตรวจทานขอบเขตงานและปรับราคา Nexus-DevFlow

- **Discovery ID**: `DISC-20260822-010`
- **วันที่ตรวจ**: 2026-08-22
- **Decision**: `Defer`
- **เหตุผลของ Decision**: สามารถประเมินมูลค่างานปัจจุบันได้ แต่ยังสรุปส่วนต่างจากราคาเดิมไม่ได้ เพราะไฟล์อ้างอิง `ref/project-proposal.md` ไม่อยู่ใน workspace, path ที่เกี่ยวข้อง หรือ Git history
- **Manday Rate**: `1 MD = 4,500 บาท`

## 1. เป้าหมายและขอบเขตการสำรวจ

ตรวจงานที่ส่งมอบจริงทั้งหมดของ Nexus-DevFlow เทียบกับราคาเดิม เพื่อพิจารณาว่าราคาใหม่ควรเพิ่ม ลด หรือคงเดิม โดยต้องแยก:

1. ความสามารถปัจจุบันที่ยังใช้งานอยู่ (retained deliverable)
2. งานที่เพิ่มภายหลังและมีโอกาสเป็น change request
3. งาน sync, refactor, rollback และ rework ที่ไม่ควรคิดซ้ำเป็น feature เต็ม
4. ราคาใหม่ด้วยเรทเดิม 4,500 บาท/MD

## 2. เส้นทางสำรวจและหลักฐาน

ใช้ **Research & Empirical Proof Lens** ร่วมกับ **PRD & Scoping Lens** โดยตรวจ:

- Source และ tests ใน `packages/create-nexus-devflow/`
- Scripts, report engine, verification tooling และ CI workflows
- `CHANGELOG.md`, Git history/tags และ `devflow/history/HISTORY.md`
- Skill adapters ใน `.agents/skills/` และ `.claude/skills/`
- เอกสารภาษาไทย/อังกฤษและ migration guidance

หลักฐานเชิงปริมาณที่ยืนยันได้:

- เวอร์ชันปัจจุบัน `2.0.27`
- Git history 213 commits; 87 commitsหลัง v2.0.0
- Release ledger 37 entries, feature archives 36 และ rollback 1
- `.agents` 35 skills, `.claude` 32 skills, routing eval datasets 28 ชุด
- Installer source 22 library modules และ CLI entry point
- Automated verification: installer tests 59/59 ผ่าน, overview tests 4/4 ผ่าน
- `npm run check` ผ่านทั้ง typecheck, static validation, routing evaluation, unit tests และ package smoke test
- Package smoke test build/package/install overlay 88 files สำเร็จ

ข้อสังเกตด้านคุณภาพ: routing evaluation จบด้วย exit code ผ่าน แต่มีผล Rank-1 accuracy `92.86%` (104/112 cases; 8 misses จากชื่อ dataset เก่า `00-discover`/`70-release` เทียบ canonical skills ใหม่ `00-explore`/`70-deliver`) จึงควรกันงานแก้ contract/eval drift ไว้ใน hardening ไม่ควรอ้างว่า routing ถูกต้อง 100%

### ข้อจำกัดของ baseline

ค้นหา `project-proposal.md`, `proposal`, `4,500`, `4500`, `Manday`, `แมนเดย์` และ `บาท` ใน workspace, `D:\devtools`, Codex paths และ Git ทุก branch แล้วไม่พบเอกสารราคาเดิม ดังนั้นยอดเดิมต้องระบุเป็น **N/A (ไม่ใช่ 0 บาท)**

## 3. Capability Inventory ที่ส่งมอบจริง

| กลุ่มงาน | ความสามารถที่มีอยู่จริง | หลักฐานหลัก |
| :--- | :--- | :--- |
| Workflow architecture | 3-Pillars, Fast-Track 4 ขั้น, Deep-Track 8 ขั้น, living spec, single-active-run, track root switch | `README.th.md`, `lib/workflow-state.ts`, `lib/current-work.ts` |
| Skills & adapters | Workflow/companion skills, Codex/Antigravity/Copilot และ Claude adapters, routing eval | `.agents/skills/`, `.claude/skills/`, `evals/routing/` |
| Installer/update lifecycle | NPX overlay, manifest, conflict planning, multi-adapter install, update, uninstall/eject, backup และ atomic rollback | `bin/create-nexus-devflow.ts`, `lib/update.ts`, `lib/uninstall.ts` |
| Operations CLI | status, project detection, git/work tracking, idea, findings, doctor/fix, archive, check-gate และ hooks | `lib/status.ts`, `lib/doctor.ts`, `lib/findings.ts`, `lib/gatekeeper.ts`, `lib/git-hooks.ts` |
| Live dashboard | Local HTTP server, Snapshot API, dual-track visualizer, responsive UI, accessibility, animations และ command interactions | `lib/dashboard.ts`, `lib/dashboard-page.ts`, `lib/dashboard-snapshot.ts` |
| Planning intelligence | discovery, audit, release readiness, feature brief, sub-feature splitter และ overview compiler | Skills 034–039, `scripts/overview.ts` |
| Reporting/document tools | Markdown/HTML report engine, presets, standalone report และ convert-any-to-md | `scripts/lib/render-html/`, `scripts/generate-report-html.mjs`, skill `convert-any-to-md` |
| QA/release engineering | Typecheck, static contracts, 59 installer tests, overview tests, routing evals, security/docs scans, package smoke และ CI publish | `package.json`, `packages/create-nexus-devflow/test/`, `.github/workflows/` |
| Documentation/migration | Thai/English guides, onboarding/adoption, 3-Pillars migration, examples, governance และ release process | `README.md`, `README.th.md`, `docs/` |

## 4. ราคาใหม่แบบ Provisional (Net Delivered Capability)

หลักการ: ประเมินจาก replacement effort ของความสามารถปัจจุบันแบบ feature-cluster และไม่บวกราคาทุก release/run เพื่อหลีกเลี่ยงการคิดซ้ำ

| # | กลุ่มงาน | Low MD | Recommended MD | High MD | ราคา Recommended |
| -: | :--- | ---: | ---: | ---: | ---: |
| 1 | Product/workflow architecture และ state contracts | 9 | 11 | 13 | 49,500 บาท |
| 2 | Skills, adapters, routing และ planning intelligence | 15 | 18 | 21 | 81,000 บาท |
| 3 | NPX installer, update, manifest, backup/rollback และ packaging | 10 | 12 | 14 | 54,000 บาท |
| 4 | Operational CLI, lifecycle, status, doctor, idea/findings/history | 11 | 14 | 16 | 63,000 บาท |
| 5 | Live Dashboard, APIs, responsive UI และ accessibility | 10 | 13 | 16 | 58,500 บาท |
| 6 | Report engine, document converter และ overview compiler | 8 | 10 | 12 | 45,000 บาท |
| 7 | Tests, quality/security gates, CI, hooks และ monitoring | 9 | 11 | 13 | 49,500 บาท |
| 8 | Documentation, Thai/English localization และ migration guides | 5 | 7 | 8 | 31,500 บาท |
| 9 | Integration, hardening, release และ delivery coordination | 6 | 8 | 10 | 36,000 บาท |
| **รวม** |  | **83 MD** | **104 MD** | **123 MD** | **468,000 บาท** |

ช่วงความไม่แน่นอน: `373,500–553,500 บาท` ส่วนราคากลางที่แนะนำสำหรับ current retained scope คือ **104 MD = 468,000 บาท**

## 5. Change-order Candidates ที่มีหลักฐานว่าเพิ่มภายหลัง

ตารางนี้เป็น “ส่วนของ 104 MD” ไม่ใช่ยอดที่นำไปบวกซ้ำกับ 104 MD และต้องเทียบ proposal เดิมก่อนอนุมัติเป็น delta

| กลุ่มที่มีโอกาสอยู่นอก scope เดิมสูง | MD ภายในราคากลาง | มูลค่า |
| :--- | ---: | ---: |
| Dual-Track, 3-Pillars, living spec และ unified state switch | 7 | 31,500 บาท |
| Native Status/Operations CLI, doctor/findings/archive, uninstall และ backup rollback | 14 | 63,000 บาท |
| Live Dashboard, Snapshot API, accessibility, motion และ responsive parity | 13 | 58,500 บาท |
| Specialist skills: audit, discovery, cloud release, brief และ sub-feature splitting | 10 | 45,000 บาท |
| HTML/report tooling, document converter และ overview compiler | 10 | 45,000 บาท |
| CI gatekeeper, Git hooks, security/findings governance และ expanded tests | 7 | 31,500 บาท |
| **รวม candidate change order สูงสุด** | **61 MD** | **274,500 บาท** |

หาก proposal เดิมมีรายการใดอยู่แล้ว ต้องหัก MD ของรายการนั้นออกจาก change order ห้ามคิดซ้ำ

## 6. งานที่ควรลด/ไม่คิดซ้ำ

| งาน | แนวทางราคา |
| :--- | :--- |
| Run 026 ที่ถูก rollback | ไม่นับเป็น retained feature; คิดเฉพาะค่า change request/rollback หากสัญญาอนุญาต |
| Upstream sync 024/028/030 | รวมใน dashboard/maintenance cluster ห้ามคิดเป็น feature เต็ม 3 รอบ |
| Cleanup/pruning/rebrand/deletion | รวมเป็น hardening ไม่คิดตามจำนวนไฟล์หรือ release |
| Legacy Feb–Jul ที่ถูกแทนที่ใน v2 | ไม่นับซ้ำกับ replacement cost ของ v2 ปัจจุบัน |
| Bug fixes ที่ทำให้ AC เดิมผ่าน | ปกติรวมในราคาฟีเจอร์เดิม ไม่ตั้งราคาเพิ่ม เว้นแต่เป็น requirement change |

## 7. สูตรตัดสิน เพิ่ม/ลด/คงราคา

ให้ `O` = ยอด MD รวมใน proposal เดิมที่ตรวจยืนยันแล้ว

- ถ้า `O < 104 MD`: ราคากลางใหม่ควร **เพิ่ม** `(104 - O) × 4,500 บาท`
- ถ้า `O = 104 MD`: **คงราคา** `468,000 บาท`
- ถ้า `O > 104 MD`: ควร **ลด** `(O - 104) × 4,500 บาท` เว้นแต่ proposal มีบริการ/เงื่อนไขที่ไม่อยู่ใน repo

การตัดสินที่แม่นยำกว่าคือเทียบทีละ line item ไม่ใช่เทียบยอดรวมอย่างเดียว เพราะ proposal อาจรวม PM, warranty, deployment, hosting, VAT หรือ support ที่ไม่ได้สะท้อนใน source code

## 8. Open Questions / Approval Gate

1. ต้องแนบหรือวางไฟล์ `project-proposal.md` ให้เข้าถึงได้ เพื่อสกัดยอด MD/ราคาเดิมและ scope assumptions
2. ราคาเดิมรวม PM, UAT, warranty/support, deployment, hosting, VAT และ third-party costs หรือไม่
3. ต้องการคิดเป็น fixed price, actual delivered effort หรือ replacement cost

## 9. Decision

**Defer การฟันธงส่วนต่างจากราคาเดิม** จนได้ proposal baseline ที่ตรวจสอบได้

ระหว่างรอ ใช้ **104 MD / 468,000 บาท** เป็นราคากลางชั่วคราวของ current retained scope และใช้ change-order candidate สูงสุด **61 MD / 274,500 บาท** สำหรับ reconciliation ทีละรายการ โดยไม่บวกซ้ำ
