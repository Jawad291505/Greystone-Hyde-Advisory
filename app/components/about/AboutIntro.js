"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useIntroReady } from "../../lib/intro";
import { PIECES } from "../../lib/logoMark";

const ease = [0.22, 1, 0.36, 1];

// The copy rises in CSS as the preloader's curtain lifts (data-intro), so it
// is in the first paint and never waits for this script. Only the mark, which
// answers the pointer, is animated from here, once the curtain has lifted
// (useIntroReady).
const rise = (delay) => ({ "data-intro": "", style: { "--d": `${delay}s`, "--rise": "20px" } });

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
