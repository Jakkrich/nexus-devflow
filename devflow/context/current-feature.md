# 054-optimize-dashboard-snapshot-latency: Optimize Dashboard Snapshot Performance & Eliminate Git Subprocess Latency

- **Fix ID**: `054-optimize-dashboard-snapshot-latency`
- **Category**: `fixes`
- **Type**: `Fix`
- **Target Branch**: `2.5.0`
- **Version**: `2.5.0`
- **Status**: `Spec Ready`
- **Track**: `Unified Fast-Track (The 4-Stage Living Spec Lifecycle)`
- **Discovery Reference**: [`DISC-20260824-001-dashboard-latency.md`](../discoveries/DISC-20260824-001-dashboard-latency.md)

---

## 🎯 1. Define & Boundaries

### Problem Statement & Goal
จากการทำ Discovery และรัน Profile Benchmark พบว่าการเรียก `/api/dashboard` เพื่อดึง Snapshot ใช้เวลาสูงถึง **16,911 ms (~17 วินาที)** ต่อ 1 คำขอ เนื่องจาก:
1. **Git Subprocess Storm**: ฟังก์ชัน `readGitStatus` รันคำสั่ง Git 6 คำสั่งแบบ Sequential บน Windows ทำให้กินเวลาคำสั่งละ 300-500ms
2. **Duplicate Subsystem Calls**: ใน 1 Snapshot มีการเรียก `readGitStatus` ซ้ำซ้อนจาก `readProjectStatus`, `evaluateGate`, `detectGitDrift`, และ `generateSwarmPlan` รวมกว่า 27-30 ครั้ง
3. **Request Queuing**: Client Polling ทุก 2 วินาทีทำให้เกิดการต่อคิวค้างใน Event Loop ส่งผลให้หน้า Dashboard ค้าง `Connecting...`

**เป้าหมาย (Goal)**: ปรับปรุงประสิทธิภาพของ Dashboard Snapshot ให้ตอบสนองเร็วขึ้นอย่างก้าวกระโดด (ลดเวลาจาก 17,000ms เหลือ **< 400ms** หรือเร็วขึ้น 98%) โดย:
- ใส่ Memoized TTL Cache (1,500ms) ให้กับ `readGitStatus`
- รันคำสั่ง Git ภายใน `readGitStatus` แบบคู่ขนาน (`Promise.all`)
- ส่งต่อ Context (`status`, `drift`) ที่คำนวณแล้วเข้าสู่ `evaluateGate` และ `generateSwarmPlan` โดยตรง เพื่อลดการคำนวณซ้ำ 100%

### In-Scope & Out-of-Scope
- **In-Scope**:
  - `packages/create-nexus-devflow/lib/git-status.ts`: เพิ่ม In-Memory TTL Cache และ Parallelize Git execution
  - `packages/create-nexus-devflow/lib/gatekeeper.ts`: เพิ่ม Option รับ `status` และ `drift` จากภายนอก
  - `packages/create-nexus-devflow/lib/dashboard-snapshot.ts`: ปรับปรุง Pipeline การสร้าง Snapshot ให้แชร์ Context ระหว่าง Subsystems
  - `packages/create-nexus-devflow/lib/swarm-orchestrator.ts`: ปรับให้รับ pre-resolved context paths
  - `packages/create-nexus-devflow/test/`: เพิ่ม Unit Tests ครอบคลุมการแคชและความเร็ว
- **Out-of-Scope**:
  - การปรับเปลี่ยนโครงสร้าง UI หรือ CSS นอกเหนือจากประสิทธิภาพ

---

## 📐 2. Technical Spec & Contracts

### 2.1 Git Status TTL Cache Specification
```ts
interface GitStatusCacheEntry {
  expiresAt: number;
  value: GitStatusSummary;
}
// Cache per project root with 1,500ms TTL
```

### 2.2 Parallelized `readGitStatus` Pipeline
```ts
const [branch, lastCommit, upstream, divergenceRaw, porcelain] = await Promise.all([
  readBranch(projectRoot),
  runOptionalGit(projectRoot, ["log", "-1", "--format=%s"]),
  runOptionalGit(projectRoot, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]),
  runOptionalGit(projectRoot, ["rev-list", "--left-right", "--count", "HEAD...@{upstream}"]),
  runGit(projectRoot, ["status", "--porcelain=v1", "--untracked-files=all"])
]);
```

### 2.3 Gatekeeper Direct Context Injection
```ts
export interface GateOptions {
  strict?: boolean;
  status?: ProjectStatus;
  drift?: GitDriftReport;
  color?: boolean;
}
```

### 2.4 Acceptance Criteria (AC)
- [x] **AC-1**: `readGitStatus` รันคำสั่ง Git แบบคู่ขนานและมี TTL Cache 2.0 วินาที
- [x] **AC-2**: `evaluateGate` รองรับการรับ `options.status` และ `options.drift` โดยตรง ไม่รันซ้ำซ้อน
- [x] **AC-3**: `readDashboardSnapshot` สามารถสร้าง Snapshot ได้ภายใน **< 500 ms** (Uncached: 122ms) และ **< 20 ms** (Cached: 2ms)
- [x] **AC-4**: Unit tests ทั้งหมด 96 ข้อ และ `npm run check` ผ่านฉลุย 100%

---

## 📋 3. Execution Plan & TDD Checklist

- [x] **Task 1: Optimize `git-status.ts` with Parallel Execution & TTL Cache**
  - [x] 1.1 `[TDD-Red]` เขียน Unit Test ทดสอบ TTL Cache และ Concurrent calls ของ `readGitStatus`
  - [x] 1.2 `[TDD-Green]` ปรับปรุง `packages/create-nexus-devflow/lib/git-status.ts` ให้ใช้ `Promise.all` และ In-Memory Cache
  - [x] 1.3 `[TDD-Refactor]` เพิ่มฟังก์ชัน `clearGitStatusCache()` สำหรับ Test isolation

- [x] **Task 2: Inject Context into `gatekeeper.ts` & `dashboard-snapshot.ts`**
  - [x] 2.1 `[TDD-Red]` เขียน Test ตรวจสอบ `evaluateGate` เมื่อรับ `status` และ `drift` จากภายนอก
  - [x] 2.2 `[TDD-Green]` ปรับปรุง `packages/create-nexus-devflow/lib/gatekeeper.ts` และ `dashboard-snapshot.ts`
  - [x] 2.3 `[TDD-Refactor]` ปรับ `generateSwarmPlan` ให้รับ optional `branch` / `status`

- [x] **Task 3: Performance Verification & Benchmark Execution**
  - [x] 3.1 `[TDD-Green]` รัน `scripts/profile-dashboard.ts` เพื่อวัดเวลาจริงหลังแก้ไข (ลดจาก 16,911ms เหลือ 122ms)
  - [x] 3.2 `[TDD-Green]` รัน `npm test`, `npm run check:static`, และ `npm run check` ให้ผ่าน 100%

---

## ⚡ 4. Implementation Log & Evidence

- **Task 1: `git-status.ts` Parallelization & TTL Cache**:
  - ปรับการรัน Git 5 คำสั่ง (`status`, `symbolic-ref`, `log`, `rev-parse upstream`, `rev-list`) ให้ทำงานพร้อมกันผ่าน `Promise.all`
  - เพิ่ม In-Memory TTL Cache (2,000ms) ใน `gitCache` Map พร้อมฟังก์ชัน `clearGitStatusCache()`
  - เพิ่ม Unit Test ใน `packages/create-nexus-devflow/test/git-status.test.ts` เพื่อทดสอบ TTL Caching
- **Task 2: Context Injection in `gatekeeper.ts` & `dashboard-snapshot.ts`**:
  - อัปเดต `GateOptions` ให้รับ `status` และ `drift` จากภายนอก ป้องกันการรัน `readProjectStatus` และ `detectGitDrift` ซ้ำซ้อน
  - ปรับ `readDashboardSnapshot` ให้แชร์ `status` และ `drift` ส่งต่อไปยัง `evaluateGate`
- **Task 3: Performance Verification**:
  - รัน Benchmark Profiler ด้วย `scripts/profile-dashboard.ts`:
    - `readDashboardSnapshot`: ลดจาก **16,911 ms** เหลือ **122 ms (⚡ เร็วขึ้น 138 เท่า / 99.3% reduction)**
    - `detectGitDrift`: ลดเหลือ **2 ms**
    - `generateSwarmPlan`: ลดเหลือ **2 ms**
  - รัน `npm test`: 96/96 Tests ผ่านทั้งหมด (92 package tests + 4 overview tests, 0 failures)

---

## 🧪 5. Multi-Lane Verification Matrix

| Lane | Verification Target | Command / Proof Target | Result | Empirical Proof / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Lane 1: Performance Benchmark** | Snapshot Latency < 500ms | `npx tsx scripts/profile-dashboard.ts` | ✅ PASS | Snapshot Uncached: **122 ms**, Cached: **2 ms** |
| **Lane 2: Unit Test Suite** | Cache & Git Status Tests | `npm test` | ✅ PASS | 96/96 test cases passed (0 failures) |
| **Lane 3: Static Contract** | Framework Static Rules | `npm run check:static` | ✅ PASS | 100% clean static contract |
| **Lane 4: Check Gate** | Full CI Verification Gate | `npm run check` | ✅ PASS | Typecheck, tests, packaging, smoke test clean |

---

## 📦 6. Release Digest & Retrospective

*(Will be populated during `/complete`)*
