"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useIntroReady } from "../lib/intro";

const ease = [0.22, 1, 0.36, 1];

// Nothing plays until the preloader hands over (useIntroReady): until then
// every element holds its `initial` state.
//
// One choreographed sequence — "coming into focus". Each step starts as the
// previous one resolves: the ledger rules draw, the photograph sharpens while
// it fills the screen, the frame retracts to its resting place, the headline
// focuses, the total is double-ruled, then the supporting copy arrives.
const T = {
  rules: 0,
  focus: 0.1,
  settle: 0.75,
  type: 1.1,
  total: 1.85,
  copy: 2.0,
  detail: 2.15,
};

// Shared by the ink headline and its paper-white twin inside the photo frame,
// so the two lay out identically and the colour flips exactly at the frame edge.
const CONTAINER = "mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12";
const TOP = "pt-32 sm:pt-36 lg:pt-[clamp(8rem,21svh,13rem)]";

// Left edge of a column on the container's 12-column grid, as a length in the
// full-width stage's own box.
const col = (fraction) =>
  `calc(max(0px, (100% - 88rem) / 2) + 3rem + (min(100%, 88rem) - 6rem) * ${fraction})`;

const DESKTOP = "(min-width: 1024px)";
function subscribeDesktop(cb) {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

const londonTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});
function subscribeClock(cb) {
  const id = setInterval(cb, 15000);
  return () => clearInterval(id);
}

// Shown over the full-bleed photograph once the hero has been scrolled open.
// PLACEHOLDER FIGURES — replace with the practice's real numbers before launch.
const STATS = [
  { value: "£1.2bn", label: "Client turnover advised" },
  { value: "420+", label: "Businesses on the books" },
  { value: "96%", label: "Client retention" },
  { value: "18 yrs", label: "In practice" },
];

const fadeIn = (reduce, ready, delay) => ({
  initial: reduce ? false : { opacity: 0, y: 14 },
  animate: ready ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 1, ease, delay },
});

// Accountant's ruled paper: hairlines on the layout's own column grid.
function LedgerRules({ reduce }) {
  const ready = useIntroReady();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className={`${CONTAINER} grid h-full grid-cols-4 lg:grid-cols-12`}>
        {Array.from({ length: 12 }, (_, i) => (
          <motion.span
            key={i}
            initial={reduce ? false : { scaleY: 0 }}
            animate={ready ? { scaleY: 1 } : undefined}
            transition={{ duration: 1.3, ease, delay: T.rules + i * 0.045 }}
            className={`origin-top border-l border-navy/[0.07] ${i >= 4 ? "hidden lg:block" : ""} ${
              i === 3 ? "border-r lg:border-r-0" : ""
            } ${i === 11 ? "border-r" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

// A headline line that resolves out of blur rather than sliding in.
function Line({ children, delay, reduce }) {
  const ready = useIntroReady();
  return (
    <motion.span
      initial={reduce ? false : { opacity: 0, filter: "blur(16px)", y: "0.14em" }}
      animate={ready ? { opacity: 1, filter: "blur(0px)", y: 0 } : undefined}
      transition={{ duration: 1.3, ease, delay }}
      className="block"
    >
      {children}
    </motion.span>
  );
}

// Rendered twice: once in ink on the page, once in paper-white inside the
// photograph's clip. `twin` is the decorative copy.
function Headline({ twin = false, reduce }) {
  const ready = useIntroReady();
  const Tag = twin ? "p" : "h1";
  return (
    <Tag
      id={twin ? undefined : "hero-title"}
      aria-hidden={twin || undefined}
      className={`font-editorial text-[clamp(3.25rem,8.2vw,9.5rem)] leading-[0.92] font-[350] tracking-[-0.03em] [font-kerning:normal] [font-variation-settings:'opsz'_72] ${
        twin ? "text-paper" : "text-ink"
      }`}
    >
      <Line reduce={reduce} delay={T.type}>
        Clear{" "}
        <span className="relative inline-block">
          numbers
          {/* The accountant's double rule under a final total */}
          {[0.17, 0.12].map((b, i) => (
            <motion.span
              key={b}
              aria-hidden
              initial={reduce ? false : { scaleX: 0 }}
              animate={ready ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.9, ease, delay: T.total + i * 0.12 }}
              style={{ bottom: `${b}em` }}
              className={`absolute inset-x-[0.04em] h-[max(1px,0.012em)] origin-left ${
                twin ? "bg-paper/80" : "bg-royal"
              }`}
            />
          ))}
        </span>
        .
      </Line>
      <Line reduce={reduce} delay={T.type + 0.14}>
        <em className={twin ? "text-sky" : "text-royal"}>Considered</em> advice.
      </Line>
    </Tag>
  );
}

// The one primary action on the page, as a solid pill. `twin` is the
// paper-white copy over the open photograph (not focusable; the ink one is).
function PrimaryCta({ twin = false }) {
  return (
    <a
      href="#contact"
      tabIndex={twin ? -1 : undefined}
      className={`group inline-flex items-center gap-4 rounded-full py-2 pr-2 pl-7 text-sm font-medium tracking-wide transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal ${
        twin
          ? "bg-paper text-navy hover:bg-sky"
          : "bg-navy text-white shadow-[0_18px_40px_-18px_rgba(20,42,92,0.6)] hover:bg-royal"
      }`}
    >
      Book a consultation
      <span
        className={`grid h-10 w-10 place-items-center rounded-full text-white transition-transform duration-500 group-hover:translate-x-1 ${
          twin ? "bg-navy" : "bg-white/15"
        }`}
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </span>
    </a>
  );
}

export default function Hero() {
  const section = useRef(null);
  const reduce = useReducedMotion();
  const ready = useIntroReady();
  const desktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP).matches, () => false);
  const time = useSyncExternalStore(subscribeClock, () => londonTime.format(new Date()), () => "");

  // intro: 0 = photograph fills the stage, 1 = frame at rest.
  const intro = useMotionValue(0);
  // gate: the scroll choreography only runs on desktop with motion allowed.
  const gate = useMotionValue(0);
  const wide = useMotionValue(0);

  useEffect(() => {
    if (reduce) {
      intro.set(1);
      return;
    }
    if (!ready) return;
    const controls = animate(intro, 1, { duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: T.settle });
    return () => controls.stop();
  }, [intro, reduce, ready]);

  useEffect(() => {
    gate.set(desktop && !reduce ? 1 : 0);
    wide.set(desktop ? 1 : 0);
  }, [gate, wide, desktop, reduce]);

  // On desktop the section is taller than the screen; while its stage is
  // pinned, scrolling hands off to the next section by opening the photograph
  // back out to full bleed under the white headline.
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const expand = useTransform(
    () => gate.get() * Math.min(1, Math.max(0, (scrollYProgress.get() - 0.06) / 0.72)),
  );

  const p = useTransform(() => intro.get() * (1 - expand.get()));
  const clipPath = useTransform(
    p,
    // Corners round with the frame, and square off again as it opens to full bleed.
    (v) =>
      `inset(calc(var(--t) * ${v}) calc(var(--r) * ${v}) calc(var(--b) * ${v}) calc(var(--l) * ${v}) round calc(var(--radius-panel) * ${v}))`,
  );
  // At rest the frame shows the stage's right half; shifting the photo right
  // with the clip keeps the pencil hand centred in it, and at full bleed the
  // whole picture is back in view.
  const imageX = useTransform(() => `${20 * p.get() * wide.get()}%`);
  const imageScale = useTransform(() => 1 + 0.07 * gate.get() * scrollYProgress.get());
  const copyOpacity = useTransform(expand, [0, 0.3], [1, 0]);
  const copyY = useTransform(expand, [0, 0.4], [0, -48]);
  const detailY = useTransform(expand, [0, 0.5], [0, 90]);
  // The paper copy's full-bleed counterpart: arrives once the photo is open.
  const openOpacity = useTransform(expand, [0.55, 0.9], [0, 1]);
  const openY = useTransform(expand, [0.55, 1], [28, 0]);
  const openPointer = useTransform(openOpacity, (v) => (v > 0.5 ? "auto" : "none"));

  return (
    <section
      ref={section}
      aria-labelledby="hero-title"
      className="relative bg-paper bg-[radial-gradient(70%_60%_at_18%_32%,var(--sky),transparent_72%)] text-ink lg:h-[190svh] motion-reduce:lg:h-auto"
    >
      <div
        style={desktop ? { "--l": col(0.5) } : undefined}
        className="relative isolate [--b:0%] [--l:1.25rem] [--r:1.25rem] [--t:0%] sm:[--l:2rem] sm:[--r:2rem] lg:[--r:0%] lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden lg:[--b:10%] lg:[--t:15%]"
      >
        <LedgerRules reduce={reduce} />

        {/* Headline and copy, on paper */}
        <div className={`${CONTAINER} ${TOP} relative pb-14 lg:pb-0`}>
          <Headline reduce={reduce} />

          <motion.div style={{ opacity: copyOpacity, y: copyY }}>
            <motion.p
              {...fadeIn(reduce, ready, T.copy)}
              className="mt-9 max-w-[26rem] text-base leading-relaxed text-navy/75 sm:text-[17px] lg:mt-11"
            >
              Greystone Hyde is a London accounting and advisory practice. We
              work directly with owners and finance teams, on the books, the
              tax, the payroll and the decisions that follow.
            </motion.p>

            <motion.div
              {...fadeIn(reduce, ready, T.copy + 0.12)}
              className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-11"
            >
              <PrimaryCta />
              <a
                href="#services"
                className="text-sm tracking-wide text-navy/70 underline decoration-navy/25 underline-offset-[6px] transition-colors duration-300 hover:text-royal hover:decoration-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
              >
                Our services
              </a>
            </motion.div>

            {/* Trust note: the reply commitment made in the contact section */}
            <motion.p
              {...fadeIn(reduce, ready, T.copy + 0.22)}
              className="mt-6 flex items-center gap-3 text-[13px] text-navy/60"
            >
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-royal" />
              A qualified accountant replies within one working day.
            </motion.p>
          </motion.div>
        </div>

        {/* Metadata: facts about where the practice is, no claims */}
        <motion.div style={{ opacity: copyOpacity }} className="absolute inset-x-0 bottom-0 hidden lg:block">
          <motion.div {...fadeIn(reduce, ready, T.copy + 0.3)} className={`${CONTAINER} pb-[4svh]`}>
            <dl className="flex w-[min(30rem,32%)] gap-10 border-t border-navy/10 pt-4 font-mono text-[10px] tracking-[0.18em] text-navy/55 uppercase">
              <div>
                <dt className="sr-only">Practice</dt>
                <dd>London</dd>
              </div>
              <div>
                <dt className="sr-only">Coordinates</dt>
                <dd>51.51° N · 0.13° W</dd>
              </div>
              <div>
                <dt className="sr-only">Local time</dt>
                <dd>{time || " "}</dd>
              </div>
            </dl>
          </motion.div>
        </motion.div>

        {/* The photograph. On desktop it spans the whole stage and is clipped to
            its resting rectangle, so it can open to full screen on load and on
            scroll; the white headline twin lives inside the same clip. */}
        <motion.figure
          style={{ clipPath }}
          className="relative m-0 aspect-[4/5] overflow-hidden bg-[linear-gradient(155deg,var(--navy)_0%,var(--royal)_100%)] sm:aspect-[5/4] lg:absolute lg:inset-0 lg:aspect-auto"
        >
          <motion.div
            initial={reduce ? false : { filter: "blur(28px)", scale: 1.14 }}
            animate={ready ? { filter: "blur(0px)", scale: 1 } : undefined}
            transition={{ duration: 2.1, ease, delay: T.focus }}
            className="absolute inset-0"
          >
            <motion.div style={{ x: imageX, scale: imageScale }} className="absolute inset-0">
              <Image
                src="/images/desk-documents.jpg"
                alt="Two advisers working through figures on printed working papers at a desk"
                fill
                preload
                sizes="100vw"
                className="object-cover object-[58%_50%] [filter:saturate(0.5)_contrast(1.08)_brightness(0.97)] lg:object-center"
              />
            </motion.div>
            {/* House grade: navy-tinted shadows, deepest where the type crosses */}
            <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(11,26,56,0.8)_0%,rgba(20,42,92,0.55)_45%,rgba(36,82,181,0.3)_100%)] mix-blend-multiply" />
            <div className="hero-grain absolute inset-0 opacity-[0.16]" />
          </motion.div>

          {/* Brand lockup, above the white headline once the photo is open.
              Offset up from the headline's own top padding so the headline
              itself stays aligned with its ink twin. */}
          <motion.div
            aria-hidden
            style={{ opacity: openOpacity, y: openY }}
            className="absolute inset-x-0 top-[calc(clamp(8rem,21svh,13rem)-3.5rem)] hidden lg:block"
          >
            <div className={`${CONTAINER} flex items-center gap-4`}>
              <Image src="/logo.svg" alt="" width={28} height={28} className="brightness-0 invert" />
              <span className="font-display text-xl tracking-tight text-paper">Greystone Hyde</span>
              <span className="h-px w-8 bg-paper/35" />
              <span className="font-mono text-[10px] tracking-[0.18em] text-paper/60 uppercase">
                Accounting &amp; Advisory · London
              </span>
            </div>
          </motion.div>

          <div aria-hidden className={`${CONTAINER} ${TOP} relative hidden lg:block`}>
            <Headline twin reduce={reduce} />

            <motion.div
              style={{ opacity: openOpacity, y: openY, pointerEvents: openPointer }}
              className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-5"
            >
              <PrimaryCta twin />
              <a
                href="#services"
                tabIndex={-1}
                className="text-sm tracking-wide text-paper/75 underline decoration-paper/30 underline-offset-[6px] transition-colors duration-300 hover:text-paper hover:decoration-sky"
              >
                Our services
              </a>
            </motion.div>
          </div>

          {/* Performance figures, over the open photograph */}
          <motion.div
            style={{ opacity: openOpacity, y: openY }}
            className="absolute inset-x-0 bottom-0 hidden lg:block"
          >
            <div className={`${CONTAINER} pb-[6svh]`}>
              <dl className="grid w-[min(60rem,68%)] grid-cols-4 border-t border-paper/20">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col-reverse justify-end border-l border-paper/15 pt-5 pr-4 pl-5 first:border-l-0 first:pl-0"
                  >
                    <dt className="mt-2.5 font-mono text-[10px] tracking-[0.18em] text-paper/70 uppercase">
                      {s.label}
                    </dt>
                    <dd className="font-editorial text-[clamp(2rem,3vw,3rem)] leading-none font-[350] tracking-[-0.02em] text-paper [font-variation-settings:'opsz'_72]">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>

          <motion.figcaption
            {...fadeIn(reduce, ready, T.copy + 0.2)}
            className="absolute right-5 bottom-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-paper/75 uppercase sm:right-8 lg:right-12 lg:bottom-[calc(10%+1.1rem)]"
          >
            <span className="text-paper/45">Fig. 01</span>
            <span className="h-px w-4 bg-paper/40" />
            Working papers
          </motion.figcaption>
        </motion.figure>

        {/* One detail crop, overlapping the main frame's edge (desktop only) */}
        <motion.figure
          style={{ left: col(0.4), opacity: copyOpacity, y: detailY }}
          className="absolute bottom-[6%] m-0 hidden w-[clamp(12rem,16vw,18rem)] lg:block"
        >
          <motion.div
            initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
            animate={ready ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
            transition={{ duration: 1.2, ease, delay: T.detail }}
            className="relative aspect-[4/3] overflow-hidden rounded-inner bg-navy shadow-[0_30px_60px_-30px_rgba(11,26,56,0.55)]"
          >
            {/* Oversized and offset so the frame shows only the hands and papers */}
            <div className="absolute top-[-140%] left-[-65%] h-[270%] w-[294%]">
              <Image
                src="/images/team-office.jpg"
                alt="An adviser's hand resting on printed reports during a client review"
                fill
                loading="eager"
                sizes="(min-width: 1024px) 47vw, 1px"
                className="object-cover [filter:saturate(0.5)_contrast(1.08)_brightness(0.97)]"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(20,42,92,0.45),rgba(36,82,181,0.25))] mix-blend-multiply" />
            <div className="hero-grain absolute inset-0 opacity-[0.16]" />
          </motion.div>
          <motion.figcaption
            {...fadeIn(reduce, ready, T.detail + 0.6)}
            className="mt-2.5 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-navy/55 uppercase"
          >
            <span className="text-navy/35">Fig. 02</span>
            <span className="h-px w-4 bg-royal/50" />
            Client review
          </motion.figcaption>
        </motion.figure>
      </div>

      {/* Below desktop the figures can't ride the photograph open, so they sit
          under it as a quiet ledger instead */}
      <div className={`${CONTAINER} pt-8 pb-4 sm:pt-10 lg:hidden`}>
        <dl className="grid grid-cols-2 border-t border-navy/10 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col-reverse justify-end border-navy/10 py-5 max-sm:[&:nth-child(-n+2)]:border-b sm:border-l sm:px-5 sm:first:border-l-0 sm:first:pl-0 ${
                i % 2 ? "border-l pl-5" : "pr-5"
              }`}
            >
              <dt className="mt-2 font-mono text-[10px] tracking-[0.16em] text-navy/55 uppercase">{s.label}</dt>
              <dd className="font-editorial text-[2rem] leading-none font-[350] tracking-[-0.02em] text-ink [font-variation-settings:'opsz'_72]">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
