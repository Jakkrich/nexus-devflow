---
name: ponytail
description: "[devflow] Lazy senior dev mode & YAGNI optimization orchestrator. Cuts ~54% code bloat, tokens, and unnecessary dependencies via the 7-step Decision Ladder. Includes 5W1H Playbook, intensity modes (lite, full, ultra), and auto-bypass safety for UI/frontend tasks. JIT resources in devflow/.vendor/ponytail/."
argument-hint: "[lite|full|ultra|audit|debt|help]"
---

# 🪓 ponytail - Lazy Senior Dev Mode & YAGNI Optimization Orchestrator

$ARGUMENTS

`ponytail` is the code simplification and YAGNI optimization engine in Nexus-DevFlow, bringing the senior developer mindset (*"The best code is the code you never wrote"*) into your development lifecycle with **Zero Token Bloat** and **Strict UI Aesthetic Safeguards**.

---

## ⚠️ Pre-Flight Check (Knowledge Base Availability)

Before executing any Ponytail optimization or JIT inspection:
1. **Check if `devflow/.vendor/ponytail/` exists in this project using your file inspection tool**.
2. **If `devflow/.vendor/ponytail/` is MISSING / NOT INSTALLED**:
   - Inform the user in their configured communication language (Thai default):
     - State clearly that the Ponytail upstream repository is not yet downloaded in this project.
     - Provide the installation command:
       ```bash
       npx @jakkrichm/create-nexus-devflow skill add ponytail
       ```
     - Offer to run the installation command on their behalf.
   - Stop and wait for installation before proceeding.
3. **If `devflow/.vendor/ponytail/` is PRESENT**:
   - Proceed with the Decision Ladder, Guardrails, and Execution Flow below.

---

## 🎨 UI/Frontend Auto-Bypass Safety Guardrail (CRITICAL)

> [!IMPORTANT]
> **Aesthetic Protection Gate**:
> หากงานปัจจุบันเกี่ยวข้องกับ **Web Frontend, UI Components, Styling (`.css`, `.scss`, `.tsx`, `.vue`, `.html`), หรือคำสั่ง `/prototype`**:
> - **AUTO-BYPASS PONYTAIL**: ปิดการทำงานของ Ponytail ทันที
> - **PRESERVE RICH AESTHETICS**: ห้ามตัดทอน Micro-animations, Glassmorphism, Modern typography, หรือ Rich UI components เป็นอันขาด
> - **REASON**: ป้องกันไม่ให้ Agent ถอยกลับไปใช้ unstyled HTML ดั้งเดิม (เช่น `<input type="date">`) ซึ่งขัดต่อมาตรฐานความสวยงามระดับพรีเมียมของระบบ

---

## 🪜 The 7-Rung Decision Ladder

เมื่อทำงานในส่วน **Backend Logic, Algorithms, CLI, Data Processing, `/fix`, `/debug`, หรือ `/implement` (Non-UI)** ให้หยุดที่ขั้นแรกที่แก้โจทย์ได้:

```text
1. Does this need to exist at all?  ➔ YAGNI: หากเป็นความต้องการล่วงหน้า ให้ข้ามและบันทึกเหตุผลสั้นๆ
2. Already in this codebase?        ➔ Reuse: ค้นหา util/helper/type ที่มีอยู่แล้ว ห้ามเขียนซ้ำ
3. Standard library does it?        ➔ Stdlib: ใช้ Node.js / Runtime built-in ก่อนเสมอ
4. Native platform covers it?       ➔ Platform: ใช้ฟีเจอร์พื้นฐาน เช่น DB constraint แทน app logic
5. Installed dependency solves it?  ➔ Deps: ใช้ package ที่ลงไว้แล้ว ห้ามลง npm เพิ่มเพื่อโค้ดไม่กี่บรรทัด
6. Can this be one line?            ➔ One-liner: ยุบเหลือบรรทัดเดียวถ้าอ่านรู้เรื่องและปลอดภัย
7. Only then: minimum that works    ➔ Code: เขียนโค้ดให้น้อยที่สุดที่ทำงานได้ถูกต้อง
```

### Senior Bug Fixing Mandate (`/fix` & `/debug`)
- **Root Cause over Symptom**: เมื่อพบรายงานบั๊ก ให้ Grep หา caller ทุกตัวที่เรียกใช้ฟังก์ชันนั้น แล้วแก้ไขที่จุดศูนย์กลาง (Shared function) เพียงครั้งเดียว แทนที่จะตามไปแก้เป็นหย่อมๆ ทีละ Caller

---

## 🎚️ Intensity Modes

| Mode | Trigger | Behavior |
| :--- | :--- | :--- |
| **lite** | `/ponytail lite` | เตือนสติเบาๆ ป้องกันการลง external library และ abstraction ที่ไม่จำเป็น |
| **full** | `/ponytail` หรือ `/ponytail full` | *(Default)* ยึด Decision Ladder อย่างเคร่งครัด ลบ boilerplate และ abstraction ที่มี implementation เดียว |
| **ultra** | `/ponytail ultra` | ลีนขั้นสุดสำหรับงาน Refactor / Code Golfing: สั้นที่สุด, ไฟล์น้อยที่สุด, ลบมากกว่าเพิ่ม |
| **audit** | `/ponytail audit` | ตรวจจับ Over-engineering, Dead code และ Bloated dependencies (อ้างอิง `devflow/.vendor/ponytail/skills/ponytail-audit/`) |
| **debt** | `/ponytail debt` | ประเมินหนี้ทางเทคนิคจาก abstraction ส่วนเกิน (อ้างอิง `devflow/.vendor/ponytail/skills/ponytail-debt/`) |

---

## 📖 Universal Contextual Help & Playbook Protocol (`help`, `--help`, `-h`, `?`)

เมื่อผู้ใช้เรียก `/ponytail help`, `ponytail --help`, หรือ `/ponytail -h`:
1. **Execution Safety Gate**: ไม่แก้ไขโค้ดหรือรันการปรับแต่งใดๆ
2. **5W1H Framework Presentation**: เรนเดอร์คู่มือ 5W1H ในแชท
3. **HTML Playbook Generation**: เขียนหรืออัปเดตไฟล์ HTML รายงานที่:
   `devflow/docs/playbooks/ponytail.html`
4. ปิดท้ายด้วยข้อความ: `"Help menu displayed successfully"`
