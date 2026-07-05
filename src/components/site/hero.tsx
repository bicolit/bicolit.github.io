"use client";

import type { CSSProperties } from "react";

import { AnimatedLogomark } from "./animated-logomark";
import { HeroCanvas } from "./hero-canvas";
import { Counter, RotatingWord, Terminal } from "./hero-widgets";

const gradientBtn = "linear-gradient(120deg,var(--purple),var(--purple2))";

const PILL_PRESETS: { top: string; right: string; anim: string }[] = [
  { top: "14%", right: "9%", anim: "floaty 6s ease-in-out infinite" },
  { top: "27%", right: "24%", anim: "drift 9s ease-in-out .4s infinite" },
  { top: "19%", right: "38%", anim: "drift2 8s ease-in-out .8s infinite" },
  { top: "35%", right: "13%", anim: "floaty 7s ease-in-out 1.2s infinite" },
  { top: "9%", right: "29%", anim: "drift 10s ease-in-out .6s infinite" },
  { top: "44%", right: "34%", anim: "drift2 9s ease-in-out .3s infinite" },
  { top: "47%", right: "9%", anim: "floaty 8s ease-in-out .9s infinite" },
  { top: "24%", right: "44%", anim: "drift 11s ease-in-out 1.4s infinite" },
];

const pillBase: CSSProperties = {
  position: "absolute",
  padding: "6px 13px",
  borderRadius: 999,
  border: "1px solid var(--line2)",
  background: "color-mix(in srgb, var(--bg) 42%, transparent)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  letterSpacing: ".05em",
  color: "var(--fg2)",
  boxShadow: "0 10px 26px -16px rgba(0,0,0,.7)",
};

export function Hero({
  heroWords,
  description,
  tagPills,
  terminalLines,
  membershipUrl,
  established,
}: {
  heroWords: string[];
  description: string;
  tagPills: string[];
  terminalLines: string[];
  membershipUrl: string;
  established: number;
}) {
  return (
    <section
      id="home"
      className="relative flex flex-col justify-center overflow-hidden lg:block"
      style={{
        minHeight: "min(92vh,860px)",
        background: "linear-gradient(150deg,var(--hero-a),var(--hero-b))",
      }}
    >
      <HeroCanvas />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 90% at 8% 50%, color-mix(in srgb, var(--hero-a) 82%, transparent) 0%, transparent 62%)",
        }}
      />

      {/* Logomark — stacked on mobile, absolute on desktop */}
      <div
        className="pointer-events-none z-[1] mx-auto mt-11 mb-8 w-[min(300px,62vw)] lg:absolute lg:right-[4%] lg:top-1/2 lg:my-0 lg:w-[min(540px,42vw)] lg:-translate-y-1/2"
      >
        <AnimatedLogomark />
      </div>

      {/* Drifting keyword pills — desktop only */}
      <div className="pointer-events-none absolute inset-0 z-[2] hidden lg:block" aria-hidden="true">
        {tagPills.slice(0, PILL_PRESETS.length).map((label, i) => (
          <span
            key={label}
            style={{ ...pillBase, top: PILL_PRESETS[i].top, right: PILL_PRESETS[i].right, animation: PILL_PRESETS[i].anim }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Live console — desktop only */}
      <div
        className="animate-floaty absolute right-[5%] bottom-[8%] z-[2] hidden lg:block"
        style={{
          width: "min(372px,33vw)",
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid var(--line2)",
          background: "color-mix(in srgb, var(--bg) 60%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 34px 74px -32px rgba(0,0,0,.72)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 14px",
            borderBottom: "1px solid var(--line)",
            background: "color-mix(in srgb, var(--bg) 44%, transparent)",
          }}
        >
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
          <span
            style={{
              marginLeft: 8,
              fontSize: 11,
              letterSpacing: ".1em",
              color: "var(--fg3)",
              textTransform: "uppercase",
            }}
          >
            bicol-it — zsh
          </span>
        </div>
        <Terminal lines={terminalLines} />
      </div>

      {/* Content */}
      <div
        className="relative z-[3] mx-auto w-full px-6 py-10 lg:py-20"
        style={{ maxWidth: 1240 }}
      >
        <div style={{ maxWidth: 760 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "7px 14px",
              borderRadius: 999,
              border: "1px solid var(--line2)",
              background: "color-mix(in srgb, var(--bg) 30%, transparent)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: ".14em",
              color: "var(--fg2)",
              marginBottom: 26,
            }}
          >
            <span
              className="animate-livedot"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--cyan)",
                boxShadow: "0 0 10px var(--cyan)",
                animationDuration: "2.4s",
              }}
            />
            BICOL&#8202;IT • EST. {established}
          </div>

          <h1
            style={{
              margin: 0,
              fontWeight: 800,
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              fontSize: "clamp(38px,6.2vw,82px)",
            }}
          >
            Innovating
            <br />
            Tomorrow,
            <br />
            <RotatingWord words={heroWords} />
          </h1>

          <p
            style={{
              margin: "28px 0 0",
              maxWidth: 540,
              fontSize: "clamp(16px,1.6vw,20px)",
              lineHeight: 1.6,
              color: "var(--fg2)",
            }}
          >
            {description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 36 }}>
            <a
              href={membershipUrl}
              target="_blank"
              rel="noopener"
              className="btn-lift"
              style={{
                padding: "15px 28px",
                borderRadius: 999,
                textDecoration: "none",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: ".02em",
                color: "#fff",
                background: gradientBtn,
                boxShadow: "0 14px 34px -14px var(--purple)",
              }}
            >
              Become a member
            </a>
            <a
              href="#events"
              className="btn-soft"
              style={{
                padding: "15px 28px",
                borderRadius: 999,
                textDecoration: "none",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: ".02em",
                color: "var(--fg)",
                border: "1px solid var(--line2)",
                background: "color-mix(in srgb, var(--bg) 24%, transparent)",
              }}
            >
              Explore BITCON 2024 →
            </a>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 40px", marginTop: 52 }}>
            <Stat>
              <Counter target={5000} suffix="+" sep />
              <StatLabel>Active members</StatLabel>
            </Stat>
            <Stat>
              <Counter target={established} />
              <StatLabel>Established</StatLabel>
            </Stat>
            <Stat>
              <Counter target={0} text="SEC" />
              <StatLabel>Registered nonprofit</StatLabel>
            </Stat>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function StatLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        letterSpacing: ".06em",
        color: "var(--fg3)",
        marginTop: 6,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}
