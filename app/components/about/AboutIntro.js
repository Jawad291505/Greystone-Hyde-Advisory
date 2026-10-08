"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useIntroReady } from "../../lib/intro";

const ease = [0.22, 1, 0.36, 1];

// The copy rises in CSS as the preloader's curtain lifts (data-intro), so it
// is in the first paint and never waits for this script. Only the mark, which
// answers the pointer, is animated from here, once the curtain has lifted
// (useIntroReady).
const rise = (delay) => ({ "data-intro": "", style: { "--d": `${delay}s`, "--rise": "20px" } });

// The three pieces of the mark (public/logo.svg), inlined so each can settle
// into place in turn. Fills are the theme tokens, so the beige preview
// recolours it with the rest of the page.
const PIECES = [
  {
    fill: "var(--logo-blue)",
    from: { x: -5, y: -3 },
    d: "M28.62,7.22c-1.02-1.08-3.02-1.44-4.65-.51l-12.32,7.19c-1.19.68-2.36,1.85-2.35,3.09v14.52c-.02.33.14.5.46.31l11.66-6.8c1.54-.92,2.41-1.49,2.4-2.95l-.05-4.97-3.53,2.17c-1.31.74-4.52-.55-5.79-1.82-.14-.15,0-.3.15-.4l10.19-5.83c1.45-.79,3.8-.33,3.83,1.12v9.73c-.01,4.04-.5,4.09-4.14,6.28l-14.52,8.44c-2.36,1.42-5.46-.57-5.42-3.07v-17.33c-.1-1.83,1.52-4.79,3.68-6.08L23,1.85c3-1.61,5.76.15,5.62,5.37Z",
  },
  {
    fill: "var(--navy)",
    from: { x: 0, y: 5 },
    d: "M10.74,40.7c.98-.09,2.15-.2,3.35-.91l16.87-9.83c1.28-.66,1.86-2.12,1.8-3.18V8.26c.01-1.67-.56-3.39-1.35-4.57-.05-.18.03-.24.25-.16,2.5.94,5.84,3.97,5.81,7.42l-.03,16.55c-.12,3.76-2.55,5.97-5.54,7.57l-12.36,7.14c-2.35,1.26-6.76.46-8.85-1.27-.15-.14-.06-.22.05-.24Z",
  },
  {
    fill: "var(--navy)",
    from: { x: 5, y: 3 },
    d: "M45.95,15.97l-.03,16.54c-.12,3.76-2.55,5.97-5.53,7.57l-12.36,7.14c-2.35,1.25-6.77.45-8.85-1.27-.15-.14-.06-.23.05-.24.98-.09,2.15-.2,3.36-.91l16.41-9.47c.28-.15.52-.33.74-.52l-3.29-1.92c1.12-1.32,1.8-3.14,1.91-4.12l2.89,1.88V13.27c.01-1.67-.56-3.39-1.35-4.57-.06-.17.03-.24.25-.16,2.5.94,5.83,3.97,5.8,7.43Z",
  },
];

// The opening of the About page: who Greystone Hyde is, in plain words on
// the left, and the mark itself on the right, assembling once on a quiet
// plate of rings. Pointing at the plate eases the three pieces of the mark
// apart, lifts it slightly and draws a royal ring round it; leaving lets it
// settle back. Transform, opacity and one stroke only.
export default function AboutIntro() {
  const reduce = useReducedMotion();
  const ready = useIntroReady();
  // Once the mark has assembled, its pieces answer the pointer without the
  // staggered delays of the entrance
  const [entered, setEntered] = useState(false);

  return (
    <section aria-labelledby="about-title" className="relative overflow-x-clip bg-paper text-ink">
      <div className="mx-auto grid max-w-[88rem] gap-12 px-5 pt-32 pb-16 sm:px-8 sm:pt-36 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-12 lg:pt-44 lg:pb-20">
        {/* Who we are */}
        <div className="lg:col-span-6">
          <p
            {...rise(0)}
            className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-navy/70 uppercase"
          >
            <span className="h-px w-8 bg-royal" />
            About us
          </p>

          <h1
            {...rise(0.1)}
            id="about-title"
            className="mt-7 font-display text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.02] tracking-[-0.015em] text-balance"
          >
            Greystone Hyde is a London accounting and <em className="text-royal">advisory practice.</em>
          </h1>

          <p {...rise(0.22)} className="mt-8 max-w-[34rem] text-[17px] leading-[1.7] text-navy/90 sm:text-lg">
            We work directly with owners and finance teams, on the books, the
            tax, the payroll and the decisions that follow.
          </p>
          <p {...rise(0.3)} className="mt-5 max-w-[34rem] text-[17px] leading-[1.7] text-navy/80">
            Most businesses don&apos;t struggle because of bad decisions. They
            struggle because their numbers are unclear. We take everything that
            makes up a business&apos;s financial life and organise it into
            something you can actually read and act on.
          </p>
          <p {...rise(0.38)} className="mt-5 max-w-[34rem] text-[17px] leading-[1.7] text-navy/80">
            And we do it as a single accountable team, not a rotating cast of
            contacts, because trust is built through continuity.
          </p>
        </div>

        {/* The mark */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 1, ease, delay: entered ? 0 : 0.2 } },
            hover: { opacity: 1, y: 0 },
          }}
          initial={reduce ? false : "hidden"}
          animate={ready ? "show" : undefined}
          whileHover={reduce || !entered ? undefined : "hover"}
          onAnimationComplete={(v) => v === "show" && setEntered(true)}
          className="group relative mx-auto aspect-square w-full max-w-[26rem] lg:col-span-5 lg:col-start-8 lg:max-w-none"
        >
          {/* A quiet plate of rings; the dashed one turns very slowly (CSS only) */}
          <span aria-hidden className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,white,var(--sky)_75%)] shadow-[0_50px_90px_-60px_color-mix(in_srgb,var(--ink)_55%,transparent)]" />
          <span aria-hidden className="absolute inset-0 rounded-full border border-navy/10" />
          <span aria-hidden className="slow-turn absolute inset-[7%] rounded-full border border-dashed border-navy/15" />
          <span aria-hidden className="absolute inset-[16%] rounded-full border border-navy/[0.07]" />
          {/* Drawn round the mark while the plate is pointed at */}
          <svg viewBox="0 0 100 100" fill="none" aria-hidden className="pointer-events-none absolute inset-[16%] h-[68%] w-[68%] -rotate-90">
            <motion.circle
              cx={50}
              cy={50}
              r={49.6}
              stroke="var(--royal)"
              strokeWidth={0.6}
              strokeLinecap="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                show: { pathLength: 0, opacity: 0, transition: { duration: 0.6, ease } },
                hover: { pathLength: 1, opacity: 1, transition: { duration: 1.1, ease } },
              }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.svg
              viewBox="0 0 50 50"
              role="img"
              aria-label="Greystone Hyde"
              variants={{
                hidden: { scale: 1 },
                show: { scale: 1, transition: { duration: 0.7, ease } },
                hover: { scale: 1.07, transition: { duration: 0.7, ease } },
              }}
              className="w-[38%] overflow-visible"
            >
              {PIECES.map((p, i) => (
                <motion.path
                  key={i}
                  d={p.d}
                  fill={p.fill}
                  variants={{
                    hidden: { opacity: 0, ...p.from },
                    show: {
                      opacity: 1,
                      x: 0,
                      y: 0,
                      transition: entered ? { duration: 0.7, ease } : { duration: 1.3, ease, delay: 0.45 + i * 0.16 },
                    },
                    hover: { opacity: 1, x: p.from.x * 0.45, y: p.from.y * 0.45, transition: { duration: 0.7, ease, delay: i * 0.05 } },
                  }}
                />
              ))}
            </motion.svg>
            <p {...rise(1)} className="mt-[7%] font-display text-[clamp(1.7rem,2.6vw,2.4rem)] leading-none tracking-tight">
              Greystone Hyde
            </p>
            <p {...rise(1.1)} className="mt-3 font-mono text-[10px] tracking-[0.22em] text-navy/65 uppercase">
              Accounting &amp; Advisory · London
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
