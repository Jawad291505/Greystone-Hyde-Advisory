"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroMedia from "./HeroMedia";
import MagneticButton from "./MagneticButton";

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

const taglines = [
  "Accounting, tax and advisory for London businesses that want precise numbers, confident decisions and a partner who turns complexity into a clear path forward.",
  "Real-time numbers, reviewed by chartered accountants — not just software making its best guess.",
  "One point of contact who knows your business, not a ticket queue that only knows your account number.",
];

// Cycles the supporting line every few seconds — a quiet crossfade, paused
// entirely under reduced motion rather than swapped instantly, since a
// sudden text change is its own kind of motion.
function RotatingTagline() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % taglines.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="reveal mt-8 flex max-w-xl gap-4 border-l border-foreground/15 pl-5 sm:mt-10"
      style={{ "--d": "0.4s" }}
    >
      <span className="font-mono text-[11px] text-muted">
        {String(i + 1).padStart(2, "0")}
      </span>
      {/* Grid-stacks every possible tagline in the same cell so the
          container always sizes to the tallest one — the visible line
          crossfades in place instead of risking an overlap below it. */}
      <div className="grid flex-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="[grid-area:1/1] text-base leading-relaxed text-foreground/75 sm:text-lg"
          >
            {taglines[i]}
          </motion.p>
        </AnimatePresence>
        {taglines.map((t, idx) => (
          <p
            key={idx}
            aria-hidden
            className="invisible [grid-area:1/1] text-base leading-relaxed sm:text-lg"
          >
            {t}
          </p>
        ))}
      </div>
    </div>
  );
}

// Drives the whole hero's motion from two inputs — pointer position and
// local scroll progress — written to CSS custom properties on the section
// root. Every layer below (image, grain, frame marks, headline) reads the
// same --mx/--my/--sp vars at a different magnitude via calc(), so the
// scene moves as one coordinated system instead of independent effects,
// and the only per-frame JS cost is a handful of setProperty calls.
function useHeroMotion(ref) {
  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointerFine = window.matchMedia("(pointer: fine)").matches;

    el.style.setProperty("--mx", 0);
    el.style.setProperty("--my", 0);
    el.style.setProperty("--sp", 0);

    if (reduce) return;

    let raf;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let targetP = 0;
    let curP = 0;

    const onMove = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      targetP = clamp(-rect.top / rect.height);
    };

    const loop = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      curP += (targetP - curP) * 0.1;
      el.style.setProperty("--mx", curX.toFixed(4));
      el.style.setProperty("--my", curY.toFixed(4));
      el.style.setProperty("--sp", curP.toFixed(4));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    if (pointerFine) window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref]);
}

export default function Hero() {
  const section = useRef(null);
  useHeroMotion(section);

  return (
    <section
      ref={section}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
      style={{ "--mx": 0, "--my": 0, "--sp": 0 }}
    >
      {/* Aerial London (Thames, Tower Bridge, Canary Wharf), toned to the brand navy */}
      <HeroMedia />
      {/* Desktop: solid behind the copy, photo fully revealed to its right */}
      <div className="absolute inset-0 -z-20 hidden bg-gradient-to-r from-background from-0% via-background/65 via-30% to-transparent to-58% lg:block" />
      {/* Mobile/tablet: photo on top, copy anchored on a darker base */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-background from-8% via-background/70 via-42% to-background/10 lg:hidden" />
      <div className="absolute inset-x-0 top-0 -z-20 h-40 bg-gradient-to-b from-background/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-20 h-56 bg-gradient-to-t from-background via-background/55 to-transparent" />
      <div
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_50%_45%_at_80%_25%,rgba(91,147,199,0.35),transparent)]"
        style={{
          opacity: "calc(1 - var(--sp, 0) * 0.6)",
          transform: "translate3d(calc(var(--mx, 0) * 10px), calc(var(--my, 0) * 8px), 0)",
        }}
      />

      {/* Architectural corner framing — reacts most to the pointer of any layer, reads as a viewfinder locked onto the skyline */}
      <div
        aria-hidden
        className="hero-frame pointer-events-none absolute inset-6 z-10 hidden lg:block"
        style={{
          "--d": "1s",
          transform:
            "translate3d(calc(var(--mx, 0) * 20px), calc(var(--my, 0) * 16px), 0)",
        }}
      >
        <span className="absolute left-0 top-0 h-10 w-10 border-l border-t border-foreground/25" />
        <span className="absolute right-0 top-0 h-10 w-10 border-r border-t border-foreground/25" />
        <span className="absolute bottom-0 left-0 h-10 w-10 border-b border-l border-foreground/25" />
        <span className="absolute bottom-0 right-0 h-10 w-10 border-b border-r border-foreground/25" />
      </div>

      {/* Coordinates — floats over the skyline, top right */}
      <div
        aria-hidden
        className="hero-frame pointer-events-none absolute right-10 top-28 z-10 hidden text-right lg:block"
        style={{
          "--d": "1.15s",
          transform:
            "translate3d(calc(var(--mx, 0) * 26px), calc(var(--my, 0) * 20px), 0)",
        }}
      >
        <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/55 uppercase">
          51.5072° N
          <br />
          0.0877° W
        </p>
        <p className="mt-2 flex items-center justify-end gap-2 text-[10px] tracking-[0.22em] text-brand/85 uppercase">
          City of London
          <span className="h-1 w-1 rounded-full bg-brand" />
        </p>
      </div>

      {/* Vertical edge label — pure architectural signage, no motion of its own */}
      <p
        aria-hidden
        className="pointer-events-none absolute left-6 top-1/2 z-10 hidden origin-left -translate-y-1/2 -rotate-90 text-[10px] tracking-[0.3em] text-foreground/35 uppercase lg:block"
      >
        Est. London · Chartered Accountants
      </p>

      <div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-end px-5 pt-32 pb-10 sm:px-6 sm:pt-40 sm:pb-16 lg:px-10"
        style={{
          transform: "translate3d(calc(var(--mx, 0) * -3px), calc(var(--sp, 0) * -18px), 0)",
          opacity: "calc(1 - var(--sp, 0) * 0.45)",
        }}
      >
        <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p
              className="reveal mb-6 flex items-center gap-3 text-[11px] tracking-[0.22em] sm:mb-8 sm:gap-4 sm:text-xs sm:tracking-[0.28em] text-brand uppercase"
              style={{ "--d": "0.1s" }}
            >
              <span className="h-px w-10 bg-brand" />
              London Accounting &amp; Advisory
            </p>

            <h1
              className="reveal font-display text-[clamp(2.9rem,11vw,7rem)] lg:text-[clamp(4rem,7.4vw,7rem)] leading-[0.98] tracking-tight"
              style={{ "--d": "0.2s" }}
            >
              Financial
              <br />
              complexity,
              <br />
              <span className="text-brand italic">made clear.</span>
            </h1>

            <RotatingTagline />
          </div>

          {/* CTAs sit in their own column on desktop — clear of the tagline
              regardless of how many lines it wraps to at any breakpoint */}
          <div
            className="reveal flex flex-col items-stretch gap-5 sm:flex-row sm:items-center lg:flex-col lg:items-end lg:gap-4"
            style={{ "--d": "0.55s" }}
          >
            <MagneticButton
              href="#contact"
              className="rounded-full bg-logo-blue px-8 py-4 text-center text-sm font-medium tracking-wide text-white shadow-[0_0_40px_-8px_rgba(49,106,162,0.9)] transition-colors hover:bg-brand"
            >
              Get Started
            </MagneticButton>
            <a
              href="#clarity"
              className="group flex items-center justify-center gap-3 rounded-full border border-foreground/15 px-6 py-3 text-sm text-foreground transition-colors hover:border-brand/60 hover:text-brand sm:justify-start"
            >
              Explore services
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Trust bar — placeholder credentials, replace with verified ones */}
      <div className="reveal relative z-10 border-t border-foreground/10 bg-background/40 backdrop-blur-md" style={{ "--d": "0.8s" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-10 gap-y-4 px-5 py-4 text-[10px] tracking-[0.16em] sm:px-6 sm:py-5 sm:text-[11px] sm:tracking-[0.2em] text-foreground/60 uppercase lg:px-10">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 sm:gap-x-10 sm:gap-y-3">
            {["Chartered accountants", "HMRC registered agent", "Xero · QuickBooks · Sage"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-brand" />
                {t}
              </li>
            ))}
          </ul>
          <a href="#clarity" className="hidden items-center gap-3 hover:text-foreground sm:flex">
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-foreground/20">
              <span className="scroll-tick absolute inset-x-0 top-0 h-3 bg-brand" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
