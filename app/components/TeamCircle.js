"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import LineIcon from "./LineIcons";

const ease = [0.22, 1, 0.36, 1];

// The specialisms a client works with. Describes responsibilities only: no
// names, credentials or tenure until the firm supplies real team details.
const roles = [
  {
    icon: "contact",
    role: "Client accountant",
    focus: "Your day-to-day contact",
    body: "Owns your books, deadlines and questions. The person who knows your business best.",
  },
  {
    icon: "review",
    role: "Tax specialist",
    focus: "Corporate & personal tax",
    body: "Prepares returns, reviews reliefs and plans ahead of year end, not after it.",
  },
  {
    icon: "payday",
    role: "Payroll specialist",
    focus: "Payroll & pensions",
    body: "Runs each pay cycle, RTI submissions and auto-enrolment, on the same date every month.",
  },
  {
    icon: "direction",
    role: "Advisory partner",
    focus: "Growth & decisions",
    body: "Joins when the questions get bigger: funding, structure, expansion and change.",
  },
];

const num = (i) => String(i + 1).padStart(2, "0");

// Desktop geometry, in units of --u (a length that scales with the viewport,
// set on the stage). A navy disc overlaps the left edge of a large pale
// circle; the four roles sit as nodes on the circle's right-hand arc, each
// with a leader out to its label.
const u = (n) => `calc(var(--u) * ${n})`;
const BIG = 34; // diameter of the pale circle
const BIG_LEFT = 7;
const SMALL = 14; // diameter of the navy disc
const NODE = 4.8;
const CX = BIG_LEFT + BIG / 2;
const CY = BIG / 2;
const NODES = [-48, -16, 16, 48].map((deg) => {
  const t = (deg * Math.PI) / 180;
  return { x: CX + (BIG / 2) * Math.cos(t), y: CY + (BIG / 2) * Math.sin(t) };
});
// Leader and label offsets from a node's centre
const LEAD_FROM = NODE / 2 + 0.5;
const LEAD_TO = 5.4;
const LABEL_AT = 6.2;

const stageIn = { show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const rise = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.1, ease } },
};
const pop = {
  hidden: { opacity: 0, scale: 0.4 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease } },
};
const drawX = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.7, ease } },
};
const fade = {
  hidden: { opacity: 0, x: 12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
};

// The round badge that carries a role's icon, on the arc or in the list
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

function RoleCopy({ r, i, on }) {
  return (
    <>
      <span className="flex items-baseline gap-3">
        <span className={`font-mono text-[11px] tracking-[0.14em] transition-colors duration-500 ${on ? "text-royal" : "text-navy/45"}`}>
          {num(i)}
        </span>
        <span className="font-display text-[clamp(1.35rem,1.7vw,1.6rem)] leading-[1.1] tracking-tight text-ink">{r.role}</span>
      </span>
      <span className="mt-1.5 block font-mono text-[10px] tracking-[0.16em] text-royal uppercase">{r.focus}</span>
      <span className="mt-2 block text-sm leading-relaxed text-navy/80">{r.body}</span>
    </>
  );
}

// Why choose us, continued: the team around a client's account. A navy disc
// states the point, the pale circle beside it explains it, and the four
// specialisms sit on its arc. Pointing at or focusing a role brings it into
// the circle; leaving returns the circle to its opening words.
export default function TeamCircle() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(null);
  const current = active === null ? null : roles[active];

  return (
    <section aria-labelledby="team-title" className="relative bg-paper text-ink">
      <div className="mx-auto max-w-[88rem] px-5 pb-12 sm:px-8 lg:px-12 lg:pb-20">
        <div className="flex items-center justify-between border-t border-navy/10 pt-5 font-mono text-[10px] tracking-[0.2em] text-navy/60 uppercase">
          <span>Why choose us — The team</span>
          <span className="hidden sm:inline">Four specialisms, one account</span>
        </div>
        {/* The visible heading lives inside the circle and gives way to the
            role in focus, so the section is named from here */}
        <h2 id="team-title" className="sr-only">
          The team around your account
        </h2>

        {/* Desktop: the circles */}
        <motion.div
          variants={stageIn}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-15%" }}
          onMouseLeave={() => setActive(null)}
          style={{ height: u(BIG), width: `min(100%, calc(var(--u) * ${NODES[1].x + LABEL_AT} + 21rem))` }}
          className="relative mx-auto mt-14 hidden [--u:clamp(0.85rem,1.37vw,1.05rem)] lg:block"
        >
          {/* The pale circle, with a slow dashed orbit just outside it */}
          <motion.div
            variants={rise}
            style={{ left: u(BIG_LEFT), width: u(BIG), height: u(BIG) }}
            className="absolute top-0 rounded-full border border-navy/10 bg-[radial-gradient(circle_at_30%_25%,white,var(--sky)_70%)] shadow-[0_50px_90px_-60px_color-mix(in_srgb,var(--ink)_55%,transparent)]"
          >
            <motion.span
              aria-hidden
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 90, ease: "linear", repeat: Infinity }}
              className="absolute -inset-[3.5%] rounded-full border border-dashed border-navy/15"
            />

            {/* What the circle says: its opening words, or the role in focus */}
            <div
              style={{ left: u(SMALL - BIG_LEFT + 2), right: u(5.5) }}
              className="absolute inset-y-0 flex flex-col justify-center"
            >
              <AnimatePresence mode="wait" initial={false}>
                {current ? (
                  <motion.div
                    key={current.role}
                    aria-hidden
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <LineIcon name={current.icon} className="h-16 w-16" />
                    <p className="mt-5 font-mono text-[10px] tracking-[0.18em] text-navy/60 uppercase tabular-nums">
                      <span className="text-royal">{num(active)}</span> / {num(roles.length - 1)} · {current.focus}
                    </p>
                    <p className="mt-2 font-display text-[clamp(1.9rem,2.6vw,2.5rem)] leading-[1.04] tracking-[-0.015em]">
                      {current.role}
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-navy/80">{current.body}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="intro"
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <p className="font-display text-[clamp(1.7rem,2.3vw,2.2rem)] leading-[1.06] tracking-[-0.015em]">
                      The same people, <em className="text-royal">every time.</em>
                    </p>
                    <p className="mt-4 text-[15px] leading-relaxed text-navy/80">
                      Four specialisms work on your account as one team. Each
                      knows what the others are doing, so nothing falls between
                      your books, your tax and your payroll.
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-navy/80">
                      You deal with your client accountant; the others join as
                      your business needs them.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* The navy disc */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -40 },
              show: { opacity: 1, x: 0, transition: { duration: 1.1, ease } },
            }}
            style={{ top: u((BIG - SMALL) / 2), width: u(SMALL), height: u(SMALL) }}
            className="absolute left-0 flex flex-col items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(155deg,var(--navy)_0%,var(--ink)_85%)] text-center text-white shadow-[0_40px_70px_-30px_color-mix(in_srgb,var(--ink)_75%,transparent)]"
          >
            <span aria-hidden className="pointer-events-none absolute -top-1/4 right-[-25%] h-[90%] w-[85%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--royal)_60%,transparent),transparent)]" />
            <span className="relative font-mono text-[9.5px] tracking-[0.2em] text-glint uppercase">Why choose us</span>
            <span className="relative mt-3 font-display text-[clamp(1.45rem,2vw,1.85rem)] leading-[1.05] tracking-tight">
              One team,
              <br />
              around your
              <br />
              <em className="text-glint-soft">business.</em>
            </span>
          </motion.div>

          {/* The four roles, on the arc */}
          {roles.map((r, i) => {
            const on = i === active;
            const p = NODES[i];
            return (
              <div key={r.role}>
                <motion.span
                  aria-hidden
                  variants={pop}
                  style={{ left: u(p.x), top: u(p.y), width: u(NODE), height: u(NODE) }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  onMouseEnter={() => setActive(i)}
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
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(i)}
                  style={{ left: u(p.x + LABEL_AT), top: u(p.y) }}
                  className="absolute right-0 block max-w-[20rem] -translate-y-1/2 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
                >
                  <RoleCopy r={r} i={i} on={on} />
                </motion.button>
              </div>
            );
          })}
        </motion.div>

        {/* Below desktop: the disc as a heading, then the four down a rail */}
        <div className="mt-10 lg:hidden">
          <div className="flex items-center gap-5">
            <div className="relative grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full bg-[linear-gradient(155deg,var(--navy)_0%,var(--ink)_85%)] text-center text-white">
              <span aria-hidden className="pointer-events-none absolute -top-1/4 right-[-25%] h-[90%] w-[85%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--royal)_60%,transparent),transparent)]" />
              <span className="relative font-display text-lg leading-[1.05]">
                One team,
                <br />
                <em className="text-glint-soft">one account.</em>
              </span>
            </div>
            <p className="font-display text-[clamp(1.7rem,6vw,2.2rem)] leading-[1.06] tracking-[-0.015em]">
              The same people, <em className="text-royal">every time.</em>
            </p>
          </div>
          <p className="mt-6 max-w-md text-base leading-relaxed text-navy/80">
            Four specialisms work on your account as one team. You deal with
            your client accountant; the others join as your business needs
            them.
          </p>

          <ol className="relative mt-8 space-y-7 before:absolute before:top-2 before:bottom-2 before:left-6 before:w-px before:bg-navy/15">
            {roles.map((r, i) => (
              <motion.li
                key={r.role}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.8, ease, delay: i * 0.06 }}
                className="relative flex items-start gap-5"
              >
                <Node r={r} on={false} className="h-12 w-12 shrink-0" />
                <div className="min-w-0 flex-1 pt-0.5">
                  <RoleCopy r={r} i={i} on={false} />
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
