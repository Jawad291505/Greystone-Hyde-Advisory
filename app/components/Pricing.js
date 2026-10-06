"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

// PLACEHOLDER PLANS — the names, prices and inclusions below are illustrative
// and must be replaced with the practice's real fee structure before launch.
const plans = [
  {
    name: "Essentials",
    forWho: "Sole directors and small companies",
    price: "£95",
    summary: "The statutory work, done accurately and on time.",
    includes: [
      "Year-end accounts and filings",
      "Corporation tax return",
      "Confirmation statement",
      "A named client accountant",
    ],
  },
  {
    name: "Growth",
    forWho: "Trading businesses with a team",
    price: "£245",
    summary: "Your books, VAT and payroll kept current, month by month.",
    includes: [
      "Everything in Essentials",
      "Monthly bookkeeping and reconciliation",
      "Quarterly VAT returns",
      "Payroll and auto-enrolment pensions",
      "Quarterly review call",
    ],
    featured: true,
  },
  {
    name: "Advisory",
    forWho: "Established businesses planning ahead",
    price: "£595",
    summary: "Management information and advice for the bigger decisions.",
    includes: [
      "Everything in Growth",
      "Monthly management accounts",
      "Year-round tax planning",
      "Cash-flow forecasts and scenarios",
      "Time with an advisory partner",
    ],
  },
];

const list = { show: { transition: { staggerChildren: 0.1 } } };
const cardIn = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

function Tick({ featured }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={`mt-[3px] h-4 w-4 shrink-0 ${featured ? "text-glint" : "text-royal"}`}>
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M5 8.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Fees as three cards: the middle one set in navy as the one deep-colour
// card, the others on white. Every figure is a starting point, in keeping
// with the site's promise that fees are fixed and agreed in writing.
export default function Pricing() {
  const reduce = useReducedMotion();

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative scroll-mt-20 bg-paper text-ink">
      <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="flex items-center justify-between border-t border-navy/10 pt-5 font-mono text-[10px] tracking-[0.2em] text-navy/60 uppercase">
          <span>06 — Pricing</span>
          <span className="hidden sm:inline">Fixed fees, agreed in writing</span>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease }}
          className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-12 lg:items-end lg:gap-8"
        >
          <h2
            id="pricing-title"
            className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-[-0.015em] text-balance lg:col-span-7"
          >
            One monthly fee. <em className="text-royal">No surprises.</em>
          </h2>
          <p className="max-w-md text-base leading-relaxed text-navy/80 lg:col-span-4 lg:col-start-9">
            Each plan is a starting point. We confirm your fee in writing before
            any work begins, and it stays fixed for the year.
          </p>
        </motion.div>

        <motion.ol
          variants={list}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-3 lg:items-stretch"
        >
          {plans.map((p, i) => {
            const f = p.featured;
            return (
              <motion.li
                key={p.name}
                variants={cardIn}
                className={`group relative flex flex-col overflow-hidden rounded-card border p-7 transition-[translate,box-shadow,border-color] duration-500 hover:-translate-y-1 sm:p-8 ${
                  f
                    ? "border-transparent bg-[linear-gradient(160deg,var(--navy)_0%,var(--ink)_100%)] text-white shadow-[0_40px_80px_-45px_color-mix(in_srgb,var(--ink)_80%,transparent)]"
                    : "border-navy/10 bg-white hover:border-royal/25 hover:shadow-[0_30px_60px_-44px_color-mix(in_srgb,var(--ink)_40%,transparent)]"
                }`}
              >
                {f ? (
                  // Soft royal light, top right
                  <span aria-hidden className="pointer-events-none absolute -top-1/4 -right-1/4 h-[70%] w-[80%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--royal)_55%,transparent),transparent)]" />
                ) : (
                  // Royal rule draws across the top on hover
                  <span aria-hidden className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-royal transition-transform duration-700 group-hover:scale-x-100" />
                )}

                <div className="relative flex flex-1 flex-col">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-[1.9rem] leading-none tracking-tight">{p.name}</h3>
                    <span className={`font-mono text-[11px] ${f ? "text-white/50" : "text-navy/40"}`}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className={`mt-2 font-mono text-[10px] tracking-[0.16em] uppercase ${f ? "text-glint" : "text-royal"}`}>{p.forWho}</p>

                  <p className={`mt-7 flex items-baseline gap-2 border-t pt-6 ${f ? "border-white/15" : "border-navy/10"}`}>
                    <span className={`text-sm ${f ? "text-white/70" : "text-navy/70"}`}>from</span>
                    <span className="font-editorial text-[clamp(3rem,4.4vw,3.75rem)] leading-none font-[400] tracking-[-0.02em] [font-variation-settings:'opsz'_72]">
                      {p.price}
                    </span>
                    <span className={`text-sm ${f ? "text-white/70" : "text-navy/70"}`}>/ month + VAT</span>
                  </p>
                  <p className={`mt-4 text-[15px] leading-relaxed ${f ? "text-white/80" : "text-navy/80"}`}>{p.summary}</p>

                  <ul className="mt-6 mb-8 space-y-3">
                    {p.includes.map((line) => (
                      <li key={line} className={`flex items-start gap-3 text-sm leading-snug ${f ? "text-white/90" : "text-ink/85"}`}>
                        <Tick featured={f} />
                        {line}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    aria-label={`Discuss the ${p.name} plan`}
                    className={`group/cta mt-auto inline-flex items-center justify-between gap-4 rounded-full py-2 pr-2 pl-6 text-sm font-medium tracking-wide transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                      f
                        ? "bg-white text-navy hover:bg-glint-soft focus-visible:outline-glint"
                        : "border border-navy/15 text-navy hover:border-navy hover:bg-navy hover:text-white focus-visible:outline-royal"
                    }`}
                  >
                    Discuss this plan
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-full transition-transform duration-500 group-hover/cta:translate-x-1 ${
                        f ? "bg-navy text-white" : "bg-navy/5 group-hover/cta:bg-white/15"
                      }`}
                    >
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </span>
                  </a>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>

        <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-navy/70">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-royal" />
          One-off work, such as a company formation or an HMRC enquiry, is quoted separately and agreed before it starts.
        </p>
      </div>
    </section>
  );
}
