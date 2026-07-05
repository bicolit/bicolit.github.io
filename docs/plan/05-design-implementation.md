# 05 — Design Implementation

_Phase 4. See [README](./README.md). Design source: `docs/new-website-design/`._

Rebuild the front-end from the new design, wired to Keystatic content ([04](./04-content-keystatic.md)). The old `src/components/*` is not touched — it's deleted ([01](./01-cleanup-and-tooling.md)) and replaced.

## A. What the design source is

`docs/new-website-design/`:
- `Bicol IT.dc.html` — the full page prototype.
- `Logo Kit.dc.html` — brand/logomark spec (palette, animated 20-tile mark).
- `support.js` — a **`dc-runtime`** engine that renders the `.dc.html` via `window.React` / `window.ReactDOM` (`<x-dc>` custom element, `{{ }}` prop bindings).
- `screenshots/` — desktop/tablet/mobile renders per section (visual source of truth for spacing & responsive).
- `public/`, `uploads/` — logo SVG + social icons.

**How to use it:** treat `.dc.html` + screenshots as the design spec. Extract markup, inline styles, SVGs, and copy from it, then **reimplement as real React/Tailwind components**. Do **not** ship `dc-runtime`/`support.js` — it's a prototype runtime, not a production dependency. Open the `.dc.html` in a browser (it self-loads React) to see live interactions.

## B. Layout & global chrome

| Component | Notes |
|---|---|
| `ThemeProvider` | `next-themes`, dark-first + light toggle ([03](./03-styling-and-theme.md)) |
| `Header` / `Nav` | logo (animated mark), links (About/Events/Membership/Team/Partners), theme toggle (sun/moon), **Join Us** button (→ Google Form). Sticky, blurred on scroll. Mobile: hamburger → menu (Radix). |
| `Footer` | tagline, nav links, Facebook Group, social icons, `footerLegal` ("BICOLIT.ORG INC. — registered nonprofit under SEC, BIR & LGU"), © year. |

## C. Sections (top to bottom)

| # | Section (`id`) | Key elements | Content source |
|---|---|---|---|
| 1 | Hero (`home`) | animated logomark, rotating headline word, `description`, floating tag pills, terminal widget, CTAs ("Become a member" → Google Form, "Explore BITCON 2024 →"), "EST. 2013" badge | `settings` |
| 2 | About (`about`) | heading ("The biggest and most active IT education advocacy…"), supporting copy, graphic | `settings.aboutHeading` |
| 3 | Events (`events`) | big "BITCON" title, tagline, tracks (Talks / Workshops / Community), CTA | `events` |
| 4 | Membership (`membership`) | eyebrow `/ MEMBERSHIP`, heading "Choose how you grow with the community.", 3 tier cards (Basic Free / Growth ₱249 POPULAR / Pro ₱499), "Join Us Now" → Google Form | `membershipTiers` |
| 5 | Team (`team`) | heading "Led by advocates & students.", **tabs** (Advocates / Students / Founders), person cards (initials or photo, name, position, LinkedIn; school for students) | `team` collection |
| 6 | Partners (`partners`) | partner/social logos + links | `partners`, `settings.social` |

## D. Signature interactions (reimplement)

| Interaction | Implementation notes |
|---|---|
| **Theme toggle** | `next-themes` (see [03](./03-styling-and-theme.md)). |
| **Animated logomark** | SVG mark = 20 tiles (`#p0`…`#p19`, `data-col`/`data-row`/`data-idx`, viewBox 79.45×39.43, gradient `#8B5CF6→#22D8F5`). Presets in Logo Kit: assemble / cascade / wave / pop. Reimplement with CSS keyframes or `motion` (framer-motion), staggering by `data-idx`. Extract the SVG paths from `Logo Kit.dc.html`. |
| **Rotating hero word** | cycle `settings.heroWords` (Today/Locally/Together/Boldly) on an interval with a fade/slide; gradient-fill the active word. |
| **Floating tag pills** | absolutely-positioned Space-Mono pills (`// AI`, `// Cloud`…) with subtle float/parallax; hide/reduce on mobile. |
| **Terminal widget** | fake `zsh` window (traffic-light dots `#FF5F57`/`#FEBC2E`/green, typed lines, `[ok]` in `#5FE39B`). Includes a **snake easter egg** (`screenshots/snake.png`) — a small keyboard-driven canvas game triggered from the terminal. Nice-to-have; can ship v1 without the game, terminal static/typed first. |
| **Team tabs** | Radix Tabs (via shadcn), filter `team` by `category`. |
| **Membership cards** | hover elevation; POPULAR badge on Growth. |
| Respect `prefers-reduced-motion` for all of the above. |

## E. Assets

- **Logomark:** extract animated SVG from `Logo Kit.dc.html`; static logo at `docs/new-website-design/public/bicolit-logo.svg`.
- **Social icons:** `docs/new-website-design/public/assets/partners/{facebook,ig,x}.svg`.
- **Team photos:** reuse existing `public/assets/{advocates,founders,student-council}/*` → migrate into Keystatic ([04](./04-content-keystatic.md)).
- **Fonts:** Space Mono + display sans via `next/font` ([03](./03-styling-and-theme.md)).
- Curate `public/` — drop old/unused assets (`vercel.svg`, `next.svg`, placeholder, old hero graphics) not used by the new design.

## F. Responsive

Match the screenshot breakpoints:
- **Mobile:** `hero-mobile*.png` — stacked, pills reduced, logomark scaled/simplified, terminal below CTAs.
- **Tablet:** `hero-tablet*.png`.
- **Desktop:** `hero-desktop-final.png` (primary), `hero-lower.png`, `hero-check.png`, `net-assemble.png` (logomark assembly), `team.png`, membership.

## G. Suggested extra deps

- `motion` (framer-motion 12+) — logomark assembly, pill float, word rotation, section reveals. _(Optional; CSS-only is possible but heavier to hand-tune.)_
- shadcn primitives already cover tabs/menu/dialog ([03](./03-styling-and-theme.md)).

## Exit criteria

- All six sections render from Keystatic content, matching the screenshots in dark and light.
- Nav, theme toggle, team tabs, rotating word, logomark animation, membership cards working; reduced-motion respected.
- No `dc-runtime`/`support.js` in the shipped app; old `src/components` gone.
- Lighthouse/CWV sane; responsive across mobile/tablet/desktop.
