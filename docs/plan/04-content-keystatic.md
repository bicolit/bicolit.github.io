# 04 — Content & Keystatic

_Phase 3. See [README](./README.md). This replaces the hardcoded `src/config/site.ts`._

Content moves from one hardcoded TS object into **Keystatic** — a free, git-based CMS that runs inside the Next app. Editors use a web UI; saves become GitHub commits (full version history, no DB, no hosting cost). The content model is **restructured to match the new design**, which consolidates people into one tabbed Team section.

## A. Setup

- Add `@keystatic/core` + `@keystatic/next`.
- Create `keystatic.config.ts` (storage: `github` for prod editing, `local` for dev).
- Mount the admin UI route (`/keystatic`) + the Keystatic API route in `app/`.
- Editors connect once via a GitHub OAuth app; thereafter edit in-browser.
- Read content in Server Components; use static/ISR + `revalidateTag`/`revalidatePath` on publish (mind Next 16 caching opt-in — see [02](./02-framework-upgrade.md)).

## B. Content model (revised for the new design)

### Collections

**`team`** — replaces the old separate `advocates[]`, `studentCouncil[]`, `founders[]`. One collection, categorised so the design's Team **tabs** filter it.
| field | type | notes |
|---|---|---|
| name | text | |
| category | select: `advocate` \| `student` \| `founder` | drives the Team tabs |
| position | text | e.g. President, Head of Technology |
| photo | image | migrate from `public/assets/{advocates,founders,student-council}/` |
| linkedin | url (optional) | |
| school | text (optional) | students only (e.g. Bicol University) |
| schoolLogo | image (optional) | students only |
| schoolSite | url (optional) | students only |
| order | number | sort within tab |

**`events`** — new (design has a BITCON section; old site had none).
| field | type | notes |
|---|---|---|
| title | text | e.g. BITCON |
| year | number | e.g. 2024 |
| tagline | text | "Talks, workshops, and community…" |
| description | markdoc/text | |
| tracks | array of text | Talks / Workshops / Community |
| link | url | "Explore BITCON 2024 →" target |
| featured | checkbox | show on hero CTA |

**`partners`** — org/social partners shown in the Partners section.
| field | type | notes |
|---|---|---|
| name | text | |
| logo | image | |
| url | url | |

> **Blogs:** dropped in the new design (no nav entry). Do **not** recreate the lorem-ipsum blogs. If a blog is wanted later, add a `posts` collection (MDX body) — out of current scope.

### Singletons

**`settings`** — global site content (replaces `site.ts` scalars + the arrays that aren't people).
| field | type | source / value |
|---|---|---|
| name | text | "Bicol IT" |
| established | number | **2013** (design badge "EST. 2013") |
| description | text | "Transforming Bicol into a globally competitive IT hub through education and technopreneurship." |
| heroWords | array of text | rotating headline: Today / Locally / Together / Boldly |
| aboutHeading | text | "The biggest and most active IT education advocacy in the Bicol region." |
| tagPills | array of text | `// AI`, `// Cloud`, `// Web`, `// Data`, `// Startups`, `// Community`, `// UI/UX`, `// Cybersecurity` |
| terminalLines | array of text | fake terminal copy (`./launch --community`, `[ok] members online …`) |
| nav | array of {label, href} | About, Events, Membership, Team, Partners |
| membershipUrl | url | Google Form (keep from old `contacts.membership`) |
| contacts | object | HQ address, mobile, email (from old `contacts.info`) |
| social | array of {name, logo, url} | Facebook, Instagram, X (from old `contacts.links`) |
| facebookGroup | url | old `contacts.group` |
| footerLegal | text | "BICOLIT.ORG INC. — registered nonprofit under SEC, BIR & LGU." |
| copyrightYear | number | 2024 (update to current on launch) |

**`membershipTiers`** — could be a singleton with an array, or a small collection. Fields per tier: `name` (Basic/Growth/Pro), `price` (Free / ₱249 / ₱499), `oldPrice` (₱399 / ₱799), `blurb` ("For every member of the community", "One-time · best value"), `features` (array), `popular` (checkbox — Growth). Sourced from old `membership.tsx` copy + design screenshots.

## C. Migration mapping (old `site.ts` → Keystatic)

| Old `site.ts` | New home |
|---|---|
| `advocates[]` | `team` (category=advocate) |
| `studentCouncil[]` | `team` (category=student) + school fields |
| `founders[]` | `team` (category=founder) |
| `links[]` | `settings.nav` (trimmed to About/Events/Membership/Team/Partners) |
| `contacts.info` | `settings.contacts` |
| `contacts.links` | `settings.social` |
| `contacts.group` | `settings.facebookGroup` |
| `contacts.membership` | `settings.membershipUrl` |
| `formDetails` | **dropped** (no native form; Google Form) |
| membership tier copy (`membership.tsx`) | `membershipTiers` |
| blogs (`blogs.tsx`, lorem) | **dropped** |

**New content to author** (in design, absent from old data): `established` (2013), `heroWords`, `aboutHeading`, `tagPills`, `terminalLines`, events/BITCON, `footerLegal`, `copyrightYear`.

**Data to verify with the org** (placeholders in old data): mobile number was `+63 9999123456` (placeholder — get real); confirm current email `hello@bicolit.org`; confirm membership tier prices are current.

## D. Images

- Move team photos from `public/assets/{advocates,founders,student-council}/` into Keystatic image fields (or a Keystatic-managed dir). Same for partner logos.
- The animated logomark SVG comes from the design (see [05](./05-design-implementation.md)), not content.

## Exit criteria

- Keystatic admin reachable at `/keystatic`; collections + singletons defined.
- All old `site.ts` real content migrated; new copy authored.
- Sections in [05](./05-design-implementation.md) render from Keystatic, not hardcoded arrays.
