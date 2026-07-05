import type { CSSProperties } from "react";

/* The little animated 4×2 tile cluster that sits above every section eyebrow.
   Ported from Bicol IT.dc.html. Two palettes: the default (on page bg) and
   `onDeep` (on the purple #330066 event/footer sections). */

const DEFAULT_COLORS = [
  "var(--purple)",
  "var(--cyan)",
  "color-mix(in srgb, var(--purple) 22%, transparent)",
  "var(--purple)",
  "color-mix(in srgb, var(--cyan) 22%, transparent)",
  "var(--purple)",
  "var(--cyan)",
  "var(--cyan)",
];

const DEEP_COLORS = [
  "var(--cyan)",
  "rgba(255,255,255,.16)",
  "var(--purple)",
  "var(--cyan)",
  "var(--purple)",
  "rgba(255,255,255,.16)",
  "var(--cyan)",
  "var(--purple)",
];

const DELAYS = ["0s", ".3s", ".6s", ".9s", ".2s", ".5s", ".8s", "1.1s"];

export function LiveDots({
  variant = "default",
  style,
}: {
  variant?: "default" | "onDeep";
  style?: CSSProperties;
}) {
  const colors = variant === "onDeep" ? DEEP_COLORS : DEFAULT_COLORS;
  return (
    <div
      aria-hidden="true"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,10px)",
        gap: "5px",
        width: "max-content",
        ...style,
      }}
    >
      {colors.map((c, i) => (
        <span
          key={i}
          className="animate-livedot"
          style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            background: c,
            animationDelay: DELAYS[i],
          }}
        />
      ))}
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        letterSpacing: ".18em",
        color: "var(--cyan)",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}
