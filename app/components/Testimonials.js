"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

// PLACEHOLDER QUOTES — illustrative wording, ratings and attributions only.
// Replace with real, approved client testimonials before launch. Attribution
// is by role and sector, so no names or photographs are needed.
const QUOTES = [
  {
    quote:
      "They rebuilt our month-end from scratch. For the first time I open the management accounts and understand exactly where the cash went.",
    role: "Managing director",
    sector: "Architecture",
    place: "London",
  },
  {
    quote:
      "One accountant, one phone number, and an answer the same day. We stopped chasing our advisers the month we moved.",
    role: "Founder",
    sector: "E-commerce",
    place: "Manchester",
  },
  {
    quote:
      "The tax conversation happened in October, not the week before the deadline. That change alone was worth the fee.",
    role: "Finance director",
    sector: "Engineering",
    place: "Bristol",
  },
  {
    quote:
      "Payroll used to be the day I dreaded. Now it runs on the same date every month and I only hear about it when a decision is needed.",
    role: "Operations manager",
    sector: "Hospitality",
    place: "Leeds",
  },
  {
    quote:
      "We asked for a funding forecast on a Monday and walked into the bank with it on Thursday. Clear, defensible, and ours to explain.",
    role: "Co-founder",
    sector: "Software",
    place: "Edinburgh",
  },
  {
    quote:
      "A fixed fee, agreed in writing, and no surprises at year end. It sounds basic. It was not our experience elsewhere.",
    role: "Director",
    sector: "Construction",
    place: "Birmingham",
  },
];

// "Managing director" → "MD": stands in for a portrait
const initials = (role) =>
  role
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

function Stars() {
  return (
    <span role="img" aria-label="Rated five out of five" className="flex gap-1 text-royal">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
          <path d="M8 1.2l2 4.4 4.8.5-3.6 3.2 1 4.7L8 11.6 3.8 14l1-4.7L1.2 6.1 6 5.6z" />
        </svg>
      ))}
    </span>
  );
}

// Unmistakably a testimonial: the opening quotation mark, a rating, the
// client's words, then who said them beside a monogram in place of a portrait.
function Card({ q }) {
  return (
    <li className="flex w-[19rem] shrink-0 flex-col rounded-card border border-navy/10 bg-white p-7 shadow-[0_30px_60px_-48px_color-mix(in_srgb,var(--ink)_45%,transparent)] sm:w-[26rem] sm:p-8">
      <div className="flex items-start justify-between">
        <span aria-hidden className="font-display text-[4.5rem] leading-[0.7] text-royal">
          &ldquo;
        </span>
        <Stars />
      </div>
      <figure className="m-0 flex flex-1 flex-col">
        <blockquote className="font-display text-[1.3rem] leading-[1.25] tracking-[-0.005em] text-ink sm:text-[1.45rem]">
          {q.quote}
        </blockquote>
        <figcaption className="mt-auto pt-7">
          <span className="flex items-center gap-4 border-t border-navy/10 pt-5">
            <span
              aria-hidden
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(155deg,var(--navy)_0%,var(--panel-end)_100%)] font-mono text-[11px] tracking-[0.08em] text-white"
            >
              {initials(q.role)}
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-medium text-ink">{q.role}</span>
              <span className="mt-1 block font-mono text-[10px] tracking-[0.16em] text-navy/55 uppercase">
                {q.sector} · {q.place}
              </span>
            </span>
          </span>
        </figcaption>
      </figure>
    </li>
  );
}

// What clients say: the statement and the industries first, then a carousel
// of testimonial cards that moves on its own. It drifts edge to edge, holds
// still under the pointer or keyboard focus, and can be paused outright; with
// reduced motion it is a plain row to swipe through.
export default function Testimonials() {
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const fadeIn = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10%" },
    transition: { duration: 0.9, ease, delay },
  });

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="relative scroll-mt-20 bg-paper py-12 text-ink lg:py-16">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between border-t border-navy/10 pt-5 font-mono text-[10px] tracking-[0.2em] text-navy/50 uppercase">
          <span>05 — Testimonials</span>
          <span className="hidden sm:inline">In our clients&apos; words</span>
        </div>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-12 lg:items-end lg:gap-8">
          <motion.h2
            {...fadeIn(0)}
            id="testimonials-title"
            className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-[-0.015em] text-balance lg:col-span-7"
          >
            Trusted by experts <em className="text-royal">from various industries.</em>
          </motion.h2>
          <motion.p {...fadeIn(0.1)} className="max-w-md text-base leading-relaxed text-navy/75 lg:col-span-4 lg:col-start-9">
            Owners and finance leads on what changed once their accounts, tax
            and payroll sat with one team.
          </motion.p>
        </div>

        {/* The sectors on the books, as one ledger line */}
        <motion.div
          {...fadeIn(0.2)}
          className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-y border-navy/10 py-4 font-mono text-[10px] tracking-[0.18em] text-navy/60 uppercase"
        >
          <ul aria-label="Industries our clients work in" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {QUOTES.map((q) => (
              <li key={q.sector} className="flex items-center gap-2.5">
                <span aria-hidden className="h-1 w-1 rounded-full bg-royal" />
                {q.sector}
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
            className="inline-flex items-center gap-2.5 tracking-[0.18em] uppercase transition-colors duration-300 hover:text-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal motion-reduce:hidden"
          >
            <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${paused ? "bg-navy/30" : "bg-royal"}`} />
            {paused ? "Play" : "Pause"}
          </button>
        </motion.div>
      </div>

      {/* Full-bleed track: two copies of the list, so the loop has no seam */}
      <motion.div
        {...fadeIn(0.3)}
        className="testimonial-marquee mt-10 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] motion-reduce:overflow-x-auto lg:mt-14"
      >
        <div className="testimonial-track flex w-max" style={paused ? { animationPlayState: "paused" } : undefined}>
          <ul className="flex gap-5 pr-5 motion-reduce:px-5">
            {QUOTES.map((q) => (
              <Card key={q.sector} q={q} />
            ))}
          </ul>
          <ul aria-hidden className="flex gap-5 pr-5 motion-reduce:hidden">
            {QUOTES.map((q) => (
              <Card key={q.sector} q={q} />
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
