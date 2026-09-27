"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SERVICES } from "../lib/services";

const N = SERVICES.length;
const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * (3 - 2 * t);

function Visual({ v }) {
  return (
    <div className="mt-4 card-inset p-3.5 sm:mt-5 sm:p-4">
      <div className="mb-3 flex items-center justify-between text-[10px] tracking-[0.2em] text-muted uppercase">
        <span>{v.title}</span>
        {v.tag && <span className="text-brand">● {v.tag}</span>}
      </div>

      {v.type === "rows" && (
        <ul className="divide-y divide-foreground/[0.06]">
          {v.rows.map((r) => (
            <li key={r[0]} className="flex items-center justify-between gap-4 py-2 text-xs">
              <span className="text-foreground/80">{r[0]}</span>
              <span className="font-mono text-foreground">
                {r[1]} {r[2] && <span className="text-brand">{r[2]}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      {v.type === "bars" && (
        <ul className="space-y-3">
          {v.rows.map((r) => (
            <li key={r[0]} className="text-xs">
              <div className="mb-1 flex justify-between">
                <span className="text-foreground/80">{r[0]}</span>
                <span className="font-mono text-muted">{r[2]}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-foreground/[0.06]">
                <div className="bar h-full bg-gradient-to-r from-logo-blue to-brand" style={{ "--w": `${r[1]}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {v.type === "chart" && (
        <svg viewBox="0 0 300 100" className="h-24 w-full">
          <defs>
            <linearGradient id="svc-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5b93c7" stopOpacity="0.35" />
              <stop offset="1" stopColor="#5b93c7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 80 C30 74 45 60 70 64 S110 44 140 48 S180 34 210 38 S260 18 300 10 V100 H0Z" fill="url(#svc-area)" />
          <path className="trace-now" pathLength="1" d="M0 80 C30 74 45 60 70 64 S110 44 140 48 S180 34 210 38 S260 18 300 10" fill="none" stroke="#8cb4e1" strokeWidth="1.5" />
          <circle cx="300" cy="10" r="3.5" fill="#b99a5f" />
        </svg>
      )}

      {v.type === "tiles" && (
        <div className="grid grid-cols-2 gap-2">
          {v.tiles.map((t) => (
            <div key={t[0]} className="rounded-lg border border-card-line bg-card p-3">
              <p className="text-[10px] tracking-[0.14em] text-muted uppercase">{t[0]}</p>
              <p className="mt-1 font-mono text-lg">{t[1]}</p>
              <p className="font-mono text-[11px] text-brand">{t[2]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ServicesDrum() {
  const section = useRef(null);
  const items = useRef({ d: [], m: [] });
  const rail = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const el = section.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let disp = 0;

    const loop = () => {
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = clamp(-rect.top / range);
      // Dwell on each service: ease within each step so the dial "locks".
      const raw = p * (N - 1);
      const base = Math.floor(raw);
      const target = base + smooth(clamp((raw - base) * 1.15 - 0.075) / 1) ;
      disp = reduce ? target : disp + (target - disp) * 0.1;

      const place = (list, step, reach) =>
        list.forEach((node, i) => {
          if (!node) return;
          const d = i - disp;
          const ad = Math.abs(d);
          const sc = 1 - Math.min(ad, 3) * 0.08;
          node.style.transform = `translate3d(0, calc(-50% + ${d * step}px), 0) scale(${sc})`;
          node.style.opacity = ad > reach ? 0 : Math.max(0.1, 1 - ad * 0.42);
          node.style.pointerEvents = ad > reach ? "none" : "auto";
        });
      place(items.current.d, 84, 2.5);
      place(items.current.m, 54, 1.6);
      if (rail.current) rail.current.style.transform = `scaleY(${(disp / (N - 1)).toFixed(4)})`;

      const idx = Math.round(disp);
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const jump = (i) => {
    const el = section.current;
    const range = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (i / (N - 1)) * range, behavior: "smooth" });
  };

  const s = SERVICES[active];

  return (
    <section id="services" ref={section} className="relative h-[620vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_20%_55%,rgba(47,77,134,0.4),transparent)]"
        />

        <div className="relative mx-auto grid h-full max-w-7xl grid-rows-[auto_9.5rem_1fr] gap-4 px-5 pt-20 pb-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-1 lg:gap-16 lg:px-10 lg:py-0">
          {/* Left: header + drum */}
          <div className="relative flex flex-col lg:py-28">
            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="flex items-center gap-3 text-[11px] tracking-[0.22em] text-brand uppercase sm:gap-4 sm:text-xs sm:tracking-[0.28em]">
                  <span className="h-px w-10 bg-brand" />
                  What we do
                </p>
                {/* Mobile: compact link here, the rows below are height-budgeted */}
                <Link
                  href="/services"
                  className="rounded-full border border-foreground/15 px-3.5 py-1.5 text-[12px] tracking-wide text-foreground/85 transition-colors duration-300 hover:border-brand/60 hover:text-brand lg:hidden"
                >
                  All services →
                </Link>
              </div>
              <h2 className="font-display text-[clamp(1.5rem,3.2vw,2.5rem)] leading-tight tracking-tight text-foreground/90">
                Nine services. One accountable team.
              </h2>
              <Link
                href="/services"
                className="group mt-6 hidden items-center gap-3 rounded-full border border-foreground/15 px-6 py-2.5 text-[13px] tracking-wide text-foreground/85 transition-colors duration-300 hover:border-brand/60 hover:text-brand lg:inline-flex"
              >
                Explore all services
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="relative mt-4 hidden flex-1 lg:block">
              <DrumItems items={items} kind="d" active={active} jump={jump} />
            </div>

            <p className="mt-auto hidden items-center gap-4 font-mono text-xs text-muted lg:flex">
              <span className="relative block h-16 w-px bg-foreground/10">
                <span ref={rail} className="absolute inset-0 origin-top bg-brand" style={{ transform: "scaleY(0)" }} />
              </span>
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </p>
          </div>

          {/* Mobile drum (own row so it never overlaps the document) */}
          <div className="relative lg:hidden">
            <DrumItems items={items} kind="m" active={active} jump={jump} mobile />
          </div>

          {/* Right: the "client file" */}
          <div className="min-h-0 lg:flex lg:items-center">
            <div
              key={active}
              className="doc-in w-full overflow-hidden card p-4 sm:p-6"
            >
              <div className="flex items-center justify-between text-[10px] tracking-[0.2em] text-muted uppercase">
                <span>Client file · {String(active + 1).padStart(2, "0")}</span>
                <span>Illustrative</span>
              </div>
              <h3 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{s.desc}</p>
              <Visual v={s.visual} />
              <ul className="mt-5 hidden space-y-2 text-sm text-foreground/80 md:block">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 sm:mt-5">
                <a href="#contact" className="group inline-flex items-center gap-3 text-sm text-brand">
                  Discuss {s.name}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
                <Link
                  href={`/services#${s.slug}`}
                  className="text-sm text-foreground/60 underline-offset-4 transition-colors duration-300 hover:text-foreground hover:underline"
                >
                  Full details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Items are positioned imperatively each frame (desktop and mobile lists separately).
function DrumItems({ items, kind, active, jump, mobile }) {
  return (
    <div className="absolute inset-0">
      {SERVICES.map((s, i) => (
        <button
          key={s.name}
          type="button"
          ref={(node) => {
            items.current[kind][i] = node;
          }}
          onClick={() => jump(i)}
          aria-current={active === i}
          className="absolute top-1/2 left-0 flex origin-left items-baseline gap-4 text-left will-change-transform"
         
        >
          <span className={`font-mono text-xs ${active === i ? "text-brand" : "text-muted"}`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span
            className={`font-display leading-none tracking-tight transition-colors duration-500 ${
              mobile ? "text-3xl" : "text-[clamp(2.25rem,4.4vw,4rem)]"
            } ${active === i ? "text-foreground" : "text-foreground/60"}`}
          >
            {s.name}
          </span>
        </button>
      ))}
    </div>
  );
}
