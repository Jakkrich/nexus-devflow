# Diagram variants

Paths in commands and inline code remain relative to the skill directory unless stated otherwise.

## 10. Templates & Variants

Choose the requested or most suitable variant (see `assets/`); additional variants are optional:

| Variant | File pattern | When to use |
|---|---|---|
| **Minimal light** (default) | `assets/template.html`, `example-<type>.html` | Screenshot-ready. Diagram + title. Warm paper. |
| **Minimal dark** | `assets/template-dark.html`, `example-<type>-dark.html` | Dark mode sites, slides, high-contrast posts. |
| **Full editorial** | `assets/template-full.html`, `example-<type>-full.html` | Long-form posts where the diagram is the hero. |
| **Consultant special** (quadrant only) | `example-quadrant-consultant.html` | BCG/McKinsey-style 2×2 scenario matrix. Clinical sans-serif, white bg, bold blue double-ended axes, named scenario cells. See [type-quadrant.md](type-quadrant.md#consultant-special-2x2-scenario-matrix). |

**Sketchy variant** (optional, applied to any of the above) — see [primitive-sketchy.md](primitive-sketchy.md). SVG turbulence filter wobbles strokes for a hand-drawn feel. Good for essays, not for technical docs.

**Terminal variant** (optional, replaces any of the above) — see [primitive-terminal.md](primitive-terminal.md). Start from `assets/template-terminal.html`; terminal examples use the `example-<type>-terminal.html` naming pattern. Charcoal CLI-window chrome, monospace, one red-orange accent. Good for dev-tool posts; not brand-tokenized, so skip it for onboarded output.

**Animation** (optional presentation layer) — see [animation.md](animation.md). Modes are `none` (default), `reveal`, `step`, and `loop`; motion never changes the static meaning or raises the complexity budget.

### To create a new diagram

1. Copy the variant closest to what you want (`assets/template.html` for minimal, `assets/template-full.html` for cards, `assets/template-motion.html` only when motion is requested).
2. If behavior is load-bearing, choose a semantic pattern; then load the matching type reference linked in the visual-type guide.
3. Replace the eyebrow, h1, and SVG body. Replace `[diagram-slug]` with the file slug and fill `<title>` / `<desc>`.
4. If motion is requested, load `animation.md`; otherwise keep mode `none` and no script.
5. Run the [section 9](validation.md) taste gate.

---

