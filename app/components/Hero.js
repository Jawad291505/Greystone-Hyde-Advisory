"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

// Each photograph in the composition: position (as % of the stage so the
// same arrangement scales from phone to desktop), scroll depth, reveal delay.
const frames = [
  {
    src: "/images/hero-meeting.jpg",
    alt: "Advisers reviewing printed financial reports together at a meeting table",
    caption: "Quarterly review",
    className: "right-0 top-0 h-[74%] w-[66%]",
    depth: -40,
    delay: 0.25,
    sizes: "(min-width: 1024px) 34vw, 66vw",
    position: "object-[50%_40%]",
    preload: true,
  },
  {
    src: "/images/hero-analysis.jpg",
    alt: "Accountant working through figures with a calculator and printed charts",
    caption: "Analysis",
    className: "left-0 top-[34%] h-[44%] w-[44%]",
    depth: -110,
    delay: 0.45,
    sizes: "(min-width: 1024px) 22vw, 44vw",
    position: "object-center",
  },
  {
    src: "/images/hero-consult.jpg",
    alt: "Business owners in a consultation with their adviser in a modern office",
    caption: "Client consultation",
    className: "bottom-0 right-[8%] h-[24%] w-[42%]",
    depth: -20,
    delay: 0.65,
    sizes: "(min-width: 1024px) 21vw, 42vw",
    position: "object-center",
  },
];

// One photograph: a clip-path reveal on load (wipes up from the bottom edge,
// with the image settling from a slight zoom inside it), then scroll-linked
// drift at its own depth so the three frames separate as the page moves.
function Frame({ f, progress, reduce }) {
  const y = useTransform(progress, [0, 1], [0, reduce ? 0 : f.depth]);

  return (
    <motion.figure style={{ y }} className={`absolute ${f.className}`}>
      <motion.div
        initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.4, ease, delay: f.delay }}
        className="relative h-full w-full overflow-hidden bg-mist shadow-[0_30px_60px_-30px_rgba(11,26,56,0.45)]"
      >
        <motion.div
          initial={reduce ? false : { scale: 1.18 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease, delay: f.delay }}
          className="absolute inset-0"
        >
          <Image
            src={f.src}
            alt={f.alt}
            fill
            preload={f.preload}
            sizes={f.sizes}
            className={`object-cover ${f.position}`}
          />
        </motion.div>
      </motion.div>
      <motion.figcaption
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: f.delay + 1 }}
        className="mt-2.5 hidden items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-navy/55 uppercase sm:flex"
      >
        <span className="h-px w-4 bg-royal/50" />
        {f.caption}
      </motion.figcaption>
    </motion.figure>
  );
}

// Headline line that rises out of its own mask.
function Line({ children, delay, reduce }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        initial={reduce ? false : { y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, ease, delay }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function FadeIn({ children, delay, reduce, className = "" }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const section = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.5 });
  const copyY = useTransform(progress, [0, 1], [0, reduce ? 0 : -60]);
  const panelY = useTransform(progress, [0, 1], [0, reduce ? 0 : 50]);

  return (
    <section
      ref={section}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-paper text-ink"
    >
      {/* Atmosphere: soft light-blue wash, brightest behind the photographs */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(60%_70%_at_78%_40%,var(--sky),transparent_70%),linear-gradient(180deg,var(--paper),#f4f7fc)]"
      />

      <div className="mx-auto grid min-h-[100svh] max-w-[88rem] grid-cols-1 gap-14 px-5 pt-32 pb-14 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pt-36 lg:pb-16">
        {/* Copy */}
        <motion.div
          style={{ y: copyY }}
          className="flex flex-col justify-between lg:col-span-6 lg:pr-6"
        >
          <div>
            <FadeIn reduce={reduce} delay={0.1}>
              <p className="flex items-center gap-4 text-[11px] font-medium tracking-[0.26em] text-royal uppercase">
                <span className="h-px w-10 bg-royal" />
                Accounting, tax &amp; advisory · London
              </p>
            </FadeIn>

            <h1
              id="hero-title"
              className="mt-8 font-display text-[clamp(3.1rem,8.4vw,7.4rem)] leading-[0.94] tracking-[-0.02em] text-ink lg:mt-10"
            >
              <Line reduce={reduce} delay={0.15}>Clear numbers.</Line>
              <Line reduce={reduce} delay={0.28}>
                <em className="text-royal">Considered</em> advice.
              </Line>
            </h1>

            <FadeIn reduce={reduce} delay={0.55} className="mt-8 max-w-md lg:mt-10">
              <p className="text-base leading-relaxed text-navy/75 sm:text-[17px]">
                Greystone Hyde is a London accounting and advisory practice. We
                work directly with owners and finance teams, on the books, the
                tax, the payroll and the decisions that follow.
              </p>
            </FadeIn>

            <FadeIn reduce={reduce} delay={0.7} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <a
                href="#contact"
                className="group inline-flex items-center gap-4 rounded-full bg-navy py-2 pr-2 pl-7 text-sm font-medium tracking-wide text-white transition-colors duration-500 hover:bg-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
              >
                Book a consultation
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-transform duration-500 group-hover:translate-x-1">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
              </a>
              <a
                href="#services"
                className="group relative text-sm font-medium text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
              >
                Explore our services
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-navy/25" />
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-royal transition-transform duration-500 group-hover:scale-x-100" />
              </a>
            </FadeIn>
          </div>

          {/* Practice areas as quiet metadata — describes what we do, makes no claims */}
          <FadeIn reduce={reduce} delay={0.9} className="mt-16 hidden lg:block">
            <dl className="grid max-w-lg grid-cols-3 border-t border-navy/10 pt-5">
              {[
                ["01", "Accounting & reporting"],
                ["02", "Tax & payroll"],
                ["03", "Business advisory"],
              ].map(([n, label]) => (
                <div key={n}>
                  <dt className="font-mono text-[10px] text-royal">{n}</dt>
                  <dd className="mt-1.5 pr-4 text-[13px] leading-snug text-navy/70">{label}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </motion.div>

        {/* Photographic composition */}
        <div className="relative lg:col-span-6">
          {/* Brand anchor: a navy → royal plane the photographs sit against, bleeding off the right edge */}
          <motion.div
            aria-hidden
            style={{ y: panelY }}
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, ease, delay: 0.05 }}
            className="absolute top-[12%] -right-5 bottom-[18%] left-[30%] -z-10 origin-right bg-[linear-gradient(155deg,var(--navy)_0%,var(--royal)_100%)] sm:-right-8 lg:-right-12 min-[88rem]:right-[calc((88rem_-_100vw)/2_-_3rem)]"
          />

          <div className="relative mx-auto aspect-[4/5] w-full max-w-xl sm:aspect-[5/5] lg:mx-0 lg:aspect-auto lg:h-full lg:max-w-none lg:min-h-[36rem]">
            {frames.map((f) => (
              <Frame key={f.src} f={f} progress={progress} reduce={reduce} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
