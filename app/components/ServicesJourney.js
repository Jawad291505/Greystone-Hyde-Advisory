"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import ServicesSceneSmart from "./ServicesSceneSmart";
import MagneticButton from "./MagneticButton";
import { STRIPE_PAYMENT_LINK } from "../lib/payments";
import { SERVICES } from "../lib/services";

// The nine services (shared with the homepage) grouped into the scene's
// three service chapters, plus payments. Draft copy — replace with the
// firm's real wording.
const bySlug = Object.fromEntries(SERVICES.map((s, i) => [s.slug, { ...s, n: i + 1 }]));

const CHAPTERS = [
  {
    id: "accounting-bookkeeping",
    index: "01",
    label: "Accounting, Bookkeeping & Payroll",
    short: "Accounting",
    title: ["Every transaction,", "in its place."],
    body: "The day-to-day finance function, handled — clean books, accurate accounts and a payroll your team can rely on.",
    services: ["accounting", "bookkeeping", "payroll"],
  },
  {
    id: "tax-compliance",
    index: "02",
    label: "Tax & Compliance",
    short: "Tax",
    title: ["Filed correctly.", "Filed on time."],
    body: "Compliance done properly and planning done early — so tax is something you manage, not something that happens to you.",
    services: ["vat", "tax", "tax-planning"],
  },
  {
    id: "reporting-advisory",
    index: "03",
    label: "Reporting & Advisory",
    short: "Advisory",
    title: ["See where the numbers", "are heading."],
    body: "Reporting that shows exactly where you stand, and independent advice on where to go next.",
    services: ["financial-reporting", "management-accounts", "business-advisory"],
  },
  {
    id: "payments",
    index: "04",
    label: "Payments",
    short: "Payments",
    title: ["Settle your invoice", "in a few clicks."],
    body: "Pay your Greystone Hyde invoice online through a secure checkout hosted by Stripe. Have your invoice number to hand — it takes under a minute.",
    points: [
      "Checkout hosted securely by Stripe",
      "Your card details never touch our systems",
      "Opens in a new tab — this page stays put",
    ],
  },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.07 },
  },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Eyebrow({ children }) {
  return (
    <p className="mb-5 flex items-center gap-3 text-[11px] tracking-[0.22em] text-brand uppercase sm:text-xs sm:tracking-[0.28em]">
      <span className="h-px w-10 bg-brand" />
      {children}
    </p>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// Shown in place of the 3D card when WebGL isn't available
function CardFallback() {
  return (
    <div
      aria-hidden
      className="mb-8 aspect-[1.585] w-full max-w-sm rounded-2xl border border-white/15 bg-[linear-gradient(135deg,#0c1629,#1b305c_55%,#2c5d93)] p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
    >
      <div className="flex h-full flex-col justify-between">
        <span className="font-display text-xl text-foreground">Greystone Hyde</span>
        <span className="font-mono text-lg tracking-[0.2em] text-foreground/90">•••• •••• •••• 0427</span>
        <span className="flex items-end justify-between text-[10px] tracking-[0.2em] text-foreground/55 uppercase">
          Client payments
          <span className="font-display text-2xl tracking-normal text-gold normal-case italic">Debit</span>
        </span>
      </div>
    </div>
  );
}

function PaymentActions() {
  return (
    <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
      <MagneticButton
        href={STRIPE_PAYMENT_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pay securely with Stripe (opens in a new tab)"
        className="rounded-full bg-logo-blue px-8 py-3.5 text-sm font-medium tracking-wide text-white shadow-[0_12px_40px_-12px_rgba(49,106,162,0.9)] transition-colors duration-300 hover:bg-[#3a78b5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        <span className="flex items-center gap-2.5">
          <LockIcon />
          Pay Securely
        </span>
      </MagneticButton>
      <Link
        href="/#contact"
        className="text-[13px] tracking-wide text-foreground/65 underline-offset-4 transition-colors duration-300 hover:text-brand hover:underline"
      >
        Questions about an invoice?
      </Link>
    </motion.div>
  );
}

function Chapter({ chapter, fallbackCard }) {
  const payments = chapter.id === "payments";
  return (
    <section
      id={chapter.id}
      data-chapter
      aria-labelledby={`${chapter.id}-title`}
      className="relative flex min-h-[160svh] scroll-mt-0 items-center"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* Mobile: the copy runs taller than the space under the scene, so it gets a
            soft backdrop that fades in from above rather than overlapping the 3D */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.25 }}
          className="pointer-events-auto mt-[38svh] max-w-lg max-lg:-mx-5 max-lg:bg-background/85 max-lg:px-5 max-lg:pt-6 max-lg:pb-4 max-lg:shadow-[0_-56px_48px_-8px_rgba(15,27,46,0.85)] sm:max-lg:-mx-6 sm:max-lg:px-6 lg:mt-0"
        >
          {payments && fallbackCard ? <CardFallback /> : null}
          <motion.div variants={item}>
            <Eyebrow>
              <span className="font-mono">{chapter.index}</span>
              <span className="text-foreground/30">—</span>
              {chapter.label}
            </Eyebrow>
          </motion.div>
          <motion.h2
            variants={item}
            id={`${chapter.id}-title`}
            className="font-display text-[clamp(2.1rem,4.6vw,3.3rem)] leading-[1.05] tracking-tight"
          >
            {chapter.title[0]} <span className="text-brand">{chapter.title[1]}</span>
          </motion.h2>
          <motion.p variants={item} className="mt-5 text-sm leading-relaxed text-foreground/70 sm:text-base">
            {chapter.body}
          </motion.p>
          {chapter.services ? (
            <motion.ul variants={item} className="mt-7 border-t border-foreground/[0.08]">
              {chapter.services.map((slug) => {
                const s = bySlug[slug];
                return (
                  <li
                    key={slug}
                    id={slug}
                    className="scroll-mt-[30svh] border-b border-foreground/[0.08] py-4"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl tracking-tight sm:text-2xl">{s.name}</h3>
                      <span className="font-mono text-[11px] text-muted">
                        {String(s.n).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/70 sm:text-sm">{s.desc}</p>
                    <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-foreground/50">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-center gap-2">
                          <span className="h-1 w-1 shrink-0 rounded-full bg-brand" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </motion.ul>
          ) : (
            <motion.ul variants={item} className="mt-7 border-t border-foreground/[0.08]">
              {chapter.points.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-3 border-b border-foreground/[0.08] py-3 text-[13px] text-foreground/80 sm:text-sm"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {p}
                </li>
              ))}
            </motion.ul>
          )}
          {payments ? <PaymentActions /> : null}
        </motion.div>
      </div>
    </section>
  );
}

export default function ServicesJourney() {
  const section = useRef(null);
  const journey = useRef({ stage: 0, vel: 0 });
  const [active, setActive] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [noGL, setNoGL] = useState(false);
  const onUnavailable = useCallback(() => setNoGL(true), []);

  useEffect(() => {
    const el = section.current;
    const chapters = [...el.querySelectorAll("[data-chapter]")];
    const n = chapters.length;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduce(reduceMotion);

    // Stage = which chapter's centre is at the viewport centre, interpolated
    // between chapters (0 intro … 4 payments, running a little past 4 while
    // the last chapter scrolls out so the card keeps turning).
    let centers = [];
    let lastH = 1;
    const measure = () => {
      const top = el.getBoundingClientRect().top;
      centers = chapters.map((c) => {
        const r = c.getBoundingClientRect();
        return r.top - top + r.height / 2;
      });
      lastH = chapters[n - 1].offsetHeight;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    let raf;
    let smooth = -1;
    let prev = 0;
    let last = performance.now();
    let shown = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const y = -rect.top + window.innerHeight / 2;
      let raw;
      if (y <= centers[0]) raw = 0;
      else if (y >= centers[n - 1]) raw = n - 1 + Math.min(0.6, (y - centers[n - 1]) / lastH);
      else {
        let i = 0;
        while (y >= centers[i + 1]) i++;
        raw = i + (y - centers[i]) / (centers[i + 1] - centers[i]);
      }

      // Reduced motion: jump between chapter states instead of animating through them
      if (reduceMotion) smooth = Math.round(Math.min(raw, n - 1));
      else smooth = smooth < 0 ? raw : smooth + (raw - smooth) * (1 - Math.exp(-dt * 7));

      const j = journey.current;
      j.vel += ((smooth - prev) / Math.max(dt, 1e-3) - j.vel) * 0.2;
      j.stage = smooth;
      prev = smooth;

      const idx = Math.min(n - 1, Math.round(smooth));
      if (idx !== shown) {
        shown = idx;
        setActive(idx);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div ref={section} className="relative">
        {/* Sticky 3D stage behind the copy */}
        <div className="sticky top-0 -mb-[100svh] h-svh overflow-hidden bg-background">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_68%_45%,rgba(49,106,162,0.16),transparent)] max-lg:bg-[radial-gradient(ellipse_80%_45%_at_50%_30%,rgba(49,106,162,0.18),transparent)]"
          />
          <ServicesSceneSmart journey={journey} reduce={reduce} onUnavailable={onUnavailable} />
          {/* Legibility scrims: copy sits left on desktop, bottom on mobile */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-background from-25% via-background/60 via-50% to-transparent to-70% lg:bg-gradient-to-r lg:from-background/85 lg:from-0% lg:via-background/25 lg:via-40% lg:to-transparent lg:to-60%"
          />

          <nav
            aria-label="Services on this page"
            className="absolute top-1/2 right-6 hidden -translate-y-1/2 flex-col gap-5 lg:flex xl:right-10"
          >
            {CHAPTERS.map((c, i) => {
              const on = active === i + 1;
              return (
                <a key={c.id} href={`#${c.id}`} className="group flex items-center justify-end gap-3">
                  <span
                    className={`text-[11px] tracking-[0.18em] uppercase transition-colors duration-500 ${
                      on ? "text-foreground" : "text-foreground/35 group-hover:text-foreground/70"
                    }`}
                  >
                    {c.short}
                  </span>
                  <span
                    className={`h-px transition-all duration-500 ${on ? "w-10 bg-brand" : "w-5 bg-foreground/25"}`}
                  />
                </a>
              );
            })}
          </nav>
        </div>

        <div className="pointer-events-none relative z-10">
          <section data-chapter aria-labelledby="services-title" className="relative flex min-h-svh items-center">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
              <div className="reveal pointer-events-auto mt-[34svh] max-w-2xl lg:mt-0" style={{ "--d": "0.15s" }}>
                <Eyebrow>Services</Eyebrow>
                <h1
                  id="services-title"
                  className="font-display text-[clamp(2.6rem,7.4vw,5.6rem)] leading-[1] tracking-tight"
                >
                  What are you <span className="text-brand">looking for?</span>
                </h1>
                <p className="mt-6 max-w-lg text-sm leading-relaxed text-foreground/70 sm:text-base">
                  Every business arrives with a different question. Scroll to see how we bring order to
                  the numbers — or go straight to what you need.
                </p>
                <ul className="mt-8 flex max-w-2xl flex-wrap gap-2">
                  {[...SERVICES.map((s, i) => ({ href: s.slug, n: i + 1, label: s.name })), { href: "payments", label: "Make a payment" }].map(
                    (c) => (
                      <li key={c.href}>
                        <a
                          href={`#${c.href}`}
                          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] tracking-wide transition-colors duration-300 hover:border-brand/60 hover:text-brand ${
                            c.n ? "border-foreground/15 text-foreground/80" : "border-gold/40 text-gold"
                          }`}
                        >
                          {c.n ? (
                            <span className="font-mono text-[11px] text-brand">{String(c.n).padStart(2, "0")}</span>
                          ) : null}
                          {c.label}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </section>

          {CHAPTERS.map((c) => (
            <Chapter key={c.id} chapter={c} fallbackCard={noGL} />
          ))}
        </div>
      </div>
    </MotionConfig>
  );
}
