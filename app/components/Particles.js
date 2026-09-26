"use client";

import { useEffect, useRef } from "react";

// One fixed, page-wide glow field. Particles sit on depth layers: near ones
// travel further with the scroll than far ones, and fast scrolling stretches
// them into short light trails. The photo never moves; only this layer does.
export default function Particles() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf;
    let ps = [];
    let target = window.scrollY;
    let cur = target;
    let prev = cur;

    const colors = ["91,147,199", "49,106,162", "150,190,232"];

    const build = () => {
      const count = w < 768 ? 34 : 70;
      ps = Array.from({ length: count }, () => {
        const z = Math.random() * 0.75 + 0.25; // depth: 0.25 far .. 1 near
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: z * 1.7 + 0.4,
          a: z * 0.55 + 0.15,
          vy: -(0.05 + Math.random() * 0.12) * z,
          vx: (Math.random() - 0.5) * 0.08,
          ph: Math.random() * Math.PI * 2,
          c: colors[Math.floor(Math.random() * colors.length)],
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    resize();

    const wrap = (v, m) => ((v % m) + m) % m;
    const onScroll = () => (target = window.scrollY);

    const draw = (t) => {
      cur += (target - cur) * 0.1;
      const vel = cur - prev;
      prev = cur;
      ctx.clearRect(0, 0, w, h);
      const span = h + 80;

      for (const p of ps) {
        if (!reduce) {
          p.y += p.vy;
          p.x += p.vx;
        }
        const y = wrap(p.y - cur * p.z * 0.55, span) - 40;
        const x = wrap(p.x, w + 20) - 10;
        const tw = 0.65 + 0.35 * Math.sin(t / 1700 + p.ph);
        const alpha = p.a * tw;

        const g = ctx.createRadialGradient(x, y, 0, x, y, p.r * 7);
        g.addColorStop(0, `rgba(${p.c},${alpha})`);
        g.addColorStop(1, `rgba(${p.c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, p.r * 7, 0, Math.PI * 2);
        ctx.fill();

        const trail = Math.min(Math.abs(vel) * p.z * 5, 90);
        if (trail > 6) {
          const dir = vel > 0 ? 1 : -1; // trail lags behind travel direction
          const y2 = y + dir * trail;
          const lg = ctx.createLinearGradient(x, y, x, y2);
          lg.addColorStop(0, `rgba(${p.c},${alpha * 0.9})`);
          lg.addColorStop(1, `rgba(${p.c},0)`);
          ctx.strokeStyle = lg;
          ctx.lineWidth = p.r * 0.7;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y2);
          ctx.stroke();
        }
      }
    };

    const loop = (t) => {
      if (!document.hidden) draw(t);
      raf = requestAnimationFrame(loop);
    };
    if (reduce) draw(0);
    else raf = requestAnimationFrame(loop);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] h-full w-full mix-blend-screen"
    />
  );
}
