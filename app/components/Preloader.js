"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { markIntroReady } from "../lib/intro";

const ease = [0.22, 1, 0.36, 1];
const easeIn = [0.55, 0, 0.9, 0.3];
// Slow start, long glide: the panel lifts like a sheet of paper.
const lift = [0.7, 0.05, 0.13, 1];

const WORDS = ["Greystone", "Hyde"];
const MIN_MS = 2200;
const MAX_MS = 6000;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const pad = (v) => String(Math.round(v)).padStart(3, "0");

// Every full page load: a paper panel where the ledger rules draw, the
// wordmark rises and a rule fills with the load. At 100 a second rule closes
// it off (an accountant's double rule under a balanced total), then the
// panel lifts and hands over to the hero's own intro.
//
// Server-rendered in its starting state so the first paint is already the
// panel. Hidden by CSS under reduced motion and without JS. Client-side
// navigation doesn't remount the root layout, so it never replays mid-visit.
export default function Preloader() {
  const root = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markIntroReady();
      return;
    }

    let cancelled = false;
    const html = document.documentElement;
    html.style.overflow = "hidden";

    const q = (s) => [...el.querySelectorAll(s)];
    const words = q("[data-pl-word]");
    const count = el.querySelector("[data-pl-count]");
    const label = el.querySelector("[data-pl-label]");
    const [fill, close] = q("[data-pl-rule]");
    const fades = q("[data-pl-fade]");

    q("[data-pl-col]").forEach((c, i) =>
      animate(c, { scaleY: [0, 1] }, { duration: 1.3, ease, delay: i * 0.045 }),
    );
    words.forEach((w, i) => animate(w, { y: ["110%", "0%"] }, { duration: 1.1, ease, delay: 0.2 + i * 0.09 }));
    fades.forEach((f) => animate(f, { opacity: [0, 1] }, { duration: 0.8, ease, delay: 0.6 }));

    const progress = { v: 0 };
    const paint = (v) => {
      progress.v = v;
      count.textContent = pad(v);
      fill.style.transform = `scaleX(${v / 100})`;
    };
    const loading = animate(0, 92, { duration: 3.4, ease: [0.16, 1, 0.3, 1], onUpdate: paint });

    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((r) => window.addEventListener("load", r, { once: true }));

    Promise.all([
      Promise.race([Promise.all([document.fonts?.ready, loaded]), wait(MAX_MS)]),
      wait(MIN_MS),
    ]).then(async () => {
      if (cancelled) return;
      loading.stop();
      await animate(progress.v, 100, { duration: 0.45, ease: [0.45, 0, 0.55, 1], onUpdate: paint });
      if (cancelled) return;

      label.textContent = "Balanced";
      await animate(close, { scaleX: [0, 1] }, { duration: 0.55, ease });
      if (cancelled) return;

      fades.forEach((f) => animate(f, { opacity: 0 }, { duration: 0.35, ease: "easeOut" }));
      words.forEach((w, i) => animate(w, { y: "-110%" }, { duration: 0.65, ease: easeIn, delay: 0.1 + i * 0.05 }));
      await wait(450);
      if (cancelled) return;

      // Hand over as the panel starts to lift, so the hero is already
      // coming into focus underneath it.
      html.style.overflow = "";
      markIntroReady();
      await animate(el, { y: "-100%" }, { duration: 1.15, ease: lift });
      if (!cancelled) setDone(true);
    });

    return () => {
      cancelled = true;
      loading.stop();
      html.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      id="preloader"
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-paper text-ink will-change-transform"
    >
      {/* Ledger rules, on the same column grid as the hero's */}
      <div className="pointer-events-none absolute inset-0">
        <div className="mx-auto grid h-full max-w-[88rem] grid-cols-4 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              data-pl-col
              style={{ transform: "scaleY(0)" }}
              className={`origin-top border-l border-navy/[0.07] ${i >= 4 ? "hidden lg:block" : ""} ${
                i === 3 ? "border-r lg:border-r-0" : ""
              } ${i === 11 ? "border-r" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="relative">
        <p className="flex gap-[0.22em] font-editorial text-[clamp(3rem,12.5vw,9rem)] leading-none font-[350] tracking-[-0.03em] [font-variation-settings:'opsz'_72]">
          {WORDS.map((w) => (
            // Padded mask so the descenders of y aren't clipped
            <span key={w} className="-mb-[0.16em] block overflow-hidden pb-[0.16em]">
              <span data-pl-word className="block" style={{ transform: "translateY(110%)" }}>
                {w}
              </span>
            </span>
          ))}
        </p>

        <div className="relative mt-5 h-[7px] sm:mt-7">
          <span
            data-pl-rule
            style={{ transform: "scaleX(0)" }}
            className="absolute inset-x-0 top-0 h-px origin-left bg-ink/70"
          />
          <span
            data-pl-rule
            style={{ transform: "scaleX(0)" }}
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-royal"
          />
        </div>

        <p
          data-pl-fade
          style={{ opacity: 0 }}
          className="mt-5 font-mono text-[10px] tracking-[0.2em] text-navy/55 uppercase sm:mt-6"
        >
          Accounting · Tax · Payroll · Advisory
        </p>
      </div>

      <div
        data-pl-fade
        style={{ opacity: 0 }}
        className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[88rem] items-end justify-between px-5 pb-6 font-mono text-[10px] tracking-[0.18em] text-navy/55 uppercase sm:px-8 lg:px-12 lg:pb-8"
      >
        <span>
          Greystone Hyde<span className="hidden sm:inline"> Advisory</span> — London
        </span>
        <span className="flex gap-3 tabular-nums">
          <span data-pl-label>Reconciling</span>
          <span className="text-ink">
            <span data-pl-count>000</span>
          </span>
        </span>
      </div>
    </div>
  );
}
