"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import LineIcon from "./LineIcons";
import ReasonArt from "./ReasonArt";

const ease = [0.22, 1, 0.36, 1];
// How long each reason holds while the section plays itself
const HOLD = 6;
// A deliberate hover intent, so sweeping the pointer down the list doesn't
// swap the photograph and redraw the diagram for every row it crosses
const INTENT_MS = 120;

// `fig` captions the diagram, as a plate in a report would be captioned.
// `image` is the photograph; `at` is its focal point in the circle.
const reasons = [
  {
    icon: "target",
    title: "Business-first advice",
    body: "We read your numbers against your goals, not just the compliance checklist.",
    fig: "Plotted against your goal",
    image: "/images/hero-consult.jpg",
    at: "50% 40%",
  },
  {
    icon: "precision",
    title: "Precision in reporting",
    body: "Clean, reconciled books and reports you can act on without a translator.",
    fig: "Every line reconciled",
    image: "/images/desk-documents.jpg",
    at: "58% 50%",
  },
  {
    icon: "proactive",
    title: "Proactive, not reactive",
    body: "Risks, reliefs and deadlines flagged before they become problems.",
    fig: "Flagged before the deadline",
    image: "/images/hero-analysis.jpg",
    at: "50% 50%",
  },
  {
    icon: "fees",
    title: "Fixed, transparent fees",
    body: "Agreed up front, in writing. No surprise invoices at year end.",
    fig: "One agreed fee, twelve months",
    image: "/images/advisory-review.jpg",
    at: "55% 50%",
  },
  {
    icon: "cloud",
    title: "Modern, cloud-based finance",
    body: "Live figures in Xero, QuickBooks or Sage, never a year out of date.",
    fig: "Three ledgers, one live picture",
    image: "/images/team-office.jpg",
    at: "50% 50%",
  },
  {
    icon: "shield",
    title: "Discreet by default",
    body: "Your affairs stay yours. Confidentiality is built into how we work.",
    fig: "Your affairs, kept yours",
    image: "/images/hero-meeting.jpg",
    at: "50% 40%",
  },
];

const num = (i) => String(i + 1).padStart(2, "0");

const DESKTOP = "(min-width: 1024px)";
function subscribeDesktop(cb) {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

// Desktop geometry, in units of --u (a length that scales with the viewport,
// set on the stage). A navy disc sits on the photograph's rim at ten o'clock;
// the six reasons sit as nodes down its right-hand arc, evenly spaced by
// height so their labels never collide, each with a leader out to its label.
const u = (n) => `calc(var(--u) * ${n})`;
const BIG = 30; // diameter of the photograph
const BIG_LEFT = 6;
const BIG_TOP = 1; // headroom for the disc, which rides a little above the rim
const SMALL = 16; // diameter of the navy disc
const NODE = 3.8;
const CX = BIG_LEFT + BIG / 2;
const CY = BIG_TOP + BIG / 2;
// The disc's centre: on the rim, 150° round from three o'clock
const DISC = { x: CX - (BIG / 2) * Math.cos(Math.PI / 6), y: CY - (BIG / 2) * Math.sin(Math.PI / 6) };
const HEIGHT = BIG_TOP + BIG;
const NODES = [-12.3, -7.4, -2.5, 2.5, 7.4, 12.3].map((dy) => ({
  x: CX + Math.sqrt((BIG / 2) ** 2 - dy ** 2),
  y: CY + dy,
}));
// Leader and label offsets from a node's centre
const LEAD_FROM = NODE / 2 + 0.5;
const LEAD_TO = 4.6;
const LABEL_AT = 5.3;

const stageIn = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } };
const rise = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.1, ease } },
};
const slide = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 1.1, ease } },
};
const pop = {
  hidden: { opacity: 0, scale: 0.4 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease } },
};
const drawX = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.6, ease } },
};
const fade = {
  hidden: { opacity: 0, x: 12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

// The round badge that carries a reason's icon, on the arc or in the list
function Node({ r, on, className = "" }) {
  return (
    <span
      className={`grid place-items-center rounded-full border transition-[background-color,border-color,box-shadow] duration-500 ${
        on
          ? "border-navy bg-navy shadow-[0_18px_36px_-16px_color-mix(in_srgb,var(--navy)_70%,transparent)]"
          : "border-navy/15 bg-white shadow-[0_14px_30px_-18px_color-mix(in_srgb,var(--ink)_45%,transparent)]"
      } ${className}`}
    >
      <LineIcon name={r.icon} className={`h-[58%] w-[58%] transition-colors duration-500 ${on ? "!text-glint" : ""}`} />
    </span>
  );
}

// The photograph: the six stacked and cross-faded, left close to their own
// colour, with the number of the reason in focus set large over the lower
// half and a timer ring round the rim.
//
// Kept cheap on purpose: the photographs only ever change opacity and scale
// (both handled by the compositor, no blend modes or filters over them) and
// they load lazily as the section approaches.
function Plate({ active, playing, reduce, compact = false }) {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden rounded-full bg-navy">
        {reasons.map((r, i) => (
          <Image
            key={r.image}
            src={r.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, 90vw"
            style={{ objectPosition: r.at }}
            // The photograph in focus drifts in very slowly while it holds
            className={`object-cover transition-[opacity,scale] duration-[900ms,7000ms] ease-out motion-reduce:transition-none ${
              i === active ? "scale-[1.06] opacity-100" : "scale-100 opacity-0"
            }`}
          />
        ))}
        {/* A light navy wash to hold the six photographs together, then a
            deeper foot where the number and caption sit */}
        <div aria-hidden className="absolute inset-0 bg-[color-mix(in_srgb,var(--navy)_18%,transparent)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(to_top,color-mix(in_srgb,var(--ink)_88%,transparent)_8%,color-mix(in_srgb,var(--ink)_45%,transparent)_55%,transparent)]" />

        <div aria-hidden className={`absolute inset-x-0 bottom-[9%] flex flex-col items-center text-center text-white ${compact ? "" : "pl-[8%]"}`}>
          <p className="flex items-baseline gap-2 font-display leading-none tracking-[-0.03em] tabular-nums">
            <span className="block overflow-hidden text-[clamp(4rem,6.4vw,6rem)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: "35%" }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: "-35%" }}
                  transition={{ duration: 0.3, ease }}
                  className="block"
                >
                  {num(active)}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="font-mono text-[11px] tracking-[0.16em] text-white/70">/ {num(reasons.length - 1)}</span>
          </p>
        </div>
      </div>

      {/* A slow dashed orbit just outside the circle (CSS only), and a timer
          ring that fills once round while the section plays itself */}
      <span aria-hidden className="slow-turn absolute -inset-[3.5%] rounded-full border border-dashed border-navy/15" />
      <svg viewBox="0 0 100 100" fill="none" aria-hidden className="pointer-events-none absolute -top-[1.75%] -left-[1.75%] h-[103.5%] w-[103.5%]">
        {playing && (
          <motion.circle
            key={active}
            cx={50}
            cy={50}
            r={49.4}
            stroke="var(--royal)"
            strokeWidth={0.5}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: HOLD, ease: "linear" }}
          />
        )}
      </svg>
    </>
  );
}

// The navy disc: the diagram of the reason in focus, with its lettering and
// its caption. `bare` is the small disc below desktop, where neither would
// be legible. Mounted only while `live` (on screen, and in the layout
// actually showing), so nothing animates out of sight.
function Disc({ active, live, reduce, bare = false }) {
  const current = reasons[active];
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute -top-1/4 right-[-25%] h-[90%] w-[85%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--royal)_60%,transparent),transparent)]" />
      <span aria-hidden className={`relative block ${bare ? "w-[74%]" : "w-[80%]"}`}>
        {live && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current.title}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="block"
            >
              <ReasonArt name={current.icon} bare={bare} />
              {!bare && (
                <span className="mx-auto mt-[3%] flex max-w-[72%] items-center justify-center gap-2 text-center font-mono text-[9px] leading-snug tracking-[0.16em] text-white/80 uppercase">
                  <span className="h-px w-3 shrink-0 bg-glint" />
                  {current.fig}
                  <span className="h-px w-3 shrink-0 bg-glint" />
                </span>
              )}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
    </>
  );
}

// Six reasons round a circle, on the bright page. The photograph of the
// reason in focus fills the large circle with its number set over it; a navy
// disc on its edge draws that reason's diagram; the six sit as nodes down
// the circle's arc with their copy alongside. Pointing at, focusing or tapping a reason brings it in. Left alone,
// the section plays through the six, a ring round the photograph filling as
// a timer. It also carries what the former Expertise section said about who
// a client works with, and keeps its anchor.
export default function Reasons() {
  const reduce = useReducedMotion();
  const stage = useRef(null);
  const inView = useInView(stage, { amount: 0.3 });
  const [active, setActive] = useState(0);
  // Playing by itself until the visitor picks a reason
  const [auto, setAuto] = useState(true);
  const playing = auto && inView && !reduce;
  const intent = useRef();
  // Both layouts are in the markup (one hidden by CSS); only the one on
  // screen mounts its diagram and timer, so the hidden copy animates nothing.
  const desktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP).matches, () => false);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % reasons.length), HOLD * 1000);
    return () => clearTimeout(id);
  }, [playing, active]);

  useEffect(() => () => clearTimeout(intent.current), []);

  const pick = (i) => {
    clearTimeout(intent.current);
    setAuto(false);
    setActive(i);
  };
  const hover = (i) => {
    clearTimeout(intent.current);
    intent.current = setTimeout(() => pick(i), INTENT_MS);
  };
  const cancel = () => clearTimeout(intent.current);

  return (
    <section id="people" aria-labelledby="reasons-title" className="relative scroll-mt-20 bg-paper text-ink">
      <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-8 lg:px-12 lg:py-14">
        <div className="flex items-center justify-between border-t border-navy/10 pt-5 font-mono text-[10px] tracking-[0.2em] text-navy/60 uppercase">
          <span>04 — Six reasons</span>
          <span className="hidden sm:inline">Every figure reviewed, every return checked</span>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease }}
          className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-12 lg:items-end lg:gap-8"
        >
          <h2
            id="reasons-title"
            className="font-display text-[clamp(2.2rem,4.2vw,3.5rem)] leading-[1.02] tracking-[-0.015em] text-balance lg:col-span-6"
          >
            Six reasons clients <em className="text-royal">stay with us.</em>
          </h2>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-base leading-relaxed text-navy/80">
              You work directly with experienced accountants and advisers. No
              departments to be passed between, no support queue: a small,
              consistent team that knows the history behind every number.{" "}
              <a
                href="#contact"
                className="group inline-flex items-center gap-1.5 font-medium whitespace-nowrap text-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
              >
                Book a consultation
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </p>
          </div>
        </motion.div>

        <div ref={stage}>
          {/* Desktop: the circles */}
          <motion.div
            variants={stageIn}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-15%" }}
            onMouseLeave={cancel}
            style={{ height: u(HEIGHT) }}
            className="relative mt-12 hidden [--u:clamp(0.82rem,1.3vw,1.05rem)] lg:block"
          >
            <motion.div
              variants={rise}
              style={{ left: u(BIG_LEFT), top: u(BIG_TOP), width: u(BIG), height: u(BIG) }}
              className="absolute rounded-full shadow-[0_50px_90px_-50px_color-mix(in_srgb,var(--ink)_70%,transparent)]"
            >
              <Plate active={active} playing={playing && desktop} reduce={reduce} />
            </motion.div>

            <motion.div
              variants={slide}
              style={{ left: u(DISC.x - SMALL / 2), top: u(DISC.y - SMALL / 2), width: u(SMALL), height: u(SMALL) }}
              className="absolute flex items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(155deg,var(--navy)_0%,var(--ink)_85%)] text-white shadow-[0_40px_70px_-30px_color-mix(in_srgb,var(--ink)_75%,transparent)] ring-4 ring-paper"
            >
              <Disc active={active} live={inView && desktop} reduce={reduce} />
            </motion.div>

            {reasons.map((r, i) => {
              const on = i === active;
              const p = NODES[i];
              return (
                <div key={r.title}>
                  <motion.span
                    aria-hidden
                    variants={pop}
                    style={{ left: u(p.x), top: u(p.y), width: u(NODE), height: u(NODE) }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    onMouseEnter={() => hover(i)}
                  >
                    <Node r={r} on={on} className="h-full w-full" />
                  </motion.span>
                  <motion.span
                    aria-hidden
                    variants={drawX}
                    style={{ left: u(p.x + LEAD_FROM), top: u(p.y), width: u(LEAD_TO - LEAD_FROM) }}
                    className={`absolute h-px origin-left transition-colors duration-500 ${on ? "bg-royal" : "bg-navy/20"}`}
                  />
                  <motion.button
                    type="button"
                    variants={fade}
                    aria-pressed={on}
                    onMouseEnter={() => hover(i)}
                    onFocus={() => pick(i)}
                    onClick={() => pick(i)}
                    style={{ left: u(p.x + LABEL_AT), top: u(p.y) }}
                    className="group absolute right-0 block max-w-[34rem] -translate-y-1/2 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className={`font-mono text-[11px] tracking-[0.14em] transition-colors duration-500 ${on ? "text-royal" : "text-navy/45"}`}>
                        {num(i)}
                      </span>
                      <span
                        className={`font-display text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.1] tracking-tight transition-colors duration-500 ${
                          on ? "text-ink" : "text-navy/55 group-hover:text-navy/85"
                        }`}
                      >
                        {r.title}
                      </span>
                    </span>
                    <span
                      className={`mt-1 block pl-[2.1rem] text-[13px] leading-[1.35] transition-colors duration-500 xl:text-sm ${on ? "text-navy/90" : "text-navy/55"}`}
                    >
                      {r.body}
                    </span>
                  </motion.button>
                </div>
              );
            })}
          </motion.div>

          {/* Below desktop: the photograph with its disc, then the six as a list */}
          <div className="mt-10 lg:hidden">
            <div className="relative mx-auto aspect-square w-[min(100%,20rem)]">
              <Plate active={active} playing={playing && !desktop} reduce={reduce} compact />
              <div className="absolute -top-2 -left-2 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(155deg,var(--navy)_0%,var(--ink)_85%)] text-white ring-4 ring-paper">
                <Disc active={active} live={inView && !desktop} reduce={reduce} bare />
              </div>
            </div>

            <ol className="mt-9 border-t border-navy/15">
              {reasons.map((r, i) => {
                const on = i === active;
                return (
                  <li key={r.title} className="border-b border-navy/15">
                    <button
                      type="button"
                      aria-expanded={on}
                      onClick={() => pick(i)}
                      className="flex w-full items-start gap-4 py-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
                    >
                      <Node r={r} on={on} className="h-11 w-11 shrink-0" />
                      <span className="min-w-0 flex-1 pt-1">
                        <span className="flex items-baseline gap-3">
                          <span className={`font-mono text-[11px] tracking-[0.14em] ${on ? "text-royal" : "text-navy/45"}`}>{num(i)}</span>
                          <span className={`font-display text-[1.4rem] leading-[1.1] tracking-tight transition-colors duration-500 ${on ? "text-ink" : "text-navy/60"}`}>
                            {r.title}
                          </span>
                        </span>
                        <span
                          className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${
                            on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <span className="overflow-hidden">
                            <span className="block pt-2 text-[15px] leading-relaxed text-navy/80">{r.body}</span>
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
