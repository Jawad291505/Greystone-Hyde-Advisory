"use client";

import { useEffect, useRef } from "react";
import AboutCoinsSmart from "./AboutCoinsSmart";

const clamp = (v) => Math.min(1, Math.max(0, v));

export default function AboutHero() {
  const section = useRef(null);
  const progress = useRef(0);

  useEffect(() => {
    const el = section.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf;
    let smooth = -1;
    let last = performance.now();
    const loop = () => {
      const rect = el.getBoundingClientRect();
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.25);
      last = now;
      const range = rect.height - window.innerHeight;
      const raw = reduce ? 1 : clamp(-rect.top / range);
      smooth = smooth < 0 || reduce ? raw : smooth + (raw - smooth) * (1 - Math.exp(-dt * 2.8));
      progress.current = smooth;
      el.style.setProperty("--p", smooth.toFixed(4));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={section} className="about-hero relative h-[260vh]" style={{ "--p": 0 }}>
      <div className="sticky top-0 h-svh overflow-hidden bg-background">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_45%,rgba(185,154,95,0.12),transparent)]"
        />

        <AboutCoinsSmart progress={progress} />

        <div className="pointer-events-none relative mx-auto flex h-full max-w-3xl flex-col items-center justify-end px-5 pb-16 text-center sm:px-6 lg:justify-center lg:pb-0">
          <div className="relative max-w-2xl">
            <div className="about-intro">
              <p className="mb-5 flex items-center justify-center gap-3 text-[11px] tracking-[0.22em] text-brand uppercase sm:text-xs sm:tracking-[0.28em]">
                <span className="h-px w-10 bg-brand" />
                About us
                <span className="h-px w-10 bg-brand" />
              </p>
              <p className="font-display text-[clamp(1.75rem,4.4vw,3rem)] leading-[1.15] tracking-tight text-foreground/90">
                Numbers should never be the hard part.
              </p>
            </div>

            <div className="about-final absolute inset-x-0 bottom-0 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2">
              <p className="mb-5 flex items-center justify-center gap-3 text-[11px] tracking-[0.22em] text-brand uppercase sm:text-xs sm:tracking-[0.28em]">
                <span className="h-px w-10 bg-brand" />
                Our belief
                <span className="h-px w-10 bg-brand" />
              </p>
              <h1 className="font-display text-[clamp(2.2rem,6.4vw,4.4rem)] leading-[1.05] tracking-tight">
                We exist to turn financial <span className="text-brand">complexity into clarity.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base">
                Every service we offer, every report we send, is built around one goal: making your
                numbers legible enough to act on with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
