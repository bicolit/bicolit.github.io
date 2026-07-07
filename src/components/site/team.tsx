import Image from "next/image";

import { LiveDots, Eyebrow } from "./decor";
import { LinkedInIcon } from "./icons";
import { Reveal } from "./reveal";

export type TeamMember = {
  slug: string;
  name: string;
  category: string;
  position: string;
  photo: string | null;
  linkedin: string | null;
  school: string | null;
  order: number;
};

// Sections stacked top-to-bottom (no tabs). Student council is intentionally
// omitted for now — re-add { key: "student", ... } when the roster is ready.
const SECTIONS = [
  { key: "founder", label: "Founders", blurb: "The people who started it all.", showPosition: true },
  // Advocates are shown by name only — positions hidden for now.
  { key: "advocate", label: "Advocates", blurb: "Leaders steering the community forward.", showPosition: false },
] as const;

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,var(--purple),var(--purple2))",
  "linear-gradient(135deg,var(--purple2),var(--cyan))",
  "linear-gradient(135deg,var(--cyan),var(--purple))",
];

function initials(name: string) {
  const parts = name.replace(/[^A-Za-z ]/g, "").trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

export function Team({ members }: { members: TeamMember[] }) {
  return (
    <section id="team" style={{ position: "relative", overflow: "hidden", background: "var(--surface2)", color: "var(--fg)" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            WebkitMaskImage: "radial-gradient(120% 100% at 50% 0%,#000,transparent 70%)",
            maskImage: "radial-gradient(120% 100% at 50% 0%,#000,transparent 70%)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "clamp(72px,10vw,140px) 24px" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 14 }}>
          <LiveDots style={{ margin: "0 auto 20px" }} />
          <div style={{ marginBottom: 18 }}>
            <Eyebrow>/ The people</Eyebrow>
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(26px,3.3vw,42px)" }}>
            Built by founders &amp; advocates.
          </h2>
        </Reveal>

        {SECTIONS.map((sec) => {
          const people = members.filter((m) => m.category === sec.key);
          if (!people.length) return null;
          return (
            <TeamGroup key={sec.key} label={sec.label} blurb={sec.blurb} people={people} showPosition={sec.showPosition} />
          );
        })}
      </div>
    </section>
  );
}

function TeamGroup({
  label,
  blurb,
  people,
  showPosition,
}: {
  label: string;
  blurb: string;
  people: TeamMember[];
  showPosition: boolean;
}) {
  return (
    <div style={{ marginTop: 64 }}>
      <Reveal style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(20px,2.2vw,26px)", letterSpacing: "-0.01em" }}>{label}</h3>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--cyan)" }}>
            {String(people.length).padStart(2, "0")}
          </span>
        </div>
        {blurb && <p style={{ margin: "8px 0 0", fontSize: 14.5, color: "var(--fg2)" }}>{blurb}</p>}
      </Reveal>

      <Reveal className="team-grid">
        {people.map((person, i) => (
          <PersonCard key={person.slug} person={person} index={i} showPosition={showPosition} />
        ))}
      </Reveal>
    </div>
  );
}

function PersonCard({ person, index, showPosition }: { person: TeamMember; index: number; showPosition: boolean }) {
  return (
    <div
      className="team-card"
      style={{
        borderRadius: 18,
        padding: 20,
        background: "var(--card2)",
        border: "1px solid var(--line)",
        boxShadow: "var(--shadow)",
        transition: "transform .25s ease, border-color .25s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "1",
          borderRadius: 14,
          background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
          display: "grid",
          placeItems: "center",
          marginBottom: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {person.photo ? (
          <Image
            className="team-photo"
            src={person.photo}
            alt={person.name}
            fill
            sizes="(max-width: 640px) 45vw, 220px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 30, color: "#fff", letterSpacing: ".02em" }}>
            {initials(person.name)}
          </span>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(45deg, rgba(255,255,255,.06) 0 6px, transparent 6px 12px)",
            mixBlendMode: "overlay",
          }}
        />
      </div>
      <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>{person.name}</div>
      {showPosition && person.position && (
        <div style={{ fontSize: 13, color: "var(--fg2)", marginTop: 5 }}>{person.position}</div>
      )}
      {person.school && (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg3)", marginTop: 8, letterSpacing: ".02em" }}>
          {person.school}
        </div>
      )}
      {person.linkedin && (
        <a
          href={person.linkedin}
          target="_blank"
          rel="noopener"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 12,
            fontSize: 12,
            textDecoration: "none",
            color: "var(--cyan)",
          }}
        >
          <LinkedInIcon />
          LinkedIn
        </a>
      )}
    </div>
  );
}
