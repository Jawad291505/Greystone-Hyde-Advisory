"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const HEADLINE =
  "Accounting is never just numbers. It is invoices, expenses, tax, payroll and cash flow, all moving at once.";

// Figures are illustrative placeholders.
const fragments = [
  { label: "Invoices", meta: "INV-2041 · £3,420" },
  { label: "Expenses", meta: "48 receipts" },
  { label: "VAT", meta: "Return due" },
  { label: "Payroll", meta: "12 employees" },
  { label: "Cash flow", meta: "+ £12.4k net" },
  { label: "Reporting", meta: "Monthly pack" },
  { label: "Tax", meta: "Provision set" },
  { label: "Documents", meta: "126 files" },
];

// One word, revealed by a moving window over the shared, spring-smoothed
// scroll progress — a soft sweep left-to-right rather than a hard cutoff.
function Word({ progress, index, total, children }) {
  const start = (index / total) * 0.6;
  const opacity = useTransform(progress, [start, start + 0.16], [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}{" "}
    </motion.span>
  );
}

// A card settling into the grid — fade, rise and scale only. No rotation or
// scatter: the "coming together" idea now reads as one clean cascade.
function Fragment({ progress, index, total, label, meta }) {
  const start = 0.42 + (index / total) * 0.32;
  const end = start + 0.22;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [28, 0]);
  const scale = useTransform(progress, [start, end], [0.95, 1]);
  const dot = useTransform(progress, [start, end], [0.25, 1]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="border border-line bg-surface/70 px-4 py-3.5 backdrop-blur-sm sm:px-5 sm:py-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <motion.span
          style={{ opacity: dot }}
          className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_10px_var(--brand)]"
        />
      </div>
      <p className="mt-1.5 font-mono text-[11px] text-muted">{meta}</p>
    </motion.div>
  );
}

export default function ClarityIntro() {
  const section = useRef(null);
  const words = HEADLINE.split(" ");

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.6,
  });

  const kickerOpacity = useTransform(progress, [0, 0.12], [0.3, 1]);
  const glowOpacity = useTransform(progress, [0.35, 0.75], [0.35, 1]);
  const captionOpacity = useTransform(progress, [0.82, 1], [0, 1]);
  const captionY = useTransform(progress, [0.82, 1], [12, 0]);
  const trail1 = useTransform(progress, [0, 1], [0, -140]);
  const trail2 = useTransform(progress, [0, 1], [0, -60]);
  const trail3 = useTransform(progress, [0, 1], [0, -220]);
  const trail4 = useTransform(progress, [0, 1], [0, -100]);

  return (
    <section id="clarity" ref={section} className="relative h-[220vh]">
      {/* Depth layers: drift at different speeds against the static page */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
        <motion.span style={{ y: trail1 }} className="trail-line left-[12%]" />
        <motion.span style={{ y: trail2 }} className="trail-line left-[38%]" />
        <motion.span style={{ y: trail3 }} className="trail-line left-[71%]" />
        <motion.span style={{ y: trail4 }} className="trail-line left-[90%]" />
      </div>

      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div
          aria-hidden
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(49,106,162,0.22),transparent)]"
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-10">
          <motion.p
            style={{ opacity: kickerOpacity }}
            className="mb-6 flex items-center gap-3 text-[11px] tracking-[0.22em] text-brand uppercase sm:gap-4 sm:text-xs sm:tracking-[0.28em]"
          >
            <span className="h-px w-10 bg-brand" />
            From complexity to clarity
          </motion.p>

          <h2 className="max-w-4xl font-display text-[clamp(1.75rem,5.4vw,3.75rem)] leading-[1.12] tracking-tight">
            {words.map((w, i) => (
              <Word key={i} progress={progress} index={i} total={words.length}>
                {w}
              </Word>
            ))}
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-2.5 sm:mt-14 sm:gap-3 lg:grid-cols-4">
            {fragments.map((f, i) => (
              <Fragment
                key={f.label}
                progress={progress}
                index={i}
                total={fragments.length}
                label={f.label}
                meta={f.meta}
              />
            ))}
          </div>

          <motion.p
            style={{ opacity: captionOpacity, y: captionY }}
            className="mt-8 text-sm text-muted sm:mt-10"
          >
            Every fragment, accounted for. This is what we bring to your
            business.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
