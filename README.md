<div align="center">

<img src="public/bicolit-logo.svg" alt="Bicol IT" width="120" />

# BICOLIT.ORG INC. — Official Website

**Transforming Bicol into a globally competitive Information Technology hub through education and technopreneurship.**

[![Website](https://img.shields.io/badge/website-bicolit.org-2563eb)](https://bicolit.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Established](https://img.shields.io/badge/est.-2013-111827)](#about)

[Website](https://bicolit.org) · [Facebook](https://www.facebook.com/bicolit.org) · [Instagram](https://instagram.com/bicolit) · [X](https://x.com/bicolit)

</div>

---

## About

**Bicol IT** is the biggest and most active IT education advocacy in the Bicol region. From its inception in **2013**, the community has grown from a few enthusiasts to thousands of students, professionals, founders, and academics.

Over the years we have run dozens of seminars, meetups, and workshops on a wide range of technologies, attracting thousands of participants from all over Bicol. Our events consistently feature experts from the industry who generously share their knowledge with our members.

**BICOLIT.ORG INC.** is a duly registered nonprofit corporation under the SEC, BIR, LGU, and other government institutions.

- **5,000+** members online
- Chapters across **Albay · Camarines Sur · Sorsogon**
- Home of **BITCON**, the flagship Bicol IT conference

This repository contains the source for the organization's official website at **[bicolit.org](https://bicolit.org)**.

## Website sections

| Section | Description |
| --- | --- |
| **Hero** | Interactive landing with an animated canvas mini-game and live "community terminal". |
| **About** | The organization's story, mission, and focus areas — AI, Cloud, Web, Data, Startups, UI/UX, Cybersecurity, Community. |
| **Events** | Featuring **BITCON** — talks, workshops, and community across Bicol's growing tech scene. |
| **Membership** | Tiered membership (Basic, Growth, Pro) with sign-up flow. |
| **Team** | Roster of the organization's officers and volunteers. |
| **Partners** | Partner and sponsor recognition. |

## Membership

| Tier | Price | Highlights |
| --- | --- | --- |
| **Basic** | Free | Official community membership, Bicol IT badge, online group access |
| **Growth** | ₱249 _(one-time)_ | Everything in Basic + event discounts + Bicol IT ID card |
| **Pro** | ₱499 _(one-time)_ | Everything in Growth + event vouchers, exclusive events & merch, Pro group |

Join at the [membership form](https://docs.google.com/forms/d/e/1FAIpQLSdA8CorhD6jXJ-EwaAg4gHlv_TVqfwY67VExd9QCYcVENlwvw/viewform).

## Tech stack

- **[Next.js 16](https://nextjs.org/)** (App Router) + **[React 19](https://react.dev/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)** with `tw-animate-css`
- **[Radix UI](https://www.radix-ui.com/)** + **[lucide-react](https://lucide.dev/)** icons
- **[Keystatic](https://keystatic.com/)** — Git-based CMS for editable content
- **[next-themes](https://github.com/pacocoursey/next-themes)** for light/dark mode
- **TypeScript**, **ESLint**, **pnpm**

## Getting started

**Requirements:** [Node.js](https://nodejs.org/) `>= 24` (see `.nvmrc`) and [pnpm](https://pnpm.io/) `11+`. This project is pnpm-only.

```bash
# install dependencies
pnpm install

# copy environment defaults
cp .example.env .env.local

# start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm build` | Build the production bundle |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Type-check with `tsc` |

## Editing content

Site content is stored as YAML/Markdown under [`src/content/`](src/content) and managed through **Keystatic**.

- `settings.yaml` — global site settings, navigation, contacts, and socials
- `events/` — event entries (e.g. BITCON)
- `membershipTiers.yaml` — membership plans
- `team/` — team member profiles

To edit through the CMS UI, run the dev server and open the Keystatic admin at:

```
http://localhost:3000/keystatic
```

Changes are written straight back to the content files as commits.

## Project structure

```
src/
├── app/            # Next.js App Router (layout, page, Keystatic routes)
├── components/
│   ├── site/       # Page sections (hero, about, events, membership, team, ...)
│   └── ui/         # Reusable UI primitives
├── content/        # Editable YAML/Markdown content (Keystatic collections)
└── lib/            # Content loading helpers
public/             # Static assets (logo, images, videos, og image)
keystatic.config.ts # Keystatic CMS schema
```

## Deployment

The site is served from the custom domain **[bicolit.org](https://bicolit.org)** (see [`CNAME`](CNAME)). Build the production bundle with `pnpm build` before deploying.

## Support the mission

BICOLIT.ORG INC. is a nonprofit. You can support our education and community programs with cryptocurrency:

| Asset | Address |
| --- | --- |
| **Bitcoin (BTC)** | `bc1q4362cdaddcxsufcxx5qg4vdlrt4jluem2psp5s` |
| **Ether (ETH) & ERC-20** _(incl. SparkPoint / SRK)_ | `0x7b7289d6361FDD92CdA6A1BBf21D6B914A4227FB` |
| **Binance Coin (BNB)** | `bnb1lens6xwe0th3msp8zmfatpxfa94k5g57q90ae8` |

## Contact

- **HQ:** 2F RJV Commercial Building, Rizal St. Cor. Gov. Reynolds St., Old Albay District, Legazpi City, 4500, Albay, Philippines
- **Email:** [hello@bicolit.org](mailto:hello@bicolit.org)
- **Community:** [Facebook Group](https://www.facebook.com/groups/194616090699146)

## License

Released under the [MIT License](LICENSE). © 2013 Bicol IT.org
