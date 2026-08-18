---
name: ui-ux-pro-max
description: AI-powered design intelligence with 50+ styles, 95+ color palettes, and automated design system generation. Use when designing, building, or reviewing UI/UX.
---

# UI/UX Pro Max (Design Intelligence)

Comprehensive design guide for web and mobile applications. Contains 50+ styles, 97 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 9 technology stacks. Searchable database with priority-based recommendations.

## Prerequisites

Python is required for the design system search tool.

## How to Use This Skill

When you need to perform UI/UX work (design, build, create, implement, review, fix, improve), follow this process:

### 1. Analyze User Requirements
Extract key information:
- **Product type**: SaaS, e-commerce, dashboard, etc.
- **Style keywords**: minimal, playful, professional, dark mode, etc.
- **Industry**: healthcare, fintech, gaming, etc.
- **Stack**: React, Vue, Next.js, or default to `html-tailwind`.

### 2. Generate Design System (REQUIRED)
**Always start by generating a design system** to get comprehensive recommendations:

```bash
python3 .claude/.shared/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

### 3. Persist Design System
To save the design system for hierarchical retrieval:

```bash
python3 .claude/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" [--page "name"]
```

### 4. Detailed Domain Searches
Supplement with specific details as needed:
- `style`: `--domain style "keywords"`
- `chart`: `--domain chart "keywords"`
- `ux`: `--domain ux "keywords"`
- `typography`: `--domain typography "keywords"`

---

## Design Guidelines & Standards

### Professional UI Rules
- **No emoji icons**: Use SVG icons (Heroicons, Lucide).
- **Stable hover states**: Use color/opacity transitions, avoid layout shifts.
- **Consistent icon sizing**: Use fixed viewBox (24x24) with w-6 h-6.
- **Cursor pointer**: Add `cursor-pointer` to all interactive elements.

### Contrast & Visibility
- **Light Mode Glass**: Use `bg-white/80` or higher.
- **Text Contrast**: Use high-contrast slates (e.g., slate-900 for body).
- **Border visibility**: Ensure borders are visible in both light/dark modes.

### Layout
- **Floating navbar**: Add `top-4 left-4 right-4` spacing.
- **Responsive**: Test at 375px, 768px, 1024px, 1440px.

## Pre-Delivery Checklist

- [ ] No emojis used as icons (use SVG instead).
- [ ] Hover states don't cause layout shift.
- [ ] All clickable elements have `cursor-pointer`.
- [ ] Transitions are smooth (150-300ms).
- [ ] Responsive at all major breakpoints.
- [ ] No horizontal scroll on mobile.

---
*Powered by UI-UX Pro Max Engine*
