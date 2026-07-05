"use client";

import { useEffect, useRef } from "react";

import { MARK_TILES } from "./logomark";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* The hero logomark: 20 tiles that "pop" in with a staggered scale, then
   replay on a loop. Faithful reimplementation of startLogoPop() from the
   prototype (docs/new-website-design/Bicol IT.dc.html). */
export function AnimatedLogomark() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const tiles = Array.from(svg.querySelectorAll<SVGPathElement>("[data-tile]"));
    if (!tiles.length) return;

    if (prefersReducedMotion()) {
      tiles.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const play = () => {
      tiles.forEach((el) => {
        el.style.animation = "none";
        el.style.opacity = "";
        el.style.transform = "";
      });
      void svg.getBoundingClientRect().width; // force reflow
      tiles.forEach((el) => {
        el.style.animation = "tPop .55s cubic-bezier(.2,.8,.2,1) both";
        el.style.animationDelay = `${Math.random() * 0.65}s`;
      });
    };

    const start = window.setTimeout(play, 200);
    const loop = window.setInterval(() => {
      if (document.visibilityState === "visible") play();
    }, 4600);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(loop);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 79.45 39.43"
      aria-hidden="true"
      style={{
        width: "100%",
        height: "auto",
        overflow: "visible",
        filter: "drop-shadow(0 26px 64px rgba(139,92,246,.38))",
      }}
    >
      <defs>
        <linearGradient id="heroMarkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--purple)" />
          <stop offset="1" stopColor="var(--cyan)" />
        </linearGradient>
      </defs>
      <g fill="url(#heroMarkGrad)">
        {MARK_TILES.map((d, i) => (
          <path
            key={i}
            data-tile
            d={d}
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
          />
        ))}
      </g>
    </svg>
  );
}
