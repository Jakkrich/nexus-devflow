# Completed Fix 086: Skill prompts and routing verification

**Type:** Fix
**Status:** Integrated into main; included in release v2.17.4
**Completed date:** 2026-09-14
**Branch:** fix/086-align-skill-prompts
**Reviewed checkpoint:** 7a1f78655ee71dd68fa40ab22cfe739be8f0edb1

## Summary

ปรับทั้ง 6 จุดของ workflow prompts และ routing evaluation พร้อมซ่อมลิงก์ P3; Verify ผ่านและ independent review ผ่านก่อน archive งาน ยังไม่ได้ merge หรือ push

## Symptom

คำสั่ง review cadence และ context paths ไม่สอดคล้องกับ config/Multi-Run; entrypoint โหลดรายละเอียดเกินจำเป็น และ lexical evaluation ยังไม่แยกหลักฐานพฤติกรรม agent ลิงก์ diagram checklist หลังแยก references กลายเป็น Markdown link ซ้อน

## Root Cause

คำสั่ง workflow ซ้ำในหลายบริบทและมี unconditional pauses; diagram entrypoint รวมหลายเส้นทางไว้ในไฟล์เดียว การแทน section references แปลง section 6 ของ output-spec เป็น SVG primitives โดยไม่รักษาขอบเขต reference เจ้าของ section

## Why it Produced the Symptom

agent อาจหยุดระหว่างงานที่อนุมัติแล้วหรืออ่านบริบทผิด run ส่วนลิงก์ซ้อนส่งผู้อ่านไป connector rules แทน output checklist การตรวจเพียง file existence ไม่ตรวจพบความผิดพลาดนี้

## Fix

อ่าน review cadence จาก config, ใช้ task-isolated paths, รักษาขอบเขต fix/implement, แยก Help และ diagram references, ใช้ focused checks ระหว่างขั้น และแยก lexical smoke จาก behavioral observations แก้ output checklist เป็นลิงก์เดี่ยวไป output-spec.md#6-checklist ในทั้งสอง adapters

## How it Was Found

ตรวจไฟล์เทียบบทความ OpenAI และใช้ reviewer อิสระตรวจ full delta Regression สำหรับ nested link ล้มเหลวกับไฟล์เดิมทั้งสอง adapters และผ่านหลังแก้; reviewer ยืนยัน anchor และปิด Q-001

## Why it Slipped Through

reference tests เดิมตรวจ stale SKILL pointers และไฟล์ปลายทาง แต่ไม่ตรวจ nested Markdown links ส่วน behavioral corpus ยังไม่มี fresh-session marker-selected profile scenario จึงเหลือ Q-002

## Validation

- `npm.cmd run check` PASS หลังซ่อม P3: typecheck, static, routing 211/211, regression 15/15, installer tests 185/185 และ package smoke
- Independent review: passed/current ที่ reviewed checkpoint ก่อน archive; Q-001 closed, Q-002 P2 open, ไม่มี P0/P1
- สำเนา adapters ที่แก้ตรงกัน 36 คู่; complete-delta whitespace check ยังมี EOF blank-line warnings 16 จุด
- Behavioral observations เป็น decision simulation ของ agent ที่ไม่ทราบ exact model; ไม่ใช่ end-to-end หรือ cross-model benchmark

## Action Items

- [x] เพิ่ม nested-link regression ใน required Verify
- [x] เก็บ receipt, findings และ observations ฉบับเต็มใน archive นี้
- [ ] Q-002: resolve effective profile แบบ read-only ก่อน generation ทุกครั้ง และเพิ่ม fresh-session profile scenario; ยังไม่ได้จัดสรร follow-up run หรือ owner

## How to Try

รัน `npm.cmd run check` จาก repository root เพื่อทดสอบ framework หรือรัน `node --import tsx --test scripts/test/skill-reference-links.test.ts` เพื่อตรวจ reference โดยตรง เปิดลิงก์ output checklist ใน validation.md แล้วตรวจว่าถึงหัวข้อ `6. Checklist`

## Verified Spec Snapshot

เนื้อหาด้านล่างเก็บ spec ที่ใช้คำนวณ hash ตอน review; ข้อความ checkpoint pending ใน snapshot เป็นประวัติขณะสร้าง checkpoint สถานะ completion ปัจจุบันอยู่ส่วนหัวของ archive

# Fix: ปรับคำสั่ง skills และหลักฐาน routing

**Type:** Fix
**Status:** verified
**Branch:** fix/086-align-skill-prompts

## 🎯 1. Define & Boundaries

แก้ทั้ง 6 ข้อจากการตรวจเทียบบทความ OpenAI ตามคำขอผู้ใช้: review cadence, Multi-Run context, fix intent, progressive disclosure, verification scope และ routing evaluation

คำสั่ง skills ใช้ภาษาอังกฤษ; spec และผลรายงานใช้ภาษาไทย การอนุมัติจากผู้ใช้ครอบคลุมการแก้และตรวจในเครื่อง และ local checkpoint commit สำหรับ independent review ไม่รวม merge, push หรือ publish

อ้างอิง: https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

## 📐 2. Technical Spec & Contracts

- `stepReview` และ `checkpointCommits` ทำงานแยกกัน ใช้ค่าจาก config โดยไม่เพิ่ม schema ใหม่
- เอกสารปัจจุบันใช้ `context/{xxx-slug}/spec.md`, `stage.md`, `findings.md`; หลาย run ร่างคู่กันได้ แต่ไม่ปะปน working tree
- `/fix` เป็นการร่าง spec; คำขอแก้จนเสร็จต้องรักษาขอบเขตการอนุมัติเดิมและดำเนิน workflow ต่อ
- Help และรายละเอียด diagram โหลดตามเงื่อนไข พร้อมรักษา references/assets และคำสั่งตรวจที่มีอยู่
- TDD ใช้กับ logic/behavior; focused checks ระหว่าง step และ required gates ก่อน handoff
- Heuristic routing ตรวจ positive/negative และ abstention; behavioral corpus มีภาษาไทย/อังกฤษและผล agent แยกจาก heuristic
- Quality gates: `qualityGates.regular.independentReview = when-sensitive`; เลือก independent review เนื่องจากปรับคำสั่งที่กระทบ workflow หลายจุด ใช้ automatic ตาม config เมื่อ runtime รองรับ

## 📋 3. Execution Plan & TDD Checklist

- [x] ปรับ cadence และขอบเขต verification ใน implement และบริบทที่เกี่ยวข้อง
- [x] แก้ Multi-Run paths และ fix intent พร้อมสำเนา adapters
- [x] แยก Help/diagram references และย่อ descriptions
- [x] เพิ่ม regression tests ให้ evaluator แล้วแก้จนผ่าน
- [x] ตรวจ routing ด้วย agent อิสระและบันทึกข้อจำกัด
- [x] รัน required checks และบันทึกผล

## ⚡ 4. Implementation Log & Evidence

เริ่มจาก description ของ fix ภาษาอังกฤษที่แก้ในบทสนทนาก่อนหน้า โดยรักษางานนั้นไว้

- แก้ implement ให้แยก `stepReview`/`checkpointCommits` ทั้งสี่ชุดค่า ลด full-suite reruns และรักษา commit authorization
- แก้ ai-interaction/glossary/coding-standards ให้ใช้ task paths และการร่างหลาย run; ลดการโหลดบริบทและ third-party skills โดยไม่มีเหตุจำเป็น
- รักษา `/fix` เป็น planning-only เมื่อเรียกตรง และให้คำขอ implement+verify ใช้ spec เป็น internal handoff ต่อได้
- ย้าย Help protocol ไป `devflow/reference/help-playbook-protocol.md` ซึ่งถูกแจกจ่ายกับ package; มี fallback เมื่อไม่มี HTML template
- แยก diagram entrypoint เป็น router กับ references 9 หมวด พร้อมแก้ลิงก์ย้อนกลับจาก type/import guides; sync ทั้งสอง adapters โดยไม่ลบ extensions
- ย่อ descriptions ของ implement, fix, diagram-design, ponytail, archify และ bughunter โดยใช้ภาษาอังกฤษ
- Heuristic evaluator รองรับ abstention, negative cases, explicit `/`/`$` invocation, Unicode tokens และ fail เมื่อไม่มีข้อมูล; แยก behavioral scorer ออกจาก heuristic
- เพิ่ม regression checks ใน `npm run check` และตรวจ packaged help reference ใน smoke test

## 🧪 5. Multi-Lane Verification Matrix

รอบนี้ตรวจการทำงาน evaluator, ความสอดคล้อง adapters, references และ framework checks; ไม่เรียกบริการ production

| หลักฐาน | ผล |
|---|---|
| `npm.cmd run check` | PASS: typecheck, static contracts, routing, regression tests, installer build/tests และ package smoke |
| Installer unit tests | PASS 185 tests |
| Routing smoke | PASS 211 positive/negative cases; ไม่ใช่การวัดความเข้าใจโมเดล |
| Regression tests ใหม่ | PASS 15 tests: routing 8, behavioral scorer 5, reference links 2 |
| Final reference repair | `npx.cmd tsx --test scripts/test/skill-reference-links.test.ts` PASS หลังการแก้ references ชุดสุดท้าย |
| Behavioral decision probe | Agent อิสระ `/root/skill_forward_probe`, model identity ไม่เปิดเผย (`unknown`), 14 scenarios; ดู behavioral-observations.json |
| Fresh code/instruction review | `/root/review_prompt_changes` พบ P2 ลิงก์ section เก่า; แก้และ reviewer ยืนยันปิดแล้ว |
| `git diff --check` | PASS |

ข้อจำกัดและประวัติการตรวจ:
- รอบแรกของ Verify: installer tests ผ่าน 185 tests แต่ package smoke ถูก sandbox บล็อก npm cache; ขอสิทธิ์แล้ว Verify รอบเต็มผ่าน
- Regression แรกยืนยัน tokenizer ทิ้งภาษาไทยและ frontmatter เก็บ quote; API ใหม่ยังไม่มี ต่อมา tests ผ่านหลังแก้
- Link regression จับ stale section pointers ได้ก่อนซ่อม จากนั้นผ่านหลังขยาย coverage และซ่อมทั้งสอง adapters
- Behavioral probe รอบแรกได้ 12/14 เพราะ expectedSkills ของ deliver-en/th ตกหล่น `check` ทั้งที่คำขอให้ตรวจ runtime behavior; แก้ expected result เป็น fix → implement → check ตามขอบเขตคำขอ โดยไม่แก้ observations จาก agent แล้ว scorer ได้ 14/14
- Behavioral evidence เป็นการจำลองการตัดสินใจหนึ่ง agent ไม่ใช่ end-to-end execution หรือ cross-model benchmark; ไม่อ้าง exact model และไม่ใช่ immutable independent-review receipt
- ผู้ใช้อนุมัติ checkpoint commit แล้ว; formal independent-review gate ใช้ receipt ที่ผูกกับ checkpoint การตรวจแบบ read-only ข้างต้นไม่ใช้แทน receipt

## 📦 6. Release Digest & Retrospective

เตรียม approved checkpoint commit; ยังไม่ archive

ผลลัพธ์พร้อมตรวจทานใน branch `fix/086-align-skill-prompts`; ผู้ใช้อนุมัติ exact candidate checkpoint เพื่อ formal independent review ตาม implement/SKILL.md ไม่รวม merge/push/publish

## P3 follow-up (2026-09-14)

- [x] Repair Q-001 in both adapters and verify the nested-link regression.

User requested repair of Q-001. Both validation references now link directly to the output-spec checklist; the regression catches the original nested link. The previous passing receipt applies only to checkpoint `2085fd6`; this repair requires a new checkpoint and independent review before completion.

Verification after Q-001 repair: `npm.cmd run check` PASS (typecheck, static, routing 211/211, regression 15/15, installer 185/185, package smoke). The two modified adapter files have identical SHA256 hashes. `git diff --check` passes for the current working-tree diff; prior checkpoint EOF warnings remain outside this repair.

## Findings

# Findings

ข้อค้นพบต้นทางทั้ง 6 ข้อบันทึกเป็นงานใน spec.md

## F-01: ลิงก์ section เก่าหลังแยก diagram references

**Severity:** P2
**Status:** closed
**Reviewer:** /root/review_prompt_changes

**Evidence:** import/type/output references ยังชี้ SKILL.md §5/§6/§7/§9 ที่ย้ายออกแล้ว รวมถึงแบบย่อ §6 และแบบกลับด้านใน type-deployment

**Resolution:** แก้เป็น explicit links ไป design.md, svg-primitives.md, layout.md, validation.md และ setup.md ตามเนื้อหา พร้อมแก้ทั้งสอง adapters; regression test ยืนยัน failure ก่อนซ่อมและผ่านหลังซ่อม

**Re-review:** Reviewer อิสระยืนยันว่า targets มีเนื้อหาที่อ้างจริงและสำเนาตรงกัน จึงปิด P2 ไม่ใช่ formal checkpoint receipt

## Q-001: ลิงก์ checklist ของ output specification กลายเป็นลิงก์ซ้อน

**Severity:** P3
**Status:** closed
**Reviewer:** codex / gpt-6-astra / fresh subagent

**Evidence:** ที่ target `2085fd627ffb2a307ef3f54fc519e10386232f09`, `.agents/skills/diagram-design/references/validation.md:16` และ `.claude/skills/diagram-design/references/validation.md:16` มี `[output-spec.md [section 6](svg-primitives.md)](output-spec.md)` ขณะที่ต้นทางใน SKILL.md ของ base อ้าง `output-spec.md §6` ซึ่งเป็น checklist ของ format/size/detail/audience ไม่ใช่ SVG primitives section 6

**Impact:** เมื่อเข้า diagram import → validation ลิงก์ซ้อนทำให้ section 6 ชี้ไป connector rules และข้อความ Markdown ไม่สร้างลิงก์ output-spec ตามที่ตั้งใจ อย่างไรก็ดี imports.md และ import guides ยังลิงก์ output-spec ถูกต้อง จึงเป็นข้อบกพร่องการนำทางที่ไม่บล็อก delivery

**Resolution:** ยังไม่แก้ใน reviewer session; เปลี่ยนเป็นลิงก์เดี่ยว `[output-spec.md §6](output-spec.md)` ทั้งสอง adapters และเพิ่มกรณีตรวจ nested links โดยไม่เปลี่ยน section ที่เป็นของ reference เอง

**Verification:** ตรวจ source diff เทียบ base และค้น nested-link pattern พบกรณีนี้หนึ่งจุดต่อ adapter; regression suite ปัจจุบันยังผ่าน 15/15 เพราะตรวจเพียง file existence และ stale SKILL.md pointers ไม่ตรวจความหมายหรือโครงสร้าง nested links

**Repair (2026-09-14):** Replaced the nested link in both adapters with `[output-spec.md section 6](output-spec.md#6-checklist)`. Confirmed the target heading is `## 6. Checklist`. The reference regression now rejects nested Markdown links: failed on both original files, then passed 2/2 after repair. Awaiting independent re-review.

**Independent re-review (2026-09-14):** codex / gpt-6-astra / fresh subagent ตรวจ target `7a1f78655ee71dd68fa40ab22cfe739be8f0edb1` แล้ว ลิงก์เดี่ยวชี้ `output-spec.md#6-checklist` และหัวข้อ `## 6. Checklist` มีอยู่จริงทั้งสอง adapters; รัน regression suite ผ่าน 15/15 และใช้ regex ของ regression ตรวจ bytes จาก checkpoint เดิมในหน่วยความจำ ยืนยันว่าจับ nested link เดิมได้ทั้งสองไฟล์ แต่ไม่จับไฟล์ที่ซ่อมแล้ว จึงปิด Q-001 โดยไม่ได้แก้ source จาก reviewer session

## Q-002: Routine diagram route ไม่รับประกันการ resolve project profile ใน session ใหม่

**Severity:** P2
**Status:** open
**Reviewer:** codex / gpt-6-astra / fresh subagent

**Evidence:** `.agents/skills/diagram-design/SKILL.md:17` และสำเนา `.claude` โหลด `setup.md` เฉพาะ initial brand setup หรือ profile change ขณะที่เส้นทาง routine generation ไป `design.md:47-49` ซึ่งสั่งอ่าน installed `style-guide.md` โดยตรง การตรวจ project marker ถูกย้ายออกจาก entrypoint ไป `setup.md:9` แต่ `profiles.md:65-84` กำหนดให้ resolve effective guide ใหม่ก่อนทุก diagram และ marker-selected profile ต้องอ่านจาก library โดยไม่ copy ทับ installed guide

**Impact:** ใน fresh session ของโครงการที่ตั้ง `.diagram-design` เป็น `profile: acme` ไว้แล้ว การสร้าง diagram ปกติไม่ได้เป็น initial setup หรือ profile change จึงมีเส้นทางตาม router ที่ไม่อ่าน marker/resolution contract และใช้สีหรือฟอนต์จาก shared working copy แทน profile ของโครงการ ข้อความให้ reuse existing profile ไม่ระบุวิธีค้นและ resolve ใน fresh context ข้อนี้เป็น instruction-path defect ที่ตรวจจากเอกสาร ยังไม่ได้รัน model-generation experiment เพื่อวัดความถี่ที่เกิดจริง

**Resolution:** ให้ entrypoint resolve effective profile ก่อน generation ทุกครั้งโดยลิงก์ตรงไป resolution contract; แยกการ resolve แบบ read-only ออกจาก onboarding/การถาม brand ซ้ำ ซึ่งยังควรโหลดเฉพาะเมื่อจำเป็น

**Verification:** ไล่เส้นทาง entrypoint → selection → design/style-guide → validation/delivery เทียบกับ setup/profiles ทั้งสอง adapters; ทุก changed adapter file 36 คู่มี bytes เท่ากัน Behavioral corpus ปัจจุบันทดสอบ approved default แต่ไม่มี fresh-session marker-selected profile scenario

## Independent review

# Independent Review

**Status:** passed
**Target commit:** 7a1f78655ee71dd68fa40ab22cfe739be8f0edb1
**Base commit:** 53c0d3819bd9091e4fe86456872ebf6d9c601c18
**Base ref:** main
**Spec hash:** 78f09abe4d5eb19933484186a49190a553cd05551cd95e8feb2bb9d1534fd8b2
**Prepared by:** codex
**Builder model:** unknown (runtime did not expose exact model)
**Requested reviewer:** codex
**Requested model:** gpt-6-astra
**Requested execution:** automatic
**Requested at:** 2026-09-14T05:19:45.397Z
**Workflow:** regular
**Check required:** no

**Reviewer adapter:** codex
**Reviewer model:** gpt-6-astra
**Reviewer context:** fresh subagent
**Actual execution:** automatic
**Reviewed at:** 2026-09-14T05:23:15Z
**Scope:** current
**Lenses:** quality, security, performance, tests
**Verdict:** passed
**Check result:** not-required

## Handoff

Review the active spec and complete 53c0d3819bd9091e4fe86456872ebf6d9c601c18..7a1f78655ee71dd68fa40ab22cfe739be8f0edb1 delta from a fresh isolated child with no builder transcript. Read the project-local .agents/skills/audit/SKILL.md and reference/independent-review.md; execute Phase B across quality, security, performance, and tests. Include the changed local diagram extensions in both adapters. Existing findings are context, not the scope. Assess the P3 repair as part of the full review. Write only this review.md and this run's findings.md. Do not edit product, spec, config, or tests; do not commit or perform external actions. The runtime dispatch selects codex, gpt-6-astra, high reasoning, fork_turns=none; record these declared metadata honestly. Check is not selected under the regular manual policy. Distinguish commands run in this reviewer pass from existing verification evidence.

## Commands

- `git status --short`, `git rev-parse HEAD`, `git merge-base main HEAD`, `Get-FileHash devflow/context/086-align-skill-prompts/spec.md -Algorithm SHA256`: pass; target/base/spec ตรง request และมีเพียง review/findings ที่ต่างจาก target
- `git diff 53c0d38..HEAD` แบบแยกตามพื้นที่ และการอ่านไฟล์ที่เชื่อมต่อ: pass; ครอบคลุม complete delta ยกเว้น review/findings ที่ใช้เป็นข้อมูลประกอบ
- `npm.cmd run typecheck`: pass, exit 0
- `npm.cmd run check:static`: pass, exit 0; core contracts และ local extension inventory
- `npm.cmd run test:routing`: pass, exit 0; 211/211 positive/negative cases, false activations 0
- `node --import tsx --test scripts/test/routing-evals.test.ts scripts/test/behavioral-evals.test.ts scripts/test/skill-reference-links.test.ts`: pass, exit 0; 15/15
- `node --import tsx scripts/evals/behavioral.ts devflow/context/086-align-skill-prompts/behavioral-observations.json`: pass, exit 0; rescore observations เดิม 14/14 ไม่ใช่การเรียก model probe ใหม่
- Inline read-only Node checks ผ่าน `node --input-type=module`: pass; changed adapter files 36 คู่มี bytes เท่ากัน และ regex จับ Q-001 จาก `git show 2085fd6:<path>` ได้ทั้งสอง adapters ขณะที่ target ไม่มี nested link และ anchor มีหัวข้อรองรับจริง
- `git diff --check 53c0d38..HEAD`: fail, exit 1; มีเพียง blank line at EOF ใน references 8 ไฟล์ต่อ adapter ไม่ใช่ required behavioral gate

## Evidence

- เป้าหมายของงานคือให้ skill prompts รักษาขอบเขตที่ผู้ใช้อนุมัติ โหลดบริบทตามความจำเป็น และแยก lexical smoke ออกจาก behavioral observations โดยไม่เพิ่ม config schema หรือ dependency
- Quality: ไล่ fix/devflow intent → implement target/branch selection → cadence ทั้งสี่ชุดค่า → focused checks/final Verify → independent checkpoint และ handoff; การข้าม skill ไม่กลายเป็น commit authorization ตรวจ shared context paths และ Help → packaged reference พร้อม template fallback
- Diagram extensions: ตรวจ router และ references ใหม่ครบ 9 หมวด เทียบข้อความที่ย้ายจาก entrypoint เดิม รวม type/import/output/profile backlinks และสำเนาทั้งสอง adapters; self-check, import trust boundary, accessibility, fidelity ledger และ export contract ยังคงอยู่ พบ Q-002 ที่ routine profile resolution
- Security: evaluator อ่าน local metadata/fixtures เป็นข้อมูล ไม่ execute prompt หรือ JSON; skill-name validation จำกัด dynamic regex; คำสั่ง check ใหม่เป็นค่าคงที่ ตรวจการคงขอบเขต commit/merge/push และการปฏิบัติต่อ diagram imports เป็น untrusted data ไม่พบ security blocker ใน delta
- Performance: routing และ scorer ทำงานกับ local corpus ที่จำกัด ไม่มี network/hot-path เพิ่ม การ match observations มีการค้น scenarios ซ้ำแต่ corpus มี 14 รายการ ไม่พบผลกระทบที่รองรับ finding; การแยก diagram references ลด entry context และไม่มี dependency ใหม่
- Tests: ตรวจ assertions ของ abstention, explicit invocation, Thai tokens, negative activation, malformed/duplicate/missing observations และ reference regression รวม caller ใน `check-devflow.ts` และ package smoke; Q-001 ยืนยันทั้ง original failure pattern และ repaired target จึงเปลี่ยนจาก fixed เป็น closed
- หลักฐาน Verify เดิมใน spec ระบุ installer tests 185/185 และ package smoke ผ่านหลังซ่อม Q-001; reviewer รอบนี้ไม่ได้รัน umbrella `npm.cmd run check` หรือ package smoke ใหม่ เพราะสร้าง build/package artifacts นอกขอบเขตการเขียนของ child ใช้เฉพาะ read-only signals ข้างต้นและตรวจ wiring ของขั้นเหล่านั้น
- Runtime declaration: generic isolated child `/root/complete_086_review`, codex, gpt-6-astra, high reasoning, `fork_turns=none`; ไม่มี builder transcript และไม่ได้ spawn agent เพิ่ม ข้อมูล identity/context เป็น declared metadata ตามสัญญา

## Findings

- Q-001 — P3 closed: ตรวจซ้ำอิสระแล้วว่าลิงก์ output checklist และ regression ถูกต้อง
- Q-002 — P2 open: routine diagram route อาจไม่ resolve marker-selected profile ใน fresh session; ดูหลักฐานและแนวซ่อมใน findings.md
- F-01 คง closed; ไม่พบ P0/P1 open หรือ fixed จึงผ่าน independent-review gate ตาม contract

## Remaining risk

- Q-002 ยังเปิดอยู่ และ behavioral corpus ไม่มี fresh-session marker-selected profile scenario; เป็นข้อบกพร่องเส้นทางคำสั่งที่ยังไม่ได้วัดด้วย model-generation experiment
- Behavioral score 14/14 ใช้ observations เดิมของ agent ที่ model identity เป็น unknown ไม่ใช่ end-to-end execution หรือ cross-model reliability
- Reviewer ไม่ได้รัน full Verify, installer/package smoke, browser rendering หรือ current dependency vulnerability scan ใหม่; full Verify อ้างอิงเป็น prior evidence เท่านั้น ไม่มี Check ที่กำหนดว่าต้องรันใน request นี้
- `git diff --check` ของ complete delta มี EOF blank-line warnings 16 จุดตามรายการข้างต้น ไม่พบ whitespace error ประเภทอื่น

## Behavioral observations

```json
{
  "reviewer": "/root/skill_forward_probe",
  "model": "unknown",
  "observations": [
    { "id": "plan-en", "action": "plan", "skills": ["fix"], "reason": "ร่าง spec, stage และ findings ใน run ใหม่ แล้วส่ง spec เป็นผลลัพธ์ ไม่ implement เพราะผู้ใช้จำกัดขอบเขตไว้ที่แผน" },
    { "id": "plan-th", "action": "plan", "skills": ["fix"], "reason": "คำขอให้ร่างสเปกแก้บั๊กตรงกับ fix และระบุชัดว่ายังไม่ให้ลงมือแก้ จึงจบที่ spec พร้อมระบุ implement เป็นขั้นถัดไป" },
    { "id": "deliver-en", "action": "implement", "skills": ["fix", "implement", "check"], "reason": "ร่าง spec เป็น internal handoff แล้ว implement ต่อใน branch ที่ผู้ใช้อนุญาตโดยไม่ขออนุมัติการเปลี่ยน skill ซ้ำ ใช้ TDD และ focused checks ก่อน Verify และหลักฐานพฤติกรรมจริง ไม่ commit หากเลือก independent review แล้วต้องมี immutable checkpoint ที่ยังไม่มี ให้รายงานข้อจำกัดจากคำสั่งห้าม commit หลังทำงานที่อนุญาตครบ ไม่ข้าม gate หรืออ้างว่า review ผ่าน" },
    { "id": "deliver-th", "action": "implement", "skills": ["fix", "implement", "check"], "reason": "ผู้ใช้อนุญาตทั้งร่าง spec แก้ไข และตรวจการทำงานแล้ว จึงดำเนินงานต่อเนื่องตามขอบเขตใน branch นี้ ใช้ TDD, focused checks, Verify และหลักฐานพฤติกรรม ไม่ commit และไม่เรียก complete หาก independent review ถูกเลือกแต่ต้องสร้าง checkpoint ให้รายงาน gate ที่ยังทำไม่ได้โดยไม่ฝ่าฝืนคำสั่งห้าม commit" },
    { "id": "diagnose", "action": "diagnose", "skills": ["debug"], "reason": "สร้างหลักฐาน reproduction ทดสอบสมมติฐาน และรายงาน cause พร้อมระดับความมั่นใจโดยไม่เปลี่ยน source ไม่เปลี่ยน branch และไม่ดำเนิน repair" },
    { "id": "unrelated", "action": "direct", "skills": [], "reason": "ตอบคำแปลโดยตรงว่า สวัสดี ไม่ใช่งานพัฒนาและไม่ต้องเริ่ม workflow" },
    { "id": "mention", "action": "direct", "skills": [], "reason": "ผู้ใช้ถามความหมายของคำศัพท์ fix ไม่ได้เรียกคำสั่งหรือขอแก้บั๊ก จึงอธิบายภาษาไทยว่า ซ่อม หรือ แก้ไข ตามบริบท" },
    { "id": "efficient", "action": "continue", "skills": ["implement"], "reason": "บันทึกหลักฐาน step 1 แล้วทำสามขั้นที่อนุมัติไว้ต่อ ใช้ focused checks ระหว่างทางและรวม review packet หลัง Verify และ required gates ไม่ขอ Continue หรือเสนอ checkpoint รายขั้น" },
    { "id": "guided", "action": "review", "skills": ["implement"], "reason": "แสดง diff และหลักฐาน step 1 แล้วรอการอนุมัติก่อนขั้นถัดไปตาม stepReview=every อ้างข้อกำหนดใน implement/SKILL.md เมื่อหยุด ไม่เสนอ checkpoint เพราะ disabled" },
    { "id": "efficient-checkpoints", "action": "continue", "skills": ["implement"], "reason": "ทำสามขั้นที่อนุมัติไว้ต่อ เพราะ feature กำหนด review boundary ที่ final packet เท่านั้น เสนอ optional checkpoint พร้อม exact candidate ที่ boundary นั้น และต้องได้รับ commit authorization ก่อน commit" },
    { "id": "guided-checkpoints", "action": "review", "skills": ["implement"], "reason": "แสดง diff และหลักฐานของ step 1 แล้วรออนุมัติก่อนขั้นถัดไป เสนอ optional checkpoint ที่ review boundary นี้พร้อม exact candidate การเปิด checkpointCommits ไม่ใช่สิทธิ์ commit" },
    { "id": "multi-run", "action": "plan", "skills": ["fix"], "reason": "สำรวจ ID เพื่อจัดสรร run ถัดไปสำหรับบั๊กใหม่ สร้าง spec, stage และ findings แยกจากงาน 010 โดยไม่เขียนทับงานเดิมและไม่ implement" },
    { "id": "help", "action": "help", "skills": ["fix"], "reason": "ใช้ contextual-help protocol อ่าน skill และข้อมูลที่จำเป็น สร้างหรืออัปเดต devflow/docs/playbooks/fix.html พร้อม 5W1H และ diagram ใน light theme โดยไม่เริ่ม run หรือดำเนินการ fix ปิดท้ายด้วย Help menu displayed successfully" },
    { "id": "diagram", "action": "diagram", "skills": ["diagram-design"], "reason": "สร้าง editorial diagram เป็น HTML light ไฟล์เดียวโดยใช้ default style ที่อนุมัติแล้ว ไม่เปิดการตัดสินใจ brand ซ้ำหรือสร้าง variants เพิ่ม ใช้ references ที่เกี่ยวข้องและตรวจด้วย self-check กับ render checks ที่ใช้ได้ก่อนส่งมอบ" }
  ]
}
```

## Main Integration

User authorized main integration and publication. Applied only task delta 53c0d38..3b13473 onto origin/main ab3f96b because local and remote histories diverged. Preserved remote starter-workspace cleanup and resolved only HISTORY.md by retaining the remote table plus this run. Original review receipt covers the original checkpoint; release verification checks the integrated state. Local pre-integration main remains at backup/main-before-086-publish.

Release candidate v2.17.4 verification: `npm.cmd test` and `npm.cmd run check` PASS on the integrated main tree. Static contracts, routing, regression suites, installer tests, and package smoke passed. Integration commit: d212330. Publication runs through the v2.17.4 GitHub Actions tag workflow.
