---
name: simplify
description: "[Devflow] Code simplification and refactoring for clarity and maintainability without altering runtime behavior."
---

# Code Simplification & Refactoring

## Overview

This is the comprehensive code simplification master skill for Nexus-DevFlow. It reduces cognitive load, cleans up unnecessary abstractions, flattens deep nesting, and removes dead code while **preserving 100% exact runtime behavior**.

**Core Rule**: Every simplification must pass: *"Would a new team member understand this faster than the original, without any behavioral regression?"*

---

## 1. The Five Principles of Simplification

1. **Preserve Behavior Exactly**: Same inputs, outputs, error conditions, side effects, and ordering.
2. **Follow Project Conventions**: Consistency with neighboring files beats personal style preferences.
3. **Delete Dead & Unused Code**: Remove abandoned helpers, dead branch paths, and leftover debugging code.
4. **Flatten Control Flow**: Replace nested conditionals and callback pyramids with guard clauses and early returns.
5. **Eliminate Speculative Generalization**: Replace single-use abstractions with clear, direct implementations.

---

## 2. High-Impact Simplification Techniques

### A. Guard Clauses Over Nested Conditionals
```typescript
// Before: Deep indentation
function processOrder(order) {
  if (order) {
    if (order.isValid) {
      if (order.isPaid) {
        return fulfill(order);
      }
    }
  }
}

// After: Early returns
function processOrder(order) {
  if (!order || !order.isValid) return;
  if (!order.isPaid) return;
  return fulfill(order);
}
```

### B. Inline Single-Use Helpers & Dead Shims
If a helper function is only called once and adds indirection without semantic clarity, inline it directly.

### C. Remove Dead Code & Leftover Comments
Delete commented-out code blocks, `// removed` notes, and unused variables (`_unused`). Version control (Git) remembers the history.

---

## 3. Verification & Safety Loop

1. Run unit tests before touching code (`npm test` -> GREEN).
2. Apply one small refactoring step at a time.
3. Rerun tests immediately after each step. If tests break, revert and reconsider.
4. Verify overall build and linter checks.

---

## Relationship To DevFlow 2.0

- **Classification**: Companion command & Refactoring support
- **Mainline integration**: Used during `40-implement` (Refactor step of TDD) or `50-verify`.
- **Handoff**: `50-verify` (proves zero regressions).
