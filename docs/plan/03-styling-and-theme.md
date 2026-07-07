# 03 — Styling & Theme

_Phase 2. See [README](./README.md). Design source: `docs/new-website-design/`._

Fresh styling foundation on Tailwind 4, matching the new design. Nothing is migrated from the old Tailwind 3 setup — we start from the design's tokens.

## A. Tailwind CSS 4

| | Old | New |
|---|---|---|
| version | 3.3 | **4.3** |
| config | `tailwind.config.ts` (JS) | CSS-first `@theme { … }` in globals |
| import | `@tailwind base/components/utilities` | `@import "tailwindcss";` |
| postcss | `postcss` + `autoprefixer` + `postcss-import` | `@tailwindcss/postcss` only (others built in) |

- Install `tailwindcss@4` + `@tailwindcss/postcss`; remove `autoprefixer` + `postcss-import`.
- Define the design tokens in a CSS `@theme` block (below) instead of `tailwind.config.ts`.
- Note Tailwind 4 utility renames (`shadow-sm`→`shadow-xs`, `ring`→`ring-3`, `outline-none`→`outline-hidden`) and default border/ring color = `currentColor` when authoring new components.

## B. Component library — shadcn/ui + unified `radix-ui`

- Init shadcn/ui (supports React 19 + Tailwind 4; `new-york` style uses the unified `radix-ui` package). Gives us accessible primitives for the design's tabs (Team), dropdown/menu (mobile nav), dialog, etc. — replacing the old individual `@radix-ui/react-*` deps.
- Unified `radix-ui` 1.6.x: `import { Tabs as TabsPrimitive } from "radix-ui"`.
- Keep `clsx`, `tailwind-merge`, `class-variance-authority` (shadcn depends on them).

## C. Design tokens (from the Logo Kit + prototype)

Canonical brand palette extracted from `docs/new-website-design/Logo Kit.dc.html`:

```css
@theme {
  /* Brand gradient (logomark, headings accents, CTAs) */
  --color-brand-violet: #8B5CF6;   /* gradient start */
  --color-brand-cyan:   #22D8F5;   /* gradient end / accent */
  --color-brand-purple: #6633CC;
  --color-brand-deep:   #330066;

  /* Dark surfaces (dark-first) */
  --color-bg:        #0A0416;      /* page background */
  --color-surface:   #0D0620;
  --color-surface-2: #150B2E;      /* cards / raised */

  /* Text / light tints */
  --color-text:      #F4EFFB;
  --color-text-dim:  #B7A7D6;
  --color-text-mute: #8A79AE;
  --color-on-light:  #330066;      /* text on light surfaces (light mode) */

  /* Utility */
  --color-success:   #5FE39B;      /* terminal "ok" green */
  --color-term-red:    #FF5F57;    /* terminal traffic lights */
  --color-term-yellow: #FEBC2E;

  /* Type */
  --font-mono:    'Space Mono', monospace;   /* labels, pills, terminal, UI accents */
  --font-display: 'Helvetica Neue', Helvetica, Arial, sans-serif; /* big headlines */
}
```

Signature gradient: `linear-gradient(135deg, #8B5CF6, #22D8F5)`.

## D. Fonts

- **Space Mono** — heavily used for labels, tag pills, the terminal widget, section eyebrows (`/ MEMBERSHIP`), buttons. Load via `next/font/google`.
- **Display sans** — big headlines ("Innovating Tomorrow, Together"): the prototype uses Helvetica Neue / system sans. Pick a self-hosted equivalent (e.g. an Inter/Geist-class grotesk) via `next/font` to avoid licensing issues, or keep system stack. Old repo's `Helvetica LT Std` OTFs in `public/assets/fonts/` are **not** carried over unless licensed.
- Use `next/font` (no external CSS requests) for both.

## E. Dark / light theme

The design is **dark-first with a light toggle** (sun/moon button, top-right of the nav).

- Use **`next-themes`** with `class` strategy (`.dark` on `<html>`), `defaultTheme="dark"`, `enableSystem`.
- Define light-mode overrides in `@theme` / a `.light` (or `:root` default vs `.dark`) block — the Logo Kit shows both dark (`#0A0416`) and light (`#F5F1FB`, text `#330066`) palettes, so both are intended.
- Prevent flash: `next-themes` `ThemeProvider` in root layout + `suppressHydrationWarning` on `<html>`.
- Screenshots to match: `hero-desktop-final.png` (dark) is the primary; ensure the light variant is derived from the light tokens above.

## Exit criteria

- Tailwind 4 building via `@tailwindcss/postcss`; no autoprefixer/postcss-import.
- Tokens + fonts wired; shadcn initialised.
- Theme toggle switches dark/light with no flash.
