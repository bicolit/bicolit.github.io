"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { AnimatedLogomark } from "./animated-logomark";
import { HeroCanvas, type HeroGameMode, type HeroSnakeControl } from "./hero-canvas";
import { Counter, RotatingWord, Terminal } from "./hero-widgets";

const gradientBtn = "linear-gradient(120deg,var(--purple),var(--purple2))";

// Personal-best is kept client-side only (no account needed). localStorage may
// be unavailable (private mode, blocked cookies) — every access is guarded.
const HISCORE_KEY = "bit-snake-hiscore";

const readHiscore = (): number => {
  if (typeof window === "undefined") return 0;
  try {
    const v = Number(localStorage.getItem(HISCORE_KEY));
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch {
    return 0;
  }
};

// Drifting keyword pills. Each carries its animation plus a responsive
// position class set — phone (base) / tablet (sm) / desktop (lg) — ported
// from the design's applyResponsive() scatter maps so pills show on every
// breakpoint, not just desktop.
const PILLS: { anim: string; cls: string }[] = [
  { anim: "floaty 6s ease-in-out infinite", cls: "top-[5%] right-[8%] left-auto sm:top-[4%] sm:right-[6%] sm:left-auto lg:top-[14%] lg:right-[9%] lg:left-auto" },
  { anim: "drift 9s ease-in-out .4s infinite", cls: "top-[22%] right-[6%] left-auto sm:top-[30%] sm:right-[8%] sm:left-auto lg:top-[27%] lg:right-[24%] lg:left-auto" },
  { anim: "drift2 8s ease-in-out .8s infinite", cls: "top-[13%] right-[20%] left-auto sm:top-[14%] sm:left-[52%] sm:right-auto lg:top-[19%] lg:right-[38%] lg:left-auto" },
  { anim: "floaty 7s ease-in-out 1.2s infinite", cls: "top-[44%] right-[8%] left-auto sm:top-[46%] sm:left-[44%] sm:right-auto lg:top-[35%] lg:right-[13%] lg:left-auto" },
  { anim: "drift 10s ease-in-out .6s infinite", cls: "top-[5%] left-[6%] right-auto sm:top-[6%] sm:left-[5%] sm:right-auto lg:top-[9%] lg:right-[29%] lg:left-auto" },
  { anim: "drift2 9s ease-in-out .3s infinite", cls: "top-[62%] right-[15%] left-auto sm:top-[66%] sm:left-[48%] sm:right-auto lg:top-[44%] lg:right-[34%] lg:left-auto" },
  { anim: "floaty 8s ease-in-out .9s infinite", cls: "top-[33%] right-[22%] left-auto sm:top-[34%] sm:left-[60%] sm:right-auto lg:top-[47%] lg:right-[9%] lg:left-auto" },
  { anim: "drift 11s ease-in-out 1.4s infinite", cls: "top-[24%] left-[8%] right-auto sm:top-[24%] sm:left-[7%] sm:right-auto lg:top-[24%] lg:right-[44%] lg:left-auto" },
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
  // Mini snake game state — lifted here so the canvas (engine) can drive the
  // text fade + pill consumption that live in this component's DOM.
  const [mode, setMode] = useState<HeroGameMode>("ambient");
  const [score, setScore] = useState(0);
  // "GAME START" countdown value shown before play begins (3 → 2 → 1).
  const [count, setCount] = useState(3);
  // Lazy init reads the stored best on the client only. It's safe from hydration
  // mismatch because the best is never rendered until the game runs (the overlay
  // is hidden while ambient), which is always after the first paint.
  const [highScore, setHighScore] = useState(() => readHiscore());
  const [newBest, setNewBest] = useState(false);
  const [eatenPills, setEatenPills] = useState<Set<number>>(() => new Set());
  const [eatenLogoTiles, setEatenLogoTiles] = useState<Set<number>>(() => new Set());
  const playing = mode !== "ambient";
  const controlRef = useRef<HeroSnakeControl | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Refs mirror the latest score/best so the mode-change handler (fired by the
  // canvas engine) can compare them without stale closures or extra effects.
  const scoreRef = useRef(0);
  const highRef = useRef(highScore);
  useEffect(() => {
    highRef.current = highScore;
  }, [highScore]);

  // Drive the pre-game countdown. When the canvas flips to "starting" we show
  // 3 → 2 → 1 (one second each), then tell the engine to begin play. Any change
  // out of "starting" (or unmount) tears the timer down.
  useEffect(() => {
    if (mode !== "starting") return;
    let n = 3;
    controlRef.current?.tick(n); // pip for the "3" shown as the overlay opens
    const id = window.setInterval(() => {
      n -= 1;
      if (n <= 0) {
        window.clearInterval(id);
        controlRef.current?.start(); // start jingle plays inside the engine
      } else {
        setCount(n);
        controlRef.current?.tick(n); // pip in sync with "2" then "1"
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [mode]);

  // Full-screen mobile play. While the game runs (any non-ambient mode) on
  // phones/tablets the hero becomes a fixed, viewport-filling overlay (see
  // #home[data-playing] in globals.css). Lock page scroll here so nothing peeks
  // behind it and the board can't be scrolled out of thumb reach. Desktop
  // (keyboard play, normal in-page layout) is left untouched.
  useEffect(() => {
    if (!playing || typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 1023.98px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [playing]);

  const handleScore = useCallback((s: number) => {
    scoreRef.current = s;
    setScore(s);
  }, []);

  const handleMode = useCallback((m: HeroGameMode) => {
    setMode(m);
    if (m === "dead") {
      // Commit a new personal best if this run beat it.
      if (scoreRef.current > highRef.current) {
        highRef.current = scoreRef.current;
        setHighScore(scoreRef.current);
        setNewBest(true);
        try {
          localStorage.setItem(HISCORE_KEY, String(scoreRef.current));
        } catch {
          /* storage unavailable — best stays session-only */
        }
      }
    } else {
      scoreRef.current = 0;
      setScore(0);
      setNewBest(false);
      setEatenPills(new Set());
      setEatenLogoTiles(new Set());
      if (m === "starting") setCount(3);
    }
  }, []);
  const handleEatLogo = useCallback((i: number) => {
    setEatenLogoTiles((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  }, []);
  const handleEatPill = useCallback((i: number) => {
    setEatenPills((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      // Presence of this attr flips the hero to a full-screen overlay on mobile
      // while the game runs (styled in globals.css). Absent = normal layout.
      data-playing={playing || undefined}
      className="relative flex flex-col justify-center overflow-hidden pt-16 lg:block lg:pt-0"
      style={{
        background: "linear-gradient(150deg,var(--hero-a),var(--hero-b))",
      }}
    >
      <HeroCanvas
        onModeChange={handleMode}
        onScoreChange={handleScore}
        onEatPill={handleEatPill}
        onEatLogo={handleEatLogo}
        controlRef={controlRef}
      />
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

      {/* Drifting keyword pills + live console — both positioned inside a
          centered 1240 band so they stay within the container on wide screens
          instead of bleeding out to the viewport's right edge. */}
      <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
        <div className="relative mx-auto h-full w-full max-w-[1443px] px-6">
          {tagPills.slice(0, PILLS.length).map((label, i) => (
            <span
              key={label}
              data-hero-pill={i}
              className={PILLS[i].cls}
              style={{
                ...pillBase,
                // Freeze drift while playing so the snapshotted grid cell stays
                // aligned with what the player sees.
                animation: playing ? "none" : PILLS[i].anim,
                opacity: eatenPills.has(i) ? 0 : 1,
                transform: eatenPills.has(i) ? "scale(.4)" : undefined,
                transition: "opacity .35s ease, transform .35s ease",
              }}
            >
              {label}
            </span>
          ))}

          {/* Live console — desktop only, anchored to the band's right edge */}
          <div
            className="animate-floaty absolute right-6 bottom-[8%] hidden lg:block"
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
              opacity: playing ? 0 : 1,
              transition: "opacity .4s ease",
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
        </div>
      </div>

      {/* Logomark — own layer at z-[1] so the floating keyword pills (z-[2])
          drift in front of it. In-flow above the heading on mobile; absolute,
          right-anchored + vertically centered within the 1443 band on desktop. */}
      <div className="pointer-events-none relative z-[1] w-full lg:absolute lg:inset-0">
        <div className="mx-auto w-full max-w-[1443px] px-6 lg:flex lg:h-full lg:items-center">
          {/* `data-hero-logo` marks the host the snake engine scans for tiles.
              While playing, the logomark freezes so each tile is a stable,
              individually-edible target. */}
          <div
            data-hero-logo
            className="mx-auto mt-2 mb-9 w-[min(300px,62vw)] lg:mx-0 lg:my-0 lg:ml-auto lg:w-[min(540px,42vw)] lg:-translate-x-[20%] lg:-translate-y-[2%]"
          >
            <AnimatedLogomark playing={playing} eatenTiles={eatenLogoTiles} />
          </div>
        </div>
      </div>

      {/* Band — centered, capped on every breakpoint. Text (z-[3]) sits in the
          left half and stays in front of both the logo and the pills. Fades out
          while the snake game runs; kept mounted so crawlers still read it. */}
      <div
        className="relative z-[3] mx-auto flex w-full max-w-[1443px] flex-col px-6 py-10 lg:block lg:py-20"
        style={{
          opacity: playing ? 0 : 1,
          pointerEvents: playing ? "none" : "auto",
          transition: "opacity .4s ease",
        }}
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

      {/* Game overlay — hint / score / game-over. pointer-events:none so clicks
          fall through to the canvas's window listener (retry / start). */}
      <div className="pointer-events-none absolute inset-0 z-[4]" aria-hidden="true">
        {/* Touch exit — mobile only. The fullscreen game overlay covers the
            sticky header, so this is a phone player's only way back out (desktop
            uses Esc). Hidden on desktop where the header stays reachable. */}
        {playing && (
          <button
            type="button"
            onClick={() => controlRef.current?.exit()}
            aria-label="Exit game"
            className="lg:hidden"
            style={{
              position: "absolute",
              top: 14,
              left: 16,
              width: 40,
              height: 40,
              display: "grid",
              placeItems: "center",
              pointerEvents: "auto",
              borderRadius: 12,
              border: "1px solid var(--line2)",
              background: "color-mix(in srgb, var(--bg) 62%, transparent)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              color: "var(--fg)",
              fontSize: 18,
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        )}
        {mode === "ambient" && (
          <div
            style={{
              position: "absolute",
              bottom: 18,
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: ".08em",
              color: "var(--fg3)",
              opacity: 0.7,
            }}
          >
            ▸ click anywhere to play
          </div>
        )}
        {mode === "starting" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                padding: "26px 34px",
                borderRadius: 16,
                border: "1px solid var(--line2)",
                background: "color-mix(in srgb, var(--bg) 70%, transparent)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: "0 34px 74px -32px rgba(0,0,0,.72)",
                maxWidth: 300,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", letterSpacing: ".02em" }}>
                GAME START
              </div>
              <div
                key={count}
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  lineHeight: 1,
                  margin: "10px 0 8px",
                  color: "var(--cyan)",
                  animation: "wordIn .4s cubic-bezier(.2,.7,.2,1) both",
                }}
              >
                {count}
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.55, color: "var(--fg3)" }}>
                Steer with arrows / WASD. Eat the food, keyword pills &amp; logo tiles —
                avoid the walls and your own tail. Esc to exit.
              </div>
            </div>
          </div>
        )}
        {mode === "playing" && (
          <>
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 20,
                textAlign: "right",
                fontFamily: "var(--font-mono)",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>
                SCORE {score}
              </div>
              {highScore > 0 && (
                <div style={{ fontSize: 11, marginTop: 3, color: "var(--fg2)" }}>
                  BEST {highScore}
                </div>
              )}
              <div style={{ fontSize: 11, marginTop: 4, color: "var(--fg3)" }}>
                arrows / WASD · Esc to exit
              </div>
            </div>
            <DPad control={controlRef} />
          </>
        )}
        {mode === "dead" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                padding: "26px 34px",
                borderRadius: 16,
                border: "1px solid var(--line2)",
                background: "color-mix(in srgb, var(--bg) 70%, transparent)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: "0 34px 74px -32px rgba(0,0,0,.72)",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)" }}>GAME OVER</div>
              <div style={{ fontSize: 15, margin: "10px 0 4px", color: "var(--fg2)" }}>
                Score {score}
              </div>
              {newBest ? (
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    margin: "0 0 8px",
                    color: "var(--cyan)",
                    letterSpacing: ".04em",
                  }}
                >
                  ★ NEW BEST!
                </div>
              ) : (
                highScore > 0 && (
                  <div style={{ fontSize: 13, margin: "0 0 8px", color: "var(--fg3)" }}>
                    Best {highScore}
                  </div>
                )
              )}
              <div style={{ fontSize: 12, color: "var(--fg3)" }}>
                click or Space to retry · Esc to exit
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// On-screen direction pad for touch devices — hidden on desktop (keyboard).
// One connected cross: the four arms share edges with a central hub (no gaps),
// so the whole thing reads as a single pad and is easy to thumb on a phone.
function DPad({ control }: { control: React.RefObject<HeroSnakeControl | null> }) {
  const press = (d: number[]) => (e: React.PointerEvent) => {
    e.preventDefault();
    control.current?.setDir(d);
  };
  const arm: CSSProperties = {
    display: "grid",
    placeItems: "center",
    border: "1px solid var(--line2)",
    background: "color-mix(in srgb, var(--bg) 62%, transparent)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    color: "var(--fg)",
    fontSize: 22,
    lineHeight: 1,
    touchAction: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    WebkitTapHighlightColor: "color-mix(in srgb, var(--purple) 45%, transparent)",
  };
  return (
    <div
      // `grid` here (not inline) so the `lg:hidden` media query can override it —
      // an inline display would win over the class and leak the pad onto desktop.
      className="grid lg:hidden"
      style={{
        position: "absolute",
        bottom: 22,
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "auto",
        gridTemplateColumns: "repeat(3, 56px)",
        gridTemplateRows: "repeat(3, 56px)",
        gap: 0,
        filter: "drop-shadow(0 18px 30px rgba(0,0,0,.45))",
      }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Up"
        style={{ ...arm, gridColumn: 2, gridRow: 1, borderRadius: "14px 14px 0 0", borderBottom: "none" }}
        onPointerDown={press([0, -1])}
      >
        ↑
      </button>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Left"
        style={{ ...arm, gridColumn: 1, gridRow: 2, borderRadius: "14px 0 0 14px", borderRight: "none" }}
        onPointerDown={press([-1, 0])}
      >
        ←
      </button>
      <div style={{ ...arm, gridColumn: 2, gridRow: 2, borderRadius: 0, pointerEvents: "none" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--fg3)" }} />
      </div>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Right"
        style={{ ...arm, gridColumn: 3, gridRow: 2, borderRadius: "0 14px 14px 0", borderLeft: "none" }}
        onPointerDown={press([1, 0])}
      >
        →
      </button>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Down"
        style={{ ...arm, gridColumn: 2, gridRow: 3, borderRadius: "0 0 14px 14px", borderTop: "none" }}
        onPointerDown={press([0, 1])}
      >
        ↓
      </button>
    </div>
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
