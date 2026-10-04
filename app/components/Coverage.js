"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LONDON, MAP_VIEWBOX, REGION_LABELS, REGION_PATHS } from "../lib/ukMap";

const ease = [0.22, 1, 0.36, 1];

// Where the practice works. Confirm the notes with the firm before launch.
const REGIONS = [
  { id: "england", name: "England", note: "Head office in London. In person and online.", base: true },
  { id: "scotland", name: "Scotland", note: "Online, with visits by arrangement." },
  { id: "wales", name: "Wales", note: "Online, with visits by arrangement." },
  { id: "northern-ireland", name: "Northern Ireland", note: "Online, with visits by arrangement." },
];

const [, , MAP_W, MAP_H] = MAP_VIEWBOX.split(" ").map(Number);
// Extra room on the right for the London callout, which sits past the coast.
const VIEW_W = MAP_W + 150;

// A shallow arc from London out to a point in each other nation: the work
// reaches them from the one office, rather than implying offices there.
const REACH = {
  scotland: [390, 420],
  "northern-ireland": [240, 660],
  wales: [410, 880],
};
function arc([x, y]) {
  const dx = x - LONDON.x;
  const dy = y - LONDON.y;
  const mx = (LONDON.x + x) / 2 + dy * 0.18;
  const my = (LONDON.y + y) / 2 - dx * 0.18;
  return `M${LONDON.x} ${LONDON.y} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x} ${y}`;
}

function regionFill(id, active) {
  if (id === "ireland") return "fill-navy/[0.07]";
  if (id === "england") return active === id ? "fill-royal-soft" : "fill-royal";
  return active === id ? "fill-royal-soft" : "fill-navy";
}

export default function Coverage() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(null);

  const inView = (delay, from = { opacity: 0 }) => ({
    initial: reduce ? false : from,
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: "-15%" },
    transition: { duration: 0.9, ease, delay },
  });

  return (
    <section id="coverage" aria-labelledby="coverage-title" className="relative scroll-mt-20 bg-paper text-ink">
      <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="flex items-center justify-between border-t border-navy/10 pt-5 font-mono text-[10px] tracking-[0.2em] text-navy/50 uppercase">
          <span>06 — Coverage</span>
          <span className="hidden sm:inline">London · UK-wide</span>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          {/* Copy and the list of nations */}
          <div className="lg:col-span-5">
            <h2
              id="coverage-title"
              className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-[-0.015em]"
            >
              Based in London.
              <br />
              <em className="text-royal">Working across the UK.</em>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-navy/75">
              Our office is in London, and most of our work happens online, so
              where your business is registered matters far less than how it runs.
            </p>

            <ul className="mt-10 border-t border-navy/10">
              {REGIONS.map((r, i) => (
                <motion.li
                  key={r.id}
                  {...inView(0.1 + i * 0.08, { opacity: 0, y: 14 })}
                  onMouseEnter={() => setActive(r.id)}
                  onMouseLeave={() => setActive(null)}
                  className="group grid grid-cols-[1.5rem_1fr] items-baseline border-b border-navy/10 py-5 sm:grid-cols-[1.5rem_11rem_1fr] sm:gap-4"
                >
                  <span
                    aria-hidden
                    className={`h-2 w-2 translate-y-[-1px] rounded-full transition-colors duration-500 ${
                      r.base ? "bg-royal" : active === r.id ? "bg-royal-soft" : "bg-navy"
                    }`}
                  />
                  <h3 className="font-display text-2xl tracking-tight transition-colors duration-500 group-hover:text-royal">
                    {r.name}
                  </h3>
                  <p className="col-start-2 mt-1 text-sm leading-relaxed text-navy/70 sm:col-start-3 sm:mt-0">
                    {r.note}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* The map: flat navy nations, England picked out in royal */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-panel bg-sky px-4 py-8 sm:px-10 sm:py-12">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_70%,color-mix(in_srgb,var(--royal)_8%,transparent),transparent)]"
              />
              <svg
                viewBox={`0 0 ${VIEW_W} ${MAP_H}`}
                role="img"
                aria-labelledby="coverage-map-title"
                className="relative mx-auto block h-auto max-h-[72svh] w-full"
              >
                <title id="coverage-map-title">
                  Map of the United Kingdom. England is highlighted, with a pin marking the head office in London.
                </title>

                {/* Range rings from London, visible only over the sea */}
                <g aria-hidden className="fill-none stroke-navy/[0.09]" strokeWidth={1.5} strokeDasharray="2 8">
                  {[170, 340, 510, 680].map((r) => (
                    <circle key={r} cx={LONDON.x} cy={LONDON.y} r={r} />
                  ))}
                </g>

                {Object.entries(REGION_PATHS).map(([id, d], i) => (
                  <motion.path
                    key={id}
                    d={d}
                    {...inView(i * 0.08)}
                    onMouseEnter={id === "ireland" ? undefined : () => setActive(id)}
                    onMouseLeave={id === "ireland" ? undefined : () => setActive(null)}
                    className={`stroke-sky transition-colors duration-500 ${regionFill(id, active)}`}
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                ))}

                {Object.entries(REGION_LABELS).map(([id, [x, y]]) => (
                  <text
                    key={id}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    className="pointer-events-none fill-paper/70 font-mono text-[13px] tracking-[0.18em] uppercase"
                  >
                    {/* One word per line, so "Northern Ireland" fits its shape */}
                    {REGIONS.find((r) => r.id === id)
                      ?.name.split(" ")
                      .map((w, i, all) => (
                        <tspan key={w} x={x} dy={i === 0 ? `${-(all.length - 1) * 0.6}em` : "1.2em"}>
                          {w}
                        </tspan>
                      ))}
                  </text>
                ))}

                {/* Reach: dashed arcs drawing out from London */}
                <g aria-hidden>
                  {Object.entries(REACH).map(([id, to], i) => (
                    <g key={id}>
                      <motion.path
                        d={arc(to)}
                        className={`fill-none transition-colors duration-500 ${active === id ? "stroke-paper" : "stroke-paper/55"}`}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeDasharray="1 7"
                        initial={reduce ? false : { opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-15%" }}
                        transition={{ duration: 1.2, ease, delay: 1 + i * 0.2 }}
                      />
                      <motion.circle
                        cx={to[0]}
                        cy={to[1]}
                        r={4.5}
                        className="fill-paper"
                        {...inView(2 + i * 0.2)}
                      />
                    </g>
                  ))}
                </g>

                {/* London: pulse, pin and callout */}
                <g transform={`translate(${LONDON.x} ${LONDON.y})`}>
                  {!reduce && (
                    <motion.circle
                      r={10}
                      className="fill-none stroke-paper"
                      strokeWidth={2}
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ scale: [1, 4], opacity: [0.8, 0] }}
                      transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity, delay: 1.2 }}
                    />
                  )}
                  <circle r={6} className="fill-paper" />

                  <motion.g {...inView(0.6, { opacity: 0, y: -40 })}>
                    <path
                      d="M0 -4c-7-10-17-18-17-30a17 17 0 1 1 34 0c0 12-10 20-17 30z"
                      className="fill-paper stroke-ink"
                      strokeWidth={2.5}
                    />
                    <circle cy={-34} r={7} className="fill-royal" />
                  </motion.g>

                  <motion.g {...inView(0.9, { opacity: 0 })}>
                    {/* Leader line out past the Essex coast, so the label sits on sea */}
                    <line x1={22} y1={-34} x2={118} y2={-34} className="stroke-ink/40" strokeWidth={1.5} />
                    <text x={126} y={-38} className="fill-ink font-display text-[30px]">
                      London
                    </text>
                    <text x={126} y={-14} className="fill-navy/60 font-mono text-[12px] tracking-[0.18em] uppercase">
                      Head office
                    </text>
                  </motion.g>
                </g>
              </svg>

              <p className="relative mt-4 flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-navy/50 uppercase">
                <span className="h-px w-6 bg-royal/50" />
                Fig. 03 — Where we work
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
