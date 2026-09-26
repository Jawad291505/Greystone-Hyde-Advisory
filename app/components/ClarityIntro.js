"use client";

import { useEffect, useRef } from "react";

const HEADLINE =
  "Accounting is never just numbers. It is invoices, expenses, tax, payroll and cash flow, all moving at once.";

// Scattered "fragments" that settle into an ordered grid as you scroll.
// Figures are illustrative placeholders.
const fragments = [
  { label: "Invoices", meta: "INV-2041 · £3,420", x: -260, y: -110, r: -12 },
  { label: "Expenses", meta: "48 receipts", x: 180, y: -160, r: 9 },
  { label: "VAT", meta: "Return due", x: -90, y: 140, r: 14 },
  { label: "Payroll", meta: "12 employees", x: 300, y: 90, r: -8 },
  { label: "Cash flow", meta: "+ £12.4k net", x: -320, y: 60, r: 7 },
  { label: "Reporting", meta: "Monthly pack", x: 120, y: 190, r: -15 },
  { label: "Tax", meta: "Provision set", x: -40, y: -200, r: 11 },
  { label: "Documents", meta: "126 files", x: 260, y: -40, r: -10 },
];

const clamp = (v) => Math.min(1, Math.max(0, v));

export default function ClarityIntro() {
  const section = useRef(null);
  const words = HEADLINE.split(" ");

  useEffect(() => {
    const el = section.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const set = (p, t, c) => {
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--t", t.toFixed(4));
      el.style.setProperty("--c", c.toFixed(4));
    };
    if (reduce) {
      set(1, 1, 1);
      return;
    }

    let raf;
    let smooth = -1;
    const loop = () => {
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const raw = clamp(-rect.top / range);
      smooth = smooth < 0 ? raw : smooth + (raw - smooth) * 0.12;
      set(smooth, clamp(smooth / 0.5), clamp((smooth - 0.4) / 0.5));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="clarity"
      ref={section}
      className="clarity relative h-[260vh]"
      style={{ "--p": 0, "--t": 0, "--c": 0 }}
    >
      {/* Depth layers: drift at different speeds against the static page */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
        <span className="trail left-[12%]" style={{ "--s": -140 }} />
        <span className="trail left-[38%]" style={{ "--s": -60 }} />
        <span className="trail left-[71%]" style={{ "--s": -220 }} />
        <span className="trail left-[90%]" style={{ "--s": -100 }} />
      </div>

      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(49,106,162,0.22),transparent)]"
          style={{ opacity: "calc(0.35 + var(--c) * 0.65)" }}
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-10">
          <p
            className="mb-6 flex items-center gap-3 text-[11px] tracking-[0.22em] text-brand uppercase sm:gap-4 sm:text-xs sm:tracking-[0.28em]"
            style={{ opacity: "calc(0.3 + var(--t) * 0.7)" }}
          >
            <span className="h-px w-10 bg-brand" />
            From complexity to clarity
          </p>

          <h2 className="max-w-4xl font-display text-[clamp(1.75rem,5.4vw,3.75rem)] leading-[1.12] tracking-tight">
            {words.map((w, i) => (
              <span
                key={i}
                className="word"
                style={{ "--w": (i / words.length).toFixed(3) }}
              >
                {w}{" "}
              </span>
            ))}
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-2.5 sm:mt-14 sm:gap-3 lg:grid-cols-4">
            {fragments.map((f) => (
              <div
                key={f.label}
                className="fragment border bg-surface/70 px-4 py-3.5 backdrop-blur-sm sm:px-5 sm:py-4"
                style={{ "--x": f.x, "--y": f.y, "--r": f.r }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{f.label}</span>
                  <span className="dot h-1.5 w-1.5 rounded-full" />
                </div>
                <p className="mt-1.5 font-mono text-[11px] text-muted">{f.meta}</p>
              </div>
            ))}
          </div>

          <p
            className="mt-8 text-sm text-muted sm:mt-10"
            style={{
              opacity: "clamp(0, calc((var(--c) - 0.6) * 2.5), 1)",
              transform: "translateY(calc((1 - var(--c)) * 12px))",
            }}
          >
            Every fragment, accounted for. This is what we bring to your
            business.
          </p>
        </div>
      </div>
    </section>
  );
}
