"use client";

import { motion } from "framer-motion";

// Draft copy — replace with the firm's real values.
const values = [
  {
    name: "Integrity",
    body: "We give the honest answer, even when it isn't the convenient one. Your trust is the whole business.",
  },
  {
    name: "Precision",
    body: "Every figure checked, every deadline met. Small errors in finance are never small.",
  },
  {
    name: "Clarity",
    body: "Plain English over jargon. If you can't act on our advice, we haven't finished giving it.",
  },
  {
    name: "Partnership",
    body: "We measure our success by yours, and stay close enough to see what's coming.",
  },
  {
    name: "Discretion",
    body: "Your affairs stay yours. Confidentiality is built into how we work, not bolted on.",
  },
];

const ease = [0.22, 1, 0.36, 1];

export default function OurValues() {
  return (
    <section id="values" className="relative scroll-mt-20 border-t border-line bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(closest-side,rgba(49,106,162,0.14),transparent)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="mb-6 flex items-center gap-4 text-[11px] tracking-[0.28em] text-brand uppercase sm:text-xs">
              <span className="h-px w-10 bg-brand" />
              Our values
            </p>
            <h2 className="font-display text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.08] tracking-tight">
              The principles behind every number.
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
              Five commitments that shape how we advise, how we report and
              how we treat the businesses that rely on us.
            </p>
          </div>

          <ol className="space-y-3 sm:space-y-4">
            {values.map((v, i) => (
              <motion.li
                key={v.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease }}
                className="group grid grid-cols-[2.5rem_1fr] gap-4 card p-6 transition-colors duration-300 hover:border-brand/40 sm:grid-cols-[3.5rem_1fr] sm:p-8"
              >
                <span className="pt-2 font-mono text-xs text-muted transition-colors duration-300 group-hover:text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="md:grid md:grid-cols-[1fr_1.3fr] md:items-baseline md:gap-10">
                  <h3 className="font-display text-3xl tracking-tight transition-colors duration-300 group-hover:text-brand sm:text-4xl">
                    {v.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted md:mt-0">{v.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
