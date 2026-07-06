"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export type HeroGameMode = "ambient" | "playing" | "dead";

/* Imperative handle for on-screen (mobile) controls — lets the d-pad steer the
   snake without synthesising keyboard events. */
export type HeroSnakeControl = { setDir: (d: number[]) => void };

/* The living hero background: a pulsing rounded-square grid with a cursor
   glow and a small "box-eating" snake that glides over the tiles. Faithful
   reimplementation of startGrid() from docs/new-website-design/Bicol IT.dc.html.

   Clicking the ambient snake starts a playable mini snake game: the hero text
   fades, the floating keyword pills (tagged [data-hero-pill]) become edible,
   food dots spawn, and the snake dies on the play-area edges. All game input is
   an opt-in enhancement — the idle path is unchanged and the whole thing is
   skipped under prefers-reduced-motion, keeping SSR markup crawlable. */
export function HeroCanvas({
  onModeChange,
  onScoreChange,
  onEatPill,
  onEatLogo,
  controlRef,
}: {
  onModeChange?: (mode: HeroGameMode) => void;
  onScoreChange?: (score: number) => void;
  onEatPill?: (index: number) => void;
  onEatLogo?: (index: number) => void;
  controlRef?: { current: HeroSnakeControl | null };
} = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme === "light" ? "light" : "dark");

  // Latest callbacks kept in a ref — the engine effect binds once ([]).
  const cbRef = useRef({ onModeChange, onScoreChange, onEatPill, onEatLogo });
  useEffect(() => {
    cbRef.current = { onModeChange, onScoreChange, onEatPill, onEatLogo };
  });

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

    // --- shared snake state ---
    const eaten = new Map<string, number>();
    const RESPAWN = 1500;
    const dirs4 = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const snake = { cells: [] as number[][], dir: [1, 0], stepAcc: 0, stepMs: 95, len: 8 };

    // --- game state ---
    let mode: HeroGameMode = "ambient";
    let score = 0;
    let food: number[] | null = null;
    let pills: { cell: number[]; index: number }[] = [];
    const eatenPillIdx = new Set<number>();
    let desiredDir = [1, 0];
    // Logomark eaten tile-by-tile: each of the 20 tiles is its own grid-aligned
    // target rect. Snake clears them one at a time.
    let logoTiles: { c0: number; r0: number; c1: number; r1: number; index: number }[] = [];
    const eatenLogoIdx = new Set<number>();

    // --- sound (WebAudio, synthesised; ctx created lazily on first gesture) ---
    type WindowAudio = Window & { webkitAudioContext?: typeof AudioContext };
    let audioCtx: AudioContext | null = null;
    const ensureAudio = () => {
      const AC = window.AudioContext || (window as WindowAudio).webkitAudioContext;
      if (!AC) return null;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === "suspended") void audioCtx.resume();
      return audioCtx;
    };
    // Short percussive envelope on one oscillator.
    const blip = (freq: number, dur = 0.08, type: OscillatorType = "square", vol = 0.05, delay = 0) => {
      const ac = ensureAudio();
      if (!ac) return;
      const t0 = ac.currentTime + delay;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain).connect(ac.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    };
    const sfx = {
      move: () => blip(200, 0.045, "square", 0.03),
      eat: () => blip(620, 0.09, "triangle", 0.05),
      eatBig: () => {
        blip(660, 0.08, "triangle", 0.055);
        blip(990, 0.1, "triangle", 0.05, 0.06);
      },
      start: () => {
        blip(392, 0.09, "triangle", 0.045);
        blip(523, 0.1, "triangle", 0.045, 0.09);
        blip(659, 0.13, "triangle", 0.045, 0.19);
      },
      over: () => {
        blip(330, 0.12, "sawtooth", 0.045);
        blip(247, 0.14, "sawtooth", 0.045, 0.11);
        blip(165, 0.26, "sawtooth", 0.045, 0.24);
      },
      // Short combo blip per logo tile — pitch climbs as more are cleared.
      eatTile: (n = 0) => blip(520 + Math.min(n, 12) * 30, 0.06, "triangle", 0.045),
      // Triumphant rising arpeggio when the final tile clears the whole mark.
      eatLogo: () => {
        blip(523, 0.1, "triangle", 0.05);
        blip(659, 0.1, "triangle", 0.05, 0.08);
        blip(784, 0.1, "triangle", 0.05, 0.16);
        blip(1047, 0.2, "triangle", 0.055, 0.24);
      },
    };
    // Buffer a new heading; chirp only when it actually changes (no spam on held keys).
    const applySteer = (d: number[]) => {
      if (mode !== "playing") return;
      if (d[0] !== desiredDir[0] || d[1] !== desiredDir[1]) sfx.move();
      desiredDir = d;
    };

    const initSnake = () => {
      const c = 1 + Math.floor(Math.random() * Math.max(1, cols - 2));
      const r = 1 + Math.floor(Math.random() * Math.max(1, rows - 2));
      snake.dir = dirs4[Math.floor(Math.random() * 4)].slice();
      snake.cells = [[c, r]];
      snake.stepAcc = 0;
    };

    // Autonomous wander used in ambient mode (original behaviour).
    const stepAmbient = (now: number) => {
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

    const emptyCell = () => {
      const occ = new Set(snake.cells.map((c) => c[0] + "," + c[1]));
      pills.forEach((p) => occ.add(p.cell[0] + "," + p.cell[1]));
      for (let tries = 0; tries < 80; tries++) {
        const c = 1 + Math.floor(Math.random() * Math.max(1, cols - 2));
        const r = 1 + Math.floor(Math.random() * Math.max(1, rows - 2));
        if (!occ.has(c + "," + r)) return [c, r];
      }
      return [1, 1];
    };
    const spawnFood = () => {
      food = emptyCell();
    };

    // Map the live pill DOM rects into grid cells so the snake can eat them.
    const snapshotPills = () => {
      pills = [];
      const rect = canvas.getBoundingClientRect();
      const els = document.querySelectorAll<HTMLElement>("[data-hero-pill]");
      els.forEach((el) => {
        const idx = Number(el.dataset.heroPill);
        if (eatenPillIdx.has(idx)) return;
        const b = el.getBoundingClientRect();
        const cx = b.left + b.width / 2 - rect.left;
        const cy = b.top + b.height / 2 - rect.top;
        const c = Math.floor(cx / cell);
        const r = Math.floor(cy / cell);
        if (c >= 0 && c < cols && r >= 0 && r < rows) pills.push({ cell: [c, r], index: idx });
      });
    };

    // Map each live logo tile's rect into a grid-aligned target rect. The tiles
    // are frozen (no pop animation) while playing, so these boxes stay stable.
    const snapshotLogoTiles = () => {
      logoTiles = [];
      const host = document.querySelector<HTMLElement>("[data-hero-logo]");
      if (!host) return;
      const rect = canvas.getBoundingClientRect();
      host.querySelectorAll<SVGGraphicsElement>("[data-tile]").forEach((el) => {
        const idx = Number(el.dataset.tile);
        if (Number.isNaN(idx) || eatenLogoIdx.has(idx)) return;
        const b = el.getBoundingClientRect();
        if (!b.width || !b.height) return;
        const c0 = Math.floor((b.left - rect.left) / cell);
        const r0 = Math.floor((b.top - rect.top) / cell);
        const c1 = Math.floor((b.right - rect.left) / cell);
        const r1 = Math.floor((b.bottom - rect.top) / cell);
        if (c1 < 0 || r1 < 0 || c0 >= cols || r0 >= rows) return; // off-canvas
        logoTiles.push({
          c0: Math.max(0, c0),
          r0: Math.max(0, r0),
          c1: Math.min(cols - 1, c1),
          r1: Math.min(rows - 1, r1),
          index: idx,
        });
      });
    };

    const startGame = () => {
      if (!cols || !rows) return;
      mode = "playing";
      score = 0;
      eatenPillIdx.clear();
      const c = Math.floor(cols / 2),
        r = Math.floor(rows / 2);
      snake.len = 6;
      snake.dir = [1, 0];
      desiredDir = [1, 0];
      snake.cells = [
        [c - 1, r],
        [c, r],
      ];
      snake.stepAcc = 0;
      eatenLogoIdx.clear();
      spawnFood();
      snapshotPills();
      snapshotLogoTiles();
      cbRef.current.onScoreChange?.(0);
      cbRef.current.onModeChange?.("playing");
      sfx.start();
      // Re-snapshot after React has frozen the logo tiles (animation → none).
      // Two frames so the freeze effect (a post-paint passive effect) has run,
      // giving target boxes that match the tiles at rest, not mid-pop.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (mode === "playing") snapshotLogoTiles();
        }),
      );
    };

    const die = () => {
      mode = "dead";
      sfx.over();
      cbRef.current.onModeChange?.("dead");
    };

    const exitGame = () => {
      mode = "ambient";
      food = null;
      pills = [];
      snake.len = 8;
      initSnake();
      cbRef.current.onModeChange?.("ambient");
    };

    const stepPlay = (now: number) => {
      if (!cols || !rows || !snake.cells.length) return;
      const head = snake.cells[snake.cells.length - 1];

      // Apply buffered direction, blocking a 180° reversal into the neck.
      if (!(desiredDir[0] === -snake.dir[0] && desiredDir[1] === -snake.dir[1])) {
        snake.dir = desiredDir.slice();
      }

      const nx = head[0] + snake.dir[0],
        ny = head[1] + snake.dir[1];

      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) {
        die();
        return;
      }
      for (let i = 1; i < snake.cells.length; i++) {
        if (snake.cells[i][0] === nx && snake.cells[i][1] === ny) {
          die();
          return;
        }
      }

      snake.cells.push([nx, ny]);
      eaten.set(nx + "," + ny, now);

      if (food && food[0] === nx && food[1] === ny) {
        snake.len += 1;
        score += 10;
        cbRef.current.onScoreChange?.(score);
        sfx.eat();
        spawnFood();
      }
      for (let i = 0; i < pills.length; i++) {
        if (pills[i].cell[0] === nx && pills[i].cell[1] === ny) {
          snake.len += 2;
          score += 25;
          eatenPillIdx.add(pills[i].index);
          cbRef.current.onScoreChange?.(score);
          cbRef.current.onEatPill?.(pills[i].index);
          sfx.eatBig();
          pills.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < logoTiles.length; i++) {
        const lt = logoTiles[i];
        if (nx >= lt.c0 && nx <= lt.c1 && ny >= lt.r0 && ny <= lt.r1) {
          eatenLogoIdx.add(lt.index);
          snake.len += 1;
          score += 15;
          cbRef.current.onScoreChange?.(score);
          cbRef.current.onEatLogo?.(lt.index);
          logoTiles.splice(i, 1);
          if (logoTiles.length === 0) sfx.eatLogo(); // whole mark cleared
          else sfx.eatTile(eatenLogoIdx.size);
          break;
        }
      }

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
      if (mode === "ambient") {
        const h = snake.cells[snake.cells.length - 1];
        if (!snake.cells.length || !h || h[0] >= cols || h[1] >= rows) initSnake();
      } else if (mode === "playing") {
        snapshotPills();
        snapshotLogoTiles();
      }
    };
    resize();
    requestAnimationFrame(resize);
    // ResizeObserver on capable browsers; fall back to window resize on old
    // ones so the effect never throws (draw loop also self-corrects on rect change).
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(resize);
      ro.observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }

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

    const onClick = (e: MouseEvent) => {
      if (reduce) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left,
        y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      if (mode === "playing") return;
      // Ignore clicks on real controls (links, buttons, the d-pad) so they keep
      // working; any other click on the hero background starts / retries.
      const target = e.target as HTMLElement | null;
      if (target?.closest("a,button,input,textarea,select,[role='button']")) return;
      startGame();
    };
    window.addEventListener("click", onClick);

    const KEYMAP: Record<string, number[]> = {
      ArrowUp: [0, -1],
      KeyW: [0, -1],
      ArrowDown: [0, 1],
      KeyS: [0, 1],
      ArrowLeft: [-1, 0],
      KeyA: [-1, 0],
      ArrowRight: [1, 0],
      KeyD: [1, 0],
    };
    const onKey = (e: KeyboardEvent) => {
      if (reduce) return;
      if (mode !== "playing") {
        if (mode === "dead" && (e.code === "Space" || e.code === "Enter")) {
          e.preventDefault();
          startGame();
        }
        return;
      }
      if (e.code === "Escape") {
        exitGame();
        return;
      }
      const d = KEYMAP[e.code];
      if (d) {
        e.preventDefault();
        applySteer(d);
      }
    };
    window.addEventListener("keydown", onKey);

    // Expose an imperative steer for the on-screen mobile d-pad.
    if (controlRef) {
      controlRef.current = {
        setDir: (d: number[]) => applySteer(d),
      };
    }

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
      if (!reduce && mode !== "dead") {
        snake.stepAcc += dt;
        let guard = 0;
        while (snake.stepAcc >= snake.stepMs && guard++ < 4) {
          snake.stepAcc -= snake.stepMs;
          if (mode === "playing") stepPlay(now);
          else stepAmbient(now);
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

      // Game markers — food dot + pill targets — drawn beneath the snake.
      if (mode === "playing") {
        const foodCol = theme === "light" ? "rgb(0,144,196)" : "rgb(34,216,245)";
        if (food) {
          const fx = food[0] * cell + cell / 2,
            fy = food[1] * cell + cell / 2;
          const pulse = (Math.sin(t * 4) + 1) / 2;
          const rad = cell * 0.22 * (0.8 + 0.3 * pulse);
          ctx.globalAlpha = 0.95;
          ctx.fillStyle = foodCol;
          ctx.shadowColor = foodCol;
          ctx.shadowBlur = cell * 0.8;
          ctx.beginPath();
          ctx.arc(fx, fy, rad, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        const pillCol = theme === "light" ? "rgb(102,51,204)" : "rgb(139,92,246)";
        ctx.strokeStyle = pillCol;
        ctx.lineWidth = 2;
        for (const pl of pills) {
          const px2 = pl.cell[0] * cell + cell / 2,
            py2 = pl.cell[1] * cell + cell / 2;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(px2, py2, cell * 0.4, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Pulsing dashed frame around the still-uneaten logo tiles (union box)
        // so the mark reads as edible; it shrinks as tiles get cleared.
        if (logoTiles.length) {
          let c0 = Infinity,
            r0 = Infinity,
            c1 = -Infinity,
            r1 = -Infinity;
          for (const lt of logoTiles) {
            if (lt.c0 < c0) c0 = lt.c0;
            if (lt.r0 < r0) r0 = lt.r0;
            if (lt.c1 > c1) c1 = lt.c1;
            if (lt.r1 > r1) r1 = lt.r1;
          }
          const lx = c0 * cell,
            ly = r0 * cell;
          const lw = (c1 - c0 + 1) * cell,
            lh = (r1 - r0 + 1) * cell;
          const lp = (Math.sin(t * 3) + 1) / 2;
          ctx.globalAlpha = 0.22 + 0.28 * lp;
          ctx.strokeStyle = pillCol;
          ctx.lineWidth = 2;
          ctx.setLineDash([7, 7]);
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(lx + 3, ly + 3, lw - 6, lh - 6, 12);
          else ctx.rect(lx + 3, ly + 3, lw - 6, lh - 6);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      if (!reduce && snake.cells.length) {
        const frac = mode === "dead" ? 1 : snake.stepAcc / snake.stepMs;
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
      ro?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      if (controlRef) controlRef.current = null;
      audioCtx?.close();
    };
  }, [controlRef]);

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
