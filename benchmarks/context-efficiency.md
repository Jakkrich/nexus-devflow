# Context Efficiency Benchmark (Nexus-DevFlow 2.10.x)

Nexus-DevFlow was benchmarked on 2026-09-02 following the synchronization of AI Blueprint v1.3.0 - v1.4.1 context overhead reduction mechanisms and DevFlow's Pure Task-Isolated Living Spec Architecture.

---

## 📊 Benchmark Results

| Measurement | Before Correction / Legacy Layout | Compact Overview & JIT Context | Savings |
| :--- | ---: | ---: | ---: |
| **Overview file size** | 94,441 bytes | 4,087 bytes | **90,354 bytes (95.7%)** |
| **Fresh-session startup input** | 79,479 tokens | 35,688 tokens | **43,791 tokens (55.1%)** |
| **Feature cumulative input** | 654,550 tokens | 416,302 tokens | **238,248 tokens (36.4%)** |
| **Final Feature context** | 89,352 tokens | 57,034 tokens | **32,318 tokens (36.2%)** |
| **Estimated API Session Cost** | $0.9982 | $0.6940 | **$0.3042 (30.5%)** |
| **Feature runtime** | 122 seconds | 124 seconds | *Effectively unchanged* |

---

## 🔑 Key Architectural Improvements in DevFlow 2.10.x

1. **Overview 20KB Compactness Guard (`/overview`)**:
   - บังคับควบคุมให้ `devflow/context/project-overview.md` มีขนาดต่ำกว่า 20,000 bytes (~4,000-5,000 tokens)
   - `/doctor` เตือนสถานะ `oversized` เมื่อ >= 20KB
   - `/feature` สั่ง Hard-Stop ทันทีเมื่อ >= 20KB และนำเข้า Context เดิมโดยไม่อ่านซ้ำผ่าน Tool

2. **Skill Descriptions Token Optimization (31 Core Skills)**:
   - ควบคุมข้อความ `description` ใน Frontmatter ของทุกสคิลให้มีความยาวไม่เกิน 400 ตัวอักษร
   - ลดภาระ System Prompt ในทุกรอบการตอบของ AI

3. **Just-In-Time (JIT) Context Loading**:
   - `CLAUDE.md` และ `AGENTS.md` โหลดเฉพาะ `@AGENTS.md`, `project-overview.md` และ Active Task Spec (`devflow/context/{xxx-slug}/spec.md`)
   - กฎระเบียบย่อย (`coding-standards.md`, `ai-interaction.md`) จะถูกโหลดตามความจำเป็นเฉพาะงาน

4. **Task-Isolated Living Spec Memory**:
   - บริบทของแต่ละฟีเจอร์ถูกกักบริเวณแยกไว้ในโฟลเดอร์ `devflow/context/{xxx-slug}/`
   - เมื่อปิดงานผ่าน `/complete` โฟลเดอร์จะถูก Archive ไปยัง `devflow/history/` และล้างออกจาก Active Context ทันที ไม่เกิด Memory Pollution ข้ามรอบการทำงาน

---

## 🧪 Method & Environment

- **Tested Agent / Models**: Google Antigravity (Gemini 2.5 Pro / Flash), Claude Code 2.1.x (`claude-opus-5`, `claude-sonnet-4`)
- **Context Window**: 1,000,000 tokens
- **Baseline App**: Dependency-free Node.js Minimal Task-Tracker with 3 sequential features
- **Verification Harness**: `scripts/validate-framework.ts`, `scripts/smoke-package.ts`, `scripts/evals/routing.ts`
