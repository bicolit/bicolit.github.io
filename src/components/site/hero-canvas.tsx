"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

/* The living hero background: a pulsing rounded-square grid with a cursor
   glow and a small "box-eating" snake that glides over the tiles. Faithful
   reimplementation of startGrid() from docs/new-website-design/Bicol IT.dc.html.
   Snake + motion respect prefers-reduced-motion. */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme === "light" ? "light" : "dark");

  useEffect(() => {
    themeRef.current = resolvedTheme === "light" ? "light" : "dark";
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mouse = { x: -9999, y: -9999 };
    let W = 0,
      H = 0,
      dpr = 1,
      cell = 30,
      cols = 0,
      rows = 0;

    const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // --- box-eating snake ---
    const eaten = new Map<string, number>();
    const RESPAWN = 1500;
    const dirs4 = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const snake = { cells: [] as number[][], dir: [1, 0], stepAcc: 0, stepMs: 95, len: 8 };
    const initSnake = () => {
      const c = 1 + Math.floor(Math.random() * Math.max(1, cols - 2));
      const r = 1 + Math.floor(Math.random() * Math.max(1, rows - 2));
      snake.dir = dirs4[Math.floor(Math.random() * 4)].slice();
      snake.cells = [[c, r]];
      snake.stepAcc = 0;
    };
    const stepSnake = (now: number) => {
      if (!cols || !rows || !snake.cells.length) return;
      const head = snake.cells[snake.cells.length - 1];
      const [dx, dy] = snake.dir;
      let nx = head[0] + dx,
        ny = head[1] + dy;
      const inb = (x: number, y: number) => x >= 0 && x < cols && y >= 0 && y < rows;
      const left = [dy, -dx],
        right = [-dy, dx];
      const opts = [left, right].filter(([tx, ty]) => inb(head[0] + tx, head[1] + ty));
      if (!inb(nx, ny) || Math.random() < 0.14) {
        if (opts.length) {
          const t = opts[Math.floor(Math.random() * opts.length)];
          snake.dir = t;
          nx = head[0] + t[0];
          ny = head[1] + t[1];
        }
      }
      if (!inb(nx, ny)) {
        initSnake();
        return;
      }
      snake.cells.push([nx, ny]);
      eaten.set(nx + "," + ny, now);
      while (snake.cells.length > snake.len) snake.cells.shift();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = Math.max(20, Math.round(Math.min(W, H) / 20));
      cols = Math.ceil(W / cell) + 1;
      rows = Math.ceil(H / cell) + 1;
      const h = snake.cells[snake.cells.length - 1];
      if (!snake.cells.length || !h || h[0] >= cols || h[1] >= rows) initSnake();
    };
    resize();
    requestAnimationFrame(resize);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onOut = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onOut);

    const PAL = {
      dark: { a: [139, 92, 246], b: [34, 216, 245], baseA: 0.05, baseB: 0.16, faintMax: 0.42 },
      light: { a: [102, 51, 204], b: [0, 144, 196], baseA: 0.1, baseB: 0.2, faintMax: 0.42 },
    };
    const lerp = (u: number, v: number, f: number) => u + (v - u) * f;
    const rr = (x: number, y: number, w: number, rad: number) => {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, w, rad);
      else ctx.rect(x, y, w, w);
      ctx.fill();
    };

    let raf = 0;
    let lastTs = 0;
    const draw = (ts: number) => {
      if (document.hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const rect0 = canvas.getBoundingClientRect();
      if (rect0.width > 0 && Math.abs(canvas.width - Math.round(rect0.width * dpr)) > 1) resize();
      const t = ts * 0.001;
      const now = ts;
      const dt = lastTs ? Math.min(60, ts - lastTs) : 16;
      lastTs = ts;
      if (!reduce) {
        snake.stepAcc += dt;
        let guard = 0;
        while (snake.stepAcc >= snake.stepMs && guard++ < 4) {
          snake.stepAcc -= snake.stepMs;
          stepSnake(now);
        }
      }
      const theme = themeRef.current;
      const p = PAL[theme as "dark" | "light"] || PAL.dark;
      ctx.clearRect(0, 0, W, H);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wave = (Math.sin(t * 1.05 - (c * 0.34 + r * 0.26)) + 1) / 2;
          let inten = p.baseA + (p.baseB - p.baseA) * wave;
          const px = c * cell + cell / 2,
            py = r * cell + cell / 2;
          const md = Math.hypot(px - mouse.x, py - mouse.y);
          const R = cell * 4.2;
          if (md < R) inten += (1 - md / R) * 0.55;
          const k = c + "," + r;
          if (eaten.size && eaten.has(k)) {
            const age = now - (eaten.get(k) as number);
            if (age >= RESPAWN) eaten.delete(k);
            else inten *= age / RESPAWN;
          }
          if (inten <= 0.02) continue;
          if (inten > 1) inten = 1;
          const f = (Math.sin((c / cols) * Math.PI * 1.3 + t * 0.35) + 1) / 2;
          const cr = Math.round(lerp(p.a[0], p.b[0], f));
          const cg = Math.round(lerp(p.a[1], p.b[1], f));
          const cb = Math.round(lerp(p.a[2], p.b[2], f));
          const size = Math.max(2, (cell - 7) * (0.34 + 0.66 * inten));
          const off = (cell - size) / 2;
          ctx.globalAlpha = Math.min(inten, p.faintMax);
          ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
          rr(c * cell + off, r * cell + off, size, Math.max(1.5, size * 0.24));
        }
      }
      if (!reduce && snake.cells.length) {
        const frac = snake.stepAcc / snake.stepMs;
        const n = snake.cells.length;
        const col = theme === "light" ? p.a : p.b;
        for (let i = 0; i < n; i++) {
          const cur = snake.cells[i];
          const ahead = i < n - 1 ? snake.cells[i + 1] : [cur[0] + snake.dir[0], cur[1] + snake.dir[1]];
          const gx = (cur[0] + (ahead[0] - cur[0]) * frac) * cell;
          const gy = (cur[1] + (ahead[1] - cur[1]) * frac) * cell;
          const life = (i + 1) / n;
          const size = (cell - 6) * (0.52 + 0.48 * life);
          const off = (cell - size) / 2;
          ctx.globalAlpha = 0.28 + 0.62 * life;
          ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
          if (i === n - 1) {
            ctx.shadowColor = `rgb(${col[0]},${col[1]},${col[2]})`;
            ctx.shadowBlur = cell * 0.7;
          }
          rr(gx + off, gy + off, size, Math.max(2, size * 0.26));
          if (i === n - 1) ctx.shadowBlur = 0;
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
