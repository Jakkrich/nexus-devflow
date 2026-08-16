---
name: codebase-design
description: Shared vocabulary for designing deep modules. Use when a DevFlow stage needs module/interface design, seam placement, testability review, or architecture simplification.
---

# Codebase Design

Use this support skill when `/20-Spec`, `/30-Plan`, `/40-Implement`, or `/50-Verify` needs better module shape.

Design deep modules: a lot of behavior behind a small interface, placed at a clean seam, and testable through that interface. The aim is leverage for callers, locality for maintainers, and behavior-focused tests.

## DevFlow Placement

- `/20-Spec`: use when requirements depend on a stable module or interface contract.
- `/30-Plan`: use when planning needs file-level architecture, seams, or dependency strategy.
- `/40-Implement`: use when implementation reveals shallow modules or awkward test seams.
- `/50-Verify`: use when review finds code that is hard to test, hard to change, or too spread out.

## Vocabulary

Use these words consistently:

- **Module**: anything with an interface and an implementation.
- **Interface**: everything a caller must know to use the module correctly, including invariants, ordering constraints, error modes, configuration, and performance characteristics.
- **Implementation**: what sits inside the module.
- **Depth**: leverage at the interface. A module is deep when a large amount of behavior sits behind a small interface.
- **Seam**: a place where behavior can change without editing the caller.
- **Adapter**: a concrete thing that satisfies an interface at a seam.
- **Leverage**: capability callers get per unit of interface they learn.
- **Locality**: how much change, debugging, and verification concentrate in one place.

## Principles

- Depth is a property of the interface, not line count.
- The interface is the test surface.
- One adapter means a hypothetical seam; two adapters means a real one.
- Do not expose internal seams through the public interface just because tests use them.
- If deleting a module removes no complexity, it is probably a pass-through.

## Process

1. Identify the module, callers, and behavior the active stage is trying to stabilize.
2. Name the current interface, implementation, seams, and adapters.
3. Ask whether the interface is smaller than the behavior it unlocks.
4. Classify dependencies using `DEEPENING.md` when a module needs restructuring.
5. Use `DESIGN-IT-TWICE.md` when multiple viable interface shapes exist.
6. Record the result in the owning stage artifact. Use ADRs only for hard-to-reverse decisions.

## Output

Return:

- current module/interface shape
- proposed seam or interface change
- dependency strategy
- test surface
- risks and rejected alternatives
- recommended owning DevFlow stage
