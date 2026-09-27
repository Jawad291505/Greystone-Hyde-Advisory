"use client";

import { MotionConfig, motion } from "framer-motion";
import CountUp from "./CountUp";

// Draft copy and illustrative figures — replace with the firm's real numbers.
const stats = [
  { to: 15, suffix: "+", label: "Years in practice" },
  { to: 400, suffix: "+", label: "Businesses supported" },
  { to: 98, suffix: "%", label: "Client retention" },
  { to: 24, suffix: "h", label: "Response time" },
];

// Minimal 24px line icons, drawn with currentColor.
const icons = {
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </>
  ),
  check: (
    <>
      <path d="M12 3.5 19.5 6v5.5c0 4.3-3.1 7.6-7.5 9-4.4-1.4-7.5-4.7-7.5-9V6L12 3.5Z" />
      <path d="m8.8 12.2 2.2 2.2 4.3-4.6" />
    </>
  ),
  bell: (
    <>
      <path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5l1.5-1.5Z" />
      <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.3V4.5a1 1 0 0 1 1-1h7.8l8.2 8.2a1 1 0 0 1 0 1.4l-6.6 6.6a1 1 0 0 1-1.4 0l-9-9Z" />
      <circle cx="8" cy="8" r="1.3" />
    </>
  ),
  cloud: (
    <path d="M7 18.5a4 4 0 0 1-.6-8 6 6 0 0 1 11.5 1.6A3.3 3.3 0 0 1 17.5 18.5H7Z" />
  ),
};

const reasons = [
  { icon: "target", title: "Business-first approach", body: "Advice read against your goals, not just compliance." },
  { icon: "check", title: "Precision in reporting", body: "Clean books and reports you can actually act on." },
  { icon: "bell", title: "Proactive advice", body: "Risks and opportunities flagged before they land." },
  { icon: "person", title: "One accountable partner", body: "A named accountant who knows your business." },
  { icon: "tag", title: "Fixed, transparent fees", body: "Agreed up front. No surprise invoices." },
  { icon: "cloud", title: "Modern, cloud-based finance", body: "Live numbers, not figures a year out of date." },
];

const ease = [0.22, 1, 0.36, 1];
const inView = { once: true, margin: "-80px" };

export default function WhyChooseUs() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="why-us"
        className="relative scroll-mt-20 bg-[radial-gradient(ellipse_50%_55%_at_20%_55%,rgba(47,77,134,0.4),transparent)]"
      >
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-10 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
            <div>
              <p className="mb-6 flex items-center gap-4 text-[11px] tracking-[0.28em] text-brand uppercase sm:text-xs">
                <span className="h-px w-10 bg-brand" />
                Why choose us
              </p>
              <h2 className="font-display text-[clamp(2.25rem,5.4vw,4.25rem)] leading-[1.02] tracking-tight">
                Our value, <em className="text-brand">your advantage.</em>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted sm:text-base">
              A London practice with the rigour of a large firm and the
              attention of a small one.
            </p>
          </div>

          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.9, ease }}
            className="card mt-14 grid grid-cols-2 divide-card-line lg:mt-20 lg:grid-cols-4 lg:divide-x"
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col-reverse px-6 py-7 sm:px-8 sm:py-9 ${i < 2 ? "max-lg:border-b max-lg:border-card-line" : ""} ${i % 2 === 0 ? "max-lg:border-r max-lg:border-card-line" : ""}`}
              >
                <dt className="mt-2 text-[11px] tracking-[0.18em] text-muted uppercase">{s.label}</dt>
                <dd className="font-display text-4xl tracking-tight sm:text-5xl">
                  <CountUp to={s.to} suffix={s.suffix} delay={i * 0.12} />
                </dd>
              </div>
            ))}
          </motion.dl>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <motion.article
                key={r.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
                className="card group flex items-start gap-5 p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-brand/50 sm:p-7"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand transition-colors duration-500 group-hover:bg-brand group-hover:text-background">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {icons[r.icon]}
                  </svg>
                </span>
                <div>
                  <h3 className="text-base font-medium tracking-tight">{r.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.body}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
