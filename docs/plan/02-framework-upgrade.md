# 02 — Framework Upgrade

_Phase 1. See [README](./README.md)._

## Target versions (mid-2026 stable)

| Package | Current | Target | Note |
|---|---|---|---|
| next | 14.1.0 | **16.2.x** | two majors; Turbopack default; caching opt-in |
| react / react-dom | 18 | **19.2.x** | Actions, `useActionState`, `use()`, ref-as-prop, native metadata |
| typescript | ^5 | **6.0** | 7.0 (Go rewrite) in RC — watch, don't adopt yet |
| Node | unpinned | **24 LTS** | see [01](./01-cleanup-and-tooling.md) |
| @types/node, @types/react, @types/react-dom | 20 / 18 | latest matching (Node 24 / React 19) | |
| eslint / eslint-config-next | 8 / 14 | **10 / 16** | flat config — see [01](./01-cleanup-and-tooling.md) |

## Approach — fresh reset vs in-place

Because the entire front-end is being replaced and there is no backend to preserve, the two viable paths are:

### Recommended: in-place dependency reset (keeps git history)
1. Rewrite `package.json` dependencies to the target versions above (drop the removed deps from [01](./01-cleanup-and-tooling.md)).
2. `pnpm install` on Node 24.
3. Replace `next.config.mjs`, `tsconfig.json`, ESLint/PostCSS/Tailwind config with current-format equivalents (Tailwind config → CSS, see [03](./03-styling-and-theme.md)).
4. Empty `src/` down to a stub `app/layout.tsx` + `app/page.tsx`, then build up from the new design ([05](./05-design-implementation.md)).

Keeps the repo, git history, `public/` assets, and the `docs/` design source in place.

### Alternative: fresh `create-next-app`
`pnpm create next-app@latest` (App Router, TS, Tailwind, ESLint or Biome) in a scratch dir, then copy the repo's `.git`, `public/`, and `docs/` over. Cleaner boilerplate, but loses the in-place history continuity unless carefully merged. Use only if the in-place reset gets messy.

> Either way you end up at the same target stack. Prefer in-place.

## Migration notes (things a Next 14 / React 18 codebase hits)

Most of these are moot because we're rebuilding, but they matter for any config or stub code carried over, and for writing new code correctly:

- **Async request APIs (Next 15+):** `cookies()`, `headers()`, `draftMode()`, and `params`/`searchParams` are now **async** — always `await` them. (Relevant when wiring Keystatic routes and any dynamic pages.)
- **Caching opt-in (Next 15+):** `fetch`, GET route handlers, and client navigations are **no longer cached by default**. Add `cache: 'force-cache'` / `revalidate` where wanted. Site is mostly static → use static/ISR for content pages.
- **Turbopack default (Next 16):** default for `next dev` and `next build`. No custom webpack config exists, so nothing to migrate. If a custom bundler config is ever added, `next build` needs `--webpack`.
- **`next/image` defaults changed (Next 16):** `minimumCacheTTL` now 4h; local `src` with query strings needs `images.localPatterns`; `qualities` defaults to `[75]`. Current `next.config.mjs` only sets `images.remotePatterns` (bicolit.org) — review during the rebuild; most images will be local/Keystatic assets.
- **`middleware.ts` → `proxy.ts`:** deprecated rename. Not used today; if Keystatic or auth needs middleware later, use the new name (Node runtime only).
- **Removed APIs:** `next lint`, `serverRuntimeConfig`/`publicRuntimeConfig`, AMP, `images.domains`. None used here.
- **React 19:** no more `forwardRef` needed (ref is a prop); `useActionState`/`useFormStatus` for any forms; native `<title>`/`<meta>` support. Build new components against these.
- **Codemods** (for any carried-over code): `npx @next/codemod@canary upgrade latest`, then `npx next typegen` for `PageProps`/`LayoutProps` types.
- **Security:** stay on the latest React 19.2.x patch (RSC advisory Dec 2025).

## Exit criteria

- App runs on Next 16.2 / React 19.2 / TS 6 / Node 24.
- `next build` green with a stub page.
- Config files in current formats; codemods applied to any retained code.
