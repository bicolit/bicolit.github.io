# Bicol IT Website — Rebuild & Upgrade Plan

_Authored 2026-07-05. Scope: back-end, business logic, functionality, content, and a full front-end replacement with the new design. UI is a complete rebuild, not an incremental migration._

This plan is split across several files (see [Index](#index)). Start here.

---

## Goal

Take the current Next.js 14 site and rebuild it on a current (mid-2026) stack, **replacing the entire front-end with the new design** in `docs/new-website-design/`, while migrating all real content into a git-based CMS. The old `src/` UI is discarded wholesale — we do **not** modify existing components one by one.

## Locked decisions (2026-07-05)

| # | Decision | Choice |
|---|---|---|
| 1 | Front-end | **Full replacement** with the new design (`docs/new-website-design/`). Rip out old `src/` UI, rebuild. |
| 2 | Content | **Keystatic** (git-based CMS, runs in-app, free) — see [04](./04-content-keystatic.md) |
| 3 | Membership | **Keep Google Form** → the entire email stack (Plunk + react-email) is deleted, not upgraded |
| 4 | Linter | ESLint flat config + `eslint-config-next` 16. Target was **10**; shipped on **9** — config-next 16 plugins break on 10 (see [01 §D](./01-cleanup-and-tooling.md)) |
| 5 | Execution | Plan only for now; no code changes yet |
| — | Deploy target | _open_ — mind Vercel commercial/donations rule if fundraising is added (see [01](./01-cleanup-and-tooling.md)) |

## Current state (what we're replacing)

- **Framework:** Next.js 14.1.0 (App Router), React 18, TypeScript 5, Node unpinned.
- **UI:** ~20 hand-built components in `src/components/`, Tailwind 3.3, individual `@radix-ui/react-*`, `sonner`. All discarded.
- **Content:** 100% hardcoded in `src/config/site.ts` (advocates, student council, founders, contacts, membership tiers). Blogs = lorem ipsum. → migrate to Keystatic.
- **Backend:** one disabled email server action (`membership.tsx` → `submitEmail`) via Plunk + react-email. → deleted. Live membership path = Google Form link.
- **Mess:** two lockfiles committed, legacy `.eslintrc.json`, junk `import { describe } from "node:test"` in `blogs.tsx`.

## Target stack (one line)

**Next.js 16.2 (App Router, React 19.2, TS 6, Node 24 LTS) + Tailwind 4 + shadcn/ui (unified `radix-ui`) + `next-themes` (dark-first + light toggle) + Keystatic (content) + pnpm 11 + ESLint 9 flat (10 blocked by config-next 16, see [01](./01-cleanup-and-tooling.md)). Membership stays a Google Form; no email/DB/auth deps.**

Full version table in [02](./02-framework-upgrade.md).

## The new design (summary)

Dark-first redesign (with light toggle) in `docs/new-website-design/` — a `dc-runtime` React prototype (`.dc.html` + screenshots + Logo Kit). Highlights:

- **Sections:** Hero (home) · About · Events (BITCON) · Membership · Team · Partners · Footer.
- **Simplified nav:** About · Events · Membership · Team · Partners · **Join Us**. The old separate Advocates / Student Council / Founders / Blogs / News sections are **gone** — people are consolidated into a single tabbed **Team** section; Blogs dropped.
- **Signature interactions:** animated 20-tile logomark, rotating hero headline word (Today / Locally / Together / Boldly), floating tag pills (`// AI`, `// Cloud`, `// Web`…), a fake terminal widget (with a snake easter egg), dark/light theme toggle, membership cards, team tabs.
- **Brand:** gradient `#8B5CF6 → #22D8F5`, deep-purple darks (`#0A0416` / `#150B2E`), cyan accent `#22D8F5`, `Space Mono` for labels/terminal. Full tokens in [03](./03-styling-and-theme.md).

Detailed port plan in [05](./05-design-implementation.md).

---

## Roadmap (phase order)

| Phase | File | What |
|---|---|---|
| 0 | [01](./01-cleanup-and-tooling.md) | Cleanup + tooling: remove old UI/dead deps, pnpm, Node, ESLint 10 |
| 1 | [02](./02-framework-upgrade.md) | Framework: Next 16 / React 19 / TS 6 (fresh reset vs in-place) |
| 2 | [03](./03-styling-and-theme.md) | Styling foundation: Tailwind 4, shadcn/radix, theme tokens, dark/light |
| 3 | [04](./04-content-keystatic.md) | Content: Keystatic collections, migrate `site.ts` → CMS (new model) |
| 4 | [05](./05-design-implementation.md) | Build the new design section-by-section, wired to Keystatic content |

Phases 2–4 overlap heavily (styling + content + build are one rebuild effort). 0 and 1 come first.

## Index

- **[01 — Cleanup & Tooling](./01-cleanup-and-tooling.md)** — removals, pnpm, Node, ESLint 10, scripts.
- **[02 — Framework Upgrade](./02-framework-upgrade.md)** — Next/React/TS versions, migration approach & notes.
- **[03 — Styling & Theme](./03-styling-and-theme.md)** — Tailwind 4, shadcn/radix, design tokens, dark/light.
- **[04 — Content & Keystatic](./04-content-keystatic.md)** — content model, collections, migration mapping.
- **[05 — Design Implementation](./05-design-implementation.md)** — section/component build plan, interactions, assets.
