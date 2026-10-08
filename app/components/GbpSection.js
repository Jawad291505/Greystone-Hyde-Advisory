"use client";

import { useRef } from "react";
import { useScrollProgress } from "../lib/useScrollProgress";
import GbpCoinsSmart from "./GbpCoinsSmart";


// Value → movement → growth → financial control. Calmer and shorter than
// the cube section: this is the payoff, not the reveal.
export default function GbpSection() {
  const section = useRef(null);
  // Runs only while the section is on screen and the scroll is still moving
  const progress = useScrollProgress(section, (p) => section.current?.style.setProperty("--p", p.toFixed(4)));

  return (
    <section id="value" ref={section} className="gbp-section relative h-[320vh]" style={{ "--p": 0 }}>
      <div className="sticky top-0 h-svh overflow-hidden bg-background">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_70%_50%,rgba(185,154,95,0.14),transparent)]"
        />

        <div className="absolute inset-0 lg:translate-x-[14vw]">
          <GbpCoinsSmart progress={progress} />
        </div>

        <div className="pointer-events-none relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-14 sm:px-6 lg:justify-center lg:px-10 lg:pb-0">
          <div className="relative max-w-xl">
            <div className="gbp-intro">
              <p className="mb-5 flex items-center gap-3 text-[11px] tracking-[0.22em] text-gold uppercase sm:gap-4 sm:text-xs sm:tracking-[0.28em]">
                <span className="h-px w-10 bg-gold" />
                The value
              </p>
              <p className="font-display text-[clamp(1.75rem,4.6vw,3.25rem)] leading-[1.1] tracking-tight text-foreground/90">
                Every filing, every decision, moves your numbers forward.
              </p>
            </div>

            <div className="gbp-final absolute inset-x-0 bottom-0 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2">
              <p className="mb-5 flex items-center gap-3 text-[11px] tracking-[0.22em] text-gold uppercase sm:gap-4 sm:text-xs sm:tracking-[0.28em]">
                <span className="h-px w-10 bg-gold" />
                Growth
              </p>
              <h2 className="font-display text-[clamp(2.4rem,7vw,5rem)] leading-[1.02] tracking-tight">
                Your value,
                <br />
                <span className="text-gold">compounding.</span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/70 sm:text-base">
                Structured finances don&apos;t just stay organized — they compound.
                Clear numbers become better decisions, and better decisions
                become growth you can see.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
