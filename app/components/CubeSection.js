"use client";

import { useRef } from "react";
import { useScrollProgress } from "../lib/useScrollProgress";
import CubeCssStage from "./CubeCssStage";

const DISCIPLINES = ["Tax", "VAT", "Payroll", "Cash flow", "Expenses", "Invoices", "Reporting"];

// CSS-only cube (see CubeCssStage): no WebGL, runs on the compositor, and
// cannot lose a context or drop frames the way the old three.js scene did.
export default function CubeSection() {
  const section = useRef(null);
  // Runs only while the section is on screen and the scroll is still moving
  const progress = useScrollProgress(section, (p) => section.current?.style.setProperty("--p", p.toFixed(4)));

  return (
    <section
      id="structure"
      ref={section}
      className="cube-section relative h-[540vh]"
      style={{ "--p": 0 }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_45%_50%_at_72%_50%,rgba(47,77,134,0.5),transparent)]"
        />

        <div className="absolute inset-0">
          <CubeCssStage progress={progress} />
        </div>

        <div className="pointer-events-none relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-14 sm:px-6 lg:justify-center lg:px-10 lg:pb-0">
          <div className="relative max-w-xl">
            <div className="cube-intro">
              <p className="mb-5 flex items-center gap-3 text-[11px] tracking-[0.22em] text-brand uppercase sm:gap-4 sm:text-xs sm:tracking-[0.28em]">
                <span className="h-px w-10 bg-brand" />
                The structure
              </p>
              <p className="font-display text-[clamp(1.75rem,4.6vw,3.25rem)] leading-[1.1] tracking-tight text-foreground/90">
                Seven disciplines. Scattered, they overwhelm.
              </p>
            </div>

            <div className="cube-final absolute inset-x-0 bottom-0 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2">
              <p className="mb-5 flex items-center gap-3 text-[11px] tracking-[0.22em] text-brand uppercase sm:gap-4 sm:text-xs sm:tracking-[0.28em]">
                <span className="h-px w-10 bg-brand" />
                Clarity
              </p>
              <h2 className="font-display text-[clamp(2.4rem,7vw,5rem)] leading-[1.02] tracking-tight">
                Complexity,
                <br />
                <span className="text-brand">organized.</span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/70 sm:text-base">
                One connected system for every part of your finances, built and
                run by a single accountable team.
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[10px] tracking-[0.16em] text-muted uppercase sm:text-[11px]">
                {DISCIPLINES.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
