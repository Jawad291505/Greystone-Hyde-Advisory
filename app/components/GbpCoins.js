"use client";

import { useEffect, useMemo, useRef } from "react";
import CoinFace from "./CoinFace";

// CSS 3D coins: flat SVG faces inside a perspective scene, driven by scroll
// progress (see GbpSection). No WebGL, no canvas — just transforms.
const COUNT = 6;

const clamp = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildCoins() {
  const rand = rng(11);
  const out = [];
  for (let i = 0; i < COUNT; i++) {
    const a = rand() * Math.PI * 2;
    const r = 2.4 + rand() * 1.6;
    out.push({
      // scattered entry position, in coin-diameter units from center
      sx: Math.cos(a) * r,
      sy: (rand() - 0.5) * 2.6 - 0.3,
      sz: (rand() - 0.5) * 560,
      // a gentle tilt, not a full tumble — a flat SVG face has no real
      // edge, so keeping rotation modest avoids it ever going edge-on
      sRotY: (rand() - 0.5) * 130,
      sRotZ: (rand() - 0.5) * 36,
      // resolved position: an ascending stair, bottom-left to top-right —
      // value, compounding upward
      fx: -1.7 + i * 0.74,
      fy: 0.9 - i * 0.4,
      fz: i * 16,
      fRotZ: -5 + i * 1.4,
      scale: 0.76 + i * 0.05,
      phase: rand() * Math.PI * 2,
      delay: i / COUNT,
    });
  }
  return out;
}

export default function GbpCoins({ progress }) {
  const scene = useRef(null);
  const nodes = useRef([]);
  const inners = useRef([]);
  const coins = useMemo(() => buildCoins(), []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;

    const size = () => {
      const w = window.innerWidth;
      const u = w < 480 ? 60 : w < 768 ? 74 : w < 1280 ? 92 : 112;
      scene.current?.style.setProperty("--u", `${u}px`);
    };
    size();
    window.addEventListener("resize", size);

    const loop = () => {
      const p = progress.current;
      const t = reduce ? 0 : performance.now() / 1000;
      const assemble = clamp(p / 0.62);
      const u = parseFloat(scene.current?.style.getPropertyValue("--u")) || 92;

      coins.forEach((c, i) => {
        const el = nodes.current[i];
        const inner = inners.current[i];
        if (!el || !inner) return;

        const local = ease(clamp((assemble - c.delay * 0.3) / 0.7));
        const arc = Math.sin(local * Math.PI) * 0.5 * u;
        const idle = reduce ? 0 : 1 - local;

        const driftX = Math.sin(t * 0.5 + c.phase) * 9 * idle;
        const driftY = Math.cos(t * 0.4 + c.phase * 1.6) * 11 * idle;
        const restWobble = reduce ? 0 : Math.sin(t * 0.32 + c.phase) * 4 * local;

        const x = lerp(c.sx * u, c.fx * u, local) + driftX;
        const y = lerp(c.sy * u, c.fy * u, local) - arc + driftY;
        const z = lerp(c.sz, c.fz, local);
        const rotZ = lerp(c.sRotZ, c.fRotZ, local);
        const rotY = lerp(c.sRotY, restWobble, local);
        const scale = lerp(0.6, c.scale, local);

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) scale(${scale.toFixed(3)}) rotateZ(${rotZ.toFixed(1)}deg)`;
        inner.style.transform = `rotateY(${rotY.toFixed(1)}deg)`;
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, [coins, progress]);

  return (
    <div ref={scene} className="gbp-scene absolute inset-0" aria-hidden style={{ "--u": "92px" }}>
      {coins.map((c, i) => (
        <div
          key={i}
          ref={(el) => {
            nodes.current[i] = el;
          }}
          className="gbp-coin"
          style={{ width: "var(--u)", height: "var(--u)", "--gd": `${(i % 6) * 1.1}s` }}
        >
          <div
            ref={(el) => {
              inners.current[i] = el;
            }}
            className="gbp-coin-inner"
          >
            <div className="gbp-face gbp-face-front">
              <CoinFace id={`f${i}`} />
            </div>
            <div className="gbp-face gbp-face-back">
              <CoinFace id={`b${i}`} plain />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
