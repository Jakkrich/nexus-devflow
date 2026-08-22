---
name: discovery
description: "[Devflow] Deep multi-turn guided project discovery interview that develops detailed project-plan.md and build-plan.md files through an adaptive conversation, drafting only after user approval."
argument-hint: "[optional product idea or context]"
---

# discovery - Guided Multi-Turn Project Discovery & Architecture Interview

Where this sits in the workflow:

```text
[Product Idea / Concept]  ->  [discovery]  ->  devflow/project-plan.md  ->  /overview  ->  project-overview.md
(rough thoughts from user)    (deep adaptive    devflow/build-plan.md      (distill)     (living source of truth)
                               interview)      (user-owned plans)
```

`discovery` is an optional, high-depth conversational planning assistant. It guides the user through an adaptive, multi-turn interview to think through product vision, technical architecture, constraints, and phased delivery roadmap — drafting the two user-owned planning documents (`devflow/project-plan.md` and `devflow/build-plan.md`) only after explicit user review and approval.

It is **never mandatory**: users who already have clear requirements can write both planning files directly or run `/overview` straight away.

---

## Usage & Invocations

```text
/discovery                          # Start interactive discovery interview
/discovery "AI-powered CRM for SMB" # Start discovery seeded with an initial product concept
$discovery                          # Codex CLI invocation
```

---

## The Adaptive Interview Protocol

Run discovery as an **engaging pair-programming conversation**:
- 🚫 **Do NOT dump 10-20 questions at once.**
- ✅ **Ask 1-2 focused questions at a time.**
- ✅ **Adapt follow-up questions based on previous answers.**
- ✅ **Offer proactive suggestions, sensible defaults, and architectural trade-offs.**

---

### Step 1 - Check Existing Planning State

1. Inspect `devflow/project-plan.md` and `devflow/build-plan.md` (or `blueprint/` equivalents).
2. If detailed plans already exist:
   - Ask the user whether they want to **deepen/refine** the existing plan or **start fresh**.
   - Never overwrite existing user-authored content without confirmation.

---

### Step 2 - Conduct Multi-Turn Discovery Interview

Guide the user through 4 core discovery pillars:

#### Pillar 1: Product Vision & User Persona
- **Problem Statement**: What core problem does this application solve?
- **Target Audience**: Who is the primary user persona?
- **Core Value & Success Metric**: What is the single most important workflow that delivers value?

#### Pillar 2: Technical Architecture & Stack
- **Frontend & UI**: Framework (Next.js, Vite, React, Svelte, Vue), Styling (Tailwind, CSS Modules, Vanilla CSS).
- **Backend & APIs**: REST, GraphQL, tRPC, Server Actions, Node.js, Go, Python.
- **Data Layer**: Database (PostgreSQL, SQLite, MongoDB), ORM/Query Builder (Prisma, Drizzle, Kysely), Migrations.
- **Authentication & Security**: Auth provider (NextAuth, Supabase Auth, Clerk, JWT, Session cookies).
- **Integrations & Third-party Services**: Payments (Stripe), Emails (Resend), Cloud storage (S3/R2).

#### Pillar 3: Constraints & Non-Goals (Scope Boundaries)
- **Non-Goals (Out of Scope)**: What features are explicitly postponed for later phases?
- **Technical & Operational Constraints**: Budget, latency targets, deployment platform (Vercel, Render, AWS, VPS).

#### Pillar 4: Phased Roadmap & Feature Sizing
- Break down the delivery into sequential phases:
  - **Phase 1: MVP Baseline** (Core database models, auth, primary happy path)
  - **Phase 2: Core Experience** (Main features, workflows, dashboard, notifications)
  - **Phase 3: Polish & Scale** (Edge cases, performance optimizations, exports, settings)
- Assign a **Size** to every feature:
  - `XS`: Small tweak / config (~10-30 mins)
  - `S`: Single component or route (~1-2 hours)
  - `M`: Full CRUD feature or API integration (~ครึ่งวัน)
  - `L`: Complex multi-component subsystem (1 วัน)
  - `XL`: Major epic (ควรแบ่งย่อยเป็น L หรือ M)
- Define **Dependencies** for sequential execution.

---

### Step 3 - Draft Plan Preview & Confirmation Gate

Once all pillars are sufficiently explored:

1. Synthesize the findings into Markdown drafts for both files.
2. Present the draft summary directly in the chat to the user in **Thai (`th`)**:
   - High-level Architectural Summary
   - Proposed Feature List by Phase with Sizing and Dependencies
3. **STOP and ask for user confirmation**:
   > *"นี่คือร่างแผนงาน Project Plan และ Build Plan ทั้งหมด คุณต้องการปรับแก้ส่วนไหนเพิ่มเติม หรือยืนยันให้บันทึกลงไฟล์เลยครับ?"*

---

### Step 4 - Write User-Owned Planning Documents

Upon user approval, write to:

1. **`devflow/project-plan.md`**:
   ```markdown
   # 🗺️ Project Plan (User-Owned Architectural Vision)

   ## 1. Product Vision & Problem Statement
   ...

   ## 2. Target Users & Core Personas
   ...

   ## 3. Technical Architecture & Tech Stack
   ...

   ## 4. Key Constraints & Non-Goals
   ...
   ```

2. **`devflow/build-plan.md`**:
   ```markdown
   # 🏗️ Build Plan (Phased Sequential Feature Queue)

   ## Phase 1: MVP Baseline
   - [ ] 1. Project Initialization & Base Tooling (Size: S)
   - [ ] 2. Database Schema & Auth Setup (Size: M, Depends on: 1)

   ## Phase 2: Core Workflows
   - [ ] 3. Main Dashboard & Data Grid (Size: M, Depends on: 2)
   ```

---

### Step 5 - Handoff to `/overview`

After writing the planning files, prompt the user with the next recommended action:

```markdown
✅ **บันทึกแผนงานลง `devflow/project-plan.md` และ `devflow/build-plan.md` เรียบร้อยแล้ว!**

👉 **ขั้นตอนถัดไป**: เรียกคำสั่ง:
`/overview`
เพื่อกลั่นกรองแผนงานทั้งหมดลงสู่ `devflow/context/project-overview.md` ซึ่งจะเป็น Living Source of Truth สำหรับ AI Agent ในทุกๆ Session ครับ
```
