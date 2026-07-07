import { reader } from "@/lib/content";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Events } from "@/components/site/events";
import { Membership } from "@/components/site/membership";
import { Team, type TeamMember } from "@/components/site/team";
import { Footer } from "@/components/site/footer";

export default async function Home() {
  const [settings, tiersDoc, events, teamEntries] = await Promise.all([
    reader.singletons.settings.read(),
    reader.singletons.membershipTiers.read(),
    reader.collections.events.all(),
    reader.collections.team.all(),
  ]);

  const nav = (settings?.nav ?? []).map((n) => ({ label: n.label, href: n.href }));
  const membershipUrl = settings?.membershipUrl ?? "";
  const established = settings?.established ?? 2013;

  const tiers = (tiersDoc?.tiers ?? []).map((t) => ({
    name: t.name,
    price: t.price,
    oldPrice: t.oldPrice || null,
    cadence: t.cadence,
    features: [...t.features],
    cta: t.cta,
    popular: t.popular,
  }));

  const featured = events.find((e) => e.entry.featured) ?? events[0];

  const members: TeamMember[] = teamEntries
    .map(({ slug, entry }) => ({
      slug,
      name: entry.name,
      category: entry.category,
      position: entry.position,
      photo: entry.photo || null,
      linkedin: entry.linkedin || null,
      school: entry.school || null,
      order: entry.order ?? 0,
    }))
    .sort((a, b) => a.order - b.order);

  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", overflowX: "hidden" }}>
      <Header nav={nav} membershipUrl={membershipUrl} />

      <Hero
        heroWords={[...(settings?.heroWords ?? [])]}
        description={settings?.description ?? ""}
        tagPills={[...(settings?.tagPills ?? [])]}
        terminalLines={[...(settings?.terminalLines ?? [])]}
        membershipUrl={membershipUrl}
        established={established}
      />

      <About
        heading={settings?.aboutHeading ?? ""}
        paragraphs={[...(settings?.aboutParagraphs ?? [])]}
        established={established}
      />

      {featured && (
        <Events
          title={featured.entry.title}
          year={featured.entry.year ?? established}
          tagline={featured.entry.tagline}
          tracks={[...featured.entry.tracks]}
        />
      )}

      <Membership tiers={tiers} membershipUrl={membershipUrl} />

      <Team members={members} />

      <Footer
        description={settings?.description ?? ""}
        nav={nav}
        contacts={(settings?.contacts ?? []).map((c) => ({ key: c.key, value: c.value }))}
        social={(settings?.social ?? []).map((s) => ({ name: s.name, url: s.url ?? "#" }))}
        facebookGroup={settings?.facebookGroup ?? ""}
        footerLegal={settings?.footerLegal ?? ""}
        copyrightYear={settings?.copyrightYear ?? 2024}
      />
    </div>
  );
}
