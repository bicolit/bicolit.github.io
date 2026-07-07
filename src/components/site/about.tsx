import { LiveDots, Eyebrow } from "./decor";
import { Reveal } from "./reveal";

export function About({
  heading,
  paragraphs,
  established,
}: {
  heading: string;
  paragraphs: string[];
  established: number;
}) {
  return (
    <section id="about" style={{ position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            WebkitMaskImage: "radial-gradient(120% 90% at 15% 25%,#000,transparent 70%)",
            maskImage: "radial-gradient(120% 90% at 15% 25%,#000,transparent 70%)",
          }}
        />
        <div
          className="animate-floaty"
          style={{
            position: "absolute",
            top: -140,
            left: -120,
            width: 440,
            height: 440,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(139,92,246,.20),transparent 70%)",
            filter: "blur(28px)",
            animationDuration: "17s",
          }}
        />
        <div
          className="animate-floaty"
          style={{
            position: "absolute",
            bottom: -160,
            right: -100,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(34,216,245,.13),transparent 70%)",
            filter: "blur(30px)",
            animationDuration: "21s",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1240,
          margin: "0 auto",
          padding: "clamp(72px,10vw,140px) 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))",
          gap: "clamp(36px,5vw,68px)",
          alignItems: "start",
        }}
      >
        <Reveal>
          <LiveDots style={{ marginBottom: 24 }} />
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Eyebrow>/ About the org</Eyebrow>
          </div>
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              fontSize: "clamp(26px,3.3vw,42px)",
              maxWidth: "15ch",
            }}
          >
            {heading}
          </h2>

          <div
            style={{
              position: "relative",
              overflow: "hidden",
              marginTop: 34,
              borderRadius: 20,
              padding: 30,
              background: "linear-gradient(150deg,var(--purple),var(--purple2))",
              color: "#fff",
              boxShadow: "0 24px 54px -26px var(--purple)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "repeating-linear-gradient(45deg, rgba(255,255,255,.07) 0 7px, transparent 7px 14px)",
                mixBlendMode: "overlay",
              }}
            />
            <div style={{ position: "relative" }}>
              <div style={{ fontWeight: 800, fontSize: "clamp(40px,6vw,58px)", lineHeight: 1 }}>5,000+</div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  marginTop: 9,
                  color: "rgba(255,255,255,.85)",
                }}
              >
                community members &amp; counting
              </div>
              <div style={{ display: "flex", gap: 22, marginTop: 24, flexWrap: "wrap" }}>
                <MiniStat value={String(established)} label="Established" />
                <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,.25)" }} />
                <MiniStat value="Nonprofit" label="SEC · BIR · LGU" />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal style={{ display: "flex", flexDirection: "column" }}>
          {paragraphs.map((text, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 20,
                alignItems: "start",
                padding: "22px 0",
                borderTop: "1px solid var(--line)",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--cyan)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: "var(--fg2)" }}>{text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 22 }}>{value}</div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: ".06em",
          color: "rgba(255,255,255,.8)",
          textTransform: "uppercase",
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}
