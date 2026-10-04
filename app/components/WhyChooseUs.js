"use client";

import { motion, useReducedMotion } from "framer-motion";
import CountUp from "./CountUp";
import LineIcon from "./LineIcons";
import { SERVICES } from "../lib/services";

const ease = [0.22, 1, 0.36, 1];

// Commitments the site already makes elsewhere (contact copy, approach
// principles, services list), so every counter is backed by existing claims
// rather than invented tenure or client numbers. Confirm with the firm.
const figures = [
  { to: 1, label: "Working day", body: "Maximum wait for a reply to any enquiry." },
  { to: 1, label: "Named accountant", body: "One person who knows your business, start to finish." },
  { to: SERVICES.length, label: "Practice areas", body: "Accounts to advisory, handled by one team." },
  { to: 100, suffix: "%", label: "Human-reviewed", body: "Every return checked by a qualified accountant." },
];

const reasons = [
  { icon: "target", title: "Business-first advice", body: "We read your numbers against your goals, not just the compliance checklist." },
  { icon: "precision", title: "Precision in reporting", body: "Clean, reconciled books and reports you can act on without a translator." },
  { icon: "proactive", title: "Proactive, not reactive", body: "Risks, reliefs and deadlines flagged before they become problems." },
  { icon: "fees", title: "Fixed, transparent fees", body: "Agreed up front, in writing. No surprise invoices at year end." },
  { icon: "cloud", title: "Modern, cloud-based finance", body: "Live figures in Xero, QuickBooks or Sage, never a year out of date." },
  { icon: "shield", title: "Discreet by default", body: "Your affairs stay yours. Confidentiality is built into how we work." },
];

// Value and label read as one unit: the figure, then its label directly
// beneath, then the supporting line. Single-digit commitments are set
// statically; counting 0 → 1 adds motion without meaning.
function Figure({ f, i }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease, delay: i * 0.1 }}
      className="relative border-white/10 py-9 max-lg:odd:pr-6 max-lg:even:border-l max-lg:even:pl-6 max-lg:[&:nth-child(-n+2)]:border-b lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0"
    >
      {/* Rule that draws across as the figure lands */}
      <motion.span
        aria-hidden
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.8, ease, delay: 0.2 + i * 0.12 }}
        className={`absolute top-[-1px] h-px w-10 origin-left bg-glint ${i === 0 ? "left-0" : i === 2 ? "left-0 lg:left-8" : "left-6 lg:left-8"}`}
      />
      <p className="font-display text-[clamp(3rem,5.5vw,4.75rem)] leading-[0.9] tracking-[-0.02em] whitespace-nowrap text-white">
        {f.to > 10 ? <CountUp to={f.to} suffix={f.suffix} delay={0.2 + i * 0.12} duration={2.2} /> : `${f.to}${f.suffix ?? ""}`}
      </p>
      <p className="mt-3 font-mono text-[11px] tracking-[0.18em] text-glint uppercase">{f.label}</p>
      <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-white/65">{f.body}</p>
    </motion.li>
  );
}

export default function WhyChooseUs() {
  const reduce = useReducedMotion();

  return (
    <section id="why-us" aria-labelledby="why-title" className="relative scroll-mt-20 bg-paper text-ink">
      {/* Navy band: the one deep-colour moment between bright sections, inset
          from the page edges as a rounded panel */}
      <div className="relative mx-3 overflow-hidden rounded-panel bg-[linear-gradient(165deg,var(--navy)_0%,var(--ink)_70%)] text-white">
        <div aria-hidden className="pointer-events-none absolute -top-1/4 right-[-10%] h-[90%] w-[60%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--royal)_50%,transparent),transparent)]" />
        <div aria-hidden className="pointer-events-none absolute bottom-[-30%] left-[-10%] h-[70%] w-[50%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--royal-soft)_18%,transparent),transparent)]" />

        <div className="relative mx-auto max-w-[88rem] px-5 pt-12 pb-4 sm:px-8 lg:px-12 lg:pt-16 lg:pb-8">
          <div className="flex items-center justify-between border-t border-white/15 pt-5 font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
            <span>03 — Why choose us</span>
            <span className="hidden sm:inline">Our value, your advantage</span>
          </div>

          <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:items-end lg:gap-8">
            <h2
              id="why-title"
              className="font-display text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.98] tracking-[-0.02em] lg:col-span-8"
            >
              The rigour of a large firm.
              <br />
              <em className="text-glint">The attention of a small one.</em>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-white/70 lg:col-span-4">
              What you get is a small, consistent team with clear commitments,
              written down and kept.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-2 border-t border-white/10 lg:mt-14 lg:grid-cols-4">
            {figures.map((f, i) => (
              <Figure key={f.label} f={f} i={i} />
            ))}
          </ul>
        </div>
      </div>

      {/* Reasons: an even ledger of six, back on the bright page */}
      <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <p className="font-display text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05] tracking-tight lg:col-span-6">
            Six reasons clients stay with us.
          </p>
        </div>

        <ol className="mt-10 grid border-t border-navy/15 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <motion.li
              key={r.title}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
              className="group relative border-b border-navy/15 py-8 sm:odd:pr-8 sm:even:border-l sm:even:pl-8 lg:border-l lg:px-8 lg:[&:nth-child(3n+1)]:border-l-0 lg:[&:nth-child(3n+1)]:pl-0"
            >
              {/* Royal rule draws along the top on hover */}
              <span
                aria-hidden
                className="absolute top-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-royal transition-transform duration-700 group-hover:scale-x-100"
              />
              <div className="flex items-start justify-between">
                <LineIcon name={r.icon} className="h-12 w-12" />
                <span className="font-mono text-[11px] text-navy/40">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-6 font-display text-[1.6rem] leading-tight tracking-tight transition-colors duration-500 group-hover:text-royal">
                {r.title}
              </h3>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-navy/75">{r.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
