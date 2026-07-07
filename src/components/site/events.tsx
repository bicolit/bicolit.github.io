import { LiveDots, Eyebrow } from "./decor";
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
            background: "#000",
          }}
        >
          <video
            controls
            preload="none"
            playsInline
            poster="/videos/bitcon-2024-poster.webp"
            aria-label={`${title} ${year} recap video`}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src="/videos/bitcon-2024-recap.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Reveal>
      </div>
    </section>
  );
}
