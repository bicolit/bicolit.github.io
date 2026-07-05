import { LiveDots, Eyebrow } from "./decor";
import { PlayIcon } from "./icons";
import { Reveal } from "./reveal";

export function Events({
  title,
  year,
  tagline,
  tracks,
}: {
  title: string;
  year: number;
  tagline: string;
  tracks: string[];
}) {
  return (
    <section
      id="events"
      style={{ position: "relative", background: "var(--deep)", color: "#F4EFFB", overflow: "hidden" }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
            WebkitMaskImage: "radial-gradient(130% 100% at 80% 12%,#000,transparent 72%)",
            maskImage: "radial-gradient(130% 100% at 80% 12%,#000,transparent 72%)",
          }}
        />
        <div
          className="animate-floaty"
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(139,92,246,.34),transparent 68%)",
            filter: "blur(36px)",
            animationDuration: "19s",
          }}
        />
        <div
          className="animate-floaty"
          style={{
            position: "absolute",
            bottom: -180,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(34,216,245,.16),transparent 70%)",
            filter: "blur(36px)",
            animationDuration: "23s",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "clamp(72px,9vw,130px) 24px" }}>
        <Reveal
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 28,
            marginBottom: 44,
          }}
        >
          <div>
            <LiveDots variant="onDeep" style={{ marginBottom: 20 }} />
            <div style={{ marginBottom: 16 }}>
              <Eyebrow>/ Flagship event</Eyebrow>
            </div>
            <h2 style={{ margin: 0, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.86, fontSize: "clamp(56px,11vw,126px)" }}>
              {title}
              <br />
              {year}
            </h2>
          </div>
          <div style={{ maxWidth: 420 }}>
            <p style={{ margin: "0 0 20px", fontSize: 16.5, lineHeight: 1.6, color: "#C8BAE4" }}>{tagline}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {tracks.map((track) => (
                <span
                  key={track}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,.2)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: ".04em",
                    color: "#D9CFEC",
                  }}
                >
                  {track}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal
          style={{
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,.14)",
            aspectRatio: "16 / 8",
            background:
              "repeating-linear-gradient(135deg, rgba(255,255,255,.04) 0 14px, rgba(255,255,255,.015) 14px 28px)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="animate-floaty"
              style={{
                width: 76,
                height: 76,
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "linear-gradient(120deg,var(--purple),var(--cyan))",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 14px 40px -12px var(--purple)",
                animationDuration: "4s",
                color: "#fff",
              }}
            >
              <PlayIcon />
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: ".14em",
                color: "#B6A6D6",
                textTransform: "uppercase",
              }}
            >
              [ {title} {year} recap ]
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
