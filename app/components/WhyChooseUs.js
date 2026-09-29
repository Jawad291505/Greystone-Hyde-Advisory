"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import CountUp from "./CountUp";
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
  { title: "Business-first advice", body: "We read your numbers against your goals, not just the compliance checklist." },
  { title: "Precision in reporting", body: "Clean, reconciled books and reports you can act on without a translator." },
  { title: "Proactive, not reactive", body: "Risks, reliefs and deadlines flagged before they become problems." },
  { title: "Fixed, transparent fees", body: "Agreed up front, in writing. No surprise invoices at year end." },
  { title: "Modern, cloud-based finance", body: "Live figures in Xero, QuickBooks or Sage, never a year out of date." },
  { title: "Discreet by default", body: "Your affairs stay yours. Confidentiality is built into how we work." },
];

function Figure({ f, i }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease, delay: i * 0.1 }}
      className="relative border-b border-white/10 py-10 sm:border-r sm:px-8 sm:even:border-r-0 lg:border-b-0 lg:first:pl-0 lg:even:border-r lg:last:border-r-0"
    >
      {/* Rule that draws across as the figure counts */}
      <motion.span
        aria-hidden
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.8, ease, delay: 0.2 + i * 0.12 }}
        className="absolute top-0 left-0 h-px w-full origin-left bg-[#8fb4ff] sm:left-8 sm:w-[calc(100%-4rem)] lg:first:left-0"
      />
      <p className="font-display text-[clamp(4rem,7vw,6.5rem)] leading-none tracking-[-0.03em] text-white">
        <CountUp to={f.to} suffix={f.suffix} delay={0.2 + i * 0.12} duration={f.to > 10 ? 2.2 : 1.2} />
      </p>
      <p className="mt-5 font-mono text-[10px] tracking-[0.2em] text-[#8fb4ff] uppercase">{f.label}</p>
      <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-white/65">{f.body}</p>
    </motion.li>
  );
}

export default function WhyChooseUs() {
  const photoRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-10%", "10%"]);

  return (
    <section id="why-us" aria-labelledby="why-title" className="relative scroll-mt-20 bg-paper text-ink">
      {/* Navy band: the one deep-colour moment between bright sections */}
      <div className="relative overflow-hidden bg-[linear-gradient(165deg,var(--navy)_0%,var(--ink)_70%)] text-white">
        <div aria-hidden className="pointer-events-none absolute -top-1/4 right-[-10%] h-[90%] w-[60%] bg-[radial-gradient(closest-side,rgba(36,82,181,0.5),transparent)]" />
        <div aria-hidden className="pointer-events-none absolute bottom-[-30%] left-[-10%] h-[70%] w-[50%] bg-[radial-gradient(closest-side,rgba(91,130,214,0.18),transparent)]" />

        <div className="relative mx-auto max-w-[88rem] px-5 pt-28 pb-16 sm:px-8 lg:px-12 lg:pt-36 lg:pb-24">
          <div className="flex items-center justify-between border-t border-white/15 pt-5 font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
            <span>04 — Why choose us</span>
            <span className="hidden sm:inline">Our value, your advantage</span>
          </div>

          <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:items-end lg:gap-8">
            <h2
              id="why-title"
              className="font-display text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.98] tracking-[-0.02em] lg:col-span-8"
            >
              The rigour of a large firm.
              <br />
              <em className="text-[#8fb4ff]">The attention of a small one.</em>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-white/70 lg:col-span-4">
              What you get is a small, consistent team with clear commitments,
              written down and kept.
            </p>
          </div>

          <ul className="mt-16 grid border-t border-white/10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
            {figures.map((f, i) => (
              <Figure key={f.label} f={f} i={i} />
            ))}
          </ul>
        </div>
      </div>

      {/* Reasons: editorial list beside a photograph, back on the bright page */}
      <div className="mx-auto grid max-w-[88rem] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-32">
        <div className="lg:col-span-5">
          <motion.div
            ref={photoRef}
            initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.4, ease }}
            className="relative aspect-[4/5] overflow-hidden bg-mist lg:sticky lg:top-28"
          >
            <motion.div style={{ y: photoY }} className="absolute inset-x-0 -inset-y-[12%]">
              <Image
                src="/images/team-discussion.jpg"
                alt="Two colleagues discussing a report on a laptop"
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight tracking-tight">
            Six reasons clients stay with us.
          </p>
          <ol className="mt-10 border-t border-navy/15">
            {reasons.map((r, i) => (
              <motion.li
                key={r.title}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.8, ease, delay: (i % 2) * 0.06 }}
                className="group relative grid grid-cols-[3rem_1fr] border-b border-navy/15 py-7 sm:grid-cols-[4rem_1fr_1.2fr] sm:items-baseline sm:gap-6"
              >
                <span className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-royal transition-transform duration-700 group-hover:scale-x-100" />
                <span className="font-mono text-[11px] text-royal">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-[1.6rem] leading-tight tracking-tight transition-colors duration-500 group-hover:text-royal">
                  {r.title}
                </h3>
                <p className="col-start-2 mt-2 text-[15px] leading-relaxed text-navy/75 sm:col-start-3 sm:mt-0">{r.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
