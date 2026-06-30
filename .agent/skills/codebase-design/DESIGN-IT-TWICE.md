# Design It Twice

Use this reference when a stage needs alternative module or interface designs before committing to one.

## Process

1. Frame the problem space.
   - Name constraints.
   - Name dependencies and classify them with `DEEPENING.md`.
   - Sketch only enough code to make the constraints concrete.

2. Produce at least three different designs.
   - Minimal interface: 1-3 entry points.
   - Flexible interface: supports more use cases and extension.
   - Common-case interface: makes the dominant caller trivial.
   - Ports-and-adapters interface: use only when cross-seam dependencies justify it.

3. Compare designs.
   - Interface depth.
   - Locality of future change.
   - Seam placement.
   - Test surface.
   - Adapter strategy.

4. Recommend one design.
   - Be opinionated.
   - Mention any useful hybrid.
   - Record rejected alternatives only when future readers would otherwise re-open the same debate.
