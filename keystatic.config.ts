import { config, collection, singleton, fields } from "@keystatic/core";

// GitHub repo backing prod editing (SSH remote: bicolit/bicolit-2024-website).
const repo = "bicolit/bicolit-2024-website" as const;

export default config({
  // GitHub-backed in-browser editing turns on only when the GitHub App env
  // vars are present in the environment (KEYSTATIC_GITHUB_CLIENT_ID/SECRET +
  // KEYSTATIC_SECRET). Without them — local dev and CI builds — fall back to
  // the local filesystem so nothing requires secrets to compile.
  storage: process.env.KEYSTATIC_GITHUB_CLIENT_ID
    ? { kind: "github", repo }
    : { kind: "local" },
  ui: {
    brand: { name: "Bicol IT" },
    navigation: {
      Content: ["team", "events", "partners"],
      Site: ["settings", "membershipTiers"],
    },
  },

  collections: {
    // One collection for all people; `category` drives the design's Team tabs.
    team: collection({
      label: "Team",
      slugField: "name",
      path: "src/content/team/*",
      format: { data: "yaml" },
      columns: ["name", "category", "position"],
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        category: fields.select({
          label: "Category",
          description: "Drives which Team tab this person appears under.",
          options: [
            { label: "Advocate", value: "advocate" },
            { label: "Student council", value: "student" },
            { label: "Founder", value: "founder" },
          ],
          defaultValue: "advocate",
        }),
        position: fields.text({ label: "Position" }),
        photo: fields.image({
          label: "Photo",
          directory: "public/images/team",
          publicPath: "/images/team",
          validation: { isRequired: false },
        }),
        linkedin: fields.url({
          label: "LinkedIn",
          validation: { isRequired: false },
        }),
        school: fields.text({
          label: "School",
          description: "Students only.",
          validation: { isRequired: false },
        }),
        schoolLogo: fields.image({
          label: "School logo",
          directory: "public/images/schools",
          publicPath: "/images/schools",
          validation: { isRequired: false },
        }),
        schoolSite: fields.url({
          label: "School website",
          validation: { isRequired: false },
        }),
        order: fields.integer({
          label: "Order",
          description: "Sort order within the tab (ascending).",
          defaultValue: 0,
        }),
      },
    }),

    events: collection({
      label: "Events",
      slugField: "title",
      path: "src/content/events/*",
      format: { data: "yaml" },
      columns: ["title", "year"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        year: fields.integer({ label: "Year" }),
        tagline: fields.text({ label: "Tagline", multiline: true }),
        description: fields.text({
          label: "Description",
          multiline: true,
          validation: { isRequired: false },
        }),
        tracks: fields.array(fields.text({ label: "Track" }), {
          label: "Tracks",
          itemLabel: (p) => p.value,
        }),
        link: fields.url({ label: "Link", validation: { isRequired: false } }),
        featured: fields.checkbox({ label: "Featured", defaultValue: false }),
      },
    }),

    // Org partners shown in the Partners section (empty until logos are supplied).
    partners: collection({
      label: "Partners",
      slugField: "name",
      path: "src/content/partners/*",
      format: { data: "yaml" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        logo: fields.image({
          label: "Logo",
          directory: "public/images/partners",
          publicPath: "/images/partners",
          validation: { isRequired: false },
        }),
        url: fields.url({ label: "URL", validation: { isRequired: false } }),
      },
    }),
  },

  singletons: {
    // Global site content — replaces the old hardcoded src/config/site.ts.
    settings: singleton({
      label: "Site settings",
      path: "src/content/settings",
      format: { data: "yaml" },
      schema: {
        name: fields.text({ label: "Name", defaultValue: "Bicol IT" }),
        url: fields.url({
          label: "Site URL",
          defaultValue: "https://bicolit.org",
        }),
        established: fields.integer({
          label: "Established",
          defaultValue: 2013,
        }),
        description: fields.text({ label: "Description", multiline: true }),
        keywords: fields.array(fields.text({ label: "Keyword" }), {
          label: "SEO keywords",
          itemLabel: (p) => p.value,
        }),
        heroWords: fields.array(fields.text({ label: "Word" }), {
          label: "Hero rotating words",
          itemLabel: (p) => p.value,
        }),
        aboutHeading: fields.text({ label: "About heading", multiline: true }),
        aboutParagraphs: fields.array(
          fields.text({ label: "Paragraph", multiline: true }),
          { label: "About paragraphs", itemLabel: (p) => p.value },
        ),
        tagPills: fields.array(fields.text({ label: "Pill" }), {
          label: "Tag pills",
          itemLabel: (p) => p.value,
        }),
        terminalLines: fields.array(fields.text({ label: "Line" }), {
          label: "Terminal lines",
          itemLabel: (p) => p.value,
        }),
        nav: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            href: fields.text({ label: "Href" }),
          }),
          { label: "Navigation", itemLabel: (p) => p.fields.label.value },
        ),
        membershipUrl: fields.url({ label: "Membership form URL" }),
        contacts: fields.array(
          fields.object({
            key: fields.text({ label: "Key" }),
            value: fields.text({ label: "Value", multiline: true }),
          }),
          { label: "Contacts", itemLabel: (p) => p.fields.key.value },
        ),
        social: fields.array(
          fields.object({
            name: fields.text({ label: "Name" }),
            url: fields.url({ label: "URL" }),
            logo: fields.image({
              label: "Logo",
              directory: "public/images/social",
              publicPath: "/images/social",
              validation: { isRequired: false },
            }),
          }),
          { label: "Social links", itemLabel: (p) => p.fields.name.value },
        ),
        facebookGroup: fields.url({ label: "Facebook group URL" }),
        footerLegal: fields.text({ label: "Footer legal", multiline: true }),
        copyrightYear: fields.integer({
          label: "Copyright year",
          defaultValue: 2024,
        }),
      },
    }),

    // Membership tiers (Basic / Growth / Pro) — one singleton holding the array.
    membershipTiers: singleton({
      label: "Membership tiers",
      path: "src/content/membershipTiers",
      format: { data: "yaml" },
      schema: {
        tiers: fields.array(
          fields.object({
            name: fields.text({ label: "Name" }),
            price: fields.text({ label: "Price", description: "e.g. Free, ₱249" }),
            oldPrice: fields.text({
              label: "Old price",
              validation: { isRequired: false },
            }),
            cadence: fields.text({ label: "Cadence / blurb" }),
            features: fields.array(fields.text({ label: "Feature" }), {
              label: "Features",
              itemLabel: (p) => p.value,
            }),
            cta: fields.text({ label: "CTA label", defaultValue: "Get started" }),
            popular: fields.checkbox({ label: "Popular", defaultValue: false }),
          }),
          { label: "Tiers", itemLabel: (p) => p.fields.name.value },
        ),
      },
    }),
  },
});
