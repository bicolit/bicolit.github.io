import { LiveDots, Eyebrow } from "./decor";
import { CheckIcon } from "./icons";
import { Reveal } from "./reveal";

type Tier = {
  name: string;
  price: string;
  oldPrice?: string | null;
  cadence: string;
  features: readonly string[];
  cta: string;
  popular: boolean;
};

export function Membership({
  tiers,
  membershipUrl,
}: {
  tiers: readonly Tier[];
  membershipUrl: string;
}) {
  return (
    <section id="membership" style={{ position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(var(--line) 1px,transparent 1px)",
            backgroundSize: "26px 26px",
            WebkitMaskImage: "radial-gradient(120% 90% at 50% 35%,#000,transparent 72%)",
            maskImage: "radial-gradient(120% 90% at 50% 35%,#000,transparent 72%)",
          }}
        />
        <div
          className="animate-floaty"
          style={{
            position: "absolute",
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 640,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(139,92,246,.16),transparent 70%)",
            filter: "blur(42px)",
            animationDuration: "12s",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "clamp(72px,10vw,140px) 24px" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 52 }}>
          <LiveDots style={{ margin: "0 auto 20px" }} />
          <div style={{ marginBottom: 18 }}>
            <Eyebrow>/ Membership</Eyebrow>
          </div>
          <h2
            style={{
              margin: "0 auto",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.06,
              fontSize: "clamp(26px,3.3vw,42px)",
              maxWidth: "16ch",
            }}
          >
            Choose how you grow with the community.
          </h2>
        </Reveal>

        <Reveal
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 22,
            alignItems: "start",
          }}
        >
          {tiers.map((t, i) => (
            <TierCard key={t.name} tier={t} index={i} membershipUrl={membershipUrl} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function TierCard({ tier, index, membershipUrl }: { tier: Tier; index: number; membershipUrl: string }) {
  const featured = tier.popular;
  const s = featured
    ? {
        bg: "linear-gradient(160deg,var(--purple),var(--purple2))",
        fg: "#fff",
        border: "transparent",
        shadow: "0 26px 60px -26px var(--purple)",
        check: "#fff",
        iconBg: "rgba(255,255,255,.2)",
        iconFg: "#fff",
        btnBg: "#fff",
        btnFg: "var(--purple2)",
        btnBorder: "transparent",
      }
    : {
        bg: "var(--card2)",
        fg: "var(--fg)",
        border: "var(--line)",
        shadow: "var(--shadow)",
        check: "var(--cyan)",
        iconBg: "var(--chip)",
        iconFg: "var(--purple)",
        btnBg: "transparent",
        btnFg: "var(--fg)",
        btnBorder: "var(--line2)",
      };

  return (
    <div
      className="card-lift"
      style={{
        position: "relative",
        borderRadius: 22,
        padding: "34px 28px",
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.fg,
        boxShadow: s.shadow,
      }}
    >
      {featured && (
        <span
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".1em",
            padding: "5px 11px",
            borderRadius: 999,
            background: "rgba(255,255,255,.16)",
            color: "#fff",
          }}
        >
          POPULAR
        </span>
      )}
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 13,
          display: "grid",
          placeItems: "center",
          background: s.iconBg,
          marginBottom: 20,
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 15, color: s.iconFg }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.8 }}>
        {tier.name}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "16px 0 4px" }}>
        <span style={{ fontWeight: 800, fontSize: 44, lineHeight: 1 }}>{tier.price}</span>
        {tier.oldPrice ? (
          <span style={{ textDecoration: "line-through", opacity: 0.5, fontSize: 18 }}>{tier.oldPrice}</span>
        ) : null}
      </div>
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 24 }}>{tier.cadence}</div>
      <ul style={{ listStyle: "none", margin: "0 0 28px", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {tier.features.map((f) => (
          <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14.5, lineHeight: 1.4 }}>
            <CheckIcon stroke={s.check} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href={membershipUrl}
        target="_blank"
        rel="noopener"
        style={{
          display: "block",
          textAlign: "center",
          padding: 13,
          borderRadius: 999,
          textDecoration: "none",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: ".02em",
          color: s.btnFg,
          background: s.btnBg,
          border: `1px solid ${s.btnBorder}`,
        }}
      >
        {tier.cta}
      </a>
    </div>
  );
}
