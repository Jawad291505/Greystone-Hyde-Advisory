"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Link from "./ThemeLink";
import { FAQ_GROUPS, FAQS } from "../lib/faqs";

const num = (i) => String(i + 1).padStart(2, "0");

// The page's entrance is CSS (data-intro): each block rises as the
// preloader's curtain lifts, without waiting for this script.
const rise = (delay) => ({ "data-intro": "", style: { "--d": `${delay}s`, "--rise": "20px" } });

// Questions the search box "types" to itself while it is empty and unfocused
const HINTS = ["How do I switch accountants?", "How are your fees set?", "Who will I deal with?", "Which software do you use?"];

// The self-typing hint. Its own component, so the timer re-renders these few
// characters and nothing else on the page.
function TypedHint({ paused }) {
  const reduce = useReducedMotion();
  const [text, setText] = useState("");

  useEffect(() => {
    if (reduce || paused) return;
    let hint = 0;
    let at = 0;
    let dir = 1;
    let id;
    const tick = () => {
      const full = HINTS[hint];
      at += dir;
      setText(full.slice(0, at));
      let wait = dir > 0 ? 55 : 24;
      if (dir > 0 && at === full.length) {
        dir = -1;
        wait = 1800;
      } else if (dir < 0 && at === 0) {
        dir = 1;
        hint = (hint + 1) % HINTS.length;
        wait = 450;
      }
      id = setTimeout(tick, wait);
    };
    id = setTimeout(tick, 900);
    return () => clearTimeout(id);
  }, [reduce, paused]);

  if (paused) return null;
  return (
    <span aria-hidden className="pointer-events-none absolute inset-y-0 left-14 flex items-center text-[17px] text-navy/45">
      {reduce ? "Search the questions" : text}
      {!reduce && <span className="ml-0.5 h-5 w-px animate-pulse bg-royal" />}
    </span>
  );
}

// The FAQ page as one hero: on the left, the invitation, a search box that
// types example questions to itself, and the subject filters; on the right,
// a navy answer sheet where each question opens in place. Searching and
// filtering narrow the sheet as you type. Answers open with a CSS grid
// transition, so nothing here animates on the main thread except the hint.
export default function FaqDesk() {
  const uid = useId();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [group, setGroup] = useState("all");
  const [open, setOpen] = useState(0);

  const shown = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return FAQS.map((f, i) => ({ ...f, i })).filter(
      (f) => (group === "all" || f.group === group) && words.every((w) => `${f.q} ${f.a}`.toLowerCase().includes(w)),
    );
  }, [query, group]);

  const count = (id) => (id === "all" ? FAQS.length : FAQS.filter((f) => f.group === id).length);
  const groupName = Object.fromEntries(FAQ_GROUPS.map((g) => [g.id, g.name]));

  return (
    <section aria-labelledby="faq-title" className="relative overflow-x-clip bg-paper bg-[radial-gradient(60%_50%_at_15%_25%,var(--sky),transparent_72%)] text-ink">
      {/* An oversized question mark, drifting very slowly behind the copy (CSS only) */}
      <span
        aria-hidden
        className="faq-float pointer-events-none absolute top-[6rem] left-[-3rem] font-display text-[clamp(22rem,44vw,40rem)] leading-none text-navy/[0.04] select-none lg:left-[18%]"
      >
        ?
      </span>

      <div className="relative mx-auto grid max-w-[88rem] gap-12 px-5 pt-32 pb-16 sm:px-8 sm:pt-36 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pt-44 lg:pb-24">
        {/* Stays beside the sheet while it scrolls, on screens tall enough to hold it */}
        <div className="lg:col-span-5 lg:self-start lg:[@media(min-height:800px)]:sticky lg:[@media(min-height:800px)]:top-24">
          <p {...rise(0)} className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-navy/70 uppercase">
            <span className="h-px w-8 bg-royal" />
            Frequently asked questions
          </p>

          <h1
            {...rise(0.1)}
            id="faq-title"
            className="mt-7 font-editorial text-[clamp(3.4rem,7.4vw,6.8rem)] leading-[0.92] font-[350] tracking-[-0.035em] [font-variation-settings:'opsz'_72]"
          >
            Ask us
            <br />
            <em className="text-royal">anything.</em>
          </h1>

          <p {...rise(0.2)} className="mt-7 max-w-md text-[17px] leading-[1.65] text-navy/85 sm:text-lg">
            Plain answers to the questions owners and finance teams ask us most,
            before they start and once they have.
          </p>

          {/* Search */}
          <div {...rise(0.3)} className="relative mt-9 max-w-md">
            <label htmlFor={`${uid}-search`} className="sr-only">
              Search the questions
            </label>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-royal">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M13.5 13.5L17.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              id={`${uid}-search`}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(-1);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoComplete="off"
              className="h-16 w-full rounded-full border border-navy/15 bg-white pr-6 pl-14 text-[17px] text-ink shadow-[0_24px_50px_-30px_color-mix(in_srgb,var(--ink)_45%,transparent)] transition-[border-color,box-shadow] duration-300 outline-none focus:border-royal focus:shadow-[0_24px_50px_-26px_color-mix(in_srgb,var(--royal)_55%,transparent)] [&::-webkit-search-cancel-button]:hidden"
            />
            <TypedHint paused={focused || query !== ""} />
          </div>

          {/* Subject filters */}
          <div {...rise(0.4)} className="mt-6 flex max-w-md flex-wrap gap-2" role="group" aria-label="Filter by subject">
            {[{ id: "all", name: "All" }, ...FAQ_GROUPS].map((g) => {
              const on = g.id === group;
              return (
                <button
                  key={g.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setGroup(g.id);
                    setOpen(-1);
                  }}
                  className={`flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[13px] tracking-wide transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal ${
                    on ? "border-navy bg-navy text-white" : "border-navy/15 bg-white/60 text-navy/80 hover:border-royal/50 hover:text-royal"
                  }`}
                >
                  {g.name}
                  <span className={`font-mono text-[10px] ${on ? "text-white/60" : "text-navy/45"}`}>{num(count(g.id) - 1)}</span>
                </button>
              );
            })}
          </div>

          <p {...rise(0.5)} className="mt-9 flex items-center gap-3 text-sm text-navy/75">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-royal" />
            Can&apos;t see yours?
            <Link
              href="/#contact"
              className="font-medium text-royal underline decoration-royal/30 underline-offset-4 transition-colors hover:decoration-royal"
            >
              Ask us directly
            </Link>
          </p>
        </div>

        {/* The answer sheet */}
        <div
          {...rise(0.25)}
          className="relative overflow-hidden rounded-panel bg-[linear-gradient(160deg,var(--navy)_0%,var(--ink)_80%)] text-white shadow-[0_60px_100px_-60px_color-mix(in_srgb,var(--ink)_80%,transparent)] lg:col-span-7"
        >
          <div aria-hidden className="pointer-events-none absolute -top-1/4 right-[-15%] h-[70%] w-[70%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--royal)_55%,transparent),transparent)]" />

          <div className="relative p-6 sm:p-9 lg:p-11">
            <p aria-live="polite" className="flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-glint" />
                {group === "all" ? "All questions" : groupName[group]}
              </span>
              <span className="tabular-nums">
                {num(shown.length - 1)} of {num(FAQS.length - 1)}
              </span>
            </p>

            {shown.length > 0 ? (
              <ol className="mt-6 border-t border-white/10">
                {shown.map((f) => {
                  const on = f.i === open;
                  return (
                    <li key={f.q} className="relative border-b border-white/10">
                      {/* Rule that draws under the question in focus */}
                      <span
                        aria-hidden
                        className={`absolute bottom-[-1px] left-0 h-px w-full origin-left bg-glint transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "scale-x-100" : "scale-x-0"}`}
                      />
                      <h2>
                        <button
                          type="button"
                          aria-expanded={on}
                          aria-controls={`${uid}-a-${f.i}`}
                          onClick={() => setOpen(on ? -1 : f.i)}
                          className="group flex w-full items-start gap-4 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glint sm:gap-6"
                        >
                          <span className={`mt-1.5 w-9 shrink-0 font-mono text-[11px] tracking-[0.12em] transition-colors duration-500 ${on ? "text-glint" : "text-white/40"}`}>
                            Q.{num(f.i)}
                          </span>
                          <span
                            className={`flex-1 font-display text-[clamp(1.3rem,1.9vw,1.7rem)] leading-[1.15] tracking-tight transition-colors duration-500 ${
                              on ? "text-white" : "text-white/75 group-hover:text-white"
                            }`}
                          >
                            {f.q}
                          </span>
                          <span
                            aria-hidden
                            className={`relative mt-2 h-3.5 w-3.5 shrink-0 transition-transform duration-500 ${on ? "rotate-45" : ""}`}
                          >
                            <span className="absolute top-1/2 left-0 h-px w-3.5 bg-glint" />
                            <span className="absolute top-0 left-1/2 h-3.5 w-px bg-glint" />
                          </span>
                        </button>
                      </h2>
                      <div
                        id={`${uid}-a-${f.i}`}
                        inert={!on}
                        className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${
                          on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="pb-7 pl-[3.25rem] sm:pl-[3.75rem]">
                            <p className="max-w-xl text-[17px] leading-[1.7] text-white/85">{f.a}</p>
                            <p className="mt-4 font-mono text-[10px] tracking-[0.18em] text-glint/90 uppercase">{groupName[f.group]}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="mt-6 border-t border-white/10 py-14 text-center">
                <p className="font-display text-[clamp(1.7rem,2.6vw,2.2rem)] leading-tight tracking-tight">We haven&apos;t written that one down yet.</p>
                <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-white/75">
                  Send it to us and a qualified accountant will reply within one working day.
                </p>
                <Link
                  href="/#contact"
                  className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-glint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-glint"
                >
                  Ask us directly
                  <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
