# 01 — Cleanup & Tooling

_Phase 0. Prereq for everything else. See [README](./README.md)._

Because the front-end is a full replacement ([05](./05-design-implementation.md)) and membership stays a Google Form, most of the current `src/` and several deps are simply deleted — not migrated.

## A. Remove (dead code & outdated deps)

| Remove | Reason |
|---|---|
| Entire `src/components/*` | Old UI discarded; rebuilt from new design |
| `src/app/page.tsx`, `src/app/globals.css`, old `layout.tsx` body | Replaced by new design |
| `src/lib/state.js` | Trivial nav Context; new design handles its own state |
| `src/components/email/index.tsx`, `submitEmail` action, commented form in `membership.tsx` | Membership = Google Form; email path is dead code |
| `src/lib/types.ts` (email prop types) | Only used by removed email code |
| `@plunk/node` | SDK stale/unmaintained + feature removed |
| `@react-email/components`, `@react-email/render` | Only used by removed email code |
| individual `@radix-ui/react-*` (accordion, dropdown-menu, icons, navigation-menu, tabs) | Superseded by unified `radix-ui` / shadcn (rebuild) |
| `package-lock.json` | Dual-lockfile conflict — keep pnpm only |
| `autoprefixer`, `postcss-import` (if present) | Built into Tailwind 4 |
| `.eslintrc.json` | ESLint 10 removed legacy config format |
| `import { describe } from "node:test"` (`blogs.tsx:1`) | Junk/bug (moot once file deleted) |
| lorem-ipsum blogs, `PLUNK_API_KEY` in `.example.env` | Placeholder / obsolete env |

**Keep / re-evaluate:** `clsx`, `tailwind-merge`, `class-variance-authority` (used by shadcn — keep), `sonner` (keep if new design uses toasts; otherwise drop). Content values in `site.ts` are **migrated** to Keystatic ([04](./04-content-keystatic.md)), not deleted blindly. Everything in `public/assets/` and the new design's `docs/new-website-design/public/` is preserved/curated during the design port.

> If a native contact/signup form is ever wanted, re-add `resend` + `react-email` 6 (async `render()`) + `zod`. Not in current scope.

## B. Package manager — pnpm

1. Delete `package-lock.json`; keep `pnpm-lock.yaml`.
2. Add to `package.json`: `"packageManager": "pnpm@11.9.0"`.
3. Add a guard so nobody regenerates the npm lockfile — `preinstall` script `npx only-allow pnpm`.
4. pnpm 11 requires **Node 22+**; we target Node 24 anyway (below).
5. Run a fresh `pnpm install` and confirm resolution.

## C. Node

- Next 16 minimum is Node **20.9**, but Node 20 hit EOL 2026-04-30. Target **Node 24 LTS** (Active LTS).
- Add `.nvmrc` = `24` and `"engines": { "node": ">=24" }` to `package.json`.

## D. Linter — ESLint 9 (flat config) ⚠️ deviates from plan

- Next 16 removed `next lint`; `next build` no longer lints. Run ESLint directly.
- Create `eslint.config.mjs` (flat config — legacy `.eslintrc.*` unsupported). Spread `eslint-config-next/core-web-vitals` (default array export — **no** `FlatCompat`, which throws "Converting circular structure to JSON" against config-next 16).
- Use `eslint-config-next` 16 (`eslint-config-next/core-web-vitals`).
- **Pinned to ESLint `^9`, NOT 10 (plan target).** `eslint-config-next@16.2.10`'s bundled plugins are not ESLint-10-clean: `eslint-plugin-react` calls the removed `context.getFilename()` (→ `contextOrFilename.getFilename is not a function`), and the TS parser path hits `scopeManager.addGlobals is not a function`. config-next declares peer `eslint >=9` but its plugin stack only runs on 9. This is the "open compat issue" flagged above — confirmed at execution time (2026-07-05).
- **Revisit ESLint 10** once eslint-config-next ships eslint-10-compatible react / react-hooks plugins. ESLint 9 EOL is 2026-08-06 — track it.

## E. Scripts (package.json)

```jsonc
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
    // "test": "vitest"  // optional, Phase 4
  }
}
```

## F. Deploy target (open decision)

Vercel Hobby is **non-commercial**, and Vercel counts "asking for donations" as commercial use. If the site ever solicits donations/payments/ads:
- Vercel Pro ($20/mo), **or**
- Cloudflare Workers via OpenNext (generous free tier), **or**
- Netlify, **or**
- open-source the repo + apply to Vercel's OSS program.

Decide before launch if fundraising is on the roadmap.

## Exit criteria

- Single lockfile (`pnpm-lock.yaml`); `pnpm install` clean on Node 24.
- Old UI/dead deps removed; repo builds an empty/stub app.
- `eslint .` and `tsc --noEmit` run via scripts.
