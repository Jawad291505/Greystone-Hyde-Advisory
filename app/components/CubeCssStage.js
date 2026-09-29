"use client";

import { useEffect, useMemo, useRef } from "react";

// CSS 3D version of the cube: 27 pieces, each with six flat faces, all inside one
// preserve-3d space. Runs on the compositor, needs no WebGL, and cannot lose a context.
const LABELS = ["TAX", "VAT", "PAYROLL", "CASH FLOW", "EXPENSES", "INVOICES", "REPORTING"];
const FACES = ["front", "back", "right", "left", "top", "bottom"];

const clamp = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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

function buildPieces(spread = 1) {
  const rand = rng(7);
  const out = [];
  let idx = 0;
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        const outward = { right: x === 1, left: x === -1, top: y === 1, bottom: y === -1, front: z === 1, back: z === -1 };
        const a = rand() * Math.PI * 2;
        const b = Math.acos(2 * rand() - 1);
        const r = (3.2 + rand() * 2.6) * spread; // in units of one piece
        out.push({
          g: [x, y, z],
          top: y === 1,
          outward,
          scatter: [r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a) * 0.8, r * Math.cos(b) * 0.7],
          spin: [(rand() - 0.5) * 540, (rand() - 0.5) * 540, (rand() - 0.5) * 540],
          phase: rand() * Math.PI * 2,
          faces: FACES.map((f, i) => {
            const k = idx + i;
            return outward[f] ? { f, label: LABELS[k % LABELS.length], accent: k % 5 === 0 } : { f, inner: true };
          }),
        });
        idx++;
      }
  return out;
}

// offsetX: where the solved cube settles on wide screens, as a fraction of
// viewport width from centre (positive = right). spread scales the scatter.
export default function CubeCssStage({ progress, offsetX = 0.24, offsetYMobile = -0.14, spread = 1 }) {
  const scene = useRef(null);
  const group = useRef(null);
  const nodes = useRef([]);
  const pieces = useMemo(() => buildPieces(spread), [spread]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let u = 90;

    const size = () => {
      const w = window.innerWidth;
      u = w < 480 ? 58 : w < 768 ? 70 : w < 1280 ? 84 : 98;
      scene.current?.style.setProperty("--u", `${u}px`);
    };
    size();
    window.addEventListener("resize", size);

    const N = pieces.length;
    const loop = () => {
      const p = progress.current;
      const t = reduce ? 0 : performance.now() / 1000;
      const assemble = clamp(p / 0.55);
      const settle = ease(clamp((p - 0.15) / 0.8));
      const twist = (1 - ease(clamp((p - 0.55) / 0.3))) * (Math.PI / 2);
      const cos = Math.cos(twist);
      const sin = Math.sin(twist);
      const step = u * 1.02;

      pieces.forEach((c, i) => {
        const el = nodes.current[i];
        if (!el) return;
        const local = ease(clamp((assemble - (i / N) * 0.35) / 0.65));
        let [gx, gy, gz] = c.g;
        let ry = 0;
        if (c.top) {
          const nx = gx * cos + gz * sin;
          const nz = -gx * sin + gz * cos;
          gx = nx;
          gz = nz;
          ry = (twist * 180) / Math.PI;
        }
        const inv = 1 - local;
        // Idle drift: only while a piece is still scattered (fades out as
        // it locks into the solved cube via the `inv` factor), so loose
        // pieces feel weightless instead of frozen mid-air.
        const fx = Math.sin(t * 0.55 + c.phase) * 0.42 * u * inv;
        const fy = Math.cos(t * 0.4 + c.phase * 1.7) * 0.5 * u * inv;
        const fz = Math.sin(t * 0.33 + c.phase * 2.3) * 0.28 * u * inv;
        const frx = Math.sin(t * 0.3 + c.phase) * 6 * inv;
        const fry = Math.cos(t * 0.25 + c.phase * 1.4) * 6 * inv;

        const tx = c.scatter[0] * u + (gx * step - c.scatter[0] * u) * local + fx;
        const ty = c.scatter[1] * u + (-gy * step - c.scatter[1] * u) * local + fy;
        const tz = c.scatter[2] * u + (gz * step - c.scatter[2] * u) * local + fz;
        el.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,${tz.toFixed(1)}px) rotateX(${(c.spin[0] * inv + frx).toFixed(1)}deg) rotateY(${(c.spin[1] * inv + ry * local + fry).toFixed(1)}deg) rotateZ(${(c.spin[2] * inv).toFixed(1)}deg)`;
      });

      const g = group.current;
      if (g) {
        const wide = window.innerWidth >= 1024;
        // Only pull the group rightward as it settles into the solved cube —
        // applying the full offset throughout also drags the scatter phase's
        // pieces off the left side, collapsing the "all over the screen"
        // spread onto the right half.
        const x = wide ? window.innerWidth * offsetX * settle : 0;
        const y = wide ? 0 : window.innerHeight * offsetYMobile;
        const ry = 36 + inv(settle) * 200;
        const rx = -(24 - inv(settle) * 14);
        g.style.transform = `translate3d(${x.toFixed(0)}px,${y.toFixed(0)}px,0) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    const inv = (v) => 1 - v;
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, [pieces, progress, offsetX, offsetYMobile]);

  return (
    <div ref={scene} className="c3d-scene absolute inset-0" aria-hidden>
      <div ref={group} className="c3d-group">
        {pieces.map((c, i) => (
          <div
            key={i}
            ref={(el) => {
              nodes.current[i] = el;
            }}
            className="c3d-piece"
          >
            {c.faces.map((f, fi) => (
              <div key={f.f} className={`c3d-face c3d-${f.f}`}>
                <div
                  className={`c3d-face-surface ${f.inner ? "c3d-inner" : f.accent ? "c3d-accent" : "c3d-tile"}`}
                  style={{ "--gd": `${((i * 6 + fi) % 13) * 0.5}s` }}
                >
                  {f.label && <span>{f.label}</span>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
