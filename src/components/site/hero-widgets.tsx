"use client";

import { useEffect, useRef, useState } from "react";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* Rotating gradient headline word — cycles settings.heroWords. */
export function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const list = words.length ? words : ["Today."];

  useEffect(() => {
    if (list.length < 2 || prefersReduced()) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % list.length), 2200);
    return () => window.clearInterval(id);
  }, [list.length]);

  return (
    <span
      style={{
        display: "inline-block",
        height: "1.3em",
        lineHeight: "1.3em",
        overflow: "hidden",
        verticalAlign: "bottom",
      }}
    >
      <span
        key={i}
        style={{
          display: "block",
          height: "1.3em",
          lineHeight: "1.3em",
          background:
            i % 2 === 0
              ? "linear-gradient(105deg,var(--purple),var(--cyan))"
              : "linear-gradient(105deg,var(--cyan),var(--purple))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation: "wordIn .55s cubic-bezier(.2,.7,.2,1) both",
        }}
      >
        {list[i]}
      </span>
    </span>
  );
}

/* Typed zsh terminal widget. Types each line char-by-char, loops. */
function lineColor(text: string, index: number): string {
  if (text.startsWith("[ok]")) return "var(--term-ok)";
  if (text.startsWith(">")) return "var(--term-prompt)";
  if (index === 0) return "var(--term-head)";
  return "var(--fg2)";
}

export function Terminal({ lines }: { lines: string[] }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !lines.length) return;
    const timers: number[] = [];
    const T = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.push(id);
      return id;
    };

    const run = () => {
      host.innerHTML = "";
      const rows = lines.map((txt, i) => {
        const d = document.createElement("div");
        d.style.cssText = `white-space:pre-wrap; word-break:break-word; color:${lineColor(
          txt,
          i,
        )}; margin:0 0 3px; min-height:1.5em;`;
        host.appendChild(d);
        return { d, txt };
      });
      if (prefersReduced()) {
        rows.forEach((r) => (r.d.textContent = r.txt));
        return;
      }
      let li = 0,
        ci = 0;
      const step = () => {
        if (li >= rows.length) {
          const last = rows[rows.length - 1].d;
          last.insertAdjacentHTML(
            "beforeend",
            '<span style="display:inline-block; width:8px; height:1.05em; background:var(--term-prompt); margin-left:4px; vertical-align:-2px; animation:blink 1s steps(1) infinite;"></span>',
          );
          T(run, 3600);
          return;
        }
        const row = rows[li];
        if (ci <= row.txt.length) {
          row.d.textContent = row.txt.slice(0, ci);
          ci++;
          T(step, 20 + Math.random() * 32);
        } else {
          li++;
          ci = 0;
          T(step, 300);
        }
      };
      step();
    };
    run();

    return () => timers.forEach(clearTimeout);
  }, [lines]);

  return <div ref={hostRef} style={{ padding: "16px 16px 18px", fontSize: 12.5, lineHeight: 1.55, minHeight: 134 }} />;
}

/* Count-up statistic. Non-numeric values render as-is. */
export function Counter({
  target,
  suffix = "",
  sep = false,
  text,
}: {
  target: number;
  suffix?: string;
  sep?: boolean;
  text?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !target) return;
    if (prefersReduced()) {
      el.textContent = (sep ? target.toLocaleString("en-US") : String(target)) + suffix;
      return;
    }
    const dur = 1700;
    let raf = 0;
    let start = 0;
    const fmt = (v: number) =>
      (sep ? Math.round(v).toLocaleString("en-US") : String(Math.round(v))) + suffix;
    const tick = (now: number) => {
      if (!start) start = now;
      const k = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(target * e);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, suffix, sep]);

  return (
    <div
      ref={ref}
      style={{ fontWeight: 800, fontSize: "clamp(26px,3vw,38px)", lineHeight: 1 }}
    >
      {text ?? (target ? (sep ? target.toLocaleString("en-US") : String(target)) + suffix : "")}
    </div>
  );
}
